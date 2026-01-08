import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import { sendResetEmail, InputValidator } from '../utils/index.js';
import { ERROR_MESSAGES } from '../constants/index.js';

/**
 * ---------------------------------------------------------
 * CREATES TOKEN
 * ---------------------------------------------------------
 * @param {String} _id 
 * @returns JWT Token
 */
const createToken = (_id, rememberMe) => {
    const expiresIn = rememberMe === false ? '30m' : '3d';
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: expiresIn });

    console.log("TOKEN: ", token);
    return token;
}

export const login = async (email, password, rememberMe) => {
    const normalizedEmail = email.toLowerCase();
    const validatedUser = await User.login(normalizedEmail, password);
    const token = createToken(validatedUser._id, rememberMe);
    return { validatedUser, token };
}

export const signup = async (name, email, password) => {
    const normalizedEmail = email.toLowerCase();
    const newUser = await User.signup(name, normalizedEmail, password);
    const token = createToken(newUser._id, false);
    return { newUser, token };
}

export const googleAuth = async (name, email, uid) => {
    const user = await User.googleAuth(name, email, uid);
    const token = createToken(user._id, true);
    return { user, token };
}

export const forgetPassword = async (email) => {
    const user = await User.findOne({ email, provider: 'local' });
    if (!user)
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000 // expires 15 minutes from now
    await user.save();

    await sendResetEmail({ to: user.email, token });
}

export const resetPassword = async (token, newPassword) => {
    InputValidator.passwordValidator({ password: newPassword, isEnough: true, isStrong: true });

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
        throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
}