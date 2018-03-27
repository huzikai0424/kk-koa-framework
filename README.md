# kk-koa-framework
## 安装	| Install
```shell
	$ mkdir kk-koa
	$ cd kk-koa
	$ npm init
	$ npm install kk-koa-framework
```
### 创建所需要的文件夹
目录结构如下：
```
|-- kk-koa
    |-- app.js    <-- 入口文件
    |-- package-lock.json
    |-- package.json
    |-- assets	  <-- 静态资源存放路径
    |-- config	
    |   |-- routes.js    <-- 路由配置文件
    |   |-- env
    |       |-- base.js    <-- 环境配置文件
	|-- src
    |   |-- controller
    |       |-- index.js    <-- 控制器文件
    |-- views
        |-- index.pug    <--pug 静态模板文件
```
## 初始化 | Init
`app.js`作为一个默认的入口文件，只需简单的引入kk-koa框架并注册
``` javaScript
const Koa = require('kk-koa-framework')
let app = new Koa()
app.setup().startup()
```
框架会自动完成各类初始化事件
## 文件详解 | Detail
#### `config/env/base.js`
`base.js`作为一个环境配置文件，存放一些和环境有关的配置项
示例代码：
``` javaScript
module.exports = {
    session:{
        adapter : 'redis',
        password:'youknowthat',
        host: '10.0.3.24',
        port : 6379,
        db : 1,
        ttl : 20 * 60,
        prefix:'kk/test'
    },
    port:3344
}
```
#### `src/controller/index.js`
`controller`里面写对应的方法，示例代码如下：
```javaScript
module.exports.hello = async(ctx) => {
    ctx.body="hello world"
    console.log("print...")
}
```

#### `config/routes.js`
`routes.js`里面可以写各种路由规则，语法非常简单，示例代码如下：
``` javaScript
module.exports = {
    'post /login':'index.login',
    'get /':'index.hello'
}
```

使用`module.exports`向外导出成模块。
语法为一个json格式的键值对`key:value`
    `key`: `请求类型(post,get) /路径`
    `value`:调用的方法，值为一个对象。该值默认为`src/controller/index.js` 中导出的方法  
如：`index/login`表示`cntroller`下的默认`index.js`文件中的`login`方法
## 渲染pug文件
Pug语法可以参考：[Pug中文文档](https://pug.bootcss.com/language/attributes.html)

假设`views/index.pug`默认如下
``` Pug
doctype html
html
    head
    body
        .div Welcome To KK WEB FRAMEWORK
        div Hello #{user.nickName}
```

要渲染pug文件，我们首先在`controller/index.js`里写对应的方法
``` JavaScript
module.exports.showHome = async(ctx) => {
    ctx.state.user = {      //通过ctx.state转值
        nickName:"Lemon",
        age:21
    }
    await ctx.render('index')   //通过ctx.render()完成渲染，默认为view目录，
                                //传入的变量为文件名，默认文件后缀为.js
}
```

然后在`config/routes.js`中写相应的路由：
``` JavaScript
module.exports = {
   'get /':'index.showHome'
}
```

随后我们运行app.js入口文件
```shell
$ node app.js
```

访问`localhost:3344` 可以看到pug模板文件已经被渲染并显示:
```
Welcome To KK WEB FRAMEWORK
Hello Lemon
```

## Post / Get请求
做一个小小demo，模拟表单提交：
```pug
doctype html
html
    head
        title 欢迎你 --- #{user.username}
    body
        div #{text}
        form(method="post" action="/login")
            span post 请求
            br
            input(type="text", name="username" placeholder="please enter username")
            br
            input(type="password", name="password" placeholder="please enter password")
            br
            input(type="submit", value="submit")
```

在`controller`中写对应的方法
```
module.exports.showHome = async(ctx) => {
    ctx.state.user = {     
        nickName:"Lemon",
        age:21
    }
    await ctx.render('index')   
}

module.exports.getDate = async(ctx) => {
    let {username,password} = ctx.request.body
    ctx.body = {
        username:username,
        password:password
    }
    console.log(`username:${username}`)
    console.log(`password:${password}`)
}
```

写完`controller`后开始写对应的路由。
路由有两种方式，一种是上文提到的写在`config/routes.js`

```javaScript
module.exports = {
    'get /':"index.showHome",
    'post /login':'index.getDate'
}
```

或者直接在`controller`通过设置全局`meta`对象进行配置：

``` javaScript
module.exports.meta ={
    getDate:{
        url:'/login',
        methods:['post'],
        bodyParser:true
    }
 }
```

注意：通过这种方式定义的路由，如果要解析的参数传递方法为`post`，则需要在`controller`中配置`bodyParser:true`

运行入口文件
```shell
$ node app.js
```

我们会看到控制台输出了`username`和`password`的值


# kk-koa-framework
