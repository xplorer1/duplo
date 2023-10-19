module.exports = {
    port: process.env.PORT || "9000",
    mongo_database: process.env.MONGO_DATABASE_URL,
    pg_database: process.env.PG_DATABASE,
    pg_database_user: process.env.PG_DATABASE_USER,
    pg_database_password: process.env.PG_DATABASE_PASSWORD,
    pg_database_host: 'localhost',
    secret_key: process.env.SECRET_KEY
}