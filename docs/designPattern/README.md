

## 发布订阅模式

- 发布订阅模式  主要分为两个部分 on emit
  - on  就是把一些函数维护到一个数组中（订阅）
  - emit  就是让数组中的方法依次执行 （发布）

- 把需要做的事放到一个数组中，等会儿事情发生了让订阅的事依次执行

```js
let fs = require('fs')
let school = {}

let event = {  //订阅和发布没有明显的关联
    arr:[],
     on(fn){
         console.log(fn)
        this.arr.push(fn);
     },
     emit(){
         this.arr.forEach((fn) => fn())
     }
}

event.on(function () {
    console.log('读取一个')
})
event.on(function(){
     console.log('读取两个')
    if(Object.keys(school).length===2){
        console.log(school)
    }
})

fs.readFile('./name.txt', 'utf8', function (err, data) {
    school.name = data
    event.emit()
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    school.age = data
    event.emit()
})

```

```js
// on的时候收集了两个函数进去，
event.on(function () {
    console.log(school)
})
event.on(function () {
    console.log('读取一个')
})

```
打印on里面收集的东西
```js
[Function]
[Function]
```

每调一次emit就会发布两个出来

```js
读取一个
读取两个

读取一个
读取两个
{ name: 'yx', age: '100' }
```

```ts
//发布订阅模式
//把需要做的事放到一个数组中，等会儿事情发生了让订阅的事依次执行

declare function require(string):any;
const fs = require('fs'); // 可以读取文件

interface events{
    arr:Array<Function>,
    on(fn:Function):void,
    emit():void
}
let events:events = {
    arr:[],//[fn,fn]
    on(fn){
        this.arr.push(fn)
    },
    emit(){
        this.arr.forEach(fn => fn());
    }
}
interface IPerson {
    age:number,
    name:string
}
let person = {} as IPerson;
events.on(()=>{
    if(Object.keys(person).length==2){
        console.log(person)
    }
})
events.on(()=>{
    console.log('触发一次')
})

fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/name.txt','utf8',(err,data)=>{
    // console.log(data)
    person.name = data;
    events.emit()
})
fs.readFile('/Users/yinxia/Desktop/项目/架构课学习/预习/promise/src/age.txt','utf8',(err,data)=>{
    // console.log(data)
    person.age = data;
    events.emit()
})

export {}

```

## 观察者模式

-  观察者模式  （观察者，被观察者之间是存在关联的，内部还是发布订阅） 有依赖关系就是观察者模式，没有依赖关系就是发布订阅
-  观察者需要放到被观察者中，被观察者的状态变化之后需要通知观察者
-  内部也是基于发布订阅模式  收集观察者，状态变化之后通知观察者

```js
class Subject {
    //被观察者  小宝宝
    constructor(name) {
        this.state = '开心'
        this.name = name
        this.observers = []
    }
    attach(o) {
        //Subject.prototype.attach
        this.observers.push(o)
    }
    setState(newState){
        this.state = newState;
        this.observers.forEach( (o) =>o.update(this) )
    }
}
class Observer {
    //观察者 爸爸 妈妈
    constructor(name) {
        this.name = name;
    }
    update(baby){
        console.log(`当前${this.name}被通知了，当前小宝宝的状态是${baby.state}`)
    }
}

//需要观察小宝宝心里状态的变化
let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mother = new Observer('妈妈')
baby.attach(father);
baby.attach(mother);
baby.setState('被欺负了')

// 注意：o能调用update因为o是Observer的实例
// 用es5实现：
function Subject(name) {
    //被观察者  小宝宝
      this.state = '开心'
      this.name = name
     this.observers = []
}
Subject.prototype.attach = function(o){
     this.observers.push(o)
}   
Subject.prototype.setState = function(newState){
     this.state = newState;
    this.observers.forEach( (o) =>o.update(this) )
}
```
```ts
class Subject{  //被观察者
    name:string;  //实例上面又一个name属性
    state:string;
    observers:Observer[];
    constructor(name:string){
        this.name = name;
        this.state = '我现在很开心';
        this.observers = []
    }
    attach(o:Observer){  //传入 观察者
        this.observers.push(o)
    }
    setState(newState:string){
        this.state = newState;
        this.observers.forEach(o => o.update(this));
    }

}
class Observer{  //观察者
    name:string  //实例上面又一个name属性
    constructor(name:string){
        this.name = name;    
    }
    update(baby:Subject) {
        console.log(`${baby.name}对${this.name}说${baby.state}`)
    }
}

//家里有个小宝宝，爸爸妈妈需要观察小宝宝的变化
let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mather = new Observer('妈妈');
baby.attach(father);
baby.attach(mather);
baby.setState('我不开心了');
baby.setState('我开心了');

// 小宝宝对爸爸说我不开心了
// 小宝宝对妈妈说我不开心了
// 小宝宝对爸爸说我开心了
// 小宝宝对妈妈说我开心了
```


**其他模式敬请期待......**
