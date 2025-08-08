import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt';

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
userSchema.statics.userLoginModel = async function (email, password) {
    try {
        const user = await this.findOne({ email, provider: 'local' });
        if (!user) 
            throw new Error('User does not exists');
    
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            throw new Error('Invalid credentials');  
    
        return user;
    } catch (err) {
        throw err;
    }
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
userSchema.statics.userSignupModel = async function (name, email, password) {
    try {
        const user = await this.findOne({ email });
        if (user) 
            throw new Error('email already in use');
    
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = await this.create({name, email, password: hashedPassword});
    
        return newUser;
    } catch (err) {
        throw err;
    }
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
userSchema.statics.userGoogleAuthModel = async function (name, email, uid) {
    try {
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
    } catch (err) {
        throw err;
    }

}


userSchema.statics.userEditModel = async function (id, name, password, newPassword) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error('Object ID is invalid');

        const query = {_id: id};
        if (password && newPassword) {
            query.provider = 'local';
        }

        const user = await this.findOne(query);
        if (!user)
            throw new Error("User not found");
        
        if (password && newPassword) {
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                throw new Error("Incorrect credentials");
            
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(newPassword, salt);
            user.password = hash;
        }

        if (name)
            user.name = name;

        await user.save();

        return user;
    } catch (err) {
        throw err;
    }
}

export default mongoose.model('User', userSchema);