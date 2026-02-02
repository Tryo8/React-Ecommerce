
import express from 'express';
import { handleLogin } from '../controller/loginController.js';
import { loginLimiter } from '../model/rateLimiter.js';
const router = express.Router();


router.post('/',loginLimiter , handleLogin);

export default router;