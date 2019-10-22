
exports.up = function(knex) {
    return knex("users").update(
        {available_dates: "2019/10/25, 2019/10/28"});
};

exports.down = function(knex) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('available_dates');
    });
};
