module.exports = ({ env }) => {

  return {
    connection: {
      client: "postgres",
      connection: {
        host: env('DATABASE_HOST', '/var/run/postgresql'),
        port: env('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        schema: 'public',
        ssl: {
          rejectUnauthorized: false,
        }
      },
      debug: false,
    },
  };
};
