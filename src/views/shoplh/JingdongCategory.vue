<template>
  <div class="category-page">
    <!-- 1. 顶部搜索 -->
    <div class="header-area">
      <div class="back-btn" @click="goBack">
        <img src="../../assets/lh/bk2.png" style="width: 12px;opacity: 0.4;" alt="返回" />
      </div>
      <div class="search-bar">
        <img src="../../assets/lh/serchico.png" class="search-icon" alt="" />
        <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
        <span class="search-btn" @click="handleSearch">搜索</span>
      </div>
    </div>

    <!-- 2. 主体双栏布局 -->
    <div class="category-body">
      <!-- 左侧：分类菜单（展示顶层分类） -->
      <div class="sidebar">
        <div class="menu-item" v-for="(item, index) in topCategories" :key="item.id"
          :class="{ active: activeCategoryId === item.id }" @click="selectCategory(item, index)">
          {{ item.title }}
        </div>
      </div>

      <!-- 右侧：内容区 -->
      <div class="content-area">
        <!-- 分类标题 -->
        <div class="content-title">{{ currentCategory.title }}</div>

        <!-- 如果有子分类，展示子分类网格 -->
        <template v-if="currentCategory.children && currentCategory.children.length > 0">
          <div class="sub-grid">
            <div class="sub-item" v-for="(sub, idx) in currentCategory.children" :key="sub.id"
              @click="selectChildCategory(sub)">
              <img class="sub-img" :src="sub.img || defaultImg" alt="" />
              <div class="sub-name">{{ sub.title }}</div>
            </div>
          </div>
        </template>

        <!-- 如果没有子分类，展示商品列表 -->

      </div>
    </div>


    
    <!-- 3. 底部导航 -->
    <div class="tab-bar">
      <div class="tab-item" @click="goToHome" :class="{ active: $route.path === '/JingdongChannel' }">
        <img class="tab-icon"
          :src="$route.path === '/JingdongChannel' ? require('../../assets/lh/jdzy/hm1-1.png') : require('../../assets/lh/jdzy/hm2-1.png')"
          alt="首页" />
        <div class="tab-text">首页</div>
      </div>
      <div class="tab-item" @click="goToCategory" :class="{ active: $route.path === '/JingdongCategory' }">
        <img class="tab-icon"
          :src="$route.path === '/JingdongCategory' ? require('../../assets/lh/jdzy/hm1-0.png') : require('../../assets/lh/jdzy/hm2-1.png')"
          alt="分类" />
        <div class="tab-text">分类</div>
      </div>
    </div>
  </div>
</template>

<script>
import { categoryList, productList } from "@/api/lhjdtm";

export default {
  name: "JingdongCategory",
  data() {
    return {
      platform: 1,
      searchKeyword: '',
      activeCategoryId: null,
      activeCategoryIndex: 0,    // 新增
      categories: [],
      topCategories: [],
      currentCategory: {},
      goodsList: [],
      defaultImg: require('../../assets/lh/jdzy/b.png'),
      page: 1,
      limit: 10,
      loading: false,            // 新增
    }
  },
  methods: {
    // 图片 http 转 https
    fixTreeImg(list) {
      return list.map(item => ({
        ...item,
        img: item.img ? item.img.replace('http://', 'https://') : '',
        children: item.children ? this.fixTreeImg(item.children) : []
      }));
    },

    // 按 id 递归查找分类
    findCategoryById(list, id) {
      for (const item of list) {
        if (item.id === id) return item;
        if (item.children && item.children.length > 0) {
          const found = this.findCategoryById(item.children, id);
          if (found) return found;
        }
      }
      return null;
    },

    // 找到某个分类所属的顶层分类 id（用于左侧高亮）
    findTopParentId(id) {
      for (const top of this.topCategories) {
        if (top.id === id) return top.id;
        const found = this.findCategoryById(top.children || [], id);
        if (found) return top.id;
      }
      return null;
    },
    // 获取分类列表
    IndexcategoryList() {
      categoryList({ platform: 1, jd_type: 2 }).then(res => {
        if (res.code == 200) {
          this.categories = this.fixTreeImg(res.data || []);
          this.topCategories = this.categories.filter(item => item.pid === 0);

          // 默认选中第一个有子分类的顶层分类
          const firstWithChildren = this.topCategories.find(c => c.children && c.children.length > 0);
          this.selectCategory(firstWithChildren || this.topCategories[0], 0);

          // 路由带 categoryId：只高亮对应一级分类，不跳转
          if (this.$route.query.categoryId) {
            const targetId = Number(this.$route.query.categoryId);
            const topId = this.findTopParentId(targetId);
            if (topId) {
              const index = this.topCategories.findIndex(c => c.id === topId);
              if (index !== -1) {
                this.selectCategory(this.topCategories[index], index);
              }
            }
          }
        }
      })
    },


    selectCategory(category, index) {
      this.activeCategoryId = category.id;
      this.activeCategoryIndex = index;
      this.currentCategory = category;
      this.goodsList = [];
      // 不跳转，只切换右侧显示
    },

    // 选择子分类
    // selectChildCategory(child) {
    //   this.$router.push({
    //     path: '/productList',
    //     query: { cate_id: child.id, t: Date.now() }
    //   });
    // },
    selectChildCategory(child) {
      this.$router.push({
        path: '/productList',
        query: {
          cate_id: child.id,
          platform: 1,
          jd_type: 2,
          t: Date.now()
        }
      });
    },

    // 加载分类下的商品


    // 搜索
    handleSearch() {
      if (this.searchKeyword.trim()) {
        console.log('搜索:', this.searchKeyword);
        // 跳转到搜索页面或调用搜索接口
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    goToCategory() {
      if (this.$route.path !== '/JingdongCategory') {
        this.$router.push('/JingdongCategory');
      }
    },

    goToHome() {
      if (this.$route.path !== '/JingdongChannel') {
        this.$router.push('/JingdongChannel');
      }
    },
  },

  mounted() {
    this.IndexcategoryList();
  }
}
</script>

<style scoped lang="less">
.category-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
}

/* 1. 顶部 */
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 8px;
  background: #fff;
  gap: 10px;
  flex-shrink: 0;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f7f8fa;
  border-radius: 20px;
  padding: 4px 12px;

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
  }

  .search-btn {
    background: #ff3b30;
    color: #fff;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    margin-left: 6px;
    cursor: pointer;
  }

  .search-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
}

/* 2. 分类主体 */
.category-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.sidebar {
  width: 90px;
  background: #f7f8fa;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  // 填充剩余空间
  &::after {
    content: '';
    flex: 1;
    background: #f7f8fa;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .menu-item {
    padding: 16px 0;
    text-align: center;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;

    &.active {
      background: #fff;
      color: #e92b2b;
      font-weight: bold;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        height: 60%;
        width: 3px;
        background: #e92b2b;
      }
    }
  }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    display: none;
  }

  .content-title {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .sub-title-text {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
  }
}

/* 3列子分类 */
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
      width: 48px;
      height: 48px;
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

/* 3. TabBar */
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

    &.active .tab-text {
      /* ← 关键是这个 & */
      color: #ff3b30;
      font-weight: bold;
    }
  }
}
</style>