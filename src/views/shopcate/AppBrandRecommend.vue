<template>
  <div class="brand-recommend-page">
    <!-- 1. 顶部导航 -->

    <!-- 2. 顶部 Banner -->
    <div class="top-area-wrapper">
      <div class="top-banner-area">
        <img class="banner-img" src="../../assets/lh/cate/jd/b6.png" alt="品牌Banner" />
      </div>
    </div>

    <!-- 3. 原生左右滑动品牌区 -->
    <div class="brand-carousel-wrapper">
      <!-- 核心滚动容器 -->
      <div class="carousel-scroll-box" ref="scrollContainer">
        <div class="brand-card" v-for="(brand, index) in brandList" :key="index"
          :class="{ active: activeBrandIndex === index }" @click="switchBrand(index)">
          <img class="brand-icon" :src="brand.img" alt="" />
        </div>
      </div>

      <!-- 底部指示点 -->
      <div class="indicators">
        <span class="dot" v-for="(brand, index) in brandList" :key="index"
          :class="{ active: activeBrandIndex === index }" @click="switchBrand(index)"></span>
      </div>
    </div>

    <!-- 4. 商品瀑布流 -->
    <div class="goods-section">
      <div class="goods-grid">
        <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index">
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
              <!-- <div class="add-cart-btn" @click.stop="addToCart(item)">+</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import { productbrands, channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "BrandRecommend",
  data() {
    return {
      activeBrandIndex: 0,
      brandList: [],       // 品牌 tab 列表（从路由/接口来）
      goodsList: [],       // 当前品牌商品
      page: 1,
      limit: 10,reqFlag: 0,
      loading: false,
      finished: false,
      bannerImg: require('../../assets/lh/cate/jd/b6.png')
    }
  },
  computed: {
    currentGoodsList() {
      return this.goodsList
    }
  },
  methods: {
    fetchBrandList() {
      const brandId = this.$route.query.brand_id

      return channelDetail({ id: this.$route.query.channel_id || 4 }).then(res => {
        if (res.code === 200) {
          const brandSections = (res.data.sections || []).filter(s => s.type === 'brand')

          // 先在所有 brand section 里找哪个包含当前 brand_id
          let targetSection = brandSections.find(sec =>
            (sec.items || []).some(it => String(it.id) === String(brandId))
          )

          // 找不到就取最后一个（通常最后一个才是当前频道真正要用的那组）
          if (!targetSection) {
            targetSection = brandSections[brandSections.length - 1]
          }

          this.brandList = targetSection?.items || []

          const idx = this.brandList.findIndex(b => String(b.id) === String(brandId))
          this.activeBrandIndex = idx > -1 ? idx : 0
        }
      })
    },
    getPlatformName,
    goBack() {
      this.$router.go(-1);
    },

    // 切换品牌
    switchBrand(index) {
      if (this.activeBrandIndex === index) return
      this.activeBrandIndex = index
      this.resetAndLoad()
    },

    // 重置分页并重新加载
    resetAndLoad() {
        this.page = 1
  this.goodsList = []
  this.finished = false
  this.loading = false
  this.reqFlag++
  this.fetchGoods()
    },

    // 请求品牌下商品
    fetchGoods() {
      if (this.loading || this.finished) return
      this.loading = true
      const flag = this.reqFlag

      const brand = this.brandList[this.activeBrandIndex]
      if (!brand) {
        this.loading = false
        return
      }

      productbrands({
        brand_id: brand.id,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (flag !== this.reqFlag) return
        if (res.code === 200) {
          const list = res.data?.data || []
          this.goodsList = this.goodsList.concat(list)

          const current = res.data?.current_page || this.page
          const last = res.data?.last_page || 1
          if (current >= last) {
            this.finished = true
          } else {
            this.page = current + 1
          }
        }
      }).finally(() => {
        if (flag === this.reqFlag) this.loading = false
      })
    },

    // 初始化品牌列表：优先用路由传参，其次给默认
    initBrandList() {
      const { brand_id, brand_name } = this.$route.query
      if (brand_id) {
        // 如果上个页面只传了单个品牌，就先构造一个
        this.brandList = [{
          id: Number(brand_id),
          name: brand_name || '',
          icon: require('../../assets/lh/qf.png') // 兜底图，实际可从接口补
        }]
      } else {
        // 没有传参时的兜底，可写几个默认品牌
        this.brandList = []
      }
      this.activeBrandIndex = 0
    },

    // 滚动加载（可选）
    onScroll(e) {
      const el = e.target
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
        this.fetchGoods()
      }
    }
  },
  mounted() {
    this.fetchBrandList().then(() => {
      this.fetchGoods()
    })
    // this.initBrandList()
    // this.fetchGoods()
  }
}
</script>
<style scoped lang="less">
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
  /* 整体浅蓝色背景 */
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
  // padding: 0px 10px;
  // margin-top: -10px;

  .banner-img {
    width: 100%;
    height: 380px;
    object-fit: cover;
    // border-radius: 0 0 12px 12px;
    background: #f0f0f0;
    display: block;
  }
}

/* ================= 3. 品牌横向无限滑动 ================= */
.brand-carousel-wrapper {
  margin-top: -20px;
  /* 略微叠在 Banner 下方 */
  padding: 0 10px 10px 10px;
  position: relative;
  z-index: 2;

  .carousel-scroll-box {
    display: flex;
    overflow-x: auto;
    /* 开启横向滚动 */
    gap: 10px;
    padding: 8px 4px;
    -webkit-overflow-scrolling: touch;
    /* 手机端顺滑 */
    scroll-snap-type: x mandatory;
    /* 核心：让每次滑动后自动对齐到卡片，手感更好 */

    &::-webkit-scrollbar {
      display: none;
    }

    .brand-card {
      flex: 0 0 80px;
      height: 80px;
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
      /* 核心：卡片也参与对齐 */

      .brand-icon {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        object-fit: contain;
      }

      &.active {
        background: #ffffff;
        border: 1px solid #ffffff;
        // box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
    }
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
        // background: #ffffff;
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
      /* ✅ 补上这行 */
      -webkit-line-clamp: 2;
      /* 最多两行 */
      overflow: hidden;
      /* ✅ 需要 */
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

.bottom-safe {
  height: 20px;
}
</style>