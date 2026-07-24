import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/auth.api";
import { storeSession } from "../features/auth/auth.session";
import type { RegisterFormState } from "../features/auth/auth.types";

const initialForm: RegisterFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

type FieldErrors = Partial<Record<keyof RegisterFormState, string>>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{
    kind: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    kind: "idle",
    message: "",
  });

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();

    if (trimmedName.length < 3) {
      nextErrors.name = "Nama minimal 3 karakter.";
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Format email tidak valid.";
    }

    if (trimmedPhone.length < 10 || trimmedPhone.length > 15) {
      nextErrors.phone = "Nomor telpon harus 10 sampai 15 karakter.";
    }

    if (form.password.length < 8) {
      nextErrors.password = "Password minimal 8 karakter.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Password tidak cocok.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus({ kind: "loading", message: "" });

    try {
      const session = await registerUser({
        ...form,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      });

      if (session) {
        storeSession(session);
        navigate("/");
        return;
      }

      setStatus({
        kind: "success",
        message: "Akun berhasil dibuat. Silakan cek email lalu login.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-card auth-card--md">
        <h2 className="auth-card__title">Registrasi Akun</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nama</span>
            <input
              className="field__input"
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
            />
            {fieldErrors.name ? <p className="field__error">{fieldErrors.name}</p> : null}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              className="field__input"
              type="email"
              name="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Contoh: budi@example.com"
              required
            />
            {fieldErrors.email ? <p className="field__error">{fieldErrors.email}</p> : null}
          </label>

          <label className="field">
            <span>Nomor Telpon</span>
            <input
              className="field__input"
              type="text"
              name="phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Contoh: 0812xxxxxxxx"
              required
            />
            {fieldErrors.phone ? <p className="field__error">{fieldErrors.phone}</p> : null}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              className="field__input"
              type="password"
              name="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Minimal 8 karakter"
              required
            />
            {fieldErrors.password ? <p className="field__error">{fieldErrors.password}</p> : null}
          </label>

          <label className="field">
            <span>Ketik Ulang password</span>
            <input
              className="field__input"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              placeholder=""
              required
            />
            {fieldErrors.confirmPassword ? <p className="field__error">{fieldErrors.confirmPassword}</p> : null}
          </label>

          <button className="button button--purple button--block" type="submit" disabled={status.kind === "loading"}>
            Buat Akun
          </button>

          {status.kind === "error" ? <p className="auth-message auth-message--error">{status.message}</p> : null}
          {status.kind === "success" ? <p className="auth-message auth-message--success">{status.message}</p> : null}

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
            Sudah punya akun? <Link to="/login" style={{ color: "var(--primary-blue)", fontWeight: 600 }}>Login di sini</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
