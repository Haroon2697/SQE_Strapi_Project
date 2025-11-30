module.exports = ({ env }) => {
  // Use environment-specific config if it exists
  const envConfig = require('fs').existsSync(`${__dirname}/env/${env('NODE_ENV', 'development')}/database.js`)
    ? require(`./env/${env('NODE_ENV', 'development')}/database.js`)({ env })
    : null;

  // Default SQLite configuration
  const defaultConfig = {
    connection: {
      client: 'sqlite',
      connection: {
        filename: `.tmp/${env('NODE_ENV', 'development')}.db`,
      },
      useNullAsDefault: true,
    },
  };

  return envConfig || defaultConfig;
};
