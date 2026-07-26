export interface ChatLocation {
  latitude: number;
  longitude: number;
}

export interface SendChatMessageResponse {
  balasan: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}   