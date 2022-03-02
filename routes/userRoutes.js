import { Router } from 'express';



import { createUser, login } from '../controllers/userController';

const router = Router();

router.post('user/signup', createUser );


router.post('user/login', login);

export default router;

