

## 类型转换：

### 注意的点：
+ 两边出现字符串或者对象都当作字符串处理
 对象转数字是先转成字符串，再转换成数字

  （1）先用valueOf()获取对象的原始值

  （2）然后再调用toString()转换成字符串

任何数加NaN都是NaN

js中的数据类型

 1、基本数据类型
         number string boolean null undefined symbol bigint

  2、引用数据类型
        object function   
### 把其他数据类型转换为Number类型
     1.特定需要转换为Number的
            Number([val])
             parseInt/parseFloat([val])
     2.隐式转换（浏览器内部默认要先转换为Number在进行计算的）
           isNaN([val])
           在==比较的时候，有些值需要转换为数字再进行比较
            null转换成数字是0
            undefined转换成数字是NaN
### 把其它数据类型转换为字符串

 1. 能使用的办法

   + toString()

   + String()
 2. 隐式转换（一般都是调用其toString）

 + 加号运算的时候，如果某一边出现字符串，则是字符串拼接

 + 把对象转换为数字，需要先toString()转换为字符串，再去转换为数字

 + 基于alert/confirm/prompt/document.write...这些方式输出内容，都是把内容先转换为字符串，然后再输出的

 + ...


  ### 把其它数据类型转换为布尔
 1. 基于以下方式可以把其它数据类型转换为布尔
      + ! 转换为布尔值后取反
      + !! 转换为布尔类型
      + Boolean([val])
2. 隐式转换
     + 在循环或者条件判断中，条件处理的结果就是布尔类型值
     + ...

> 规则：只有 ‘0、NaN、null、undefined、空字符串’ 五个值会变为布尔的FALSE，其余都是TRUE
     
  ### 在==比较的过程中，数据转换的规则：
  ```
   【类型一样的几个特殊点】
        {}=={}：false  对象比较的是堆内存的地址
        []==[]：false
        NaN==NaN：false
   【类型不一样的转换规则】
   1. null==undefined：true，但是换成===结果是false（因为类型不一致），剩下null/undefined和其它任何
   2. 字符串==对象  要把对象转换为字符串
   3. 剩下如果==两边数据类型不一致，都是需要转换为数字再进行比较
 ```  
### Number()
    忽略前导的零
   （1）如果是Boolean值，true => 1  false=> 0

    (2)如果是null，返回0

    (3)如果是undefined, 返回NaN

    (4)如果是数字，只是简单的传入和返回

    (5)如果是字符串：

如果字符串中只包含数字，（包括前面带负号或正号的情况），则将其转换为10进制数。
 ```js
  如：Number("011")  => 11  （注意：前导的零被忽略了）  
```  
如果字符串中包含有效的十六进制。则将其转换为相同大小的10进制
```js
  如Number("oxf") => 15  
```  
如果字符串中包含有效的浮点格式，则将其转换为对应的浮点数值
```js
     如： Number("1.11") => 1.11  
     而 Number("0.11.1") => NaN
```     
如果字符串是空的，则将其转换为0
如果字符串中包含上述格式之外的字符，则将其转换为NaN

> 注意：此时Number("011")转换为11而不是9，此时的"011"被当作十进制而不是八进制，而Number(011)则等于9，此时的011则是被当作八进制转换为十进制

   (6)如果是对象，先调用对象的valueOf()方法，然后确定该方法返回的数值是否可以转化为数值，如果不能则基于这个返回值再调用toString()的方法，再测试返回值。
   ```js
            var num1 = Number("Hello world!"); //NaN
            var num2 = Number(""); //0
            var num3 = Number("000011"); //11
            var num4 = Number(true); //1
```
### parseInt([value]) 
把value转换成数字（内存机制，需要先把value先变为字符串，然后从字符串左侧第一个字符左侧第一个字符查找，把找到的有效数字字符转换为数字，直到遇到一个非有效数字字符为止）
```js
      parseInt([value],[n]) 把[value]看做[n]进制的数据，最后转换为十进制
      [n]不写：默认是10，特殊情况字符串是以0X开头，默认值是16进制
      [n]范围 2~36之间 不在这个之间的 除了0和10一样,剩下结果都是NaN
console.log(parseInt(null)) //NaN
console.log(parseInt(undefined)) //NaN
```


