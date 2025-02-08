import { env } from '../env';
import { Email, EmailData$ } from '@competition-manager/schemas';
import { sendEmail } from '@competition-manager/backend-utils';

export const sendVerificationEmail = async (email: Email, verificationToken: string, t: (key: string) => string) => {
    const url = new URL(env.BASE_URL);
    url.pathname = `${env.PREFIX}/users/verify-email`;
    url.searchParams.set('token', verificationToken);
    const html = `
        <h2>${t("verifEmail.welcome")}</h2>
        <p>${t("verifEmail.finalizeAccount")}</p>
        <a href="${url.toString()}">${t("verifEmail.verifyEmail")}</a>
        <p>${t("verifEmail.ignoreEmail")}</p>
        <p>${t("mailSignature")}</p>
    `;
    const emailData = EmailData$.parse({
        to: email,
        subject: t("verifEmail.subject"),
        html: html
    });
    await sendEmail(emailData);
}