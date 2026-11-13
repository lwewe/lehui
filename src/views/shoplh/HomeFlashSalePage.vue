<template>
  <div class="flash-sale-page">
    <NProgress v-if="loading" />

    <!-- 2. 顶部大 Banner (红色礼盒) -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="秒杀Banner" />
    </div>

    <!-- 4. 今日疯抢模块 (顶部横排商品) -->
    <div class="today-rush-card">
      <div class="rush-header"></div>
      <div style="background: linear-gradient( 270deg, #FEAA48 0%, #FF4423 100%); border-radius: 8px 8px 0px 0px; padding: 9px 0 10px 10px; font-weight: bold;">
        <span class="title" style="font-size: 15px; color: #ffffff;">
          <span class="fire-icon"></span>今日疯抢
        </span>
      </div>
      <div style="padding: 10px; background: #ffffff; border-radius: 0 0 8px 8px;">
        <!-- 对应 script 中的 rushList (水果的3个商品) -->
        <div class="rush-grid">
          <div class="rush-item" v-for="(item, index) in rushList" :key="index">
            <div class="item-img-box">
              <img class="item-img" :src="item.img" alt="" />
            </div>
            <div class="item-name">{{ item.title }}</div>
            <div class="item-bottom">
              <div class="price-box">
                <div>
                  <span class="symbol">¥</span>
                  <span class="price">{{ item.sell_price }}</span>
                </div>
                <span class="old-price" v-if="item.sell_price < item.market_price">¥{{ item.market_price }}</span>
              </div>
              <div class="rush-btn" @click="goToDetail(item)">抢</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 分类 Tab 切换 (下方黄色背景) -->
    <div style="padding: 0 10px;">
      <div class="bgred"></div>
    </div>
    <div class="tab-section">
      <div class="bg">
        <div class="category-tabs">
          <!-- 对应 script 中的 categoryTabs (截取后的剩余模块) -->
          <div class="tab-btn" v-for="(tab, index) in categoryTabs" :key="tab.id"
            :class="{ active: activeCategory === index }" @click="switchTab(index)">
            {{ tab.title }}
            <span></span>
          </div>
        </div>
      </div>
      <!-- 7. 商品列表 (左图右文) -->
      <div class="list-wrapper">
        <!-- 对应 script 中的 currentGoodsList (当前选中的商品) -->
        <div class="list-item" v-for="(item, index) in currentGoodsList" :key="index">
          <div class="list-img-box">
            <img class="list-img" :src="item.img" alt="" />
          </div>
          <div class="list-info">
            <div class="list-name">{{ item.title }}</div>
            <div class="list-tags" v-if="getPlatformName(item.platform)">
              {{ getPlatformName(item.platform, item.jd_type || item.items?.[0]?.jd_type) }}
            </div>
            <div class="list-bottom">
              <div class="price-box">
                <div class="price-line">
                  <span class="symbol">¥</span>
                  <span class="price">{{ item.sell_price }}</span>
                  <span class="old-price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.market_price }}</span>
                </div>
              </div>
              <div class="lightning-btn" @click="goToDetail(item)">抢</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import { zoneList } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'

export default {
  name: "FlashSalePage",
  data() {
    return {
      loading: false,
      baners: this.$route.query.img,
      activeCategory: 0,       // 当前选中的 Tab 索引
      rushList: [],            // 顶部（水果）模块的商品
      categoryTabs: [],        // 下方 Tabs (清洁护肤、饮料大等)
      allTabsData: [],         // 保存所有 Tab 对应的商品数据
      currentGoodsList: [],    // 当前下方列表渲染的商品
    }
  },
  activated() {
    this.zoneListIndex();
  },
  mounted() {
    this.zoneListIndex();
  },
  methods: {
    getPlatformName,
    
    zoneListIndex() {
      this.loading = true;
      zoneList({ pid: 31 }) // 你的固定请求
        .then(res => {
          if (res.code === 200) {
            // 1. 获取完整的模块列表
            let allZones = res.data.list || [];
            
            if (allZones.length === 0) return;

            // 2. 把【第一个模块】(水果) 提取出来，作为顶部的今日疯抢
            let topZone = allZones[0]; // 对应你数据里的 "水果"
            this.rushList = topZone.goods || [];
            // this.baners = topZone.img || '';

            // 3. 把【剩下的模块】提取出来，作为下方的 Tabs 和 商品列表
            // allZones.slice(1) 会截取掉第一项，剩下：清洁护肤、饮料大、粮油副食等
            this.categoryTabs = allZones.slice(1);

            // 4. 初始化下方 Tab 的商品数据
            this.allTabsData = this.categoryTabs.map(item => item.goods || []);
            
            // 5. 默认显示第一个 Tab (清洁护肤) 的商品
            if (this.allTabsData.length > 0) {
              this.currentGoodsList = this.allTabsData[0];
            }
          }
        })
        .catch(err => {
          console.error("请求失败", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 点击下方的 Tab 切换商品
    switchTab(index) {
      this.activeCategory = index;
      // 直接通过索引从缓存数组中拿数据，不需要重新请求接口，速度更快
      this.currentGoodsList = this.allTabsData[index] || [];
    },

    goToDetail(item) {
      this.$goDetail(item);
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
  margin-top: 4px;width: max-content;
}
.flash-sale-page {
  background: #D7000F;
  /* 整体大红色背景 */
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
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  .banner-img {
    width: 100%;
    object-fit: cover;
    background: #f0f0f0;
  }
}

/* ================= 3. 装饰丝带 ================= */
.ribbon-img-box {
  padding: 0 10px 12px 10px;

  .ribbon-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}

/* ================= 4. 今日疯抢模块 ================= */
.today-rush-card {
  margin: 0 10px 12px 10px;

  .rush-header {
    background: url(../../assets/lh/ms2.png) top no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 58px;

    .header-right {
      padding-top: 70px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      padding-right: 10px;

      .label {
        font-size: 12px;
      }

      .countdown-box {
        display: flex;
        align-items: center;
        gap: 2px;

        .num {
          background: #fff;
          color: #F56A32;
          font-weight: bold;
          font-size: 12px;
          padding: 2px 4px;
          border-radius: 4px;
          min-width: 16px;
          text-align: center;
        }

        .colon {
          font-weight: bold;
          font-size: 12px;
        }
      }
    }
  }

  .rush-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;

    .rush-item {
      background: #fff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .item-img-box {
        width: 60px;
        height: 60px;
        margin-bottom: 4px;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .item-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .item-name {
        font-size: 11px;
        color: #333;
        text-align: center;
        line-height: 1.2;
        height: 11px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 90%;
        margin-bottom: 2px;
      }

      .item-tags {
        margin-bottom: 4px;
        width: 100%;
        text-align: center;
      }

      .tag-down {
        font-size: 10px;
        color: #F56A32;
        background: #FEF0F0;
        border: 1px solid #F56A32;
        padding: 1px 6px;
        border-radius: 4px;
      }

      .item-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 80%;
        padding-bottom: 6px;

        .price-box {
          display: flex;
          flex-direction: column;
          color: #d32f2f;
          display: flex;
          align-items: baseline;
          gap: 2px;

          .symbol {
            font-size: 10px;
            font-weight: bold;
          }

          .price {
            font-size: 14px;
            font-weight: bold;
          }

          .old-price {
            font-size: 9px;
            color: #999;
            text-decoration: line-through;
          }
        }

        .rush-btn {
          background: #d32f2f;
          color: #fff;
          font-size: 12px;
          font-weight: bold;
          padding: 0 10px;
          border-radius: 12px;
          height: 20px;
          line-height: 20px;
          cursor: pointer;
        }
      }
    }
  }
}

.bgred {
  background: url(../../assets/lh/ms2.png) top no-repeat;
  background-size: cover;
  height: 58px;
}

/* ================= 5. 分类 Tab ================= */
.tab-section {
  padding: 0 10px 10px 10px;

  .category-tabs {
    background: linear-gradient(180deg, #FEE7A6 0%, #FBCA72 100%);
    border-radius: 8px 8px 0px 0px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    padding-top: 10px;

    .tab-btn {
      font-size: 15px;
      font-weight: 500;
      color: #7A5925;
      padding: 4px 0;
      cursor: pointer;
      flex: 1;
      text-align: center;
      position: relative;

      &.active {
        span {
          background-color: A61616;
          width: 20px;
          height: 5px;
          border-radius: 5px;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        color: #240003;
        font-weight: bold;
      }
    }
  }

  .list-wrapper {
    padding-bottom: 8px;
    background: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .list-item {
    display: flex;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

    .list-img-box {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      margin-right: 12px;
      background: #f5f6fa;
      border-radius: 8px;
    }

    .list-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .list-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .list-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.4;
      }

      .list-tags {
        margin-bottom: 6px;
        display: inline-block;
        background-color: #DD0A09;
        color: #ffffff;
        border-radius: 2px;
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        padding: 1px 4px;
        width: max-content;
      }

      .tag-orange {
        margin-bottom: 4px;
        font-size: 10px;
        color: #fff;
        background: linear-gradient(90deg, #FEAA48 0%, #FF4423 100%);
        padding: 1px 6px;
        border-radius: 20px;
      }

      .list-bottom {
        display: flex;
        background: #FAF0F2;
        border-radius: 30px;
        justify-content: space-between;
        align-items: center;

        .price-box {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .price-line {
            display: flex;
            align-items: baseline;
            gap: 4px;

            .symbol {
              padding-left: 10px;
              font-size: 10px;
              color: #333;
              font-weight: bold;
            }

            .price {
              font-size: 16px;
              color: #333;
              font-weight: bold;
            }

            .old-price {
              font-size: 11px;
              color: #999;
              text-decoration: line-through;
            }
          }

          .down-line {
            .down-text {
              font-size: 10px;
              color: #d32f2f;
              border: 1px solid #d32f2f;
              padding: 0 4px;
              border-radius: 2px;
            }
          }
        }

        .lightning-btn {
          background: #D7000F;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          padding: 0 14px;
          height: 28px;
          line-height: 28px;
          border-radius: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>