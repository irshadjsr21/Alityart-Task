/**
 * This will return all the essential middleware to
 * initialize the server.
 */

import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const initMiddleware = [
  cors(),
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false })
];

export default initMiddleware;
