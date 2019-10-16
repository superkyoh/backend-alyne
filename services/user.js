const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'email']);
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswdHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Name is required');
    if (!user.email) throw new ValidationError('Email is required');
    if (!user.password) throw new ValidationError('Password is required');

    const userDb = await findOne({ email: user.email });
    if (userDb) throw new ValidationError('User already exists');

    const newUser = { ...user };
    newUser.password = getPasswdHash(user.password);

    return app.db('users').insert(newUser, ['id', 'name', 'email']);
  };

  return { findAll, save, findOne };
};