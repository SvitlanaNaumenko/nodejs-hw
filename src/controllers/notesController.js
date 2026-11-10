import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток поточного користувача
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const userId = req.user._id;

  const parsedPage = parseInt(page, 10);
  const parsedPerPage = parseInt(perPage, 10);
  const skip = (parsedPage - 1) * parsedPerPage;

  const notesQuery = Note.find({ userId });

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // Виконуємо підрахунок та отримання нотаток паралельно через Promise.all
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(notesQuery.getFilter()),
    notesQuery.skip(skip).limit(parsedPerPage),
  ]);

  const totalPages = Math.ceil(totalNotes / parsedPerPage);

  res.status(200).json({
    page: parsedPage,
    perPage: parsedPerPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id (що належить поточному користувачу)
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нову нотатку з прив'язкою до userId
export const createNote = async (req, res) => {
  const userId = req.user._id;
  const note = await Note.create({ ...req.body, userId });

  res.status(201).json(note);
};

// Видалити нотатку за id (тільки свою)
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Оновити нотатку за id (тільки свою)
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndUpdate({ _id: noteId, userId }, req.body, {
    returnDocument: 'after',
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
