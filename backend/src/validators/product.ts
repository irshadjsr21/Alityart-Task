import { body, param, query } from 'express-validator';

export const create = [
  body('name')
    .trim()
    .isString()
    .not()
    .isEmpty()
    .withMessage('Name is required.'),
  body('price')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Price is required.'),
  body('image')
    .trim()
    .isString()
    .not()
    .isEmpty()
    .withMessage('Image is required.'),
  body('categoryId')
    .trim()
    .isString()
    .isUUID(4)
    .withMessage('Invalid Category Id.')
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
    .withMessage('Name is required.'),
  body('price')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Price is required.')
];

export const remove = [
  param('id')
    .trim()
    .isString()
    .isUUID(4)
    .withMessage('Invalid Id.')
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
  query('categoryId')
    .trim()
    .isString()
    .isUUID(4)
    .withMessage('Invalid Category Id.')
    .optional()
];
