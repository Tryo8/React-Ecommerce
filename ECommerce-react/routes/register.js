
import express from 'express';
import { registerController } from '../controller/registerController.js';
import { registerLimiter } from '../model/rateLimiter.js';
const router = express.Router();


router.post('/', registerLimiter, registerController);

export default router; 