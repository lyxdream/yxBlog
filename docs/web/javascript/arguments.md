arguments的介绍：

- （1）arguments是javascript的一个内置对象，存储的是函数的参数，是一个伪数组，类似Array，但除了length属性和索引元素之外没有任何数组属性，例如，它没有push方法，但是可以转换为一个真正的数组；
```js
var arr=Array.prototype.slice.call(arguments);
```

- （2）arguments对象的长度是由实参个数决定而不是形参；

形参和实参：

形参：函数定义时，函数后面的参数，不能用var修饰。

实参：函数调用时，函数后面的参数。  

```js   
var sum;
function add(a,b){
sum=a+b;
console.log(sum);
}
add(1,2);
```
上述的实例中：a,b是新参。函数调用时传进去的参数（1,2）是实参；

> 形参是函数内部重新开辟内存空间存储的变量，但是其与arguments对象内存空间并不重叠。对于arguments的值都存在的情况下，两者值是同步的，但是针对其中一个无值的情况下，对于此无值的情形值不会得以同步。

- （3）arguments.callee返回arguments对象所在的当前函数引用。（递归调用时推荐使用arguments.callee代替函数本身）

- （4）arguments参数可以传递多个，与函数的定义无关；
```js
function  test(x,y){
    for(var i=0;i<arguments.length;i++){
     alert(arguments[i]);   
   }    
 }
test(1,2,3,4);
```

>  ECMAScript中的参数的内部是用一个数组来表示的，函数接收到的始终是这个数组，而不关系数组中包含哪些参数，因此不介意传进来多少参数。

- （5）使用arguments对象可以判断实参的个数

    arguments.length();   实参的个数

    arguments[i]        访问第i个参数

向一个函数传入不定数量的数值求和。

```js
function addSum(){
    var sum=0;
    for(var i=0;i<arguments.length;i++){
        sum+=arguments[i];
    }
    console.log(sum);
}
addSum(3,5,7);    //15
addSum(2,3);      //5
```


