
const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('events').where(filter).first();
  };

  const findAll = (userId) => {
    return app.db('events').where({ user_id: userId });
  };

  const save = async (event) => {
    if (!event.name) throw new ValidationError('Name is required');

    const evtDb = await find({ name: event.name, user_id: event.user_id });
    if (evtDb) throw new ValidationError('Event name already exists');
    return app.db('events').insert(event, '*');
  };

  const update = (id, event) => {
    return app.db('events')
      .where({ id })
      .update(event, '*');
  };

  const remove = (id) => {
    return app.db('events')
      .where({ id })
      .del();
  };

  return {
    save, find, findAll, update, remove,
  };
};
