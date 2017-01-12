process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

const paths = require('../webpack/paths');
const runPrebuild = require('../webpack/runPrebuild');

const dependencies = [
  {
    development: true,
    dependencies: ['dev'],
    dev: [
      'redux-devtools',
      'redux-devtools-dock-monitor',
      'redux-devtools-log-monitor',
      'redux-logger',
      'core-js',
      'babel-polyfill',
      'humps',
      'lodash',
      'normalizr',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
    ],
  },
  {
    development: false,
    dependencies: ['polyfill', 'common', 'react'],
    polyfill: [
      'babel-polyfill',
    ],
    common: [
      'humps',
      'lodash',
      'normalizr',
    ],
    react: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
    ],
  },
]

runPrebuild(dependencies);
