// ESLint v9 Configuration
// Compatible with ESLint 9.x flat config format

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
        // Browser globals for Cypress
        document: 'readonly',
        window: 'readonly',
        // Mocha/Cypress globals
        chai: 'readonly',
        before: 'readonly',
        after: 'readonly',
        // Cypress specific
        runnable: 'readonly',
      },
    },
    rules: {
      // Disable rules that might cause issues in Strapi/Node environment
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-console': 'off', // Allow console.log in Strapi
      'no-undef': 'error',
      'no-redeclare': 'error',
    },
  },
  {
    // Cypress-specific configuration
    files: ['cypress/**/*.js', 'cypress/**/*.ts'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        document: 'readonly',
        window: 'readonly',
        chai: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        runnable: 'readonly',
      },
    },
  },
  {
    // Ignore patterns
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.cache/**',
      '.tmp/**',
      '.strapi/**',
      'coverage/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      '*.config.js', // Ignore config files
      'scripts/**', // Ignore scripts
    ],
  },
];

