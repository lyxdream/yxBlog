第一部分es6浏览器兼容问题

### babel es5

http://babeljs.io/repl/ 通过babel将高级代码转化成es5
### node

```
node -v
npm install -g n (mac)
```

### let 

var的不足之处：

1、var 不支持封闭作用域

es5的时候只有两种作用域：

> 1、函数作用域
> 2、全局作用域

var 是没有封闭作用域的

如下所示
(1)
``` js
for(var i=2;i<3;i++){
    console.log(i)
}
console.log(i)  //3
console.log(window.i) //3
```
运行结果是：
```
0
1
2
3
3
```
可以发现在for循环外仍然可以访问i，i成了一个全局变量，这不是我们想要的结果。

以前我们的解决办法是：使用函数产生块级作用域

```js
(function(){
    for(var i=0;i<3;i++){
        console.log(i)
    }
})()
console.log(i)
console.log(window.i)
```
运行结果如下：
```js
i is not defined
```
(2)如下代码

```js
for(var i=0;i<3;i++){
    setTimeout(function(){
        console.log(i)
    },1000)
}
```
执行结果：
```js
3
3
3
```
原因：先执行同步的代码，执行完再执行异部，执行完之后i已经为3

解决办法：
```js
for(var i=0;i<3;i++){
    (function(i){
        setTimeout(function(){
            console.log(i)
        },1000)
    })(i)
}
```
运行结果如下：
```js
0
1
2
```
  
  上面的例子使用let 实现

```js
for(let i=0;i<3;i++){
    setTimeout(function(){
        console.log(i)
    },1000)
    //  console.log(i)
}
console.log(i)
```
运行结果如下：

```js
0
1
2
i is not defined
```
可以看出：
 > let和{}可以产生一个作用域,let支持块级作用域声明的变量只会声明在当前作用域内,let可以解决作用域污染和局部作用域的问题

2、var 在同一个作用域下可以多次声明同一个变量

```js
var a=1;
function b(){
    let a  = 1;
    let a = 2;
}
b();
//Identifier 'a' has already been declared  变量被重复申明
```

```js
let a=1;
function b(){
    let a  = 3;
    var a = 1;
    console.log(a)
}
b();
console.log(a)
//SyntaxError: Identifier 'a' has already been declared
```

改成如下就不会报错  因为是两个不同的作用域
```js
var a=1;
function b(){
    let a  = 3;
}
b();
```
> 结论： let 同一个块级作用域内不允许重复申明同一个变量,var在同一个作用域下可以多次声明同一个变量

3、作用域解释问题 变量提升

```js
console.log(a)
var a=1;
console.log(a)
```
执行结果：
```js
undefined
1
```
执行顺序其实是这样的
```js
var a
console.log(a)
a=1;
console.log(a)
```
> 可以看出a变量的声明被提升了

使用let之后：

```js
console.log(a)
let a=1;
console.log(a)
```
执行结果如下：
```js
ReferenceError: Cannot access 'a' before initialization
```
> 可以看出报错了，变量声明不会被提升

```js
let a = 1;
{
    console.log(a);
    let a=2;
}
```
> 暂存死区:如果作用域内有这样一个变量那么这个作用域内就会绑定这个变量，不会继续往上查找了

### 总结：

用let声明的变量特点：

- 只在块级作用域起作用

- 不会出现变量提升现象

- 同一个代码块内，不可以重复声明相同的变量


### const 

const和let一样也是用来声明变量的，但是const是专门用来声明一个常量的

常量的特点：

1、不可修改（引用类型的时候不能修改引用空间）

- 如果是基本数据类型
  
```js
const a = 10;
a = 20;
```
运行结果如下：

```js
TypeError: Assignment to constant variable.
```
会出现一个错误提示，原因是常量不能被修改

- 如果常量是一个对象
  
```js
const a = {name:'lisi'};
a.age = 9;
console.log(a)
```
执行结果如下：
```js
{ name: 'lisi', age: 9 }
```

会发现并没有报错，但是改成下面这样：

```js
const a = {name:'lisi'};
a.age = 9;
a = {};
console.log(a)
```
执行结果如下：
```js
TypeError: Assignment to constant variable.
```
会fa先报错了，因为它企图给a赋新值（新地址）


结论：const声明的变量（基本类型）不能被修改，（引用类型）不能修改变量的地址

2、声明后必须赋值

```js
const name;
```
运行结果：
```js
SyntaxError: Missing initializer in const declaration
```

3、只在块级作用域起作用

```js
if(true){
    const name = "lisi"
}
console.log(name)
//运行结果：ReferenceError: name is not defined
```
4、不可重复声明同一个变量

```js
var a = 10;
const a = 5;
```
运行结果如下：
```js
SyntaxError: Identifier 'a' has already been declared
```
5、不存在变量提升，必须先声明后使用

```js
if(true){
    console.log(name)
    const name = "lisi"
}
//运行结果：ReferenceError: Cannot access 'name' before initialization
```




