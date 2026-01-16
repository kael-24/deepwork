import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const requireAuth = async (req, res, next) => {
    // Get the token from the cookie instead of the Authorization header
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(_id).select('_id');
        if (!req.user)
            return res.status(401).json({ error: `Request is not authorized. User does not exists` });
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        return res.status(401).json({ error: 'Request is not authorized' });
    }
}
