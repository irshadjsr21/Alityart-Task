import createController from './createController';

export const getStatus = createController(async (req, res, next) => {
  res.json({ message: 'Running' });
});
