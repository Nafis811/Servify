import { useEffect, useRef, useState, type FormEvent } from "react";
import { sendChatMessage } from "../features/chatbot/chatbot.api";
import { getStoredSession } from "../features/auth/auth.session";
import type { ChatLocation, ChatMessage } from "../features/chatbot/chatbot.types";
import "../styles/merchant.css";

export function ChatbotPage() {
  const session = getStoredSession();
  const customerId = session?.user.role === "customer" ? session.user.id : null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya asisten Servify. Ada yang bisa saya bantu soal servis laptop kamu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<ChatLocation | undefined>(undefined);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // Kalau user tolak izin lokasi, biarkan undefined — chatbot tetap bisa
        // jawab pertanyaan lain, cuma gak bisa cari toko terdekat otomatis.
      }
    );
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pesan = input.trim();
    if (!pesan) return;

    if (!customerId) {
      setErrorMessage("Kamu perlu login sebagai customer untuk menggunakan chatbot.");
      return;
    }

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: pesan };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const result = await sendChatMessage(customerId, pesan, userLocation);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: result.balasan },
      ]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="page-container merchant-page">
      <div className="merchant-header">
        <h1 className="merchant-title">Servify AI Assistant</h1>
      </div>

      {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

      <div className="merchant-table-wrap" style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                background: message.role === "user" ? "var(--primary-blue)" : "var(--soft-blue)",
                color: message.role === "user" ? "#ffffff" : "var(--text-dark)",
                padding: "0.75rem 1rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
            </div>
          ))}
          {isSending && (
            <div
              style={{
                alignSelf: "flex-start",
                color: "var(--muted)",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              Mengetik...
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan anda disini"
            style={{
              flex: 1,
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
            }}
            disabled={isSending}
          />
          <button type="submit" className="button button--primary" disabled={isSending || !input.trim()}>
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}