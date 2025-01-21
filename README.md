# Learnings

- let 和 const 声明的变量虽然会提前保存在作用域中，但是会存在暂时性死区，无法在声明前使用
- api 函数内部如同时存在多个 send 方法会报错，如果有，应通过 return 一个 send 方法 的方式退出函数
- node.js中查找路径时，'./'表示主目录，即node运行的文件所在目录，'../'表示上一级目录，`${__dirName}`表示当前文件所在目录
- 使用“\* 1”的方法，可以快速将字符串转换为数字，这是一个nice trick
- 可以使用slugify工具将字符串转换为url友好的格式（也可以规定大小写）

# Problems

- 初始化 Github 项目时，使用自带的图形化 git 工具，经常无法 push 代码，手动 push 后成功推动了代码
- 编写 express 中间件时，永远不能忘记调用 next 函数
- express 中间件丰富，使用方法多样，需要多练习、多积累
- Windows 默认的命令行（如 CMD 或 PowerShell）不能直接识别 NODE_ENV=production 的方式来设置环境变量, 需使用 cross-env 作为开发依赖

# DataBase

- MongoDB 使用 BSON 格式，在 compass 的 mongoShell 实际操作时发现，document 的键不需要引号包裹，但值需要引号（单双引号均可）
- MongoDB Atlas 需要配置 IP 地址白名单，否则无法连接。或者可以在 cluster 配置里允许所有 IP 地址连接
- 发送的部分键值对，如果不在schema中，则会被忽略，不会存入数据库
- Fields limit 可以减少发送的数据量，这也被称为“投影”操作（Projecting），即只发送部分字段
- 发送limit操作请求时，所有字段要么都不加'-'，要么都加'-'， 不能同时使用
- 可以在schema中设置select为false，这样在查询时，该字段不会返回。这样可以隐藏一些敏感数据
- countDocuments 是Model上的一个方法，可以返回查询到的document数量
- MongoDB 的query对象类似于supabase的Client，可以链式调用，如find().skip().limit()等，需要多积累，多练习
- 利用中间件，配合alias路由，可以方便地保存一些常用的路由，比如/top-5-cheap，使用中间件修改query参数，实现最终目的
- 在编辑alias路由时，需注意与其他已有路由的匹配关系，尽量放在已有路由之前
- aggregate pipeline 是一个很有用的工具，它可以对原始数据进行过滤、分组（通过\_id）、排序等，返回新的统计数据
- 箭头函数没有this，mongoose许多地方（比如model的virtual property）需要使用this指针指向对应的对象，此时应使用function函数
- Document Middleware方法也有next参数，如果只有一个pre中间件时，可以不调用next，如果有多个pre中间件时，必须调用next，否则会阻塞后续post中间件
- Document Middleware针对不同方法，在document的不同阶段执行前调用，例如save方法会在save()和create()方法前调用
