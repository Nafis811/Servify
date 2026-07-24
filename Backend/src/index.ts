import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { merchantRoutes } from "./routes/merchant.routes";
import { chatbotRoutes } from "./routes/chatbot.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/merchant", merchantRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
