module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/development.db'),
    },
    useNullAsDefault: true,
  },
});