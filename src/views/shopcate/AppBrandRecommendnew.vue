<template>
  <div class="brand-recommend-page">
    <!-- 顶部 Banner -->
    <div class="top-area-wrapper">
      <div class="top-banner-area">
        <img class="banner-img" :src="bannerImg" alt="品牌Banner" />
      </div>
    </div>

    <!-- 品牌横向滑动 -->
    <div class="brand-carousel-wrapper">
      <div class="carousel-scroll-box" ref="scrollContainer">
        <div class="brand-card" v-for="(brand, index) in brandList" :key="index"
          :class="{ active: activeBrandIndex === index }" @click="switchBrand(index)">
          <img v-if="brand.img" class="brand-icon" :src="brand.img" alt="" />
          <div v-else class="brand-icon brand-icon--placeholder">{{ (brand.name || '').slice(0, 2) }}</div>
        </div>
      </div>

      <div class="indicators" v-if="brandList.length">
        <span class="dot" v-for="(brand, index) in brandList" :key="index"
          :class="{ active: activeBrandIndex === index }" @click="switchBrand(index)"></span>
      </div>
    </div>

    <!-- 商品瀑布流 -->
    <div class="goods-section">
      <div class="goods-grid">
        <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
          <img class="goods-img" :src="item.img" alt="" />
          <div class="goods-info">
            <div class="goods-name">{{ item.title || item.name }}</div>
            <span class="platform-tag" v-if="getPlatformName(item.platform)">
              {{ getPlatformName(item.platform) }}
            </span>
            <div class="goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price || item.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !goodsList.length && finished" class="empty-tip">暂无商品</div>
       <div v-if="loading" class="loading-tip">加载中...</div>
      <div v-if="finished && goodsList.length" class="finished-tip">已加载全部</div>

      <!-- 滚动加载哨兵 -->
      <div ref="loadMoreSentinel" class="load-more-sentinel"></div>



    </div>
  </div>
</template>

<script>
import { channelDetail, productList } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'

export default {
  name: "BrandRecommend",
  data() {
    return {  observer: null,        // ← 新增
    scrollHandler: null,    // ← 新增（降级用）
      activeBrandIndex: 0,
      brandList: [],
      goodsList: [],
      page: 1,
      limit: 10,
      reqFlag: 0,
      loading: false,
      finished: false,
      bannerImg: require('../../assets/lh/cate/jd/b6.png')
    }
  },
  computed: {
    currentGoodsList() {
      return this.goodsList;
    }
  },
  methods: {
    getPlatformName,

    fetchBrandList() {
  const brandId = this.$route.query.brand_id;

  return channelDetail({ id: this.$route.query.channel_id || 3 }).then(res => {
    if (res.code !== 200) return;

    const modules = res.data?.modules || [];

    // ✅ 顶部 Banner：取 type='banner' 模块的 banner_img，没则保留本地兜底
    const bannerModule = modules.find(m => m.type === 'banner');
    if (bannerModule?.banner_img) {
      this.bannerImg = bannerModule.banner_img;
    }

    // 品牌列表
    const brandModule = modules.find(m => m.type === 'brand');
    this.brandList = brandModule?.items || [];
// ✅ 顶部 Banner 取 brand 模块的 banner_img，没则保留本地兜底
if (brandModule?.banner_img) {
  this.bannerImg = brandModule.banner_img;
}
    const idx = this.brandList.findIndex(b => String(b.id) === String(brandId));
    this.activeBrandIndex = idx > -1 ? idx : 0;
  });
},
     fetchGoods() {
  if (this.loading || this.finished) return;
  const brand = this.brandList[this.activeBrandIndex];
  if (!brand) return;

  this.loading = true;
  const flag = this.reqFlag;

  productList({
    brand_id: brand.id,
    page: this.page,
    limit: this.limit,
    sort: 'px',
    order: 'desc'
  }).then(res => {
    if (flag !== this.reqFlag) return;
    if (res.code !== 200) return;

    const data = res.data || {};
    const list = data.data || data.list || [];
    this.goodsList = this.goodsList.concat(list);

    // 三层兜底：last_page → total → 本页数量 < limit
    const current = Number(data.current_page ?? data.page ?? this.page);
    const last = Number(data.last_page ?? data.total_page ?? 0);
    const total = Number(data.total ?? 0);

    let isEnd = false;
    if (last > 0) {
      isEnd = current >= last;
    } else if (total > 0) {
      isEnd = this.goodsList.length >= total;
    } else {
      isEnd = list.length < this.limit;
    }

    this.finished = isEnd;
    if (!isEnd) this.page = current + 1;
  }).catch(() => {
    // 失败不置 finished，允许重试
  }).finally(() => {
    if (flag === this.reqFlag) this.loading = false;
  });
},

    switchBrand(index) {
      if (this.activeBrandIndex === index) return;
      this.activeBrandIndex = index;
      this.resetAndLoad();
    },

    resetAndLoad() {
  this.page = 1;
  this.goodsList = [];
  this.finished = false;
  this.loading = false;
  this.reqFlag++;
  this.fetchGoods();
  if (this.observer) {
    this.$nextTick(() => {
      if (this.$refs.loadMoreSentinel) {
        this.observer.observe(this.$refs.loadMoreSentinel);
      }
    });
  }
},

    goToDetail(item) {
      this.$goDetail(item);
    },

    goBack() {
      this.$router.go(-1);
    },

     initObserver() {
  // 不支持 IntersectionObserver 时降级到 window scroll
  if (!('IntersectionObserver' in window)) {
    this.scrollHandler = () => {
      const scrollTop = window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop;
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        this.fetchGoods();
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    return;
  }

  this.observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) this.fetchGoods();
  }, { rootMargin: '200px 0px' });

  this.$nextTick(() => {
    if (this.$refs.loadMoreSentinel) {
      this.observer.observe(this.$refs.loadMoreSentinel);
    }
  });
}
  },beforeDestroy() {
  if (this.observer) {
    this.observer.disconnect();
    this.observer = null;
  }
  if (this.scrollHandler) {
    window.removeEventListener('scroll', this.scrollHandler);
    this.scrollHandler = null;
  }
},

   mounted() {
  this.fetchBrandList().then(() => {
    this.fetchGoods();
    this.initObserver();
  });
}
}
</script>

<style scoped lang="less">
.load-more-sentinel {
  height: 1px;
  width: 100%;
}
.platform-tag {
  display: inline-block;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 2px;
  margin-bottom: 6px;
}

.brand-recommend-page {
  background: #A6C0D2;
  min-height: 100vh;
  padding-bottom: 30px;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: transparent;
  color: #fff;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 24px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

/* ================= 2. 顶部 Banner ================= */
.top-area-wrapper {
  position: relative;
}

.top-banner-area {
  width: 100%;

  .banner-img {
    width: 100%;
    // height: 380px;
    object-fit: cover;
    background: #f0f0f0;
    display: block;
  }
}

/* ================= 3. 品牌横向无限滑动 ================= */
.brand-carousel-wrapper {
  margin-top: -20px;
  padding: 0 10px 10px 10px;
  position: relative;
  z-index: 2;

  .carousel-scroll-box {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 8px 4px;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }

    .brand-card {
      flex: 0 0 80px;
      height: 80px;
       padding: 0 2px;
      background: #ffffff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
      border: 1px solid #ffffff;
      scroll-snap-align: start;

      .brand-icon {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        object-fit: contain;
      }

      &.active {
        background: #ffffff;
        border: 1px solid #ffffff;
        transform: scale(1.1);
      }
    }
  }

  .brand-icon--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    font-size: 16px;
    color: #666;
    background: #f5f6fa;
    border-radius: 10px;
  }

  .indicators {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 10px;

    .dot {
      width: 12px;
      height: 5px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      transition: all 0.3s;
      cursor: pointer;

      &.active {
        background: linear-gradient(to right, #006DEF, #5A9DCB);
        width: 20px;
      }
    }
  }
}

/* ================= 4. 双列商品流 ================= */
.goods-section {
  padding: 10px 10px 60px 10px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

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
      padding: 10px 10px 5px 10px;
    }

    .goods-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
    }

    .goods-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 8px;

      .tag {
        font-size: 10px;
        color: #ed2e33;
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
      color: #ed2e33;

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .add-cart-btn {
      font-weight: bold;
      width: 20px;
      height: 20px;
      background: #ed2e33;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
    }
  }
}

/* ================= 5. 空态 / 加载态 ================= */
.empty-tip,
.finished-tip {
  text-align: center;
  color: #fff;
  font-size: 14px;
  padding: 20px 0;
  opacity: 0.8;
}

.loading-tip {
  text-align: center;
  color: #fff;
  font-size: 13px;
  padding: 12px 0;
  opacity: 0.7;
}

.bottom-safe {
  height: 20px;
}
</style>