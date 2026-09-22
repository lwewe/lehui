<template>
  <div class="snack-zone-page">
    <!-- 1. 顶部导航 (红橙色渐变) -->
<NProgress v-if="loading" />

    <!-- 2. 顶部大 Banner (爆款半价抢) -->
    <div class="top-banner-area">
      <img class="banner-img"
        :src="channelData.banner && channelData.banner[0] ? channelData.banner[0].img : require('../../assets/lh/cate/ls/b1.png')"
        alt="零食Banner" @click="handleBannerClick" />
    </div>

    <!-- 3. 10个分类图标 (两排，每排5个) -->
    <div class="category-container">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in navList" :key="item.title || index" @click="handleNavClick(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 4. 左右双拼模块 (夏日糕点 + 低卡零食) -->
    <!-- 4. 左右双拼模块 -->
    <div class="split-block">
      <!-- ===== 左侧：夏日缤纷好食榜 (3行列表，带排名) ===== -->
      <div class="split-box blue-box">
        <div class="box-header" @click="SnackFoodRankList(5)">
          <div class="box-title">夏日缤纷好食榜</div>
          <div class="box-sub">酸甜苦辣 清爽度夏</div>
        </div>

        <div class="rank-list">
          <div class="rank-item" v-for="(item, index) in cakeList" :key="index" @click="goToDetail(item)">
            <div class="rank-badge">{{ index + 1 }}</div>
            <img class="rank-img" :src="item.img" alt="" />
            <div class="rank-info">
              <div class="rank-name">{{ item.title }}</div>
              <div class="rank-price"><span style="font-size: 10px;font-weight: bold;"> ¥</span>{{ item.sell_price }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 右侧：低卡零食 + 品牌 (上下分行) ===== -->
      <div class="split-box1 green-box">
        <!-- 第一行：低卡零食大图 -->
        <div class="green-banner-row" @click="SnackLightFoodZone(8,0)">
          <div class="green-title">{{ dklsTitle }}</div>
          <img class="green-banner-img" :src="dkls" alt="低卡零食横幅" />
        </div>

        <!-- 第二行：泸溪河 + 良品铺子 (一行两列) -->
        <div class="brand-row">
          <div class="brand-item blues" @click="SnackLightFoodZone(4,1)">
            <div class="brand-name">{{ lxhTitle }}</div>
            <img class="brand-img" :src="lxh" alt="泸溪河" />
          </div>
          <div class="brand-item yels" @click="SnackLightFoodZone(4,0)">
            <div class="brand-name">{{ lppzTitle }}</div>
            <img class="brand-img" :src="lppz" alt="良品铺子" />
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 爆品推荐 (4列横向滚动) -->
    <!-- 5. 爆品推荐 (4个商品固定平铺) -->
    <div class="section-wrapper">
      <div class="section-header">
        <span class="title">爆品推荐</span>
        <span class="sub" @click="SnackHotProductPage()">爆款低价天天抢</span>
      </div>
      <!-- 修改这里：改名为 grid-box-4 -->
      <div class="grid-box-4">
        <div class="grid-item" v-for="(item, index) in hotList" :key="index" @click="goToDetail(item)">
          <img class="item-img" :src="item.img" alt="" />
          <div class="item-name">{{ item.title }}</div>
          <div class="item-price-box">
            <span class="symbol">¥</span>
            <span class="price">{{ item.sell_price }}</span>
            <span class="old-price">¥{{ item.market_price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 四个 Tab 切换区 -->
    <div class="tabs-container">
      <div class="tab-btn" v-for="(tab, index) in tabList" :key="index" :class="{ active: activeTab === index }"
        @click="activeTab = index">
        <span class="main">{{ tab.name }}</span>
        <span class="sub">{{ tab.sub }}</span>
      </div>
    </div>

    <!-- 7. 商品瀑布流 (双列) -->
    <div class="goods-grid">
      <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title  }}</div>
           <span class="platform-tag" v-if="getPlatformName(item.platform)">
                  {{ getPlatformName(item.platform) }}
                </span>
          <div class="goods-tags">
            <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
          </div>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price  }}</span>
            </div>
            <div class="add-btn">+</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

 <script>
import { channelDetail, productList } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "SnackZone",
  data() {
    return {   loading: false,      // 新增
      lppzTitle: '', lppz: "",
      lxhTitle: '', lxh: '',
      channelData: { banner: [] },
      navList: [],
      activeTab: 0, 
      dkls: '', dklsTitle: "",
      tabList: [],  // ✅ 改为空数组，从接口获取
      tabGoodsList: [],  // ✅ 新增：存储每个 tab 的商品数据
      
      // 夏日糕点数据
      cakeList: [],
      // 爆品推荐
      hotList: [],
    }
  },
  
  computed: {
    currentGoodsList() {
      // ✅ 从接口数据中获取当前 tab 对应的商品列表
      return this.tabGoodsList[this.activeTab] || [];
    }
  },
  
  methods: {
    getPlatformName,
    goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    channelDetailIndex() {
  this.loading = true;          // 请求开始

  channelDetail({ id: this.$route.query.id })
    .then(res => {
      if (res.code == 200) {
        this.channelData = res.data
        this.navList = res.data.nav || []

        // ✅ 提取 tabs 数据（从 sections 中找 type 为 tabs 的）
        const tabsSection = (res.data.sections || []).find(section => section.type === 'tabs')
        if (tabsSection && tabsSection.tabs) {
          this.tabList = tabsSection.tabs
          this.tabGoodsList = tabsSection.tabs.map(tab => tab.items || [])
        }

        // ✅ 提取爆品推荐数据
        if (res.data.nav && res.data.nav[0] && res.data.nav[0].children && res.data.nav[0].children[0]) {
          this.hotList = res.data.nav[0].children[0].products.slice(0, 4)
        }

        // ✅ 提取左侧排行榜数据（夏日缤纷好食榜）
        if (res.data.nav && res.data.nav[9] && res.data.nav[9].children && res.data.nav[9].children[0]) {
          this.cakeList = res.data.nav[9].children[0].products.slice(0, 3) || []
        }

        // ✅ 提取右侧双拼模块数据
        if (res.data.nav && res.data.nav[8] && res.data.nav[8].children && res.data.nav[8].children[0]) {
          this.dklsTitle = res.data.nav[8].children[0].title
        }
        if (res.data.nav && res.data.nav[9] && res.data.nav[9].children && res.data.nav[9].children[0]) {
          this.dkls = res.data.nav[9].children[0].img
        }

        if (res.data.nav && res.data.nav[4] && res.data.nav[4].children) {
          if (res.data.nav[4].children[0]) {
            this.lppzTitle = res.data.nav[4].children[0].title
            this.lppz = res.data.nav[4].children[0].img
          }
          if (res.data.nav[4].children[1]) {
            this.lxhTitle = res.data.nav[4].children[1].title
            this.lxh = res.data.nav[4].children[1].img
          }
        }
      }
    })
    .finally(() => {
      this.loading = false;     // 成功或失败都关掉
    })
},
    // 获取频道详情
    // channelDetailIndex() {
    //   channelDetail({ id: this.$route.query.id }).then(res => {
    //     if (res.code == 200) {
    //       this.channelData = res.data
    //       this.navList = res.data.nav || []
          
    //       // ✅ 提取 tabs 数据（从 sections 中找 type 为 tabs 的）
    //       const tabsSection = (res.data.sections || []).find(section => section.type === 'tabs')
    //       if (tabsSection && tabsSection.tabs) {
    //         this.tabList = tabsSection.tabs
    //         // ✅ 将每个 tab 的 items 提取到 tabGoodsList
    //         this.tabGoodsList = tabsSection.tabs.map(tab => tab.items || [])
    //       }
          
    //       // ✅ 提取爆品推荐数据
    //       if (res.data.nav && res.data.nav[0] && res.data.nav[0].children && res.data.nav[0].children[0]) {
    //         this.hotList = res.data.nav[0].children[0].products.slice(0, 4)
    //       }
          
    //       // ✅ 提取左侧排行榜数据（夏日缤纷好食榜）
    //       if (res.data.nav && res.data.nav[9] && res.data.nav[9].children && res.data.nav[9].children[0]) {
    //         this.cakeList = res.data.nav[9].children[0].products.slice(0,3) || []
    //       }
          
    //       // ✅ 提取右侧双拼模块数据
    //       if (res.data.nav && res.data.nav[8] && res.data.nav[8].children && res.data.nav[8].children[0]) {
    //         this.dklsTitle = res.data.nav[8].children[0].title
    //       }
    //       if (res.data.nav && res.data.nav[9] && res.data.nav[9].children && res.data.nav[9].children[0]) {
    //         this.dkls = res.data.nav[9].children[0].img
    //       }
          
    //       if (res.data.nav && res.data.nav[4] && res.data.nav[4].children) {
    //         if (res.data.nav[4].children[0]) {
    //           this.lppzTitle = res.data.nav[4].children[0].title
    //           this.lppz = res.data.nav[4].children[0].img
    //         }
    //         if (res.data.nav[4].children[1]) {
    //           this.lxhTitle = res.data.nav[4].children[1].title
    //           this.lxh = res.data.nav[4].children[1].img
    //         }
    //       }
    //     }
    //   })
    // },
    
    // 处理导航点击
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
    
    // 处理banner点击
    handleBannerClick() {
      if (this.channelData.banner && this.channelData.banner[0] && this.channelData.banner[0].link) {
        window.location.href = this.channelData.banner[0].link
      }
    },
    
    SnackHotProductPage() {
      this.$router.push({ path: '/SnackHotProductPage', query: { id: this.$route.query.id } });
    },
    
    SnackFoodRankList(id,nav,index) {
      this.$router.push({ path: '/SnackFoodRankList', query: { id: id } });
    },
    
    SnackLightFoodZone(nav, index) {
      this.$router.push({ path: '/SnackLightFoodZone', query: { id: this.$route.query.id, nav: nav, index: index } });
    },
    
    goBack() {
      this.$router.go(-1);
    }
  },
  activated() {
     this.channelDetailIndex()
  },
  mounted() {
    // this.channelDetailIndex()
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
}
.snack-zone-page {
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
  background: linear-gradient(90deg, #FF6745, #FF3D1D);
  /* 红橙色渐变 */
  color: #fff;

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
  padding: 10px;

  .banner-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
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
      font-weight: 600;
      color: #333;
    }
  }
}

/* ================= 4. 左右双拼模块 ================= */
/* ================= 4. 左右双拼模块 ================= */
.split-block {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px 10px;

  .split-box {
    flex: 1;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;

    &.blue-box {
      // background:linear-gradient(to bottom,#B4E5F6,#F3FDFF);
      background-image: url(../../assets/lh/cate/ls/bg1.png);
      background-size: cover;
      /* 左侧浅蓝底色 */
    }

    &.green-box {
      background: #EAF6EE;
      /* 右侧浅绿底色 */
    }

    .box-header {
      margin-bottom: 10px;

      .box-title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }

      .box-sub {
        font-size: 12px;
        color: #666;
        margin-top: 2px;
      }
    }
  }

  .split-box1 {
    flex: 1;
    border-radius: 12px;
    // padding: 12px;
    display: flex;
    flex-direction: column;

    &.blue-box {
      background: #B4E5F6;
      /* 左侧浅蓝底色 */
    }

    &.green-box {
      // background: #EAF6EE;
      /* 右侧浅绿底色 */
    }

    .box-header {
      margin-bottom: 10px;

      .box-title {
        font-size: 15px;
        font-weight: bold;
        color: #333;
      }

      .box-sub {
        font-size: 12px;
        color: #666;
        margin-top: 2px;
      }
    }
  }

  /* ===== 左侧：3行排行榜 ===== */
  .rank-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .rank-item {
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 8px;
      padding: 8px 8px 8px 8px;
      position: relative;

      .rank-badge {
        position: absolute;
        top: -2px;
        left: -2px;
        background: #F0C34F;
        color: #ffffff;
        font-size: 10px;
        font-weight: bold;
        width: 18px;
        height: 18px;
        border-radius: 4px 0px 4px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        // border: 1px solid #fff;
      }

      .rank-img {
        width: 50px;
        height: 50px;
        background: #f5f6fa;
        border-radius: 6px;
        object-fit: contain;
        margin-right: 10px;
        flex-shrink: 0;
      }

      .rank-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;

        .rank-name {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }

        .rank-price {
          font-size: 14px;
          color: #d32f2f;
          font-weight: bold;
        }
      }
    }
  }

  /* ===== 右侧：低卡零食 + 品牌 ===== */
  .green-banner-row {
    // background: linear-gradient(to bottom,#DBFAB2,#ffffff); 
    background-image: url(../../assets/lh/cate/ls/bg2.png);
    background-size: cover;
    border-radius: 8px;
    padding: 6px 12px;
    margin-bottom: 10px;


    .green-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    .green-banner-img {
      height: 100px;
      margin-top: 10px;
      width: 100%;
      object-fit: cover;
      border-radius: 4px;
      background: #f0f0f0;
    }
  }

  .brand-row {
    display: flex;
    gap: 10px;
    flex: 1;

    .brand-item {
      flex: 1;
      // background: linear-gradient(to bottom,#AEC6B8,#ffffff);
      border-radius: 8px;
      padding: 8px 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &.blues {
        background-image: url(../../assets/lh/cate/ls/bg3.png);
        background-size: cover;
      }

      &.yels {
        background-image: url(../../assets/lh/cate/ls/bg4.png);
        background-size: cover;
      }

      .brand-name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .brand-img {
        margin-top: 12px;
        width: 57px;
        height: 57px;
        aspect-ratio: 1/1;
        background: #f5f6fa;
        border-radius: 6px;
        object-fit: contain;
      }
    }
  }
}

/* ================= 5. 爆品推荐 (4列横向滚动) ================= */
/* ================= 5. 爆品推荐 (4列固定网格) ================= */
.section-wrapper {
  margin: 0 10px 0px 10px;
  padding: 12px;
  background: linear-gradient(349deg, #ffffff 0%, #ffffff 39.04%, rgba(255, 222, 218, 0.7) 100%);
  border-radius: 12px;

  .section-header {
    display: flex;
    justify-content: space-between;
    // align-items: baseline;
    margin-bottom: 12px;

    .title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    .sub {
      font-size: 12px;
      color: #999;
    }
  }

  .grid-box-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 强制平分4列，无滚动 */
    gap: 6px;

    .grid-item {
min-width: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .item-img {
        width: 60px;           /* 固定宽度 */
        height: 60px;          /* 固定高度 */
        object-fit: contain;   /* 保持比例 */
        margin-bottom: 6px;
        background: #f5f5f5;
        border-radius: 8px;
      }

      .item-name {
         font-size: 11px;
  color: #333;
  white-space: nowrap;           /* 不换行 */
  overflow: hidden;              /* 隐藏溢出 */
  text-overflow: ellipsis;       /* 显示省略号 */
  width: 100%;                   /* 设置宽度 */
  text-align: center;
  margin-bottom: 4px;
      }

      .item-price-box {
        width: 100%;
        // background: linear-gradient(90deg, #FFD6D6, #FFB2B2);
        /* 还原截图中的红粉渐变底 */
        // border-radius: 10px;
        // padding: 2px 2px;
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 2px;

        .symbol {
          font-size: 10px;
          color: #ed2e33;
          font-weight: bold;
        }

        .price {
          font-size: 13px;
          color: #ed2e33;
          font-weight: bold;
        }

        .old-price {
          font-size: 9px;
          color: #999;
          text-decoration: line-through;
        }
      }
    }
  }
}

/* ================= 6. 切换 Tabs ================= */
.tabs-container {
  display: flex;
  padding: 0 10px 0px 10px;
  gap: 12px;

  .tab-btn {
    flex: 1;
    // background: #fff;
    border-radius: 12px;
    padding: 10px 4px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

    .main {
      font-size: 14px;
      font-weight: bold;
      color: #555555;
      display: block;
    }

    .sub {
      font-size: 10px;
      color: #999;
      // display: block;
      padding: 2px 4px;
      border-radius: 10px;
      margin-top: 2px;
    }

    &.active {

      // background: #E3F2FD;
      .sub {
        background-color: #FF6F51;
        color: #ffffff;
      }

      .main {
        color: #000000;
      }
    }
  }
}

/* ================= 7. 商品瀑布流 ================= */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 60px 16px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom:2px;
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
       -webkit-box-orient: vertical;  /* ✅ 新增这一行 */
    }

    .goods-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 6px;

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
      color: #ed2e33;

      .symbol {
        font-size: 12px;font-weight: bold;
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
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;font-weight: bold;
      cursor: pointer;
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>