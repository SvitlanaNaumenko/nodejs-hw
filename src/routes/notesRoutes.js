import { Router } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from "../controllers/notesController.js";

const router = Router();

// Маршрут для отримання всіх нотаток
router.get("/notes", getAllNotes);

// Маршрут для отримання однієї нотатки за ID
router.get("/notes/:noteId", getNoteById);

// Маршрут для створення нової нотатки
router.post("/notes", createNote);

// Маршрут для видалення нотатки за ID
router.delete("/notes/:noteId", deleteNote);

// Маршрут для часткового оновлення нотатки за ID
router.patch("/notes/:noteId", updateNote);

export default router;
