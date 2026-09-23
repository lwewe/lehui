<template>
  <div>
    <div class="address" @click="showPopup()">
      <div class="city">{{ city }}</div><img :src="down" alt="" style="width: 14px;height: 14px;"></img>

    </div>
  </div>
</template>
<script>

import BMap from "BMap"
import wx from "weixin-js-sdk";
import { getWechat } from "@/api/lhcard";
import { getCityList } from "@/api/lehuifilm";
export default {
  name: "City",
  props: {
    cityName: [Number, String],
  },
  data() {
    return {
      down: require('@/assets/down.png'),
      city: "正在定位",
      info: {},
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
    }
  },
  methods: {
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 城市跳转
    showPopup() {
      this.$router.push({ path: "/citylist", query: { city: '' + this.city, change: this.change } })
    },
    // 获取定位
    getLocation() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      getWechat({ url: purl }).then(res => {
        if (res.code == 200) {
          this.info = res.data
          this.getSign()
        }
      })
    },
    getSign() {
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appId, // 必填，公众号的唯一标识
        timestamp: "" + this.info.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['getLocation']
      }
      // console.log(configData)
      wx.config(configData);
      wx.ready((res1) => {
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            this.getCityName(res.longitude, res.latitude)
            sessionStorage.setItem("longitude", res.longitude)
            sessionStorage.setItem("latitude", res.latitude)
          }, fail: () => {
            // console.log("定位失败")
            // wx.getLocation({
            //   type: 'wgs84',
            //   success: (res) => {
            //     this.selcity(res.longitude, res.latitude)
            //     sessionStorage.setItem("longitude",res.longitude)
            //     sessionStorage.setItem("latitude",res.latitude)
            //   }, fail: () => {
            //     this.createMap()
            //   }
            // });
            this.createMap2()
          }
        });
      });
      wx.error(function (res) {
      });
    },
    createMap2() {
      // console.log("[[[")
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
        _this.city = city
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
          _this.messageinfo()
        }
        sessionStorage.setItem("cityName", _this.city)
        _this.getCity(_this.city)
        _this.$emit('getCity', _this.city);
        let province = position.address.province; //获取省份信息
        // console.log(city)
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    createMap() {
  const geolocation = new BMap.Geolocation();
  var _this = this;

  // 先用缓存城市请求一次
  const cachedCity = sessionStorage.getItem("cityName");
  if (cachedCity) {
    console.log("createMap 用缓存城市:", cachedCity);
    _this.city = cachedCity;
    _this.getCity(cachedCity);
  }

  const fallbackTimer = setTimeout(() => {
    if (!_this.newCityId) {
      console.warn("定位超时，走默认城市");
      _this.getCity(_this.city);
    }
  }, 3000);

  geolocation.getCurrentPosition(
    function getinfo(position) {
      clearTimeout(fallbackTimer);
      let latitude = position.latitude;
      let longitude = position.longitude;
      let city = position.address.city.substring(0, position.address.city.length - 1);
      _this.center.lng = longitude;
      _this.center.lat = latitude;

      // 有缓存城市就不覆盖
      if (sessionStorage.getItem("cityName")) {
        console.log("已有缓存城市，跳过定位覆盖:", sessionStorage.getItem("cityName"));
        return;
      }

      _this.city = city;
      if (_this.isWeiXin()) {
        _this.getLocation1();
        _this.getCity(_this.city);
      } else {
        _this.getCity(_this.city);
      }
    },
    { enableHighAccuracy: true },
    function (e) {
      clearTimeout(fallbackTimer);
      _this.getCity(_this.city);
    },
    { provider: "baidu" }
  );
},
    //   获取targetId
    // 获取所有城市
    getCity(keyword) {
      getCityList({ keyword }).then(res => {
        const allCities = res.data || [];
        const target = allCities.find(c => c.name === keyword)
          || allCities.find(c => c.name === keyword + "市")
          || allCities.find(c => c.name.includes(keyword))
          || allCities[0];

        if (target) {
          sessionStorage.setItem("targetId", target.cityid1);
          sessionStorage.setItem("targetId2", target.cityid2);
          sessionStorage.setItem("cityName", target.name);
          sessionStorage.setItem("cityId2", target.id);
          sessionStorage.setItem("cityItem", JSON.stringify([target]));

          this.$emit('getCity', target.name);   // 通知父组件
        }
      });
    },
    // 提示当前城市是否需要切换
    messageinfo() {
      this.$dialog.confirm({
        message: '当前定位在"' + this.city + '"\n是否需要切换到其他城市？',

        confirmButtonColor: 'red',
        cancelButtonColor: 'red',
        confirmButtonText: '切换',        // 确认按钮文字
        cancelButtonText: '取消',
      }).then(() => {
        this.$router.push({ path: "/citylist", query: { city: '' + this.city } })
        sessionStorage.setItem("promptcity", "2")
      }).catch(() => {
        sessionStorage.setItem("promptcity", "2")
      })

    },
    getCityName(lng, lat) {
      // 创建一个坐标点
      let point = new BMap.Point(lng, lat);

      // 创建一个地理编码实例
      let geoc = new BMap.Geocoder();

      // 根据坐标点进行逆地理编码
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        // console.log(addComp,"addComp")
        this.city = addComp.city;
        sessionStorage.setItem("cityName", this.city)
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
          this.messageinfo()
        }
        sessionStorage.getItem("cityName", this.city)
        this.getCity(this.city)
        this.$emit('getCity', this.city);   // ← 加这行
      });
    },
  },
  created() {
    if (sessionStorage.getItem("cityName")) {
      this.city = sessionStorage.getItem("cityName")
      // console.log(this.city,"this.city")
    } else {
      this.createMap()
      sessionStorage.getItem("cityName", this.city)
    }
  },
  updated() {
    // if(sessionStorage.getItem("cityName")){
    //   this.city = sessionStorage.getItem("cityName")
    //   // console.log(this.city,"this.city")
    // }
  }
}
</script>

<style scoped>
.address {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  justify-content: center;
  padding: 10px 0px;
}

.pull-down {
  position: absolute;
  right: -12px;
  top: 10px;
  width: 12px;
  height: 12px;
}

.city {
  white-space: nowrap;
  max-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
}
</style>