import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/auth.api";
import { getMerchantStatusByEmail } from "../features/merchant/merchant.api";
import { setMitraId } from "../features/merchant/merchant.session";
import type { LoginFormState } from "../features/auth/auth.types";

const initialForm: LoginFormState = {
  email: "",
  password: "",
};

export function LoginPage() {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const [form, setForm] = useState<LoginFormState>(initialForm);
  const [status, setStatus] = useState<{
    kind: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    kind: "idle",
    message: "",
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateField = (field: keyof LoginFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ kind: "loading", message: "" });

    try {
      const session = await loginUser(form);
      const isAdmin = session?.user?.role === "admin";

      setStatus({
        kind: "success",
        message: isAdmin ? "Login Admin berhasil. Mengalihkan..." : "Login berhasil.",
      });

      timeoutRef.current = window.setTimeout(async () => {
        if (isAdmin) {
          navigate("/admin");
          return;
        }

        // Cek status merchant → redirect ke dashboard/waiting jika sudah daftar
        try {
          const merchantProfile = await getMerchantStatusByEmail(session.user.email);
          if (merchantProfile) {
            setMitraId(merchantProfile.id);
            if (merchantProfile.statusVerifikasi === "TERVERIFIKASI") {
              navigate("/merchant/dashboard");
              return;
            }
            if (merchantProfile.statusVerifikasi === "MENUNGGU") {
              navigate("/merchant/waiting");
              return;
            }
          }
        } catch {
          // Gagal cek merchant → tetap ke home
        }

        navigate("/");
      }, 900);
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-card auth-card--sm">
        <h2 className="auth-card__title">Login Akun</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              className="field__input"
              type="email"
              name="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Email Anda"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              className="field__input"
              type="password"
              name="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Password Anda"
              required
            />
          </label>

          <button className="button button--purple button--block" type="submit" disabled={status.kind === "loading"}>
            Login
          </button>

          {status.kind === "error" ? <p className="auth-message auth-message--error">{status.message}</p> : null}

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
            Belum punya akun? <Link to="/register" style={{ color: "var(--primary-blue)", fontWeight: 600 }}>Daftar sekarang</Link>
          </p>
        </form>
      </section>

      {status.kind === "success" ? (
        <div className="toast toast--success" role="status" aria-live="polite">
          {status.message}
        </div>
      ) : null}

      {status.kind === "error" ? (
        <div className="toast toast--error" role="alert" aria-live="assertive">
          {status.message}
        </div>
      ) : null}
    </div>
  );
}
