import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = this.getTransporter();
    }

    async sendMail(options) {
        try {
            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: options.to,
                subject: options.subject,
                ...this.getMailBody(options),
            };

            if (options.attachments) {
                mailOptions.attachments = options.attachments;
            }

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
            return info;
        } catch (error) {
            console.error(`Error sending email: ${error}`);
            throw error;
        }
    }

    getMailBody(options) {
        if (options.html) {
            return { html: options.html };
        } else if (options.text) {
            return { text: options.text };
        } else {
            throw new Error('Either html or text property is required');
        }
    }

    getTransporter() {
        switch (process.env.MAIL_SERVICE) {
            case 'gmail':
                return this.getGmailTransporter();
            case 'amazon-ses':
                return this.getAmazonSESTransporter();
            case 'mailgun':
                return this.getMailgunTransporter();
            case 'sendgrid':
                return this.getSendgridTransporter();
            case 'smtp':
                return this.getSMTPTransporter();
            default:
                throw new Error('MAIL_SERVICE environment variable is not set');
        }
    }

    getGmailTransporter() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
    }

    getAmazonSESTransporter() {
        const ses = require('@aws-sdk/client-ses');
        return nodemailer.createTransport({
            SES: new ses.SESClient({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            }),
        });
    }

    getMailgunTransporter() {
        return nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
                user: process.env.MAILGUN_USERNAME,
                pass: process.env.MAILGUN_PASSWORD,
            },
        });
    }

    getSendgridTransporter() {
        return nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
            },
        });
    }

    getSMTPTransporter() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE, // or 'STARTTLS'
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
}

export default EmailService;