<template>
  <div class="low-price-page">
   

    <!-- 2. 红色 Banner 区域 -->
    <div class="header-banner-wrapper">
      <div class="white-panel">
        <div class="panel-title">
          今日超低
        </div>

        <!-- 4 个微缩商品 -->
        <div class="top-grid-list">
          <div class="top-item" v-for="(item, index) in topList" :key="index" @click="goToDetail(item)">
            <img class="top-img" :src="item.img || defaultImg" alt="" />
            <div class="top-tag">
              {{ index === 0 ? '疯抢中' : index === 1 ? '省心价' : index === 2 ? '热卖中' : '限时直播' }}
            </div>
            <div class="top-price">
              <span style="font-size: 10px;">¥</span>{{ item.sell_price }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 商品主列表（第 5 个开始） -->
    <div class="list-wrapper" v-if="goodsList.length > 0">
      <div class="list-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        <div class="item-img-box">
          <img class="item-img" :src="item.img || defaultImg" alt="" />
        </div>

        <div class="item-info">
          <div class="item-title-box">
            <span class="title-text">
              <span class="title-tag" v-if="item.cate_name">{{ item.cate_name }}</span>
              <span style="line-height: 1.3;">{{ item.title }}</span>
            </span>
          </div>

          <div class="price-capsule">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
              <span class="original-price" v-if="item.sell_price < item.market_price">¥{{ item.market_price }}</span>
            </div>
            <div class="snap-btn" @click.stop="addToCart(item)">抢</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-tip" v-else-if="!loading">
      暂无商品
    </div>
  </div>
</template>

<script>
import { channelDetail } from "@/api/lhjdtm";

export default {
  name: "TmallTodaySuperLow",
  data() {
    return {
      platform: 2,
      loading: false,
      defaultImg: require('../../assets/lh/730.png'),

      topList: [],      // 前 4 个
      goodsList: [],    // 第 5 个开始
    }
  },
  methods: {
    // 获取超级补贴数据（channelDetail 接口）
    getData() {
      this.loading = true;
      channelDetail({ id: 16 }).then(res => {
        console.log('今日超低数据:', res);
        if (res.code == 200) {
          const data = res.data || {};
          let recommendData = [];

          if (data.sections && data.sections.length > 0) {
            // 找 title === '超级补贴' 的 section
            // 找不到就退而取第一个 grid section
            const subsidySection =
              data.sections.find(s => s.title === '超级补贴') ||
              data.sections.find(s => s.type === 'grid');

            if (subsidySection && subsidySection.items) {
              recommendData = subsidySection.items;
            }
          }

          // 前 4 个放顶部
          this.topList = recommendData.slice(0, 4);
          // 第 5 个开始放下方列表
          this.goodsList = recommendData.slice(4);
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    formatSaleNum(num) {
      if (num >= 10000) return (num / 10000).toFixed(1) + '万';
      return num;
    },

    goToDetail(item) {
      if (!item) return;
      this.$goDetail(item);
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style scoped lang="less">
.low-price-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 1. 顶部导航 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #fff;

  .nav-left, .nav-right {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    width: 24px;
    display: flex;
    align-items: center;
  }

  .nav-left { justify-content: flex-start; }
  .nav-right { justify-content: flex-end; }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* 2. 红色 Banner */
.header-banner-wrapper {
  background: #FF4E50;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;

  .white-panel {
    background: #FFE9E9;
    border-radius: 12px;

    .panel-title {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #333;
      padding: 8px;
    }

    .top-grid-list {
      background-color: #fff;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      padding: 10px 0;
      border-radius: 10px 10px 0 0;

      .top-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .top-img {
          width: 44px;
          height: 44px;
          background: #f5f6fa;
          border-radius: 6px;
          margin-bottom: 6px;
          object-fit: cover;
        }

        .top-tag {
          font-size: 10px;
          color: #FF4E50;
          text-align: center;
          white-space: nowrap;
          padding: 2px 8px;
          border-radius: 10px;
          background: #FFF6FB;
          border: 1px solid #F8D7E4;
        }

        .top-price {
          font-size: 13px;
          font-weight: bold;
          color: #FF4E50;
          margin-top: 4px;
          display: flex;
          align-items: baseline;
        }
      }
    }
  }
}

/* 3. 商品列表 */
.list-wrapper {
  padding: 0 12px;
}

.list-item {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  cursor: pointer;

  .item-img-box {
    width: 90px;
    height: 90px;
    flex-shrink: 0;
    margin-right: 12px;
    background: #f5f6fa;
    border-radius: 8px;
    overflow: hidden;

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .item-title-box {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      width: 100%;
      overflow: hidden;

      .title-tag {
        position: relative;
        top: -2px;
        display: inline-block;
        font-size: 10px;
        color: #fff;
        background: #d32f2f;
        padding: 3px 4px 2px 4px;
        border-radius: 4px;
        margin-right: 6px;
        flex-shrink: 0;
      }

      .title-text {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        line-height: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-all;
      }
    }

    .price-capsule {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFF5F5;
      border-radius: 8px;
      padding: 6px 6px 6px 12px;
      height: 34px;

      .price-box {
        display: flex;
        align-items: baseline;
        gap: 2px;

        .symbol {
          font-size: 12px;
          color: #d32f2f;
          font-weight: bold;
        }

        .price {
          font-size: 18px;
          color: #d32f2f;
          font-weight: bold;
        }

        .original-price {
          font-size: 11px;
          color: #999;
          text-decoration: line-through;
          margin-left: 4px;
        }
      }

      .snap-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, #FF4500, #FF4500);
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        padding: 0 14px;
        height: 100%;
        border-radius: 6px;
        cursor: pointer;
        letter-spacing: 1px;
        box-shadow: 0 2px 4px rgba(255, 69, 0, 0.3);
      }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 14px;
}
</style>