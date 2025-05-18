import { Weather } from '@models/weather.model';
import nodemailer from 'nodemailer';
import { createTestAccount } from 'nodemailer';

let transporter: nodemailer.Transporter;

export const initEmailTransporter = async () => {
  if (transporter) return;

  // console.log('Ethereal test account created:');
  // console.log('Login:', testAccount.user);
  // console.log('Password:', testAccount.pass);
  // console.log('View at:', `https://ethereal.email/messages`);
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    // Use Gmail for production
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  } else {
    // Use Ethereal for testing
    const testAccount = await createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
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

  console.log('Comfirmation email sent:', info.messageId);
  console.log('Preview:', nodemailer.getTestMessageUrl(info));
};

/**
 * Sends an email with an unsubscribe link.
 */
export const sendSubscriptionConfirmedEmail = async (
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
      <p><a href="${unsubscribeUrl}">Unsubscribe</a> if you don't want to receive updates.</p>
    `,
  });

  console.log('Subscription confirmed email sent:', info.messageId);
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};

/**
 * Sends a weather update email.
 */
export const sendWeatherUpdateEmail = async (
  email: string,
  city: string,
  weather: Weather,
  unsubscribeUrl: string,
): Promise<void> => {
  await initEmailTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Weather update for ${city}`,
    html: `
      <p>Current weather in <b>${city}</b>:</p>
      <ul>
        <li><b>Temperature:</b> ${weather.temperature}°C</li>
        <li><b>Humidity:</b> ${weather.humidity}%</li>
        <li><b>Description:</b> ${weather.description}</li>
      </ul>
      <p><a href="${unsubscribeUrl}">Unsubscribe</a> if you don't want to receive updates.</p>
    `,
  });

  console.log('Weather update sent:', info.messageId);
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};