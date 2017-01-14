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

function createVendorPicker(dependencies) {
  const regExp = new RegExp(`node_modules/(${dependencies.join('|')})($|\/)`);
  return function isExternal(module) {
    var userRequest = module.userRequest;

    if (typeof userRequest !== 'string') {
      return false;
    }

    return regExp.test(userRequest);
  }
}


function addVendors(paths, vendors) {
  const { dependencies } = vendors;
  return dependencies.map(function(dependency, index) {
    return new webpack.optimize.CommonsChunkPlugin({ // [1]
      name: dependency,
      chunks: ['main'].concat(dependencies.slice(index + 1)),
      minChunks: createVendorPicker(vendors[dependency]),
    });
  }).reverse();
}


function runBuild(paths, vendors = []) {
  const config = WebpackProdConfigFactory({
    paths,
    config: {
      plugins: [
        ...(addVendors(paths, vendors) || []),
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
