<template>
  <div class="super-value-list">
    <!-- 1. 顶部导航 -->

    <!-- 2. 顶部 Banner (通栏) -->
    <div class="banner-area">
      <img class="banner-img" src="../../assets/lh/jdzy/b1.jpg" alt="Banner" />
    </div>

    <!-- 3. 商品列表 (左图右文结构) -->
    <div class="list-wrapper" v-if="goodsList.length > 0">
      <div
        class="list-item"
        v-for="(item, index) in goodsList"
        :key="index"
        @click="goToDetail(item)"
      >
        <!-- 左侧：商品图片 -->
        <div class="item-img-box">
          <img class="item-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧：商品信息 -->
        <div class="item-info">
          <!-- 标题 -->
          <div class="item-title">{{ item.title }}</div>

          <!-- 底部长条胶囊 (价格 + 加号按钮) -->
          <div class="price-capsule">
            <div class="capsule-left">
              <div class="price-tag-icon">
                <img
                  src="../../assets/lh/jdzy/8.png"
                  style="height: 14px; margin-right: 4px; display: inline-block;"
                />
              </div>
              <div class="price-box">
                <span class="price-label">到手价</span>
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
                <span class="original-price" v-if="item.market_price">
                  ¥{{ item.market_price }}
                </span>
              </div>
            </div>

            <!-- 右侧加号按钮 -->
            <div class="add-btn" @click.stop="addToCart(item)">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-tip" v-else-if="!loading">暂无商品</div>
  </div>
</template>

<script>
import { channelDetail } from "@/api/lhjdtm";

export default {
  name: "SuperValueList",
  data() {
    return {
      platform: 1,                                // 默认京东平台
      type: this.$route.query.type || "recommend",// 路由 type
      loading: false,
      goodsList: [],

      /**
       * 路由 type -> sections 索引 映射
       * 只根据索引取数据，不依赖后端 title 文字
       * sections 顺序： [热销推荐, 超值购, 上新了, 首页下面得]
       */
      typeIndexMap: {
        hot: 0,        // 热销推荐
        recommend: 1,  // 超值购
        new: 2         // 上新了
      }
    };
  },
  watch: {
  '$route.query.type'(newType) {
    if (newType) {
      this.type = newType;
      this.channelDetailIndex();  // 重新取数
    }
  }
},
  methods: {
    // 根据路由 type 索引从 sections 取数据
    channelDetailIndex() {
      const fixImg = (url) => (url ? url.replace("http://", "https://") : "");

      this.loading = true;

      channelDetail({ id: 14 })
        .then((res) => {
          if (res.code == 200) {
            const data = res.data || {};

            // 1. Banner（接口返回则覆盖）
            if (data.banner && data.banner.length > 0) {
              this.bannerImg = fixImg(data.banner[0].img);
            }

            // 2. 根据 type 索引取 sections 数据
            if (data.sections && data.sections.length > 0) {
              const index = this.typeIndexMap[this.type] ?? 1; // 默认超值购
              const section = data.sections[index];

              if (section && Array.isArray(section.items)) {
                this.goodsList = section.items.map((p) => ({
                  ...p,
                  img: fixImg(p.img)
                }));
              } else {
                this.goodsList = [];
              }
            } else {
              this.goodsList = [];
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 格式化销量
    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + "万";
      }
      return num;
    },

    // 查看商品详情
    goToDetail(item) {
      if (item.id) {
        this.$router.push({
          path: "/ProductDetail",
          query: { id: item.id }
        });
      }
    },

    // 加入购物车
    addToCart(item) {
      console.log("加入购物车:", item);
    },

    goBack() {
      this.$router.go(-1);
    }
  },

  created() {
    // 接收路由参数
    if (this.$route.query.type) {
      this.type = this.$route.query.type;
    }
    if (this.$route.query.platform) {
      this.platform = Number(this.$route.query.platform);
    }
  },

  mounted() {
    this.channelDetailIndex();
  }
};
</script>

<style scoped lang="less">
.super-value-list {
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
    display: flex;
    align-items: center;
    width: 24px;
  }

  .nav-left {
    justify-content: flex-start;
  }

  .nav-right {
    justify-content: flex-end;
    letter-spacing: 2px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 2. Banner ================= */
.banner-area {
  width: 100%;
  line-height: 0;

  .banner-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
}

/* ================= 3. 商品列表 ================= */
.list-wrapper {
  padding: 0px 12px 10px 12px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  /* 左侧图片 */
  .item-img-box {
    width: 106px;
    height: 106px;
    border-radius: 8px;
    background: #f8f8f8;
    flex-shrink: 0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  /* 右侧信息 */
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .item-title {
      font-size: 15px;
      color: #333;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-subtitle {
      font-size: 12px;
      color: #999;
      margin-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;

      .tag-red {
        font-size: 11px;
        color: #fff;
        background: #FA2C19;
        padding: 1px 6px;
        border-radius: 4px;
      }

      .tag-blue {
        font-size: 11px;
        color: #28AFB4;
        background: #f3fafb;
        border: 1px solid #28AFB4;
        padding: 0px 5px;
        border-radius: 4px;
      }
    }

    /* 长条胶囊 */
    .price-capsule {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFF4EB;
      padding: 6px 6px 6px 12px;
      border-radius: 8px 30px 30px 8px;

      .capsule-left {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .price-tag-icon {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #FA6E2B;
          font-weight: 500;
        }

        .price-box {
          display: flex;
          align-items: baseline;
          gap: 2px;

          .price-label {
            font-size: 14px;
            color: #F92D1A;
            margin-right: 2px;
          }

          .symbol {
            font-size: 10px;
            color: #ed2e33;
            font-weight: bold;
          }

          .price {
            font-size: 18px;
            color: #ed2e33;
            font-weight: bold;
          }

          .original-price {
            font-size: 11px;
            color: #999;
            text-decoration: line-through;
            margin-left: 4px;
          }
        }
      }

      .add-btn {
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #FF8533, #FF4D00);
        color: #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;

        cursor: pointer;
        flex-shrink: 0;
        line-height: 1;
        font-weight: bold;
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