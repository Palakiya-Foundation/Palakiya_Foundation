import nodemailer from 'nodemailer';

// Create transporter only once
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Send Email
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  const tx = getTransporter();

  if (!tx) {
    const msg = 'EMAIL_USER / EMAIL_PASS missing';
    console.warn(msg);
    return {
      sent: false,
      error: msg,
    };
  }

  try {
    const from =
      process.env.EMAIL_FROM ||
      `"${process.env.ORG_NAME || 'Palakiya Foundation'}" <${process.env.EMAIL_USER}>`;
    console.log("Attachments Received:");
console.log(attachments);

console.log("Attachment Count:", attachments.length);

if (attachments.length > 0) {
  console.log("Filename:", attachments[0].filename);
  console.log("Buffer Size:", attachments[0].content.length);
}
    await tx.sendMail({
  from,
  to,
  subject,
  text,
  html,
  attachments,
});

    console.log("✅ Email Sent Successfully");

    return {
      sent: true,
    };
  } catch (err) {
    console.error("❌ Email Error:", err);

    return {
      sent: false,
      error: err.message,
    };
  }
};

export default sendEmail;