## 浏览器事件环

### 浏览器渲染原理与性能优化
参考链接：https://segmentfault.com/a/1190000012925872
## 区分进程和线程
  应用 -》 进程 -》 线程  
   - 一个应用可以有多个进程，一个进程可以有多个线程  
  - 单线程与多线程，都是指在一个进程内的单和多
  - 进程是操作系统资源分配的基本单位，进程中包含线程。
  - 线程是由进程所管理的。为了提升浏览器的稳定性和安全性，浏览器采用了多进程模型。
  **官方一点解释：**
  - 进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位）
  - 线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程
## 浏览器是多进程的
### 浏览器都包含哪些进程？
   浏览器中的（5个主要）进程  
   - Browser进程：浏览器的主进程（负责协调、主控），只有一个。负责界面显示、用户交互、子进程管理，提供存储等。
   - 渲染进程（浏览器内核，Renderer进程）：每个页卡都有单独的渲染进程，核心用于渲染页面，脚本执行，事件处理（内部是多线程的）
   - 网络进程：主要处理网络资源加载(HTML、CSS,、JS等)
   - GPU进程：3d绘制,提高性能
   - 插件进程： chrome中安装的一些插件
> 每打开一个Tab页，就相当于创建了一个独立的浏览器进程。
### 浏览器多进程的优势
   - 多进程充分利用多核优势
   - 为了提升浏览器的稳定性和安全性，如果一个页卡奔溃了，不会影响到其他页卡，而且两个页卡之间不会互相影响
### 浏览器内核（渲染进程） 
   #### 渲染进程包括哪些线程
   - GUI渲染线程
     - 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。
     - 当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行
     - 注意，GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行。
   - JS引擎线程
     - 也称为JS内核，负责解析Javascript脚本，运行代码（例如V8引擎） 
     - 同样注意，GUI渲染线程与JS引擎线程是互斥的，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。
   - 事件触发线程
     - 归属于浏览器而不是JS引擎，用来控制事件循环（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助）
     - 当JS引擎执行代码块如setTimeOut时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添 加到事件线程中
     - 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理
     -  注意，由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）
   - 定时触发器线程
     - setInterval与setTimeout所在线程
     - 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
     - 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待JS引擎空闲后执行）
     - 注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。
   - 异步http请求线程
     - 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求
     - 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行。  





## 1、Browser进程和浏览器内核（Renderer进程）的通信过程  

例子：

```js
// 执行栈执行完之后再执行其他任务
setTimeout(()=>{  //宏任务
    console.log('ok1');
},1000)
setTimeout(()=>{  //宏任务
    console.log('ok2');
},0)
Promise.resolve().then((resolve,reject)=>{  //微任务
    console.log('then')
})

function a(){
    console.log('a')
    function b(){
        console.log('b')
        function c(){
            console.log('c')
        }
        c();
    }
    b();
}
a();


// a
// b
// c
// then
// ok2
// ok1

// 宏任务 [ok1,ok2]
//宏任务 script脚本 =》清空所有微任务 =》取出一个宏任务 
//宏任务要求时间到了才会执行

```
## 微任务和GUI渲染
```js
 document.body.style.background = 'red';
  console.log(1)
  Promise.resolve().then(()=>{
      console.log(2)
      document.body.style.background = 'yellow';
  })
  console.log(3);
  //1 3 2
  //微任务执行完毕之后才会取渲染页面，所以直接是'yellow'

```

```js
 document.body.style.background = 'red';
    console.log(1)
    setTimeout(()=>{
        console.log(2)
        document.body.style.background = 'yellow';
    },1000)
    console.log(3);
    //1 3 2 红变黄   渲染了两次，第一次走执行栈，页面为红，第二次取出一个宏任务，会变黄
```
## 2、事件任务

```
<body>
    <button id="button">点我</button>
</body>
<script>
    button.addEventListener('click',()=>{
        console.log('listener1');
        Promise.resolve().then(()=>console.log('micro task1'))
    })
    button.addEventListener('click',()=>{
        console.log('listener2');
        Promise.resolve().then(()=>console.log('micro task2'))
    })
    button.click(); // click1() click2()
    //button.click() listener1 listener2  micro task1  micro task2  立即执行，而不是一个个执行，不点就不会产生一个⌚事件线程，就同步了
    
    //宏任务是一个个执行
    //如果手动去点，则是一个个去执行，会产生事件线程  listener1    micro task1   listener2 micro task2
</script>
```
##  3、定时器任务

```js
 Promise.resolve().then(() => {
        console.log('Promise1')
        setTimeout(() => {
            console.log('setTimeout2')    
        }, 0);
    })
    setTimeout(() => {
        console.log('setTimeout1');
        Promise.resolve().then(() => {
            console.log('Promise2')
        })
    }, 0);
    /*
    主栈代码：
    微任务  [promise1] 
    宏任务 [setTimeout1]

    1、执行第一个promise，则打印Promise1，setTimeout2进入宏任务队列
    此时微任务 [] 
    此时 宏任务 [setTimeout1，setTimeout2]
    2、取出一个宏任务执行，则打印setTimeout1，
    此时微任务队列：[promise2] 
    宏任务执行完毕之后，清空对应的微任务则打印Promise2
    3、此时任务队列中只有一个宏任务[setTimeout2]
    取出一个宏任务执行，则打印setTimeout2，
    所以执行结果是Promise1，setTimeout1，Promise2，setTimeout2
   */
```
## 4、任务执行面试题
```js
// console.log(1);
async function async () {
    console.log(2);
    await console.log(3);  //相当于Promise.resolve().then(()=>{console.log('4')})
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async (); //立即执行
console.log(8);

//new Promise 会立即执行
//await console.log(3); await后面紧跟着的代码是同步代码，但是接下来的是微任务，相当于.then
```
**主栈执行顺序,以及最终执行结果**
```js
1  
//宏任务 [setTimeout5]  
6 
//微任务[then]
2 3
//微任务[then,4]
8
// 主栈执行完之后，清空微任务队列
7  4 
//执行宏任务 
5
//执行后的结果：1 6 2 3 8 7 4 5
```

## 5、MessageChannel 宏任务
```js
let channel = new MessageChannel();
channel.port1.postMessage('ok');
channel.port2.onmessage = function(e){
    console.log(e.data)
}
Promise.resolve().then((data)=>{
    console.log(data)
})

//undefined
//ok
// 先走微任务再走宏任务
```

