import { apiFetch, toQueryString } from "../../services/api";
import type {
  Barang,
  CreateBarangInput,
  MerchantDashboardSummary,
  MerchantProfile,
  NearbyMerchant,
  ReservasiDetail,
  ReservasiServis,
  StatusServis,
  UpdateStatusInput,
} from "./merchant.types";

export const getMerchantProfile = (mitraId: string) =>
  apiFetch<MerchantProfile>(`/merchant/${mitraId}`);

export const getMerchantDashboardSummary = (mitraId: string) =>
  apiFetch<MerchantDashboardSummary>(`/merchant/${mitraId}/dashboard-summary`);

export const listMerchantReservasi = (mitraId: string, status?: StatusServis) =>
  apiFetch<ReservasiServis[]>(`/merchant/${mitraId}/reservasi${toQueryString({ status })}`);

export const getMerchantReservasiDetail = (mitraId: string, reservasiId: string) =>
  apiFetch<ReservasiDetail>(`/merchant/${mitraId}/reservasi/${reservasiId}`);

export const updateReservasiStatus = (
  mitraId: string,
  reservasiId: string,
  input: UpdateStatusInput
) =>
  apiFetch<ReservasiDetail>(`/merchant/${mitraId}/reservasi/${reservasiId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const updateMerchantProfile = (mitraId: string, input: Partial<MerchantProfile>) =>
  apiFetch<MerchantProfile>(`/merchant/${mitraId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const createMerchantProduct = (mitraId: string, input: CreateBarangInput) =>
  apiFetch<Barang>(`/merchant/${mitraId}/products`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const listMerchantProducts = (mitraId: string) =>
  apiFetch<Barang[]>(`/merchant/${mitraId}/products`);

export const listNearbyMerchants = (lat: number, lng: number, radius?: number) =>
  apiFetch<NearbyMerchant[]>(`/merchant/nearby${toQueryString({ lat, lng, radius })}`);