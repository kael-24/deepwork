import validator from 'validator'

export const nameValidator = (name) => {
    if (typeof name !== 'string')
        return 'Invalid input';
    
    if (name?.trim().length < 2)
        return 'Name should not be less than 2 characters';
}

export const passwordValidator = ({ password, isEnough = false, isStrong = false }) => {
    if (typeof password !== 'string')
        return 'Invalid input';

    if (isEnough && !validator.isLength(password, { min: 8 })) {
        return 'Password too short';
    }

    if (isStrong && !(/^(?=.*[A-Za-z])(?=.*\d)/.test(password))) {
        return 'It should atleast have a number and a letter';
    }
}