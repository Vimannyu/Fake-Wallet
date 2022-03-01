import { Router } from 'express';
import authenticateToken from "../middleware/jwt"

import { createTransaction, getTransaction } from '../controllers/apiTrans';

const router = Router();


router.post('/transaction', createTransaction);

router.get('/transactionUserView/:transactionId', authenticateToken , getTransaction);

export default router;