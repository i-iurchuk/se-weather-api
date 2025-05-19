import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { knex } from '../src/db.js';

const secret = process.env.JWT_SECRET || 'secret';
const APP_URL = process.env.BASE_URL;

describe('GET /api/unsubscribe/:token', () => {
  it('deletes an existing subscription', async () => {
    const id = uuid();
    const token = jwt.sign({ id, email: 'bye@ex.com' }, secret, {
      expiresIn: '7d',
    });

    await knex('subscriptions').insert({
      id,
      email: 'bye@ex.com',
      city: 'Rome',
      frequency: 'hourly',
      token,
      confirmed: true,
    });

    const res = await fetch(`${APP_URL}/api/unsubscribe/${token}`);
    expect(res.statusCode).toBe(200);

    const sub = await knex('subscriptions').where({ id }).first();
    expect(sub).toBeUndefined();
  });

  it('returns 404 for unknown token', async () => {
    const fakeToken = jwt.sign({ id: uuid(), email: 'nobody@ex.com' }, secret, { expiresIn: '7d' });
    const res = await fetch(`${APP_URL}/api/unsubscribe/${fakeToken}`);
    expect(res.statusCode).toBe(404);
  });
});
