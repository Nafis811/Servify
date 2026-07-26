import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredSession } from "../features/auth/auth.session";
import { getMerchantStatusByEmail } from "../features/merchant/merchant.api";
import { setMitraId } from "../features/merchant/merchant.session";

export function MerchantInfoPage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const email = session?.user?.email;

    if (!email) {
      // Belum login → tetap tampilkan halaman info (bisa daftar nanti)
      setIsChecking(false);
      return;
    }

    // Cek apakah user sudah punya merchant profile
    getMerchantStatusByEmail(email)
      .then((profile) => {
        if (!profile) {
          // Belum pernah daftar → tampilkan halaman info
          setIsChecking(false);
          return;
        }

        // Simpan mitraId ke session untuk halaman lain
        setMitraId(profile.id);

        if (profile.statusVerifikasi === "TERVERIFIKASI") {
          navigate("/merchant/dashboard", { replace: true });
        } else if (profile.statusVerifikasi === "MENUNGGU") {
          navigate("/merchant/waiting", { replace: true });
        } else {
          // DITOLAK → tetap tampil halaman info agar bisa daftar ulang
          setIsChecking(false);
        }
      })
      .catch(() => {
        // Gagal cek → tampilkan halaman info saja
        setIsChecking(false);
      });
  }, [session?.user?.email, navigate]);

  if (isChecking) {
    return (
      <div className="merchant-page-wrapper">
        <div className="merchant-card merchant-card--lg" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--muted)" }}>Memeriksa status akun mitra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="merchant-page-wrapper">
      <div className="merchant-card merchant-card--lg">
        <h2 className="merchant-card__title text-primary-blue">
          Program Kemitraan Servify
        </h2>

        <div className="merchant-info-grid">
          <div className="merchant-info-content">
            <h3 className="merchant-info-subtitle">
              Kenapa Bergabung Dengan Kami?
            </h3>
            <ul className="merchant-feature-list">
              <li className="merchant-feature-item">
                <span className="merchant-feature-icon">✓</span>
                <p className="merchant-feature-text">
                  Kelola Bisnis Lebih Mudah Dengan Sistem Digital.
                </p>
              </li>
              <li className="merchant-feature-item">
                <span className="merchant-feature-icon">✓</span>
                <p className="merchant-feature-text">
                  Dapatkan Ribuan Pelanggan Baru Setiap Bulan.
                </p>
              </li>
              <li className="merchant-feature-item">
                <span className="merchant-feature-icon">✓</span>
                <p className="merchant-feature-text">
                  Jalin Hubungan dengan Ratusan Mitra Sukses.
                </p>
              </li>
            </ul>
          </div>

          <div className="merchant-info-action">
            <img
              src="https://www.sapx.id/blog/wp-content/uploads/2023/08/Mitra-Bisnis.jpg"
              alt="Join Mitra Servify"
              className="merchant-info-img"
            />

            {session?.user?.email ? (
              <Link
                to="/merchant/register"
                id="merchant-cta-card"
                className="button button--purple button--block merchant-cta-btn"
              >
                Mendaftar Sebagai Mitra
              </Link>
            ) : (
              <Link
                to="/login"
                id="merchant-cta-card"
                className="button button--purple button--block merchant-cta-btn"
              >
                Login untuk Mendaftar
              </Link>
            )}

            <p className="merchant-info-note">
              Daftar sekarang dan mulai tingkatkan bisnis Anda!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
