import mongoose from "mongoose";
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
        required: true,
    }
}, { timestamps: true });


userSchema.statics.userLoginModel = async function (email, password) {
    try {
        const user = await this.findOne({ email });
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


export default mongoose.model('User', userSchema);