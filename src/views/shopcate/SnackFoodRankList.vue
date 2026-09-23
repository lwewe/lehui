<template>
  <div class="food-rank-page">
    <!-- 2. 顶部 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="好食榜Banner" />
    </div>

    <!-- 3. 上面：排行榜前 3 条（单列，带排名角标） -->
    <div class="rank-list-wrapper">
      <div class="rank-item" v-for="(item, index) in topList" :key="index" @click="goToDetail(item)">
        <div class="rank-img-box">
          <div class="rank-badge">{{ index + 1 }}</div>
          <img class="rank-img" :src="item.img" alt="" />
        </div>
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
            <div class="add-btn" @click.stop="addToCart(item)">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 下面：双列商品 -->
    <div class="goods-grid-2">
      <div class="goods-item-2" v-for="(item, index) in restList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <span class="platform-tag" v-if="getPlatformName(item.platform)">
            {{ getPlatformName(item.platform) }}
          </span>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
            <div class="add-btn" @click.stop="addToCart(item)">+</div>
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
  name: "FoodRankList",
  data() {
    return {
      loading: false,
      baners: '',
      topList: [],    // 上面 3 条
      restList: []    // 下面双列
    }
  },
  mounted() {
    this.channelDetailIndex();
  },
  activated() {
    this.channelDetailIndex();
  },
  methods: {
    getPlatformName,

    goToDetail(item) {
      this.$goDetail(item);

      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    channelDetailIndex() {
  this.loading = true;

  channelDetail({ id: this.$route.query.id || 2 })
    .then(res => {
      if (res.code == 200) {
        const data = res.data || {};
        const nav = data.nav || [];

        // 直接按索引取 nav[9]
        const navItem = nav[9];

        // 它的第一个 child
        const targetChild = navItem?.children?.[0];

        // banner
        this.baners =
          targetChild?.banner?.[0]?.img ||
          data.banner?.[0]?.img ||
          '';

        // 商品
        const gridSection = (targetChild?.sections || [])
          .find(s => s.type === 'grid');
        const allGoods = gridSection?.items || [];

        this.topList = allGoods.slice(0, 3);
        this.restList = allGoods.slice(3);
      }
    })
    .finally(() => {
      this.loading = false;
    });
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

.food-rank-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* ================= 2. Banner ================= */
.top-banner-area {
  .banner-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    background: #f0f0f0;
  }
}

/* ================= 3. 上面单列排行榜 ================= */
.rank-list-wrapper {
  padding: 0 10px;
  position: relative;
  top: -20px;
}

.rank-item {
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  cursor: pointer;

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
      background: #FFCC01;
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px 0 6px 0;
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

    .rank-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-box {
        color: #ed2e33;

        .symbol { font-size: 12px; font-weight: bold; }
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

/* ================= 4. 下面双列商品 ================= */
.goods-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 10px 60px 10px;

  .goods-item-2 {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    cursor: pointer;

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
      display: block;
    }

    .goods-info {
      padding: 8px 10px 6px 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      color: #ed2e33;

      .symbol { font-size: 12px; font-weight: bold; }
      .price { font-size: 16px; font-weight: bold; }
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
</style>