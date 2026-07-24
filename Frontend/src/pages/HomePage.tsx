import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="page-container">
      <div className="main-content space-y-8">
        <section className="card-section">
          <div className="content-left">
            <h1 className="home-title text-primary">
              Laptop Rusak? <br />
              <span className="text-primary">Servify solusinya</span>
            </h1>
            <p className="home-desc">
              Temukan solusi untuk laptop kamu di toko yang menyediakan layanan service laptop di sekitarmu.
            </p>

            <div className="cta-group">
              <Link className="btn-action btn-primary" to="/reservation">
                Reservasi
              </Link>
              <Link className="btn-action btn-outline" to="/marketplace">
                Beli Produk
              </Link>
            </div>

            <div className="feature-list">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <p className="feature-text">
                  Proses cepat <br />
                  <span className="feature-subtext">± 3 Hari Kerja</span>
                </p>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <p className="feature-text">
                  Garansi 180 hari <br />
                  <span className="feature-subtext">Kerusakan kembali</span>
                </p>
              </div>
            </div>
          </div>

          <div className="content-right">
            <img
              src="https://sodagarkomputer.com/wp-content/uploads/2022/11/Service-Laptop-Taman-Harapan-Baru.webp"
              alt="Laptop Repair"
              className="home-img"
            />
          </div>
        </section>

        <section className="card-section">
          <div className="content-left">
            <h2 className="home-title" style={{ fontSize: "2rem" }}>
              <span className="text-primary">Kenapa Bergabung <br /> Dengan Kami?</span>
            </h2>

            <div className="feature-list" style={{ flexDirection: "column", gap: "1rem" }}>
              <div className="feature-item">
                <span className="check-icon" style={{ fontSize: "1.5rem" }}>✓</span>
                <p className="feature-text" style={{ fontSize: "1.1rem" }}>
                  Kelola Bisnis Lebih Mudah Dengan Sistem Digital.
                </p>
              </div>
              <div className="feature-item">
                <span className="check-icon" style={{ fontSize: "1.5rem" }}>✓</span>
                <p className="feature-text" style={{ fontSize: "1.1rem" }}>
                  Dapatkan Ribuan Pelanggan Baru Setiap Bulan.
                </p>
              </div>
              <div className="feature-item">
                <span className="check-icon" style={{ fontSize: "1.5rem" }}>✓</span>
                <p className="feature-text" style={{ fontSize: "1.1rem" }}>
                  Jalin Hubungan dengan Ratusan Mitra Sukses.
                </p>
              </div>
            </div>
          </div>

          <div className="content-right">
            <img
              src="https://img.freepik.com/free-vector/organic-flat-customer-support-illustration_23-2148899174.jpg"
              alt="Merchant Join"
              className="home-img"
              style={{ maxHeight: "300px", width: "auto" }}
            />

            <Link className="btn-action btn-primary" to="/merchant" style={{ marginTop: "2rem", width: "100%" }}>
              Gabung Sekarang
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
