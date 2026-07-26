import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import type { Mitra, DashboardSummary, Reservasi, StatusServis } from "../types";

// Instance axios terpusat — semua request lewat sini,
// jadi kalau base URL Backend berubah nanti (misal pas deploy), cukup ubah 1 tempat.
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const merchantApi = {
  getProfile: (mitraId: string) =>
    apiClient.get<{ success: boolean; data: Mitra }>(`/merchant/${mitraId}`),

  updateProfile: (mitraId: string, data: Partial<Mitra>) =>
    apiClient.patch<{ success: boolean; data: Mitra }>(`/merchant/${mitraId}`, data),

  getDashboard: (mitraId: string) =>
    apiClient.get<{ success: boolean; data: DashboardSummary }>(`/merchant/${mitraId}/dashboard`),
};

export const reservasiApi = {
  getByMitra: (mitraId: string, status?: StatusServis) =>
    apiClient.get<{ success: boolean; data: Reservasi[] }>(`/merchant/${mitraId}/reservasi`, {
      params: status ? { status } : {},
    }),

  getDetail: (mitraId: string, reservasiId: string) =>
    apiClient.get<{ success: boolean; data: Reservasi }>(
      `/merchant/${mitraId}/reservasi/${reservasiId}`
    ),

  updateStatus: (
    mitraId: string,
    reservasiId: string,
    data: { statusBaru: StatusServis; catatan?: string }
  ) =>
    apiClient.patch<{ success: boolean; data: Reservasi }>(
      `/merchant/${mitraId}/reservasi/${reservasiId}/status`,
      data
    ),
};

export const chatbotApi = {
  sendMessage: (
    customerId: string,
    pesan: string,
    lokasi?: { latitude: number; longitude: number }
  ) =>
    apiClient.post<{ success: boolean; data: { balasan: string } }>(`/chatbot/${customerId}`, {
      pesan,
      lokasi,
    }),
};
