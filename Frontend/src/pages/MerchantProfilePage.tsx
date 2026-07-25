import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getMerchantProfile, updateMerchantProfile } from "../features/merchant/merchant.api";
import { getMitraId } from "../features/merchant/merchant.session";

interface ProfileFormState {
  namaToko: string;
  alamat: string;
  noHp: string;
  jamOperasional: string;
}

const emptyForm: ProfileFormState = {
  namaToko: "",
  alamat: "",
  noHp: "",
  jamOperasional: "",
};

export function MerchantProfilePage() {
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const mitraId = getMitraId();

  useEffect(() => {
    if (!mitraId) return;

    getMerchantProfile(mitraId)
      .then((mitra) => {
        setForm({
          namaToko: mitra.namaToko,
          alamat: mitra.alamat,
          noHp: mitra.noHp,
          jamOperasional: mitra.jamOperasional ?? "",
        });
      })
      .catch((error: Error) => setErrorMessage(error.message));
  }, [mitraId]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!mitraId) {
      setErrorMessage("Kamu belum login sebagai merchant.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateMerchantProfile(mitraId, form);
      setSuccessMessage("Profil berhasil disimpan!");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-container auth-shell">
      <div className="auth-card auth-card--md">
        <h1 className="auth-card__title">Profil Merchant</h1>

        {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}
        {successMessage && <p className="auth-message auth-message--success">{successMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="namaToko">Nama Toko</label>
            <input
              id="namaToko"
              name="namaToko"
              value={form.namaToko}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="alamat">Alamat</label>
            <input id="alamat" name="alamat" value={form.alamat} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="noHp">No. HP</label>
            <input id="noHp" name="noHp" value={form.noHp} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="jamOperasional">Jam Operasional</label>
            <input
              id="jamOperasional"
              name="jamOperasional"
              value={form.jamOperasional}
              onChange={handleChange}
              placeholder="Senin-Sabtu, 09:00-18:00"
            />
          </div>

          <button type="submit" className="button button--primary" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}