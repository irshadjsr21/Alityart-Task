import dotenv from 'dotenv-flow';
dotenv.config();
process.env.ENV_LOADED = 'true';

import createError from 'http-errors';
import express from 'express';

import initMiddleware from './middlewares/init';
import indexRouter from './routes/index';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(initMiddleware);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(
  (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    next(createError(404));
  }
);

// error handler
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (error instanceof createError.HttpError) {
      const obj: { [key: string]: any } = {
        message: error.message
      };
      if (error.errors) {
        obj.errors = error.errors;
      }
      res.status(error.status).json(obj);
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
