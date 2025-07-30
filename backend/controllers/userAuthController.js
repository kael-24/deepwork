import User from '../models/userModel.js';
import { nameValidator, emailValidator, passwordValidator } from '../utils/InputValidator.js';
import jwt from 'jsonwebtoken'

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d'});
}

// Set cookie helper function
// this is included in the response
const setCookieToken = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true, // Not accessible via JavaScript
        secure: process.env.IS_DEV !== 'true', // Only use HTTPS in production
        sameSite: 'strict', // Protection against CSRF
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
    });
}

/**
 * ---------------------------------------------------------
 * LOGIN USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email) {
            emailValidator(email.trim());
        } else {
            throw new Error('Email is required');
        }

        if (password)
            passwordValidator({ password });
        else 
            throw new Error('Password is required');

        const normalizedEmail = email.toLowerCase();
        const validatedUser = await User.userLoginModel(normalizedEmail, password);
        const token = createToken(validatedUser._id);
        console.log("userLogin Token", token);
        
        // Set HTTP-only cookie
        setCookieToken(res, token);
        
        // Send user info without token
        res.status(200).json({
            name: validatedUser.name,
            email: validatedUser.email,
            isAuthenticated: true
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * ---------------------------------------------------------
 * SIGNUP USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (name)
            nameValidator(name);
        else 
            throw new Error('Name is required');

        if (email)
            emailValidator(email);
        else 
            throw new Error('Email is required');

        if (password)
            passwordValidator({ password, isEnough: true, isStrong: true });
        else 
            throw new Error('Password is required');

        const normalizedEmail = email.toLowerCase();
        const newUser = await User.userSignupModel(name, normalizedEmail, password);
        const token = createToken(newUser._id);
        console.log("userSingup Token", token);

        // Set HTTP-only cookie
        setCookieToken(res, token);
        
        // Send user info without token
        res.status(200).json({ 
            name: newUser.name,
            email: newUser.email,
            isAuthenticated: true
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log("ERROR", err.message);
    }
}

/**
 * ---------------------------------------------------------
 * LOGOUT USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogout = async (req, res) => {
    // Clear the cookie by setting it with an expired date
    res.cookie('jwt', '', { 
        httpOnly: true,
        secure: process.env.IS_DEV !== 'true',
        sameSite: 'strict',  
        expires: new Date(0)
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
}

/**
 * ---------------------------------------------------------
 * CHECK EXISTING USER AUTH
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const checkAuth = async (req, res) => {
    try {
        // The requireAuth middleware will already verify the token
        // If we reach this point, the user is authenticated
        const user = await User.findById(req.user._id).select('name email');
        
        console.log("checkAuth", user);
        
        if (!user) {
            return res.status(404).json({ isAuthenticated: false });
        }
        
        return res.status(200).json({
            isAuthenticated: true,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(401).json({ isAuthenticated: false });
    }
}
