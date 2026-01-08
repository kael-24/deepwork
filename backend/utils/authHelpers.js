/**
 * Cookie Configuration and Utilities
 */
export const getCookieOptions = (rememberMe = true) => {
    const isDev = process.env.IS_DEV === 'true';
    return {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? 'lax' : 'none',
        maxAge: rememberMe === false ? 30 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000, // 30 mins or 3 days
    };
};

/**
 * Set JWT token in HTTP-only cookie
 */
export const setAuthCookie = (res, token, rememberMe = true) => {
    const options = getCookieOptions(rememberMe);
    res.cookie('jwt', token, options);
};

/**
 * Clear authentication cookie (logout)
 */
export const clearAuthCookie = (res) => {
    const isDev = process.env.IS_DEV === 'true';
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? 'lax' : 'none',
        expires: new Date(0),
    });
};

/**
 * Format user response (exclude sensitive data)
 */
export const formatUserResponse = (user) => {
    return {
        name: user.name,
        email: user.email,
        provider: user.provider,
    };
};
