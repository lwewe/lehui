<template>
  <div class="flower-zone-page">
    <!-- 1. 顶部 Banner -->
    <div class="top-banner-area">
      <div style="padding: 10px;">
        <img class="banner-img" :src="bannerImg" alt="鲜花Banner" @click="handleBannerClick" />
      </div>
    </div>

    <!-- 2. 中间左右滚动的图标分类 -->
    <div class="scroll-category-container">
      <div class="scroll-wrapper">
        <div class="scroll-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
          <img class="scroll-icon" :src="item.img" alt="" />
          <div class="scroll-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 3. 鲜花产品瀑布流 -->
    <div class="goods-grid">
      <div class="goods-item" v-for="(item, index) in flowerList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>

          <!-- 平台标签 -->
          <span class="platform-tag" v-if="getPlatformName(item.platform)">
            {{ getPlatformName(item.platform) }}
          </span>

          <!-- 标签（如：京东直供、包邮） -->
          <div class="goods-tags" v-if="item.tags && item.tags.length">
            <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
          </div>

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
import { channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'

export default {
  name: "FlowerZone",
  data() {
    return {
      bannerImg: '',
      navList: [],
      flowerList: [],
      loading: false
    }
  },
  methods: {
    getPlatformName,

   async fetchHomeData() {
  try {
    const res = await channelDetail({ id: 12 });
    if (res.code === 200 && res.data) {
      const data = res.data;

      if (data.banner && data.banner.length) {
        this.bannerImg = data.banner[0].img;
      }

      this.navList = (data.nav || []).map((item, index) => ({
        id: index,
        title: item.title,
        img: item.img || '',
        products: item.products || []
      }));

      // 默认展示所有分类下的商品，不跳转
      const allProducts = this.navList.flatMap(n => n.products || []);
      this.flowerList = allProducts.map(p => ({
        id: p.product_id || p.id,
        local_id: p.id,
        title: p.title,
        img: p.img,
        sell_price: p.sell_price,
        market_price: p.market_price || '',
        platform: 5
      }));
    }
  } catch (err) {
    console.error('channelDetail 失败:', err);
  }
},

  handleNavClick(item) {
  this.$router.push({
    path: '/productList',
    query: {
      keyword: item.title,
      platform: 5,
      t: Date.now()
    }
  });
},
    // handleNavClick(item) {
    //   const products = item.id === 0
    //     ? (this.navList || []).flatMap(n => n.products || [])
    //     : (item.products || []);

    //   this.flowerList = products.map(p => ({
    //     id: p.product_id || p.id,     // ⚠ 优先用三方 product_id
    //     local_id: p.id,
    //     title: p.title,
    //     img: p.img,
    //     sell_price: p.sell_price,
    //     market_price: p.market_price || '',
    //     platform: 5
    //   }));
    // },

    goToDetail(item) {
      this.$router.push({
        path: '/FlowerDetail',
        query: { product_id: item.id }
      });
    },

    handleBannerClick() {
      console.log('点击Banner');
    }
  },
  // mounted() {
  //   this.fetchHomeData();
  // },
  activated() {
    // 每次进入都重新请求
    this.fetchHomeData();
  },
}
</script>
<style scoped lang="less">
.flower-zone-page {
  background: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 复用之前的全局样式，保证风格一致 */
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



/* ================= 1. Banner ================= */
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

/* ================= 2. 横向滚动图标 ================= */
.scroll-category-container {
  background: #fff;
  margin: -12px 10px 10px 10px;
  border-radius: 12px;
  padding: 12px 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .scroll-wrapper {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 0 10px;
    /* 隐藏滚动条 */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;

    /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }

    .scroll-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 72px;
      margin-right: 8px;
      cursor: pointer;

      .scroll-icon {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #f5f6fa;
        margin-bottom: 6px;
        object-fit: cover;
      }

      .scroll-name {
        font-size: 12px;
        color: #333;
        font-weight: 600;
        text-align: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

/* ================= 3. 商品瀑布流 ================= */
.goods-grid {
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
    cursor: pointer;

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
      margin-bottom: 4px;
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