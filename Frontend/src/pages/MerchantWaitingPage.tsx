import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredSession } from "../features/auth/auth.session";
import { getMerchantStatusByEmail } from "../features/merchant/merchant.api";
import type { MerchantProfile } from "../features/merchant/merchant.types";

export function MerchantWaitingPage() {
  const session = getStoredSession();
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchant() {
      if (session?.user?.email) {
        try {
          const res = await getMerchantStatusByEmail(session.user.email);
          setMerchant(res);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
    fetchMerchant();
  }, [session?.user?.email]);

  return (
    <div className="merchant-page-wrapper">
      <div className="merchant-card merchant-card--md merchant-card--centered">
        <h1 className="merchant-card__title">
          Pendaftaran Sedang Diproses
        </h1>

        <p className="merchant-card__desc">
          Terima kasih telah mendaftar sebagai Merchant di Servify!<br />
          Akun Anda sedang dalam proses verifikasi oleh tim admin kami.
        </p>

        {loading ? (
          <p className="merchant-card__loading">Memuat detail pendaftaran...</p>
        ) : (
          <div className="merchant-details-box">
            <h3 className="merchant-details-box__title">
              Detail Pendaftaran
            </h3>
            <div className="merchant-details-box__row">
              <strong>Nama Usaha:</strong>{" "}
              {merchant?.namaToko || "Nama Usaha Anda"}
            </div>
            <div className="merchant-details-box__row">
              <strong>Email:</strong>{" "}
              {merchant?.email || session?.user?.email || "-"}
            </div>
            <div className="merchant-details-box__row">
              <strong>Status:</strong>{" "}
              <span className="text-warning">
                {merchant?.statusVerifikasi === "TERVERIFIKASI"
                  ? "✓ Disetujui"
                  : merchant?.statusVerifikasi === "DITOLAK"
                  ? "✗ Ditolak"
                  : "Menunggu Verifikasi"}
              </span>
            </div>
          </div>
        )}

        <p className="merchant-card__note">
          Proses verifikasi biasanya memakan waktu 1-3 hari kerja.<br />
          Anda dapat mengecek kembali halaman ini atau dashboard Anda secara berkala.
        </p>

        <div className="merchant-actions-stack">
          <Link to="/" className="button button--primary button--block">
            Kembali ke Beranda
          </Link>

          {merchant?.statusVerifikasi === "TERVERIFIKASI" && (
            <Link to="/merchant/dashboard" className="button button--purple button--block">
              Buka Dashboard Merchant
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

