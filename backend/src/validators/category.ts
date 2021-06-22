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
  query('page')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Page number is invalid.')
    .optional(),
  query('itemsPerPage')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Items per page is invalid.')
    .optional(),
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
