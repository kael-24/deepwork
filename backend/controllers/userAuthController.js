import User from '../models/userModel.js';
import { nameValidator, emailValidator, passwordValidator } from '../utils/InputValidator.js';
import jwt from 'jsonwebtoken'
import admin from '../firebase/firebaseAdmin.js'
import { sendResetEmail } from '../utils/sendResetEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

/**
 * ---------------------------------------------------------
 * CREATES TOKEN
 * ---------------------------------------------------------
 * @param {String} _id 
 * @returns JWT Token
 */
const createToken = (_id, rememberMe) => {
    const expiresIn = rememberMe === false ? '30m' : '3d';
    const token = jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
    
    console.log("TOKEN: ", token);
    return token;
}

/**
 * ---------------------------------------------------------
 * SET COOKIE - included in res
 * ---------------------------------------------------------
 * @param {*} res 
 * @param {String object} token 
 */
const setCookieToken = (res, token, rememberMe) => {
    const isDev = process.env.IS_DEV === 'true';
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: !isDev, // Only use HTTPS in production
        sameSite: isDev ? 'strict' : 'none', // Cross-site requests in prod need 'none'
        maxAge: rememberMe === false ? 30 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000
    });
}

/**
 * ---------------------------------------------------------
 * LOCAL LOGIN USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogin = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (email) {
            emailValidator(email.trim());
        } else {
            throw new Error('Email is required');
        }

        if (password)
            passwordValidator({ password });
        else 
            throw new Error('Password is required');

        if (typeof rememberMe !== 'boolean')
            throw new Error('Unrecognized value for RememberMe');

        const normalizedEmail = email.toLowerCase();
        const validatedUser = await User.userLoginModel(normalizedEmail, password, rememberMe);
        const token = createToken(validatedUser._id, rememberMe);
        
        // Set HTTP-only cookie
        setCookieToken(res, token, rememberMe);
        
        // Send user info without token
        res.status(200).json({
            name: validatedUser.name,
            email: validatedUser.email,
            provider: validatedUser.provider,
            isAuthenticated: true 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * ---------------------------------------------------------
 * LOCAL SIGNUP USER
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

        // Set HTTP-only cookie
        setCookieToken(res, token);
        
        // Send user info without token
        res.status(200).json({ 
            name: newUser.name,
            email: newUser.email,
            provider: newUser.provider,
            isAuthenticated: true 
        });
    } catch (err) {
        console.log("ERROR", err.message);
        res.status(400).json({ error: err.message });
    }
}

/**
 * ---------------------------------------------------------
 * LOCAL AND GOOGLE -- LOGOUT USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogout = async (req, res) => {
    // Clear the cookie by setting it with an expired date
    const isDev = process.env.IS_DEV === 'true';
    res.cookie('jwt', '', { 
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? 'strict' : 'none',  
        expires: new Date(0)
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
}

/**
 * ---------------------------------------------------------
 * LOCAL AND GOOGLE -- CHECK EXISTING USER AUTH
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const checkAuth = async (req, res) => {
    try {
        // The requireAuth middleware will already verify the token
        // If we reach this point, the user is authenticated
        const id = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: 'Object ID is invalid' });

        const user = await User.findById(id).select('name email provider');
        
        console.log("checkAuth", user);
        
        if (!user) {
            return res.status(404).json({ isAuthenticated: false });
        }
        
        return res.status(200).json({
            name: user.name,
            email: user.email,
            provider: user.provider,
            isAuthenticated: true
        });
    } catch (err) {
        return res.status(500).json({ isAuthenticated: false });
    }
}

/**
 * ---------------------------------------------------------
 * GOOGLE AUTH CONTR - verifies firebase ID and creates JWT
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email } = decoded;
    
        const newUser = await User.userGoogleAuthModel(name, email, uid);
        
        const token = createToken(newUser._id);
        setCookieToken(res, token);

        res.status(200).json({
            name: newUser.name, 
            email: newUser.email,
            uid: newUser.uid,
            provider: newUser.provider,
            isAuthenticated: true,
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({error: err.message})
    }
    
}

export const forgetPassword = async (req, res) => { 
    const { email } = req.body;

    try {
        emailValidator(email);

        const user = await User.findOne({ email, provider: 'local' });
        if (!user)
            throw new Error('User not found');
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000 // expires 15 minutes from now
        await user.save();

        await sendResetEmail({ to: user.email, token });

        res.status(200).json({ message: 'Reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `${err.message}` || 'Server error' });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body; 

        passwordValidator({ password: newPassword, isEnough: true, isStrong: true });

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) 
            throw new Error('Token expired or invalid' );

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password has been set' });
    } catch (err) {
        res.status(500).json({ error: `${err.message}` || 'Server error' }); 
    }
}