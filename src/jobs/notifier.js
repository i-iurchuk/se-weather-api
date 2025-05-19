import cron from 'node-cron';

import { knex } from '../db.js';
import { sendUpdateEmail } from '../services/mailer.js';

export function scheduleJobs() {
  cron.schedule('0 * * * *', () => notify('hourly'));
  cron.schedule('0 7 * * *', () => notify('daily'));
}

async function notify(frequency) {
  const subscriptions = await knex('subscriptions').where({ frequency, confirmed: true });

  for (const s of subscriptions) {
    const weather = await getWeatherByCity(s.city);
    await sendUpdateEmail(s.email, s.city, weather, s.token);
  }
}

async function getWeatherByCity(city) {
  const { data } = await axios.get(process.env.WEATHER_API_URL, {
    params: { key: WEATHER_KEY, q: city },
  });

  return {
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    description: data.current.condition.text,
  };
}
