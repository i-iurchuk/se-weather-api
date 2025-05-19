import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { knex } from '../src/db.js';

const secret = process.env.JWT_SECRET;
const APP_URL = process.env.BASE_URL;

describe('GET /api/confirm/:token', () => {
  it('confirms a valid subscription', async () => {
    const id = uuid();
    const token = jwt.sign({ id, email: 'confirm@ex.com' }, secret, {
      expiresIn: '7d',
    });

    // seed the DB
    await knex('subscriptions').insert({
      id,
      email: 'confirm@ex.com',
      city: 'Berlin',
      frequency: 'daily',
      token,
      confirmed: false,
    });

    const res = await fetch(`${APP_URL}/confirm/${token}`);
    expect(res.statusCode).toBe(200);

    const sub = await knex('subscriptions').where({ id }).first();
    expect(sub.confirmed).toBe(true);
  });

  it('returns 400 when token is junk', async () => {
    const res = await fetch(`${APP_URL}/confirm/not-a-token'`);
    expect(res.statusCode).toBe(400);
  });
});
