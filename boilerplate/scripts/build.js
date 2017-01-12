const paths = require('../webpack/paths');
const runBuild = require('../webpack/runBuild');

runBuild(paths, {
  scripts: ['polyfill', 'common', 'react']
});
