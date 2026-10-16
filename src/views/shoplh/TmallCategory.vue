<template>
  <div class="tmall-category">
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
            <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
            <span class="search-btn" @click="handleSearch">搜索</span>
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

            <!-- 如果没有子分类，展示商品列表 -->
            <template v-else>
              <div class="sub-header-title">{{ currentCategory.title }}</div>
              <div class="sub-goods-grid" v-if="goodsList.length > 0">
                <div class="sub-goods-item" v-for="(goods, idx) in goodsList" :key="idx" @click="goToDetail(goods)">
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
          :src="$route.path === '/TmallSupermarket' ? require('../../assets/lh/tm/t-1.png') : require('../../assets/lh/tm/t-11.png')"
          alt="首页" />
        <div class="tab-text" :class="{ active: $route.path === '/TmallSupermarket' }">首页</div>
      </div>
      <div class="tab-item" @click="goToCategory">
        <img class="tab-icon"
          :src="$route.path === '/TmallCategory' ? require('../../assets/lh/tm/t-2.png') : require('../../assets/lh/tm/t-22.png')"
          alt="分类" />
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
      platform: 2,
      searchKeyword: '',
      activeCategoryId: null,
      activeCategoryIndex: 0,
      categories: [],
      topCategories: [],
      currentCategory: null,
      goodsList: [],
      defaultImg: require('../../assets/lh/730.png'),
      page: 1,
      limit: 20,

      // 新增：标记分类是否已经加载成功
      categoryLoaded: false,
      // 新增：标记是否有请求正在进行，防止重复请求
      categoryLoading: false,
    };
  },

  activated() {
    // 每次进入分类页都尝试加载，但内部会判断是否需要真正请求
    this.ensureCategoryList();
  },

  mounted() {
    // 兼容没有被 keep-alive 缓存的情况：
    // 如果组件被缓存，mounted 首次会执行，activated 首次也会执行
    // 这里用 ensureCategoryList 内部的 loading / loaded 判断，避免重复请求
    this.ensureCategoryList();
  },

  methods: {
    /**
     * 统一入口：保证分类只加载一次，且失败可重试，二次进入不重复请求
     */
    ensureCategoryList() {
      // 已经加载成功，直接返回，不再请求
      if (this.categoryLoaded) return;
      // 正在请求中，直接返回，防止并发重复请求
      if (this.categoryLoading) return;

      this.categoryLoading = true;

      categoryList({ platform: this.platform })
        .then(res => {
          console.log('天猫分类数据:', res);

          // 兼容 code 为数字 200 或字符串 "200"
          if (Number(res.code) === 200) {
            this.categories = res.data || [];
            this.topCategories = this.categories.filter(
              item => String(item.pid) === '0'
            );

            if (this.topCategories.length > 0) {
              this.selectCategory(this.topCategories[0], 0);
            }

            // 首页带 categoryId 进来时高亮
            const cid = this.$route.query.categoryId;
            if (cid) {
              const index = this.topCategories.findIndex(
                item => String(item.id) === String(cid)
              );
              if (index !== -1) {
                this.selectCategory(this.topCategories[index], index);
              }
            }

            // 只有成功后才标记为已加载
            this.categoryLoaded = true;
          } else {
            // 接口返回非 200，视为失败，不标记 loaded，下次进入可重试
            console.warn('分类接口返回异常:', res.code, res.msg);
          }
        })
        .catch(err => {
          // 失败不标记 loaded，下次进入自动重试
          console.error('分类接口请求失败:', err);
        })
        .finally(() => {
          this.categoryLoading = false;
        });
    },

    // 跳转到子分类商品列表
    toMore2(id, id2, index1, index2) {
      console.log('大分类id:', id, '子分类id:', id2);
      if (!id2) {
        this.navigateToProductList({ cate_id: 0 });
        return;
      }
      this.navigateToProductList({ cate_id: Number(id2) });
    },

    // 统一跳转
    navigateToProductList(query) {
      sessionStorage.setItem('fromClassification', 'true');
      this.$router.push({
        path: "/productList",
        query: {
          ...query,
          platform: this.platform,
          t: Date.now()
        }
      });
    },

    // 获取商品列表
    // IndexproductList(categoryId) {
    //   const params = { platform: this.platform, page: this.page, limit: this.limit };
    //   if (categoryId) params.cate_id = categoryId;

    //   productList(params)
    //     .then(res => {
    //       console.log('天猫分类商品:', res);
    //       if (Number(res.code) === 200) {
    //         if (res.data && res.data.data) {
    //           this.goodsList = res.data.data;
    //         } else if (Array.isArray(res.data)) {
    //           this.goodsList = res.data;
    //         } else {
    //           this.goodsList = [];
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       console.error('商品列表请求失败:', err);
    //       this.goodsList = [];
    //     });
    // },

    // 选择顶层分类
    selectCategory(category, index) {
      if (!category) return;
      this.activeCategoryId = category.id;
      this.activeCategoryIndex = index;
      this.currentCategory = category;
      this.goodsList = [];

      // if (!category.children || category.children.length === 0) {
      //   this.IndexproductList(category.id);
      // }
    },

    // 选择子分类
    selectChildCategory(child) {
      this.currentCategory = child;
      this.goodsList = [];
      // this.IndexproductList(child.id);
    },

    // 商品详情
    goToDetail(item) {
      if (!item) return;
      this.$goDetail(item);
    },

    // 搜索
    handleSearch() {
      if (this.searchKeyword.trim()) {
        console.log('搜索:', this.searchKeyword);
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    goToCategory() {
      if (this.$route.path !== '/TmallCategory') {
        this.$router.push('/TmallCategory');
      }
    },

    goToHome() {
      if (this.$route.path !== '/TmallSupermarket') {
        this.$router.push('/TmallSupermarket');
      }
    }
  },
};
</script>

<style scoped lang="less">
.tmall-category {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.scroll-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 60px);
}

/* 1. 顶部 */
.header-area {
  background: #EFEFEF;
  padding: 10px 16px;
  flex-shrink: 0;

  .search-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .location {
      font-size: 14px;
      font-weight: bold;
      color: #000;
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
        color: #333;
      }

      .search-btn {
        font-size: 12px;
        color: #fff;
        background: #F42E45;
        padding: 4px 12px;
        border-radius: 16px;
        cursor: pointer;
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

/* 底部 TabBar */
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

      &.active {
        color: #46C800 !important;
        font-weight: bold;
      }
    }
  }
}
</style>