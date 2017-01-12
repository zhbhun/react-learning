// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const setupCompiler = require('./setupCompiler');
const WebpackProdConfigFactory = require('./WebpackProdConfigFactory');

// Print out errors
function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function addCaches(paths, assets) {
  const { scripts = [], styles = [] } = assets;
  return scripts.reverse().map(function(script) {
    return new AddAssetHtmlPlugin({
      filepath: path.resolve(paths.appBuildCache, `./js/${script}.js`),
      hash: true,
      includeSourcemap: false,
      outputPath: 'js',
      publicPath: '/js',
      typeOfAsset: 'js',
    });
  })
  .concat(styles.reverse().map(function(style) {
    return new AddAssetHtmlPlugin({
      filepath: path.resolve(paths.appBuildCache, `./css/${style}.js`),
      hash: true,
      includeSourcemap: false,
      outputPath: 'css',
      publicPath: '/css',
      typeOfAsset: 'css',
    });
  }))
  .concat(scripts.map(function(script) {
    return new webpack.DllReferencePlugin({
      context: paths.app,
      manifest: require(paths.appBuildManifest + `/${script}-manifest.json`),
    });
  }));
}


function runBuild(paths, caches = []) {
  const config = WebpackProdConfigFactory({
    paths,
    config: {
      plugins: [
        ...(addCaches(paths, caches)),
      ],
    },
  });

  setupCompiler(config)
  .run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      printErrors('Failed to compile.', stats.compilation.warnings);
      process.exit(1);
    }
  });
}

module.exports = runBuild;
