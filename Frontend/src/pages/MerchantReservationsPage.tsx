import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, Wrench, CalendarCheck, ArrowRight, RefreshCw } from "lucide-react";
import { listMerchantReservasi, updateReservasiStatus } from "../features/merchant/merchant.api";
import { getMitraId } from "../features/merchant/merchant.session";
import type { ReservasiServis, StatusServis } from "../features/merchant/merchant.types";
import "../styles/merchant.css";

const FILTERS: { label: string; value: StatusServis | "SEMUA" }[] = [
  { label: "Semua", value: "SEMUA" },
  { label: "Pending", value: "PENDING" },
  { label: "Diproses", value: "DIPROSES" },
  { label: "Selesai", value: "SELESAI" },
];

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

export function MerchantReservationsPage() {
  const navigate = useNavigate();
  const mitraId = getMitraId();

  const [reservasiList, setReservasiList] = useState<ReservasiServis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusServis | "SEMUA">("SEMUA");

  const [modalTarget, setModalTarget] = useState<ReservasiServis | null>(null);
  const [modalStatus, setModalStatus] = useState<StatusServis>("PENDING");
  const [modalCatatan, setModalCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadData() {
    if (!mitraId) {
      setErrorMessage("Kamu belum login sebagai merchant.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    listMerchantReservasi(mitraId)
      .then(setReservasiList)
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(loadData, [mitraId]);

  const stats = useMemo(
    () => ({
      pending: reservasiList.filter((r) => r.statusServis === "PENDING").length,
      diproses: reservasiList.filter((r) => r.statusServis === "DIPROSES").length,
      selesai: reservasiList.filter((r) => r.statusServis === "SELESAI").length,
    }),
    [reservasiList]
  );

  const filteredList =
    activeFilter === "SEMUA"
      ? reservasiList
      : reservasiList.filter((r) => r.statusServis === activeFilter);

  function openModal(reservasi: ReservasiServis) {
    setModalTarget(reservasi);
    setModalStatus(reservasi.statusServis);
    setModalCatatan("");
  }

  function closeModal() {
    setModalTarget(null);
  }

  async function handleUpdateStatus() {
    if (!mitraId || !modalTarget) return;

    setIsSubmitting(true);
    try {
      await updateReservasiStatus(mitraId, modalTarget.id, {
        statusServis: modalStatus,
        catatan: modalCatatan || undefined,
      });
      closeModal();
      loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal update status");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-container merchant-page">
      <div className="merchant-header">
        <h1 className="merchant-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CalendarCheck size={24} /> Manajemen Reservasi Service
        </h1>
      </div>

      {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

      <div className="reservation-toolbar">
        <div className="filter-tabs">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${activeFilter === filter.value ? "filter-tab--active" : ""}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-card--warning">
          <div>
            <p className="stat-card__label">Menunggu Dikerjakan</p>
            <p className="stat-card__value stat-card__value--warning">{stats.pending}</p>
          </div>
          <div className="stat-card__icon"><Clock size={24} /></div>
        </div>
        <div className="stat-card">
          <div>
            <p className="stat-card__label">Sedang Dikerjakan</p>
            <p className="stat-card__value">{stats.diproses}</p>
          </div>
          <div className="stat-card__icon"><Wrench size={24} /></div>
        </div>
        <div className="stat-card stat-card--success">
          <div>
            <p className="stat-card__label">Selesai</p>
            <p className="stat-card__value stat-card__value--success">{stats.selesai}</p>
          </div>
          <div className="stat-card__icon"><CheckCircle2 size={24} /></div>
        </div>
      </div>

      <div className="merchant-table-wrap">
        {isLoading ? (
          <p>Memuat data reservasi...</p>
        ) : filteredList.length === 0 ? (
          <div className="merchant-empty">
            <p>Belum ada reservasi.</p>
          </div>
        ) : (
          <table className="merchant-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Model Laptop</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((reservasi) => (
                <tr key={reservasi.id}>
                  <td>
                    <strong>{reservasi.namaCustomer}</strong>
                    <br />
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {reservasi.noTelp}
                    </span>
                  </td>
                  <td>{reservasi.modelLaptop}</td>
                  <td>{new Date(reservasi.tanggalReservasi).toLocaleDateString("id-ID")}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[reservasi.statusServis]}`}>
                      {STATUS_LABEL[reservasi.statusServis]}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table btn-table--primary" onClick={() => openModal(reservasi)} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <RefreshCw size={13} /> Update
                      </button>
                      <button
                        className="btn-table btn-table--secondary"
                        onClick={() => navigate(`/merchant/reservations/${reservasi.id}`)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        Detail <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-card">
            <div className="modal-card__header">
              <h3>Update Status Reservasi</h3>
            </div>
            <div className="modal-card__body">
              <div className="field">
                <label htmlFor="modalStatus">Status Baru</label>
                <select
                  id="modalStatus"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as StatusServis)}
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="modalCatatan">Catatan (Opsional)</label>
                <textarea
                  id="modalCatatan"
                  rows={3}
                  value={modalCatatan}
                  onChange={(e) => setModalCatatan(e.target.value)}
                  placeholder="Contoh: Menunggu spare part"
                />
              </div>

              <div className="modal-card__actions">
                <button
                  className="button button--primary"
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <RefreshCw size={15} /> {isSubmitting ? "Menyimpan..." : "Update"}
                </button>
                <button className="button button--ghost" onClick={closeModal} disabled={isSubmitting} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <XCircle size={15} /> Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}