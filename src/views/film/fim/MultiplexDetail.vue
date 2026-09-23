<script src="../../utils/ASCII.js"></script>
<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <div class="pinkbg">
      <div class="title">{{ cinema.name }}</div>
    </div>

    <div class="addressBox">
      <div class="addressMax">
        <div>
          <div class="address">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="location-o" />
            </div>
            <div>{{ cinema.address }}</div>
          </div>
          <div class="address" style="margin-top: -4px; padding-left: 2px">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="phone-o" />
            </div>
            <div>
              <a :href="'tel:' + cinema.contactphone" style="color: #AAAAAA; text-decoration: none;">
                {{ cinema.contactphone }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="filmBox" :style="{ backgroundImage: isShow ? 'url(' + imgLogo + ')' : '' }">
      <div class="masking"></div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" ref="swiper-slide" v-for="(item, index) in moveList" :key="item.id"
            @click="amplify(item.id, item.logo, item.name)">
            <div class="bannerImg" :class="{ amplify: selectId == item.id }">
              <img v-if="isShow" class="img" :src="item.logo" alt="">
            </div>
            <div class="detail" v-if="selectId == item.id && isShow">
              <div class="namea">
                <div>{{ item.name }}</div>
                <div class="showmark" v-if="item.showmark">{{ item.showmark }}</div>
              </div>
              <div class="duration">
                <div>{{ item.duration }}分钟</div>
                <div>/</div>
                <div>{{ item.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab">
      <van-tabs @click="changeTime" v-model="active" title-active-color="#ED2E34" color="#F05B60"
        title-inactive-color="#B0B0B0" :line-width="20" :line-height="2">
        <van-tab :title="item" v-for="item in daysList" :key="item"></van-tab>
      </van-tabs>
    </div>

    <div class="list">
      <div class="listItem" v-for="(item, index) in chedulingList" :key="index"
        @click="toSetMaps(item.opiid, item.movieid)">
        <div class="chedulingTime">
          <div class="timeBox">
            <div class="time">{{ item.playtime.split(" ")[1].split(":").slice(0, 2).join(":") }}</div>
            <div class="office">{{ item.closetime.split(" ")[1].split(":").slice(0, 2).join(":") }}散场</div>
          </div>
          <div>
            <div class="language">{{ item.edition }}</div>
            <div class="officeText">{{ item.roomname }}</div>
          </div>
        </div>
        <div class="rightBox">
          <div class="priceBox">
            <span class="price">{{ (item.showPrice / 100).toFixed(2) }}</span>
            <span class="first">元起</span>
          </div>
          <van-button plain type="danger" class="btn">购票</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {
  getCinemaDetail,
  getMovieDetail,
  getOpiList,
  getCityList
} from "@/api/lehuifilm";
import Swiper from "swiper";

moment.locale('zh-cn');

export default {
  name: "MultiplexDetail",
  data() {
    return {
      active: 0,
      nowDate: "",
      days: "",
      cinema: {},
      chedulingList: [],
      isToday: false,
      swiper: null,
      moveList: [],
      selectId: "",
      movieidList: [],
      daysList: [],
      imgLogo: "",
      moviename: "",
      day: "",
      isShow: false,
      isSwiper: false,
      arryList: [],
      loadingflag: false,
      city: "",
      cityid: "",
      moveId: "",
      moveName: "",
      allOpilist: []
    };
  },
  methods: {
    moveItemToFirst(arry) {
      const index = arry.findIndex(item => item.name === this.moveId);
      if (index !== -1) {
        const item = arry.splice(index, 1)[0];
        arry.unshift(item);
      }
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    toSetMaps(opiid, movieid) {
      if (!localStorage.getItem("token")) {
        this.$toast("请先登录");
        setTimeout(() => {
          if (this.isWeiXin()) {
            this.$router.replace("/quickLogin");
          } else {
            this.$router.replace("/login");
          }
        }, 1000);
        return;
      }
      this.$router.push({ path: '/filmSeat', query: { opiid, movieid } });
    },

    // -------- 影院详情 --------
   getDetail(cinemaid) {
  getCinemaDetail({ cinemaid }).then(res => {
    console.log("影院详情 res:", JSON.stringify(res));
    console.log("res.data:", res.data);

    if (res.code == 200) {
      // 兼容多种结构
      this.cinema = res.data.cinema || res.data.cinemaInfo || res.data;
      console.log("赋值后的 cinema:", this.cinema);
      console.log("standardid:", this.cinema.standardid);

      if (this.cinema.standardid) {
        this.getScheduling2();
      } else {
        console.warn("standardid 为空，无法请求排期");
      }
    }
  });
},

    // -------- 排期列表（全量） --------
    getScheduling2() {
      console.log("cinema:", this.cinema);
      console.log("standardid:", this.cinema.standardid);

      getOpiList({ standardid: this.cinema.standardid }).then(res => {
        console.log("排期返回:", res);
        if (res.code == 200) {
          if (!res.data.opilist || res.data.opilist.length == 0) {
            this.$toast("暂无排期");
            setTimeout(() => { this.$router.go(-1); }, 2000);
            return;
          }
          this.allOpilist = res.data.opilist;
          res.data.opilist.forEach(item => {
            this.movieidList.push(item.movieid);
          });
          this.movieidList = Array.from(new Set(this.movieidList));

          for (let i = 0; i < this.movieidList.length; i++) {
            this.getMove(this.movieidList[i]);
          }
        }
      });
    },

    // -------- 影片详情 --------
    async getMove(movieid) {
      await getMovieDetail({
        citycode: this.cityid,
        movieid: movieid
      }).then(res => {
        if (res.code == 200) {
          this.arryList.push(res.data.movie);
          this.moveList = this.arryList.slice().sort((a, b) => a.id - b.id);
          if (this.moveId) {
            this.moveItemToFirst(this.moveList);
          }
          this.selectId = this.moveList[0].id;
          this.imgLogo = this.moveList[0].logo;
          this.moviename = this.moveList[0].name;

          setTimeout(() => {
            let allOpilist = this.allOpilist || [];
            allOpilist = allOpilist.filter(item => item.moviename == this.moviename);
            allOpilist.forEach(item => {
              this.daysList.push(item.playdate);
            });
            this.daysList = Array.from(new Set(this.daysList));
            this.daysList.sort((a, b) => new Date(a) - new Date(b));

            if (this.daysList.length) {
              this.getScheduling(this.daysList[0], this.moviename);
            }
          }, 800);

          this.isSwiper = true;
        }
      });
    },

    // -------- 单日排期 --------
    getScheduling(days, moviename) {
      this.chedulingList = [];
      getOpiList({ standardid: this.cinema.standardid }).then(res => {
        if (res.code == 200) {
          this.chedulingList = res.data.opilist.filter(
            item => item.playdate == days && item.moviename == moviename
          );
        }
      });
    },

    // -------- 切换电影 --------
    amplify(movieid, logo, moviename) {
      this.selectId = movieid;
      this.imgLogo = logo;
      this.moviename = moviename;
      this.isToday = true;
      this.active = 0;
      this.daysList = [];
      let allOpilist = this.allOpilist || [];
      allOpilist = allOpilist.filter(item => item.moviename == this.moviename);
      allOpilist.forEach(item => {
        this.daysList.push(item.playdate);
      });
      this.daysList = Array.from(new Set(this.daysList));
      this.daysList.sort((a, b) => new Date(a) - new Date(b));
      if (this.daysList.length) {
        this.getScheduling(this.daysList[0], this.moviename);
      }
    },

    changeBanner(activeIndex) {
      this.selectId = this.moveList[activeIndex].id;
      this.moviename = this.moveList[activeIndex].name;
      this.imgLogo = this.moveList[activeIndex].logo;
      this.isToday = true;
      this.daysList = [];
      let allOpilist = this.allOpilist || [];
      allOpilist = allOpilist.filter(item => item.moviename == this.moviename);
      allOpilist.forEach(item => {
        this.daysList.push(item.playdate);
      });
      this.daysList = Array.from(new Set(this.daysList));
      this.daysList.sort((a, b) => new Date(a) - new Date(b));
      if (this.daysList.length) {
        this.getScheduling(this.daysList[0], this.moviename);
      }
    },

    // -------- 轮播 --------
    getSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        clickable: true,
        observer: true,
        observeParents: true,
        on: {
          click: () => {},
          slideChange: () => {
            this.changeBanner(this.swiper.activeIndex);
            this.active = 0;
          }
        },
        paginationClickable: true,
        slideToClickedSlide: true,
        slidesPerView: 5,
        spaceBetween: 40,
        centeredSlides: true
      });
    },

    // -------- tab 切换 --------
    changeTime(e) {
      this.isToday = true;
      this.day = this.daysList[e];
      this.getScheduling(this.daysList[e], this.moviename);
    },

    // -------- 城市列表 --------
    getCity() {
      getCityList({ keyword: "" }).then(res => {
        const list = res.data || [];
        const target = list.find(c => c.name === this.city) || list[0];
        if (target) this.cityid = target.cityid1;
      });
    }
  },
  mounted() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.pageYOffset = 0;
    setTimeout(() => { this.getSwiper(); }, 1000);
  },
  created() {
    this.loadingflag = true;
    setTimeout(() => { this.loadingflag = false; }, 1700);

    this.nowDate = moment(new Date()).format('MM-DD');
    this.days = moment(new Date()).add(1, 'days').format('MM-DD');
    this.day = moment(new Date()).format('yyyy-MM-DD');

    this.city = this.$route.query.city;
    this.moveId = this.$route.query.moveName;
    this.moveName = this.$route.query.moveName;

    this.getCity();
    this.getDetail(this.$route.query.id);

    setTimeout(() => { this.isShow = true; }, 1100);
  }
};
</script>

<style scoped lang="less">
.pinkbg {
  color: #ffffff;
  padding: 15px;
  background: linear-gradient(to right, #FF6E9E, #FF2F70);
}

.location {
  background-color: #F0F0F0;
  min-height: 100vh;
}

.addressBox {
  background-color: white;
  padding: 10px 15px 7px;

  .title {
    font-weight: bold;
    color: #313131;
  }

  .address {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #AAAAAA;
    font-size: 12px;
  }

  .addressMax {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.filmBox {
  width: 100%;
  height: 28vh;
  background-size: 100% auto;
  background-position-y: 32%;
  position: relative;

  .masking {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #000000b8;
  }
}

.tab {
  font-weight: bold;
}

/deep/ .van-tab span {
  font-weight: 600 !important;
}

/deep/ .van-tabs__nav--line {
  padding-bottom: 11px;
}

.list {
  padding: 0px 10px 10px;

  .listItem {
    background-color: white;
    border-radius: 5px;
    padding: 13px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    gap: 10px;
  }

  .btn {
    border-radius: 30px;
    height: 30px;
    line-height: 29px;
    color: #F05359;
    font-weight: bold;
    white-space: nowrap;
  }

  .time {
    font-weight: bold;
    font-size: 20px;
    color: #2D2D2D;
    white-space: nowrap;
  }

  .language {
    font-size: 13px;
    color: #2C2C2C;
  }

  .chedulingTime {
    display: flex;
    gap: 17px;
    align-items: center;
  }

  .office {
    color: #A5A5A5;
    font-size: 12px;
    white-space: nowrap;
  }

  .officeText {
    color: #A5A5A5;
    font-size: 12px;
    margin-top: 5px;
  }

  .priceBox {
    color: #F1595E;
    white-space: nowrap;
  }

  .price {
    font-size: 20px;
  }

  .first {
    font-size: 13px;
  }

  .rightBox {
    display: flex;
    align-items: center;
    gap: 18px;
  }
}

.bannerImg {
  width: 100%;
  height: 15vh;
  border-radius: 10px;
  overflow: hidden;
}

.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: center;
  color: #ffffffb0;
  font-size: 10px;
  margin-top: 2px;
}

.namea {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: center;
  color: white;
  font-size: 16px;
}

.detail {
  white-space: nowrap;
  margin-top: 15px;
}

.showmark {
  color: #BCA48A;
  border: 1px solid;
  font-size: 10px;
  padding: 1px 3px;
  border-radius: 4px;
}

.swiper-container {
  width: 100%;
  height: 100%;
  padding: 18px 0px 0px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.8);
}

.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}
</style>