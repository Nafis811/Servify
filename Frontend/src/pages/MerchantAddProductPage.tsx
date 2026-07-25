import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                Harga <span style={{ color: "var(--danger)" }}>*</span>
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
            <input id="variant" name="variant" value={form.variant} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="location">
              Lokasi <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="imageUrl">URL Gambar</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="button button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
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