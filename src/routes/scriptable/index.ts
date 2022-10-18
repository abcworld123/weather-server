import express from 'express';
import scriptableController from 'controllers/scriptable';

const router = express.Router();

router.get('/get', scriptableController.get);

export default router;
