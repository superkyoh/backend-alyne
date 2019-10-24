
const ValidationError = require('../errors/ValidationError');


module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('events').where(filter).first();
  };

  const findAll = (userId) => {
    return app.db('events').where({ user_id: userId });
  };

  const findMyEvents = async (userId) => {
    let my_events = [];
    let my_events_id = await app.db('groups').where({user_id: userId});
    for(let i = 0; i < my_events_id.length; i++){
      let event = await app.db('events').where({ id: my_events_id[i].event_id }).first();
      my_events.push(event)
    }
    return my_events;
  };

  const findById = async(eventId) => {
    let friends = [];
    let event_friends = [];
    const event = await app.db('events').where({ id: eventId }).first();
    friends = await app.db('groups').where({event_id: event.id})
    for(let i = 0; i < friends.length; i++){
      let userDb = await app.db('users').where({ id: friends[i].user_id }).first();
      let newUser = { id: userDb.id, name: userDb.name, email: userDb.email, available_dates: userDb.available_dates }
      event_friends.push(newUser);
    };
    
    return { name: event.name,location: event.location, date: event.date, user_id: event.user_id, friends: event_friends }; 
  }

  const save = async (event) => {
    if (!event.name) throw new ValidationError('Name is required');
    const new_event = {name: event.name, location: event.location, user_id: event.user_id}
    const evtDb = await find({ name: event.name, user_id: event.user_id });
    if (evtDb) throw new ValidationError('Event name already exists');
    return app.db('events').insert(new_event, '*');
  };


  const saveFriends = async (event) => {
    const evt_created = await find({ name: event.name });
    const event_f = [ 2, 3, 4];
    
    for(let i = 0; i < event_f.length; i++){
      let user_event = {user_id: event_f[i], event_id: evt_created.id};
      await app.db('groups').insert(user_event, '*');
    }
    return evt_created.id;
  };

  const alyne = async (id) => {
    let event = await app.db('events').where({ id: id }).first();
    let owner = await app.db('users').where({ id: event.user_id }).first();
    let date_owner = owner.available_dates.split(',');
    let date_alygned = '';
    let friends_id = [];
    let friends = [];

    friends_id = await app.db('groups').where({event_id: event.id});

    for(let i = 0; i < friends_id.length; i++){
      let userDb = await app.db('users').where({ id: friends_id[i].user_id }).first();
      let newUser = { id: userDb.id, name: userDb.name, email: userDb.email, available_dates: userDb.available_dates }
      friends.push(newUser);
    };
    
    for(let i = 0; i < friends.length; i++){
      let dates = friends[i].available_dates.split(',');
      dates.sort();
      let alygned = dates.includes(date_owner[0]);
      if (alygned){
        date_alygned = date_owner[0];
      }
    }

    let alignedEvent = { name: event.name,location: event.location, date: date_alygned, user_id: event.user_id }

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
    save, find, findAll, update, remove, findById, saveFriends, alyne, findMyEvents
  };
};
