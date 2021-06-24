import express from 'express';

import * as productController from '../controllers/product';

const router = express.Router();

router.post('/', productController.create);
router.get('/', productController.list);
router.patch('/:id', productController.update);
router.delete('/:id', productController.remove);

export default router;
