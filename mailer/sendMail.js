const nodemailer = require("nodemailer");
const moment = require("moment");
require("dotenv").config();

const { updateInvoiceEmailSentStatus } = require("../db/api/invoices");

const billTemplate = ({ name, eventDate, addtionalNotes }) => `
    <div>

        <p>
        Moin ${name},
        </p> 
        <p>
        wir haben uns sehr gefreut, Sie bewirten zu dürfen!
        </p>
        <p>
        Waren Sie zufrieden? Dann schreiben Sie uns gern eine Google -Bewertung unter <a href=https://g.co/kgs/Yy5PMBy" target="_blank" >hier</a>. 
        </p>
        <p>
        Eine Frage hätten wir noch: 
        </p>
        <br>
        Wie haben Sie von uns erfahren?
        <br>
        <ul>
            <li>
            - Google <a href=https://g.co/kgs/Yy5PMBy" target="_blank" >Reviews</a>
            </li>
            <li>
            - Unsere website <a href='https://ulfscafe.de' target="_blank:" >ulfscafe.de </a>
            </li>
            <li>
            - Instagram <a href='https://www.instagram.com/ulfs_cafe/' target="_blank:"> @ulfs_cafe </a>
            </li>
            <li>
            - Freunde/Familie/Kollegen
            </li>
        </ul>
        <br>
        ${addtionalNotes && addtionalNotes.length > 2 ? `<p>${addtionalNotes}</p>` : ""}
        <br>
        Anbei finden Sie die Rechnung für unsere Leistung
        <br>
        <br>
        Beste Grüße
        Ulf Hansen
       </p>
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
