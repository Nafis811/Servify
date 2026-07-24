import { prisma } from "../lib/prisma";
import { groq, GROQ_MODEL } from "../lib/groq";
import { AppError } from "../middlewares/errorHandler";
import Groq from "groq-sdk";

// Berapa banyak pesan lama yang dikirim ulang ke Groq biar chatbot "inget" percakapan sebelumnya
const HISTORY_LIMIT = 10;

// ---- 1. Definisi "tools" yang boleh dipanggil sama model ----
// Ini semacam daftar menu: kita kasih tau Groq fungsi apa aja yang tersedia,
// nama parameternya apa, tipe datanya apa. Model yang mutusin kapan manggil ini,
// kita cuma nyediain "pilihannya".
const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "cariTokoTerdekat",
      description:
        "Cari toko/mitra servis laptop terverifikasi yang paling dekat dengan lokasi customer saat ini",
      parameters: {
        type: "object",
        properties: {
          latitude: { type: "number", description: "Latitude lokasi customer" },
          longitude: { type: "number", description: "Longitude lokasi customer" },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cekStatusReservasi",
      description: "Cek daftar reservasi servis milik customer beserta statusnya saat ini",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

// ---- 2. Implementasi asli tiap tool (yang nyentuh database) ----
// Rumus Haversine: cara hitung jarak antara 2 titik koordinat di permukaan bumi (dalam km).
// Dipakai di sini karena schema kita cuma nyimpen lat/long polos (Float),
// bukan tipe geography khusus PostGIS yang bisa hitung jarak otomatis di level query.
function hitungJarakKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

async function cariTokoTerdekat(args: { latitude: number; longitude: number }) {
  const mitraList = await prisma.mitraPenyediaJasa.findMany({
    where: {
      statusVerifikasi: "TERVERIFIKASI",
      latitude: { not: null },
      longitude: { not: null },
    },
    select: { id: true, namaToko: true, alamat: true, latitude: true, longitude: true, jamOperasional: true },
  });

  // Hitung jarak tiap mitra dari lokasi customer, urutin dari yang terdekat, ambil 5 teratas
  const terurut = mitraList
    .map((m) => ({
      ...m,
      jarakKm: hitungJarakKm(args.latitude, args.longitude, m.latitude!, m.longitude!),
    }))
    .sort((a, b) => a.jarakKm - b.jarakKm)
    .slice(0, 5);

  return terurut;
}

async function cekStatusReservasi(customerId: string) {
  return prisma.reservasiServis.findMany({
    where: { customerId },
    select: {
      id: true,
      modelLaptop: true,
      tipeServis: true,
      statusServis: true,
      tanggalReservasi: true,
      mitra: { select: { namaToko: true } },
    },
    orderBy: { tanggalReservasi: "desc" },
    take: 5,
  });
}

// ---- 3. System prompt: "kepribadian" & batasan chatbot ----
const SYSTEM_PROMPT = `
Kamu adalah asisten chatbot Servify, platform reservasi servis laptop.
Tugasmu membantu customer mencari toko servis laptop terdekat dan mengecek status reservasi mereka.
Jawab dengan ramah, singkat, dan dalam Bahasa Indonesia.
Jika customer bertanya di luar topik servis laptop/Servify, arahkan mereka kembali ke topik dengan sopan.
Jangan mengarang informasi toko atau status reservasi — selalu gunakan tool yang tersedia untuk data real.
`.trim();

export const chatbotService = {
  async sendMessage(
    customerId: string,
    pesanCustomer: string,
    lokasi?: { latitude: number; longitude: number }
  ) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new AppError("Customer tidak ditemukan", 404);

    // Ambil riwayat chat sebelumnya, urut dari lama ke baru, biar model "inget" konteks obrolan
    const riwayat = await prisma.chatBot.findMany({
      where: { customerId },
      orderBy: { waktuChat: "desc" },
      take: HISTORY_LIMIT,
    });
    riwayat.reverse();

    // Susun format messages yang dimengerti Groq: system prompt -> riwayat lama -> pesan baru
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...riwayat.flatMap((r) => [
        { role: "user" as const, content: r.pesanCustomer },
        { role: "assistant" as const, content: r.balasanChatbot },
      ]),
      // Kalau ada lokasi, kita selipin sebagai info tambahan di pesan user,
      // biar model tau lokasi ini tanpa customer perlu ngetik koordinat manual
      {
        role: "user",
        content: lokasi
          ? `${pesanCustomer}\n\n[Lokasi customer saat ini: latitude ${lokasi.latitude}, longitude ${lokasi.longitude}]`
          : pesanCustomer,
      },
    ];

    // Panggilan pertama ke Groq: model bisa langsung jawab, atau minta manggil tool dulu
    const responsePertama = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      tools,
    });

    const pesanModel = responsePertama.choices[0].message;
    let balasanFinal: string;

    if (pesanModel.tool_calls && pesanModel.tool_calls.length > 0) {
      // Model minta data tambahan -> kita eksekusi tool yang diminta
      messages.push(pesanModel);

      for (const toolCall of pesanModel.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        let hasil;

        if (toolCall.function.name === "cariTokoTerdekat") {
          hasil = await cariTokoTerdekat(args);
        } else if (toolCall.function.name === "cekStatusReservasi") {
          hasil = await cekStatusReservasi(customerId);
        } else {
          hasil = { error: "Tool tidak dikenal" };
        }

        // Hasil query database dikirim balik ke model sebagai "tool" message
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(hasil),
        });
      }

      // Panggilan kedua: model ngerangkum hasil tool jadi jawaban natural buat customer
      const responseKedua = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages,
      });
      balasanFinal = responseKedua.choices[0].message.content ?? "Maaf, ada kendala saat memproses jawaban.";
    } else {
      // Model langsung jawab tanpa perlu tool (misal basa-basi atau FAQ umum)
      balasanFinal = pesanModel.content ?? "Maaf, ada kendala saat memproses jawaban.";
    }

    // Simpan chat ke DB buat riwayat + timeline
    await prisma.chatBot.create({
      data: {
        customerId,
        pesanCustomer,
        balasanChatbot: balasanFinal,
        intent: pesanModel.tool_calls?.[0]?.function.name ?? null,
      },
    });

    return { balasan: balasanFinal };
  },
};