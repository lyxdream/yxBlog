## 类型检测

判断变量的类型

### 常见的判断变量的类型有四种

1、typeof 不能判断变量的类型 typeof [] typeof {}

2、constructor 可以找到这个变量是通过谁构造数来的 构造函数

3、instanceof 判断谁是谁的实例 _proto_

4、Object.prototype.toString.call() 可以判断类型，不能判断谁是谁的实例

具体详细内容敬请期待。。。。


typeof只能判断基本数据类型，对象类型同一判断为object无法细化，并且null也会被判断为object

instanceof用于从原型角度判断某个值的类型，如果该值的原型链上有该属性则返回true，但是无法判断基本类型值；或者说instanceof用于判断某个值是否为目标类的实例或子实例。

contructor没用过判断数据类型，盲猜是根据obj.contructor === Obj来判断该值是否为父类实例

Object.prototype.toString.call()非常有用Object.prototype.toString 方法会根据这个对象的[[class]]内部属性，返回由 "[object " 和 class 和 "]" 三个部分组成的字符串。




<!-- 第一种方式是使用 instanceof 运算符来判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置
第二种方式可以通过对象的 constructor 属性来判断，对象的 constructor 属性指向该对象的构造函数，但是这种方式不是很安全，因为 constructor 属性可以被改写
第三种方式，如果需要判断的是某个内置的引用类型的话，可以使用Object.prototype.toString.call() 方法来打印对象的[[Class]] 属性来进行判断 -->


