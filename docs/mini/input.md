> 解决的问题：input内容过长，失去焦点的时候，内容显示不全的
解决方法：失去焦点的时候用view替代input，实现换行，获得焦点的时候隐藏view，显示input

**详情可以查看我的csdn相关文章 [解决小程序nput内容过长，内容显示不全的问题](https://blog.csdn.net/lyxgoodLucky/article/details/105048413?spm=1001.2014.3001.5501)**

```javascript
 <!-- 位置 -->
  <view class="info_li">
        <view class="info_name">位置:</view>
          <view class="info_text">
                  <!-- 聚焦的时候 -->
                 <input type="text"  wx:if="{{mapFlag}}" class="place_p" placeholder="点击图标获取位置" bindinput='pickerChange' value='{{amAddress}}' focus="{{mapFlag}}" bindblur="inputBlur"/>
                <!-- 失去焦点的时候 -->
                <view  bindtap="goInput" class="place_p {{!amAddress?'default_status':''}}"  wx:if="{{!mapFlag}}">{{amAddress?amAddress:'点击图标获取位置'}}</view>
                <mapLocation dataTime="{{dataTimeAm}}"  class="map_box" bind:getLocation="getLocation"></mapLocation>
            </view> 
  </view>

```

```javascript
data:{
     mapFlag:false,
     amAddress:"",//地址
     dataTimeAm:'am',//类型 上午还是下午
},
  // 获取位置聚焦和失去焦点对应事件
  goInput(){
    this.setData({
      mapFlag:true
    })
  },
  inputBlur(){
    this.setData({
      mapFlag: false
    })
  },
    //输入的地址
  pickerChange: function (e) {
    this.setData({
      amAddress: e.detail.value
    })
  },
```

> mapLocation 是自定义授权获取当前位置组件，具体实现过程可见
> [自定义小程序(授权)获取当前位置组件](https://blog.csdn.net/lyxgoodLucky/article/details/105047011)
