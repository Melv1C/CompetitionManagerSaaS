import { createTransport, SendMailOptions } from 'nodemailer';
import { Email } from '@competition-manager/schemas';

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

export const sendEmail = async (email : Email) => {
    const options: SendMailOptions = {
        from: "competition.manager.saas@gmail.com",
        to: email.to,
        subject: email.subject,
        html: email.html,
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}




