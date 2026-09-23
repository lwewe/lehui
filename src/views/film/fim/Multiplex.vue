<template>
  <!--  影城-->
  <div class="pageView">
    <NProgress v-if="loadingflag" />
    <!--    头部-->
    <div class="addBg">
      <div class="topPage">
        <!--      <div class="title">悦享聚汇</div>-->
        <div class="searchBox">
          <div>
            <!--      地址-->
            <City @getCity="handleCityChange"></City>
          </div>
          <div class="searchValue">
            <van-search background="#fff0" placeholder="输入影院搜索" @input="searchList" v-model="searchValue" />
          </div>
        </div>
      </div>
      <!--   banner -->
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id" @click="toFDetail(item.url)">
            <img class="img" :src="item.img" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <!--    center-->
    <div class="centerBox">
      <div class="address" :class="{ chooseAddress: show }">
        <div class="choose" @click="chooseAddress">{{ region }}</div>
        <div class="pull-down" @click="chooseAddress">
          <van-icon class="" color="#564A3F" name="arrow-down" size="13px" />
        </div>
      </div>
      <!--      区域选择-->
      <div>
        <van-popup position="top" v-model="show">
          <div>
            <div class="content" @click="allRegion">
              <div class="addRegion">
                <span :class="region == '请选择区域' ? '' : 'region'">全部区域</span>
                <span class="regionNum" :class="region == '请选择区域' ? '' : 'number'">{{ total }}</span>
              </div>
              <div v-if="region == '请选择区域'">
                <van-icon color="#ED3137" name="success" size="16px" />
              </div>
            </div>
            <div class="content" v-for="item in countyList" :key="item.name" @click="changeRegion(item)">
              <div class="addRegion">
                <span :class="{ region: item.name != region }">{{ item.name }}</span>
                <span class="regionNum" :class="{ number: item.name != region }">{{ item.num }}</span>
              </div>
              <div v-if="item.name == region">
                <van-icon color="#ED3137" name="success" size="16px" />
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <!--      列表-->
      <div class="listMax" v-if="this.allCinemaList.length > 0">
        <div class="listBox" v-for="(item, index) in allCinemaList" :key="index" @click="toDetail(item)">
          <div class="nameBox">
            <div class="nameNone">{{ item.flag == 1 ? item.name : item.name1 }}</div>
            <div class="detailAdress">{{ item.flag == 1 ? item.address : item.address1 }}</div>
          </div>
          <div class="form">{{ Number(item.juli).toFixed(2) }}km</div>
        </div>
      </div>
      <div v-else class="noneList">暂无影院</div>
    </div>

    <div ref="bottom" style="height: 10px;"></div>
    <!--    导航tab-->
    <FilmTabbar :active="1"></FilmTabbar>
  </div>
</template>
<script>
import FilmTabbar from "@/components/FilmTabbar.vue";
import BMap from "BMap";
import {
  getCinemaList,
  getCityList,
  getMovieCinemaList,
  getCinemaBannerList
} from "@/api/lehuifilm";
import City from "@/components/CityFilm.vue";
import wx from "weixin-js-sdk";
import { getWechat } from "@/api/lhcard";

export default {
  name: "Multiplex",
  components: {
    FilmTabbar,
    City
  },
  data() {
    return {
      searchValue: "",
      center: { lng: "", lat: "" },
      show: false,
      countyList: [],
      total: 0,
      allCinemaList: [],
      region: "请选择区域",
      bannerList: [],
      city: "正在定位",
      urlid: null,
      targetId: "",
      cityList: [],
      loadingflag: false,
      info: {},
      moveName: "",
      newCityId: "",
      timer: null,
      movieCode: ""
    };
  },
  activated() {
    const cached = sessionStorage.getItem("cityName");
    if (cached && cached !== this.city) {
      console.log("activated 城市变化:", cached);
      this.city = cached;
      this.getCity(cached);
    }
  },
  methods: {
    handleCityChange(cityName) {
      console.log("城市切换为:", cityName);
      this.city = cityName;
      this.getCity(cityName);   // 重新请求 → 重新请求影院
    },
    toFDetail(url) {
      if (url) {
        this.$router.push({ path: url + "&cityid=" + this.targetId });
      }
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    toDetail(item) {
      sessionStorage.removeItem("selectMovieCode");
      sessionStorage.removeItem("activeIndex");
      if (item.flag == 1) {
        this.$router.push({
          path: "/multiplexDetail",
          query: { id: item.cinemaid1, city: this.city, moveName: this.moveName }
        });
      } else {
        this.$router.push({
          path: "/multiplexNewDetail",
          query: { id: item.cinemaid2, city: this.city, moveId: this.urlid, movieCode: this.movieCode }
        });
      }
    },
    getBanner() {
      getCinemaBannerList().then(res => {
        if (res.code == 200) {
          this.bannerList = res.data.list;
        }
      });
    },
    // -------- 定位 --------
    getLocation1() {
      let purl = /(Android)/i.test(navigator.userAgent)
        ? location.href.split("#")[0]
        : window.localStorage.getItem("scanUrl");
      getWechat({ url: purl }).then(res => {
        if (res.code == 200) {
          this.info = res.data;
          setTimeout(() => {
            this.getSign();
          }, 1000);
        }
      });
    },
    getSign() {
      let configData = {
        debug: false,
        appId: this.info.appId,
        timestamp: "" + this.info.timestamp,
        nonceStr: this.info.nonceStr,
        signature: this.info.signature,
        jsApiList: ["getLocation"]
      };
      wx.config(configData);
      wx.ready(() => {
        wx.getLocation({
          type: "wgs84",
          success: res => {
            this.selcity(res.longitude, res.latitude);
            sessionStorage.setItem("longitude", res.longitude);
            sessionStorage.setItem("latitude", res.latitude);
          },
          fail: () => {
            this.createMap2();
          }
        });
      });
      wx.error(function (res) { });
    },
    selcity(latitude, longitude) {
      this.center.lng = latitude;
      this.center.lat = longitude;
      this.getCity(this.city);
    },
    createMap2() {
      var _this = this;
      if (_this.center.lng == "" || _this.center.lng == null) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(
          function (position) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              let latitude = position.latitude;
              let longitude = position.longitude;
              let city = position.address.city.substring(0, position.address.city.length - 1);
              _this.city = city;
              _this.center.lng = longitude;
              _this.center.lat = latitude;
              _this.getCity(_this.city);
            }
          },
          { enableHighAccuracy: true }
        );
      }
    },
    createMap() {
      const geolocation = new BMap.Geolocation();
      var _this = this;

      // 1. 先用缓存城市请求
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

          // 2. 有缓存城市，定位就不覆盖
          if (sessionStorage.getItem("cityName")) {
            console.log("已有缓存城市，跳过定位覆盖");
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
    // -------- 城市（完全按首页） --------
    getCity(cityName) {
      console.log("getCity 传入的城市名:", cityName);
      getCityList({ keyword: cityName }).then(res => {
        const allCities = res.data || [];
        console.log("城市总数:", allCities.length);

        // 本地按名字匹配
        const target = allCities.find(c => c.name === cityName)
          || allCities.find(c => c.name === cityName + "市")
          || allCities.find(c => c.name.includes(cityName))
          || allCities[0];

        console.log("匹配到的城市:", target);

        if (target) {
          this.cityList = [target];
          this.city = target.name;
          this.newCityId = target.id;
          this.targetId = target.cityid1;

          sessionStorage.setItem("targetId", target.cityid1);
          sessionStorage.setItem("targetId2", target.cityid2);
          sessionStorage.setItem("cityName", target.name);
          sessionStorage.setItem("cityId2", target.id);
          sessionStorage.setItem("cityItem", JSON.stringify([target]));

          this.getFilmCinemasList();
        }
      });
    },
    chooseAddress() {
      this.show = !this.show;
    },
    searchList() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getFilmCinemasList();
        this.timer = undefined;
      }, 1000);
    },
    allRegion() {
      this.show = false;
      this.region = "请选择区域";
      this.getFilmCinemasList();
    },
    changeRegion(item) {
      this.searchValue = "";
      this.region = item.name;
      this.getFilmCinemasList(item.id);
      this.show = false;
    },
    // -------- 影院列表 --------
    getFilmCinemasList(quid = "") {
      if (!this.newCityId) {
        console.warn("newCityId 为空，跳过影院请求");
        return;
      }

      // 经纬度兜底：定位失败时用默认或缓存
      const lng = this.center.lng || sessionStorage.getItem("longitude") || "116.404";
      const lat = this.center.lat || sessionStorage.getItem("latitude") || "39.915";

      const params = {
        cityid: this.newCityId,   // 动态城市 id
        lng,
        lat,
        quid,
        keyword: this.searchValue,
        movieId: this.urlid
      };
      console.log("影院请求参数:", params);

      getCinemaList(params).then(res => {
        console.log("影院返回:", res);
        if (res.code == 200) {
          this.loadingflag = false;
          this.total = res.data.city_num;
          this.countyList = res.data.qu_list;
          this.allCinemaList = res.data.yingyuan || [];
        }
      });
    }
  },
  created() {
    this.loadingflag = true;
    this.getBanner();

    this.urlid = Number(this.$route.query.movieId) || "";
    this.movieCode = this.$route.query.movieCode || "";
    this.moveName = this.$route.query.moveName || "";

    // 完全按首页：只调 createMap
    this.createMap();
  },
  mounted() {
    this.page_no = 0;
  }
};
</script>
<style scoped lang="less">
.pageView {
  min-height: calc(100vh - 46px);
  background-image: linear-gradient(to bottom, #F7F7F7, #F7F7F7);
}

.addBg {
  background-image: linear-gradient(to bottom, #FF6E9E, #F7F7F7);
}

//头部
.topPage {
  background: transparent;
  padding: 5px 15px 5px;

  .title {
    text-align: center;
    color: white;
    font-size: 14px;
  }

  .address {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
  }

  .searchBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }


  .searchValue {
    width: 80%;
  }

  .van-search {
    padding-right: 5px;
  }

  .van-search .van-cell {
    background-color: transparent;
  }

  .van-search__content {
    background-color: #ffffff;
    border-radius: 30px;
  }

  /deep/ .van-field__control {
    color: #92716D;
  }
}

//banner
.banner {
  //background-color: #92716D;
  width: 100%;
  //height: 168px;
  height: 21vh;
  overflow: hidden;
}

//center
.centerBox {
  padding: 10px 10px 62px;
  min-height: calc(100vh - 76px - 23vh - 99px);
  position: relative;
  margin-top: -5px;

  .choose {
    font-weight: bold;
    color: #564A3F;
  }

  .pull-down {
    width: 12px;
    height: 13px;
  }

  .listMax {
    margin-top: 10px;
  }

  .listBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 18px 15px;
    border-radius: 5px;
    font-weight: 600;
    color: #393939;
    margin-top: 13px;

    .nameBox {
      width: 80%;
    }

    .nameNone {
      white-space: nowrap;
      overflow: hidden;
      width: 85%;
      text-overflow: ellipsis;
      font-weight: bold;
    }

    .detailAdress {
      color: #727272;
      font-size: 12px;
      font-weight: 500;
      margin-top: 7px;
      white-space: nowrap;
      overflow: hidden;
      width: 90%;
      text-overflow: ellipsis;
    }

    .form {
      color: #EE4D53;
      font-size: 13px;
    }
  }
}

//弹框选择地址
.van-overlay {
  background-color: rgba(0, 0, 0, .5);
}

.van-popup {
  top: 38px;
  width: 100%;
  transition: none;
  height: calc(49vh - 60px);
  position: absolute;
  padding-top: 12px;
}

.chooseAddress {
  position: relative;
  z-index: 55555;
  background-color: white;
  width: calc(100% + 20px);
  left: -10px;
  border-bottom: 1px #A4A4A4 solid;
  //font-size: 13px;
}

.addRegion {
  color: #EC2B31;
  font-weight: bold;
  font-size: 13px;
}

.regionNum {
  padding-left: 13px;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px #E5E5E5 solid;
  padding: 10px 20px;
}

.number {
  color: #A2A2A2;
}

.region {
  color: #070707;
}

.address {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #433B32;
  justify-content: center;
  padding: 10px 0px;
}

.pull-down {
  width: 12px;
  height: 12px;
}

.city {
  white-space: nowrap;
}

.noneList {
  text-align: center;
  padding: 10px 0;
}
</style>
