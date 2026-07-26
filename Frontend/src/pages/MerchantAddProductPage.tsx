import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { createMerchantProduct } from "../features/merchant/merchant.api";
import { getMitraId } from "../features/merchant/merchant.session";
import "../styles/merchant.css";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  variant: string;
  location: string;
  imageUrl: string;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  variant: "",
  location: "",
  imageUrl: "",
};

export function MerchantAddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("File harus berupa gambar (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran file gambar maksimal 10MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, imageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const mitraId = getMitraId();
    if (!mitraId) {
      setErrorMessage("Kamu belum login sebagai merchant.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createMerchantProduct(mitraId, {
        namaBarang: form.name,
        harga: Number(form.price),
        stok: Number(form.stock),
        deskripsi: form.description || undefined,
        gambarUrl: form.imageUrl || undefined,
      });
      navigate("/merchant/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-container merchant-page">
      <Link to="/merchant/dashboard" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Dashboard
      </Link>

      <div className="form-card">
        <h1 className="form-title">Tambah Produk Baru</h1>

        {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">
              Nama Produk <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="description">
              Deskripsi <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="price">
                Harga (Rp) <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="stock">
                Stok <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="variant">Varian</label>
            <input id="variant" name="variant" value={form.variant} onChange={handleChange} placeholder="cth. 8GB/256GB, Hitam, dsb." />
          </div>

          <div className="field">
            <label htmlFor="location">
              Lokasi Usaha <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="cth. Bandung, Jawa Barat"
              required
            />
          </div>

          {/* Upload Gambar Cloudinary */}
          <div className="field">
            <label>Foto / Gambar Produk (PNG / JPG / WebP via Cloudinary)</label>
            
            {imagePreview ? (
              <div style={{ position: "relative", marginTop: "0.5rem", display: "inline-block" }}>
                <img
                  src={imagePreview}
                  alt="Preview Produk"
                  style={{
                    maxHeight: "180px",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border)",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Hapus Gambar"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  textAlign: "center",
                  background: "var(--bg-subtle)",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  id="productImageFile"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="productImageFile"
                  style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "100%" }}
                >
                  <Upload size={28} style={{ color: "var(--accent)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Klik untuk Unggah Gambar Produk (PNG/JPG)
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    Gambar akan diunggah otomatis ke Cloudinary (Maks 10MB)
                  </span>
                </label>
              </div>
            )}

            <div style={{ marginTop: "0.75rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Atau masukkan URL Gambar langsung:</span>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://..."
                value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }));
                  if (e.target.value.startsWith("http")) {
                    setImagePreview(e.target.value);
                  }
                }}
                style={{ marginTop: "0.25rem" }}
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="button button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan ke Cloudinary..." : "Simpan Produk"}
            </button>
            <Link to="/merchant/dashboard" className="button button--ghost">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}