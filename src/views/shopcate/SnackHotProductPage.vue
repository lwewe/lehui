<template>
  <div class="hot-product-page">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部大 Banner (橙红渐变/奖杯) -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="爆品Banner" />
    </div>

    <!-- 3. 商品列表主体区域 -->
    <div class="main-container">

      <!-- ===== 板块 1：爆款双列瀑布流 ===== -->
      <div class="hot-grid-wrapper">
        <div class="hot-goods-item" v-for="(item, index) in hotGoodsList" :key="index" @click="goToDetail(item)">
          <img class="hot-goods-img" :src="item.img" alt="" />
          <div class="hot-goods-info">
            <div class="hot-goods-name">{{ item.title }}</div>
            <span class="platform-tag" v-if="getPlatformName(item.platform)">
              {{ getPlatformName(item.platform) }}
            </span>

            <div class="hot-goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
              </div>
              <div class="add-btn">+</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 板块 2：底部排名列表 (带角标) ===== -->
      <div class="rank-list-wrapper">
        <div class="rank-item" v-for="(item, index) in rankGoodsList" :key="index" @click="goToDetail(item)">

          <!-- 图片 + 角标 -->
          <div class="rank-img-box">
            <div class="rank-badge">{{ index + 1 }}</div>
            <img class="rank-img" :src="item.img" alt="" />
          </div>

          <!-- 右侧信息 -->
          <div class="rank-info">
            <div class="rank-name">{{ item.title }}</div>
            <span class="platform-tag" v-if="getPlatformName(item.platform)">
              {{ getPlatformName(item.platform) }}
            </span>

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

    </div>


  </div>
</template>

<script>
import { channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "HotProductPage",
  data() {
    return {
      baners: '',
      // 双列爆款列表
      hotGoodsList: [
      ],
      // 底部带角标的排名列表
      rankGoodsList: [
      ]
    }
  },
  mounted() {
    this.channelDetailIndex()
  },
  activated() {
    // 每次进入都重新请求
    this.channelDetailIndex();
  },
  methods: {
    getPlatformName,
    goToDetail(item) {
      this.$goDetail(item);
      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    // 新增：获取频道详情
    channelDetailIndex() {
      channelDetail({ id: this.$route.query.id || 5 })
        .then(res => {
          if (res.code !== 200) return;

          const modules = res.data?.modules || [];

          // 1. 查找「精品推荐」模块：type='grid' 且 title 包含 '精品'
          const hotModule = modules.find(m => m.type === 'grid' && /精品/.test(m.title || ''));

          if (hotModule) {
            // 顶部 Banner 使用这个模块配置的 banner_img
            this.baners = hotModule.banner_img || '';

            // 所有商品列表
            const items = hotModule.items || [];

            // 取前 6 个作为双列瀑布流
            this.hotGoodsList = items.slice(0, 6);

            // 取第 6 个之后的（目前数据只有 6 个，所以这个数组会是空的；如果以后后台加商品，这里就会自动展示）
            this.rankGoodsList = items.slice(6);
          }
        })
        .catch(err => console.error('获取爆品页数据失败:', err));
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

.hot-product-page {
  background: #F5F5F5;
  /* 页面浅灰底色 */
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

  .banner-img {
    width: 100%;
    // height: 160px;
    object-fit: cover;
    background: #f0f0f0;
  }
}

/* ================= 3. 主体内容 ================= */
.main-container {
  padding: 0 10px;
  position: relative;
  top: -20px;
}

/* ===== 双列瀑布流 ===== */
.hot-grid-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 10px;

  .hot-goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 1px;

    .hot-goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .hot-goods-info {
      padding: 10px 10px 6px 10px;
    }

    .hot-goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      -webkit-box-orient: vertical;
      /* ✅ 新增这一行 */
    }

    .hot-goods-tags {
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

    .hot-goods-bottom {
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

/* ===== 底部排名列表 ===== */
.rank-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .rank-item {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);

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
        top: 0px;
        left: 0px;
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
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        z-index: 2;
        border: 1px solid rgba(0, 0, 0, 0.02);
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
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .rank-tags {
        margin-bottom: 6px;
        line-height: 1;

        .tag-red {
          font-size: 10px;
          color: #fff;
          background: #d32f2f;
          padding: 2px 4px;
          border-radius: 4px;
          display: inline-block;
        }
      }

      .rank-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-box {
          color: #d32f2f;

          .symbol {
            font-size: 12px;
            font-weight: bold;
          }

          .price {
            font-size: 18px;
            font-weight: bold;
          }
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
}

.bottom-safe {
  height: 20px;
}
</style>