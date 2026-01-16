import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

import { InputValidator, authHelpers, errorThrower } from '../utils';
import { userService } from '../services';

/**
 * Update user profile (name, password)
 */
const userEdit = async (req, res) => {
    const { name, password, newPassword } = req.body;
    const _id = req.user._id;

    if (!name && !password && !newPassword)
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.NOTHING_TO_UPDATE);

    if (name)
        InputValidator.nameValidator(name);

    if (password || newPassword) {
        InputValidator.passwordValidator({ password });
        InputValidator.passwordValidator({ password: newPassword, isEnough: true, isStrong: true });
    }

    const editedUser = await userService.updateUserProfile(_id, { name, password, newPassword });

    res.status(HTTP_STATUS.OK).json({
        ...authHelpers.formatUserResponse(editedUser),
        isAuthenticated: true,
    })
}

export default userEdit;


