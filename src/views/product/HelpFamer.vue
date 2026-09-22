<template>
  <div class="conPage">
    <img src="../../assets/zhunong1.png" style="width: 100%;height: 400px; object-fit: cover;" alt="">
    
    <!-- Tab 切换导航 -->
    <div class="simple-nav">
      <div 
        :class="['nav-item', { active: activeTab === 'brand' }]" 
        @click="switchTab('brand')"
      >
        {{categoryList[0]?.title || ''}}
      </div>
      <div 
        :class="['nav-item', { active: activeTab === 'select' }]" 
        @click="switchTab('select')"
      >
        {{categoryList[1]?.title || ''}}
      </div>
      <div 
        :class="['nav-item', { active: activeTab === 'food' }]" 
        @click="switchTab('food')"
      >
        {{categoryList[2]?.title || ''}}
      </div>
    </div>

    <!-- 品牌数据区域 - 只有 activeTab === 'brand' 时显示 -->
    <div v-show="activeTab === 'brand'" class="section">
      <div class="product-grid">
        <div v-for="item in brandProductList" :key="item.id" class="grid-item">
          <NewProductList1 :change="1" :listItem="item"></NewProductList1>
        </div>
      </div>
    </div>

    <!-- 甄选数据区域 - 只有 activeTab === 'select' 时显示 -->
    <div v-show="activeTab === 'select'" class="section">
      <div class="product-grid">
        <div v-for="item in selectProductList" :key="item.id" class="grid-item">
          <NewProductList1 :change="1" :listItem="item"></NewProductList1>
        </div>
      </div>
    </div>

    <!-- 美食数据区域 - 只有 activeTab === 'food' 时显示 -->
    <div v-show="activeTab === 'food'" class="section">
      <div class="product-grid">
        <div v-for="item in foodProductList" :key="item.id" class="grid-item">
          <NewProductList1 :change="1" :listItem="item"></NewProductList1>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NewProductList1 from '@/components/NewProductList1.vue';
import { getBrandPickt } from "@/api";

export default {
  name: "SelectBrand",
  components: {
    NewProductList1
  },
  data() {
    return {
      activeTab: 'brand',  // 当前激活的tab: brand, select, food
      categoryList: [],
      brandProductList: [],
      selectProductList: [],
      foodProductList: [],
      ids: "",
      pageno: 1,
      isLoading: false,
    }
  },
  methods: {
    // 切换Tab
    switchTab(tab) {
      this.activeTab = tab;
    },

    getNewBrindProduct() {
      this.isLoading = true
      getBrandPickt({
        id: this.ids,
        pageno: this.pageno,
        pagesize: 10
      }).then(res => {
        if (res.code == 200) {
          if (res.data.fenlei_list.length == 0) {
            return
          }
          this.categoryList = res.data.fenlei_list || [];
          
          // 直接按索引分配（3个分类正好对应3个区域）
          if (this.categoryList[0]) {
            this.brandProductList = this.categoryList[0].product_list || [];
          }
          if (this.categoryList[1]) {
            this.selectProductList = this.categoryList[1].product_list || [];
          }
          if (this.categoryList[2]) {
            this.foodProductList = this.categoryList[2].product_list || [];
          }

          console.log('brandProductList:', this.brandProductList);
          console.log('selectProductList:', this.selectProductList);
          console.log('foodProductList:', this.foodProductList);
        }
      })
    },
  },
  created() {
    this.ids = this.$route.query.id;
  },
  mounted() {
    this.getNewBrindProduct()
        window.scrollTo(0, 0);
  },
}
</script>

 <style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #f0f0f0;
}

// 两列网格布局
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 8px 4px;
}

.grid-item {
  width: 100%;
}

@media (max-width: 480px) {
  .product-grid {
    gap: 10px;
  }
}

/* Tab 导航样式 */
.simple-nav {
  position: relative;
  top: -5px;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 12px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  justify-content: space-around;
  gap: 8px;

  .nav-item {
    font-size: 14px;
    cursor: pointer;
    color: #666;
    border-radius: 30px;
    transition: all 0.3s;
    position: relative;
    // padding-bottom: 8px;

    &:hover {
      color: #000000;
    }

    &.active {
      color: #7AC763;
      font-weight: 600;
    }

    /* 绿色横线指示器 */
    &.active::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 4px;
      background-color: #7AC763;
      border-radius: 2px;
    }
  }
}

/* 内容区域 */
.section {
  min-height: 100vh;
  padding: 0px 6px 5px 6px;
}

/* 卡片样式覆盖 */
.grid-item .comPage {
  display: flex !important;
  flex-direction: column !important;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0;
  padding: 0;
  border: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 图片容器 - 100%宽度 */
:deep(.grid-item .comPage .imgBox) {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  flex: 0 0 100% !important;
  border-radius: 0 !important;
}

/* 图片本身 */
:deep(.grid-item .comPage .imgBox .img) {
  width: 100% !important;
  height: auto !important;
  min-width: 100% !important;
  max-width: 100% !important;
  display: block !important;
  object-fit: cover !important;
  aspect-ratio: 1 / 1 !important;
}

/* 内容区域 */
:deep(.grid-item .comPage .rightBox) {
  width: 100% !important;
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 0 !important;
  text-align: left;
}

/* 标题两行 */
:deep(.grid-item .comPage .shopName) {
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  min-height: 36px;
  color: #333;
}

/* 底部区域自动撑开 */
:deep(.grid-item .comPage .atOnce) {
  margin-top: auto !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.leftBox) {
  text-align: left;
  align-items: flex-start;
  padding-left: 10px;
}

/* 助农标签 - 完整样式 */
:deep(.grid-item .comPage .atOnce::before) {
  content: "爱心助农";
  display: inline-block;
  background: linear-gradient(135deg, #feede3, #feede3);
  color: #ca403e;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;
  margin-bottom: 5px;
  width: fit-content;
  margin-top: 2px;
  font-weight: 500;
}

/* 价格样式 */
:deep(.grid-item .comPage .priceBox) {
  color: #ca403e !important;
  font-weight: 600;
  font-size: 12px;
  padding-bottom: 6px;
  margin-top: 4px;
}

:deep(.grid-item .comPage .priceBox .price) {
  font-size: 18px !important;
  font-weight: 700;
}

/* 响应式调整 */
@media (max-width: 480px) {
  :deep(.grid-item .comPage .rightBox) {
    padding: 0 !important;
    text-align: left;
  }
  
  :deep(.grid-item .comPage .shopName) {
    font-size: 14px;
    padding: 0 10px;
    min-height: 33px;
    height: 39.19px;
  }
  
  :deep(.grid-item .comPage .priceBox .price) {
    font-size: 16px !important;
  }
}
</style>