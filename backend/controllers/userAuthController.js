import User from '../models/userModel.js';
import { nameValidator, emailValidator, passwordValidator } from '../inputValidator/InputValidator.js';
import jwt from 'jsonwebtoken'

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d'});
}

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
        res.status(200).json({
            name: validatedUser.name,
            email: validatedUser.email,
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

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

        res.status(200).json({ 
            name: newUser.name,
            email: newUser.email,
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
