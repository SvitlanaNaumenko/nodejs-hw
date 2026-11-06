import express from "express";
import "dotenv/config";
import cors from "cors";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Імпорт групи маршрутів для нотаток
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3030;

// Глобальні middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Підключаємо групу маршрутів нотаток
app.use(notesRoutes);

// 404 та обробник помилок — завжди наприкінці ланцюжка
app.use(notFoundHandler);
app.use(errorHandler);

// Підключення до бази даних та запуск сервера
const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
