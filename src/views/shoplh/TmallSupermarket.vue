<template>
  <div class="tmall-page">
    <!-- 1. 顶部大图 + 悬浮搜索 -->
    <div class="top-wrapper">
      <!-- 背景大图 -->
      <img class="top-banner-img" src="../../assets//lh/tm/b1.png" alt="Banner" />

      <!-- 悬浮的定位和搜索 -->
      <div class="search-overlay">
        <div class="location">
          <div class="back-btn" @click="goBack">
            <img src="../../assets/lh/bk1.png" style="width: 12px;" alt="返回" />
          </div>
        </div>
        <div class="search-bar">
          <img src="../../assets/lh/serchico.png" class="search-icon" alt="" />
          <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
          <span class="search-btn" @click="handleSearch">搜索</span>
        </div>
      </div>
    </div>

    <!-- 2. 8个分类图标 -->
    <div class="category-box">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in categoryList" :key="index" @click="goToCategoryWithId(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 3. 超级补贴 + 独家上新 -->
    <div class="subsidy-row">
      <div class="subsidy-left-box">
        <div class="subsidy-header">
          <div style="display: flex;align-items: center;">
            <span class="main-title">超级补贴</span>
            <span class="badge">爆款低价</span>
          </div>
          <span style="color: #FA2C19; font-size: 12px;" @click="goToSuperValue('recommend')">减运费专区</span>
        </div>
        <div class="subsidy-scroll">
          <div class="subsidy-item" v-for="(item, index) in recommendList" :key="index" @click="goToDetail(item)">
            <img class="subsidy-img" :src="item.img || defaultImg" alt="" />
            <div class="subsidy-name">{{ item.title }}</div>
            <div class="subsidy-price">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="new-arrival-box">
        <div class="new-title" @click="TmallExclusiveNew('new')">独家上新</div>
        <div class="new-desc">去购买 ▶</div>
        <img class="new-img" :src="newList[0]?.img || defaultImg" alt="" @click="goToDetail(newList[0])" />
      </div>
    </div>

    <!-- 4. 四个切换 Tab -->
    <div class="tab-header-row">
      <div class="tab-btn" :class="{ active: currentTab === 0 }" @click="changeTab(0)">猜你喜欢</div>
      <div class="tab-btn" :class="{ active: currentTab === 1 }" @click="changeTab(1)">热门推荐</div>
      <div class="tab-btn" :class="{ active: currentTab === 2 }" @click="changeTab(2, 'hot')">热销榜</div>
      <div class="tab-btn" :class="{ active: currentTab === 3 }" @click="changeTab(3, 'new')">新品</div>
    </div>

    <!-- 5. 底部商品瀑布流 -->
    <div class="goods-grid" v-if="currentGoodsList.length > 0">
      <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <!-- <div class="goods-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div> -->
          <!-- <div class="goods-tags">
            <span class="tag" v-if="item.sale_num">已售{{ formatSaleNum(item.sale_num) }}</span>
            <span class="tag" v-if="item.stock > 0">有货</span>
          </div> -->
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
              <span class="market-price" v-if="item.market_price">¥{{ item.market_price }}</span>
            </div>
            <div class="add-cart" @click.stop="addToCart(item)">+</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div class="empty-tip" v-else-if="!loading">
      暂无商品
    </div>

    <!-- 6. 底部导航 -->
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
import { home, categoryList, productList } from "@/api/lhjdtm";

export default {
  name: "TmallSupermarket",
  data() {
    return {
      platform: 2,           // 天猫平台
      searchKeyword: '',
      currentTab: 0,
      page: 1,
      limit: 10,
      currentSort: 'px',
      loading: false,
      defaultImg: require('../../assets/lh/730.png'),
      
      // 本地默认分类图标（兜底）
      localCategoryIcons: [
        require('../../assets/lh/tm/1-1.png'),
        require('../../assets/lh/tm/1-2.png'),
        require('../../assets/lh/tm/1-3.png'),
        require('../../assets/lh/tm/1-4.png'),
        require('../../assets/lh/tm/1-5.png'),
        require('../../assets/lh/tm/1-6.png'),
        require('../../assets/lh/tm/1-7.png'),
        require('../../assets/lh/tm/1-8.png'),
      ],
      
      categoryList: [],       // 分类列表
      recommendList: [],      // 超级补贴（recommend）
      hotList: [],           // 热门推荐（hot）
      newList: [],           // 独家上新（new）
      goodsList: [],          // 商品列表（productList）
    }
  },
  computed: {
    // 根据当前Tab返回对应数据
    currentGoodsList() {
      switch (this.currentTab) {
        case 0:
          return this.goodsList;      // 猜你喜欢 - productList接口
        case 1:
          return this.hotList;        // 热门推荐 - home接口hot
        case 2:
          return this.hotList;        // 热销榜 - home接口hot
        case 3:
          return this.newList;        // 新品 - home接口new
        default:
          return this.goodsList;
      }
    }
  },
  methods: {
    // 获取首页数据
    Indexhome() {
      home({ platform: this.platform, limit: 10 }).then(res => {
        console.log('天猫首页数据:', res);
        if (res.code == 200) {
          const data = res.data;
          
          // 超级补贴数据（recommend）
          if (data && data.recommend && data.recommend.length > 0) {
            this.recommendList = data.recommend.slice(0, 3);
          }
          
          // 热门推荐数据（hot）
          if (data && data.hot && data.hot.length > 0) {
            this.hotList = data.hot;
          }
          
          // 独家上新数据（new）
          if (data && data.new && data.new.length > 0) {
            this.newList = data.new;
          }
        }
      })
    },
    
    // 获取分类列表
    IndexcategoryList() {
      categoryList({ platform: this.platform }).then(res => {
        console.log('天猫分类数据:', res);
        if (res.code == 200) {
          const apiData = res.data || [];
          const topCategories = apiData.filter(item => item.pid === 0);
          
          if (topCategories.length > 0) {
            this.categoryList = topCategories.slice(0, 8).map((item, index) => {
              return {
                id: item.id,
                title: item.title,
                img: item.img || this.localCategoryIcons[index] || this.defaultImg
              };
            });
          }
        }
      })
    },
    
    // 获取商品列表
    IndexproductList() {
      this.loading = true;
      productList({
        platform: this.platform,
        page: this.page,
        limit: this.limit,
        sort: this.currentSort,
        order: 'desc',
      }).then(res => {
        console.log('天猫商品数据:', res);
        if (res.code == 200) {
          if (res.data && res.data.data) {
            this.goodsList = res.data.data;
          } else if (Array.isArray(res.data)) {
            this.goodsList = res.data;
          }
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    
    // 格式化销量
    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      }
      return num;
    },
    
    // 搜索
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.page = 1;
        this.IndexproductList();
      }
    },
    
    // 切换Tab
    changeTab(index, type) {
      this.currentTab = index;
    },
    
    // 点击分类跳转
    goToCategoryWithId(item) {
      this.$router.push({
        path: '/TmallCategory',
        query: { categoryId: item.id, categoryTitle: item.title }
      });
    },
    
    // 跳转超值列表
    goToSuperValue(type) {
      this.$router.push({
        path: '/TmallTodaySuperLow',
        // query: { type: type, platform: this.platform }
      });
    },
    
    // 查看商品详情
    goToDetail(item) {
      
      this.$goDetail(item);
      // if (item && item.id) {
      //   this.$router.push({
      //     path: '/ProductDetail',
      //     query: { id: item.id }
      //   });
      // }
    },
    
    // 加入购物车
    addToCart(item) {
      console.log('加入购物车:', item);
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    TmallExclusiveNew() { 
      this.$router.push('/TmallExclusiveNew');
    },
    
    TmallTodaySuperLow() { 
      this.$router.push('/TmallTodaySuperLow');
    },
    
    goToHome() {
      if (this.$route.path !== '/TmallSupermarket') {
        this.$router.push('/TmallSupermarket');
      }
    },
    
    goToCategory() {
      this.$router.push('/TmallCategory');
    }
  },
  
  mounted() {
    this.Indexhome();          // 获取首页数据
    this.IndexcategoryList();  // 获取分类列表
    this.IndexproductList();   // 获取商品列表
  }
}
</script>
<style scoped lang="less">
// 商品副标题
.goods-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 市场价（划线价）
.market-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  margin-left: 6px;
  font-weight: normal;
}

// 空状态
.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}
.tmall-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 70px;
}

/* ================= 1. 顶部大图 + 悬浮搜索 ================= */
.top-wrapper {
  position: relative;
  width: 100%;
  line-height: 0;

  .top-banner-img {
    width: 100%;
    display: block;
    object-fit: cover;
    // height: 200px;
    padding-top: 49px;
  }

  .search-overlay {
    background-color: #fd0046;
    position: absolute;
    top: 0;
    /* 根据实际大图调整此数值 */
    left: 0;
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10;


    .location {
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      display: flex;
      align-items: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      .arrow {
        font-size: 10px;
        margin-left: 2px;
      }
    }

    .search-bar {
      flex: 1;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 20px;
      padding: 6px 6px 6px 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

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
      }

      .search-btn {
        background: #F42E45;
        /* 天猫红色 */
        color: #fff;
        padding: 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
      }
    }
  }
}

/* ================= 2. 分类图标 ================= */
.category-box {
  margin: -12px 10px 10px 10px;
  /* 向上覆盖 Banner */
  padding: 0 0px;
  background: #fff;
  border-radius: 12px 12px 0 0;
  position: relative;
  z-index: 2;
}

.category-grid {
  /* 核心修改：改为 4 列 */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 0;
  padding: 16px 0;

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #f5f6fa;
      margin-bottom: 4px;
      object-fit: cover;
    }

    .cat-name {
      font-size: 12px;
      color: #333;font-weight: 600;
    }
  }
}

/* ================= 3. 超级补贴 ================= */
.subsidy-row {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px;
}

.subsidy-left-box {
  flex: 2.5;
  background: #fff;
  border-radius: 12px;
  padding: 12px;

  .subsidy-header {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    margin-bottom: 10px;

    .main-title {
      font-size: 15px;
      font-weight: bold;
      color: #333;
    }

    .badge {
      font-size: 9px;
      color: #fff;
      background: #ff4d30;
      padding: 0px 4px;
      border-radius: 10px 10px 10px 0;
    }
  }

  .subsidy-scroll {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    justify-content: space-between;

    &::-webkit-scrollbar {
      display: none;
    }

    .subsidy-item {
      flex: 0 0 60px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .subsidy-img {
        width: 50px;
        height: 50px;
        background: #f5f6fa;
        border-radius: 8px;
      }

      .subsidy-name {
        font-size: 10px;
        color: #333;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }

      .subsidy-price {
        color: #d32f2f;

        .symbol {
          font-size: 10px;font-weight: bold;
        }

        .price {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}

.new-arrival-box {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .new-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }

  .new-desc {
    font-size: 10px;
    color: #999;
    margin-bottom: 8px;
  }

  .new-img {
    width: 60px;
    height: 60px;
    background: #f5f6fa;
    border-radius: 8px;
  }
}

/* ================= 4. 切换 Tabs ================= */
/* ================= 4. 切换 Tabs (文字宽度自适应版) ================= */
.tab-header-row {
  display: flex;
  justify-content: center;
  /* 整体居中 */
  gap: 40px;
  /* Tab之间的间距 */
  padding: 0 10px 12px;
  overflow-x: auto;

  .tab-btn {
    /* 核心修改：使用 inline-block 让容器宽度自动收缩到文字的长度 */
    display: inline-block;
    font-size: 14px;
    color: #3D3D3D;
    // padding: 4px 0 8px 0; /* 上左右0，只有下边距，为了让绿线贴在底下 */
    cursor: pointer;
    position: relative;

    &.active {
      color: #000000;
      font-weight: bold;

      /* 使用 border-bottom，天生宽度和文字一样宽 */
      border-bottom: 3px solid #00c46d;
    }
  }
}

/* ================= 5. 商品流 ================= */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 10px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 2px;

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .goods-info {
      padding: 8px 12px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .goods-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 8px;

      .tag {
        font-size: 10px;
        color: #ff4d30;
        background: #fff0f0;
        padding: 1px 4px;
        border-radius: 4px;
      }
    }

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      color: #d32f2f;

      .symbol {
        font-size: 12px;font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .add-cart {
      width: 20px;
      height: 20px;
      background: #ff4d30;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;font-weight: bold;
    }
  }
}

.bottom-safe {
  height: 60px;
}

/* ================= 6. TabBar ================= */
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
      color: #00c46d;
      font-weight: bold;
    }
  }
}
</style>