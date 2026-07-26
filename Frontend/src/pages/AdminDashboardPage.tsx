import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  Users,
  IdCard,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import {
  approveMerchantAdmin,
  getAllMerchantsAdmin,
  rejectMerchantAdmin,
} from "../features/merchant/merchant.api";
import type { MerchantProfile } from "../features/merchant/merchant.types";

export function AdminDashboardPage() {
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedKtp, setSelectedKtp] = useState<string | null>(null);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      const data = await getAllMerchantsAdmin();
      setMerchants(data);
    } catch (err: any) {
      setAlert({ type: "error", message: err?.message || "Gagal memuat data merchant." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    if (!window.confirm(`Setujui merchant "${name}"?`)) return;
    try {
      await approveMerchantAdmin(id);
      setAlert({ type: "success", message: `Merchant "${name}" berhasil disetujui!` });
      await loadMerchants();
    } catch (err: any) {
      setAlert({ type: "error", message: err?.message || "Gagal menyetujui merchant." });
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!window.confirm(`Tolak merchant "${name}"?`)) return;
    try {
      await rejectMerchantAdmin(id);
      setAlert({ type: "success", message: `Permintaan merchant "${name}" ditolak.` });
      await loadMerchants();
    } catch (err: any) {
      setAlert({ type: "error", message: err?.message || "Gagal menolak merchant." });
    }
  };

  const pendingMerchants = merchants.filter((m) => m.statusVerifikasi === "MENUNGGU");
  const displayedMerchants = activeTab === "pending" ? pendingMerchants : merchants;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <h2 className="admin-sidebar__brand">
            <ShieldCheck size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
            Admin Panel
          </h2>
          <p className="admin-sidebar__sub">Servify Management</p>
        </div>

        <nav className="admin-nav">
          <button
            onClick={() => setActiveTab("pending")}
            className={`admin-nav__btn ${activeTab === "pending" ? "admin-nav__btn--active" : ""}`}
          >
            <span>Verifikasi Merchant</span>
            {pendingMerchants.length > 0 && (
              <span className="admin-nav__badge">
                {pendingMerchants.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`admin-nav__btn ${activeTab === "all" ? "admin-nav__btn--active" : ""}`}
          >
            <span>Semua Merchant</span>
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{merchants.length}</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* Page Header */}
        <div className="admin-header">
          <h1 className="admin-header__title">
            {activeTab === "pending" ? "Verifikasi Merchant" : "Daftar Semua Merchant"}
          </h1>
          <p className="admin-header__desc">
            Kelola dan verifikasi pendaftaran mitra merchant Servify
          </p>
        </div>

        {/* Flash Messages */}
        {alert && (
          <div
            className={`merchant-alert ${
              alert.type === "success" ? "merchant-alert--warning" : "merchant-alert--danger"
            }`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 0,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {alert.type === "success" ? <Check size={16} /> : <X size={16} />}
              {alert.message}
            </span>
            <button
              onClick={() => setAlert(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Tutup
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <p className="admin-stat-card__label">Merchant Pending</p>
              <h3 className="admin-stat-card__val" style={{ color: "#d97706" }}>
                {pendingMerchants.length}
              </h3>
            </div>
            <div className="admin-stat-card__icon" style={{ background: "#fef3c7", color: "#d97706" }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <p className="admin-stat-card__label">Merchant Terverifikasi</p>
              <h3 className="admin-stat-card__val" style={{ color: "#10b981" }}>
                {merchants.filter((m) => m.statusVerifikasi === "TERVERIFIKASI").length}
              </h3>
            </div>
            <div className="admin-stat-card__icon" style={{ background: "#dcfce7", color: "#15803d" }}>
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <p className="admin-stat-card__label">Total Pendaftaran</p>
              <h3 className="admin-stat-card__val" style={{ color: "#3b82f6" }}>
                {merchants.length}
              </h3>
            </div>
            <div className="admin-stat-card__icon" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="admin-table-card">
          <div className="admin-table-card__header">
            <h2>
              {activeTab === "pending"
                ? "Daftar Merchant Menunggu Verifikasi"
                : "Semua Permintaan Merchant"}
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
              Memuat data merchant...
            </div>
          ) : displayedMerchants.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nama Usaha</th>
                    <th>Email</th>
                    <th>Telepon</th>
                    <th>Alamat</th>
                    <th>Jenis Usaha</th>
                    <th>Foto KTP</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMerchants.map((merchant) => (
                    <tr key={merchant.id}>
                      <td style={{ fontWeight: 700, color: "var(--text-dark)" }}>
                        {merchant.namaToko}
                      </td>
                      <td>{merchant.email}</td>
                      <td>{merchant.noHp}</td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {merchant.alamat}
                      </td>
                      <td>{merchant.jenisBadanUsaha || "-"}</td>
                      <td>
                        {merchant.fotoKtpUrl ? (
                          <button
                            onClick={() => setSelectedKtp(merchant.fotoKtpUrl || null)}
                            className="admin-btn admin-btn--ktp"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                          >
                            <IdCard size={14} />
                            Lihat KTP
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Tidak ada KTP</span>
                        )}
                      </td>
                      <td>
                        {merchant.statusVerifikasi === "MENUNGGU" && (
                          <span className="admin-badge admin-badge--warning">
                            Pending
                          </span>
                        )}
                        {merchant.statusVerifikasi === "TERVERIFIKASI" && (
                          <span className="admin-badge admin-badge--success">
                            Disetujui
                          </span>
                        )}
                        {merchant.statusVerifikasi === "DITOLAK" && (
                          <span className="admin-badge admin-badge--danger">
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td>
                        {merchant.statusVerifikasi === "MENUNGGU" ? (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleApprove(merchant.id, merchant.namaToko)}
                              className="admin-btn admin-btn--approve"
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                            >
                              <Check size={14} />
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReject(merchant.id, merchant.namaToko)}
                              className="admin-btn admin-btn--reject"
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                            >
                              <X size={14} />
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              <p>Tidak ada merchant yang menunggu verifikasi saat ini.</p>
            </div>
          )}
        </div>
      </main>

      {/* KTP PHOTO PREVIEW MODAL */}
      {selectedKtp && (
        <>
          <div className="toast-overlay" onClick={() => setSelectedKtp(null)} />
          <div className="toast-modal" style={{ maxWidth: "550px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Foto KTP Merchant (Cloudinary)</h3>
              <button
                onClick={() => setSelectedKtp(null)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "inherit" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: "#0f172a", borderRadius: "0.75rem", padding: "0.5rem", display: "flex", justifyContent: "center" }}>
              <img
                src={selectedKtp}
                alt="Foto KTP"
                style={{ maxHeight: "60vh", objectFit: "contain", borderRadius: "0.5rem" }}
              />
            </div>

            <button
              onClick={() => setSelectedKtp(null)}
              className="button button--purple button--block"
              style={{ marginTop: "1rem" }}
            >
              Tutup
            </button>
          </div>
        </>
      )}
    </div>
  );
}

