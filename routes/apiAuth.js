import { Router } from 'express';



import { createUser, login } from '../controllers/apiAuth';

const router = Router();

router.post('user/signup', createUser );


router.post('user/login', login);

export default router;

