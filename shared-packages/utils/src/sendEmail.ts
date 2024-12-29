import { createTransport, SendMailOptions } from 'nodemailer';
import { EmailData } from '@competition-manager/schemas';

const transporter = createTransport({
    service: process.env.NODEMAILER_SERVICE ?? "gmail",
    host: process.env.NODEMAILER_HOST ?? "smtp.gmail.com",
    port: process.env.NODEMAILER_PORT ? parseInt(process.env.NODEMAILER_PORT) : 587,
    secure: process.env.NODEMAILER_SECURE === "true",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});

export const sendEmail = async (email : EmailData) => {
    const options: SendMailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email.to,
        subject: email.subject,
        html: email.html,
    }
    try {
        await transporter.sendMail(options);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}




