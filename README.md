# Learnings

- let 和 const 声明的变量虽然会提前保存在作用域中，但是会存在暂时性死区，无法在声明前使用
- api 函数内部如同时存在多个 send 方法会报错，如果有，应通过 return 一个 send 方法 的方式退出函数
- node.js中查找路径时，'./'表示主目录，即node运行的文件所在目录，'../'表示上一级目录，`${__dirName}`表示当前文件所在目录
- 使用"\* 1"的方法，可以快速将字符串转换为数字，这是一个nice trick
- 可以使用slugify工具将字符串转换为url友好的格式（也可以规定大小写）
- 后端开发黄金准则：不要相信前端传来的数据，所有数据都应经过验证处理
- 覆盖函数的参数不是一个好主意，应尽量避免。如实在有需要，可以重新硬拷贝变量（解构配合...）
- 实际开发中，程序可能会因为多种原因崩溃，对于潜在的可能原因，应当使用多种方法应对这种崩溃，当程序出错时，主动结束进程是根据情况而定。如有必要，应等待数据库请求完成，再结束服务器和进程。
- process崩溃后，应有工具立即重启服务器
- 使用process.on()监听未捕获的异常和未捕获的拒绝，并优雅地关闭服务器
- 在真实开发场景中，应直接在可能出错的位置完善出错处理，依靠外部handler不是一个很好的实践方式
- 设计用户信息表时，应铭记：永远不能明文存储密码，密码需要加密
- 使用mvc架构时，建议使用thin controller/fat model的模式，controller负责应用逻辑（如路由、请求响应等），model负责业务逻辑（如数据库操作、数据验证等）
- 在model文件中处理密码加密，更加符合我们提到的mvc架构的规范
- 对象字面量是一个静态的数据结构声明，{this.something} 这样的语法在对象字面量中是不合法的
- 服务器一般只支持http协议，https需额外导入配置
- jwt.verify是一个同步方法，但是传入回调函数后，会产生异步的效果。如果想使用同步的写法，使得后续代码可能及时正确获得jwt.verify的结果，可以使用promisify方法，将jwt.verify包装为promise对象，然后使用await调用。这是一个历史问题，jsonwebtoken库诞生于2013年，而es6在2015年才发布。传统的写法是将后续的代码包裹在回调函数中，然后使用try catch捕获错误（诞生于1999年，es3）。
- 跟密码有关的操作，保存时应使用save而不是update，因为我们希望保存时能完整验证新的数据，也希望能触发中间件，比如密码加密等。

# Express.js

- 使用use方法来使用中间件，默认情况下参数为(req, res, next)，参数可以省略
- 当中间件有4个参数时，express会知道这是一个错误处理中间件，参数顺序为(err, req, res, next)
- 将创建的err传入next()，express会跳过其他中间件，而将err传递给我们定义的4参数错误处理中间件
- express错误处理中间件应放在所有中间件之后，且在所有路由之后，因为错误处理中间件需要捕获前面所有中间件和路由的错误
- 如果在错误处理中间件中调用 next()，错误会传递给下一个错误处理中间件

# Problems

- 初始化 Github 项目时，使用自带的图形化 git 工具，经常无法 push 代码，手动 push 后成功推动了代码
- 编写 express 中间件时，永远不能忘记调用 next 函数
- express 中间件丰富，使用方法多样，需要多练习、多积累
- Windows 默认的命令行（如 CMD 或 PowerShell）不能直接识别 NODE_ENV=production 的方式来设置环境变量, 需使用 cross-env 作为开发依赖
- 实测发现CastError不再是mongoose的返回的错误name名之一，不能使用name字段处理
- 上一个问题可以改为使用kind字段处理，CastError的kind为ObjectId
- 重复命名错误中，无法再获取errmsg，只能通过keyValue获取重复的值
- 当在异步函数中发生错误时，必须通过 next(err) 传递给错误处理中间件，否则 Express 无法捕获到错误
- 配置忘记密码方法时，需要将passwordResetToken和passwordResetExpires字段保存到数据库中，直接保存会报错：缺少email和password字段等。需要在save方法中添加validateBeforeSave: false，方可解决
- 在userModel文件的中间件中处理passwordChangedAt字段时，为图方便，将其与之前的密码加密中间件放在一起，导致新创建的用户密码未加密，通过分开处理，可以解决这个问题

# DataBase

- MongoDB 使用 BSON 格式，在 compass 的 mongoShell 实际操作时发现，document 的键不需要引号包裹，但值需要引号（单双引号均可）
- MongoDB Atlas 需要配置 IP 地址白名单，否则无法连接。或者可以在 cluster 配置里允许所有 IP 地址连接
- 发送的部分键值对，如果不在schema中，则会被忽略，不会存入数据库
- Fields limit 可以减少发送的数据量，这也被称为"投影"操作（Projecting），即只发送部分字段
- 发送limit操作请求时，所有字段要么都不加'-'，要么都加'-'， 不能同时使用
- 可以在schema中设置select为false，这样在查询时，该字段不会返回。这样可以隐藏一些敏感数据
- countDocuments 是Model上的一个方法，可以返回查询到的document数量
- MongoDB 的query对象类似于supabase的Client，可以链式调用，如find().skip().limit()等，需要多积累，多练习
- 利用中间件，配合alias路由，可以方便地保存一些常用的路由，比如/top-5-cheap，使用中间件修改query参数，实现最终目的
- 在编辑alias路由时，需注意与其他已有路由的匹配关系，尽量放在已有路由之前
- aggregate pipeline 是一个很有用的工具，它可以对原始数据进行过滤、分组（通过\_id）、排序等，返回新的统计数据
- 箭头函数没有this，mongoose许多地方（比如model的virtual property）需要使用this指针指向对应的对象，此时应使用function函数
- Document Middleware方法也有next参数，如果只有一个pre中间件时（且pre非异步方法），可以不调用next，如果有多个pre中间件时，必须调用next，否则会阻塞后续post中间件
- Document Middleware针对不同方法，在document的不同阶段执行前调用，例如save方法会在save()和create()方法前调用
- 在model中新加一个字段时，mongoose会将字段的默认值赋给已有的document，使用postman等工具可以看到变化，但数据库中的数据并不会自动更新，该字段本质上仍是未定义的。使用query中间件是需注意：原来的数据相关字段为null而非设置的默认值
- mongoose不同的中间件中，this指向的对象不同，是什么中间件，this就指向什么对象
- AGGREGATION MIDDLEWARE中的pipeline属性是一个异步函数，需使用()调用，不然无法得到正确结果
- express 的all方法可以匹配所有请求方法，可以把app.all('\*')放在所有路由之后，用于处理所有未匹配到的路由
- mongoose的schema model中的validate方法，只在create和save方法中有效，在其他诸如update方法中无效
- Document Middleware 中的 this 指向当前文档，Query Middleware 中的 this 指向当前查询，Aggregate Middleware 中的 this 指向当前聚合对象
- mongoose Schema上的instance methods 在所有document实例中都可以使用，可以利用实例方法，在model中添加密码校验方法
- 在返回登录错误信息时，不分开提示账号错误和密码错误，统一提示'Incorrect email or password'，可以有效防止攻击者通过错误信息判断账号是否存在
- mongoose的document上的isNew属性，可以判断document是否是新创建的，不需要调用这个属性

# Techniques

- 全局limit，可以限制所有用户的请求频率，防止恶意攻击
- Secure HTTP HEADERS: 应当尽早在app.use中使用，这样就能及时添加header
- DATA SANITIZATION: 数据清理，防止XSS攻击
- Restrict the size of request body: 限制请求体的大小，防止恶意攻击, 具体使用方法：app.use(express.json({ limit: '10kb' }))
