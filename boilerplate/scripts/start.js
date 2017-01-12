const paths = require('../webpack/paths');
const runDevServer = require('../webpack/runDevServer');

runDevServer(paths, {
  scripts: ['dev'],
});
