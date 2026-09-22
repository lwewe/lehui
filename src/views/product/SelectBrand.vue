<template>
  <div class="conPage">
    <img src="../../assets/hotshop/bg.png" style="width: 100%;height: 500px;" alt="">
    <div v-if="showNav" class="simple-nav">
      <div :class="['nav-item', { active: activeTab === 'brand' }]" @click="scrollTo('brand')">{{categoryList[0].title}}</div>
      <div :class="['nav-item', { active: activeTab === 'select' }]" @click="scrollTo('select')">{{categoryList[1].title}}</div>
      <div :class="['nav-item', { active: activeTab === 'food' }]" @click="scrollTo('food')">{{categoryList[2].title}}</div>
    </div>

    <!-- 品牌数据区域 -->
    <div id="brandData" class="section">
      <div class="section-title">{{categoryList[0].title}}</div>
      <!-- <div class="swiper-container">
        
      </div> -->
      <div v-for="item in brandProductList" :key="item.id">
        <NewProductList1 :change="1" :listItem="item"></NewProductList1>
      </div>
    </div>

    <!-- 甄选数据区域 -->
    <div id="selectData" class="section">
      <div class="section-title">{{categoryList[1].title}}</div>
      <div v-for="item in selectProductList" :key="item.id">
        <NewProductList1 :change="1" :listItem="item"></NewProductList1>
      </div>
      <!-- 甄选内容 -->
    </div>

    <!-- 美食数据区域 -->
    <div id="foodData" class="section">
      <div class="section-title">{{categoryList[2].title}}</div>
      <div v-for="item in foodProductList" :key="item.id">
        <NewProductList1 :change="1" :listItem="item"></NewProductList1>
      </div>
      <!-- 美食内容 -->
    </div>

  </div>
</template>
<script>
import NewProductList1 from '@/components/NewProductList1.vue';
// import NewProductList from "@/components/NewProductList.vue";
// import Swiper from "swiper";
import { getNewBrindProductList, getBrandPickt } from "@/api";



export default {
  name: "SelectBrand",
  components: {
    NewProductList1
  },
  data() {
    return {  // 新增的简单控制变量
      showNav: false,
      activeTab: 'brand',
      sortList: [],
categoryList:'',
          // 分开存储三个分类的产品列表
      brandProductList: [],    // 三餐四季
      selectProductList: [],   // 金选粮油
      foodProductList: [],     // 家常臻选
      ids: "",
      swiper: null,
      pageno: 1,
      isScroll: true,
      productList: [],
      indexText: 1,
      loadingflag: true,
      isLoading: false,
      timer: null
    }
  },
  methods: {

    // 点击导航滚动到对应区域
    scrollTo(section) {
      this.activeTab = section;
      const element = document.getElementById(section + 'Data');
      if (element) {
        // 使用平滑滚动
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    },

    // 简化滚动监听
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const brandSection = document.getElementById('brandData');

      // 当滚动到品牌数据区域时显示导航
      if (brandSection) {
        const brandOffsetTop = brandSection.offsetTop;
        if (scrollTop >= brandOffsetTop - 250) {
          this.showNav = true;
        } else {
          this.showNav = false;
        }
      }

      // 根据滚动位置高亮对应导航
      this.highlightNavOnScroll();

      // 原有的底部加载逻辑
      this.checkScrollBottom();
    },

    // 根据滚动位置高亮导航
    highlightNavOnScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // 获取各区域位置
      const brandSection = document.getElementById('brandData');
      const selectSection = document.getElementById('selectData');
      const foodSection = document.getElementById('foodData');

      if (!brandSection || !selectSection || !foodSection) return;

      const brandTop = brandSection.offsetTop;
      const selectTop = selectSection.offsetTop;
      const foodTop = foodSection.offsetTop;

      // 简单判断当前在哪个区域
      if (scrollTop >= foodTop - windowHeight / 3) {
        this.activeTab = 'food';
      } else if (scrollTop >= selectTop - windowHeight / 3) {
        this.activeTab = 'select';
      } else if (scrollTop >= brandTop - windowHeight / 3) {
        this.activeTab = 'brand';
      }
    },

    // 检查是否滚动到底部
    checkScrollBottom() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        // this.onMost();
      }
    },
    
    getNewBrindProduct() {
      this.isLoading = true
      getBrandPickt({
        id: this.ids,
        pageno: this.pageno,
        pagesize: 10
      }).then(res => {
        // console.log(res)
        // this.loadingflag = false
        // this.isLoading = false
        if (res.code == 200) {
          if (res.data.fenlei_list.length == 0) {
            // this.isScroll = true
            return
          }
           this.categoryList = res.data.fenlei_list || [];
          
          // 根据分类ID分配产品到不同的列表
          this.categoryList.forEach(category => {
            const productList = category.product_list || [];
            
            // 根据分类ID或标题判断属于哪个区块
            if (category.id === "6" || category.title.includes("三餐四季")) {
              this.brandProductList = productList;
            } else if (category.id === "7" || category.title.includes("金选粮油")) {
              this.selectProductList = productList;
            } else if (category.id === "8" || category.title.includes("家常臻选")) {
              this.foodProductList = productList;
            }
          });

          console.log(this.productList)
        }
      })
    },
   
  },
  created() {
    this.ids = this.$route.query.id;
  },
  mounted() {
    // this.getNewBrind()
    this.getNewBrindProduct()
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
  background-image: linear-gradient(to bottom, #9ED07F, #9ED07F);
}

.backImg {}

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

.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}

//.amplify {
//  transform: scale(1);
//}

.filmBox {
  padding: 8px 15px;
  box-sizing: border-box;
}

.bannerBox {
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

.bannerBox {}

//add

/* 简单导航样式 */
.simple-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  justify-content: center;
  gap: 8px;

  .nav-item {
    font-size: 14px;
    padding: 2px 16px;
    cursor: pointer;
    color: #666;
    border-radius: 20px;
    transition: all 0.3s;

    &:hover {
      color: #333;
      background: #f5f5f5;
    }

    &.active {
      color: #fff;
      background: #FFAD22;
      // font-weight: bold;
    }
  }
}

/* 内容区域 */
.section {
  min-height: 100vh;
  padding: 10px;
  // padding-top: 60px;
  /* 为导航栏留出空间 */

  .section-title {
    font-size: 14px;
    background: url(../../assets/hotshop/titlebg.png);
    background-size: 100% 100%;
    width: 150px;
    height: 40px;
    text-align: center;
    line-height: 42px;
    font-weight: bold;
    margin: auto auto;
    color: #ffffff;
  }
}

/* 保持原有样式不变 */
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
}

.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}

.bannerBox {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  width: 60px;
  height: 60px;
  padding: 5px;
  display: flex;
  align-items: center;
  margin: auto;
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
</style>