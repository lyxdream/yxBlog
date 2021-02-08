
**详情可以查看我的csdn相关文章 [使用wx.openLocation遇到的坑](https://blog.csdn.net/lyxgoodLucky/article/details/105973560?spm=1001.2014.3001.5501)**

需求：下单之后，点击前往店铺图标，根据后台接口返回的经纬度和店铺名称，进行导航前往对应店铺，效果图如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200507152254364.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200507152314731.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
坑1：使用 wx.openLocation需要使用火星坐标才能定位准确，所需getLocation的时候，type可以传gcj02。
坑2：使用 wx.openLocation传的经纬度，安卓传字符串不会出现问题，ios必须转换成数字类型才可以

```javascript
  latitude: Number(lat),
  longitude: Number(lng),
```
坑3：使用wx.openLocation的时候，如果店铺的经纬度是后台服务器返回则需要和后台开发协定使用gcj02火星坐标，要不然会出现很大的误差。
最后，贴上代码：

```javascript
  //获取签名
    getJsapiFn() {
        let that = this;
        let newUrl = location.href.split("#")[0];
        console.log(newUrl);
        let reqData = {
            url: newUrl
        };
        getJsapi(reqData).then(res => {
            console.log(res);
            if (res) {
                console.log("授权地理位置");
                let resData = res.data;
                console.log(resData);
                wx.config({
                    debug: true,
                    appId: resData.appid, // 必填，公众号的唯一标识
                    timestamp: "" + resData.timestamp, // 必填，生成签名的时间戳
                    nonceStr: resData.nonceStr, // 必填，生成签名的随机串
                    signature: resData.signature, // 必填，签名
                    jsApiList: ["openLocation"] // 必填，需要使用的JS接口列表
                });
                wx.ready(() => {});
                wx.error(res => {
                    console.log("出错了：" + res.errMsg);
                });
            }
        });
    }
```
 

> 因为我的项目是h5嵌入小程序，所以需要获取签名，如果是原生小程序则不需要获取签名

```js
// 导航 去往商家
 <div class="img_i"   @click="onGuideTap(detailData.lat,detailData.lng,detailData.storeName,detailData.storeAddress) ">
      <img :src="$imgBaseUrl + '/common/line.png'" alt="" />
  </div>
onGuideTap(lat, lng, storeName, storeAddress) {
    console.log(Number(lat));
    console.log(Number(lng));
    wx.openLocation({
        type: "gcj02",
        latitude: Number(lat),
        longitude: Number(lng),
        name: storeName,
        scale: 18,
        address: storeAddress
    });
},
```
