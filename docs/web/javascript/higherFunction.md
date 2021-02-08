# 高阶函数  

什么是高阶函数： 把函数作为参数或者返回值的一类函数。

1、如果一个函数的参数是一个函数（回调函数就是一种高阶函数）

2、如果一个函数返回一个函数（当前这个函数就是高阶函数）

百度百科上面的定义：
> AOP(面向切面的编程)主要是将一些与核心业务逻辑模块无关的功能抽离出来，这些功能通常包括日志统计，安全控制，或者是异常处理等等。

总结：
简单的AOP实现，就是在原函数执行的前后，增加运行before和after两个增强方法，用这个新函数替换原函数，
用途：日志记录，性能统计，安全控制，事务处理，异常处理等等。日志记录，性能统计，安全控制，事务处理，异常处理等等。


## before 函数

给某个方法添加一个方法在它执行之前调用

<!-- code runner //运行代码的插件 -->

```js
//写一个业务代码，扩展当前的业务代码
function say() {
    console.log('say', a, b)
}
```

1、使用箭头函数的形式：

```js
function say(a, b) {
    console.log('say', a, b)
}
Function.prototype.before = function (callback) {
    return (...args) => {
        //箭头函数改变this指向say()  //...args剩余参数  箭头函数没有this也没有argument
        callback();
        this(...args) //扩展运算符 apply的用法
           // console.log(this)  [Function: say]
    }
}
let beforeSay = say.before(function () {
    console.log('befor say')
})
beforeSay('hello', 'word')
```

> ...args 有两个用法
> 1、在函数参数的时使用,...args 是接收所有的参数。存到一个数组
> 2、在函数调用的时候使用，是展开参数，一个个传给另一个函数

2、未使用箭头函数的形式

```js
function say(a) {
    console.log('say')
    console.log(a)
}
Function.prototype.before = function (callback) {
    let _this = this
    return function () {
        callback.apply(this, arguments)
        _this.apply(this, arguments)
    }
}
let beforeSay = say.before(function (b) {
    console.log(2)
    console.log(b)
})
beforeSay([3, 2, 1])
```
##  after函数(多个异步请求同时获取最终结果)

示例：
```js
//多个异步请求同时获取最终结果
//常规解决办法
let fs = require('fs')
let school = {};
let index = 0;
const cb = () => {
    if(++index==2){
        console.log(school)
    }
}
fs.readFile('./name.txt', 'utf8', function (err, data) {
    //    console.log(data)
    school.name = data;
    cb()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    // console.log(data)
    school.age = data;
     cb()
})
//{ name: 'yx', age: '100' }
```



### 使用after函数

```js
let fs = require('fs')
let school = {};
fs.readFile('./name.txt', 'utf8', function (err, data) {
    school.name = data;
    cb()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    school.age = data;
     cb()
})

// ES5实现
function after(items,callback){
     return function(){  //闭包函数   函数定义的作用域和函数执行的作用域
         if(--items==0){
            callback() 
         }
     }
}
let cb = after(2,function(){
     console.log(school)
})
//es6实现
const after = (times, callback) => () => {
    if (--times === 0) {
        callback()
    }
}
const cb = after(2, () => {
    console.log(school)
})

```
**使用fs模块读取json出现了错误'no such file or directory'原因如下：**

  - 使用nodejs的fs模块读取文件时习惯用相对路径，但是运行的时候出现了上述的错误，原因就是fs模块读取文件的相对路径是以启动server.js的位置为基准的，而不是以server.js文件的位置。 
  - nodejs官方推荐在使用fs模块读取文件时使用绝对路径，而不是相对路径。
  - 但是写绝对路径又有些许麻烦，那该如何解决呢，参考以下代码就可以啦：

```js
const fs = require('fs');//可以读取文件
let path = require('path');
let PUBLIC_PATH = path.resolve(__dirname, 'name.txt');
let PUBLIC_PATH1 = path.resolve(__dirname, 'age.txt');

function after(times,callback){ // 高阶函数  可以暂存变量
    let obj = {};
    return function(key,val){
        obj[key] = val;
        --times == 0 && callback(obj);
    }
}
let fn = after(2,(obj)=>{
    console.log(obj);
})
fs.readFile(PUBLIC_PATH,'utf8',(err,data)=>{
    fn('name',data);
})
fs.readFile(PUBLIC_PATH1,'utf8',(err,data)=>{
    fn('age',data);
})

```

ts里面找不到require
```ts
TS2304: Cannot find name 'require' 
```
解决办法：
安装@types/node，它定义了require
```bash
npm install @types/node --save-dev
```
添加到tsconfig.json的types里
```json
{
    "compilerOptions": {
        "types": ["node"]
    }
}
```
在xx.ts里面：
```ts
declare function require(string):any;
```
fs.readFile 读取路径需要绝对路径

```ts
declare function require(string):any;
const fs = require('fs'); // 可以读取文件

interface IPerson {
    age:number,
    name:string
}
function after(times,callback){ // 高阶函数  可以暂存变量
    let obj = {} as IPerson;
    return function(key:string,val:number | string){
        // console.log(obj)
        obj[key] = val;
        --times == 0 && callback(obj);
    }
}
let fn = after(2,(obj)=>{
    console.log(obj);
})

fs.readFile('./name.txt','utf8',(err,data)=>{
    console.log(data)
    fn('name',data);
})
fs.readFile('./age.txt','utf8',(err,data)=>{
    console.log(data)
    fn('age',data);
})

export {}

```


