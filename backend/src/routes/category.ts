import express from 'express';

import * as categoryController from '../controllers/category';

const router = express.Router();

router.post('/', categoryController.create);
router.get('/', categoryController.list);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
