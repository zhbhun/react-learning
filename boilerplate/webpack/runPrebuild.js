const setupCompiler = require('./setupCompiler');
const WebpackDllConfigFactory = require('./WebpackDllConfigFactory');

/**
 * 编译每一个依赖的入口模块集合，是个递归函数
 *
 * @param  {Object}   dependency @see runPrebuild
 * @param  {Function} callback 每编译完所有依赖时的回调函数
 * @param  {Number}   index 当前编译的依赖索引，默认为 0
 * @return {undefined}
 */
function runBuild(dependency, callback, index = 0) {
  const subDependencies = dependency.dependencies;
  if (index >= subDependencies.length) {
    callback && callback();
    return;
  }
  const subDependency = subDependencies[index];
  const config = WebpackDllConfigFactory({
    entrys: {
      name: subDependency,
      dependencies: subDependencies.slice(0, index),
      entry: dependency[subDependency],
    },
  }, dependency.development);
  const compiler = setupCompiler(config);
  console.log('--------------------------------');
  console.log();
  console.log('Compiling ' + subDependency);
  compiler.run(function(err, stats) {
    if (err) {
      console.error(err);
      return;
    }
    console.log();
    runBuild(dependency, callback, ++index);
  });
}

/**
 * 预编译
 *
 * @param  {Array}  dependencies 依赖集，每个数组元素代表一个项目需要预编译的依赖（一般是第三方库）
 * @param  {Array}  dependencies[].dependencies 依赖关系，用于划分预编译模块，数组前面的元素优先编译，后面元素共享前面的编译模块
 * @param  {Array}  dependencies[].key 每个依赖的模块入口集合
 * @param  {Number} index 编译开始的下标，默认为 0
 * @return {undefined}
 * @example
runPrebuild([
  {
    // 开发环境，可以不用考虑预编译输出文件的体积，所以将所有需要预编译的模块都打包在一个文件里了
    dependencies: ['dev'],
    dev: [
      '...'
    ],
    // 生成 dev.js 和 dev-manifest.json，前者是预编译结果，后者是预编译的模块信息（供开发环境构建使用）
  }, {
    // 生产环境，需要考虑代码划分，平衡各个预编译输出文件的体积，同时也要考虑他们的依赖关系
    // 按 a，b，c 的顺序编译各自的入口模块，b 会复用 a 的预编译模块，c 会复用 a 和 b 的预编译模块
    dependencies: ['a', 'b', 'c'],
    a: [
      '...',
    ],
    b: [
      '...',
    ],
    c: [
      '...',
    ],
    // 生成 a.js，a-manifest.json，b.js，b-manifest.json，c.js，c-manifest.json
  },
]);
 */
function runPrebuild(dependencies, index = 0) {
  if (index >= dependencies.length) {
    return;
  }
  const dependency = dependencies[index];
  runBuild(dependency, function() {
    runPrebuild(dependencies, ++index);
  });
}

module.exports = runPrebuild;
