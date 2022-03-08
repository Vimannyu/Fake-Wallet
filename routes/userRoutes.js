/* eslint-disable import/extensions */
import { Router } from 'express';
import authenticateToken from '../middleware/jwt.js';

import {  signup, login } from '../controllers/userController.js';

const userRoutes = Router();



userRoutes.post('/signup', signup);

userRoutes.post('/login', authenticateToken, login);

export default userRoutes;
