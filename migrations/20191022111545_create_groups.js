
exports.up = (knex) => {
    return knex.schema.createTable('groups', (t) => {
        t.integer('user_id')
        .references('id')
        .inTable('users')
        .notNull();
      t.integer('event_id')
        .references('id')
        .inTable('events')
        .notNull();
    });
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTable('groups');
  };
  