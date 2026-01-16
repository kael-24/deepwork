import { Resend } from 'resend';
import errorThrower from './errorThrower.js';
import { HTTP_STATUS } from '../constants/index.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async ({ to, token }) => {
    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    const data = await resend.emails.send({
        from: 'Kyle Baskog <you@resend.dev>', // or use default 'onresend.com' if no domain yet
        to: process.env.IS_DEV === 'true' ? 'gstorage1one@gmail.com' : 'gstorage1one@gmail.com',
        subject: 'Reset your password',
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
        `,
        text: `Reset your password using this link: ${resetLink}`
    });

    if (data.error) {
        console.log("Error sending email: ", data.error);
        errorThrower(HTTP_STATUS.INTERNAL_SERVER_ERROR, data.error.message || "Failed to send email")
    }

    console.log('Email sent:', data);
    return data;
};

export default sendResetEmail;