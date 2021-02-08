


### 异步

览器最早解决异步回调 => promise => generator => async + await


## generator

> Generator函数，又称生成器函数
- 原理是：利用Generator函数暂停执行的作用，可以将异步操作的语句写到yield后面，通过执行next方法进行回调。
- 特点：可以控制函数的执行

**Generator函数和普通函数区别**

- 普通函数用function来声明，Generator函数用function*声明
- Generator函数内部有新的关键字：yield，普通函数没有。

> yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。

**Generator函数运行结果：**

```js
function *hello(){
   yield '你好，'
   return '欢迎来到前端成长指引！'
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite)  //Object [Generator] {}
console.log(ite.next())  //{ value: '你好，', done: false }
console.log(ite.next())  //{ value: '欢迎来到前端成长指引！', done: true }
```
 可以看出函数执行后，
 - 返回了一个：[Object [Generator] {}生成器对象
 - 第1次调用生成器对象ite的next( )方法，返回了一个对象：{ value: '你好，', done: false }
 - 第2次调用生成器对象ite的next( )方法，同样返回一个对象{ value: '欢迎来到前端成长指引！', done: true }

 **Generator函数的执行过程：**
    Generator函数被调用后并不会一直执行到最后，它是先回返回一个生成器对象，等到生成器对象的next( )方法被调用后，函数才会继续执行，直到遇到关键字yield后，又会停止执行，并返回一个Object对象，然后继续等待，直到next( )再一次被调用的时候，才会继续接着往下执行，直到done的值为true。

**yield和teturn的区别**
    yield有点像普通函数的return的作用，但不同的是普通函数只能return一次，但是Generator函数可以有很多个yield。
    而return代表的是终止执行，yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。
 **next()方法传递参数**
  -  next()方法还可以接受一个参数，它的参数会作为上一个yield的返回值
  -  第一次next中传递参数是没有意义的
```js
function *hello(){
    let res = yield '你好，'
    console.log(a)  //undefined
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite.next('hello'))  //{ value: '你好，', done: false }
console.log(ite.next())  //{ value: undefined, done: true }
```
```js
    function *hello(){
    let res = yield '你好，'
    console.log(res)  //欢迎来到前端成长指引！
    let b =  yield res
    console.log(b)//undefined
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite.next())  //{ value: '你好，', done: false }
console.log(ite.next('欢迎来到前端成长指引！'))  //{ value: '欢迎来到前端成长指引！', done: true }
console.log(ite.next())//{ value: undefined, done: true }
```

例子

```js
function *hello(){
    let a = yield 1;
    console.log(a)//1
    let b =  yield 2
    console.log(b)//2
    return 100
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
let {value,done} = ite.next();
value = ite.next(value).value;
console.log(ite.next(value))  //{ value: 100, done: true }
   
```
打开https://babeljs.io/转换一下代码为es2015,可以看到：

```js
 function *hello(){
    let a = yield 1;
    console.log(a)
    let b =  yield 2
    console.log(b)
    let c =  yield 3
    console.log(c)
}
// 转换后：
"use strict";

var _marked = /*#__PURE__*/regeneratorRuntime.mark(hello);

function hello() {
  var a, b, c;
  return regeneratorRuntime.wrap(function hello$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
          a = _context.sent;
          console.log(a); //1

          _context.next = 6;
          return 2;

        case 6:
          b = _context.sent;
          console.log(b); //2

          _context.next = 10;
          return 3;

        case 10:
          c = _context.sent;
          console.log(c); //3

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
```
可以看到生成器函数里面返回了一个regeneratorRuntime对象，regeneratorRuntime对象上有两个方法：mark和wrap，wrap执行后返回一个iterator，iterator上有个next方法，next执行完返回一个对象，对象有两个参数value和done,同时又next的参数作为上一次返回值  context.sent = v;

实现如下：生成器部分代码

```js
class Context{
    constructor(){
        this.next = 0; //执行第几步
        this.done = false;//是否已经完成
    }
    stop(){
        this.done = true;
    }
}

let regeneratorRuntime = {
    mark(genFunc){
        return genFunc;//最外层的generator函数
    },
    wrap(innerFn,outerFn){
        let ite={};
        let context = new Context()
        ite.next = function(v){
            context.sent = v;  //作为上一个yield返回值
          let value = innerFn(context);//next的返回值
            return {
                value,
                done:context.done
            }
        }
        return ite;
    }
}

// 执行以下代码：

let it = hello()
console.log(it.next())
console.log(it.next('a'))
console.log(it.next('b'))
console.log(it.next('c'))

// 可以看到输出结果为：

{ value: 1, done: false }
a
{ value: 2, done: false }
b
{ value: 3, done: false }
c
{ value: undefined, done: true }

```

**扩展：**

数据结构拥有一个叫[Symbol.iterator]()方法的数据结构，就可以被for...of遍历，我们称之为：可遍历对象。比如：数组，字符串，Set和Map结构。

但是Object对象
 ```js
    Object.prototype[Symbol.iterator];
    //结果：undefined
```
可以看到Object对象的原型上没有Symbol.iterator，所以Object不能被for...of遍历

for...of的原理就是：先调用可遍历对象的[Symbol.iterator]( )方法，得到一个iterator遍历器对象，然后就在遍历器上不断调用next( )方法，直到done的值为true的时候，就表示遍历完成结束了。

## 自定义Iterator遍历器

有了[Symbol.iterator]()方法就算是可遍历对象，那么给Object对象手动加上一个[Symbol.iterator]()方法，它就可以被for...of遍历了

```js
const interable = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
interable[Symbol.iterator] = function() {
    let index = 0;
    return { // 遍历器对象
        next: () => {
            return { value: this[index], done: index++ >= this.length }
        }
    }
}
// 咱们来for...of一下
    for(let v of obj){
        console.log(v);
    }
     //a b c
```

> 如果自己去迭代一个对象需要实现一个迭代器接口，返回一个具有next方法的对象。内部会调用这个next方法返回结果包含value和done,当done为true时迭代完成。

执行

```js
 const interable = {0:'a',1:'b',2:'c',length:3};
    interable[Symbol.iterator] = function(){
        let index=0; //执行次数
        return {
            next:()=>{
                let value = this[index];
                let done = index++ >= this.length
                return {value,done}
            }
        }
    }
let iter = interable[Symbol.iterator]();
console.log(iter.next())//{ value: 'a', done: false }
console.log(iter.next())//{ value: 'b', done: false }
console.log(iter.next())//{ value: 'c', done: false }
console.log(iter.next())//{ value: undefined, done: true }

```

## async

- 同步的，底层还是异步的
```js
// 异步串行
function *readAge(filePath){
    let name =yield fs.readFile(filePath,'utf8');
    let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
    return age;
}
let it = readAge('/Users/yinxia/highFunction/src/name.txt');

```

(1)使用回调形式

```js
// generator---------------
let {value,done} = it.next();
Promise.resolve(value).then(data=>{
    console.log(data)
    let {value,done} = it.next(data);
    Promise.resolve(value).then(data=>{
        console.log(data)
        let {value,done} = it.next(data);
        console.log(value,done);
    })
})
```

(2)co-->tj

 安装co=>npm install co

```js
let co = require('co');
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
})
```

(3)vue-router =>beforeEach  next=>next=>next

 ## 实现co
   - readAge('/Users/yinxia/highFunction/src/name.txt');//返回一个ite
   - 还可以then,说明返回了一个promise

 ```js
 function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                Promise.resolve(value).then(data=>{
                    next(data)
                },reject)  //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e,'错误')
})
 ```
(4) it.throw('出错了')，抛错

```js
function *readAge(filePath){
   try{
        let name =yield fs.readFile(filePath,'utf8');
        let age = yield fs.readFile('/Users/yinxia/highFunction/src1/'+name,'utf8');
        return age;
    }catch(e){
        console.log(e)
    }
}
function co(it){
    //递归 异步迭代（函数来迭代）   同步是forEach promise.all
    return new Promise((resolve,reject)=>{
        function next(val){
            let {value,done} = it.next(val);  //val上一次产出的结果  value是yeild产出的结果
            if(done){  //如果完成了就返回最终结果
                resolve(value)
            }else{
                   Promise.resolve(value).then(data=>{
                        next(data)
                },(err)=>{it.throw('出错了')
                 }) 
                //有一个失败就失败了
            }
        }
        next();
    })
    
}
co(readAge('/Users/yinxia/highFunction/src/name.txt')).then(data=>{
    console.log(data)
})
```
（5）async + await

```js
let fs = require('fs').promises;
async function readAge(filePath){
    let name =await fs.readFile(filePath,'utf8');
    let age = await fs.readFile('/Users/yinxia/highFunction/src/'+name,'utf8');
     return age;
 }
 //async执行完后返回的就是一个promise
//  async + await => generator + co
//co自动解析yield方法，自动调用it.next()
 readAge('/Users/yinxia/highFunction/src/name.txt').then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e)
})
```
(6)async + await

```js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);    //it.next(val)
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

function readAge(_x) {
    return _readAge.apply(this, arguments);
} //async执行完后返回的就是一个promise

function _readAge() {
    _readAge = _asyncToGenerator( /*#__PURE__*/ regeneratorRuntime.mark(function _callee(filePath) {
        var name, age;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFile(filePath, 'utf8');

                    case 2:
                        name = _context.sent;
                        _context.next = 5;
                        return fs.readFile('/Users/yinxia/highFunction/src/' + name, 'utf8');

                    case 5:
                        age = _context.sent;
                        return _context.abrupt("return", age);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _readAge.apply(this, arguments);
}

readAge('/Users/yinxia/highFunction/src/name.txt').then(function (data) {
    console.log(data);
}).catch(function (e) {
    console.log(e);
});
```
> 读取文件的地方是绝对路径，大家可以根据自己电脑环境变量的配置自行修改





