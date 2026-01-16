import validator from 'validator'

import errorThrower from './errorThrower';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export const nameValidator = (name) => {
    if (typeof name !== 'string')
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_NAME_FORMAT);
    
    if (name?.trim().length < 2)
        errorThrower(HTTP_STATUS.BAD_REQUEST, 'Name should not be less than 2 characters');
}

export const emailValidator = (email) => {
    if (typeof email !== 'string') 
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EMAIL_FORMAT);

    if (!validator.isEmail(email))
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
}

export const passwordValidator = ({ password, isEnough = false, isStrong = false }) => {
    if (typeof password !== 'string')
        errorThrower(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_PASSWORD_FORMAT);

    if (isEnough && !validator.isLength(password, { min: 8 }))
        errorThrower(HTTP_STATUS.BAD_REQUEST, 'Password too short');

    if (isStrong && !(/^(?=.*[A-Za-z])(?=.*\d)/.test(password)))
        errorThrower(HTTP_STATUS.BAD_REQUEST, 'It should atleast have a number and a letter');
}