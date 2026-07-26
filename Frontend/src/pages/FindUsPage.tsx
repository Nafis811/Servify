import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { listNearbyMerchants } from "../features/merchant/merchant.api";
import type { NearbyMerchant } from "../features/merchant/merchant.types";
import "../styles/merchant.css";

// Perbaikan icon default Leaflet — tanpa ini, marker sering muncul
// sebagai kotak biru rusak karena path asset-nya gak ke-resolve otomatis di Vite.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const JAKARTA_CENTER: [number, number] = [-6.2088, 106.8456];

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function FindUsPage() {
  const [userLocation, setUserLocation] = useState<[number, number]>(JAKARTA_CENTER);
  const [merchants, setMerchants] = useState<NearbyMerchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function loadMerchants(lat: number, lng: number) {
    setIsLoading(true);
    listNearbyMerchants(lat, lng, 50)
      .then(setMerchants)
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      loadMerchants(JAKARTA_CENTER[0], JAKARTA_CENTER[1]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        loadMerchants(coords[0], coords[1]);
      },
      () => {
        // Kalau user tolak izin lokasi, tetap tampilkan toko di sekitar Jakarta (default)
        loadMerchants(JAKARTA_CENTER[0], JAKARTA_CENTER[1]);
      }
    );
  }, []);

  return (
    <div className="page-container findus-page">
      <div className="merchant-header">
        <h1 className="merchant-title">Temukan Lokasi Kami</h1>
      </div>

      {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

      <div className="findus-layout">
        <div className="findus-map-wrap">
          <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
            <RecenterMap center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={userLocation} icon={defaultIcon}>
              <Popup>Lokasi kamu</Popup>
            </Marker>

            {merchants.map((merchant) => (
              <Marker
                key={merchant.id}
                position={[merchant.latitude, merchant.longitude]}
                icon={defaultIcon}
                eventHandlers={{ click: () => setSelectedId(merchant.id) }}
              >
                <Popup>
                  <strong>{merchant.namaToko}</strong>
                  <br />
                  {merchant.alamat}
                  <br />
                  {merchant.jarakKm.toFixed(1)} km dari kamu
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="findus-list">
          {isLoading ? (
            <p>Mencari toko servis terdekat...</p>
          ) : merchants.length === 0 ? (
            <div className="merchant-empty">
              <p>Belum ada toko servis terverifikasi di sekitar lokasimu.</p>
            </div>
          ) : (
            merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="findus-card"
                onClick={() => setSelectedId(merchant.id)}
                style={{
                  outline: selectedId === merchant.id ? "2px solid var(--primary-blue)" : "none",
                }}
              >
                <div className="findus-card__info">
                  <h3>{merchant.namaToko}</h3>
                  <p>{merchant.alamat}</p>
                  <p>{merchant.noHp}</p>
                </div>
                <span className="findus-card__distance">{merchant.jarakKm.toFixed(1)} km</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}