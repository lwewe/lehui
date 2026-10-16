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

      this.$router.push({ path: "/CityListfilm", query: { city: '' + this.city } })
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
      const _this = this;
      const cachedCity = sessionStorage.getItem("cityName");
      if (cachedCity) {
        _this.city = cachedCity;
        _this.getCity(cachedCity);
        return;
      }
      geolocation.getCurrentPosition(
        function (position) {
          const city = position.address.city.replace(/市$/, '');
          _this.city = city;
          _this.getCity(city);
        },
        { enableHighAccuracy: true },
        function () {
          _this.getCity(_this.city || '北京');
        },
        { provider: "baidu" }
      );
    },
    //   获取targetId
    getCity(keyword) {
      getCityList({ keyword }).then(res => {
        const allCities = res.data || [];
        const target = allCities.find(c => c.name === keyword)
          || allCities.find(c => c.name === keyword + "市")
          || allCities.find(c => c.name.includes(keyword))
          || allCities[0];

        if (target) {
          const cached = sessionStorage.getItem("cityName");
          // 只在没缓存或名字不一致时才写
          if (!cached || cached !== target.name) {
            sessionStorage.setItem("targetId", target.cityid1);
            sessionStorage.setItem("cityName", target.name);
            sessionStorage.setItem("cityId2", target.id);
            sessionStorage.setItem("cityItem", JSON.stringify([target]));
          }
          this.$emit('getCity', target.name);
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
      const cached = sessionStorage.getItem("cityName");
      if (cached) {           // 有缓存直接跳过
        return;
      }
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
      this.city = sessionStorage.getItem("cityName");
      // 不要在这里再 getCity 覆盖，显示就行
    } else {
      this.createMap();
    }
  },
  updated() {

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