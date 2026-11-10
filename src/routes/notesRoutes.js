import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// Маршрут для отримання всіх нотаток (з валідацією query-параметрів)
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// Маршрут для отримання однієї нотатки за ID (з валідацією params)
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// Маршрут для створення нової нотатки (з валідацією body)
router.post('/notes', celebrate(createNoteSchema), createNote);

// Маршрут для видалення нотатки за ID (з валідацією params)
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

// Маршрут для часткового оновлення нотатки за ID (з валідацією params та body)
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
