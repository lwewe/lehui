<template>
  <div class="tissue-zone-page">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部绿色大 Banner -->
    <div class="top-banner-area">
      <div style="padding: 10px;">
        <img class="banner-img" :src="bannerImg" alt="纸巾Banner" @click="handleBannerClick" />
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

    <!-- 4. 三个独立的横向卡片 (超值爆款榜、美发攻略、女性护理) -->
    <!-- 4. 左右双拼卡片 (左侧独立，右侧横向两标题) -->
    <div class="dual-card-row">

      <!-- 左侧：粉色底，超值爆款榜 -->
      <div class="dual-item pink-bg">
        <div class="big-title" @click="TissueSuperHotRankList(2, 0, 0)">超值爆款榜</div>
        <div class="inner-grid">
          <!-- 左商品 -->
          <div class="goods-mini" v-for="(item, index) in topTis1" :key="index" @click="goToDetail(item)">
            <img :src="item.img" alt="" />
            <div class="mini-tag red-tag">{{ item.title }}</div>
          </div>
          <!-- 右商品 -->

        </div>
      </div>

      <!-- 右侧：米黄底，双标题横向排列 -->
      <div class="dual-item yellow-bg">
        <div class="split-header">
          <span class="big-title" @click="SnackLightFoodZone(2, 3, 0)">美发攻略</span>
          <span class="big-title" @click="SnackLightFoodZone(2, 3, 0)">女性护理</span>
        </div>
        <div class="inner-grid">
          <!-- 左商品 -->
          <div class="goods-mini" v-for="(item, index) in topTis2" :key="index" @click="goToDetail(item)">
            <img :src="item.img" alt="" />
            <div class="mini-tag yellow-tag">{{ item.title }}</div>
          </div>
          <!-- 右商品 -->

        </div>
      </div>

    </div>

    <!-- 5. 通栏活动 Banner (清洁好物上新！) -->
    <div class="activity-banner">
      <div class="act-left">
        <img src="../../assets/lh/cate/zj/b2.png" @click="TissueCleanGoodsList()" style="width: 120px;" alt="">
      </div>
    </div>
    <div style="padding:0px 10px 10px 10px;">


      <!-- 6. 商品区 (3列 × 2行) -->
      <div class="goods-grid-3x2" style="background:   #EBFAFF;;">
        <div class="goods-item" v-for="(item, index) in tissueGoodsList" :key="index" @click="goToDetail(item)">
          <img class="item-img" :src="item.img" alt="" />
          <div class="item-name">{{ item.title }}</div>
          <div class="item-bottom">
            <span class="price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
            <!-- <span class="add-btn">+</span> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 7. 底部四个 Tab 切换 -->
    <div class="tabs-container">
      <div class="tab-btn" v-for="(tab, index) in tabList" :key="index" :class="{ active: activeTab === index }"
        @click="activeTab = index">
        <div class="main">{{ tab.name }}</div>
        <div class="sub">{{ tab.sub }}</div>
      </div>
    </div>

    <!-- 8. 底部商品瀑布流 (双列) -->
    <div class="goods-grid-2col">
      <div class="goods-item-2" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
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
import { channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "TissueZone",
  data() {
    return {
      activeTab: 0,
      channelData: { banner: [], nav: [] },
      navList: [],
      tissueGoodsList: [],  // ✅ 3列x2行商品数据
      tabList: [],  // ✅ 改为空数组，从接口获取
      tabGoodsList: [],  // ✅ 新增：存储每个 tab 的商品数据
      topTis1: [],
      topTis2: []
    }
  },

  computed: {
    currentGoodsList() {
      // ✅ 从接口数据中获取当前 tab 对应的商品列表
      return this.tabGoodsList[this.activeTab] || [];
    },
    bannerImg() {
      if (this.channelData?.banner?.length > 0) {
        return this.channelData.banner[0]?.img || require('../../assets/lh/cate/zj/b1.png')
      }
      return require('../../assets/lh/cate/zj/b1.png')
    }
  },

  mounted() {
    this.fetchChannelData()
  },
  activated() {
    if (!this.navList.length) {
      this.fetchChannelData()
    }
  },

  methods: {
    // 获取平台名称
    getPlatformName,
    goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    // 获取频道数据
    fetchChannelData() {
      channelDetail({ id: this.$route.query.id || 5 }).then(res => {
        if (res.code == 200) {
          this.channelData = res.data

          this.topTis1 = res.data.nav[0].children[0].sections[0].items.slice(0, 2) || []
          this.topTis2 = res.data.nav[0].children[0].sections[0].items.slice(0, 2) || []



          // ✅ 取前10个作为分类图标
          this.navList = (res.data.nav || []).slice(0, 10)

          // ✅ 提取 sections 数据
          const sections = res.data.sections || []

          // ✅ 提取 grid 类型的商品数据（3列x2行）
          const gridSection = sections.find(section => section.type === 'grid')
          if (gridSection && gridSection.items) {
            this.tissueGoodsList = gridSection.items.slice(0, 6) // 最多显示6个
          }

          // ✅ 提取 tabs 数据
          const tabsSection = sections.find(section => section.type === 'tabs')
          if (tabsSection && tabsSection.tabs) {
            this.tabList = tabsSection.tabs
            // ✅ 将每个 tab 的 items 提取到 tabGoodsList
            this.tabGoodsList = tabsSection.tabs.map(tab => tab.items || [])
          }
        }
      }).catch(err => {
        console.error('获取频道数据失败:', err)
        // 可以设置兜底数据
        this.setDefaultData()
      })
    },

    // 兜底数据（接口失败时使用）
    setDefaultData() {
      this.navList = []
    },

    // 处理 banner 点击
    handleBannerClick() {
      if (this.channelData?.banner?.[0]?.link) {
        window.location.href = this.channelData.banner[0].link
      }
    },

    // 处理分类点击
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

    // 切换 Tab
    changeTab(index) {
      this.activeTab = index
    },

    // 跳转商品详情
    toProductDetail(item) {
      if (item.id) {
        this.$router.push({
          path: '/productDetail',
          query: { id: item.id }
        })
      }
    },

    // 加入购物车
    addToCart(item) {
      console.log('加入购物车:', item)
      // 调用添加购物车 API
      // addCart({ product_id: item.id, num: 1 }).then(res => {
      //   if (res.code === 200) {
      //     this.$toast.success('添加成功')
      //   }
      // })
    },

    SnackLightFoodZone(id, nav, index) {
      this.$router.push({ path: '/SnackLightFoodZone', query: { id: id, nav: nav, index: index } });
    },

    TissueSuperHotRankList(id, nav, index) {
      this.$router.push({ path: '/TissueSuperHotRankList', query: { id: id, nav: nav, index: index } });
    },

    TissueCleanGoodsList() {
      this.$router.push('/SnackFoodRankList');
    },

    goBack() {
      this.$router.go(-1);
    }
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
  margin-top: 4px;
  margin-bottom: 4px;
}

.tissue-zone-page {
  background: #f7f7f7;
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
    height: 160px;
    object-fit: cover;
    border-radius: 10px;
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
      color: #333;
      font-weight: 600;
    }
  }
}

/* ================= 4. 三个独立卡片 ================= */
/* ================= 4. 左右双拼卡片 (最终还原版) ================= */
.dual-card-row {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px 10px;

  .dual-item {
    flex: 1;
    border-radius: 12px;
    padding: 10px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.pink-bg {
      background: url(../../assets/lh/cate/zj/b3.png) no-repeat;
      background-size: cover;
    }

    &.yellow-bg {
      background: url(../../assets/lh/cate/zj/b4.png) no-repeat;
      background-size: cover;
    }

    /* 左侧居中的大标题/ 右侧两个并排的标题 */
    .big-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      text-align: center;
      width: 100%;
      padding-bottom: 6px;

    }

    /* 右侧专用的双标题容器 */
    .split-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      /* 撑满宽度 */

    }

    /* 内部商品网格 */
    .inner-grid {
      display: flex;
      width: 100%;
      gap: 10px;

      .goods-mini {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        border-radius: 10px;
        padding: 0px 6px 2px 6px;
        min-width: 0;

        img {
          width: 100%;
          // aspect-ratio: 1 / 1;
          // background: #f0f0f0;
          border-radius: 6px;
          object-fit: contain;
          margin-bottom: 6px;
        }

        .mini-tag {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 4px;
          line-height: 1.5;
          border-radius: 30px;
          white-space: nowrap;
          text-align: center;
          max-width: 56px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;

          &.red-tag {
            color: #F93838;
            background: #FFE8E8;
          }

          &.yellow-tag {
            color: #D89E00;
            background: #FFF7E0;
          }
        }
      }
    }
  }
}

/* ================= 5. 活动 Banner ================= */
.activity-banner {
  margin: 0 10px 0px 10px;
  background: #EBFAFF;

  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .act-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 20px;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .act-right {
    font-size: 18px;
    color: #999;
  }
}

/* ================= 6. 3x2 商品网格 ================= */
.goods-grid-3x2 {
  display: grid;
  background-color: #EBFAFF;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 10px 12px 10px;

  .goods-item {
    background: #fff;
    border-radius: 10px;
    padding: 0;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

    .item-img {
      width: 100%;
      background: #f5f6fa;
      border-radius: 10px 10px 0 0;
      object-fit: cover;
      margin-bottom: 6px;
    }

    .item-name {
      text-align: left;
      font-size: 12px;
      color: #333;
      line-height: 1.2;
      height: 27px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-bottom: 4px;
      padding: 0 10px;
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 14px;
      color: #ed2e33;
      font-weight: bold;
      padding: 1px 10px 6px 10px;
    }

    .add-btn {
      width: 20px;
      height: 20px;
      background: #ed2e33;
      color: #fff;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

/* ================= 7. 底部 Tabs ================= */
.tabs-container {
  display: flex;
  padding: 0 10px 12px 10px;
  gap: 12px;

  .tab-btn {
    flex: 1;
    // background: #fff;
    border-radius: 12px;
    // padding: 10px 4px;
    text-align: center;
    cursor: pointer;
    // box-shadow: 0 2px 6px rgba(0,0,0,0.02);

    .main {
      font-size: 14px;
      font-weight: bold;
      color: #666;
      display: block;
    }

    .sub {
      font-size: 10px;
      padding: 2px 4px;
      color: #999;
      border-radius: 20px;
      display: inline-block;
      margin-top: 2px;
      line-height: 1;
    }

    &.active {

      // background: #FFEBF0;
      .main {
        color: #e91e63;
      }

      .sub {
        background: #FFEBF0;
        color: #e91e63;
      }
    }
  }
}

/* ================= 8. 双列瀑布流 ================= */
.goods-grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 60px 16px;

  .goods-item-2 {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 1px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .goods-info {
      padding: 10px 12px 6px 12px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 1px;
      overflow: hidden;
      line-height: 1.4;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
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

    .add-btn {
      width: 20px;
      height: 20px;
      font-weight: bold;
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