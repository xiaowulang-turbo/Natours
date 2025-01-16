# Learnings

-   let 和 const 声明的变量虽然会提前保存在作用域中，但是会存在暂时性死区，无法在声明前使用
-   api 函数内部如同时存在多个 send 方法会报错，如果有，应通过 return 一个 send 方法 的方式退出函数

# Problems

-   初始化 Github 项目时，使用自带的图形化 git 工具，经常无法 push 代码，手动 push 后成功推动了代码
-   编写 express 中间件时，永远不能忘记调用 next 函数
-   express 中间件丰富，使用方法多样，需要多练习、多积累
-   Windows 默认的命令行（如 CMD 或 PowerShell）不能直接识别 NODE_ENV=production 的方式来设置环境变量, 需使用 cross-env 作为开发依赖

# DataBase

-   MongoDB 使用 BSON 格式，在 compass 的 mongoShell 实际操作时发现，document 的键不需要引号包裹，但值需要引号（单双引号均可）
-   MongoDB Atlas 需要配置 IP 地址白名单，否则无法连接。或者可以在 cluster 配置里允许所有 IP 地址连接
