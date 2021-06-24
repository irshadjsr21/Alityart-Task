import express from 'express';

import { getStatus } from '../controllers/index';
import categoryRouter from './category';
import productRouter from './product';

const router = express.Router();

router.get('/status', getStatus);

router.use('/category', categoryRouter);
router.use('/product', productRouter);

export default router;
