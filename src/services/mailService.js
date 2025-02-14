const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const _path = require('path')

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'localhost',
    port: process.env.MAIL_PORT || 1025,
    secure: process.env.MAIL_SECURE === 'true', // Set to true if using SSL/TLS
    auth: {
        user: process.env.MAIL_USERNAME || null, pass: process.env.MAIL_PASSWORD || null,
    },
});
let optionsData = {
    from: process.env.MAIL_FROM_ADDRESS || 'sample@gmail.com'
};
let valuesHtml = {};

const makeHtml = async () => {
    Object.keys(valuesHtml)
        .map(key => {
            optionsData.html = optionsData.html.replaceAll(`{{ ${key} }}`, valuesHtml[key]);
            optionsData.html = optionsData.html.replaceAll(`{{${key} }}`, valuesHtml[key]);
            optionsData.html = optionsData.html.replaceAll(`{{ ${key}}}`, valuesHtml[key]);
            optionsData.html = optionsData.html.replaceAll(`{{${key}}}`, valuesHtml[key]);
        })
}
const mailService = {
    to: (email) => {
        optionsData.to = email;
        return mailService; // Return the mailService object for chaining
    }, from: (fromEmail) => {
        optionsData.from = fromEmail;
        return mailService;
    }, cc: (ccEmail) => {
        optionsData.cc = ccEmail;
        return mailService;
    }, subject: (emailSubject) => {
        optionsData.subject = emailSubject;
        return mailService;
    }, html: (path, values = {}) => {
        optionsData.html = fs.readFileSync(_path.join(`${__dirname}/../../`, path), 'utf-8');
        valuesHtml = values;
        return mailService;
    }, text: (textContent) => {
        optionsData.text = textContent;
        return mailService;
    }, send: async () => {
        await makeHtml();
        try {
            const response = await transporter.sendMail(optionsData);
            return {
                success: true, data: response
            };
        } catch (e) {
            console.log(`mail sending error: ${e.message}`);
            return {
                success: false,
            };
        }
    }, dealy: (seconds = 0) => {
        Object.keys(valuesHtml)
            .map(key => {
                optionsData.html = optionsData.html.replaceAll(`{{ ${key} }}`, valuesHtml[key]);
                optionsData.html = optionsData.html.replaceAll(`{{${key} }}`, valuesHtml[key]);
                optionsData.html = optionsData.html.replaceAll(`{{ ${key}}}`, valuesHtml[key]);
                optionsData.html = optionsData.html.replaceAll(`{{${key}}}`, valuesHtml[key]);
            });
        try {
            setTimeout(() => transporter.sendMail(optionsData), seconds);
        } catch (e) {
            console.log(`mail sending error: ${e.message}`);
        }
    }
};

module.exports = {mailService};
