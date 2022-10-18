import express from 'express';
import scriptable from './scriptable';

const router = express.Router();

router.get('/scriptable', scriptable);

export default router;
