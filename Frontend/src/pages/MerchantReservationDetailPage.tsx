import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMerchantReservasiDetail } from "../features/merchant/merchant.api";
import { getMitraId } from "../features/merchant/merchant.session";
import type { ReservasiDetail, StatusServis } from "../features/merchant/merchant.types";
import "../styles/merchant.css";

const STATUS_LABEL: Record<StatusServis, string> = {
  PENDING: "Pending",
  DITERIMA: "Diterima",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const STATUS_CLASS: Record<StatusServis, string> = {
  PENDING: "status-badge--pending",
  DITERIMA: "status-badge--diterima",
  DIPROSES: "status-badge--diproses",
  SELESAI: "status-badge--selesai",
  DITOLAK: "status-badge--ditolak",
};

export function MerchantReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mitraId = getMitraId();

  const [reservasi, setReservasi] = useState<ReservasiDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!mitraId || !id) {
      setErrorMessage("Data merchant atau reservasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    getMerchantReservasiDetail(mitraId, id)
      .then(setReservasi)
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }, [mitraId, id]);

  return (
    <div className="page-container merchant-page">
     <Link to="/merchant/reservations" className="back-link">
        ← Kembali ke Reservasi
    </Link>

      <div className="merchant-header" style={{ marginTop: "1rem" }}>
        <h1 className="merchant-title">Detail Reservasi</h1>
      </div>

      {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

      {isLoading ? (
        <p>Memuat detail reservasi...</p>
      ) : reservasi ? (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div className="merchant-table-wrap">
            <div className="merchant-table-header">
              <h2>Informasi Pelanggan</h2>
            </div>
            <table className="detail-info-table">
              <tbody>
                <tr>
                  <th>Nama</th>
                  <td>{reservasi.namaCustomer}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{reservasi.customer?.email ?? "-"}</td>
                </tr>
                <tr>
                  <th>No. Telepon</th>
                  <td>{reservasi.noTelp}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="merchant-table-wrap">
            <div className="merchant-table-header">
              <h2>Detail Layanan</h2>
            </div>
            <table className="detail-info-table">
              <tbody>
                <tr>
                  <th>Model Laptop</th>
                  <td>{reservasi.modelLaptop}</td>
                </tr>
                <tr>
                  <th>Tipe Servis</th>
                  <td>{reservasi.tipeServis}</td>
                </tr>
                <tr>
                  <th>Keluhan</th>
                  <td>{reservasi.deskripsiKeluhan}</td>
                </tr>
                <tr>
                  <th>Tanggal Reservasi</th>
                  <td>{new Date(reservasi.tanggalReservasi).toLocaleDateString("id-ID")}</td>
                </tr>
                <tr>
                  <th>Estimasi Biaya</th>
                  <td>
                    {reservasi.estimasiBiaya
                      ? `Rp ${reservasi.estimasiBiaya.toLocaleString("id-ID")}`
                      : "Belum ditentukan"}
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[reservasi.statusServis]}`}>
                      {STATUS_LABEL[reservasi.statusServis]}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="merchant-table-wrap">
            <div className="merchant-table-header">
              <h2>Riwayat Status</h2>
            </div>
            {reservasi.statusLog.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>Belum ada riwayat perubahan status.</p>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {reservasi.statusLog.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <span className={`status-badge ${STATUS_CLASS[log.statusServis]}`}>
                        {STATUS_LABEL[log.statusServis]}
                      </span>
                      {log.catatan && (
                        <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-dark)" }}>
                          {log.catatan}
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Reservasi tidak ditemukan.</p>
      )}
    </div>
  );
}