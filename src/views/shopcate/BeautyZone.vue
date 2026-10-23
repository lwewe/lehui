<template>
  <div class="beauty-zone-page">
    <!-- 1. 顶部导航 -->
    <NProgress v-if="loading" />

    <!-- 2. 顶部大 Banner (解锁超美丽) -->
    <div class="top-banner-area">
      <div style="padding: 10px;">
        <img class="banner-img" :src="bannerImg" alt="美妆Banner" @click="handleBannerClick" />

      </div>
    </div>

    <!-- 3. 两排 10 个分类图标 -->
    <div class="category-container">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 4. 左右双拼模块 (每周上新 + 美妆礼品) -->
    <!-- 4. 左右双拼模块 (每周上新 + 美妆礼品) -->
    <div class="split-block">
      <!-- 左侧：垂直长图 -->
      <div class="split-left">
        <img class="split-big-img" :src="sectionsImg1" @click="DrinkHotRankList(3, weeklyPx, 0)" alt="每周上新" />
      </div>
      <!-- 右侧：上下两张图 -->
      <div class="split-right">
        <div class="split-top">
          <img class="split-img" @click="DrinkFreshMilkPage(3, meizhuangPx, 0)" :src="sectionsImg2" alt="美妆礼品" />
        </div>
        <div class="split-bottom">
          <img class="split-img" @click="DrinkFreshMilkPage(3, xiangfenPx, 0)" :src="sectionsImg3" alt="香氛好物" />
        </div>
      </div>
    </div>

    <!-- 5. 品牌推荐 (两行四列的Logo) -->
    <div class="brand-section">
      <div class="section-header">
        <span class="title">品牌推荐</span>
      </div>
      <div class="brand-grid">
        <!-- <div class="brand-item" v-for="(item, index) in brandList" :key="index">
          <img class="brand-logo" :src="item.img" alt="" @click="AppBrandRecommend(item)" />
          <div class="brand-name">{{ item.name }}</div>
        </div> -->
        <div class="brand-item" v-for="(item, index) in brandList" :key="index" @click="AppBrandRecommend(item)">
          <img class="brand-logo" :src="item.img" alt="" />
          <div class="brand-name-text">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 6. 场景 Banner (今日防晒了没) -->
    <div class="scene-banner-area">
      <img class="scene-banner-img" src="../../assets//lh/cate/ls/b8.png" @click="JingzaoSuperValue()" alt="场景Banner" />
    </div>

    <!-- 7. 防晒专区 (3列横向滑动) -->
    <!-- 7. 防晒专区 (两行三列固定网格) -->
    <div class="sun-care-section">
      <div class="sun-grid-box">
        <div class="sun-item" v-for="(item, index) in sunCareList" :key="index" @click="goToDetail(item)">
          <img class="sun-img" :src="item.img" alt="" />
          <div class="sun-name">{{ item.title }}</div>
          <div class="sun-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
            <!-- <div class="add-btn">+</div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 8. 底部四个 Tab 切换 -->
    <div class="tabs-container">
      <div class="tab-btn" v-for="(tab, index) in tabList" :key="index" :class="{ active: activeTab === index }"
        @click="switchTab(index)">
        <div class="main">{{ tab.name }}</div>
        <div class="sub">{{ tab.sub }}</div>
      </div>
    </div>

    <!-- 9. 商品瀑布流 (双列) -->
    <div class="goods-grid">
      <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <span class="platform-tag" v-if="getPlatformName(item.platform)">
            {{ getPlatformName(item.platform) }}
          </span>
          <!-- <div class="goods-tags">
            <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
          </div> -->
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
            <div class="add-btn">+</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import { channelDetail, productList } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "BeautyZone",
  data() {
    return {
      activeTab: 0,
      loading: false,      // 新增
      // 分类图标
      channelData: { banner: [] },
      navList: [],
      tabList: [],
      tabGoodsList: [],  // 存储每个 tab 的商品数据
      sectionsImg1: '',
      sectionsImg2: '',
      sectionsImg3: '',
      sunCareList: [],
      tabCateIds: [],   // 每个 tab 的 cate_id
      // 品牌推荐
      brandList: [

      ],
      sceneBannerImg: '',   // ✅ 新增：场景 Banner 图
      weeklyPx: 0,          // ✅ 新增：每周上新跳转参数（用 module.px）
      meizhuangPx: 0,       // ✅ 新增：美妆 subpage 跳转参数
      xiangfenPx: 0,        // ✅ 新增：香氛 subpage 跳转参数
    }
  },

  computed: {
    currentGoodsList() {
      // 从接口数据中获取当前 tab 对应的商品
      return this.tabGoodsList[this.activeTab] || [];
    },
    bannerImg() {
      if (this.channelData && this.channelData.banner && this.channelData.banner.length > 0) {
        return this.channelData.banner[0]?.img || require('../../assets/lh/cate/ls/banner.png')
      }
      return require('../../assets/lh/cate/ls/banner.png')
    }
  },

  methods: {
    handleNavClick(item) {
      console.log('点击家电图标:', item)

      // 有 link 优先跳链接
      if (item.link) {
        window.location.href = item.link
        return
      }

      // ✅ 产品需求：把图标文字带入 ProductList 搜索框
      if (item.title) {
        this.$router.push({
          path: '/productList',
          query: { keyword: item.title }
        })
      }
    },
    getPlatformName,
    goToDetail(item) {
      this.$goDetail(item);
      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },

    fetchChannelData() {
      this.loading = true;

      channelDetail({ id: this.$route.query.id || 3 })
        .then(res => {
          if (res.code !== 200) return;

          this.channelData = res.data;
          const modules = res.data.modules || [];

          // 1. 顶部 Banner：type=banner，取 banner_img
          const bannerModule = modules.find(m => m.type === 'banner');
          if (bannerModule) {
            this.channelData.banner = [{
              img: bannerModule.banner_img || '',
              link: bannerModule.link || ''
            }];
          }

          // 2. 顶部分类图标：type=entry && list_type=icon
          const iconModule = modules.find(m => m.type === 'entry' && m.list_type === 'icon');
          this.navList = (iconModule?.items || []).slice(0, 10);

          // 3. 品牌推荐：type=brand
          const brandModule = modules.find(m => m.type === 'brand');
          this.brandList = (brandModule?.items || []).slice(0, 6);

          // 4. 每周上新（左侧大图）：type=grid 且 title 含"上新"，取 img
          const weeklyModule = modules.find(m => m.type === 'grid' && /上新/.test(m.title || ''));
          this.sectionsImg1 = weeklyModule?.img || '';
          this.weeklyPx = weeklyModule?.px || 0;

          // 5. 两个 subpage：按 title 区分美妆/香氛
          //    ⚠️ 右侧双拼是"入口"，取 subpage.img（入口图），不是 banner_img（头图）
          const subpages = modules.filter(m => m.type === 'subpage');
          const meizhuang = subpages.find(m => m.title === '美妆');
          const xiangfen = subpages.find(m => m.title === '香氛');
          this.sectionsImg2 = meizhuang?.img || '';
          this.sectionsImg3 = xiangfen?.img || '';
          this.meizhuangPx = meizhuang?.px || 0;
          this.xiangfenPx = xiangfen?.px || 0;

          // 6. 场景 Banner + 防晒专区：type=grid 且 title 含"防晒"
          const sunModule = modules.find(m => m.type === 'grid' && /防晒/.test(m.title || ''));
          if (sunModule) {
            this.sceneBannerImg = sunModule.img || '';
            this.sunCareList = (sunModule.items || []).slice(0, 6);
          }

          // 7. 底部 Tab + 瀑布流：list_type=tab
          const tabModule = modules.find(m => m.list_type === 'tab');
          if (tabModule && tabModule.items) {
            this.tabList = tabModule.items.map(item => ({
              name: item.title,
              sub: item.subtitle || ''
            }));
             this.tabCateIds = tabModule.items.map(item => item.cate_id || 0);
            this.tabGoodsList = tabModule.items.map(item => item.products || []);
            this.activeTab = 0;

             // 第一个 tab 没商品，先拉
  if (!this.tabGoodsList[0].length && this.tabCateIds[0]) {
    this.loadTabGoods(0);
  }

          }
        })
        .catch(err => console.error('获取数据失败:', err))
        .finally(() => { this.loading = false; });
    },
switchTab(index) {
  this.activeTab = index;
  // 没商品且没 cate_id 拉过，就拉一次
  if (!this.tabGoodsList[index].length && this.tabCateIds[index]) {
    this.loadTabGoods(index);
  }
},

loadTabGoods(index) {
  productList({ cate_id: this.tabCateIds[index], page: 1, limit: 10, sort: 'px', order: 'desc' })
    .then(res => {
      if (res.code === 200) {
        // Vue 2 用 $set 触发响应式
        this.$set(this.tabGoodsList, index, res.data?.data || []);
      }
    });
},
    // 商品点击事件
    handleGoodsClick(item) {
      console.log('点击商品:', item)
      // 根据商品类型跳转不同页面
      if (item.type === 1) {
        // 电子券类商品
        // this.$router.push({ path: '/GoodsDetail', query: { id: item.id } })
      } else if (item.type === 2) {
        // 实物商品
        // this.$router.push({ path: '/ProductDetail', query: { id: item.id } })
      }
    },

    handleBannerClick() {
      if (this.channelData?.banner?.[0]?.link) {
        window.location.href = this.channelData.banner[0].link
      }
    },

    JingzaoSuperValue() {
      this.$router.push('/JingzaoSuperValue');
    },

    AppBrandRecommend(item) {
      this.$router.push({
        path: '/AppBrandRecommend',
        query: {
          brand_id: item.id,
          brand_name: item.name,
          channel_id: this.$route.query.id || 3
        }
      });
    },

    DrinkHotRankList(id, nx, idx) {
      this.$router.push({ path: '/BeautyZoneNewList', query: { id: id, nav: nx, index: idx } });
    },

    DrinkFreshMilkPage(id, nx, idx) {
      this.$router.push({ path: '/DrinkFreshMilkPage', query: { id: id, nav: nx, index: idx } });
    },

    goBack() {
      this.$router.go(-1);
    }
  },
  activated() {
    this.fetchChannelData()
  },
  mounted() {
    // this.fetchChannelData()
  }
}
</script>

<style scoped lang="less">
.platform-tag {
  display: inline-block;
  width: max-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 2px;
  margin-bottom: 4px;
}

.beauty-zone-page {
  background: #f7f7f7;
  min-height: 100vh;

}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  width: 100%;


  .banner-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    background: #f0f0f0;
    margin-bottom: 10px;
  }
}

/* ================= 3. 分类图标 ================= */
.category-container {
  padding: 16px 0;
  background: #fff;
  margin: -12px 10px 10px 10px;
  border-radius: 12px;
  position: relative;
  z-index: 2;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 0;

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cat-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #f5f6fa;
      margin-bottom: 4px;
    }

    .cat-name {
      font-size: 12px;
      color: #333;
      font-weight: 600;
    }
  }
}

/* ================= 4. 左右双拼模块 ================= */
.split-block {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px 10px;

  .split-left {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;

    .split-big-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .split-right {
    flex: 1.5;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .split-top,
    .split-bottom {
      flex: 1;
      border-radius: 12px;
      overflow: hidden;

      .split-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
    }
  }
}

/* ================= 5. 品牌推荐 ================= */
.brand-name-text {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  line-height: 1.5;


  padding: 0 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.brand-section {
  margin: 0 10px 12px 10px;
  background: #f1f1f1;
  border-radius: 12px;
  padding: 12px;

  .section-header {
    margin-bottom: 12px;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .brand-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .brand-item {
      background: #ffffff;
      width: 100%;
      height: 104px;
      border-radius: 8px;
      // padding: 12px;
      text-align: center;
      height: 134px;

      .brand-logo {
        width: 100%;
        object-fit: cover;
        height: 110px;
        border-radius: 8px;

      }

      // .brand-name { font-size: 11px; color: #999; font-weight: 500; }
    }
  }
}

/* ================= 6. 场景 Banner ================= */
.scene-banner-area {
  padding: 0 10px 12px 10px;

  .scene-banner-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
  }
}

/* ================= 7. 防晒专区 ================= */
/* ================= 7. 防晒专区 (两行三列固定网格) ================= */
.sun-care-section {
  padding: 0 20px 12px 20px;
  position: relative;
  top: -40px;

  .sun-grid-box {
    /* 核心改变：使用 CSS Grid 强制 3 列 */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    /* 限制最多显示两行 (也就是 6 个商品) */
    grid-template-rows: repeat(2, auto);
    overflow: hidden;
    /* 超过两行的部分直接隐藏 */

    .sun-item {
      background: #fff;
      border-radius: 12px;
      padding: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

      .sun-img {
        width: 100%;
        // height: 80px;
        background: #f5f6fa;
        border-radius: 8px 8px 0 0;
        object-fit: cover;
        margin-bottom: 6px;
      }

      .sun-name {
        font-size: 12px;
        color: #333;
        margin-bottom: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 34px;
        padding: 0 10px;
        text-align: left;
        /* 固定文字高度防止错位 */
      }

      .sun-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .price-box {
        color: #d32f2f;
        padding-left: 10px;
        padding-bottom: 4px;

        .symbol {
          font-size: 10px;
          font-weight: bold;
        }

        .price {
          font-size: 14px;
          font-weight: bold;
        }
      }

      .add-btn {
        width: 18px;
        height: 18px;
        background: #ed2e33;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}

/* ================= 8. 底部 Tabs ================= */
.tabs-container {
  position: relative;
  top: -40px;
  display: flex;
  padding: 0 10px 12px 10px;
  gap: 12px;

  .tab-btn {
    flex: 1;
    // background: #fff;
    border-radius: 12px;
    padding: 0px 4px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

    .main {
      font-size: 14px;
      font-weight: bold;
      color: #666;
      display: block;
    }

    .sub {
      font-size: 10px;
      color: #555555;
      display: inline-block;
      padding: 1px 6px;
      border-radius: 10px;
      margin-top: 2px;
    }

    &.active {

      // background: #ffffff;
      .sub {
        color: #fff;
        background-color: #FF6F51;
      }

      .main {
        color: #000000;
      }
    }
  }
}

/* ================= 9. 商品瀑布流 ================= */
.goods-grid {
  position: relative;
  top: -40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 60px 16px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .goods-info {
      padding: 10px 10px 6px 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      -webkit-box-orient: vertical;
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

    .add-btn {
      width: 20px;
      height: 20px;
      background: #ed2e33;
      font-weight: bold;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>