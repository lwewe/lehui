<template>
  <div>
    <!--    <div class="banner">-->
    <!--      <van-swipe :show-indicators="false" :width="332"  indicator-color="white" @change="changeIndex">-->
    <!--        <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id">-->
    <!--         <div>-->
    <!--           <img class="img" :src=" item.img1" alt="">-->
    <!--         </div>-->
    <!--        </van-swipe-item>-->
    <!--      </van-swipe>-->
    <!--    </div>-->
    <!--    <div class="swiper-container" :style="'background-image: url('+bgBack+')'">-->
    <!--      <div class="swiper-wrapper">-->
    <!--        <div class="swiper-slide"  v-for="item in bannerList" :key="item.id">-->
    <!--         <div>-->
    <!--           <div class="swiperImg">-->
    <!--             <img class="img" :src=" item.img1" alt="">-->
    <!--           </div>-->
    <!--         </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="banner">
      <van-swipe :height="height" :show-indicators="false" ref="goto" indicator-color="white" @change="changeIndex">
        <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id">
          <div style="background-size: 100% 100%;box-sizing: border-box;padding-top: 20px" :style="'background-image: url('+bgBack+')'">
           <div style="width: 332px;margin: auto;">
             <img class="img" :src=" item.img1" alt="">
           </div>
          </div>
          <div style="margin-top: -2px" :style="'background-image: linear-gradient(to bottom,'+item.bgColor+')'">
            <div>
              <img class="img" :src=" item.advantage" alt="">
            </div>
            <div>
              <img class="img" :src=" item.feature" alt="">
            </div>
          </div>

        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import {ImagePreview} from "vant";

export default {
  name: "ProductDescription",
  data() {
    return {
      bannerList: [
        {
          id: 1,
          img: require("../../assets/jieshao/c1.png"),
          img1: require("../../assets/jieshao/21.png"),
          bgBack: require("../../assets/jieshao/2.png"),
          advantage: require("../../assets/jieshao/22.png"),
          feature: require("../../assets/jieshao/23.png"),
          bgColor: "#FFFFFF,#FCC983"
        },
        {
          id: 2,
          img: require("../../assets/jieshao/c2.png"),
          img1: require("../../assets/jieshao/11.png"),
          bgBack: require("../../assets/jieshao/1.png"),
          advantage: require("../../assets/jieshao/12.png"),
          feature: require("../../assets/jieshao/13.png"),
          bgColor: "#FFFFFF,#FBB4BC"
        },
        {
          id: 3,
          img: require("../../assets/jieshao/c3.png"),
          img1: require("../../assets/jieshao/31.png"),
          bgBack: require("../../assets/jieshao/4.png"),
          advantage: require("../../assets/jieshao/32.png"),
          feature: require("../../assets/jieshao/33.png"),
          bgColor: "#FFFFFF,#B4B9ED"
        },
        {
          id: 4,
          img: require("../../assets/jieshao/c4.png"),
          img1: require("../../assets/jieshao/41.png"),
          bgBack: require("../../assets/jieshao/5.png"),
          advantage: require("../../assets/jieshao/42.png"),
          bgColor: "#FFFFFF,#A6E4C9"
        },
      ],
      bgColor: "",
      bgBack: "",
      swiper: null,
      isHave: false,
      height:null
    }
  },
  methods: {
    async changeIndex(index) {
      this.bgColor = this.bannerList[index].bgColor
      this.bgBack = this.bannerList[index].bgBack
      let res1= await this.getImgSize(this.bannerList[index].advantage)
      let res2= await this.getImgSize(this.bannerList[index].img1)
      var res3 = {height:0,width:0}
     if(index!=3){
        res3= await this.getImgSize(this.bannerList[index].feature)
     }
      let resWidth = res1.width + res2.width + res3.width
      let resHeight = res1.height + res2.height + res3.height
      // console.log(resWidth,resHeight)/
     if(index==0){
       this.height=resHeight/2.91
     }else {
       // console.log(index)
       this.height=resHeight/2.83
       // console.log(this.height)
     }
      // console.log(this.height)
    },
    //预览
    showImage(i){
      // 预览关闭轮播图滚动
      this.autoplay=0
      ImagePreview({
        images: this.bannerList,
        //开始的图片位置
        startPosition: i,
        overlayStyle:{
          background: '#000'
        },
        //关闭预览图时-该图为轮播图起始图
        onClose:res=> {
          //轮播图的方法，跳到对应的图片
          this.$refs.vantSwiper.swipeTo(res.index,{
            immediate:true //关闭轮播切换效果
          })
          this.autoplay=2000
        },
      });
    },
    // 获取图片尺寸
    getImgSize (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = url
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          })
        }
      })
    },
    // changeIndex(e) {
    //   this.bgColor = this.bannerList[e].bgColor
    //   this.bgBack = this.bannerList[e].bgBack
    //   if (this.isHave) {
    //     this.isHave = false
    //     return
    //   }
    //   // this.swiper.slideTo(e, 1000, false); // Scroll to specified index with 1 second duration
    // },
    getSwper() {
      this.swiper = new Swiper('.swiper-container', {
        // observer: true,//修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 37,
        loop: true,
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
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    },
    changeBanner(activeIndex) {
      console.log(activeIndex - this.bannerList.length)
      this.isHave = true
      this.bgColor = this.bannerList[activeIndex - this.bannerList.length].bgColor
      this.bgBack = this.bannerList[activeIndex - this.bannerList.length].bgBack
      // console.log(this.$refs.goto.swipeTo)
      this.$refs.goto.swipeTo(activeIndex - this.bannerList.length)
    }
  },
  created() {
    this.bgColor = this.bannerList[0].bgColor
    this.bgBack = this.bannerList[0].bgBack
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.getSwper()
  //   }, 200)
  // },
  async mounted(){
    let res1= await this.getImgSize(this.bannerList[0].advantage)
    let res2= await this.getImgSize(this.bannerList[0].img1)
    let res3= await this.getImgSize(this.bannerList[0].feature)
    let resWidth = res1.width + res2.width + res3.width
    let resHeight = res1.height + res2.height + res3.height
    // console.log(resWidth,resHeight)
    this.height=resHeight/2.91
    // console.log(this.height)
  },
}
</script>

<style scoped lang="less">
/deep/ .van-swipe {
  //margin-left: 10px;
}

.img {
  display: block;
}

//轮播图
.swiper-container {
  height: 100%;
  padding: 10px;
  overflow: hidden;
  background-size: 100% 100%;
  //height: 105px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.9);
  padding: 3px;
  width: 268px !important;
}

.swiper-wrapper {
  width: 100%;
  display: flex;
  margin-left: -8%;
}

.swiper-slide-active, .swiper-slide-duplicate-active {
  transform: scale(1);
}

.swiperImg {
  width: 332px;
}
</style>