## es6相关的面试题


### 1、如何自己实现一个类模版字符串的功能

```js
// 如何自己实现一个类模版字符串的功能
let name = 'yx';
let age = 9;
let str = 'hello${name}今年${age}了'

// replace 第二个参数，必需。一个字符串值。规定了替换文本或生成替换文本的函数。
// eval(string) string:必需。要计算的字符串，其中含有要计算的 JavaScript 表达式或要执行的语句。
str = str.replace(/\$\{([^}]*)\}/g,function(){
    console.log(arguments)
    // eval('name')   eval('age')
    return eval(arguments[1])
})
console.log(str)

//[Arguments] {
//     '0': '${name}',
//     '1': 'name',
//     '2': 5,
//     '3': 'hello${name}今年${age}了'
//   }
//   [Arguments] {
//     '0': '${age}',
//     '1': 'age',
//     '2': 14,
//     '3': 'hello${name}今年${age}了'
//   }
//   helloyx今年9了
```
### 2、带标签的模版字符串

实现功能：给所有模版字符串中变量加上*号
```
let name = 'yx';
let age = 9;
function tagFn(){  //第一个参数是字符串的数组，第二个参数是第一个变量，第三个是第三个变量
    console.log(arguments);  //[Arguments] { '0': [ 'hello', '’今年', '了' ], '1': 'yx', '2': 9 }
    let strings = arguments[0];
    let values = [].slice.call(arguments,1);    //如果想把第一个参数除外的剩余的参数转换成数组 //把arguments转换成一个真正的数组，从arguments第一位之后项开始
    console.log(strings,values)  // 'hello', '’今年', '了' ] [ 'yx', 9 ]
    let str = "";
    for(let i=0;i<values.length;i++){
        str+= `${strings[i]}*${values[i]}*`
    }
    str +=strings[strings.length-1];
    return str;
    // return 100
}
let str = tagFn`hello${name}今年${age}岁了`
//标签（函数）返回什么，结果就是什么
console.log(str)
//hello*yx*今年*9*岁了
```

如果想把第一个参数除外的剩余的参数转换成数组
```
//...叫剩运算符 就是把多余的都放到一个数组中
let fn = (x,...arrgs)=>{
    console.log(arrgs)
}
fn('x',1,2,3,4,5)

//[ 1, 2, 3, 4, 5 ]
```

### 3、高阶函数
```
function a(c){
    return function(d){
        return {sum:c+d}
    }
}
或者：
let a = c =>d =>({sum:c+d})
console.log(a(1)(2))
```

### 4、箭头函数

箭头函数 箭头函数中没有this 会向上查找

箭头函数特点：

> 1、箭头函数没有function关键字

> 2、小括号和大括号之间有个箭头

> 3、如果参数是一个，可以省略小括号

> 4、如果没有return 可以不写大括号

> 5、如果直接返回的是对象，需要小括号包裹

> 6、 箭头函数中没有arguments

> 7、函数可以赋予默认参数

解决this指向问题：前面是谁就是谁

```
let obj = {
        b:1,
        a:function(){
            let that = this;
            setTimeout(()=>{
                console.log(that)
            },1000)
        }
    }
    obj.a()  //this指向obj
```

```
let obj = {
        b:1,
        a:()=>{
            setTimeout(()=>{
                console.log(this)
            },1000)
        }
    }
   obj.a()  //this指向window
```

### 5、this指向问题面试题：

```
let a =1;
let obj = {
    a:2,
    b:()=>{
        console.log(a)
    }
}
obj.b()   //1
```


```
let a =1;
let obj = {
    a:2,
    b:()=>{
        console.log(this.a)
    }
}
obj.b()  //undefined
```

```
var a =1;
let obj = {
    a:2,
    b:()=>{
        console.log(this.a)
    }
}
obj.b()  //1
```
函数可以赋予默认参数

```
let fn = (a=1,b=2)=>{
    console.log(a,b)
}
fn();
//1 2
```





