import nodemailer from 'nodemailer';
import { createTestAccount } from 'nodemailer';

let transporter: nodemailer.Transporter;

export const initEmailTransporter = async () => {
  if (transporter) return;

  const testAccount = await createTestAccount();

  console.log('Ethereal test account created:');
  console.log('Login:', testAccount.user);
  console.log('Password:', testAccount.pass);
  console.log('View at:', `https://ethereal.email/messages`);

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Sends a confirmation email with a link to confirm the subscription.
 */
export const sendConfirmationEmail = async (
  email: string,
  confirmUrl: string,
): Promise<void> => {
  await initEmailTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirm your weather subscription',
    html: `
      <p>Hello,</p>
      <p>Please confirm your subscription by clicking the link below:</p>
      <a href="${confirmUrl}">${confirmUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you!</p>
    `,
  });

  console.log('✅ Email sent:', info.messageId);
  console.log('🔍 Preview:', nodemailer.getTestMessageUrl(info));
};

/**
 * Sends an email with an unsubscribe link.
 */
export const sendUnsubscribeEmail = async (
  email: string,
  unsubscribeUrl: string
): Promise<void> => {
  await initEmailTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Subscription Confirmed - Manage Your Preferences',
    html: `
      <p>Your weather subscription has been confirmed.</p>
      <p>If you ever want to unsubscribe, click the link below:</p>
      <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
    `,
  });

  console.log('📤 Unsubscribe email sent:', info.messageId);
  console.log('🔍 Preview URL:', nodemailer.getTestMessageUrl(info));
};


// const confirmedSubscriptions = await prisma.subscription.findMany({
//   where: { confirmed: true },
// });