import { Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна перевірка для MongoDB ObjectId
const objectIdValidation = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// 1. Валідація для GET /notes (пагінація, фільтрація, пошук)
export const getAllNotesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(''),
  }),
};

// 2. Валідація для noteId (використовується для GET /notes/:noteId та DELETE /notes/:noteId)
export const noteIdSchema = {
  params: Joi.object({
    noteId: Joi.string()
      .required()
      .custom(objectIdValidation, 'ObjectId validation'),
  }),
};

// 3. Валідація для POST /notes (створення нотатки)
export const createNoteSchema = {
  body: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').default(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

// 4. Валідація для PATCH /notes/:noteId (оновлення нотатки)
export const updateNoteSchema = {
  params: Joi.object({
    noteId: Joi.string()
      .required()
      .custom(objectIdValidation, 'ObjectId validation'),
  }),
  body: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1), // Хоча б одне поле має бути присутнім у тілі запиту для оновлення
};
