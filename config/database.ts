export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: false,
    },
    pool: { 
      min: 0, 
      max: 10 
    },
    acquireConnectionTimeout: 60000,
  },
});
