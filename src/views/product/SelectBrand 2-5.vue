<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <div class="backImg">
      <img class="img" src="../../assets/hotshop/ppback.png" alt="">
    </div>
    <div class="lineBox" v-if="sortList.length>0">
      <div class="line"></div>
      <div class="lineTitle">优质品牌</div>
      <div class="line"></div>
    </div>
    <!--    轮播图分类 -->
    <div class="filmBox" v-if="sortList.length>0">
      <!--      分类-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
<!--          :class="{amplify:item.id==selectId||index==indexText+2}" -->
          <div class="swiper-slide" @click="amplify(item.id,index)" v-for="(item,index) in sortList" :key="item.id"
               :style="{backgroundImage:(index+1)%4==1.25?'linear-gradient(to bottom, #EEDC8C, #E6B76E,#FE9050)':(index+1)%4==2?'linear-gradient(to bottom, #EA7A6D, #D16894,#B654F2)':(index+1)%4==3?'linear-gradient(to bottom, #D75EB1, #E5638A,#FC6662)':(index+1)%4==0?'linear-gradient(to bottom, #78DEF3, #64AEF0,#426CF5)':''}">
           <div class="bannerBox">
             <div class="bannerImg">
               <img class="img" :src="item.img" alt="">
             </div>
           </div>
            <!--            详情-->
            <div class="sortText">{{ item.name }}</div>
          </div>
        </div>

      </div>
    </div>
    <loading v-if="isLoading"></loading>
    <div class="lineBox" style="margin-top: 12px" v-if="productList.length>0">
      <div class="line"></div>
      <div class="lineTitle">推荐好物</div>
      <div class="line"></div>
    </div>
    <!--    列表-->
    <div class="listBox" v-if="productList.length>0">
      <div v-for="item in productList" :key="item.id">
        <NewProductList :change="0" :listItem="item" ></NewProductList>
      </div>
    </div>
  </div>
</template>
<script>
import NewProductList from "@/components/NewProductList.vue";
import Swiper from "swiper";
import {getNewBrindList, getNewBrindProductList} from "@/api";

export default {
  name: "SelectBrand",
  components: {NewProductList},
  data() {
    return {
      sortList: [],
      selectId: 1,
      swiper: null,
      pageno:1,
      isScroll:true,
      productList:[],
      indexText:1,
      loadingflag:true,
      isLoading:false,
      timer:null
    }
  },
  methods: {
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
        initialSlide: 2,//默认第二个
        // loop:true,
        // speed : 100, //速度
        // autoplay : {
        //   delay : 5000, //自动切换的时间间隔，单位ms
        //   disableOnInteraction : true //用户操作swiper之后，是否禁止autoplay
        // },
      });
    },
    changeBanner(activeIndex) {
      // if (activeIndex > this.sortList.length) {
      //   activeIndex = activeIndex - this.sortList.length
      // }
      // console.log(activeIndex)
      this.pageno = 1
      this.selectId = this.sortList[activeIndex].id
      this.indexText = activeIndex
      this.productList = []
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.getNewBrindProduct()
        this.timer = undefined;
      }, 1000);
    },
    amplify(id,index) {
      // this.selectId = id
      // this.indexText = index
      this.productList = []
      // this.getNewBrindProduct()
      // console.log("22222")
    },
    getNewBrind(){
      getNewBrindList().then(res=>{
        this.isScroll = false
        // this.loadingflag = false
        if(res.code == 200){
          setTimeout(()=>{
            this.getSwiper()
          },1000)
          this.sortList = res.data.pinpai
          if(this.sortList.length==1){
            this.selectId=this.sortList[0].id
          }else{
            this.selectId=this.sortList[2].id
          }
         setTimeout(()=>{
           this.getNewBrindProduct()
         },1000)
        }
      })
    },
    getNewBrindProduct(){
      this.isLoading = true
      getNewBrindProductList({
        pid:this.selectId,
        pageno:this.pageno,
        pagesize:10
      }).then(res=>{
        // console.log(res)
        this.loadingflag = false
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
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        this.pageno++
        if(this.sortList.length==1){
          this.selectId=this.sortList[0].id
        }else{
          this.selectId=this.sortList[2].id
        }
        this.getNewBrindProduct()
      }
    }
  },
  created() {

  },
  mounted() {
    this.getNewBrind()
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>


<style scoped lang="less">
.conPage {
  min-height: 100vh;
  //background-image: linear-gradient(to right,#D5F0FA,#D4F0F9,#CFECF5);
  background-image: linear-gradient(to bottom, #EBF4EE, #EBF4EE);
}

.backImg {

}

.listBox {
  padding: 15px;
  margin-top: -13px;
  position: relative;
}

.lineBox {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  color: #89AB94;
  font-size: 14px;
  margin-top: 2px;

  .line {
    width: 60px;
    border-top: 1px solid #DEE9E2;
    margin-top: 1px;
  }
}

//轮播图
.swiper-container {
  height: 100%;
  padding: 10px;
  overflow: hidden;
  background-color: #CCE3D4;
  border-radius: 10px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.7);
  background-image: linear-gradient(to bottom, #EED586, #FD9453);
  border-radius: 10px;
  padding: 3px;
  width: 72px !important;
}

.swiper-wrapper {
  width: 100%;
  display: flex;
  //margin-left: -10%;
}

.swiper-slide-active, .swiper-slide-duplicate-active {
  transform: scale(1);
}

//.amplify {
//  transform: scale(1);
//}

.filmBox {
  padding: 8px 15px;
  box-sizing: border-box;
}
.bannerBox{
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  width: 60px;
  height: 60px;
  padding: 5px;
  //box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: auto;
}
.bannerImg {
  width: 100%;
  border-radius: 10px;
  position: relative;
  display: flex;

}

.sortText {
  color: white;
  width: 100%;
  border-radius: 8px;
  font-size: 10px;
  height: 20px;
  line-height: 20px;
  padding: 2px 0px 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.bannerBox{

}
</style>