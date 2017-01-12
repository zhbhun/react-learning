React 模板模板。

模板特性

- 热加载：React，Redux
- 高性能：构建和重构时间较短
- ...

项目结构

```
.
├── build
│   ├── assets
│   ├── cache
│   └── manifest
├── doc
│   ├── ...
├── package.json
├── public
│   ├── ...
├── scripts
│   ├── build.js
│   ├── prebuild.js
│   └── start.js
├── src
│   ├── ...
├── webpack
│   ├── env.js
│   ├── paths.js
│   ├── runBuild.js
│   ├── runDevServer.js
│   ├── runPrebuild.js
│   ├── setupCompiler.js
│   ├── WebpackDevConfigFactory.js
│   ├── WebpackDllConfigFactory.js
│   ├── WebpackProdConfigFactory.js
│   └── WebpackProgressBarHandler.js
└── yarn.lock
```

# 用法
## 安装依赖

- 开发依赖：webpack，babel，eslint 等
- 生产依赖：react，redux，react-router 等

## 路径配置
项目的路径信息默认配置在 `webpack/paths.js`，主要包含项目的源代码输入，构建输出等路径信息。

- `app`：根路径
- `appBuild`：构建输出路径
- `appBuildAssets`：生产环境的构建输出路径
- `appBuildCache`：预编译构建输出路径
- `appBuildManifest`：预编译构建信息存储路径
- `appPublic`：静态资源路径
- `appHtml`：入口 HTML 页面路径
- `appIndexJs`：源代码入口路径
- `appPackageJson`：`pacakge.json` 路径
- `appSrc`：源代码路径
- `appNodeModules`：第三方依赖路径

## 脚本设置
- `scripts/prebuild.js`

    第三方依赖一般是手工维护的，并不需要每次构建都重新编译。为了提升构建速度，该项目将第三方依赖预先编译。

- `scripts/start.js`

    启动开发服务器

- `scripts/build.js`

    生成环境构建

## 运行命令

- `npm run lint`：检查代码
- `npm run prebuild`：预编译
- `npm start`：启动开发服务器
- `npm run build`：生产环境编译

备注：运行开发环境和生产环境之前，必须先预编译。

# 进阶
参考 `doc/实现思路`。
