import knexLib from 'knex';
import config from '../knexfile.js';

export const knex = knexLib(config);
