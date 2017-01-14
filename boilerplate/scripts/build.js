const paths = require('../webpack/paths');
const runBuild = require('../webpack/runBuild');

runBuild(paths, {
  dependencies: ['base', 'react'],
  base: [
    'core-js',
    'babel-runtime',
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
});
