import { Router } from 'express';
import authenticateToken from "../middleware/jwt"

import { createTransaction, getTransaction } from '../controllers/transController';

const router = Router();


router.post('/transaction', createTransaction);

router.get('/transactionUserView/:transactionId', authenticateToken , getTransaction);

export default router;