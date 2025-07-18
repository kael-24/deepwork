import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization)
        return res.status(400).json({ error: 'Authorization token is required'})

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);
        req.user = await User.findById(_id).select('_id');
        next();
    } catch (err) {
        res.status(400).json({ error: `Request is not authorized. ${err.message}` });
    }
}

export default requireAuth;