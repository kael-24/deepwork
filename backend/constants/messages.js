/**
 * Application Messages
 * Centralized success and error messages for consistency
 */
export const ERROR_MESSAGES = {
    // Auth Errors
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    NAME_REQUIRED: 'Name is required',
    REMEMBER_ME_INVALID: 'Unrecognized value for RememberMe',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    TOKEN_EXPIRED: 'Token expired or invalid',

    // Password Errors
    PASSWORD_RESET_FAILED: 'Failed to reset password',
    PASSWORD_UPDATE_FAILED: 'Failed to update password',

    // Validation Errors
    INVALID_EMAIL: 'Invalid email format',
    INVALID_NAME: 'Invalid name format',
    INVALID_PASSWORD: 'Invalid password format',
    NOTHING_TO_UPDATE: 'You have not updated anything',

    // Workout Errors
    INVALID_WORKOUT_NAME: 'Invalid workout name. Must be at least 2 characters',
    INVALID_EXERCISES: 'Invalid or empty exercises data',
    WORKOUT_NOT_FOUND: 'Workout not found',
    FAILED_TO_GET_WORKOUTS: 'Error getting workouts',
    FAILED_TO_GET_WORKOUT: 'Something went wrong in getting the workout!',
    FAILED_TO_CREATE_WORKOUT: 'Failed to create workout',
    FAILED_TO_UPDATE_WORKOUT: 'Failed to update workout',
    FAILED_TO_DELETE_WORKOUT: 'Failed to delete workout',

    // Firebase Errors
    INVALID_ID_TOKEN: 'Invalid Firebase ID token',

    // Server Errors
    DATABASE_ERROR: 'Database connection error',
    SERVER_ERROR: 'Server error',
};

export const SUCCESS_MESSAGES = {
    // Auth Success
    LOGIN_SUCCESS: 'Logged in successfully',
    SIGNUP_SUCCESS: 'Signed up successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    AUTH_VERIFIED: 'Authentication verified',

    // Password Success
    RESET_EMAIL_SENT: 'Reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password has been set',
    PASSWORD_UPDATE_SUCCESS: 'Password updated successfully',

    // User Success
    PROFILE_UPDATED: 'Profile updated successfully',

    // Workout Success
    WORKOUT_CREATED: 'Workout created successfully',
    WORKOUT_UPDATED: 'Workout updated successfully',
    WORKOUT_DELETED: 'Workout deleted successfully',
};
