

**详情可以查看我的csdn相关文章 [小程序(授权)获取当前位置](https://blog.csdn.net/lyxgoodLucky/article/details/105102338?spm=1001.2014.3001.5501)**


> **问题：人脸采集的时候，首次授权拒绝之后，不再弹出授权提示** 
> 解决方案：调用 wx.openSetting二次授权 
> **问题： 调用wx.openSetting二次授权成功之后，返回之后camera组件还是失败状态 重新打开后才能用**
> 解决方案：在camera的用户不允许使用摄像头时触发的事件binderror里面销毁camera组件

> Tip:目前人脸采集有很多种方案，可以接微信自己的也可以使用第三方的，我们对接的是Aibee

效果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325191809633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325191822312.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325192003641.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/202003271832597.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327183317822.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)

**点击上传的时候，调用Aibee的接口，进行对比，如果采集的人脸的信息和库里已有的信息匹配则采集成功，否则采集失败**

贴上代码：

```javascript
<!--pages/camera/camera.wxml-->
<view class="camera_wrap">
    <!-- 图像部分 -->
    <view class="camera_box">
        <camera device-position="front"  flash="auto" binderror="error" bindstop="stopImg"       style="width:100%; height: 100%;"  wx:if="{{!flagSrc&&isAuth}}"></camera>
          <!-- 拍照成功时显示 -->
        <image mode="widthFix" wx:if="{{flagSrc}}" src="{{src}}"  style="width:100%; height: 100%;"></image>
    </view>
  
      <!-- 尾部 -->
    <view class="footer_box">
          <view class="pic_box"  wx:if="{{!flagSrc}}">
               <button  bindtap="takePicture" class="take_btn">
                  <image src="/images/camera/camera.png"></image>
              </button>
              <view class="font_f">拍照上传</view>
          </view>
          <view class="pic_box"  wx:if="{{flagSrc}}">
               <button  bindtap="uploadImg" class="take_btn">
                  <image src="/images/camera/up.png"></image>
              </button>
              <view class="font_f">确认上传</view>
          </view>
          <view class="re_pic"  wx:if="{{flagSrc}}">
                <button  bindtap="reTakePhoto" class="re_btn">
                    <image src="/images/camera/reload.png"></image>
                </button>
                <view class="font_gr">重新拍摄</view> 
          </view>
    </view>
</view>

```


```javascript
var utils = require('../../utils/httpUtil.js');
// camera.js
const app = getApp()
Page({
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: "",
    src: "",//图片的链接
    token: "",
    base64Src: "",
    msg: "",
    type: 0,//0注册   1更新
    flagSrc: false,//是否拍照成功，显示预览 true预览，false 拍照
    isAuth:false,//是否授权
  },
  onLoad: function (options) {
    console.log(options)
  },
  onShow: function () {
    let that = this;
    if (this.options.type == "register") {
      this.setData({
        type: 0
      })
    } else {
      this.setData({
        type: 1
      })
    }
    // // 获取用户的授权信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.camera'] == false) {
          // 未授权，提示去授权
          that.setData({
            isAuth:false
          })
        }else{
          this.setData({
            isAuth:true
          })
        }
      }
    })

  },
  getAibeeTemperature(){
    let that = this;
     wx.showLoading({
      title: '上传中...',
    })
    utils.PostApi({
      url: "接口地址",
      data: {
        facePic: that.data.base64Src,
        phone: wx.getStorageSync('phone'),
        realName: wx.getStorageSync('realName')
      },
      success: function (res) {
        console.log(res)
          if (res.data.code == "200") {
            wx.hideLoading();
            var aibiUid =res.data.data.user_id;
            var faceImage = res.data.data.image_url;
            var faceId = res.data.data.face_id;
            if (that.data.type==0){
              wx.redirectTo({
                url: `/pages/register/register?aibiUid=${aibiUid}&faceImage=${faceImage}&faceId=${faceId}&typeback=success`,
              }) 
            }else{
              wx.redirectTo({
                url: `/pages/informationEntry/informationEntry?aibiUid=${aibiUid}&faceImage=${faceImage}&faceId=${faceId}&typeback=success`,
              }) 
            }
              console.log(res.data.data)
          }else{
              wx.hideLoading();
              if (that.data.type == 0) {
                wx.redirectTo({
                  url: `/pages/register/register?typeback=fail`,
                })
              } else {
                wx.redirectTo({
                  url: `/pages/informationEntry/informationEntry?typeback=fail`,
                })
              }
          }
      }
    })

   },
  //拍照
  takePicture(){
    var that = this;
    console.log(this.data.flagSrc)
    // // 获取用户的授权信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.camera'] == false) {
            // 未授权，提示去授权
            wx.showModal({
              title: '应用申请使用你的摄像头',
              content: '将会上传你摄录的照片及视频',
              success: function (res) {
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                  if (that.options.type == "register") {
                    wx.redirectTo({
                      url: '/pages/register/register?typeback=fail',
                    })
                  } else {
                    wx.redirectTo({
                      url: '/pages/informationEntry/informationEntry?typeback=fail',
                    })
                  }
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      console.log(dataAu)
                      if (dataAu.authSetting["scope.camera"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        that.setData({
                          isAuth: true
                        })
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

        }else{
           that.setData({
             isAuth:true
           })
          that.takePhotos();
        }
      }
    })
    
  },
  takePhotos(){
    let that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        this.setData({
          src: res.tempImagePath,//获取图片
          flagSrc: true
        })
        // //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log(res)
            // 调用接口
            that.setData({
              base64Src: res.data
            })
          }
        })
      },//拍照成功结束
      fail: (err) => {
        console.log(err)
      }

    })//调用相机结束

  },
  // 上传
  uploadImg(){
     this.getAibeeTemperature()
  },
  // 重新拍照
  reTakePhoto(){
      this.setData({
        flagSrc: false,
        src: "",//图片的链接
        base64Src: "",
      })
    console.log(this.data.flagSrc)
  },
  // 用户不允许时触发
  error(e) {
    // 销毁组件
    this.setData({
      isAuth: false
    })
  },
  stopImg(e){
    console.log(e)
  }


})
```

```javascript
/* pages/camera/camera.wxss */
page,.camera_wrap{
  width: 100%;
  height: 100%;
  background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.69) 100%);
}
.camera_wrap .camera_box{
  width:100%;
  height: 60%;
}
.camera_wrap .footer_box{
   width:100%;
  height: 40%; 
  background: #fff;
  position: relative;
}
.camera_wrap .footer_box .pic_box{
width: 200rpx;
  padding-top:90rpx;
  box-sizing: border-box;
   margin: 0 auto;
}
.camera_wrap .footer_box .take_btn{
  width: 200rpx;
  height: 200rpx;
  display: block;
  padding: 0;
  margin: 0 auto;
  background-color:#fff;
  border-radius: 0;
}
.camera_wrap .footer_box .take_btn image{
  width: 100%;
  height: 100%;
}
.camera_wrap .footer_box .pic_box .font_f{
  color:#0066E5;
  font-size:36rpx;
  text-align: center;
}


.camera_wrap .footer_box .re_pic{
  width: 140rpx;
  box-sizing: border-box;
  position: absolute;
  left:90rpx;
  top:148rpx;
  text-align: center;
}
.camera_wrap .footer_box .re_pic .re_btn{
  width: 64rpx;
  height: 64rpx;
  display: block;
  padding: 0;
  margin: 0 auto;
  background-color:#fff;
  border-radius: 0;
  line-height: 0;
}
.camera_wrap .footer_box .re_btn image{
  width: 100%;
  height: 100%;
}
.camera_wrap .footer_box .re_pic .font_gr{
   margin-top:10rpx;
   font-size: 28rpx;
   color: #32343B;
}
```
流程图如下:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325192149895.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)

> 上传之后的流程没在图里画，这里做下说明，点击上传的时候，调用Aibee的接口，进行对比，如果采集的人脸的信息和库里已有的信息匹配则采集成功，否则采集失败
