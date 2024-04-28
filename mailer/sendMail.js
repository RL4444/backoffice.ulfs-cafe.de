const nodemailer = require("nodemailer");
const moment = require("moment");
require("dotenv").config();

const { updateInvoiceEmailSentStatus } = require("../db/api/invoices");

const billTemplate = ({ eventDate, addtionalNotes }) => `
    <div>
        <p>Sehr geehrte Damen und Herren,</p>

        <p>bitte finden Sie anbei Ihre Rechnung für die im Betreff genannte Leistung am ${moment(eventDate).format("DD.MM.yyyy")}.</p>

        <p>Alle Daten zur Zahlung können Sie der Rechnung entnehmen.</p>

        ${addtionalNotes && addtionalNotes.length > 2 ? `<p>${addtionalNotes}</p>` : ""}

        <p>Wenn Sie Fragen haben, antworten Sie bitte auf diese E-Mail.</p>

        <p>Mit freundlichen Grüßen</p>
        <p>Ulfs Café</p>
    </div>
`;

const transporterObjectConfig = nodemailer.createTransport({
    host: "mail.gmx.net",
    port: "587",
    secure: false,
    // requireTLS: true,
    auth: {
        user: process.env.GMX_USER,
        pass: process.env.GMX_PASS,
    },
});

const sendMail = async ({ customer, event, pdfBuffer, fileName }) => {
    try {
        const mailOptions = {
            from: process.env.GMX_USER, // sender address
            to: customer.email, // list of receivers seperated by comma
            subject: `Rechnung ${event.invoiceId} ${event.type || "Leistung"} am ${moment(event.date).format("DD.MM.yyyy")}`, // Subject line
            html: billTemplate({
                name: customer.contactName,
                eventDate: event.date,
                eventType: event.type,
                addtionalNotes: event.addtionalNotes,
            }),
            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer,
                    encoding: "base64",
                    contentType: "application/pdf",
                },
            ],
        };

        // ---send mail with defined transport object---
        const sent = new Promise((resolve, reject) => {
            return transporterObjectConfig.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    resolve(false);
                    return;
                }
                await updateInvoiceEmailSentStatus(event.invoiceId);
                console.log("Message sent successfully!");
                resolve(true);
            });
        });

        return {
            sent: sent,
            message: "success",
        };
    } catch (err) {
        return {
            sent: false,
            message: err,
        };
    }
};

module.exports = { sendMail, transporter: transporterObjectConfig };
