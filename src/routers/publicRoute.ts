import express from 'express';
import { osInformation } from '../controllers/testController';
import { getReligions } from '../controllers/adminController';
import { searchUsers } from '../controllers/searchController';
const router = express.Router();

//@ts-ignore
router.get('/os', osInformation);

//@ts-ignore
router.get('/religions', getReligions);

//@ts-ignore
router.get('/search', searchUsers)

export default router;