<template>
  <div class="super-hot-page" :style="pageBgStyle">
     

    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="爆款Banner" />
    </div>

    <!-- 3. 分类 Tab 切换区 (黄色背景) -->
    <div class="yellow-container">
      
      <div class="category-tabs">
        <div 
          class="tab-btn" 
          v-for="(tab, index) in tabList" 
          :key="index"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab }}
          <span></span>
        </div>
      </div>

      <!-- 4. 商品排名列表 -->
      <div class="rank-list-wrapper">
        <div class="rank-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
          
          <!-- 左侧：角标 + 图片 -->
          <div class="item-left-box">
            <!-- 白底圆角数字角标 -->
            <div class="rank-badge">{{ index + 1 }}</div>
            <img class="item-img" :src="item.img" alt="" />
          </div>

          <!-- 右侧：信息 -->
          <div class="item-info">
            <div class="item-title">{{ item.title }}</div>
            <span class="platform-tag" v-if="getPlatformName(item.platform)">
                  {{ getPlatformName(item.platform) }}
                </span>
            <!-- <div class="item-tags">
              <span class="tag-pink" v-if="item.tag">{{ item.tag }}</span>
            </div> -->
            <div class="item-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
              </div>
              <div class="add-btn">+</div>
            </div>
          </div>

        </div>
      </div>

    </div>

    
  </div>
</template>

  <script>
import { channelChildrenDetaill } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "SuperHotRankList",
  data() {
    return {
      pageBgStyle: {},
      baners: '',
      activeTab: 0,
      tabList: [],  // ✅ 改为空数组，从接口动态获取
      tabGoodsData: {},  // ✅ 存储每个 tab 对应的商品数据
    }
  },
  
  computed: {
    currentGoodsList() {
      return this.tabGoodsData[this.activeTab] || [];
    }
  },
  
activated() {
     this.channelDetailIndex()
  },
  mounted() {
    this.channelDetailIndex()
  },
  
  methods: {
    getPlatformName,
     goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    channelDetailIndex() {
      channelChildrenDetaill({ 
        id: this.$route.query.id, 
        nav_index: this.$route.query.nav, 
        child_index: this.$route.query.index 
      }).then(res => {
        if (res.code == 200) {
          console.log('接口返回数据:', res.data)
          
          // ✅ 1. 提取 banner 图片
          if (res.data.banner && res.data.banner.length > 0) {
            this.baners = res.data.banner[0].img
          }
          
          // ✅ 2. 提取 sections 中的 grid 数据
          const sections = res.data.sections || []
          
          // ✅ 3. 从 sections 中提取所有 grid 类型的数据作为 tabs
          const gridSections = sections.filter(section => section.type === 'grid')
          
          if (gridSections.length > 0) {
            // ✅ 提取 tab 标题
            this.tabList = gridSections.map(section => section.title || '')
            
            // ✅ 提取每个 tab 对应的商品数据
            this.tabGoodsData = {}
            gridSections.forEach((section, index) => {
              this.tabGoodsData[index] = section.items || []
            })
          }
          
          // ✅ 4. 提取背景色
          const bgColor = res.data.bg_color || '#F6CB41'
          this.pageBgStyle = {
            backgroundColor: bgColor
          }
          
          // ✅ 5. 设置黄色容器背景（如果需要跟随 bg_color）
          // 这里可以根据需要调整样式
        }
      }).catch(err => {
        console.error('获取数据失败:', err)
      })
    },
    
    // 跳转商品详情
    goToDetail(item) {


      this.$goDetail(item);

      
      // if (item.id) {
      //   this.$router.push({
      //     path: '/ProductDetail',
      //     query: { id: item.id }
      //   })
      // }


    },
    
    // 加入购物车
    addToCart(item) {
      console.log('加入购物车:', item)
      // 调用添加购物车 API
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="less">
.platform-tag {
  width: fit-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 3px; margin-bottom:4px;
}
.super-hot-page {
  min-height: 100vh;
  padding-bottom: 20px;background-color: #F6CB41;
}

/* ================= 1. 顶部导航 (透明) ================= */
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);

  .nav-left, .nav-right { font-size: 20px; color: #fff; cursor: pointer; width: 24px; }
  .nav-title { font-size: 16px; font-weight: 500; color: #fff; }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  width: 100%;
  .banner-img { width: 100%; 
    // height: 300px; 
    object-fit: cover; display: block; background: #f0f0f0; }
}

/* ================= 3. 黄色背景区域 (Tab + 列表) ================= */
.yellow-container {
   /* 采用截图中的黄色背景 */
  padding: 10px;
  border-radius: 16px 16px 0 0;
  margin-top: -10px; /* 稍微向上覆盖 Banner */
  position: relative;
  z-index: 2;
}

/* ===== 分类 Tabs ===== */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 6px 0 12px 0;
  margin-bottom: 4px;

  .tab-btn {position: relative;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    padding: 4px 8px;
    cursor: pointer;

    &.active {font-weight: bold;
      span{display: inline-block;position: absolute;bottom: 0;left: 20%;
        width: 50px;height: 4px;
  background: linear-gradient( 90deg, #D7000F 0%, #FEAA48 100%);border-radius: 10px;
      
      // border-bottom: 3px solid #C3201E; 
}
      /* 选中时的红线 */
    }
  }
}

/* ===== 排名列表 ===== */
.rank-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank-item {
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);

  .item-left-box {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 12px;

    .item-img {
      width: 100%;
      height: 100%;
      background: #f5f6fa;
      border-radius: 8px;
      object-fit: contain;
    }

    .rank-badge {
      position: absolute;
      top: -2px;
      left: -2px;
      background: #FFCC01;
      color: #D7000F;
      font-size: 12px;
      font-weight: bold;
       width: 14px;
      height: 22px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      z-index: 2;
      border: 1px solid rgba(0,0,0,0.02);
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 1.3;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-tags {
      margin-bottom: 6px;
      .tag-pink {
        font-size: 10px;
        color: #D23B3B;
        background: #FFEFEF;
        border: 1px solid #FFDADA;
        padding: 1px 6px;
        border-radius: 4px;
        display: inline-block;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-box {
        color: #ed2e33;
        .symbol { font-size: 12px;font-weight: bold; }
        .price { font-size: 18px; font-weight: bold; }
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
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.bottom-safe { height: 20px; }
</style>