import axios from 'axios';
import { isValidCity } from '../utils/validators.js';

export async function getWeather(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Field "city" is required' });
  } else if (!isValidCity(city)) {
    return res.status(400).json({ error: 'City name must contain letters only' });
  }

  try {
    const { data } = await axios.get(process.env.WEATHER_API_URL, {
      params: { key: process.env.WEATHER_API_KEY, q: city },
    });

    const result = {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };

    res.status(200).json(result);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }

    console.error(err);
    res.status(err.response?.status).json({ err });
  }
}
