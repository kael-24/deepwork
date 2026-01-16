import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt';

import { errorThrower } from "../utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.provider;
        }
    },
    uid: {
        type: String,
        index: true
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    resetToken: {
        type: String
    }, 
    resetTokenExpiry: { 
        type: Date
    }
}, { timestamps: true });

/**
 * ---------------------------------------------------------
 * LOCAL -- USER LOGIN MODEL
 * ---------------------------------------------------------
 * @param {String} email 
 * @param {String} password 
 * @returns 
 */
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email, provider: 'local' });
    if (!user) 
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);

    const match = await bcrypt.compare(password, user.password);
    if (!match)
        errorThrower(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);  

    return user;
}

/**
 * ---------------------------------------------------------
 * LOCAL -- USER SIGNUP MODEL
 * ---------------------------------------------------------
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @returns 
 */
userSchema.statics.signup = async function (name, email, password) {
    const user = await this.findOne({ email });
    if (user) 
        errorThrower(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.create({name, email, password: hashedPassword});

    return newUser;
}

/**
 * ---------------------------------------------------------
 * GOOGLE AUTH MODEL -- signup and login combined
 * ---------------------------------------------------------
 * @param {String} name 
 * @param {String} email 
 * @param {String} uid 
 * @returns 
*/
userSchema.statics.googleAuth = async function (name, email, uid) {
    let user = await this.findOne({ email });

    if (!user) {
        user = await this.create({
            email,
            name, 
            uid,
            provider: 'google'
        });
    }

    return user;
}


userSchema.statics.editProfile = async function (id, name, password, newPassword) {
    if (!mongoose.Types.ObjectId.isValid(id))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_OBJECT_ID);

    const query = {_id: id};
    if (password && newPassword) {
        query.provider = 'local';
    }

    const user = await this.findOne(query);
    if (!user)
        errorThrower(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    
    if (password && newPassword) {
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            errorThrower(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
        
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(newPassword, salt);
        user.password = hash;
    }

    if (name)
        user.name = name;

    await user.save();

    return user;
};



export default mongoose.model('User', userSchema);