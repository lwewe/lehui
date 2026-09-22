<template>
  <div class="hot-rank-page" :style="pageBgStyle">
    <!-- 1. 顶部导航 -->
     
    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="banenrs" alt="爆款榜Banner" />
    </div>

    <!-- 3. 商品排名列表 -->
    <div class="rank-list-wrapper">
      <div class="rank-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        
        <!-- 左侧：带角标的图片 -->
        <div class="item-left-box">
          <!-- 纯白矩形圆角角标 -->
          <div class="rank-badge">{{ index + 1 }}</div>
          <img class="item-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧：商品信息 -->
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
           <span class="platform-tag" v-if="getPlatformName(item.platform)">
                  {{ getPlatformName(item.platform) }}
                </span>
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
</template>

<script>
import { channelChildrenDetaill } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "HotRankList",
  data() {
    return {banenrs:'',
    pageBgStyle:{},
      goodsList: [
     
      ]
    }
  },
   mounted() {
    this.channelDetailIndex()
  },
  activated() {
     this.channelDetailIndex()
  },
  methods: {
 getPlatformName,
    
      goToDetail(item) {
      
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    channelDetailIndex() {
      channelChildrenDetaill({ id: this.$route.query.id, nav_index: this.$route.query.nav, child_index: this.$route.query.index }).then(res => {
        if (res.code == 200) {
           this.banenrs = res.data.banner[0].img;
           const bgColorStr = res.data.bg_color || '';
           const colors = bgColorStr.split(',').map(item => item.trim()).filter(item => item);
           this.pageBgStyle = {
            backgroundColor: colors[0]
          };
          this.goodsList = res.data.sections[0].items;
        }
      })
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
.hot-rank-page {
  min-height: 100vh;
  /* 背景色统一为截图中的蓝色 */
  background: #2A75BA; 
  padding-bottom: 20px;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #2A75BA; /* 导航栏也保持蓝色背景 */
  color: #fff;

  .nav-left, .nav-right { font-size: 20px; color: #fff; cursor: pointer; width: 24px; }
  .nav-title { font-size: 16px; font-weight: 500; color: #fff; }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  padding: 0 0 10px 0;
  .banner-img { width: 100%; height: auto; display: block; object-fit: cover; }
}

/* ================= 3. 排名列表 (蓝底白卡片) ================= */
.rank-list-wrapper {
  padding: 0 12px;
}

.rank-item {
  display: flex;
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;

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
      border-radius: 6px;
      object-fit: contain;
    }

    /* ========= 核心修改：白底圆角矩形的角标 ========= */
    .rank-badge {
      position: absolute;
      top: 0px;
      left: 0px;
      background:  #FFCC01;
      color: #ffffff;
      font-size: 11px;
      font-weight: bold;
       width: 14px;
      height: 20px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px 0 4px 0;
      
      z-index: 2;
       
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .item-title {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 1.3;
      margin-bottom: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-tags {
      margin-bottom: 6px;
      .tag-red {
        font-size: 10px;
        color: #D7000F;
        background: #ffffff;
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid #D7000F;
        display: inline-block;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-box {
        color: #d32f2f;
        .symbol { font-size: 12px; font-weight: bold;}
        .price { font-size: 18px; font-weight: bold; }
      }

      .add-btn {
        width: 20px;
        height: 20px;
        background: #FF6B35;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.bottom-safe { height: 20px; }
</style>