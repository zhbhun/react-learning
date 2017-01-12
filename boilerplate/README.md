# 目标

- 性能

    - 初始化构建不能超过 30 秒
    - 修改代码的重构时间不能超过 1 秒

- 热加载

    - 组件热加载：支持组件状态不变的前提下，动态替换生命周期函数，事件处理函数，渲染函数，并且支持无状态组件，高阶组件等；
    - Redux 热加载：支持 Redux Store 状态不变的前提下，动态替换初始状态，reducer，action；

- 代码调试

    - 支持查看源代码
    - 支持调试断点

- 代码划分

    - 支持拆分第三方库
    - ...


# 思路
## 入口

- 开发环境：添加热加载模块 `react-hot-loader`，`webpack-dev-server/client`，`webpack/hot/dev-server`
- 生产环境：None

## 输出
要点：文件路径，文件名称，文件版本

- 开发环境

    开发环境的输出资源都是通过服务器访问的，只要注意项目入口的输出路径和文件名就行了。

    - JavaScript：由 `output.filename` 决定，根据自己的需要设置，一般不用设置 hash
    - CSS：使用 `style-loader` 来加载 CSS，实现样式热加载（样式通过 JavaScript 插入页面）
    - Image / Font：利用 `url-loader` 来加载这些静态资源
    - HTML：可以使用插件 `html-webpack-plugin` 来自动生成引用了构建输出资源的页面，也可以自己手动维护一个 HTML 文件来加载构建输出资源，然后交给一个可用的服务器处理
    - 其他：

        - publicPath：影响热加载 TODO
        - pathinfo：使输出文件的每个模块携带路径信息

- 生成环境

    生成环境的输出根路径由 `output.path` 决定，所有静态资源设置的路径都是相对于根路径的。

    - JavaScript：利用 `output.filename` 设置脚本子路径，文件名和版本信息
    - CSS：利用插件 `extract-text-webpack-plugin` 来提取样式文件，可以给该插件传递样式输出的子路径，文件名和版本信息
    - Image / Font：利用 `url-loader` 来加载这些静态资源，可以给该加载器设置输出的子路径，文件名和版本信息
    - HTML：利用插件 `html-webpack-plugin` 来自动生成引用了构建输出资源的页面，由于生成环境的输出资源版本一直变化，所以推荐使用改插件来自动生成 HTML
    - 其他

        - 代码划分命名：`output.chunkFilename`
        - ...

## 加载器
除了生产环境的 CSS 需要使用插件 `extract-text-webpack-plugin` 来处理外，生产环境和开发环境的加载器配置基本一致。

- JavaScript

    - `eslint-loader`：检查 JavaScript 代码，提高代码质量
    - `babel-loader`：转译最新标准或实验性的 JavaScript 语法

- CSS

    - `postcss-loader`：自动添加 CSS 前缀
    - `css-loader`：处理 CSS 中的一些资源路径信息
    - `style-loader`：使用 JavaScript 来插入样式，可以实现样式热加载，只能在开发环境使用
    - `extract-text-webpack-plugin`：必须使用该插件才能输出样式文件

- Image / Font：使用 `url-laoder` 或 `file-loader` 加载

## 插件
- 开发环境

    - `html-webpack-plugin`：自动生成引用了构建输出资源的 HTML，开发环境的输出资源路径可以固定，所以不一定需要使用该插件，也可以自己手工维护
    - `webpack.DefinePlugin`：定义环境变量，默认是开发环境，所以也可以不用配置
    - `webpack.HotModuleReplacementPlugin`：热加载实现插件，必须添加
    - `case-sensitive-paths-webpack-plugin`：强制要求 webpack 区分模块路径的大小写
    - `react-dev-utils/WatchMissingNodeModulesPlugin`：修正 webpack 不监听 node_mode1es 变化的问题，例如：编码时提示模块缺失，安装该模块后，webpack 开发服务器还是不能识别，必须重启服务器才行
    - `webpack.NoErrorsPlugin`：编译出错时，禁止输出资源
    - `webpack.optimize.DedupePlugin`：减少重复的模块

- 生成环境

    - `webpack.NoErrorsPlugin`：较少重复的模块
    - `html-webpack-plugin`：自动生成引用了构建输出资源的 HTML，生成环境的输出资源的名称一般都需要携带版本信息，所以推荐使用该插件来自动生成 HTML
    - `webpack.DefinePlugin`：设置生成环境标识，用于优化 React，否则 React 运行很慢（存在属性检测）
    - `webpack.optimize.OccurrenceOrderPlugin`：优化模块输出顺序？
    - `webpack.optimize.DedupePlugin`：减少重复的模块
    - `webpack.optimize.UglifyJsPlugin`：压缩代码，较小文件体积
    - `extract-text-webpack-plugin`：设置样式输出路径

# 其他
要点：缓存，source-map 等

- 开发环境

    - `cache`：缓存生成的模块，可以提升构建性能
    - `debug`：具体作用？
    - `source-map`：`cheap-module-source-map` 或 `eval`，前者可以在浏览器里还原成完整的源代码，后者只显示编译后的代码，这个根据个人喜好配置

- 生产环境

    - `bail`：开启后在遇到错误时可以停止继续构建
    - `cache`：？
    - `source-map`：根据需要设置

# 优化
按照上文的思路设置，基本可以实现构建打包了。但是在使用中，我们还会遇到一些问题：

- 开发服务器的日志包含大量的模块输出信息，影响阅读
- 开发服务器热加载时间较长，每次改为代码后，都必须稍等下才能看到页面刷新
- ...

## 日志优化
日志要求

- webpack 在构建时，提示构建进度信息；
- webpack 显示构建统计信息：开始时间，结束时间，使用时间等；
- webpack 显示构建失败信息：错误行，错误原因等；
- 浏览器网页显示构建失败信息：错误行，错误原因等；
- 浏览器控制台显示运行时错误信息：错误行，错误原因；

    - 依赖未引入导致的 undefined，例如：react；
    - 组件回调函数的作用域问题；
    - ...

实现插件

- [friendly-errors-webpack-plugin](https://www.npmjs.com/package/friendly-errors-webpack-plugin)：优化构建日志信息
- [progress-bar-webpack-plugin](https://www.npmjs.com/package/progress-bar-webpack-plugin)：显示构建进度信息

## 性能优化
使用 webpack 内置的 Dll 插件来预编译第三方代码。

- [DllPlugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin)
- [DllReferencePlugin](http://webpack.github.io/docs/list-of-plugins.html#dllreferenceplugin)

---

# 安装依赖
- webpack

    ```
    yarn add webpack@^1.14.0 --dev
    yarn add webpack-dev-server@^1.16.2 --dev
    yarn add babel-loader@^6.2.7 --dev
    yarn add case-sensitive-paths-webpack-plugin@^1.1.4 --dev
    yarn add css-loader@~0.23.1 --dev
    yarn add eslint-loader@^1.6.1 --dev
    yarn add extract-text-webpack-plugin@^1.0.1 --dev
    yarn add file-loader@~0.9.0 --dev
    yarn add html-webpack-plugin@^2.26.0 --dev
    yarn add add-asset-html-webpack-plugin@^1.0.2 --dev
    yarn add less-loader@^2.2.3 --dev
    yarn add postcss-loader@~1.1.1 --dev
    yarn add react-hot-loader@3.0.0-beta.6 --dev
    yarn add style-loader@^0.13.1 --dev
    yarn add url-loader@~0.5.7 --dev
    yarn add progress-bar-webpack-plugin@^1.9.2 --dev
    ```

- babel

    ```
    yarn add babel-core@^6.21.0 --dev
    yarn add babel-preset-es2015@^6.18.0 --dev
    yarn add babel-preset-react@^6.16.0 --dev
    yarn add babel-preset-stage-2@^6.18.0 --dev
    ```

- less + autoprefixer

    ```
    yarn add less@^2.6.1 --dev
    yarn add autoprefixer@^6.3.6 --dev
    ```

- eslint

    ```
    yarn add babel-eslint@^7.1.0 --dev
    yarn add eslint@^3.10.0 --dev
    yarn add eslint-plugin-babel@^3.3.0 --dev
    yarn add eslint-plugin-import@^2.2.0 --dev
    yarn add eslint-plugin-jsx-a11y@^2.2.3 --dev
    yarn add eslint-plugin-react@^6.6.0 --dev
    ```

- flow

    ```
    yarn add flow-bin --dev
    ```

- others

    ```
    yarn add chalk@^1.1.3 --dev
    yarn add dotenv@^4.0.0 --dev
    yarn add rimraf@2.5.4 --dev
    yarn add react-dev-utils@~0.4.2 --dev
    yarn add recursive-readdir@^2.1.0 --save
    yarn add redux-devtools@^3.3.1 --dev
    yarn add redux-devtools-dock-monitor@^1.1.1 --dev
    yarn add redux-devtools-log-monitor@^1.0.11 --dev
    yarn add redux-logger@^2.6.1 --dev
    ```

- app

    ```
    yarn add babel-polyfill@^6.20.0
    yarn add humps@^1.1.0
    yarn add lodash@^4.16.1
    yarn add normalizr@^2.2.1
    yarn add react@^15.3.0
    yarn add react-dom@^15.3.0
    yarn add react-redux@^4.4.5
    yarn add react-router@^2.6.1
    yarn add react-router-redux@^4.0.5
    yarn add redux@^3.5.2
    yarn add redux-thunk@^2.1.0
    ```

# 环境配置
## Webpack
- `./webpack/env.js`

    环境变量设置

- `./webpack/paths.js`

    路径设置

- `./webpack/rundDevServer.js`

    启动开发服务器，考虑以下几点：

    - `hot`：热加载，入口添加 `react-hot-loader` 和 `react-dev-utils/webpackHotDevClient`，插件添加 `HotModuleReplacementPlugin`；
    - `historyApiFallback`：支持 HTML5 History 路由；
    - `quiet`：webpack 开发服务器的默认日志可读性较差，使用该选项关闭日志，使用 webpack 事件和插件自行改进
    - `watchOptions`：忽略 node_modules 的模块变动，可以提升一些性能
    - ...

- `./webpack/setUpCompiler.js`

    监听 webpack 刷新和完成事件，利用 `chalk`，`react-dev-utils/clearConsole` 和 `react-dev-utils/formatWebpackMessages` 优化 webpack 的日志输出。此外，利用 `ProgressPlugin` 插件显示初始化和重编译进度。

- `./webpack/WebpackDevConfigFactory.js`：开发服务器配置生成器

    入口

    - `react-hot-loader/patch`：实现 React，Redux 热加载
    - `react-dev-utils/webpackHotDevClient`：代替 `webpack-dev-server/client` 和 `webpack/hot/dev-server` 实现热加载，出现语法错误时可以在网页上层显示相关的语法错误日志。

    加载器

    - `DedupePlugin`：去除重复的模块
    - `eslint-loader`：检查源代码
    - `babel-loader`：编译源代码
    - `less-loader`：预处理 LESS 代码
    - `postcss-loader`：自动设置 CSS 前缀
    - `css-loader`：处理 CSS 中的资源路径
    - `style-loader`：转译 CSS 为 JavaScript 代码
    - `file-loader`：加载 svg 文件
    - `json-loader`：加载 JSON 文件
    - `url-loader`：加载除了 html，js，css，json，svg 之外的文件

    插件

    - `InterpolateHtmlPlugin`：篡改 HTML 变量
    - `HtmlWebpackPlugin`：生成包含打包静态资源的 HTML
    - `DefinePlugin`：定义全局变量
    - `HotModuleReplacementPlugin`：热加载插件
    - `CaseSensitivePathsPlugin`：强制 webpack 区分路径大小写
    - `WatchMissingNodeModulesPlugin`：监听缺失模块的安装情况
    - `NoErrorsPlugin`：编译错误时，阻止生成静态资源

## Babel
- es2015
- stage-2
- react

## ESLint
- 编译器：采用 `babel-eslin` 作为 ESLint 的编译器，可以支持一些实验性的语法，例如：类属性。
- 编译器选项：选择语言版本，源代码类型，以及一些语言特性，例如：JSX，严格模式等
- 环境：支持 browser，node，commonjs，es6，amd 相应的全局变量
- 插件：babel，import，jsx-a11y，react
- 继承：ESLint 推荐配置
- 规则：一些争议配置

## Flow
TODO

# 开发工具
## Atom
- Nuclide
- ...

## Chrome
- React Dev Tool
- Redux Dev Tool
