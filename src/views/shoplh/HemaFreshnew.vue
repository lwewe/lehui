<template>
  <div class="exclusive-page">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部黄色 Banner -->
    <div class="banner-area">
      <img class="banner-img" src="../../assets/lh/hm/b2.png" alt="Banner" />
    </div>

    <!-- 3. 商品列表 -->
    <div class="list-wrapper">
      <div class="list-item" v-for="(item, index) in goodsList" :key="index">
        <!-- 左侧图片 -->
        <div class="item-img-box">
          <img class="item-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧信息 -->
        <div class="item-info">
          <div class="item-title">{{ item.name }}</div>

          <!-- 标签 (如 十月稻田) -->
          <div class="item-tags">
            <span class="tag-orange" v-if="item.tag">{{ item.tag }}</span>
          </div>

          <!-- 底部价格行 -->
          <div class="item-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.price }}</span>
            </div>
            <div class="add-btn">+</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { channelDetail } from "@/api/lhjdtm";
export default {
  name: "ExclusiveNew",
  data() {
    return {
      goodsList: [
      ]
    }
  },
  methods: {
    async fetchHomeData() {
      try {
        const res = await channelDetail({ id: 15 });
        if (res.code === 200 && res.data) {
          const data = res.data;

          // 1. Banner
          if (data.banner && data.banner.length) {
            this.bannerImg = data.banner[0].img;
          }

          // 2. 分类图标（nav）
          this.categoryList = (data.nav || []).map((item, index) => ({
            id: item.cate_id || item.id || index,
            name: item.title,
            img: item.img || ""
          }));

          // 3. sections
          if (data.sections && data.sections.length) {
            // 每日特惠
            const dailySec = data.sections.find(s => s.title === "每日特惠");
            if (dailySec && dailySec.items) {
              this.goodsList = dailySec.items.map(item => ({
                id: item.product_id,
                local_id: item.id,
                name: item.title,
                img: item.img,
                price: item.sell_price,
                market_price: item.market_price || "",
                platform: 4
              }));
            }

            // 底部商品瀑布流
            const goodsSec = data.sections.find(s => s.title === "首页图");
            if (goodsSec && goodsSec.items) {
              this.goodsList = goodsSec.items.map(item => ({
                id: item.product_id,
                local_id: item.id,
                name: item.title,
                img: item.img,
                price: item.sell_price,
                market_price: item.market_price || "",
                platform: 4
              }));
            }
          }
        }
      } catch (err) {
        console.error("channelDetail 失败:", err);
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }, mounted() {
    this.fetchHomeData();
  }
}
</script>

<style scoped lang="less">
.exclusive-page {
  background: #00B1F8;
  min-height: 100vh;

}

/* ================= 顶部导航 ================= */
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

/* ================= 黄色 Banner ================= */
.banner-area {
  width: 100%;
  height: 206px;
  background: #FFDB85;
  /* 如果有真实的图，请把下面的 img 打开并注释掉背景 */
  display: flex;
  align-items: center;
  justify-content: center;

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ================= 列表 ================= */
.list-wrapper {
  padding: 10px 12px 10px 12px;
}

.list-item {
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  align-items: center;

  .item-img-box {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 12px;
    background: #f5f6fa;
    border-radius: 8px;

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
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
      margin-bottom: 6px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .item-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;

      .tag-orange {
        font-size: 10px;
        color: #00B1F8;
        background: #ffffff;
        padding: 1px 5px 2px 5px;
        border-radius: 2px;
        border: 1px solid #00B1F8;
      }
    }

    .item-bottom {
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
        font-size: 18px;
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
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>