import validate from 'validator';

export const inputValidator = ({ password = undefined, confirmPassword = undefined }) => {
    /**
     * ---------------------------------------------------------
     * Verify passwords (password and confirm)
     * ---------------------------------------------------------
     */
    if (password) {
        if (password?.length < 8)
            return 'Password cannot be less than 8 characters'
        else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password))
            return 'Password should have atleast a letter and a number';
        
        if (confirmPassword) {
            if (password !== confirmPassword && !validate.isEmpty(confirmPassword))
                return 'Passwords do not match';
        }
    }

    return;
}
