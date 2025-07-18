import validator from 'validator'

export const nameValidator = (name) => {
    if (typeof name !== 'string')
        throw new Error('Invalid input');
    
    if (name?.trim().length < 2)
        throw new Error('Name should not be less than 2 characters');
}

export const emailValidator = (email) => {
    if (typeof email !== 'string') 
        throw new Error('Invalid input');

    if (!validator.isEmail(email))
        throw new Error('Invalid Email');
}

export const passwordValidator = ({ password, isEnough = false, isStrong = false }) => {
    if (typeof password !== 'string')
        throw new Error('Invalid input');

    if (isEnough && !validator.isLength(password, { min: 8 })) {
        throw new Error('Password too short');
    }

    if (isStrong && !(/^(?=.*[A-Za-z])(?=.*\d)/.test(password))) {
        throw new Error('It should atleast have a number and a letter');
    }
}