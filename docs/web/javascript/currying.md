

# 函数柯里化 和函数反柯里化

## 函数柯里化

柯里化的定义：柯里化是将使用多个参数的一个函数，通过拆分参数的方式，转换成一系列使用一个参数的函数。

函数的柯里化，返回的是一个参数的函数。其实现方式是需要依赖参数以及递归，通过拆分参数的方式，来调用一个多参数的函数方法，增加可读性的目的。

```js

function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`
}
console.log(isType([], 'Array'))
//true

//把上面的函数通过拆分参数的方式，将使用多个参数的一个函数转换成一系列使用一个参数的函数
function isType(type){
    return function(value){
            return Object.prototype.toString.call(value) === `[object ${type}]`
    }
}
let isArry = isType('Array');
console.log(isArry([]))
//true
```

柯里化的通用化实现： 

通过一个柯里化函数实现通用的柯里化方法
```js
//支持多参数传递
//es6实现
function isType(type){
    return function(value){
        return Object.prototype.toString.call(value) === `[object ${type}]`
    }
}
let  currying = (fn,arr=[]) =>{
    let len = fn.length;  //这里获取的是函数参数的个数
    //  console.log(len)
    return function(...args){  //每次执行传入的参数
        //高阶函数
       let  _arr = [...arr, ...args] //合并上次传入的参数到arr数组
        if (_arr.length < len) {
            return currying(fn, _arr) //递归不停的产生函数
        } else {
            return fn(..._arr)
        }
    }
}

let isArray = currying(isType)('Array');
let isString = currying(isType)('String');

//es5实现
// 支持多参数传递
function currying(fn, args) {
    var args = args || [];//用来存储所有传入的参数
    var _this = this;
    var len = fn.length;
    return function () {
        var _args = Array.prototype.slice.call(arguments) //把arguments转换成数组  用来存放每次递归传过来的参数
         _args = args.concat(args)
        // 如果参数个数小于fn.length，则递归调用，继续收集参数
        if (_args.length < len) {
            return currying.call(_this, fn, _args)
        } else {
            // 参数收集完毕，则执行fn
            return fn.apply(_this, _args)
        }
    }
}
//ts实现
const curring = (fn:Function) =>{//sum
    const exec =(sumArgs:any[]=[])=>{
        return sumArgs.length<fn.length? (...args:any[]) =>exec([...sumArgs,...args]): fn(...sumArgs)
         
    }
    return exec() //用于收集每次传入的参数，第一次默认是空的
}

```

## 反柯里化

  - 柯里化：方法的范围变小了（isType => isString/isArray） 方法的范围变小了
  - 反柯里化：范围变大了

```js
//   ---------分割线----------------------
/*  let toString = Object.prototype.toString;
   console.log(toString.call(123)) 
*/
//   ---------分割线----------------------
  Function.prototype.unCurrying = function(){
     return (...args)=>{ //将所有参数组成一个数组
         /* this.call 这样调用call方法，可能并不是原型上的call方法，可能是用户自己定义的
            防止用户自定义了call方法，这里调用原型上的call方法
           借用原型上的call方法  apply：主要就是改变this,并且传入参数 
           第一个call是找到call函数，第二个apply是让call执行
           让call方法上的this变成了toString(...args),让toString执行
           */
         return Function.prototype.call.apply(this,args)
     }
  }
  let toString = Object.prototype.toString.unCurrying();
  //toString原来只是原型上的，现在变成全局的了，其他原型的方法都可以通过这样变为全局的方法
  console.log(toString(123))

```  


## 函数柯里化经典面试题：
```js
function add(a, b, c, d, e) {
    return a + b + c + d + e
}
let sum = currying(add)
console.log(sum(1, 2)(3, 4)(5))
```
  
