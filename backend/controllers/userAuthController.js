import mongoose from 'mongoose';

import User from '../models/userModel.js';

import { authHelpers, InputValidator } from '../utils/index.js';
import { authService } from '../services/index.js';
import { firebaseAdmin } from '../config/index.js';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/index.js';

/**
 * ---------------------------------------------------------
 * LOCAL LOGIN USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogin = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // VALIDATION
    if (email)
        InputValidator.emailValidator(email.trim());
    else
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.EMAIL_REQUIRED);

    if (password)
        InputValidator.passwordValidator({ password });
    else
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.PASSWORD_REQUIRED);

    if (typeof rememberMe !== 'boolean')
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.REMEMBER_ME_INVALID);

    // SERVICE CALL
    const result = await authService.login(email, password, rememberMe);

    // Set HTTP-only cookie
    authHelpers.setAuthCookie(res, result.token, rememberMe);

    // Send user info without token
    res.status(HTTP_STATUS.OK).json({
        ...authHelpers.formatUserResponse(result.validatedUser),
        isAuthenticated: true
    });
}

/**
 * ---------------------------------------------------------
 * LOCAL SIGNUP USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userSignup = async (req, res) => {
    const { name, email, password } = req.body;

    // VALIDATION
    if (name)
        InputValidator.nameValidator(name);
    else
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.NAME_REQUIRED);

    if (email)
        InputValidator.emailValidator(email);
    else
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.EMAIL_REQUIRED);

    if (password)
        InputValidator.passwordValidator({ password, isEnough: true, isStrong: true });
    else
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.PASSWORD_REQUIRED);

    // SERVICE CALL
    const result = await authService.signup(name, email, password);

    // Set HTTP-only cookie
    authHelpers.setAuthCookie(res, result.token);

    // Send user info without token
    res.status(HTTP_STATUS.CREATED).json({
        ...authHelpers.formatUserResponse(result.newUser),
        isAuthenticated: true
    });
}

/**
 * ---------------------------------------------------------
 * LOCAL AND GOOGLE -- LOGOUT USER
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const userLogout = async (req, res) => {
    authHelpers.clearAuthCookie(res);
    res.status(HTTP_STATUS.OK).json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
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
    // The requireAuth middleware will already verify the token
    // If we reach this point, the user is authenticated
    const id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const user = await User.findById(id).select('name email provider');

    if (!user) {
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return res.status(HTTP_STATUS.OK).json({
        ...authHelpers.formatUserResponse(user),
        isAuthenticated: true
    });
}

/**
 * ---------------------------------------------------------
 * GOOGLE AUTH CONTR - verifies firebase ID and creates JWT
 * ---------------------------------------------------------
 * @param {*} req 
 * @param {*} res 
 */
export const googleAuth = async (req, res) => {
    const { idToken } = req.body;
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, name, email } = decoded;

    const result = await authService.googleAuth(name, email, uid);

    authHelpers.setAuthCookie(res, result.token);

    res.status(HTTP_STATUS.OK).json({
        ...authHelpers.formatUserResponse(result.user),
        uid: result.user.uid,
        isAuthenticated: true,
    });
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    InputValidator.emailValidator(email);

    await authService.forgetPassword(email);

    res.status(HTTP_STATUS.OK).json({ message: SUCCESS_MESSAGES.RESET_EMAIL_SENT });
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.status(HTTP_STATUS.OK).json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS });
}