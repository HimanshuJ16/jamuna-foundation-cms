import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
  },
});