

小程序(授权)获取当前位置

**详情可以查看我的csdn相关文章 [小程序(授权)获取当前位置](https://blog.csdn.net/lyxgoodLucky/article/details/105047011?spm=1001.2014.3001.5501)**


> （1）**用户授权** 
> （2）**获取经纬度** 
> （3）**转化经纬度信息为具体位置信息**

> 实现功能：
> 自定义小程序(授权)获取当前位置组件，地址既可以手动输入页也可以点击图标授权获取 
> （1）一个页面多处引用该组件
> （2）首次拒绝授权之后，二次授权的处理

## 1、用户授权

    （1）在app.json中配置 地理位置用途说明
```javascript
{
      "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于小程序位置展示"
      }
}
```

	（2）校验位置权限是否打开
使用 wx.getSetting 获取所有已授权接口。 该接口会返回一个 authSetting 对象， 里面包含了所有的授权结果。

```javascript
 getUserLocation(){
      let that = this;
      // 获取用户的授权信息
      wx.getSetting({
        success: (res) => {
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          console.log(res)
          //如果是首次进入
          if (res.authSetting['scope.userLocation'] == undefined){
              console.log("首次进入")
              that.getLocation(); 
          } else{
            //如果不是首次进入
            if (res.authSetting['scope.userLocation'] == true){
                // 授权成功之后
                that.getLocation();
            }else{
                // 未授权，提示去授权
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        console.log(res)
                        if (res.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //调用wx.getLocation的API
                          that.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        
        }

      })  
    },
```




   以上代码的逻辑是：
  

> （1）先获取用户授权列表。 获取 scope.userLocation 的值 
> （2）如果scope.userLocation为undefined，则第一次进入，直接调用wx.getLocation的API,如果不是首次进入，则判断有没有授权，如果已经授权则直接调用wx.getLocation的API,如果没有授权则提示去授权，如果点了确定，就使用
> wx.openSetting 接口代开权限设置界面，让用户进行二次授权，授权成功之后调用wx.getLocation的API

## 2、获取经纬度

授权成功之后调用wx.getLocation的API获取经纬度
代码如下：

```javascript
getLocation(){
  let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.getLocal(latitude, longitude)
      }, fail: function (res) {
          console.log('fail' + JSON.stringify(res))
      }
    })
},
```



## 3、转化经纬度信息为具体位置信息

授权成功获取经纬度之后，借助于**[微信小程序JavaScript SDK](https://lbs.qq.com/qqmap_wx_jssdk/index.html)** 对返回的 latitude longitude 解析为 如下这种形式：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323135553307.png)
流程如下：
   组件头部引入：

```javascript
 var QQMapWX = require('../../utils/qqmap-wx-jssdk.js'); //引入sdk
var qqmapsdk;
//生命周期 created()里面实例化API核心类
  created(){
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '。。。。'
    });
  },
```

方法里面：


```javascript
    // 获取当前地理位置
  getLocal: function (latitude, longitude) {
      let that = this;
      qqmapsdk.reverseGeocoder({
        //本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          if(res.status==0){
               console.log(res)
                var address = res.result.address;
                let mapData = {
                  address: address,
                  dataTime: that.data.dataTime
                }
                //传递给父组件
                that.triggerEvent("getLocation", mapData)
          }  
        },fail:function(res){
             console.log(res)
        }
      })
    }
```

最后贴上完整的代码：

```javascript
app.json
"permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于小程序位置展示"
      }
    }
```

子组件中：
map.wxml

```javascript
<view class="location_p" bindtap="getUserLocation">
        <image src="/images/exitIemperature/place.png" class="map_icon"></image>
</view>
```

map.js

```javascript
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js'); //引入sdk
var qqmapsdk;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataTime:{   //类型
      type: String,
      value: "",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  created(){
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '。。。。'  //申请的key
    });

  },
  ready(){

  },
  /**
   * 组件的方法列表
   */
  methods: {
     // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
    getUserLocation(){
      let that = this;
      // 获取用户的授权信息
      wx.getSetting({
        success: (res) => {
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          console.log(res)
          //如果是第一次进入
          if (res.authSetting['scope.userLocation'] == undefined){
              console.log("第一次进入")
              that.getLocation();
              
          } else{
            //如果不是第一次进入
            if (res.authSetting['scope.userLocation'] == true){
                // 授权成功之后
                that.getLocation();
            }else{
                // 未授权，提示去授权
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (dataAu) {
                        console.log(dataAu)
                        if (dataAu.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //调用wx.getLocation的API
                          that.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        
        }

      })
       
    },
    getLocation(){
      let that = this;
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            console.log(res)
            const latitude = res.latitude
            const longitude = res.longitude
            const speed = res.speed
            const accuracy = res.accuracy
            that.getLocal(latitude, longitude)
          }, fail: function (res) {
              console.log('fail' + JSON.stringify(res))
          }
        })
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude) {
      let that = this;
      qqmapsdk.reverseGeocoder({
        //本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          if(res.status==0){
              console.log(res)
            var address = res.result.address;
            let mapData = {
              address: address,
              dataTime: that.data.dataTime
            }
            //传递给父组件
            that.triggerEvent("getLocation", mapData)
          }  
        },fail:function(res){
             console.log(res)
        }
      })
    }

  }
})
```
map.wxss 

```javascript
/* components/map/map.wxss */
.location_p{
    width: 60rpx;
    text-align: right;
   line-height: 82rpx;
    height: 82rpx;
}
.location_p .map_icon{
  width: 40rpx;
  height: 40rpx;
}
.default_status{
   color: #787878;
    padding-left: 10rpx;
    line-height: 82rpx;
    height: 82rpx;
}
.curr_status{
   color: #000;
    padding-left: 10rpx;
    line-height: 82rpx;
    height: 82rpx;
}
```

父组件：

```javascript
  <view class="info_li">
        <view class="info_name">位置:</view>
          <view class="info_text">
               <input type="text"  placeholder="点击图标获取位置" value='{{amAddress}}' bindinput='pickerChange'/>
                  <!-- 引入组件的地方 -->
                <mapLocation dataTime="{{dataTimeAm}}"  class="map_box" bind:getLocation="getLocation"></mapLocation>
            </view> 
  </view>
```

```javascript
  data:{
         dataTimeAm:'am', //区分上午还是下午地图组件
         dataTimePm:'pm',
         amAddress: "", //上午位置
         pmAddress:"",
  },
   pickerChange: function (e) {
    this.setData({
      amAddress: e.detail.value
    })
  },
      // 获取位置
  getLocation(e){
    console.log(e.detail)
    var mapData = e.detail;
    if (mapData.dataTime == 'am') {
      this.setData({
        amAddress: mapData.address
      })
    } else {
      this.setData({
        pmAddress: mapData.address
      })
    }    
  },
```

效果图如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323140416766.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)

点击取消,授权失败
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323141525135.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
第二次进入，点击确定。跳转到设置页面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323140637789.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)

设置页面：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323141904137.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)

打开开关，返回之后发现已经获取到位置：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323141927289.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323140758432.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
注意：贴上微信开发平台最新的信息
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200323140815494.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)


> Tip：如果回显地址的地方直接使用input会发现，内容过长的情况下不支持换行，并且在失去焦点的情况下，不支持滑动，就会出现地址在页面显示不全的情况，此时也许你会想到用textarea，但是其实小程序原生的textarea坑也很多，想用input，又想可以回显换行，这种情况下，可以前往
>  [解决input内容过长，内容显示不全的问题](https://blog.csdn.net/lyxgoodLucky/article/details/105048413)










