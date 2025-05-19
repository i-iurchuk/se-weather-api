import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendConfirmationEmail(email, token) {
  const url = generateLink(`/api/confirm/${token}`);

  await transporter.sendMail({
    to: email,
    subject: 'Confirm your subscription',
    html: `<p>Please confirm your subscription to ${city} weather updates.</p><p><a href="${url}">Confirm Subscription</a></p>`,
  });
}

export async function sendUpdateEmail(email, city, P, token) {
  const url = generateLink(`/api/unsubscribe/${token}`);
  const { temperature, humidity, description } = weather;

  await transporter.sendMail({
    to: email,
    subject: `Weather update for ${city}`,
    html: `<h2>${city} Weather</h2><p>${description}</p><p>Temp: ${temperature}°C<br>Humidity: ${humidity}%</p><hr /><p><a href="${url}">Unsubscribe</a></p>`,
  });
}

export async function sendUnsubscribeEmail(params) {
  await transporter.sendMail({
    to: email,
    subject: `Unsubscribe`,
    html: `<h2>You was unsubscribed from weather updates for ${city}</h2>`,
  });
}
