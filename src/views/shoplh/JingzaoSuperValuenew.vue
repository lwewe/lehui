<template>
  <div class="super-value-page" :style="pageStyle">

    

    <!-- 2. 顶部大 Banner -->
    <div class="banner-area">
      <img class="banner-img" :src="bannerImg" alt="Banner" />
    </div>

    <!-- 3. 商品列表区域 -->
    <div class="goods-container">
      <div class="goods-list" v-if="goodsList.length > 0">
        <div class="goods-item" v-for="(item, index) in goodsList" :key="item.id || index" @click="goToDetail(item)">

          <!-- 商品图片区域 (包含角标) -->
          <div class="img-wrapper">
            <div class="rank-badge" v-if="index < 3">{{ index + 1 }}</div>
            <img class="goods-img" :src="item.img" alt="" />
          </div>

          <!-- 商品信息 -->
          <div class="goods-info">
            <div class="goods-name">{{ item.title }}</div>

            <div class="goods-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div>

            <div class="goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
                <!-- ✅ 加兜底判断，避免 market_price 为 undefined 时的隐式比较 -->
                <span
                  class="original-price"
                  v-if="item.market_price && Number(item.sell_price) < Number(item.market_price)"
                >¥{{ item.market_price }}</span>
              </div>
              <!-- <div class="add-btn" @click="addToCart(item)">+</div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-tip" v-else>
        暂无推荐商品
      </div>
    </div>

  </div>
</template>

<script>
import { home, channelDetail } from "@/api/lhjdtm";

export default {
  name: "JingzaoSuperValue",
  data() {
    return {
      pageStyle: {},      // ✅ 原 bgColor 改名，语义更准确
      bannerImg: '',
      goodsList: [],
      categoryList: [],   // ✅ 补上声明，避免非响应式
      loading: false,
      isFirstLoad: true,  // ✅ 防止 mounted + activated 重复请求
    }
  },
  methods: {
    channelDetailIndex() {
      // ✅ 支持从路由 query 传入 id，默认 13，和 BeautyZone 的跳转解耦
      const channelId = Number(this.$route.query.id) || 13;

      channelDetail({ id: channelId }).then(res => {
        if (res.code !== 200) return;

        const data = res.data || {};
        const modules = data.modules || [];

        // 1. banner 模块：取 banner 图（原空 if 补上赋值）
        const bannerModule = modules.find(m => m.type === 'banner');
        // if (bannerModule && bannerModule.banner_img) {
        //   this.bannerImg = bannerModule.banner_img;
        // }

        // 2. 推荐 grid 模块：取商品列表、背景色
        const gridModule = modules.find(m => m.type === 'grid');
        console.log(gridModule.sort + 'sort')
        this.bannerImg = gridModule.banner_img || ''
        if (gridModule) {
          this.goodsList = gridModule.items || [];
          // ✅ banner 若 banner 模块没给，再回退到 grid 模块
          // if (!this.bannerImg) {
          //   this.bannerImg = gridModule.banner_img || '';
          // }
          this.pageStyle = gridModule.bg_color
            ? { backgroundColor: gridModule.bg_color }
            : {};
        }

        // 3. entry 图标模块
        const entryModule = modules.find(m => m.type === 'entry');
        if (entryModule) {
          this.categoryList = (entryModule.items || []).map(item => ({
            id: item.cate_id || item.id,
            img: item.img,
            title: item.title,
            link: item.link
          }));
        }
      }).catch(err => {
        console.error('channelDetail 请求失败:', err);
      });
    },

    goToDetail(item) {
      console.log('查看商品详情:', item);
      this.$goDetail(item);
    },

    // 获取超值推荐数据（保留，若不需要可删）
    getRecommendData() {
      this.loading = true;
      home({ platform: 3, limit: 10 }).then(res => {
        if (res.code == 200) {
          const data = res.data || {};
          if (data.recommend && data.recommend.length) {
            this.goodsList = data.recommend;
          } else if (data.hot && data.hot.length) {
            this.goodsList = data.hot;
          } else if (data.new && data.new.length) {
            this.goodsList = data.new;
          }
        }
      }).finally(() => {
        this.loading = false;
      });
    },

    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      }
      return num;
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    goBack() {
      this.$router.go(-1);
    }
  },

  mounted() {
    // ✅ 首次加载交给 mounted，activated 里跳过第一次
    this.channelDetailIndex();
    this.isFirstLoad = false;
  },
  activated() {
    // ✅ 只有非首次进入（从缓存返回）才重新请求
    if (!this.isFirstLoad) {
      this.channelDetailIndex();
    }
  },
}
</script>

<style scoped lang="less">
/* 样式部分保持不变，只把 .super-value-page 的注释说明一下 */
.super-value-page {
  min-height: 100vh;
  padding-bottom: 0px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: transparent;
  position: relative;
  z-index: 10;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 24px;
  }

  .nav-left { justify-content: flex-start; }
  .nav-right { justify-content: flex-end; }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}

/* ================= 2. 顶部 Banner ================= */
.banner-area {
  width: 100%;
  position: relative;

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ================= 3. 商品列表容器 ================= */
.goods-container {
  padding: 12px 12px 20px 12px;
  border-radius: 16px 16px 0 0;
  margin-top: -10px;
  position: relative;
  z-index: 2;
  min-height: 60vh;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .goods-item {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(244, 119, 119, 0.05);
    display: flex;
    flex-direction: column;

    .img-wrapper {
      position: relative;
      width: 100%;
      background: #FFFDFD;

      .goods-img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        display: block;
      }

      .rank-badge {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 225, 130, 0.9);
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        padding: 4px 14px 4px 8px;
        clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        border-top-left-radius: 10px;
        z-index: 2;
        min-width: 20px;
        text-align: center;
        line-height: 1;
      }
    }

    .goods-info {
      padding: 10px 10px 6px 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
        min-height: 28px;
      }

      .goods-subtitle {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-box {
          display: flex;
          align-items: baseline;
          gap: 3px;

          .symbol {
            font-size: 12px;
            color: #FD4C38;
            font-weight: bold;
          }

          .price {
            font-size: 18px;
            font-weight: 600;
            color: #ed2e33;
          }

          .original-price {
            font-size: 11px;
            color: #999;
            text-decoration: line-through;
            margin-left: 2px;
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
          line-height: 1;
          cursor: pointer;
        }
      }

      .sale-info {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
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