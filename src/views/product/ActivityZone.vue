<template>
  <div class="conPage">
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>-->
    <NProgress v-if="loadingflag"/>
    <div class="banner" ref="banner">
      <img class="img" :src="detail.banner" alt="">
    </div>
    <!--    tab切换-->
    <div class="tabbar" :class="{tabbar2:show}" ref="topScroll" v-if="tabList.length>1">
      <div class="tabbarBox" :style="'width:'+ tabList.length*90+'px;'">
        <div class="tabItem" v-for="(item,index) in tabList" :key="item.id" @click="changeTab(item,index)">
          <div class="tabTop " :class="{tabTop2:active==item.id}" :style="{color:item.id==active?detail.yanse1:''}">{{ item.title }}</div>
          <div class="tabBottom" :class="{tabBottom2:active==item.id}"  :style="{backgroundColor:item.id==active?detail.yanse2:''}">{{ item.xtitle }}</div>
        </div>
      </div>
    </div>
    <!--            列表-->
    <div class="listBox" :style="{minHeight:isHeight?'calc(100vh - 60px)':''}" :class="{fixedHeight:show}">
      <!--        <div v-for="(item,index) in shopList" :key="item.id" class="shopList">-->
      <!--          <ShopList :pinpai="item.pinpai" :listItem="item" :flag="flag"></ShopList>-->
      <NewShopList :flag="1" :shopList="shopList" v-if="shopList.length>0" @input="input"></NewShopList>
      <!--        </div>-->
      <!--        加载-->
      <loading style="margin-top: 10px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import NewShopList from "@/components/NewShopList.vue";
import {getDetailBannerList, getTpProductList} from "@/api";
import {getBrandShopList} from "@/api/classify";

export default {
  name: "ActivityZone",
  components: {NewShopList},
  data() {
    return {
      active: "",
      tabList: [
        {
          id: "",
          syname: "热门推荐",
          tag: "春游好物"
        },
        {
          id: 2,
          syname: "热门推荐2",
          tag: "春游好物2"
        },
      ],
      pageno: 1,
      shopList: [],
      isScroll: true,
      isLoading: false,
      isHeight: false,
      loadingflag: true,
      show: false,
      detail: {},
      ClassSelect:""
    }
  },
  methods: {
    //头部fixed定位
    showSearch() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > this.$refs.banner.getBoundingClientRect().height) {   // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.show = true;
      } else {
        this.show = false;
      }
    },
    input() {

    },
    changeTab(item,index) {
      this.isHeight = true
      this.isScroll = false
      this.shopList = []
      this.pageno = 1
      this.active = item.id
      // let num = 0
      // if(Math.floor(this.$refs.topScroll.getBoundingClientRect().top)>=1){
      //   console.log(Math.floor(this.$refs.topScroll.getBoundingClientRect().top))
      // this.timer = setInterval(()=>{
      //   num++
      // document.documentElement.scrollTop += num
      document.documentElement.scrollTop += this.$refs.topScroll.getBoundingClientRect().top
      //   if(this.$refs.topScroll.getBoundingClientRect().top<=num-13){
      //     clearInterval(this.timer)
      //   }
      // },30)
      // }
      this.getBrandShop(this.active)
      if ((index+1) >= 3) {
        this.$refs.topScroll.scrollLeft = 60 * (index+1)
      } else {
        this.$refs.topScroll.scrollLeft = 0
      }
    },
//   商品列表
    getBrandShop(id) {
      this.isLoading = true
      getTpProductList({
        id
      }).then(res => {
        this.isLoading = false
        this.loadingflag = false
        if (res.code == 200) {
          res.data.product_list.forEach(item => {
            this.shopList.push(item)
          })
        }
      })
    },
    // //滚动条事件
    // handleScroll(e) {
    //   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //   let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    //   let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //   if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
    //     this.onMost()
    //   }
    // },
    // onMost() {
    //   if (!this.isScroll) {
    //     this.pageno++
    //     this.getBrandShop(this.pageno)
    //   }
    // },
    getDetailBanner(id) {
      getDetailBannerList({
        id
      }).then(res => {
        // console.log(res)
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data.show
          this.tabList = res.data.fenlei_list
          this.active = this.tabList[0].id
           this.getBrandShop(this.active)
        }
      })
    }
  },
  created() {
    this.getDetailBanner(this.$route.query.id)
  },
  mounted() {
    // window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('scroll', this.showSearch);
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('scroll', this.showSearch, false);
  },
}
</script>
<style scoped lang="less">
.conPage {
  background-color: #F0F0F0;
  min-height: 100vh;
}

.banner {
  width: 100%;
}

.tabbar::-webkit-scrollbar {
  display: none
}

.tabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 3px 15px;
  margin-top: 5px;

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
  }

  .tabTop2 {
    color: #115EA3;
  }

  .tabBottom2 {
    padding: 2px 0px;
    width: 85%;
    margin: auto;
    margin-top: 2px;
    background-color: #3EA5FF;
    color: #F1F8FF;
    border-radius: 30px;
    font-size: 13px;
  }
}

.listBox {
  padding: 0px 10px 10px;
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 100%;
}

.fixedHeight {
  padding-top: 67px;
}
</style>