import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.end();
});

export default router;
