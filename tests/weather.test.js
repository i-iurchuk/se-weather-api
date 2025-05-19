import nock from 'nock';

const apiBase = 'https://api.weatherapi.com';
const APP_URL = process.env.BASE_URL;

describe('GET /api/weather', () => {
  const sample = {
    location: { name: 'London' },
    current: {
      temp_c: 22,
      humidity: 35,
      condition: { text: 'Sunny' },
    },
  };

  it('returns 400 when city param is missing', async () => {
    const res = await fetch(`${APP_URL}/api/weather`);
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 when WeatherAPI returns "not found"', async () => {
    nock(apiBase)
      .get(/current\.json/)
      .query(true)
      .reply(400, {
        error: { message: 'No matching location found.' },
      });

    const res = await fetch(`${APP_URL}/api/weather?city=Atlantis`);
    expect(res.statusCode).toBe(404);
  });

  it('returns 200 + expected shape for a valid city', async () => {
    nock(apiBase)
      .get(/current\.json/)
      .query(true)
      .reply(200, sample);

    const res = await fetch(`${APP_URL}/api/weather?city=London`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      temperature: sample.current.temp_c,
      humidity: sample.current.humidity,
      description: sample.current.condition.text,
    });
  });
});
