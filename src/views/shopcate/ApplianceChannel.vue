<template>
  <div class="appliance-page">
<NProgress v-if="loading" />
    <!-- 2. 顶部大 Banner -->
    <div class="banner-area">
      <img class="banner-img" :src="bannerImg" alt="家电Banner" @click="handleBannerClick" />
    </div>

    <!-- 3. 10个分类图标 -->
    <div class="category-container">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>



    <!-- 4. 个护健康 (分为左右两部分) -->
    <div class="health-section">
      <!-- 左侧：浅蓝底双列商品卡片 -->
      <div class="health-left-card">
        <div class="health-header" @click="ApplianceRecommend(4, 1, 0)">
          <span class="title">个护健康</span>
          <span class="sub">｜个人护理要注意</span>
        </div>
        <div class="health-inner-grid">
          <div class="h-item" v-for="(item, index) in healthList" :key="index" @click="goToDetail(item)">
            <div class="h-img-box">
              <img class="h-img" :src="item.img" alt="" />
            </div>
            <div class="h-name-tag">{{ item.title }}</div>
            <div class="h-price-row">
              <span class="h-price"><span style="font-size: 10px;">¥</span>{{ item.sell_price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：独立方形 Banner -->
      <div class="health-right-banner">
        <img class="h-banner" :src="ghjk" @click="ApplianceRecommend(4, 0, 0)" alt="个护Banner" />
      </div>
    </div>

    <!-- 5. 显示补贴 (横向滚动) -->
    <div class="subsidy-section">
      <div class="subsidy-header-bar">
        <div class="header-content">
          <span class="title">显示补贴</span>
          <span class="divider">|</span>
          <span class="sub">低价好物</span>
        </div>
      </div>

      <div class="subsidy-grid">
        <div class="subsidy-item" v-for="(item, index) in subsidyList" :key="index" @click="goToDetail(item)">
          <img class="subsidy-img" :src="item.img" alt="" />
          <div class="subsidy-name">{{ item.title }}</div>
          <div class="subsidy-bottom">
            <div class="subsidy-price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}
            </div>
            <!-- <div class="add-btn" @click.stop="addToCart(item)">+</div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 品牌推荐 -->
    <div class="brand-section">
      <div class="brand-wrapper">
        <div class="brand-header">
          <span class="title">品牌推荐</span>
          <span class="sub">｜大牌好物</span>
        </div>
        <div class="brand-grid">
          <div class="brand-item" v-for="(item, index) in brandList" :key="index">
            <img class="brand-banner-img" :src="item.img" alt="" @click="AppBrandRecommend(item)" />
            <div class="brand-name-bar">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. 底部切换 Tab (横向滚动) - 动态从接口获取 -->
    <div class="bottom-tabs">
      <div class="tab-btn" v-for="(tab, index) in tabList" :key="index" :class="{ active: activeTab === index }"
        @click="changeTab(index)">
        {{ tab.name }}
      </div>
    </div>

    <!-- 8. 底部 Tab 对应的商品列表 (双列) - 动态从接口获取 -->
    <div class="tab-goods-grid">
      <div class="goods-item" v-for="(item, index) in currentTabGoods" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <!-- <div class="goods-tags">
            <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
          </div> -->
          <span class="platform-tag" v-if="getPlatformName(item.platform)">
            {{ getPlatformName(item.platform, item.jd_type) }}
          </span>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
            <div class="add-cart-btn" @click.stop="addToCart(item)">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 占位防止底部遮挡 -->
    <div style="height: 80px;"></div>
  </div>
</template>

<script>
import { channelDetail, ChannelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "ApplianceChannel",
  data() {
    return {
        loading: false,      // 新增
      ghjk: '',
      activeTab: 0,
      channelData: { banner: [], nav: [] },
      navList: [],
      healthList: [],
      subsidyList: [],
      // 品牌数据保留静态配置
      brandList: [

      ],
      // tabList 改为动态获取
      tabList: [],
      // tabGoodsData 改为动态获取，key 为 tab 索引
      tabGoodsData: {}
    }
  },
  computed: {
    // 根据 activeTab 动态切换商品
    currentTabGoods() {
      return this.tabGoodsData[this.activeTab] || [];
    },
    bannerImg() {
      if (this.channelData?.banner?.length > 0) {
        return this.channelData.banner[0]?.img || require('../../assets/lh/cate/jd/b1.png')
      }
      return require('../../assets/lh/cate/jd/b1.png')
    }
  },
  methods: {
    getPlatformName,
    goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
fetchChannelData() {
  this.loading = true;          // 请求开始

  channelDetail({ id: this.$route.query.id || 4 })
    .then(res => {
      if (res.code == 200) {
        this.channelData = res.data

        this.navList = (res.data.nav || []).slice(0, 10)

        if (res.data.nav?.[1]?.children?.[0]?.sections?.[0]?.items) {
          this.healthList = res.data.nav[1].children[0].sections[0].items.slice(0, 2)
        }
        if (res.data.nav?.[0]?.children?.[0]?.img) {
          this.ghjk = res.data.nav[0].children[0].img
        }

        this.subsidyList = res.data.sections?.[0]?.items || []

        const brandSection = res.data.sections?.find(s => s.type === 'brand')
        this.brandList = brandSection?.items || []

        this.processTabsData(res.data.sections)
      }
    })
    .catch(() => {
      // 兜底
    })
    .finally(() => {
      this.loading = false;     // 成功或失败都关掉
    })
},
    // fetchChannelData() {
    //   channelDetail({ id: this.$route.query.id || 4 }).then(res => {
    //     if (res.code == 200) {
    //       this.channelData = res.data

    //       this.navList = (res.data.nav || []).slice(0, 10)

    //       if (res.data.nav?.[1]?.children?.[0]?.sections?.[0]?.items) {
    //         this.healthList = res.data.nav[1].children[0].sections[0].items.slice(0, 2)
    //       }
    //       if (res.data.nav?.[0]?.children?.[0]?.img) {
    //         this.ghjk = res.data.nav[0].children[0].img
    //       }

    //       this.subsidyList = res.data.sections?.[0]?.items || []

    //       // ✅ 品牌推荐：从 sections 里取 type === 'brand'
    //       const brandSection = res.data.sections?.find(s => s.type === 'brand')
    //       this.brandList = brandSection?.items || []

    //       this.processTabsData(res.data.sections)
    //     }
    //   }).catch(() => {
    //     // 兜底
    //   })
    // },
    ProductBrandLists() {
      ChannelDetail({ id: this.$route.query.id }).then(res => {
        if (res.code == 200) {
          //  this.brandList = res.data
          const brandSection = res.data.sections?.find(section => section.type === 'brand')
          this.brandList = brandSection?.items || []

        }
      }).catch(() => {
        // 兜底数据
        this.brandList = res.data

      })
    },

    // ✅ 新增：处理 Tabs 数据
    processTabsData(sections) {
      // 找到 type 为 'tabs' 的 section
      const tabsSection = sections.find(section => section.type === 'tabs')

      if (tabsSection && tabsSection.tabs) {
        // 构建 tabList
        this.tabList = tabsSection.tabs.map(tab => ({
          name: tab.name.trim(),
          cate_id: tab.cate_id,
          items: tab.items || []
        }))

        // 构建 tabGoodsData (key 为索引)
        this.tabGoodsData = {}
        tabsSection.tabs.forEach((tab, index) => {
          this.tabGoodsData[index] = tab.items || []
        })

        // 默认选中第一个 tab
        this.activeTab = 0
      } else {
        // 如果没有 tabs 数据，使用兜底
        this.tabList = [

        ]
        this.tabGoodsData = {
          0: [],
          1: [],
          2: [],
          3: []
        }
      }
    },

    // ✅ 新增：切换 Tab
    changeTab(index) {
      this.activeTab = index
    },

    // ✅ 新增：处理 banner 点击
    handleBannerClick() {
      if (this.channelData?.banner?.[0]?.link) {
        window.location.href = this.channelData.banner[0].link
      }
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

    // ✅ 新增：加入购物车
    addToCart(item) {
      console.log('加入购物车:', item)
      // 可以在这里添加购物车逻辑
    },


    AppBrandRecommend(item) {
      this.$router.push({
        path: '/AppBrandRecommend',
        query: {
          brand_id: item.id,
          brand_name: item.name, channel_id: this.$route.query.id
        }
      });
    },

    ApplianceRecommend(id, nav, index) {
      this.$router.push({ path: '/ApplianceRecommend', query: { id: this.$route.query.id, nav: nav, index: index } });
    },
  },
  mounted() {
    this.fetchChannelData()
    // this.ProductBrandLists()
  },
  activated() {
    if (!this.navList.length) {
      this.fetchChannelData()
    }
  },
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

.appliance-page {
  background: #F4F4F4;
  min-height: 100vh;

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
.banner-area {
  // width: 100%;
  padding: 10px;

  .banner-img {
    width: 100%;
    display: block;
    object-fit: cover;
    height: 140px;
    margin-bottom: 10px;
    border-radius: 10px;
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

/* ================= 4. 个护健康 ================= */
/* ================= 4. 个护健康 (左右分开) ================= */
.health-section {
  display: flex;
  gap: 10px;
  padding: 0 10px 10px 10px;
  /* 整体外边距 */
  align-items: stretch;
  /* 保持左右等高 */

  /* 左侧：浅蓝色卡片 */
  .health-left-card {
    flex: 1;
    background: #E8F6FF;
    /* 浅蓝色背景 */
    border-radius: 12px;
    padding: 12px;

    .health-header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 12px;

      .title {
        font-size: 15px;
        font-weight: bold;
        color: #333;
      }

      .sub {
        font-size: 11px;
        color: #888;
      }
    }

    .health-inner-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .h-item {
        background: #ffffff;
        border-radius: 8px;
        padding: 8px 6px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        .h-img-box {
          width: 100%;
          aspect-ratio: 1/1;
          margin-bottom: 6px;
        }

        .h-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .h-name-tag {
          font-size: 11px;
          color: #333;
          background: #FFF1E0;
          /* 米黄色标签底 */
          padding: 2px 8px;
          border-radius: 10px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
        }

        .h-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          justify-content: center;

          .h-price {
            font-size: 14px;
            color: #d32f2f;
            font-weight: bold;
          }

          .h-old-price {
            font-size: 10px;
            color: #999;
            text-decoration: line-through;
          }
        }
      }
    }
  }

  /* 右侧：独立 Banner */
  .health-right-banner {
    width: 160px;
    /* 根据截图调整宽度 */
    flex-shrink: 0;
    border-radius: 12px;
    overflow: hidden;

    .h-banner {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      background: #f0f0f0;
    }
  }
}

/* ================= 5. 限时补贴 ================= */
/* ================= 5. 显示补贴 (网格 3x2) ================= */
.subsidy-section {
  margin: 0 10px 12px 10px;
  // background: #fff;
  border-radius: 12px;
  padding: 0px;

  /* 蓝色标题条 */
  .subsidy-header-bar {
    background: #3482F7;
    /* 设定蓝色背景 */
    border-radius: 8px 8px 0 0;
    /* 左上、右上圆角 */
    padding: 10px 12px;
    // margin: -12px -12px 12px -12px;
    margin-bottom: 10px;
    /* 让蓝色条贴着卡片边缘 */

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

  /* 商品网格 (3列 x 2行) */
  .subsidy-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 强制固定3列 */
    gap: 10px;

    .subsidy-item {
      background: #ffffff;
      /* 浅灰底色模拟图中的卡片 */
      border-radius: 8px;
      padding: 0px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .subsidy-img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        margin-bottom: 6px;
        border-radius: 10px 10px 0 0;
      }

      .subsidy-name {
        font-size: 12px;
        color: #333;
        text-align: left;

        line-height: 1.4;
        height: 30px;
        /* 固定高度，保证上下对齐 */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
        padding: 0 10px;

      }

      .subsidy-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .subsidy-price {
          padding-left: 10px;
          font-size: 14px;
          color: #ed2e33;
          font-weight: bold;
          padding-bottom: 6px;
          padding-top: 2px;
        }

        /* 红色实心加号按钮 */
        .add-btn {
          width: 20px;
          height: 20px;
          background: #ed2e33;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          line-height: 1;
          cursor: pointer;
        }
      }
    }
  }
}

/* ================= 6. 品牌推荐 ================= */
/* ================= 6. 品牌推荐 ================= */
.brand-section {
  padding: 0 10px 12px 10px;

  .brand-wrapper {
    background: linear-gradient(to bottom, #ffffff, #BED5FD);
    /* 最外层的浅蓝色大圆角背景 */
    border-radius: 12px;
    padding: 12px;

    .brand-header {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 12px;

      .title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .sub {
        font-size: 12px;
        color: #999;
      }
    }

    .brand-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      .brand-item {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);

        /* 场景图片 */
        .brand-banner-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          /* 保持正方形 */
          object-fit: cover;
          display: block;
        }

        /* 底部品牌名白条 */
        .brand-name-bar {
          text-align: center;
          padding: 8px 4px;
          font-size: 12px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

/* ================= 7. 底部 Tabs (横向滚动) ================= */
.bottom-tabs {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  justify-content: center;
  padding: 0 10px 10px 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    flex-shrink: 0;
    font-size: 14px;
    color: #240003;
    padding: 6px 12px;
    background: #f0f0f0;
    border-radius: 16px;
    cursor: pointer;

    &.active {
      color: #fff;
      background: #ed2e33;
      font-weight: bold;
    }
  }
}

/* ================= 8. 底部 Tab 对应的商品列表 (双列) ================= */
.tab-goods-grid {
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
      color: #333;
      font-weight: 500;
      margin-bottom: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
      width: 20px;
      height: 20px;
      background: #ed2e33;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
      cursor: pointer;
    }
  }
}
</style>