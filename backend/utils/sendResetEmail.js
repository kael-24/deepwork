// utils/sendResetEmail.js
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async ({ to, token }) => {
    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    try {
        const data = await resend.emails.send({
        from: 'Kyle Hamza <you@resend.dev>', // or use default 'onresend.com' if no domain yet
        to: process.env.IS_DEV === 'true' ? 'gstorage1one@gmail.com' : to,
        subject: 'Reset your password',
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
        `,
        text: `Reset your password using this link: ${resetLink}`
        });

        console.log('Email sent:', data);
        return data;
    } catch (err) {
        console.error('Email send error:', err);
        throw new Error('Failed to send email');
    }
};
