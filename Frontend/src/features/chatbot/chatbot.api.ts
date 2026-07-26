import { apiFetch } from "../../services/api";
import type { ChatLocation, SendChatMessageResponse } from "./chatbot.types";

export const sendChatMessage = (
  customerId: string,
  pesan: string,
  lokasi?: ChatLocation
) =>
  apiFetch<SendChatMessageResponse>(`/chatbot/${customerId}`, {
    method: "POST",
    body: JSON.stringify({ pesan, lokasi }),
  });