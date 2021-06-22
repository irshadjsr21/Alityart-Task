import express from 'express';

import { getStatus } from '../controllers/index';
import categoryRouter from './category';

const router = express.Router();

router.get('/status', getStatus);

router.use('/category', categoryRouter);

export default router;
