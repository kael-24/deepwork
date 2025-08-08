import { nameValidator, passwordValidator } from '../utils/InputValidator.js'
import User from '../models/userModel.js'

export const userEdit = async (req, res) => {
    try {
        const { name, password, newPassword} = req.body;
        const _id = req.user._id;

        if (!name && !password && !newPassword)
            throw new Error('You have not updated anything');

        if (name)
            nameValidator(name);
        
        if (password || newPassword) {
            passwordValidator({ password });
            passwordValidator({ password: newPassword, isEnough: true, isStrong: true });
        }
        
        const editedUser = await User.userEditModel(_id, name, password, newPassword); 
        res.status(200).json({ 
            name: editedUser.name,
            email:  editedUser.email,
            provider: editedUser.provider,
            isAuthenticated: true,
        })
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}



