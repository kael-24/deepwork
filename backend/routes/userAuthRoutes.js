import express from 'express';
import { userLogin, userSignup, userLogout, checkAuth, googleAuth } from '../controllers/userAuthController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

//*---------------LOCAL AUTH---------------*//
// login route
router.post('/user/login', userLogin);

// Signup route
router.post('/user/signup', userSignup);


//*---------------GOOGLE AUTH---------------*//
// google route
router.post('/google', googleAuth);


///*---------------GENERAL---------------*//
// Logout route
router.post('/user/logout', userLogout);

// Check authentication status route
router.get('/user/check-auth', requireAuth, checkAuth);

export default router;