/* eslint-disable import/extensions */
import { Router } from 'express';


import { createTransaction, getTransaction } from '../controllers/transController.js';

const transRoutes = Router();


transRoutes.post('/transaction', createTransaction);

transRoutes.post('/transactionUserView', getTransaction);


export default transRoutes;