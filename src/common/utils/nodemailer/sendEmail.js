import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, attachments, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: to ||  "bar@example.com, baz@example.com",
    subject: subject || "Hello",
    html: html || "<b>Hello world?</b>",
  });

  
  console.log("Message sent:", info.messageId);
  return info.accepted.length > 0 ? true : false;
};


export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
