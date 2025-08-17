import express from 'express';

import { createReligion } from '../controllers/adminController';
import { verifySuperAdmin } from '../middlewares/verifyJwt';

const router = express.Router();

//@ts-ignore
router.post('/religion', verifySuperAdmin, createReligion);

export default router;