<template>
  <div class="tmall-page">
    <!-- 1. 顶部大图 + 悬浮搜索 -->
    <div class="top-wrapper">
      <img class="top-banner-img" :src="bannerImg || defaultBanner" alt="Banner" />

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

    <!-- 2. 分类图标 -->
    <div class="category-box">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in categoryList" :key="index" @click="goToCategoryWithId(item)">
          <img class="cat-icon" :src="item.img || defaultImg" alt="" />
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
        <img class="new-img" :src="(newList[0] && newList[0].img) || defaultImg" alt="" @click="goToDetail(newList[0])" />
      </div>
    </div>

    <!-- 4. 四个切换 Tab -->
    <div class="tab-header-row">
      <div class="tab-btn" :class="{ active: currentTab === 0 }" @click="changeTab(0)">猜你喜欢</div>
      <div class="tab-btn" :class="{ active: currentTab === 1 }" @click="changeTab(1)">热门推荐</div>
      <div class="tab-btn" :class="{ active: currentTab === 2 }" @click="changeTab(2)">热销榜</div>
      <div class="tab-btn" :class="{ active: currentTab === 3 }" @click="changeTab(3)">新品</div>
    </div>

    <!-- 5. 底部商品瀑布流 -->
    <div class="goods-grid" v-if="currentGoodsList.length > 0">
      <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img || defaultImg" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
              <span class="market-price" v-if="item.sell_price < item.market_price">¥{{ item.market_price }}</span>
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
import { channelDetail } from "@/api/lhjdtm";

export default {
  name: "TmallSupermarket",
  data() {
    return {
      platform: 2,
      searchKeyword: '',
      currentTab: 0,
      loading: false,

      defaultImg: require('../../assets/lh/730.png'),
      defaultBanner: require('../../assets/lh/tm/b1.png'),

      bannerImg: '',
      baners: '',

      categoryList: [],
      recommendList: [],
      newList: [],
      tabList: [],
    }
  },
  computed: {
    currentGoodsList() {
      if (this.tabList.length === 0) return [];
      const tab = this.tabList[this.currentTab];
      return (tab && tab.items) || [];
    }
  },
  methods: {
    channelDetailIndex() {
      channelDetail({ id: 16 }).then(res => {
        if (res.code == 200) {
          const data = res.data || {};

          if (data.banner && data.banner.length > 0) {
            this.bannerImg = data.banner[0].img;
            this.baners = data.banner[0].img;
          }

          if (data.nav && data.nav.length > 0) {
            this.categoryList = data.nav.map((item, index) => ({
              id: item.cate_id || item.id || index,
              img: item.img || this.defaultImg,
              title: item.title,
              link: item.link
            }));
          }

          if (data.sections && data.sections.length > 0) {
            const sections = data.sections;

            // [0] 超级补贴
            if (sections[0] && sections[0].items) {
              this.recommendList = sections[0].items.slice(0, 3);
            }

            // [1] 独家上新
            if (sections[1] && sections[1].items) {
              this.newList = sections[1].items;
            }

            // tabs 区块
            const tabSection = sections.find(s => s.type === 'tabs');
            if (tabSection && tabSection.tabs && tabSection.tabs.length > 0) {
              this.tabList = tabSection.tabs;
              this.currentTab = 0;
            }
          }
        }
      })
    },

    formatSaleNum(num) {
      if (num >= 10000) return (num / 10000).toFixed(1) + '万';
      return num;
    },

    handleSearch() {
      if (this.searchKeyword.trim()) {
        console.log('搜索:', this.searchKeyword);
      }
    },

    changeTab(index) {
      this.currentTab = index;
    },

    // goToCategoryWithId(item) {
    //   this.$router.push({
    //     path: '/TmallCategory',
    //     query: { categoryId: item.id, categoryTitle: item.title }
    //   });
    // },
 goToCategoryWithId(item) {
      this.$router.push({
        path: '/productList',
        query: {
          keyword: item.title,
          platform: 2,
         
          t: Date.now()
        }
      });
    },

    goToSuperValue() {
      this.$router.push('/TmallTodaySuperLow');
    },

    goToDetail(item) {
      if (!item) return;
      this.$goDetail(item);
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    goBack() {
      this.$router.go(-1);
    },

    TmallExclusiveNew() {
      this.$router.push('/TmallExclusiveNew');
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
  activated() {
    this.channelDetailIndex();
  },
  mounted() {
    this.channelDetailIndex();
  }
}
</script>

<style scoped lang="less">
.goods-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.market-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  margin-left: 6px;
  font-weight: normal;
}

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
    padding-top: 49px;
  }

  .search-overlay {
    background-color: #fd0046;
    position: absolute;
    top: 0;
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
  padding: 0;
  background: #fff;
  border-radius: 12px 12px 0 0;
  position: relative;
  z-index: 2;
}

.category-grid {
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
      color: #333;
      font-weight: 600;
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
        object-fit: cover;
      }

      .subsidy-name {
        font-size: 10px;
        color: #333;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60px;
      }

      .subsidy-price {
        color: #d32f2f;

        .symbol {
          font-size: 10px;
          font-weight: bold;
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
    object-fit: cover;
  }
}

/* ================= 4. 切换 Tabs ================= */
.tab-header-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 10px 12px;
  overflow-x: auto;

  .tab-btn {
    display: inline-block;
    font-size: 14px;
    color: #3D3D3D;
    cursor: pointer;
    position: relative;

    &.active {
      color: #000000;
      font-weight: bold;
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
  -webkit-box-orient: vertical;
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
        font-size: 12px;
        font-weight: bold;
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
      font-size: 14px;
      font-weight: bold;
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

    .tab-text.active {
      color: #46C800;
      font-weight: bold;
    }
  }
}
</style>