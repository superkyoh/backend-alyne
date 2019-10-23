
exports.up = function(knex) {
    return knex("users").update(
        {available_dates: "2019/11/15, 2019/11/20"});
};

exports.down = function(knex) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('available_dates');
    });
};
