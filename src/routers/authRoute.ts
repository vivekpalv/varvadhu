import express from 'express';

import { adminLogin, adminSignUp, loginUser, registerUser, sendLoginResgiterOtp } from '../controllers/authController';

const router = express.Router();

//=========== USER AUTHENTICATION ===========

//@ts-ignore
router.post('/sendOtp', sendLoginResgiterOtp);

//@ts-ignore
router.post('/register', registerUser);

//@ts-ignore
router.post('/login', loginUser);

//=========== ADMIN AUTHENTICATION ===========

//@ts-ignore
router.post('/admin_register', adminSignUp);

//@ts-ignore
router.post('/admin_login', adminLogin);



export default router;