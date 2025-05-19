import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { knex } from '../db.js';
import { sendConfirmationEmail, sendUnsubscribeEmail } from '../services/mailer.js';
import { isValidEmail, isValidCity } from '../utils/validators.js';

const secret = process.env.JWT_SECRET;

export async function subscribe(req, res) {
  const { email, city, frequency } = req.body;

  if (!email || !city || !frequency) {
    return res.status(400).json({ error: `Field ${email || city || frequency} is required` });
  } else if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  } else if (!isValidCity(city)) {
    return res.status(400).json({ error: 'City name must contain letters only' });
  } else if (!['hourly', 'daily'].includes(frequency)) {
    return res.status(400).json({ error: 'Invalid frequency' });
  }

  try {
    const existing = await knex('subscriptions').where({ email, city }).first();

    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    const id = uuid();
    const token = jwt.sign({ id, email }, secret, { expiresIn: '7d' });

    await knex('subscriptions').insert({
      id,
      email,
      city,
      frequency,
      token,
    });

    await sendConfirmationEmail(email, token);
    res.status(200).json({ message: '	Subscription successful. Confirmation email sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function confirm(req, res) {
  const { token } = req.params;

  try {
    const { id } = jwt.verify(token, secret);
    const updated = await knex('subscriptions').where({ id, token }).update({ confirmed: true });

    if (!updated) {
      return res.status(404).json({ error: 'Token not found' });
    }
    res.status(200).json({ message: 'Subscription confirmed successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
}

export async function unsubscribe(req, res) {
  const { token } = req.params;

  try {
    const { id } = jwt.verify(token, secret);
    const deleted = await knex('subscriptions').where({ id, token }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Token not found' });
    }

    await sendUnsubscribeEmail();
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
}
