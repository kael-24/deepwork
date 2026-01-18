import express from 'express';
import { userAuthController, userEditController, userDeleteController } from '../controllers/index.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = express.Router();

//*---------------LOCAL AUTH---------------*//
// login route
router.post('/user/login', asyncHandler(userAuthController.userLogin));

// Signup route
router.post('/user/signup', asyncHandler(userAuthController.userSignup));

// forget-password route
router.post('/forget-password', asyncHandler(userAuthController.forgetPassword));

// reset-password route
router.patch('/reset-password', asyncHandler(userAuthController.resetPassword));


//*---------------GOOGLE AUTH---------------*//
// google route
router.post('/user/google', asyncHandler(userAuthController.googleAuth));


///*---------------GENERAL---------------*//
// Logout route
router.post('/user/logout', asyncHandler(userAuthController.userLogout));

// Check authentication status route
router.get('/user/check-auth', requireAuth, asyncHandler(userAuthController.checkAuth));


//*---------------EDIT PROFILE---------------*//
// Edit User route
router.patch('/user/edit-user', requireAuth, asyncHandler(userEditController));

// Delete user 
router.delete('/user/delete-user', requireAuth, asyncHandler(userDeleteController));

export default router;