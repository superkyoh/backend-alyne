const app = require('express')();
const consign = require('consign');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./config/db/alyne.db', err => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to Alyne database.');
});
 
db.run('CREATE TABLE users(email text, password text, token text)');
db.close();

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  if (name === 'ForbiddenResourceError') res.status(403).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});


module.exports = app;
