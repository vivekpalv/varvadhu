import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinaryConfig';

import { addEducation, addImageToGallery, currentUser, removeEducation, setCurrentAddress, setFamilyDetails, setNativeAddress, setUserPreference, setUserReligion, updateProfile, uploadProfilePicture } from '../controllers/userController';
import { acceptRequest, currentUserAllRequests, currentUserApprovedUsers, currentUserSentRequests, rejectRequest, revokeSentRequest, sendRequest } from '../controllers/connectionController';

const router = express.Router();
const upload = multer({ storage });

//@ts-ignore
router.get('/me', currentUser);

//@ts-ignore
router.put('/update', updateProfile);

//@ts-ignore
router.put('/profileImage', upload.single("profile"), uploadProfilePicture);

//@ts-ignore
router.post('/gallery', upload.array("images"), addImageToGallery);

//@ts-ignore
router.put('/nativeAddress', setNativeAddress);

//@ts-ignore
router.put('/currentAddress', setCurrentAddress);

//@ts-ignore
router.post('/education', addEducation);

//@ts-ignore
router.delete('/education', removeEducation);

//@ts-ignore
router.put('/family', setFamilyDetails);

//@ts-ignore
router.put('/religion', setUserReligion);

//@ts-ignore
router.put('/preference', setUserPreference);

/** =========== CONNECTION =========== */

//@ts-ignore
router.post('/sendRequest/:sendToUserId', sendRequest);

//@ts-ignore
router.post('/acceptRequest/:acceptingUserId', acceptRequest);

//@ts-ignore
router.post('/rejectRequest/:rejectingUserId', rejectRequest);

//@ts-ignore
router.post('/revokeRequest/:revokeUserId', revokeSentRequest);

//@ts-ignore
router.get('/requests', currentUserAllRequests);

//@ts-ignore
router.get('/approved', currentUserApprovedUsers);

//@ts-ignore
router.get('/sentRequests', currentUserSentRequests);

export default router;