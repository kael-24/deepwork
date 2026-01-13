import User from '../models/userModel.js';
import { ERROR_MESSAGES } from '../constants/index.js';

/**
 * Update user profile (name, password)
 */
export const updateUserProfile = async (userId, { name, password, newPassword }) => {
    if (!name && !password && !newPassword) {
        throw new Error(ERROR_MESSAGES.NOTHING_TO_UPDATE);
    }

    const editedUser = await User.editProfile(userId, name, password, newPassword);
    return editedUser;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('name email provider');
    if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
};

