module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "config/db/alyne.db"
        },
        useNullAsDefault: true   
    },
    migrations: {
        directory: 'migrations',
    }
};