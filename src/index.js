import express from 'express';
import dotenv from 'dotenv';

import { scheduleJobs } from './jobs/notifier.js';
import weatherRouter from './routes/weather.js';
import subscriptionRouter from './routes/subscription.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

app.use(express.static('public'));

app.use('/api', weatherRouter);
app.use('/api', subscriptionRouter);

app.listen(PORT, () => {
  console.log(`Weather API listening on ${PORT}`);
  scheduleJobs(); // start hourly/daily mailers
});
