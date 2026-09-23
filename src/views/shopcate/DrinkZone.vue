<template>
  <div class="drink-zone-page">
    <!-- 1. 顶部导航 -->

    <NProgress v-if="loading" />
    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img"
        :src="channelData.banner && channelData.banner[0] ? channelData.banner[0].img : require('../../assets/lh/cate/jd/b22.png')"
        alt="饮品Banner" />
      <!-- @click="handleBannerClick" -->
    </div>

    <!-- 3. 分类图标 (两排，每排5个) -->
    <div class="category-container">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in navList" :key="item.title || index" @click="handleNavClick(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 4. 组合营销块 (左边大图，右边两块上下排列) -->
    <!-- 4. 组合营销块 (左边大图，右边两块上下排列) -->
    <div class="promo-block">
      <!-- 左侧：蓝色饮料大图 -->
      <div class="promo-left">
        <img class="left-img" :src="bsyx" alt="饮料大图" @click="DrinkTabZone()" />
      </div>
      <!-- 右侧：两块上下排列 (带按钮和胶囊) -->
      <div class="promo-right">
        <!-- 块1：鲜冷牛奶 -->
        <div class="right-item blue-bg">
          <div class="right-header" @click="DrinkFreshMilkPage(8, 0, 0)">
            <span class="main">鲜冷牛奶</span>
            <span class="view-btn">GO</span>
          </div>
          <div class="right-imgs">
            <div class="right-good" v-for="(item, index) in superTop1" :key="index" @click="goToDetail(item)">
              <img :src="item.img" alt="" />
              <div class="capsule-btn blue">{{ item.title }}</div>
            </div>

          </div>
        </div>

        <!-- 块2：超值爆款榜 -->
        <div class="right-item pink-bg">
          <div class="right-header" @click="DrinkHotRankList()">
            <span class="main">超值爆款榜</span>
            <span class="view-btn" style="background-color: #FF7A7A;">GO</span>
          </div>
          <div class="right-imgs">
            <div class="right-good" v-for="(item, index) in superTop" :key="index" @click="goToDetail(item)">
              <img :src="item.img" alt="" />
              <div class="capsule-btn pink">{{ item.title }}</div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 5. 超划算 (带有蓝色标题头) -->
    <div class="grid-section">
      <!-- 蓝色标题条 -->
      <div class="section-header-bar">
        <div class="header-content">
          <span class="title">超划算</span>
          <span class="divider">|</span>
          <span class="sub">低价好物</span>
        </div>
      </div>

      <!-- 商品网格 (3列 x N行) -->
      <div class="goods-grid">
        <div class="goods-item" v-for="(item, index) in superList" :key="index" @click="goToDetail(item)">
          <img class="goods-img" :src="item.img" alt="" />
          <div class="goods-name">{{ item.title }}</div>
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

    <!-- 6. 更多好物推荐 (带有蓝色标题头) -->
    <div class="grid-section">
      <!-- 蓝色标题条 -->
      <div class="section-header-bar">
        <div class="header-content">
          <span class="title">更多好物推荐</span>
          <span class="divider">|</span>
          <span class="sub">优选好物</span>
        </div>
      </div>

      <!-- 商品网格 (3列 x N行) -->
      <div class="goods-grid">
        <div class="goods-item" v-for="(item, index) in moreList" :key="index" @click="goToDetail(item)">
          <img class="goods-img" :src="item.img" alt="" />
          <div class="goods-name">{{ item.title }}</div>
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

    <!-- <div class="bottom-safe"></div> -->
  </div>
</template>

<script>
import { channelDetail, productList } from "@/api/lhjdtm";

export default {
  name: "DrinkZone",
  data() {
    return {
      bsyx: '', loading: false,      // 新增pendingCount: 0,   // 正在进行的请求数
      pendingCount: 0,   // 正在进行的请求数
      // 两排 5 个分类图标
      channelData: {},  // 新增：频道详情数据
      navList: [],      // 修改：从接口获取
      // superList: [],    // 修改：从接口获取
      // moreList: [],     // 修改：从接口获取
      // 保留默认数据作为备用
      defaultCategoryList: [],

      // 超划算 3 列商品
      superList: [

      ],
      // 更多好物推荐 3 列商品
      moreList: [

      ],
      superTop: [],
      superTop1: []
    }
  },
  methods: {
    goToDetail(item) {
      this.$goDetail(item);
      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    channelDetailIndex() {
      this.pendingCount++;
      this.loading = true;

      channelDetail({ id: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {
            this.channelData = res.data
            this.navList = res.data.nav || []
            this.superTop1 = res.data.nav[0].children[0].sections[0].items.slice(0, 2) || []
            this.superTop = res.data.nav[1].children[0].sections[0].items.slice(0, 2) || []
            this.superList = res.data.sections[0].items || []
            this.moreList = res.data.sections[1].items || []
            this.bsyx = res.data.nav[2].children[0].img || []
          }
        })
        .finally(() => {
          this.pendingCount--;
          if (this.pendingCount <= 0) {
            this.pendingCount = 0;
            this.loading = false;
          }
        })
    },

    productListIndex() {
      this.pendingCount++;
      this.loading = true;

      productList({ cate_id: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {
            // 你的商品处理逻辑
          }
        })
        .finally(() => {
          this.pendingCount--;
          if (this.pendingCount <= 0) {
            this.pendingCount = 0;
            this.loading = false;
          }
        })
    },
    // channelDetailIndex() {
    //   channelDetail({ id: this.$route.query.id }).then(res => {
    //     console.log('频道详情:', res);
    //     if (res.code == 200) {
    //       this.channelData = res.data
    //       // 处理导航分类数据
    //       this.navList = res.data.nav || []
    //       this.superTop1 = res.data.nav[0].children[0].sections[0].items.slice(0, 2) || []
    //       this.superTop = res.data.nav[1].children[0].sections[0].items.slice(0, 2) || []
    //       // 处理轮播图
    //       this.superList = res.data.sections[0].items || [];
    //       this.moreList = res.data.sections[1].items || [];
    //       this.bsyx = res.data.nav[2].children[0].img || []
    //     }
    //   })
    // },
    // productListIndex() {
    //   productList({ cate_id: this.$route.query.id }).then(res => {
    //     console.log('商品列表:', res);
    //     if (res.code == 200) {
    //       // 解析商品数据
    //       let productData = []
    //       if (res.data && Array.isArray(res.data)) {
    //         productData = res.data
    //       } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
    //         productData = res.data.data
    //       }

    //       // 分配商品到超划算和更多推荐
    //       // this.superList = productData.slice(0, 6)
    //       // this.moreList = productData.slice(6, 12)
    //     }
    //   })
    // },
    // 新增方法
    getFirstTwoProducts(nav) {
      if (nav && nav.products && Array.isArray(nav.products)) {
        return nav.products.slice(0, 2)
      }
      return []
    },

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
    handleBannerClick() {
      if (this.channelData.banner && this.channelData.banner[0] && this.channelData.banner[0].link) {
        window.location.href = this.channelData.banner[0].link
      }
    },
    DrinkTabZone() {
      this.$router.push({ path: '/DrinkTabZone', query: { id: this.$route.query.id } });
    },
    DrinkHotRankList() {
      this.$router.push({ path: '/DrinkHotRankList', query: { id: this.$route.query.id } }
      );
    },
    DrinkFreshMilkPage(id, nav, index) {
      this.$router.push({ path: '/DrinkFreshMilkPage', query: { id: id, nav: nav, index: index } });
    },
    goBack() {
      this.$router.go(-1);
    }
  }, mounted() {
    this.productListIndex();
    this.channelDetailIndex()
  }
}
</script>

<style scoped lang="less">
.drink-zone-page {
  background: #F4F4F4;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #fff;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    width: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  margin-bottom: 10px;
  padding: 10px;

  .banner-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 12px;
    background: #f0f0f0;
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
      font-weight: 600;
      color: #333;
    }
  }
}

/* ================= 4. 组合营销块 ================= */
/* ================= 4. 组合营销块 (左侧大图 + 右侧双层卡片) ================= */
.promo-block {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px 10px;

  .promo-left {
    flex: 1.2;
    border-radius: 12px;
    overflow: hidden;
    background: #f0f0f0;

    .left-img {
      width: 100%;
      height: 249px;
      object-fit: cover;
      display: block;
    }
  }

  .promo-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .right-item {
      flex: 1;
      border-radius: 12px;
      padding: 8px 8px 0px 8px;
      display: flex;
      flex-direction: column;

      /* 不同颜色背景 */
      &.blue-bg {
        background: #e2effc;
      }

      &.pink-bg {
        background: #f8e4e4;
      }

      .right-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .main {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .view-btn {
          font-size: 10px;
          color: #fff;
          background: #93d2f3;
          /* 浅蓝色按钮背景 */
          padding: 2px 2px;
          line-height: 1;
          border-radius: 10px;
          cursor: pointer;

          &.pink-bg {
            background: #FFB9B9;
          }

          /* 粉色时会变色，不过这里用JS控制更方便 */
        }
      }

      .right-imgs {
        display: flex;
        gap: 10px;

        .right-good {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;

          img {
            width: 50px;
            height: 50px;
            aspect-ratio: 1/1;
            background: #fff;
            border-radius: 6px;
            object-fit: contain;
            margin-bottom: 4px;
          }

          .capsule-btn {
            font-size: 10px;
            color: #fff;
            padding: 1px 5px;
            border-radius: 10px;
            text-align: center;
            white-space: nowrap;
            cursor: pointer;
            max-width: 80px;
            /* 限制具体宽度 */
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;

            &.blue {
              background: #4498FF;
            }

            &.pink {
              background: #FF7A7A;
            }
          }
        }
      }
    }
  }
}

/* ================= 5. 蓝色标题条网格 ================= */
.grid-section {
  margin: 0 10px 12px 10px;

  border-radius: 12px;
  overflow: hidden;

  /* 蓝色标题条 */
  .section-header-bar {
    background: #44A7F6;
    padding: 12px 16px;

    .header-content {
      display: flex;
      align-items: center;
      color: #fff;

      .title {
        font-size: 16px;
        font-weight: bold;
      }

      .divider {
        font-size: 14px;
        margin: 0 8px;
        opacity: 0.6;
      }

      .sub {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  /* 3 列商品网格 */
  .goods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 10px 0;

    .goods-item {
      background-color: #fff;
      border-radius: 10px;
      padding: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .goods-img {
        width: 100%;
        border-radius: 10px 10px 0 0;
        aspect-ratio: 1/1;
        object-fit: cover;
        margin-bottom: 6px;
      }

      .goods-name {
        font-size: 12px;
        color: #333;
        padding: 0 10px;
        line-height: 1.4;
        height: 30px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
        text-align: left;
      }

      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-bottom: 6px;

        .price-box {
          color: #d32f2f;

          .symbol {
            font-size: 10px;
            padding-left: 10px;

            font-weight: bold;
          }

          .price {
            font-size: 14px;
            font-weight: bold;
          }
        }

        .add-btn {
          margin-right: 10px;
          width: 20px;
          height: 20px;
          background: #ed2e33;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          font-weight: bold;
        }
      }
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>