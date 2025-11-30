module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: '.tmp/development.db',
    },
    useNullAsDefault: true,
  },
});
