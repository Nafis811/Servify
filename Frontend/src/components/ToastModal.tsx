import React from "react";

export interface ToastModalProps {
  isOpen: boolean;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
  onClose: () => void;
}

export function ToastModal({
  isOpen,
  type,
  title,
  message,
  onClose,
}: ToastModalProps) {
  if (!isOpen || !message) return null;

  const defaultTitle =
    type === "success" ? "Berhasil!" : type === "error" ? "Terjadi Kesalahan" : "Informasi";

  const iconSymbol = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <>
      <div className="toast-overlay" onClick={onClose} />
      <div className="toast-modal" role="dialog" aria-modal="true">
        <div className={`toast-modal__icon toast-modal__icon--${type}`}>
          {iconSymbol}
        </div>
        <h3 className="toast-modal__title">{title || defaultTitle}</h3>
        <p className="toast-modal__message">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`toast-modal__btn toast-modal__btn--${type}`}
        >
          Tutup
        </button>
      </div>
    </>
  );
}
