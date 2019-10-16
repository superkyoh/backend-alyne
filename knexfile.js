module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "config/db/alyne.db"
        }   
    },
    migrations: {
        directory: 'migrations',
    }
};