import Groq from "groq-sdk";

// Validasi dulu API key ada sebelum bikin client.
// Ini juga yang benerin "merah" di TypeScript: process.env.GROQ_API_KEY
// tipenya `string | undefined`, sementara constructor Groq minta tipe `string`.
// Kalau gak dicek gini, TS akan komplain "Type 'string | undefined' is not assignable to type 'string'".
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error(
    "GROQ_API_KEY tidak ditemukan di .env — cek lagi apakah sudah ditambahkan dan server sudah di-restart"
  );
}

// Singleton client, sama alasannya kayak prisma.ts:
// biar gak bikin instance/connection baru tiap kali dipanggil
export const groq = new Groq({
  apiKey,
});

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";