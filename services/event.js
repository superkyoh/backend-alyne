
const ValidationError = require('../errors/ValidationError');


module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('events').where(filter).first();
  };

  const findAll = (userId) => {
    return app.db('events').where({ user_id: userId });
  };

  const findById = async(eventId) => {
    let friends = [];
    let event_friends = [];
    const event = await app.db('events').where({ id: eventId }).first();
    console.log('evento' + event.id)
    friends = await app.db('groups').where({event_id: event.id})
    console.log('friends' + JSON.stringify(friends[0]))
    for(let i = 0; i < friends.length; i++){
      let userDb = await app.db('users').where({ id: friends[i].user_id }).first();
      let newUser = { id: userDb.id, name: userDb.name, email: userDb.email }
      event_friends.push(newUser);
    };
    
    return { name: event.name,location: event.location, date: event.date, user_id: event.user_id, friends: event_friends }; 
  }

  const save = async (event) => {
    if (!event.name) throw new ValidationError('Name is required');
    const new_event = {name: event.name,location: event.location, date: event.date, user_id: event.user_id}
    const evtDb = await find({ name: event.name, user_id: event.user_id });
    if (evtDb) throw new ValidationError('Event name already exists');
    return app.db('events').insert(new_event, '*');
  };


  const saveFriends = async (event) => {
    const evt_created = await find({ name: event.name });
    const event_f = event.friends;
    
    for(let i = 0; i < event_f.length; i++){
      console.log('eventf ' + event_f[i])
      let user_event = {user_id: event_f[i], event_id: evt_created.id};
      console.log('evento' + JSON.stringify(user_event));
      await app.db('groups').insert(user_event, '*');
    }
    return evt_created.id;
  };

  const alyne = (id, event) => {

    //buscar na tabela users as datas disponiveis, pegar a menor e adicionar no aligned event para update.
    //const alignedEvent = 

    return app.db('events')
      .where({ id })
      .update(alignedEvent, '*');
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
    save, find, findAll, update, remove, findById, saveFriends, alyne
  };
};
