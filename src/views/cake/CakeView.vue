<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <div class="modelNo" v-if="isCityId">
      <!--      <div class="bad">定位失败，请选择城市</div>-->
    </div>
    <!--    头部-->
    <div class="topBox" ref="topBox">
      <div class="topPage">
        <!--      <div class="title">悦享聚汇</div>-->
        <div class="searchBox">
          <div>
            <!--      地址-->
            <City :type="1" @getCityId="getCityId"></City>
          </div>
          <div class="searchValue" @click="toOtherNext('/birthdayCake?search=1')" v-if="!isCityId">
            <van-search background="#fff0" placeholder="搜索你想要的商品" v-model="searchValue" />
          </div>
          <div class="customer" @click="tokf">
            <img class="img" src="../assets/kf1.png" alt="">
          </div>
        </div>
      </div>

    </div>

    <div>

      <span @click="addgo(1)">生日蛋糕</span><span @click="addgo(2)">电子券</span>
    </div>

    <!--分类-->
    <div class="tabbar" :class="{ tabbar2: show }" ref="topScroll" v-if="tabList.length > 0">
      <div v-if="isLoading" class="isTab" :style="'width:' + tabList.length * 90 + 'px;'"></div>
      <div class="tabbarBox" :style="'width:' + tabList.length * 90 + 'px;'">
        <div class="tabItem" v-for="(item, index) in tabList" :key="item.id" @click="changeTab(item.id, index)">
          <div class="tabTop " :class="{ tabTop2: active == item.id }">{{ item.title }}</div>
          <div class="tabBottom" :class="{ tabBottom2: active == item.id }">{{ item.xtitle }}</div>
        </div>
      </div>
    </div>

    <div class="listBox" :style="{ minHeight: isHeight ? 'calc(100vh - 110px)' : '' }" :class="{ fixedHeight: show }">

      <ShopList :productList="productList" :indexs="1"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>

  </div>
</template>
<script>
import { getCakeIndex, getCakeProductList } from "@/api";
import City from "@/components/Citycake.vue";
import ShopList from "@/components/ShopListcake.vue";
import { getIsShowOders } from '@/api/service'

export default {
  name: "IndexView",
  components: {
    ShopList,
    City
  },
  data() {
    return {
      searchValue: "",
      show: false,
      isLoading: false,
      active: 0,
      tabList: [],
      isHeight: false,
      loadingflag: true,
      pageno: 1,
      isScroll: false,
      productList: [],
      isCityId: true,
      kefu: ""
    }
  },
  methods: {
    tokf() {
      window.location.href = this.kefu
    },
    addgo(n) {
      var path = ""
      if (n == 1) {
        path = "/birthdayCake"
      }
      else {

        path = "/orderfood"
      }
      this.$router.push(path)

    },
    // 首页分类 + tab
    getCakeIndexList() {
      getCakeIndex().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.tabList = res.data.classify
          this.active = this.tabList[0].id
          this.isCityId = false
          this.getCakeProduct(this.active)
        }
      })
    },

    // 头部 fixed 定位
    showSearch() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > this.$refs.topBox.getBoundingClientRect().height) {
        this.show = true;
      } else {
        this.show = false;
      }
    },

    // 切换 tab
    changeTab(id, index) {
      this.isHeight = true
      this.isScroll = false
      this.productList = []
      this.pageno = 1
      this.active = id
      document.documentElement.scrollTop += this.$refs.topScroll.getBoundingClientRect().top
      this.getCakeProduct(this.active)
      if ((index + 1) >= 3) {
        this.$refs.topScroll.scrollLeft = 60 * (index + 1)
      } else {
        this.$refs.topScroll.scrollLeft = 0
      }
    },

    toOtherNext(path) {
      this.$router.push(path)
    },

    // 商品列表
    getCakeProduct(fid, pageno = this.pageno) {
      this.isLoading = true
      getCakeProductList({
        fid,
        pageno,
        pagesize: 10
      }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.product_list.forEach(item => {
            this.productList.push(item)
          })
        }
      })
    },

    // 滚动加载
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },

    onMost() {
      if (!this.isScroll) {
        this.pageno++
        this.getCakeProduct(this.active, this.pageno)
      }
    },

    // 城市选择回调
    getCityId(e) {
      if (e == "") {
        this.loadingflag = false
        this.isCityId = true
        this.$toast("定位失败，请选择城市")
        return
      }
      this.getCakeIndexList()
    }
  },
  created() {
    setTimeout(() => {
      this.getCakeIndexList()
    }, 1000)
    this.kefu = localStorage.getItem("kefu")
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('scroll', this.showSearch);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('scroll', this.showSearch, false);
  },
}
</script>

<style scoped lang="less">
.van-notice-bar {
  margin-top: 8px;
  border-radius: 6px;
}

.location {
  min-height: 100vh;
  background-color: #F0F0F0;
  padding-bottom: 60px;
  box-sizing: border-box;
}

.topBox {
  background-image: linear-gradient(to bottom, #F0BFC2, #F0F0F0);

  //头部
  .topPage {
    padding: 0px 15px;

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
      padding-bottom: 6px;
      padding-top: 6px;
      padding-right: 8px;
    }

    .van-search .van-cell {
      background-color: transparent;
    }

    .van-search__content {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 30px;
    }

    /deep/ .van-field__control {
      color: #92716D;
    }

    .customer {
      width: 26px;
    }
  }

  .banner {
    width: 100%;
    padding: 0px 10px;
    box-sizing: border-box;
  }
}

.centerBox {
  padding: 8px 10px;

  .toHome {
    width: 50%;
    position: relative;
  }

  .imgTitle {
    border-radius: 10px;
  }

  .titleBox {
    position: absolute;
    top: 11px;
    left: 10px;

    .title {
      font-weight: bold;
      font-size: 15px;
    }

    .text {
      font-size: 12px;
      color: #675f61;
      padding-top: 2px;
    }
  }

  .flexBox {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .birthdayBox {
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 8px;
  }

  .birthday {
    display: flex;
    gap: 5px;

    .listItem {
      width: 100%;
    }
  }

  .birthdayBox::-webkit-scrollbar {
    display: none
  }
}

.listBox {
  //padding: 0px 10px;
  //display: flex;
  //justify-content: space-between;
  //flex-wrap: wrap;
  //gap: 5px;
  //margin-top: 12px;
  //align-items: flex-start;

  .listItem {
    width: 49%;
    background-color: #FDD7D6;
    border-radius: 5px;
    padding-bottom: 6px;
    position: relative;

    .topItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px 3px 0px;

      .titleBack {
        background-image: url("../assets/dangao/x.png");
        width: 108px;
        height: 27px;
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 0px 15px 1px;
        display: flex;
        color: white;
        align-items: center;
        gap: 6px;
        padding-bottom: 5px;

        .start {
          width: 10px;
        }

        .startTitle {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 80%;
        }
      }

      .burst {
        width: 21px;
        height: 23px;
        background-image: url("../assets/dangao/b.png");
        background-size: 100% 100%;
      }
    }

    .cakeMax {
      padding: 0px 5px;
    }

    .cakeImg {
      width: 100%;
      height: 130px;
      border-top: 1px dashed #DEA1A1;
      padding-top: 4px;
    }

    .cardBack {
      padding: 0px 5px;
      margin-top: 4px;
    }

    .cakeInfo {
      background-color: #ffffff96;
      border-radius: 3px;
      position: relative;
      box-sizing: border-box;
      padding: 5px;

      .cakeNmae {
        font-size: 13px;
        font-weight: bold;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
        /* 显示两行 */
      }

      .cakeText {
        font-size: 10px;
        color: #646060;
        padding-left: 6px;
        padding-top: 2px;
      }

      .cakeBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;

        .cakePrice {
          color: #BB3F42;
          font-size: 12px;
          font-weight: bold;
        }

        .cakePrice span {
          font-size: 17px;
        }

        .delivery {
          background-color: #B5595B;
          color: #EAD1D2;
          font-size: 10px;
          padding: 1px 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50px;
          text-align: center;
        }
      }
    }
  }
}

.goAtOnce {
  display: flex;
  align-items: center;
  border-radius: 30px;
  font-size: 10px;
}

.cakeBrand {
  background-color: #FEF4F3;
  margin-top: 9px;
  border-radius: 10px;
  padding: 10px 10px 15px 13px;

  .brandtitleBox {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 15px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }

    .seeAll {
      font-size: 12px;
      color: #8f8a8a;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .cakeBoxImg {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 10px 0px;
    margin-top: 10px;

    .imgMax2 {
      width: 20%;
    }

    .imgMax {
      // width: 60px;
      height: 60px;
      margin: auto;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 5px;
    }
  }

  /deep/ .van-swipe__indicator {
    display: initial;
    border-radius: 0px;
    width: 15px;
    height: 2px;
    background-color: #b7b7b7;
    margin: 0;
  }

  /deep/ .van-swipe__indicators {
    bottom: 0px;
    border-radius: 30px;
    overflow: hidden;
  }


}

.tabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 7px 15px;
  margin-top: 5px;
  position: relative;

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
    padding-top: 2px;
    margin-top: 3px;
  }

  .tabTop2 {
    color: #240003;
    font-weight: 600;
  }

  .tabBottom2 {
    padding: 2px 4px 3px;
    width: 85%;
    margin: auto;
    margin-top: 3px;
    background-color: #F99E9B;
    color: #ffffff;
    border-radius: 30px;
    font-size: 13px;
  }
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 93%;
}

.tabbar::-webkit-scrollbar {
  display: none
}

.isTab {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.fixedHeight {
  padding-top: 65px;
}

/deep/ .van-swipe {
  border-radius: 8px;
}

.modelNo {
  background-color: #F0F0F0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2000;
  margin-top: 6vh;
}

.bad {
  font-size: 13px;
  padding: 10px;
}

.bgadd {
  background-color: #F99E9B;
  color: #ffffff;
  font-size: 12px;
  font-weight: normal;
  padding: 2px 8px 2px;
  border-radius: 30px;
  margin: 0 10px;
}

.bgadds {
  border: 1px solid #F99E9B;
  color: #F99E9B;
  font-size: 12px;
  font-weight: normal;
  padding: 1px 16px 2px;
  border-radius: 30px;
}
</style>
