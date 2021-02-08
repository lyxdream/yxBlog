做个小程序的笔记~

**详情可以查看我的csdn相关文章 [小程序和H5互跳以及小程序跳转小程序](https://blog.csdn.net/lyxgoodLucky/article/details/105146547?spm=1001.2014.3001.5501)**


**1、小程序跳转h5：**

```javascript
<web-view src="{{link}}"></web-view>
```

> 这一行代码便可以实现，其中link为嵌入的h5页面的链接地址
>  具体实现如下: 
>  新建一个文件夹link作为所有需要嵌入h5的外联容器
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327175305462.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
```javascript
  //需要跳转h5的小程序页面
  goList(e){
         wx.setStorage({
          key: 'airportLink',
          data: "h5页面的链接地址"
        });
        wx.navigateTo({
          url: "/pages/link/link"
        })
  }
```

```javascript
<!--pages/link/link.wxml-->
//嵌入h5的容器页面
<web-view src="{{link}}"></web-view>
```

```javascript
//link.js
//嵌入h5的容器页面
const app = getApp()
Page({
  data: {
    link: "",
  },
  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'airportLink',
      success(res) {
        var link = res.data;
        that.setData({
          link: link
        });
      }
    });
  }
})

```
**2、h5跳转小程序**
 2.1npm install weixin-js-sdk --save
2.2在需要跳转小程序的页面引入：import wx from 'weixin-js-sdk'//微信js
2.3判断是否在微信小程序环境：

```javascript
//公用方法里面：
// 判断是否在微信环境
import wx from 'weixin-js-sdk'//微信js
export function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
 // 判断是否是小程序环境
 export function isMiniProgram() { //是否为小程序环境
    //是否在微信环境
    if (!is_weixn()) {
       return false
    } else {
      //微信API获取当前运行环境
      wx.miniProgram.getEnv((res) => {
        if (res.miniprogram) { //小程序环境
         return true
        } else {
          return false
        }
      })
    }
  };
```
2.4如果是小程序环境则跳转

```javascript
import {is_weixn,isMiniProgram} from './js/public.js'
goMiniProgram(){
    if(isMiniProgram){
          wx.miniProgram.navigateTo({
            url: "/pages/index/index"
         });
    } 
}

```
2.5如果h5需要向小程序传参

```javascript
  //h5页面
  wx.miniProgram.navigateTo({
    url: "/pages/index/index?phone=17801111000"
 });
```

```javascript
//小程序页面
Page({
  data: {
    phone:''
  },
  onLoad: function (options) {
    /*获取h5传过来的参数*/
    let phone = options.phone
    this.setData({
      phone: phone,
    })
  }
})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327180904404.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
3、小程序跳转小程序
3.1在配置文件app.json 添加 属性navigateToMiniProgramAppIdList:[]

```javascript
"navigateToMiniProgramAppIdList": ['要跳转得小程序的appid']
```


3.2 跳转方法

```javascript
wx.navigateToMiniProgram({
  appId: '',
  path: 'page/index/index?id=123',
  extraData: {
    foo: 'bar'
  },
  envVersion: 'develop',
  success(res) {
    // 打开成功
  }
})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327180827539.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
3.3使用限制
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327180809824.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
[web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

[wx.navigateToMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html)