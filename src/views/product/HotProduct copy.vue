<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <div class="topBack">
      <div class="topName">
        <div class="leftImg">
          <img class="img" src="../../assets/hotshop/zuo.png" alt="">
        </div>
        <div>
          <div class="lTitle">悦享宝藏热卖商品榜</div>
          <div class="easy">让选择更简单</div>
        </div>
        <div class="leftImg">
          <img class="img" src="../../assets/hotshop/you.png" alt="">
        </div>
      </div>
      <!--    轮播图分类 -->
      <div class="filmBox">
        <!--      分类-->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" @click="amplify(item.id)" v-for="(item,index) in sortList" :key="item.id">
              <div class="bannerImg">
                <img class="img" :src="item.rxtbimg" alt="">
                <div class="sortText">{{ item.rxname }}</div>
              </div>
              <!--            详情-->
              <div class="detail" v-if="selectId==item.id"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!--    二级分类商品-->
    <div class="shopBox" >
      <loading v-if="isLoading"></loading>
      <div class="shopItem" v-for="item in productList" :key="item.id"  v-if="item.product_list.length>0">
        <div class="more">
          <div class="moreImg">
            <img class="img" src="../../assets/hotshop/gengduo.png" alt="">
          </div>
        </div>
        <div class="topName">
          <div class="leftImg">
            <img class="img" src="../../assets/hotshop/zuo.png" alt="">
          </div>
          <div class="lTitle">{{item.name}}必逛商品榜</div>
          <div class="leftImg">
            <img class="img" src="../../assets/hotshop/you.png" alt="">
          </div>
        </div>
        <!--        商品-->
        <div class="birthdayBox">
          <!--          :style="'width:'+ flashSale.length*108+'px;'"-->
          <div class="birthday" :style="'width:'+ item.product_list.length*108+'px;'">
            <div class="listItem" style="position: relative" @click="toDetail(item2.id)" v-for="(item2,index) in item.product_list" :key="item2.id">
              <div class="imgMax shopImg">
                <div class="ranking">{{ index + 1 }}</div>
                <div class="imgBox">
                  <img style="object-fit: cover" class="img" :src="item2.thumbnailimage" alt="">
                </div>
              </div>
              <div class="shopInfo">
                <div class="title">{{item2.name}}</div>
                <div class="priceBox">立即查看</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import {getHotProductClass, getHotProductList} from "@/api";

export default {
  name: "HotProduct",
  data() {
    return {
      sortList: [],
      selectId: 2,
      swiper: null,
      boxWidth: 0,
      productList:[],
      loadingflag:true,
      isLoading:false,
      timer:null
    }
  },
  methods: {
    toDetail(id) {
       
      this.$router.push({path:"/productDetail",query:{id}})
     
    },
    // 轮播
    getSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        clickable: true, // 轮播按钮支持点击
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //点击事件
        on: {
          click: () => {

          },
          slideChange: () => {
            // console.log('Current slide index:', this.swiper.activeIndex);
            if (this.swiper) {
              this.changeBanner(this.swiper.activeIndex)
            }
            // 在这里可以获取当前位于中间的图片索引
          }
        },
        // slidesPerView: 4,
        paginationClickable: true,
        // spaceBetween: 10,
        slideToClickedSlide: true, // 点击的slide会居中
        slidesPerView: 4,
        sapceBetween: 30,
        centeredSlides: true,
        initialSlide: 1,//默认第二个
        // loop:true,
        // speed : 100, //速度
        // autoplay : {
        //   delay : 5000, //自动切换的时间间隔，单位ms
        //   disableOnInteraction : true //用户操作swiper之后，是否禁止autoplay
        // },
      });
    },
    changeBanner(activeIndex) {
      this.selectId = this.sortList[activeIndex].id
      this.productList = []
      // 清除之前的定时器
      clearTimeout(this.timer);

      // 设置新的定时器，延迟执行搜索逻辑
      this.timer = setTimeout(() => {
        // 实际的搜索逻辑，这里可以调用搜索接口等
        this.getHotList()
      }, 500);

    },
    amplify(id) {
    //   this.selectId = id
    //   this.productList = []
    //   this.getHotList()
    },
    getHotClass() {
      getHotProductClass().then(res => {
        if (res.code == 200) {
          this.sortList = res.data.product_class
        }
      })
    },
    getHotList() {
      this.isLoading = true
      getHotProductList({
        fid:this.selectId
      }).then(res => {
        this.loadingflag = false
        this.isLoading = false
        if (res.code == 200) {
          this.productList = res.data
        }
      })
    }
  },
  created() {
    this.getHotClass()
    this.getHotList()
  },
  mounted() {
    this.getSwiper()
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-image: linear-gradient(to right, #D1E1F5, #DDE0F6);
}

.topBack {
  background-image: url("../../assets/hotshop/back.png");
  background-size: 100% auto;
  width: 100%;
  height: 202px;
  padding-top: 15px;
  box-sizing: border-box;
  background-position-y: -80px;

  .topName {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    .lTitle {
      color: #FFFFFF;
      font-size: 19px;
      text-align: center;
      letter-spacing: 1px;
    }

    .leftImg {
      width: 30px;
    }

    .easy {
      background-image: url("../../assets/hotshop/ts.png");
      background-size: 100% 100%;
      width: 142px;
      height: 22px;
      text-align: center;
      font-size: 12px;
      line-height: 22px;
      color: #F5F6FE;
      margin: auto;
      margin-top: 8px;
    }
  }

  //轮播图
  .swiper-container {
    width: 100%;
    height: 100%;
    padding: 18px 0px 0px;
    overflow: hidden;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    transition: 200ms;
    transform: scale(0.8);
  }

  .swiper-wrapper {
    display: flex;
    margin-left: -10%;
  }

  .swiper-slide-active, .swiper-slide-duplicate-active {
    transform: scale(1);
  }

  .bannerImg {
    width: 88px;
    height: 88px;
    border: 2px solid #C8EBFF;
    border-radius: 15px;
    overflow: hidden;
    position: relative;

    .sortText {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.22);
      color: white;
      width: 100%;
      border-radius: 8px;
      bottom: 0px;
      left: 0px;
      font-size: 15px;
      height: 20px;
      line-height: 20px;
      padding: 3px 0px;
    }
  }

  .detail {
    background-image: linear-gradient(to right, #9AA0F5, #D1A8F8);
    width: 25px;
    height: 6px;
    margin: 5px auto 0px;
    border-radius: 30px;
  }
}

.shopBox {
  padding: 0px 10px 10px;

  .shopItem {
    background-image: linear-gradient(to bottom, #E2ECF7, #E0E6F9);
    border-radius: 10px;
    padding: 10px;
    border: 2px solid #EBF4FD;
    position: relative;
    overflow: hidden;
    margin-top: 8px;

    .more {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      padding: 12px 4px 8px;
      box-sizing: border-box;
      background-color: #E6EFF8;
      box-shadow: -4px 1px 10px 1px #e6eff8d6;
      color: #8E8E8E;
      z-index: 10;
      display: flex;
      align-items: center;
    }

    .moreImg {
      width: 14px;
      margin: auto;
    }

    .topName {
      display: flex;
      align-items: center;
      gap: 5px;

      .lTitle {
        text-align: center;
        letter-spacing: 1px;
        font-weight: bold;
      }

      .leftImg {
        width: 11px;
      }
    }

    .birthdayBox {
      overflow-x: auto;
      overflow-y: hidden;
      margin-top: 12px;
      padding-right: 15px;

      .birthday {
        display: flex;
        gap: 5px;

        .listItem {
          width: 100%;
          background-image: url("../../assets/hotshop/sback.png");
          background-size: 100% 100%;
          border-radius: 10px;
          padding-bottom: 5px;
          overflow: hidden;

          .imgMax {
            width: 100%;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            //padding-top: 10px;
            position: relative;
            height: 101px;
            background-color: white;
            overflow: hidden;
            //display: flex;
            //justify-content: center;
            //align-items: center;
          }

          .ranking {
            background-image: url("../../assets/hotshop/biao.png");
            background-size: 100% 100%;
            min-width: 18px;
            height: 21px;
            text-align: center;
            font-size: 13px;
            line-height: 21px;
            position: absolute;
            top: 0;
            left: 10px;
            color: #4163AF;
          }

          .imgBox {
            width: 100%;
            margin: auto;
            display: flex;
            height: 100%;
            justify-content: center;
          }

          .title {
            font-size: 12px;
            font-weight: bold;
            color: #313131;
            padding-top: 3px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 1; /* 显示两行 */
          }

          .shopInfo {
            padding: 3px 6px 6px;
          }

          .priceBox {
            width: 85%;
            margin: auto;
            font-size: 12px;
            background-color: #E5F0FE;
            text-align: center;
            border-radius: 30px;
            margin-top: 6px;
            padding: 1px 0px;
          }
        }
      }
    }


    .birthdayBox::-webkit-scrollbar {
      display: none
    }
  }
}

</style>