import { CompetitionEvent, CreateInscription, Email, EmailData$ } from "@competition-manager/schemas";
import { sendEmail } from "./sendEmail";
import { TFunction } from "i18next";
import { findAthleteWithLicense } from "./findAthleteWithLicense";

export const sendEmailInscription = async (inscriptionDatas: CreateInscription[], totalCost: Number, events: CompetitionEvent[], email: Email, competitionName: String, t: TFunction) => {
    const tables = [];
    for (const inscriptionData of inscriptionDatas) {
        const athlete = await findAthleteWithLicense(inscriptionData.athleteLicense);
        let htmlTableRow = "";
        for (const inscription of inscriptionData.inscriptions) {
            const event = events.find(e => e.eid == inscription.competitionEventEid);
            const eventSchedule = event?.schedule ? new Date(event.schedule).toLocaleTimeString('fr-be', { hour: '2-digit', minute: '2-digit' }) : '';
            htmlTableRow += `
                <tr>
                    <td>${eventSchedule}</td>
                    <td>${event?.name}</td>
                    <td>${inscription.record?.perf || "-"}</td>
                    ${totalCost==0 ? "" : `<td>${event?.cost}</td>`}
                </tr>`;
        }
        tables.push(`
            <h3>${athlete.bib + " " + athlete.firstName + " " + athlete.lastName}</h3>
            <table>
                <tr>
                    ${t("mail:inscriptionEmail.th")}
                    ${totalCost==0 ? "" : `<th>${t("mail:inscriptionEmail.cost")}</th>`}
                </tr>
                ${htmlTableRow}
            </table>
        `);
    }
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${t("mail:inscriptionEmail.title")}</title>
            <style>
                table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                }
                th, td {
                border: 1px solid #ddd;
                padding: 8px;
                }
                th {
                background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>${t("mail:inscriptionEmail.title")}</h1>
            <p>${t("mail:inscriptionEmail.text", {competitionName: competitionName})}</p>
            ${tables.join("")}
            ${totalCost==0 ? "": `<p>${t("mail:inscriptionEmail.total")} ${totalCost}</p>`}
            <p>${t("mail:mailSignature")}</p>
        </body>
    `;
    
    const emailData = EmailData$.parse({
        to: email,
        subject: t("mail:inscriptionEmail.title"),
        html: html
    });
    await sendEmail(emailData);

}