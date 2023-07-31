import { createTransport } from 'nodemailer';

const transporter = createTransport(process.env.SMTP);

export const sendEmail = (
  to: string,
  subject: string,
  html: string,
  text: string = ''
): Promise<any> => {
  console.log(process.env.MAIL_FROM);
  if (text === '') {
    // strip tags to generate simple text
    text = html.replace(/(<([^>]+)>)/gi, '');
  }
  return transporter.sendMail({
    from: process.env.MAIL_FROM, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};
