<template>
  <div class="appliance-recommend-page" :style="pageBgStyle">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="家电Banner" />
    </div>

    <!-- 3. 浅蓝色大卡片容器 -->
    <div class="blue-card-container">

      <!-- --- 分组 1：新品启动 --- -->
      <div class="goods-group">
        <!-- 分类标题居中 -->
        <div class="group-header">
          {{ title1 }} </div>

        <!-- 3个商品 (左图右文) -->
        <div class="group-items">
          <div class="group-item" v-for="(item, index) in newArrivalList" :key="index" @click="goToDetail(item)">
            <img class="item-img" :src="item.img" alt="" />
            <div class="item-info">
              <div class="item-name">{{ item.title }}</div>
              <div class="item-tags">
                <span class="tag-orange" v-if="item.tag">{{ item.tag }}</span>
              </div>
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

      <!-- --- 分组 2：清凉计划 --- -->
      <div class="goods-group">
        <!-- 分类标题居中 -->
        <div class="group-header"> 
          {{ title2 }} </div>

        <!-- 3个商品 (左图右文) -->
        <div class="group-items">
          <div class="group-item" v-for="(item, index) in coolPlanList" :key="index" @click="goToDetail(item)">
            <img class="item-img" :src="item.img" alt="" />
            <div class="item-info">
              <div class="item-name">{{ item.title }}</div>
              <div class="item-tags">
                <span class="tag-orange" v-if="item.tag">{{ item.tag }}</span>
              </div>
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

      <!-- --- 3. 更多推荐 (通栏标题 + 下面双列瀑布流) --- -->
      <div class="more-recommend-box">
        <div class="more-header"> {{ title3 }}
          </div>

        <div class="goods-grid">
          <div class="goods-item" v-for="(item, index) in moreList" :key="index" @click="goToDetail(item)">
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
                <div class="add-cart-btn">+</div>
              </div>
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
  name: "ApplianceRecommend",
  data() {
    return {
      title3: '',
      title2: '',
      title1: '',
      pageBgStyle: {},
      pageBgStyle1: {},
      baners: '',
      // 新品启动 - 正好3个
      newArrivalList: [
       ],
      // 清凉计划 - 正好3个
      coolPlanList: [
         ],
      // 更多推荐 - 双列
      moreList: [
        ]
    }
  }, mounted() {
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
    // 新增：获取频道详情
    channelDetailIndex() {
      channelChildrenDetaill({ id: this.$route.query.id, nav_index: this.$route.query.nav, child_index: this.$route.query.index }).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.baners = res.data.banner[0].img;
          this.newArrivalList = res.data.sections[0].items;
          this.coolPlanList = res.data.sections[1].items;
          this.moreList = res.data.sections[2].items;

          this.title1 = res.data.sections[0].title;
          this.title2 = res.data.sections[1].title;
          this.title3 = res.data.sections[2].title;



          const bgColorStr = res.data.bg_color || '';
          const colors = bgColorStr.split(',').map(item => item.trim()).filter(item => item);
          this.pageBgStyle = {
            backgroundColor: colors[0]
          };
          this.pageBgStyle1 = {
            color: colors[1]
          };

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
  display: inline-block; 
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 2px;  margin-bottom: 4px;
}
.appliance-recommend-page {
  background: #C2EDFF;
  /* 页面最外层灰色 */
  min-height: 100vh;
  padding-bottom: 50px;
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

  .nav-left .back-icon {
    font-size: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  width: 100%;

  // padding: 10px;
  .banner-img {
    width: 100%;
    object-fit: cover;
  }
}

/* ================= 3. 浅蓝色大卡片容器 ================= */
.blue-card-container {
  // margin: 0 10px 20px 10px;

  border-radius: 12px;
  padding: 10px;
}

/* --- 单个分组 --- */
.goods-group {
  margin-bottom: 24px;

  /* 标题居中 */
  .group-header {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;

    span {
      font-weight: normal;
      font-size: 13px;
      color: #666;
    }
  }

  /* 左图右文列表 */
  .group-items {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .group-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);

      .item-img {
        width: 76px;
        height: 76px;
        flex-shrink: 0;
        margin-right: 10px;
        background: #f5f6fa;
        border-radius: 6px;
        object-fit: contain;
      }

      .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .item-name {
          font-size: 13px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .item-tags {
          display: flex;
          gap: 4px;
          margin-bottom: 6px;

          .tag-orange {
            border: 1px solid #3C80CD;
            font-size: 10px;
            color: #3C80CD;
            background: #ffffff;
            padding: 1px 4px;
            border-radius: 4px;
          }
        }

        .item-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-box {
          color: #d32f2f;

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
          font-weight: bold;
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
        }
      }
    }
  }
}

/* --- 更多推荐 (居中标题 + 双列) --- */
.more-recommend-box {
  margin-top: 8px;

  .more-header {
    text-align: center;
    font-size: 14px;
    color: #333;
    margin-bottom: 16px;
    font-weight: 600;
  }

  .goods-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .goods-item {
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      padding-bottom: 10px;

      .goods-img {
        width: 100%;
        aspect-ratio: 1/1;
        background: #f0f0f0;
        object-fit: cover;
      }

      .goods-info {
        padding: 8px 10px 0px 10px;
      }

      .goods-name {
        font-size: 13px;
        font-weight: 500;
        color: #333;
        margin-bottom: 1px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.4;
        -webkit-box-orient: vertical;   
      }

      .goods-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin-bottom: 6px;

        .tag {
          font-size: 9px;
          color: #ed2e33;
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
          font-size: 15px;
          font-weight: bold;
        }
      }

      .add-cart-btn {
        width: 20px;
        height: 20px;
        font-weight: bold;
        background: #ed2e33;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}

// .bottom-safe { height: 20px; }
</style>