<template>
  <div class="tmall-category">
    
    <!-- 1. 顶部定位与搜索 -->
    <div class="search-top-area">
      <div class="location-area">
        <div class="back-btn" @click="goBack">
          <img src="../../assets/lh/bk2.png" style="width: 12px; opacity: 0.4;" alt="返回" />
        </div>
      </div>
      <div class="search-wrapper">
        <img src="../../assets/lh/serchico.png" class="search-icon" alt="" />
        <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
        <span class="search-btn" @click="handleSearch">搜索</span>
      </div>
    </div>

    <!-- 2. 双栏布局 -->
    <div class="category-body">
      <!-- 左侧菜单（顶层分类） -->
      <div class="sidebar">
        <div class="menu-item" 
             v-for="(item, index) in topCategories" 
             :key="item.id"
             :class="{ active: activeCategoryId === item.id }" 
             @click="selectCategory(item, index)">
          {{ item.title }}
          <div class="active-line" v-if="activeCategoryId === item.id"></div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="content-area">
        <!-- 分类标题 -->
        <div class="content-title">{{ currentCategory.title }}</div>

        <!-- 如果有子分类，展示子分类 -->
        <template v-if="currentCategory.children && currentCategory.children.length > 0">
          <div class="sub-grid">
            <div class="sub-item" 
                 v-for="(sub, idx) in currentCategory.children" 
                 :key="sub.id"
                 @click="selectChildCategory(sub)">
              <img class="sub-img" :src="sub.img || defaultImg" alt="" />
              <div class="sub-name">{{ sub.title }}</div>
            </div>
          </div>
        </template>

        <!-- 如果没有子分类，展示商品列表 -->
        <template v-else>
          <div class="sub-title-text">商品列表</div>
          <div class="goods-list" v-if="goodsList.length > 0">
            <div class="goods-item" v-for="(goods, idx) in goodsList" :key="idx" @click="goToDetail(goods)">
              <img class="goods-img" :src="goods.img" alt="" />
              <div class="goods-info">
                <div class="goods-name">{{ goods.title }}</div>
                <div class="goods-price">
                  <span class="symbol">¥</span>{{ goods.sell_price }}
                </div>
              </div>
            </div>
          </div>
          <div class="empty-tip" v-else>暂无商品</div>
        </template>
      </div>
    </div>

    <!-- 3. 底部导航 -->
    <div class="tab-bar">
      <!-- 首页 -->
      <div class="tab-item" @click="goToHome">
        <img 
          class="tab-icon" 
          :src="$route.path === '/TmallSupermarket' ? require('../../assets/lh/tm/t-1.png') : require('../../assets/lh/tm/t-11.png')" 
          alt="首页" 
        />
        <div class="tab-text" :class="{ active: $route.path === '/TmallSupermarket' }">首页</div>
      </div>
      
      <!-- 分类 -->
      <div class="tab-item" @click="goToCategory">
        <img 
          class="tab-icon" 
          :src="$route.path === '/TmallCategory' ? require('../../assets/lh/tm/t-2.png') : require('../../assets/lh/tm/t-22.png')" 
          alt="分类" 
        />
        <div class="tab-text" :class="{ active: $route.path === '/TmallCategory' }">分类</div>
      </div>
    </div>
  </div>
</template>

<script>
import { categoryList, productList } from "@/api/lhjdtm";

export default {
  name: "TmallCategory",
  data() {
    return {
      platform: 2,              // 天猫平台
      searchKeyword: '',
      activeCategoryId: null,   // 当前选中的分类ID
      categories: [],           // 完整分类树
      topCategories: [],        // 顶层分类（pid=0）
      currentCategory: {},      // 当前选中的分类
      goodsList: [],            // 商品列表
      defaultImg: require('../../assets/lh/730.png'),
      page: 1,
      limit: 10,
    }
  },
  methods: {
    // 获取分类列表
    IndexcategoryList() {
      categoryList({ platform: this.platform }).then(res => {
        console.log('天猫分类数据:', res);
        if (res.code == 200) {
          this.categories = res.data || [];
          // 筛选顶层分类（pid = 0）
          this.topCategories = this.categories.filter(item => item.pid === 0);
          
          // 默认选中第一个分类
          if (this.topCategories.length > 0) {
            this.selectCategory(this.topCategories[0], 0);
          }
          
          // 如果路由有传分类ID，选中对应分类
          if (this.$route.query.categoryId) {
            const targetId = Number(this.$route.query.categoryId);
            const targetIndex = this.topCategories.findIndex(item => item.id === targetId);
            if (targetIndex !== -1) {
              this.selectCategory(this.topCategories[targetIndex], targetIndex);
            }
          }
        }
      })
    },
    
    // 选择分类
    selectCategory(category, index) {
      this.activeCategoryId = category.id;
      this.currentCategory = category;
      this.goodsList = [];
      
      // 如果没有子分类，直接加载商品
      if (!category.children || category.children.length === 0) {
        this.loadGoods(category.id);
      }
    },
    
    // 选择子分类
    selectChildCategory(child) {
      this.currentCategory = child;
      this.goodsList = [];
      this.loadGoods(child.id);
    },
    
    // 加载分类下的商品
    loadGoods(categoryId) {
      productList({
        platform: this.platform,
        cate_id: categoryId,
        page: this.page,
        limit: this.limit,
        sort: 'px',
        order: 'desc',
      }).then(res => {
        console.log('天猫分类商品:', res);
        if (res.code == 200) {
          if (res.data && res.data.data) {
            this.goodsList = res.data.data;
          } else if (Array.isArray(res.data)) {
            this.goodsList = res.data;
          }
        }
      })
    },
    
    // 查看商品详情
    goToDetail(item) {
      this.$goDetail(item);
      // if (goods.id) {
      //   this.$router.push({
      //     path: '/ProductDetail',
      //     query: { id: goods.id }
      //   });
      // }
    },
    
    // 搜索
    handleSearch() {
      if (this.searchKeyword.trim()) {
        console.log('搜索:', this.searchKeyword);
        // 可以跳转到搜索页面
      }
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    goToHome() {
      if (this.$route.path !== '/TmallSupermarket') {
        this.$router.push('/TmallSupermarket');
      }
    },
    
    goToCategory() {
      if (this.$route.path !== '/TmallCategory') {
        this.$router.push('/TmallCategory');
      }
    }
  },
  
  mounted() {
    this.IndexcategoryList();
  }
}
</script>

<style scoped lang="less">
.tmall-category { 
  height: 100vh; 
  display: flex; 
  flex-direction: column; 
  background: #fff; 
  overflow: hidden;
}

/* ================= 1. 顶部定位与搜索 ================= */
.search-top-area {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  gap: 12px;
  background: #f5f5f5;
  flex-shrink: 0;
  
  .location-area {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    
    .arrow {
      font-size: 10px;
      margin-left: 4px;
      color: #333;
    }
  }

  .search-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    padding: 4px 6px 4px 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);

    .search-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13px;
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }

    .search-btn {
      background: #F42E45;
      color: #fff;
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 500;
    }
  }
}

/* ================= 2. 双栏 ================= */
.category-body { 
  flex: 1; 
  display: flex; 
  overflow: hidden;
  min-height: 0;
}

.sidebar { 
  width: 85px; 
  background: #f7f8fa; 
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  
  // 填充剩余空间，避免背景空白
  &::after {
    content: '';
    flex: 1;
    background: #f7f8fa;
  }
  
  &::-webkit-scrollbar { 
    display: none; 
  }
  
  .menu-item { 
    position: relative; 
    padding: 16px 0; 
    text-align: center; 
    font-size: 14px; 
    color: #666; 
    cursor: pointer;
    flex-shrink: 0;
    
    &.active { 
      background: #fff; 
      color: #d32f2f; 
      font-weight: bold; 
      
      .active-line { 
        position: absolute; 
        left: 0; 
        top: 20%; 
        height: 60%; 
        width: 3px; 
        background: #d32f2f; 
        border-radius: 0 4px 4px 0; 
      } 
    } 
  } 
}

.content-area { 
  flex: 1; 
  background: #fff; 
  overflow-y: auto; 
  padding: 16px;
  height: 100%;
  
  &::-webkit-scrollbar { 
    display: none; 
  }
  
  .content-title { 
    font-size: 15px; 
    font-weight: 500; 
    color: #333; 
    margin-bottom: 16px; 
  }
  
  .sub-title-text {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
  }
}

.sub-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px 0; 
  padding-bottom: 20px; 
  
  .sub-item { 
    display: flex; 
    flex-direction: column; 
    align-items: center;
    cursor: pointer;
    
    .sub-img { 
      width: 50px; 
      height: 50px; 
      background: #f5f6fa; 
      border-radius: 8px; 
      margin-bottom: 6px;
      object-fit: cover;
    } 
    
    .sub-name { 
      font-size: 12px; 
      color: #333; 
    } 
  } 
}

/* 商品列表 */
.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .goods-item {
    background: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    
    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
    }
    
    .goods-info {
      padding: 8px;
    }
    
    .goods-name {
      font-size: 13px;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 4px;
    }
    
    .goods-price {
      color: #d32f2f;
      font-weight: bold;
      font-size: 14px;
      
      .symbol {
        font-size: 11px;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

/* ================= 3. 底部导航 ================= */
.tab-bar { 
  position: fixed; 
  bottom: 0; 
  left: 0; 
  width: 100%; 
  height: 60px; 
  background: #fff; 
  border-top: 1px solid #f0f0f0; 
  display: flex; 
  align-items: center; 
  justify-content: space-around; 
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  
  .tab-item { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    cursor: pointer; 
    
    .tab-icon { 
      width: 24px; 
      height: 24px; 
      margin-bottom: 2px; 
    } 
    
    .tab-text { 
      font-size: 10px; 
      color: #999; 
    } 
    
    .active { 
      color: #F42E45; 
      font-weight: bold; 
    } 
  } 
}
</style>