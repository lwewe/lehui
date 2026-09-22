<template>
  <div class="food-rank-page">
    <!-- 1. 顶部导航 -->
     

    <!-- 2. 顶部 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="好食榜Banner" />
    </div>

    <!-- 3. 商品排行榜列表 -->
    <div class="rank-list-wrapper">
      <div class="rank-item" v-for="(item, index) in goodsList" :key="index">
        
        <!-- 左侧：带角标的图片 -->
        <div class="rank-img-box">
          <div class="rank-badge">{{ index + 1 }}</div>
          <img class="rank-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧：商品信息 -->
        <div class="rank-info">
          <div class="rank-name">{{ item.title }}</div>
<span class="platform-tag" v-if="getPlatformName(item.platform)">
                  {{ getPlatformName(item.platform) }}
                </span>
          <!-- <div class="rank-tags">
            <span class="tag-pink" v-if="item.tag">{{ item.tag }}</span>
          </div> -->

          <div class="rank-bottom">
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
import { channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "FoodRankList",
  data() {
    return {baners:'',
      goodsList: [
        
      ]
    }
  },
  mounted() {
    this.channelDetailIndex()
  },
  methods: {
     getPlatformName,
     goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    // 新增：获取频道详情
     channelDetailIndex() {
      channelDetail({ id: this.$route.query.id }).then(res => {
        if (res.code == 200) {
          
          this.baners = res.data.nav[9].children[0].banner[0].img
        
         
            this.goodsList = res.data.nav[9].children[0].products || []
           
          
           
           
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
  display: inline-block;width:max-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 2px; margin-bottom: 4px;
}
.food-rank-page {
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
  background: #fff;

  .nav-left, .nav-right { font-size: 20px; color: #333; cursor: pointer; width: 24px; }
  .nav-title { font-size: 16px; font-weight: 500; color: #333; }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  
  .banner-img { width: 100%; height: 160px; object-fit: cover;  background: #f0f0f0; }
}

/* ================= 3. 排行榜列表 ================= */
.rank-list-wrapper {
  padding: 0 10px;    position: relative;
    top: -20px;
}

.rank-item {
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

  .rank-img-box {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 12px;

    .rank-img {
      width: 100%;
      height: 100%;
      background: #f5f6fa;
      border-radius: 8px;
      object-fit: contain;
    }

    .rank-badge {
      position: absolute;
      top: 0;
      left: 0;
      background: #FFCC01; /* 核心：蓝底白字圆角方形角标 */
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px 0 6px 0; /* 左上和右下圆角 */
      z-index: 2;
    }
  }

  .rank-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .rank-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 1.3;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .rank-tags {
      margin-bottom: 6px;
      .tag-pink {
        font-size: 10px;
        color: #d32f2f;
        // background: #FFEEEE; /* 粉底红字标签 */
        border: 1px solid #FFDADA;
        padding: 1px 6px;
        border-radius: 4px;
        display: inline-block;
      }
    }

    .rank-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-box {
        color: #ed2e33;
        .symbol { font-size: 12px; font-weight: bold;}
        .price { font-size: 18px; font-weight: bold; }
      }

      .add-btn {
        width: 20px;
        height: 20px;
        background: #ed2e33; /* 粉色渐变/纯色按钮 */
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