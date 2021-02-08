
### 手写promise系列

更为详细的实现过程请查看我的github地址 [手写promise系列](https://github.com/lyxdream/promise)

## ts实现符合实现符合Promises/A+
```js
const enum STATUS{  //存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
//核心的逻辑 解析x的类型，决定promise2走成功还是失败
function resolvePromise(promise2,x,resolve,reject){
    // 判断x的值 和promise2的关系  可能是第三方的promise 可能第三方的promise会出现问题
    // console.log(promise2,x,resolve,reject)
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    // (如果x和promise2指向同一个对象，则抛错)
    if(x==promise2){
        return reject(new TypeError('出错了'))  //下一个then抛出错误
    }
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        //只有x是对象或者函数才可能是promise
        // console.log(x)
        let called = false;//表示没调用过成功和失败
        try{    
            let then = x.then;//取x上的then方法
            if(typeof then =='function'){   //这x.then是当前的then链式的下个接收
                // 如果then是函数，则把x作为this，第一个参数resolvePromise和第二个参数rejectPromise，其中：
                // resolvePromise参数y，rejectPromise参数r，r作为reason
                then.call(x,y=>{
                    if(called) return; //如果已经成功就不能再调失败
                    called = true;
                    //y可能是一个promise,递归解析y,直到y是一个普通值为止
                    resolvePromise(promise2,y,resolve,reject)
                    // resolve(y);//y是x成功返回的结果
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r)
                })
            }else{
                resolve(x);//x是普通函数或者对象
            }
        }catch(e){
            //x.then中抛出的异常的结果e，就以e作为promise失败的reason
            // console.log(e)
            if(called) return;
            called = true;
            reject(e)//走失败逻辑
        }
    }else{
        //如果不是promise则是一个普通值
        resolve(x)
    }
}
 class Promise{
     static deferred;
     status:STATUS;
     value:any;
     reason:any;
     onResolvedCallbacks:Function[];
     onRejectedCallbacks:Function[];
    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void){
        this.status = STATUS.pending; //当前默认状态
        this.value = undefined;//成功原因
        this.reason = undefined;//失败原因
        this.onResolvedCallbacks = [];//成功回调的函数集合
        this.onRejectedCallbacks = [];//失败回调的函数集合
        const resolve = (value?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.fulfilled;
                this.value = value;
                //发布模式
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        }
        const reject = (reason?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn=>fn())
            }    
        }
        try{
            executor(resolve,reject);
        }catch(e){
            reject(e)     
        }
       
    }
    then(onFulfilled?,onRejected?){
        //判断onFulfilled是否传了，如果类型是一个函数，就不做操作，如果不是函数，则返回一个参数为val的函数，val为this.value
        onFulfilled = typeof onFulfilled =='function'?onFulfilled : val=>val;
        onRejected = typeof onRejected =='function'?onRejected : err => { throw err }
        //每次调用then都产生一个全新的promise
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status == STATUS.fulfilled){
                setTimeout(() => {
                    try{
                        //是个常量的时候
                        let x = onFulfilled(this.value); 
                        // console.log(promise2)
                        resolvePromise(promise2,x,resolve,reject)
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                        // 抛错的时候
                        console.log(e)
                        reject(e)
                    } 
                }, 0);
            }
            if(this.status == STATUS.rejected){
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                         // 抛错的时候
                         reject(e)
                    }  
                }, 0);  
            }
            //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
            if(this.status == STATUS.pending){
                this.onResolvedCallbacks.push(()=>{
                      //可以增加额外的逻辑
                      setTimeout(() => {
                        try{
                            let x =  onFulfilled(this.value)  //订阅模式
                            resolvePromise(promise2,x,resolve,reject)
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }catch(e){
                             // 抛错的时候
                             reject(e)
                        }
                      },0)
                   
                  
                })
                this.onRejectedCallbacks.push(()=>{
                     //可以增加额外的逻辑
                     setTimeout(() => {
                        try{
                            let x = onRejected(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }catch(e){
                            // 抛错的时候
                            reject(e)
                        }  
                     })
                         
                     
                })
            }
        })
        return promise2
    }
 }
 //---------测试是否符合Promise/A+规范
Promise.deferred = function () {
    let dfd = {} as any;
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
 export default Promise

```

## js手写简易版promise

```js
const STATUS = { PENDING: 'PENDING', FUFILLED: 'FUFILLED', REJECTED: 'REJECTED' }

function resolvePromise(x, promise2, resolve, reject) {
    if (promise2 == x) {
        return reject(new TypeError('出错了'))
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called = false;
        try {
            let then = x.then; 
            if (typeof then == 'function') {
                then.call(x, function(y) { 
                    if (called) return
                    called = true;
                    resolvePromise(y, promise2, resolve, reject);
                }, function(r) {
                    if (called) return
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e); 
        }
    } else {
        resolve(x); 
    }
}
class Promise {
    constructor(executor) {
        this.status = STATUS.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = []; 
        // js代码 他看的并不是看声明在哪个位置，而是看执行时此代码是否已经执行了
        const resolve = (val) => {
            if(val instanceof Promise){ // 递归解析resolve中的promise
                return val.then(resolve,reject)
            }
            

            if (this.status == STATUS.PENDING) {
                this.status = STATUS.FUFILLED;
                this.value = val;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status == STATUS.PENDING) {
                this.status = STATUS.REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x
        onRejected = typeof onRejected === 'function'? onRejected: err=> {throw err}
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === STATUS.FUFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === STATUS.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === STATUS.PENDING) {
                this.onResolvedCallbacks.push(() => { 
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => { 
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);

                })
            }
        });
        return promise2;
    }
    catch(err){ 
        return this.then(null,err)
    }

    static resolve(val){
        return new Promise((resolve,reject)=>{
            resolve(val);
        })
    }
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }
}
Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject
    })
    return dfd;
}
module.exports = Promise;

```
## 一.Promise.all原理

```js
// 判断是否是promise
const isPromise = value =>{
    if((typeof value === 'object' && value !== null) ||typeof value === 'function'){
        return typeof value.then === 'function'
    }
    return false;
}
Promise.all = function (promises) {
    return new Promise((resolve,reject)=>{
        let arr = []; 
        let i = 0;
        let processData = (index,data)=>{
            arr[index] = data; // 保证返回结果顺序
            if(++i === promises.length){
                resolve(arr);
            }
        }
        for(let i = 0; i< promises.length;i++){
            let current = promises[i];
            if(isPromise(current)){
                current.then(data=>{ 
                    processData(i,data)
                },reject)
            }else{
                processData(i,current);
            }
        }
    })
}

```
> Promise.all可以解决异步并发问题，并且返回的结果按照调用的顺序进行存储。全部成功后才成功否则执行失败逻辑

## 二.Promise.race原理
#### 1.实现原理 
```js
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        // 谁返回的结果最快 就用谁的
        for (let i = 0; i < promises.length; i++) {
            let current = promises[i];
            if (isPromise(current)) {
                current.then(resolve, reject)
            } else {
                resolve(current);
            }
        }
    })
}

```

> race只采用第一个成功或者失败的结果

#### 2.应用场景

```js
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 3000); 
})
function wrap(p){
    let abort;
    let p1 = new Promise((resolve,reject)=>{
        abort = reject;
    });
    let newPromise = Promise.race([p1,p])
    newPromise.abort = abort
    return newPromise
}
let p1 = wrap(p); 
p1.then(data => {
    console.log('success', data)
}, err => {
    console.log('error', err)
})
setTimeout(() => {
    p1.abort('超过2s了');
}, 2000);

```
>借助race的特点，可以实现立即中断promise变为失败态。常用作超时操作



> 我们可以快速的将node的api方法转化成promise,核心原理就是借助了error-first的特性。在内部手动处理错误

## 三.手写Promise.finally

> finally() 方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数

#### 1、实现原理
```js
Promise.prototype.finally = function(callback){
    return this.then((data)=>{
        //等待promise执行完毕 // 等待callback执行完毕之后
        // console.log(Promise.resolve(callback()))
       return Promise.resolve(callback()).then(()=>data);
    },(err)=>{
        // console.log(Promise.resolve(callback()).then(()=>{console.log(err)}))
        return Promise.resolve(callback()).then(()=>{throw err})
    })
}
```
### 2、使用

总结： 1）如果callback里面抛出错误，则then(()=>xxx)只传了then一个回调函数（onFulfilled），并没有失败的回调函数，（如果有失败的回调函数，则会在这块捕获错误，）所以会被下个catch接收

2)不管调finally之前是成功还是失败，如果callback里面return 一个普通值，或者return一个成功状态的promise，则走then(()=>throw err)抛出reason给下个catch,或者走then(()=>data),这样就会返回前面的'ok'


## 四.手写Promise.allSettled

```js

//
Promise.allSettled = function(values){
	function isPromise(x){
	    if((typeof x==='object' && x!=null) || typeof x==='function'){
	        if(typeof x.then =='function'){
	            return true;
	        }
	    }
	    return false;
	}
    return new Promise((resolve,reject)=>{
        let arr = [];//收集传入的项运行结果
        let times =0;//调用的次数和传入的参数个数一致的时候，resolve
        function collectResult(val,key,obj){
            arr[key] = obj;
         //注意这里不能用arr.length计数，因为先成功的会是不是promise的项，这个例子中先成功的是0,0成功之后，arr的length已经为3，就会直接resolve
            if(++times === values.length){
                resolve(arr)
            }
        }
        for(let i=0;i<values.length;i++){
            let value = values[i];
            if(value&&isPromise(value)){
                value.then((y)=>{
                    //y是promise返回的值
                    //y i
                    let obj = {
                        status:"fulfilled",
                        value:y
                    }
                    // console.log(y)
                    collectResult(y,i,obj)
                },(err)=>{
                    let obj = {
                        status:"rejected",
                        reason:err
                    }
                    collectResult(err,i,obj)
                })
            }else{
                //value i
                let obj = {
                    status:"fulfilled",
                    value:value
                }
                collectResult(value,i,obj)
            }
        }
    })
}


```


## promise相关面试题

```js
// 相关面试题
/* 
1、怎么让一个node的api => promise的api
  自己实现node的promises
*/
function promisify(fn){
    return function(...args){  //等价于read
        return new Promise((resolve,reject)=>{
             fn(...args,(err,data)=>{
                if(err) reject(err);
                resolve(data)
            })
        })
    }
}
let read = promisify(fs.readFile);
read('./name.txt','utf8').then((data)=>{
    console.log(data)
})

//2、判断一个值是不是promise
function isPromise(){
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        let then = x.then;//取x上的then方法
        if(typeof then =='function'){
            return true;
        }
    }
    return false;
}

//3、js代码 他看的并不是看声明在哪个位置，而是看执行时此代码是否已经执行了

function b(){
    console.log(a)
}
let a =2;
b();
//2

```
**完整的实现过程请见 [ts手写完整的promise](https://github.com/lyxdream/promise/blob/main/src/%E5%AE%8C%E6%95%B4%E6%BA%90%E7%A0%81.ts)**

