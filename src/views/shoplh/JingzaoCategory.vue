<template>
  <div class="jingzao-category">
    <!-- 主内容滚动区域 -->
    <div class="scroll-content">
      <!-- 1. 顶部导航与搜索 -->
      <div class="header-area">
        <div class="search-row">
          <div class="location">
            <div class="back-btn" @click="goBack">
              <img src="../../assets/lh/bk2.png" style="width: 12px;opacity: 0.4;" alt="返回" />
            </div>
          </div>
          <div class="search-box">
            <img src="../../assets/lh/serchico.png" style="width: 20px;height: 20px;" alt="">
            <input type="text" placeholder="请输入商品名称" />
            <span class="search-btn">搜索</span>
          </div>
        </div>
      </div>

      <!-- 2. 主体双栏布局 -->
      <div class="category-body">
        <!-- 左侧分类菜单：展示顶层分类 -->
        <div class="sidebar">
          <div class="menu-item" v-for="(item, index) in topCategories" :key="item.id"
            :class="{ active: String(activeCategoryId) === String(item.id) }" @click="selectCategory(item, index)">
            {{ item.title }}
            <div class="active-line" v-if="String(activeCategoryId) === String(item.id)"></div>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="content-area">
          <div class="content-wrapper" v-if="currentCategory">
            <!-- 顶部 BANNER 图 -->
            <div class="sub-banner">
              <div class="banner-bg">
                <span class="sub-title">{{ currentCategory.title }}</span>
                <img class="banner-img" :src="currentCategory.img" alt="" v-if="currentCategory.img" />
              </div>
            </div>

            <!-- 如果有子分类，展示子分类网格 -->
            <template v-if="currentCategory.children && currentCategory.children.length > 0">
              <div class="sub-header-title">{{ currentCategory.title }}</div>
              <div class="sub-goods-grid">
                <div class="sub-goods-item" v-for="(child, childIndex) in currentCategory.children" :key="child.id"
                  @click="toMore2(currentCategory.id, child.id, activeCategoryIndex, childIndex)">
                  <img class="sub-goods-img" :src="child.img || defaultImg" alt="" />
                  <div class="sub-goods-name">{{ child.title }}</div>
                </div>
              </div>
            </template>

            <!-- 如果没有子分类，展示商品列表（需要调用商品接口） -->
            <template v-else>
              <div class="sub-header-title">{{ currentCategory.title }}</div>
              <div class="sub-goods-grid" v-if="goodsList.length > 0">
                <div class="sub-goods-item" v-for="(goods, idx) in goodsList" :key="idx">
                  <img class="sub-goods-img" :src="goods.img || defaultImg" alt="" />
                  <div class="sub-goods-name">{{ goods.name || goods.title }}</div>
                </div>
              </div>
              <div v-else class="empty-tip">暂无商品</div>
            </template>
          </div>
        </div>
      </div>

      <!-- 垫高底部 -->
      <div class="bottom-safe-area"></div>
    </div>

    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <div class="tab-item" @click="goToHome">
        <img class="tab-icon"
          :src="$route.path === '/JingzaoHome' ? require('../../assets/lh/jdzy/hm1-1.png') : require('../../assets/lh/jdzy/hm2-1.png')"
          alt="首页" />
        <div class="tab-text" :class="{ active: $route.path === '/JingzaoHome' }">首页</div>
      </div>
      <div class="tab-item" @click="goToCategory">
        <img class="tab-icon"
          :src="$route.path === '/JingzaoCategory' ? require('../../assets/lh/jdzy/hm1-0.png') : require('../../assets/lh/jdzy/hm2-2.png')"
          alt="分类" />
        <div class="tab-text" :class="{ active: $route.path === '/JingzaoCategory' }">分类</div>
      </div>
    </div>
  </div>
</template>

<script>
import { home, categoryList, productList } from "@/api/lhjdtm";

export default {
  name: "JingzaoCategory",
  data() {
    return {
      activeCategoryId: null,      // 当前选中的顶层分类ID
      activeCategoryIndex: 0,      // 当前选中的分类索引
      categories: [],              // 完整的分类树数据
      topCategories: [],           // 顶层分类（pid=0）
      currentCategory: null,       // 当前选中的分类对象
      goodsList: [],               // 当前分类下的商品列表
      defaultImg: 'https://via.placeholder.com/50'  // 默认占位图
    };
  },
  computed: {
    // 可以保留，但逻辑已放到方法中
  },
  activated() {
    console.log('JingzaoCategory activated');
    if (this.topCategories.length === 0) {
      this.IndexcategoryList();
    }
  },
  methods: {
    // 获取首页数据
    Indexhome() {
      home({ platform: 3, limit: 10 }).then(res => {
        console.log(res);
        if (res.code === 200) {
          // 处理首页数据
        }
      });
    },

    // 获取分类列表
    IndexcategoryList() {
      categoryList({ platform: 1, jd_type: 3 }).then(res => {
        console.log('分类数据:', res);
        if (res.code === 200) {
          this.categories = res.data || [];
          // 顶层分类：pid 用字符串比较，避免类型不一致
          this.topCategories = this.categories.filter(item => String(item.pid) === '0');

          // 默认选中第一个
          if (this.topCategories.length > 0) {
            this.selectCategory(this.topCategories[0], 0);
          }

          // 首页带 categoryId 进来时，高亮对应的一级分类
          const cid = this.$route.query.categoryId;
          if (cid) {
            const index = this.topCategories.findIndex(item => String(item.id) === String(cid));
            if (index !== -1) {
              this.selectCategory(this.topCategories[index], index);
            }
          }
        }
      });
    },
    // 跳转到子分类商品
    toMore2(id, id2, index1, index2) {
      console.log('大分类id:', id, '子分类id:', id2)
      if (!id2) {
        this.navigateToProductList({ cate_id: 0 });
        return;
      }
      this.navigateToProductList({ cate_id: Number(id2) });
    },
    // 统一跳转方法
    navigateToProductList(query) {
      sessionStorage.setItem('fromClassification', 'true');
      this.$router.push({
        path: "/productList",
        query: {
          ...query,
          t: Date.now() // 添加时间戳，确保路由变化
        }
      });
    },

    // 获取商品列表
    IndexproductList(categoryId) {
      const params = { platform: 3 };
      if (categoryId) {
        params.category_id = categoryId;  // 根据接口实际参数名调整
      }
      productList(params).then(res => {
        console.log('商品数据:', res);
        if (res.code === 200) {
          this.goodsList = res.data || [];
        }
      });
    },

    // 选择顶层分类
    selectCategory(category, index) {
      if (!category) return;
      this.activeCategoryId = category.id;
      this.activeCategoryIndex = index;
      this.currentCategory = category;
      this.goodsList = [];
      if (!category.children || category.children.length === 0) {
        this.IndexproductList(category.id);
      }
    },

    // 选择子分类
    selectChildCategory(child) {
      this.currentCategory = child;
      this.goodsList = [];
      this.IndexproductList(child.id);
    },

    goBack() {
      this.$router.go(-1);
    },

    goToCategory() {
      if (this.$route.path !== '/JingzaoCategory') {
        this.$router.push('/JingzaoCategory');
      }
    },

    goToHome() {
      this.$router.push('/JingzaoHome');
    }
  },

  mounted() {

    console.log('JingzaoCategory mounted');
    this.IndexcategoryList();
  }
};
</script>

<style scoped lang="less">
.jingzao-category {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
  overflow: hidden;
}

/* 主内容区域 */
.scroll-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 60px);
  /* 减去TabBar高度 */
}

/* 1. 顶部 */
.header-area {
  background: #EFEFEF;
  padding: 10px 16px 10px 16px;
  flex-shrink: 0;

  .search-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .location {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      display: flex;
      align-items: center;
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 20px;
      padding: 6px 12px;

      input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 13px;
      }

      .search-btn {
        font-size: 12px;
        color: #fff;
        background: #ff3b30;
        padding: 4px 12px;
        border-radius: 16px;
      }
    }
  }
}

/* 2. 双栏布局 */
.category-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;

  .sidebar {
    width: 90px;
    background: #EFEFEF;
    overflow-y: auto;
    flex-shrink: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      display: none;
    }

    /* 填充剩余空间 */
    &::after {
      content: '';
      flex: 1;
      background: #EFEFEF;
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
        color: #d32f2f !important;
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
    padding: 12px 12px 60px 12px;
    height: 100%;

    &::-webkit-scrollbar {
      display: none;
    }

    .sub-banner {
      margin-bottom: 16px;

      .banner-bg {
        position: relative;
        background: linear-gradient(90deg, #5a9cf8, #6eb0fb);
        border-radius: 12px;
        height: 80px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        overflow: hidden;

        .sub-title {
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          z-index: 2;
        }

        .banner-img {
          position: absolute;
          right: 0;
          top: 0;

          width: 50%;
          -o-object-fit: cover;
          object-fit: contain;

          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 100%);
        }
      }
    }

    .sub-header-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
    }

    .sub-goods-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px 8px;

      .sub-goods-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .sub-goods-img {
          width: 50px;
          height: 50px;
          background: #f5f6fa;
          border-radius: 8px;
          margin-bottom: 6px;
          object-fit: cover;
        }

        .sub-goods-name {
          font-size: 12px;
          color: #333;
          text-align: center;
        }
      }
    }

    .empty-tip {
      text-align: center;
      color: #999;
      padding: 40px 0;
      font-size: 14px;
    }
  }
}

/* 底部TabBar */
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
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

    &.active {
      .tab-text {
        color: #ff3b30 !important;
        font-weight: bold;
      }
    }
  }
}
.tab-item {
  .tab-text {
    font-size: 10px;
    color: #999;

    &.active {
      color: #ff3b30 !important;
      font-weight: bold;
    }
  }
}
</style>