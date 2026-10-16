<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
     
    <div class="topBox" style="padding: 0px;" ref="topBox1">
      <div class="topPage">
      
        <div class="searchBox">
          <div>
             
            <Cityyanchu :key="city"></Cityyanchu>
          </div>
          <div class="searchValue" @click="toOther('/performSortPage?id=0')">
            <van-search background="#fff0" placeholder="找演出" v-model="searchValue" />
          </div>
          <div class="customer" @click="toCustomer">
            <img class="img" src="@/assets/fukaxq/kf.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="topBox" ref="topBox">
       
      <div class="sortBox">
        <div class="sortTop sortCenter">
          <div class="sortItem" v-for="(item, index) in sortList" :key="item.title" @click="toSort(index)">
            <div class="iconImg">
              <img class="img" :src="item.img" alt="">
            </div>
            <div class="sortText" v-if="item.classifyName">{{ item.classifyName.split("/")[0] }}</div>
          </div>
        </div>
      </div>
      <div v-if="shopList.length > 0">
        <!--      甄选-->
        <div class="flexBox">
          <div class="toHome">
            <div class="leftBoxHome" style=" position: relative;margin-top: 3px">
              <div class="homeTop">
                <div class="todataBox">
                  <div class="today">
                    <img class="img" src="@/assets/yanchu/jinri.png" alt="">
                  </div>
                  <div class="todayIcon">
                    <img class="img" src="@/assets/yanchu/naoz.png" alt="">
                  </div>
                </div>
                <div class="todataBox moreBox" @click="toOther('/performMustRobToday')">
                  <div>更多</div>
                  <div style="padding-top: 2px">
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
              <div v-if="todayList.length > 0">
                <div class="homeCenter" v-for="item in todayList.slice(0, 1)" @click="toFdetail(item.projectId)">
                  <div class="imgCenter">
                    <div class=" imgCenter imgCenter2">
                      <div class=" imgCenter imgCenter3">
                        <div class=" imgCenter imgCenter4">
                          <img class="img" style="object-fit: cover;border-radius: 50%" :src="item.showPic" alt="">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="manceBox">
                    <div class="manceName">{{ item.projectName }}</div>
                    <div class="mancePrice">
                      ￥<span>{{ item.minPrice }}</span>起
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="leftBoxHome leftBoxHome2" style=" position: relative;margin-top: 3px">
              <div class="homeTop">
                <div class="todataBox">
                  <div class="today" style="width: 80px;">
                    <img class="img" src="@/assets/yanchu/yanchu.png" alt="">
                  </div>
                  <div class="todayIcon" style="width: 17px;">
                    <img class="img" src="@/assets/yanchu/bang.png" alt="">
                  </div>
                </div>
                <div class="todataBox moreBox" style="color: #F8AF55" @click="toOther('/performLeaderboard')">
                  <div>查看</div>
                  <div style="padding-top: 2px">
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
              <div>
                <div class="homeList">
                  <div class="homeItem" v-for="item in shopList.slice(0, 3)" :key="item.id"
                    @click="toFdetail(item.projectId, item.subClassifyName)">
                    <div class="homeimgBox">
                      <img class="img" :src="item.showPic" alt="">
                      <div class="imgText">{{ item.subClassifyName }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--      限时抢购-->
        <div class="sortBox panicBuying panicBuying2" v-if="mustSeeList.length > 1">
          <div class="panicTop">
            <div class="topImg">
              <!--            <img class="img" src="../assets/tushu/top.png" alt="">-->
            </div>
            <div>
              <div class="downtimeBack">
                <div class="text">
                  <img class="img" src="@/assets/yanchu/xicon1.png" alt="">
                </div>
                <div class="panicImg">
                  必看演出
                </div>
                <div class="text">
                  <img class="img" src="@/assets/yanchu/xicon2.png" alt="">
                </div>
              </div>
            </div>
            <div class="more" @click="toOther('/performCalendar')">
              <div>演出日历</div>
              <div style="padding-top: 2px">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
          <div class="birthdayBox">
            <div class="birthday" :style="'width:' + mustSeeList.slice(1, 11).length * 86 + 'px;'">
              <div class="listItem" v-for="item in mustSeeList.slice(1, 11)" :key="item.id">
                <ShopList :listItem="item" :flag="2"></ShopList>
              </div>
            </div>
          </div>
        </div>
        <!--      限时抢购-->
        <div class="sortBox panicBuying" v-if="comingSoonList.length > 0">
          <div class="panicTop">
            <div class="topImg">
              <!--            <img class="img" src="../assets/tushu/top.png" alt="">-->
            </div>
            <div>
              <div class="downtimeBack">
                <div class="text">
                  <img class="img" src="@/assets/yanchu/xicon1.png" alt="">
                </div>
                <div class="panicImg">
                  即将演出
                </div>
                <div class="text">
                  <img class="img" src="@/assets/yanchu/xicon2.png" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="birthdayBox" style="margin-top: 5px">
            <div class="birthday" :style="'width:' + comingSoonList.slice(0, 20).length * 86 + 'px;'">
              <div class="listItem" v-for="item in comingSoonList.slice(0, 20)" :key="item.id">
                <ShopList :listItem="item" :flag="2" :type="1"></ShopList>
              </div>
            </div>
          </div>
        </div>
        <!--    列表-->
        <div class="downtimeBackBox">
          <div class="downtimeBack">
            <div class="text">
              <img class="img" src="@/assets/yanchu/xicon1.png" alt="">
            </div>
            <div class="panicImg">
              为你推荐
            </div>
            <div class="text">
              <img class="img" src="@/assets/yanchu/xicon2.png" alt="">
            </div>
          </div>
        </div>
        <div class="listMax">
          <div class="listBox">
            <div class="listItem" v-for="item in shopList" :key="item.id">
              <ShopList :listItem="item" :flag="1"></ShopList>
            </div>
             
          </div>
        </div>
      </div>
    </div>

    <!--  tabbar-->
    <!-- <NavigationTab :active="0"></NavigationTab> -->
  </div>
</template>
<script>
// import NavigationTab from "@/components/NavigationTab.vue";
import Cityyanchu from "@/components/Cityyanchu.vue";

import ShopList from "@/components/ShopListyanchu.vue";
import {
  dramaApi,
  getDramaProjectList as apiProjectList,
  getCityList
} from "@/api/lehuiperform";


export default {
  name: "IndexView",
  components: {
    ShopList,
    // NewShopList,
    // ShopList,
    Cityyanchu,
    // NavigationTab
  },
  data() {
    return {
      city: "",   // 当前城市名created
      cityChanged: false,   // 标记城市是否变化
      searchValue: "",
      bannerList: [],
      sortList: [],
      classList: [
        {
          id: 1,
          img: require("@/assets/yanchu/1.png"),
        },
        {
          id: 2,
          img: require("@/assets/yanchu/2.png"),
        },
        {
          id: 3,
          img: require("@/assets/yanchu/3.png"),
        },
        {
          id: 4,
          img: require("@/assets/yanchu/4.png"),
        },
        {
          id: 5,
          img: require("@/assets/yanchu/5.png"),
        },
        {
          id: 6,
          img: require("@/assets/yanchu/6.png"),
        },
        {
          id: 7,
          img: require("@/assets/yanchu/7.png"),
        },
        {
          id: 8,
          img: require("@/assets/yanchu/8.png"),
        },
        {
          id: 9,
          img: require("@/assets/yanchu/9.png"),
        },
        {
          id: 10,
          img: require("@/assets/yanchu/10.png"),
        },
      ],
      backColor: "",
      funList: [],
      active: 0,
      tabList: [],
      shopSwiper: [],
      itemHeight: 0,
      swiperHeight: 0,
      flashSale: [],
      shopList: [],
      pageno: 1,
      isScroll: false,
      timer: null,
      isHeight: false,
      isFixed: false,
      kefu: localStorage.getItem("kefu"),
      timeDowm: 1800,
      countdown: "",
      loadingflag: true,
      isLoading: false,
      show: false,
      timer2: null,
      isTab: false,
      isShow: true,
      targetId: "",
      comingSoonList: [],
      mustSeeList: [],
      todayList: []
    }
  },
  methods: {
    toFdetail(id, subClassifyName) {
      this.$router.push({ path: "/performDetail", query: { id, type: subClassifyName } })
    },
    // 获取分类
    getDramaClassify() {
      this.sortList = []
      dramaApi("xuankua.drama.dramaClassifyList", {
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200 && Array.isArray(res.data)) {
          res.data.slice(0, 11)
            .filter(item => item.classifyName != "综合赛事")
            .forEach((item, index) => {
              this.classList.forEach((item2, index2) => {
                if (index == index2) {
                  if (index == 9) {
                    item.classifyName = "全部"
                    item.id = 0
                    item.classifyCode = ""
                  }
                  this.sortList.push({ ...item, img: item2.img })
                }
              })
            })
        }
      })
    },
    // 获取演出列表
    getDramaProjectList() {
  apiProjectList({
    cityCode: this.targetId,
    pageNo: this.pageno,
    pageSize: 10,
    ...this.$store.state.parameter
  }).then(res => {
    if (res.code == 200) {
      const records = (res.data && res.data.records) || []
      if (records.length == 0) {
        this.isScroll = true
        return
      }
      records.forEach(item => this.shopList.push(item))
    }
  }).catch(() => {
    this.loadingflag = false
  })

  apiProjectList({
    cityCode: this.targetId,
    pageNo: this.pageno,
    pageSize: 100,
    ...this.$store.state.parameter
  }).then(res => {
    this.loadingflag = false
    if (res.code == 200 && res.data && res.data.records && res.data.records.length > 0) {
      res.data.records.forEach(item => {
        const diff = this.calculateDaysDiff(item.showStartTime)
        if (diff <= 30 && diff > 1) {
          this.comingSoonList.push({ ...item, daysDiff: diff })
          this.comingSoonList.sort((a, b) =>
            +Number(new Date(a.showStartTime) - +Number(new Date(b.showStartTime))))
        } else if (diff <= 1) {
          this.mustSeeList.push(item)
          this.todayList.push(item)
        }
      })
      if (this.todayList.length == 0) {
        this.todayList.push(
          this.comingSoonList.length > 0 ? this.comingSoonList[0] : res.data.records[0]
        )
      }
    }
  }).catch(() => {
    this.loadingflag = false
  })
},
    // 距离现在有多少天
    calculateDaysDiff(date) {
      const targetDate = new Date(date);
      const currentDate = new Date();
      const timeDiff = targetDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff
    },
    //头部fixed定位
    showSearch() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > (this.$refs.topBox.getBoundingClientRect().height + this.$refs.topBox1.getBoundingClientRect().height)) {   // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.show = true;
      } else {
        this.show = false;
      }
    },
    clear() {
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit("settoken", "")
    },
    toBanner(item) {
      // console.log(item)
      window.location.href = item.url
    },
    toSort(index) {
      if (index == 9) {
        index = -1
      }
      if (index == 7 || index == 8) {
        index++
      }
      this.$router.push({ path: "/performSortPage", query: { id: index + 1 } })
    },
    toClass(item) {
      // "http://yxfmm.bjyxfl.com/cake2/#/orderfood"
      window.location.href = item.url + "?token=" + localStorage.getItem("token") + "&cityName=" + sessionStorage.getItem("cityName") + "&longitude=" + sessionStorage.getItem("longitude") + "&latitude=" + sessionStorage.getItem("latitude")
    },
    getadver() {
      let time = parseInt(new Date().getTime() / 1000) + '';
      // this.timeDowm = Number(this.orderDetail.expiretime) - time
      const countdownInterval = setInterval(() => {
        const minutes = Math.floor(this.timeDowm / 60);
        const seconds = this.timeDowm % 60;
        this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDowm--;
        if (this.timeDowm <= 0) {
          clearInterval(countdownInterval);
          // 倒计时结束后的操作
          this.timeDowm = 1800
          this.getadver()
        }
        localStorage.setItem("timeDowm", this.timeDowm)
      }, 1000);
    },
    toCustomer() {
      window.location.href = this.kefu
    },
     
    input(e) {
     
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    toNext(path) {
      this.$router.push(path)
    },
    ShopList(a) {
      this.itemHeight = a
    },
    // 获取所有城市
     getCity(cityName) {
  this.shopList = []
  this.comingSoonList = []
  this.mustSeeList = []
  this.todayList = []

  getCityList({ keyword: "" }).then(res => {
    const list = res.data || []
    this.cityList = list

    if (Array.isArray(list) && list.length) {
      for (let i = 0; i < list.length; i++) {
        if (cityName && cityName.includes(list[i].name)) {
          this.targetId = list[i].cityid1
          this.$store.commit("changeTargetId", this.targetId)
          sessionStorage.setItem("targetId", this.targetId)
          this.getDramaProjectList()
          return
        }
      }
      // 没匹配上，用第一个城市
      this.targetId = list[0].cityid1
      sessionStorage.setItem("targetId", this.targetId)
      this.getDramaProjectList()
    } else {
      this.loadingflag = false
    }
  }).catch(() => {
    this.loadingflag = false
  })
},
    getCityId(e) {
      this.targetId = e
      this.shopList = []
      this.comingSoonList = []
      this.mustSeeList = []
      this.todayList = []
      
      this.getDramaProjectList()
    },
    toOther(path) {
      this.$router.push(path)
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        if (sessionStorage.getItem("targetId")) {
          this.getDramaProjectList()
        }
      }
    },
  },
 created() {
  this.getDramaClassify()

  const cityName = sessionStorage.getItem("cityName") || "北京"
  const targetId = sessionStorage.getItem("targetId")
this.city = cityName;   //  
  if (targetId) {
    this.targetId = targetId
    this.getDramaProjectList()
  } else {
    // 没 targetId 就用城市名查一遍城市列表
    this.getCity(cityName)
  }
},
activated() {
  const newCity = sessionStorage.getItem("cityName");
  const newTargetId = sessionStorage.getItem("targetId");
  const userPicked = sessionStorage.getItem("userPicked");

  // 用户手动选过城市，且和当前显示的不一样 → 刷新
  if (userPicked === "1" && newCity && newCity !== this.city) {
    console.log('activated: 城市变化', this.city, '→', newCity);

    this.city = newCity;
    this.targetId = newTargetId;

    // 清空旧数据
    this.shopList = [];
    this.comingSoonList = [];
    this.mustSeeList = [];
    this.todayList = [];
    this.pageno = 1;
    this.isScroll = false;

    // 重新拉数据
    this.getDramaProjectList();
  }
},
  mounted() {
    
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('scroll', this.showSearch);
    // setTimeout(() => {
    //   this.swiperHeight = (this.$refs.bannerBox.offsetWidth * 1.64 - this.itemHeight).toFixed(0)
    // }, 300)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('scroll', this.showSearch, false);
  },
}
</script>

<style scoped lang="less">
.location {
  padding-bottom: 50px;
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
}

/deep/ .van-swipe__indicator {
  display: none;
}

.topBox {
  padding: 0px 10px 5px;
  overflow: hidden;

  //头部
  .topPage {
    //padding: 0px 15px;


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
      width: 100%;
      box-sizing: border-box;
      padding: 0px 20px;
      //background-color: white;
    }


    .searchValue {
      width: 80%;
    }

    .van-search {
      padding-bottom: 6px;
      padding-top: 6px;
    }

    .van-search .van-cell {
      background-color: transparent;
    }

    .van-search__content {
      background-color: #FFFFFF;
      border-radius: 30px;
    }

    /deep/ .van-field__control {
      color: #92716D;
    }

    .customer {
      width: 19px;
    }
  }

  .banner {
    width: 100%;
    box-sizing: border-box;
  }

  .sortBox {
    border-radius: 10px;
    background-color: #fff;
    padding: 15px 7px;
    margin-top: 2px;

    .sortTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px 0px;
      //width: 87%;
      //margin: auto;

      .iconBox {
        width: 50px;
        width: 74%;
        margin: auto;
      }

      .sortText {
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        margin-top: 1px;
      }
    }

    .sortCenter {
      flex-wrap: wrap;
      color: #212226;
      width: 100%;

      .sortItem {
        width: 20%;
      }

      .iconImg {
        width: 36px;
        width: 53%;
        margin: auto;
      }

      //.iconImg {
      //  width: 53px;
      //  width:78%;
      //  margin: auto;
      //}
      //.iconImg {
      //  width: 36px;
      //  width:78%;
      //  margin: auto;
      //}
    }
  }

  .panicBuying {
    width: 100%;
    //height: 128px;
    background-size: 100% 100%;
    box-sizing: border-box;
    margin-top: 7px;
    background-color: transparent;
    padding: 10px;
    overflow: hidden;
    background-image: url("@/assets/yanchu/right1.png");
    height: 258px;

    .panicTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      //padding: 10px 23px 0px;
      position: relative;

      .topImg {
        width: 12px;
        position: absolute;
        top: 0px;
        left: 10px;
      }


      .downtime {
        display: flex;
        align-items: center;
        font-size: 12px;
        gap: 3px;
        color: #DE1616;
        margin-top: -5px;
      }

      .time {
        color: white;
        background-color: #DE1616;
        border-radius: 5px;
        padding: 2px;
        width: 15px;
        height: 14px;
        line-height: 14px;
        text-align: center;
      }

      .panicImg {
        //width: 67px;
        font-weight: bold;
        font-size: 15px;
      }


      .more {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 10px;
        background-color: #FFFFFF;
        padding: 2px;
        width: 76px;
        text-align: center;
        border-radius: 30px;
        color: #707070;
        justify-content: center;
      }
    }

    .birthdayBox {
      overflow-x: auto;
      overflow-y: hidden;
      margin-top: 8px;
      //background-color: white;
      border-radius: 10px;

      .birthday {
        display: flex;
        gap: 3px;
        padding: 3px 0px 5px;

        .listItem {
          width: 100%;
          padding-bottom: 5px;
          background-color: #fff;
          padding: 7px 1px 3px;
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
  }

  .panicBuying2 {
    background-image: url("@/assets/yanchu/bk.png");
    height: 227px;
    background-color: #FFF3EB;
  }

  .flexBox {
    width: 100%;
    margin-top: 7px;

    .toHome {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }

  .leftBoxHome {
    background-size: 100% 100%;
    //background-image: url("../assets/yanchu/left1.png");
    background-image: linear-gradient(to right, #FFFFFF, #FFF4F8);
    width: 50%;
    height: 120px;
    //height: 18vh;
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;

    .homeTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;

      .todataBox {
        display: flex;
        align-items: center;
        gap: 3px;

        .today {
          width: 62px;
        }

        .todayIcon {
          width: 14px;
        }
      }

      .moreBox {
        gap: 1px;
        color: #F893B4;
        font-size: 10px;
        background-color: #FFFFFF;
        border-radius: 30px;
        padding: 1px 3px 1px 8px;
        text-align: center;
      }
    }

    .homeCenter {
      display: flex;
      align-items: center;
      margin-left: -15px;
      margin-top: -10px;

      .imgCenter {
        border-radius: 50px;
        width: 85px;
        height: 85px;
        border: 1px solid #fdeff3b8;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .imgCenter2 {
        width: 74px;
        height: 74px;
        border: 1px solid #fdeaf0;
      }

      .imgCenter3 {
        width: 60px;
        height: 60px;
        border: 1px solid #ffdfea;
      }

      .imgCenter4 {
        width: 50px;
        height: 50px;
        border: 2px solid #FBBE56;
        overflow: hidden;
        padding: 1px;
        box-sizing: border-box;
      }

      .manceBox {
        margin-left: -5px;
        margin-top: 18px;
        width: 50%;

        .manceName {
          font-size: 14px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
          /* 显示两行 */
        }

        .mancePrice {
          color: #FFF9F8;
          background-image: url("@/assets/yanchu/qiang.png");
          background-size: 100% 100%;
          font-size: 10px;
          margin-top: 16px;
          width: 94px;
          height: 18px;
          padding-left: 5px;
          box-sizing: border-box;
          line-height: 18px;
        }

        .mancePrice span {
          font-size: 12px;
        }
      }
    }

    .homeList {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .homeItem {
        position: relative;
        width: 31.6%;
      }

      .homeimgBox {
        height: 66px;
        border-radius: 3px;
        overflow: hidden;
        position: relative;
      }

      .imgText {
        position: absolute;
        white-space: nowrap;
        text-overflow: ellipsis;
        top: 1px;
        right: 1px;
        font-size: 5px;
        width: 34px;
        height: 14px;
        overflow: hidden;
        background-color: #191521cc;
        color: white;
        border-radius: 3px;
        text-align: center;
        line-height: 14px;
        padding: 1px;
        box-sizing: border-box;
      }
    }
  }

  .leftBoxHome2 {
    background-image: linear-gradient(to right, #FFFFFF, #FEF9E7);
    border-radius: 10px;
  }
}

.imgTitle {
  border-radius: 10px;
}

.plus {
  color: white;
  background-color: #CA403E;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  font-size: 12px;
  text-align: center;
  line-height: 13px;
  padding: 1px;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.price {
  color: #CA4240;
  font-size: 13px;
  white-space: nowrap;
}

.price span {
  font-size: 15px;
}

.tabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 15px;
  position: relative;
  box-sizing: border-box;

  .tabbarBox {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .tabItem {
    width: 100%;
  }

  .tabTop {
    //font-weight: bold;
    text-align: center;
    font-size: 15px;
  }

  .tabBottom {
    font-size: 12px;
    color: #A8A8A8;
    text-align: center;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .tabTop2 {
    color: #115EA3;
  }

  .tabBottom2 {
    padding: 2px 3px 3px;
    width: 100%;
    margin: auto;
    margin-top: 5px;
    background-color: #3EA5FF;
    color: #F1F8FF;
    border-radius: 30px;
  }
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 100%;
}


.listMax {
  padding: 0px 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bannerBox {
    width: 48%;
    margin-top: 10px;
  }

  .listBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    //gap: 6px;
    width: 100%;
    align-items: flex-start;
    margin-top: -5px;
  }

  .listItem {
    width: 48.9%;
    background-color: white;
    border-radius: 10px;
    margin-top: 10px;
  }
}

.shopImg {
  border-bottom-right-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}

.imgMax {
  width: 85%;
  //height: 103px;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  border-radius: 10px;
  margin: auto;
  //height: 51px;
}

.imgMax2 {
  //height: 164px;
}

//.van-swipe {
//  border-radius: 10px;
//}

.shopList {
  width: 48.9%;
  //width: 100%;
  margin-top: 10px;
}

.listBox2 {
  margin-top: -39px;
}

.imgBox {
  width: 100%;
  margin: auto;
}

.leftBox {
  display: flex;
  justify-content: space-between;
  //gap: 10px;
  margin-top: -10px;
}

.bannerImg {
  width: 100%;
}

.tabbar::-webkit-scrollbar {
  display: none
}

.fixedHeight {
  padding-top: 50px;
}

.isTab {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.model {
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}

.xtitle {
  position: absolute;
  left: 16px;
  top: 11px;

  .hotTitle {
    font-size: 14px;
  }

  .hotXtitle {
    color: #D37D58;
    font-size: 10px;
    padding-top: 3px;
    padding-left: 13px;
  }
}

.text {
  width: 17px;
}

.downtimeBack {
  display: flex;
  align-items: center;
  gap: 8px;
}

.downtimeBackBox {
  padding: 10px;
}
</style>