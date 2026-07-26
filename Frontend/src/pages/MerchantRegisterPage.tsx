import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredSession } from "../features/auth/auth.session";
import { registerMerchant } from "../features/merchant/merchant.api";
import { ToastModal } from "../components/ToastModal";

export function MerchantRegisterPage() {
  const navigate = useNavigate();
  const session = getStoredSession();

  const [formData, setFormData] = useState({
    business_name: "",
    address: "",
    phone: session?.user?.phone || "",
    email: session?.user?.email || "",
    business_type: "",
    license_number: "",
  });

  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [ktpBase64, setKtpBase64] = useState<string>("");
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorModal("File KTP harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorModal("Ukuran file KTP maksimal 10MB.");
      return;
    }

    setErrorModal(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setKtpPreview(result);
      setKtpBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorModal(null);

    if (!session) {
      setErrorModal("Anda harus Login terlebih dahulu untuk mendaftar Mitra.");
      return;
    }

    if (!formData.business_name.trim()) {
      setErrorModal("Nama Usaha wajib diisi.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorModal("Alamat Lengkap Usaha wajib diisi.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorModal("Nomor Telpon Usaha wajib diisi.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorModal("Email Bisnis wajib diisi.");
      return;
    }
    if (!formData.business_type) {
      setErrorModal("Pilih Jenis Badan Usaha.");
      return;
    }
    if (!formData.license_number.trim()) {
      setErrorModal("Nomor Izin Usaha wajib diisi.");
      return;
    }

    if (!ktpBase64) {
      setErrorModal("Foto KTP wajib diunggah untuk verifikasi merchant.");
      return;
    }

    try {
      setLoading(true);
      await registerMerchant({
        business_name: formData.business_name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        business_type: formData.business_type,
        license_number: formData.license_number,
        fotoKtp: ktpBase64,
      });

      navigate("/merchant/waiting");
    } catch (err: any) {
      setErrorModal(err?.message || "Gagal menyimpan pendaftaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merchant-page-wrapper">
      <ToastModal
        isOpen={Boolean(errorModal)}
        type="error"
        title="Pendaftaran Gagal"
        message={errorModal || ""}
        onClose={() => setErrorModal(null)}
      />

      <div className="merchant-card merchant-card--md">
        <h2 className="merchant-card__title text-primary-blue">
          Mendaftar Sebagai Mitra
        </h2>

        {!session && (
          <div className="merchant-alert merchant-alert--warning" role="alert">
            <span>
              Anda harus{" "}
              <Link to="/login" style={{ fontWeight: 600, textDecoration: "underline" }}>
                Login
              </Link>{" "}
              terlebih dahulu untuk mendaftar Mitra.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="merchant-form">
          <div className="field">
            <label htmlFor="business_name">Nama Usaha *</label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              placeholder="Contoh: Anwar Servis"
              required
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="address">Alamat Lengkap Usaha *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Contoh: Jl. Jend. Sudirman No. 10"
              required
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Nomor Telpon Usaha *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contoh: 0812xxxxxxxx"
              required
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email Bisnis *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Contoh: business@example.com"
              required
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="business_type">Jenis Badan Usaha *</label>
            <select
              id="business_type"
              name="business_type"
              value={formData.business_type}
              onChange={handleInputChange}
              required
              className="field__input"
            >
              <option value="">Pilih Jenis Badan Usaha</option>
              <option value="PT">PT (Perseroan Terbatas)</option>
              <option value="CV">CV (Commanditaire Vennootschap)</option>
              <option value="Perorangan">Usaha Perorangan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="license_number">Nomor Izin Usaha *</label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              placeholder="Contoh: NIB1234567890"
              required
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="fotoKtp">
              Foto KTP Pemilik <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
            </label>
            <p className="field__hint">
              Unggah foto KTP asli pemilik usaha secara jelas untuk kebutuhan verifikasi keamanan.
            </p>

            <input
              type="file"
              id="fotoKtp"
              name="fotoKtp"
              accept="image/*"
              onChange={handleKtpChange}
              required
              className="field__file-input"
            />

            {ktpPreview && (
              <div className="merchant-ktp-preview">
                <p className="merchant-ktp-preview__label">Preview Foto KTP:</p>
                <img
                  src={ktpPreview}
                  alt="KTP Preview"
                  className="merchant-ktp-preview__img"
                />
              </div>
            )}
          </div>

          <div className="merchant-form-action">
            <button
              type="submit"
              disabled={loading || !session}
              className="button button--purple button--block"
            >
              {loading ? "Memproses Pendaftaran..." : "Lanjut & Daftar Mitra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
