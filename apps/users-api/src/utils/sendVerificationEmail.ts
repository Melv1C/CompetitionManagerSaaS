import { env } from '../env';
import { Email, EmailData$ } from '@competition-manager/schemas';
import { sendEmail } from '@competition-manager/backend-utils';


export const sendVerificationEmail = (email: Email, verificationToken: string) => {
    const url = new URL(env.BASE_URL);
    url.pathname = `${env.PREFIX}/users/verify-email`;
    url.searchParams.set('token', verificationToken);
    const emailData = EmailData$.parse({
        to: email,
        subject: 'Verify your email',
        html: `<a href="${url.toString()}">Click here to verify your email</a>`
    });
    return sendEmail(emailData);
}