import express from 'express';
import { userLogin, userSignup, userLogout, checkAuth } from '../controllers/userAuthController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

// Login route
router.post('/login', userLogin);

// Signup route
router.post('/signup', userSignup);

// Logout route
router.post('/logout', userLogout);

// Check authentication status route
router.get('/check-auth', requireAuth, checkAuth);

export default router;