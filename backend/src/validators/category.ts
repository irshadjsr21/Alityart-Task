import { body, param, query } from 'express-validator';

export const create = [
  body('name')
    .trim()
    .isString()
    .not()
    .isEmpty()
    .withMessage('Name is required.')
];

export const update = [
  param('id')
    .trim()
    .isString()
    .isUUID(4)
    .withMessage('Invalid Id.'),
  body('name')
    .trim()
    .isString()
    .not()
    .isEmpty()
    .withMessage('Name is required.')
];

export const remove = [
  param('id')
    .trim()
    .isString()
    .isUUID(4)
    .withMessage('Invalid Id.'),
];

export const list = [
  query('sort')
    .trim()
    .isIn(['createdAt', 'updatedAt', 'name'])
    .withMessage('Sort is invalid.')
    .optional(),
  query('order')
    .trim()
    .isIn(['a', 'd'])
    .withMessage('Order is invalid.')
    .optional(),
];
