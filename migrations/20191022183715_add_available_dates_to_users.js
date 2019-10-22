exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.string('available_dates');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('available_dates');
    });
};