
exports.up = (knex) => {
    return knex.schema.createTable('events', (t) => {
      t.increments('id').primary();
      t.string('name').notNull();
      t.string('location').notNull();
      t.string('date');
      t.integer('user_id')
        .references('id')
        .inTable('users')
        .notNull();
    });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTable('events');
  };