// Strapi v5 Database Configuration
// Note: Use 'sqlite' as client name (Strapi recognizes this)
// The better-sqlite3 package is used automatically when sqlite is specified
module.exports = ({ env }) => {
  const filename = env('DATABASE_FILENAME', '.tmp/data.db');
  
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: filename,
      },
      useNullAsDefault: true,
    },
  };
};
