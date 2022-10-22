import express from 'express';
import scriptable from './scriptable';

const router = express.Router();

router.use('/scriptable', scriptable);

export default router;
