import { useState, useEffect } from "react";
import { merchantApi } from "../api/client";
import { MITRA_ID_SEMENTARA } from "../config/constants";
import type { Mitra } from "../types";

export default function MerchantForm() {
  const [mode, setMode] = useState<"edit" | "register">("edit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    namaToko: "",
    pemilik: "",
    email: "",
    password: "",
    alamat: "",
    noHp: "",
    jenisBadanUsaha: "",
    nomorIzinUsaha: "",
    jamOperasional: "",
  });

  // Waktu pertama buka halaman, coba fetch profil mitra yang udah ada (mode edit)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await merchantApi.getProfile(MITRA_ID_SEMENTARA);
        const mitra: Mitra = res.data.data;
        setForm((prev) => ({
          ...prev,
          namaToko: mitra.namaToko,
          pemilik: mitra.pemilik,
          email: mitra.email,
          alamat: mitra.alamat,
          noHp: mitra.noHp,
          jenisBadanUsaha: mitra.jenisBadanUsaha ?? "",
          nomorIzinUsaha: mitra.nomorIzinUsaha ?? "",
          jamOperasional: mitra.jamOperasional ?? "",
        }));
      } catch (err) {
        // Kalau gagal fetch (misal mitraId belum ada), biarin form kosong buat register baru
        console.error("Gagal fetch profil:", err);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "register") {
        // Register butuh semua field wajib termasuk password
        await merchantApi.updateProfile(MITRA_ID_SEMENTARA, form);
      } else {
        // Edit profil — gak kirim email/password, cuma field yang bisa diubah
        const { namaToko, alamat, noHp, jamOperasional } = form;
        await merchantApi.updateProfile(MITRA_ID_SEMENTARA, {
          namaToko,
          alamat,
          noHp,
          jamOperasional,
        });
      }
      setSuccess("Profil berhasil disimpan!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Profil Merchant</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nama Toko</label>
          <input
            name="namaToko"
            value={form.namaToko}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Alamat</label>
          <input
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>No. HP</label>
          <input
            name="noHp"
            value={form.noHp}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Jam Operasional</label>
          <input
            name="jamOperasional"
            value={form.jamOperasional}
            onChange={handleChange}
            placeholder="Senin-Sabtu, 09:00-18:00"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}
