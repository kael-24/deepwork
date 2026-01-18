import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import User from '../models/userModel.js';
import { errorThrower, authHelpers } from "../utils/index.js";

const userDelete = async (req, res) => {
    const { _id, provider } = req.user;
    const password = req.body?.password || null;

    if (provider === 'local') {
        if (typeof password !== 'string') // checks if string
            errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_PASSWORD_FORMAT);
        if (!password.trim()) // checks if empty
            errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.PASSWORD_REQUIRED);
    }

    await User.deleteUser({ id: _id, provider, password });

    authHelpers.clearAuthCookie(res);
    res.status(HTTP_STATUS.ACCEPTED).json({ message: "User deleted successfully" });
};

export default userDelete;