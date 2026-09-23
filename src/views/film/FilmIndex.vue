<template>
  <div class="indexwrap">
    <EnterLoging v-if="loadingflag"></EnterLoging>

    <div class="indexCenter">
      <div class="header">
        <div class="headerleft">
          <City></City>
        </div>
        <div class="headercenter">
          <van-search class="search" shape="round" background="#fff0" v-model="searchtext" @input="inpchange"
            @clear="searchtext = ''" placeholder="输入影片搜索" style="padding: 0;" />
        </div>
        <div class="headerright" @click="gokefu">
          <img class="img" src="@/assets/kfb.png" alt="">
        </div>
      </div>

      <!-- 轮播图 -->
      <div class="banner">
        <van-swipe class="my-swipe" indicator-color="red">
          <van-swipe-item v-for="(item, index) in swiperimg" :key="index" @click="toFDetail(item.url)">
            <img class="img" :src="item.img" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 文娱会员 -->
      <div class="welfare mt0" v-if="searchtext == '' && (kaquan_list1.length > 0 || kaquan_list2.length > 0)">
        <div class="hotsize">
          <div class="hotsizeTitle">文娱会员</div>
          <div class="gomemberindex" @click="gomemberindex">
            <div>全部</div>
            <div class="icons">
              <van-icon class="hoticon" size="12px" name="arrow" color="#A2988C" />
            </div>
          </div>
        </div>
        <div class="welfarebox bgfff mt2">
          <div class="left" style="position: relative;">
            <div class="leftimgbox" v-for="(item, index) in kaquan_list1" :key="item.id" @click="godetail(item)">
              <img :src="item.img" alt="">
            </div>
          </div>
          <div class="right">
            <div class="wrap1" v-for="item in kaquan_list2" :key="item.id">
              <div class="circle">
                <a :href="item.url">
                  <img :src="item.img" alt="">
                </a>
              </div>
              <span style="white-space: nowrap">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热映榜单 -->
    <div v-if="searchtext == ''" style="padding: 0 15px;">
      <div class="welfare reying">
        <div class="hotsize hotsize2">
          <div class="hotsizeTitle hotsizeTitle2">热映榜单</div>
          <div class="gomemberindex" @click="hotlist">
            <div>全部</div>
            <div class="icons">
              <van-icon class="hoticon" size="12px" name="arrow" color="#A2988C" />
            </div>
          </div>
        </div>
        <div class="hot bgfff">
          <div>
            <div class="banshi">
              <div class="swiper-container1">
                <div class="swiper-wrapper1">
                  <div v-for="(item, index) in swiperList" :key="index" class="swiper-slide1">
                    <div class="imgbox" style="position: relative;">
                      <img @click="filmdetail(item.id)" class="hotimg" :src="item.logo" alt="">
                      <div class="score">评分 {{ item.rating }}</div>
                      <img class="logonum" :src="require('@/assets/number/' + (index + 1) + '.png')" alt="">
                    </div>
                    <p class="hotname elips1">{{ item.name }}</p>
                    <button @click="buyticket(item)">购&nbsp;票</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 正在热映 / 即将上映 -->
    <van-tabs class="seehotlist" v-model="active" @change="changeActive" title-active-color="#240003" :line-width="22"
      background="#fff0">
      <van-tab title="正在热映"></van-tab>
      <van-tab title="即将上映"></van-tab>
    </van-tabs>

    <div class="filmboxMax">
      <div class="filmbox" v-for="(item, index) in hotfilmList" :key="index" @click="filmdetail(item.id)">
        <div class="filmleft">
          <div class="posterUrl">
            <img class="img" :src="item.logo" alt="">
          </div>
          <div class="nameBox">
            <div class="elips11 itemName">{{ item.name }}</div>
            <div class="starBox" v-if="item.actors">
              <div class="font1">主演:</div>
              <div class="font2 elips11">{{ item.actors.split(",").join("/") }}</div>
            </div>
            <div class="starBox" v-if="item.director">
              <div class="font1">导演:</div>
              <div class="font2 elips11">{{ item.director }}</div>
            </div>
            <div class="starBox categoryBox">
              <div v-if="item.type" class="category elips11">{{ item.type.split(",").join("/") }}</div>
              <div v-if="item.showmark" class="category elips11">{{ item.showmark }}</div>
            </div>
          </div>
        </div>
        <div class="filmright">
          <div class="itemscore" v-if="active == 0">评分
            <span>{{ item.rating }}</span>
          </div>
          <div class="itemscore" v-if="active == 1 && item.boughtcount > 0">
            <span>{{ item.boughtcount > 1000 ? (item.boughtcount / 10000).toFixed(1) : item.boughtcount }}</span>{{
              item.boughtcount > 1000 ? "万" : '' }}人想看
          </div>
          <div class="pap" v-if="item.canbuy || active == 0" :class="{ pap2: active == 1 }"
            @click.stop="buyticket(item)">
            {{ active == 0 ? "购 票" : "预 售" }}
          </div>
        </div>
      </div>
    </div>


    <!--  -->

   <FilmTabbar :active="0"></FilmTabbar>
    <!--  -->

  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

// 商城接口
import { getLogo, getWechat } from "@/api/lhcard"
import FilmTabbar from "@/components/FilmTabbar.vue";
// 电影接口
import { getComingMoviesList, getHitFilmList, getCityList, getIndexBannerList } from "@/api/lehuifilm";

// 地图、组件
import BMap from "BMap"
import City from "@/components/CityFilm.vue";
import EnterLoging from "@/components/EnterLoging";
import wx from "weixin-js-sdk";

export default {
  components: { City, EnterLoging,FilmTabbar },
  data() {
    return {activeTab: 0,  
      info: "66666",
      swiperimg: [],
      searchtext: "",
      swiper: null,
      swiperList: [],
      hotfilmList: [],
      center: { lng: "", lat: "" },
      cityList: [],
      city: "正在定位",
      cityid: null,
      cityid2: null,
      kaquan_list1: [],
      kaquan_list2: [],
      loadingflag: true,
      kefu: "",
      active: 0,
      timer: null
    }
  },
  methods: {
    goTab(path) {
  // 「我的」跳商城首页（如果是同一个项目用 router，如果不同项目用 location.href）
  if (path === '/mine') {
    // 同一个项目
    this.$router.push({ path: '/mine' })
    // 如果是另一个商城项目，改成：
    // window.location.href = 'http://127.0.0.1:8080/#/mine'
    return
  }
  if (this.$route.path !== path) {
    this.$router.push({ path })
  }
},
    getLocation1() {
      let purl = /(Android)/i.test(navigator.userAgent)
        ? location.href.split('#')[0]
        : window.localStorage.getItem('scanUrl');
      getWechat({ url: purl }).then(res => {
        if (res.code == 200) {
          this.info = res.data
          setTimeout(() => { this.getSign() }, 1000)
        }
      })
    },
    getSign() {
      let configData = {
        debug: false,
        appId: this.info.appId,
        timestamp: "" + this.info.timestamp,
        nonceStr: this.info.nonceStr,
        signature: this.info.signature,
        jsApiList: ['getLocation']
      }
      wx.config(configData);
      wx.ready(() => {
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            this.getCityName(res.longitude, res.latitude)
          },
          fail: () => { }
        });
      });
      wx.error(function (res) { });
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    getCityName(lng, lat) {
      let point = new BMap.Point(lng, lat);
      let geoc = new BMap.Geocoder();
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        this.city = addComp.city;
        sessionStorage.setItem("cityName", this.city)
        this.getCity1(this.city)
      });
    },
    getCity1(cityName) {
      getCityList({
        keyword: cityName ? cityName.replace(/市$/, '') : '',
      }).then(res => {
        this.cityList = res.data || []
      })
    },
    gomemberindex() {
      this.$router.push({ path: "/memberindex" })
    },
    godetail(item) {
      this.$router.push(item.url)
    },
    toFDetail(url) {
      if (url) {
        this.$router.push({ path: url + "&cityid=" + this.cityid })
      }
    },
    hotlist() {
      this.$router.push({ path: "/hotlist", query: { cityid: '' + this.cityid } })
    },
    filmdetail(id, showSt) {
      this.$router.push({ path: "/filmdetail", query: { id, showSt } })
    },
    inpchange(e) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.active == 0) {
          this.getFilm()
        } else {
          this.getFutureFilm()
        }
        this.timer = undefined;
      }, 1000)
    },
    changeActive(e) {
      if (e == 0) {
        this.getFilm()
      } else {
        this.getFutureFilm()
      }
    },
    getLoginInfo() {
      getLogo().then(res => {
        if (res.code == 200) {
          this.kefu = res.data.zxkf
        }
      })
    },
    getallSwiper() {
      getIndexBannerList().then(res => {
        if (res.code == 200) {
          this.swiperimg = res.data.list
          this.kaquan_list1 = res.data.kaquan_list1 || []
          this.kaquan_list2 = res.data.kaquan_list2 || []
        }
      })
    },
    gokefu() {
      window.location.href = this.kefu
    },
    createMap() {
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        let city = position.address.city.substring(0, position.address.city.length - 1);
        let province = position.address.province;
        _this.center.lng = longitude;
        _this.center.lat = latitude;
        _this.city = city

        if (_this.isWeiXin()) {
          if (sessionStorage.getItem("targetId2")) {
            _this.getCity(_this.city)
          } else {
            _this.getLocation1()
            _this.getCity(_this.city)
          }
        } else {
          _this.getCity(_this.city)
        }
      }, { enableHighAccuracy: true }, function (e) {
      }, {
        provider: 'baidu'
      });
    },
    buyticket(item) {
      this.$router.push({
        path: "/multiplex",
        query: { movieId: item.id, moveName: item.name }
      })
    },
    getCity(cityName) {
      getCityList({ keyword: cityName }).then(res => {
        this.cityList = res.data || []
        if (this.cityList.length > 0) {
          if (!sessionStorage.getItem("cityName")) {
            sessionStorage.setItem("targetId", this.cityList[0].cityid1)
            sessionStorage.setItem("targetId2", this.cityList[0].cityid2)
            sessionStorage.setItem("cityName", this.cityList[0].name)
            sessionStorage.setItem("cityId2", this.cityList[0].id)
            sessionStorage.setItem("cityItem", JSON.stringify(this.cityList))
          }
          this.city = sessionStorage.getItem("cityName")
          this.cityid = this.cityList[0].cityid1
          this.cityid2 = this.cityList[0].cityid1
          this.getFilm()
        }
      })
    },
    getFilm() {
      getHitFilmList({ citycode: this.cityid2 }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.hotfilmList = res.data.movieList || []
          this.swiperList = (res.data.movieList || []).slice(0, 10)
          if (this.searchtext == "") {
            setTimeout(() => { this.getSwiper() }, 500)
          } else {
            this.hotfilmList = (res.data.movieList || []).filter(item => item.name.includes(this.searchtext))
          }
        }
      })
    },
    getFutureFilm() {
      getComingMoviesList({ citycode: this.cityid2 }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.hotfilmList = res.data.movieList || []
          if (this.searchtext == "") {
            setTimeout(() => { this.getSwiper() }, 500)
          } else {
            this.hotfilmList = (res.data.movieList || []).filter(item => item.name.includes(this.searchtext))
          }
        }
      })
    },
    getSwiper() {
      this.swiper = new Swiper(".swiper-container", {
        loop: false,
        grabCursor: true,
        paginationClickable: true,
        slidesPerView: 3.7,
        spaceBetween: 2,
        observer: true,
        observeParents: true,
      })
    }
  },
  mounted() {
    this.getLoginInfo()
    this.getallSwiper()
  },
  created() {
    this.createMap()
  },
}
</script>


<style scoped lang="less">
.elips1 {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  //width: 100% !important;
}

.elips11 {
  color: #474747;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  //width: 100% !important;
}

.van-tabs__nav {
  background-color: transparent !important;
}

.indexwrap {
  //width: 100vw;
  //overflow-y: scroll;
  min-height: calc(100vh - 50px);
  background-color: #FFF8E2;
  //overflow: hidden;
}


.indexCenter {
  background: linear-gradient(#FF6E9E, #FFF8E2);
  padding: 0 15px;
}

.indexwrap .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0px 11px;
  gap: 10px;
}

.indexwrap .header .cross,
.service,
.ellipsis,
.arrow-down {
  color: #fff;

}

.headercenter {
  width: 100%;
  padding-left: 10px;

  /deep/ .van-search__content {
    background-color: #ffffff;
  }

  /deep/ .van-cell {
    font-size: 13px;
  }
}

.headerright {
  position: relative;
  top: 3px;
  width: 43px;
}

.indexwrap .header .headerleft .address {
  margin-left: 10px;
  height: 100%;
  display: flex;
  align-items: center;
}

.indexwrap .header .headerleft .address span {
  font-size: 15px;
  color: #fff;
  margin-right: 3px;
}

/* banner部分 */
.indexwrap .banner {
  //border-radius: 10px;
  //height: 190px;
}

.indexwrap .banner .my-swipe {
  //height: 135px;
  //height: 21vh;\\
  border-radius: 8px;
}

.indexwrap .banner .my-swipe /deep/ .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  border-radius: 8px;
}

.indexwrap .banner .my-swipe /deep/ .van-swipe-item img {
  background-size: cover;
  border-radius: 8px;
}

.indexwrap .banner /deep/ .van-swipe__indicator {
  background-color: #fff;
}

.indexwrap .welfare {
  //height: 210px;
  background-image: linear-gradient(to bottom, #f7ecee 10%, #ffffff 90%);
  margin: 5px 0px 10px 0px;
  border-radius: 8px;
}

.indexwrap .welfare.reying {

  background-image: linear-gradient(to bottom, #FDECCC 1%, #ffffff 99%);
}

.indexwrap .welfare.bikan {
  background-image: linear-gradient(to bottom, #FFDFD5 1%, #ffffff 99%);
}

.indexwrap .welfare.mt0 {
  margin-top: 2px;

}

.indexwrap .welfare .welfarebox {
  width: 100%;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  padding: 0px 10px 8px;
  box-sizing: border-box;
  justify-content: space-between;
}

.indexwrap .welfare .bgfff {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: #ffffff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.welfarebox .mt2 {
  padding-top: 2px;
}

.indexwrap .welfare .welfarebox .left {
  width: 53%;
  /* background-color: red; */
  //margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // padding-top: 5px;
}

.indexwrap .welfare .welfarebox .left .leftimgbox {
  width: 48%;
  overflow: hidden;
}

.indexwrap .welfare .welfarebox .left .leftimgbox img {
  width: 100%;
  /* height: 200px; */
}

.indexwrap .welfare .welfarebox .right {
  width: 44%;
  display: flex;
  flex-wrap: wrap;
  /* margin: 5 0px; */
  //padding: 5px 10px;
  justify-content: space-between;
  gap: 5px;
}

.indexwrap .welfare .welfarebox .right .wrap1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27%;
}

.indexwrap .welfare .welfarebox .right .circle {
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  width: 100%;
  text-align: end;
  overflow: hidden;
}

.indexwrap .welfare .welfarebox .right .circle a {
  display: initial;
}

.indexwrap .welfare .welfarebox .right .circle img {
  flex: none;
  width: 90%;
}

.indexwrap .welfare .welfarebox .right span {
  color: #342C2C;
  font-size: 12px;
  line-height: 1;
}


/* 热映榜单标题 */
.hotsize {
  padding: 8px 10px 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-image: linear-gradient(to bottom, #f7ecee 50%, #ffffff);

  .hotsizeTitle {
    font-size: 16px;
    color: #FF2F70;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .hotsizeTitle2 {
    color: #FF2F70;
  }

  .gomemberindex {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #9B9186;
    font-size: 12px;

    .icons {
      height: 12px;
    }
  }
}

.hotsize2 {
  margin-top: 3px;
}

/deep/ .van-tab {
  flex: none;
  font-size: 16px;
}

/deep/ .van-tabs--line .van-tabs__wrap {
  height: 38px;
  padding: 0px 12px;
}

.indexwrap /deep/ .van-hairline--top-bottom::after {
  border: none !important;
}

/* 热映榜单 */

.hot {
  overflow: hidden;
  padding: 3px 10px 9px 10px;

  .swiper-wrapper1 {
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    gap: 8px;

    .swiper-slide1 {
      min-width: 92px;
    }
  }

  .swiper-wrapper1::-webkit-scrollbar {
    display: none;
    /* 对于 Chrome, Safari 和 Opera */
  }

  .imgbox {
    width: 100%;
    height: 121px;
    border-radius: 5px;
    overflow: hidden;
  }

  .score {
    position: absolute;
    left: 0;
    bottom: 0px;
    z-index: 100;
    color: #fff;
    background-image: linear-gradient(to bottom, #00000012, #000000);
    font-size: 12px;
    width: 100%;
    padding: 5px 9px 5px;
    box-sizing: border-box;
  }

  .logonum {
    position: absolute;
    top: 0px;
    left: 5px;
    width: 18px;
  }

  button {
    font-size: 13px;
    color: #fff;
    border: none;
    background-image: linear-gradient(to bottom, #FF6E9E, #FF2F70);
    border-radius: 30px;
    margin: auto;
    display: block;
    width: 63px;
    height: 26px;
    line-height: 27px;
    font-weight: 500;
    padding: 0px;
    margin-top: 5px;
  }

  .hotimg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hotname {
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 0;
  }
}

.filmboxMax {
  padding: 0px 16px 65px;
  margin-top: -3px;
}

.filmbox {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  //align-items: center;
  justify-content: space-between;
  margin-top: 13px;

  .filmleft {
    display: flex;
    //align-items: center;
    gap: 8px;
    width: 71%;

    .posterUrl {
      min-width: 76px;
      width: 76px;
      overflow: hidden;
      border-radius: 7px;

      img {
        display: flex;
      }
    }

    .nameBox {
      width: calc(100% - 84px);
      font-size: 13px;

      .itemName {
        font-size: 18px;
        color: #222222;
      }

      .starBox {
        display: flex;
        align-items: center;
        white-space: nowrap;
        gap: 2px;
        margin-top: 5px;
      }

      .font1 {
        color: #474747;
      }

      .categoryBox {
        gap: 6px;
        margin-top: 11px;

        .category {
          color: #c2c2c2;
          border-radius: 2px;
          border: 1px solid #e4e2e2;
          font-size: 10px;
          height: 18px;
          line-height: 18px;
          padding: 0px 6px;
          max-width: 112px;

        }
      }

    }
  }

  .filmright {
    padding-top: 3px;

    .itemscore {
      font-size: 12px;
      color: #756B59;
      text-align: end;

      span {
        color: #D7000F;
        font-size: 15px;
      }
    }

    .pap {
      background-color: #FF2F70;
      font-size: 12px;
      color: #fff;
      font-weight: 500;
      border-radius: 30px;
      width: 63px;
      height: 26px;
      line-height: 27px;
      margin-top: 17px;
      text-align: center;
      // line-height: 27px;
    }

    .pap2 {
      background-color: #40A6FB;
    }
  }
}

//
.birthdayBox {
  overflow-x: auto;
  overflow-y: hidden;
  // margin-top: 8px;
  //background-color: white;
  border-radius: 10px;

  .birthday {
    display: flex;
    gap: 3px;
    padding: 3px 0px 5px;

    .listItem {
      width: 100%;
      padding-bottom: 5px;
      padding: 0px 1px 3px;
      border-radius: 5px;

      .textInfo {
        font-size: 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        /* 显示两行 */
        margin-top: 5px;
      }

      .hotText {
        color: #F0585E;
        border-radius: 30px;
        //text-align: center;
        font-size: 12px;
        //width: 70%;
        margin: auto;
        position: relative;
        z-index: 2;
        padding: 2px 0px;
        margin-top: 6px;
      }

      .title {
        font-size: 12px;
        font-weight: bold;
        color: #313131;
        padding-top: 3px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        /* 显示两行 */
      }

      .shopInfo {
        padding: 0px 6px;
      }


      .oprice {
        font-size: 10px;
        color: #A1A1A1;
        text-decoration: line-through;
      }
    }
  }
}


.birthdayBox::-webkit-scrollbar {
  display: none
}

.pap {
  white-space: nowrap;
}
</style>