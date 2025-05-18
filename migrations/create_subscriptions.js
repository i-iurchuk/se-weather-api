export async function up(knex) {
  await knex.schema.createTable("subscriptions", (table) => {
    table.uuid("id").primary();
    table.string("email").notNullable();
    table.string("city").notNullable();
    table.enu("frequency", ["hourly", "daily"]).notNullable();
    table.boolean("confirmed").defaultTo(false);
    table.string("token").unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("subscriptions");
}
