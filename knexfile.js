export default {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations"
  }
};
