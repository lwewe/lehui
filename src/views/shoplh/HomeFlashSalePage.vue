<template>
  <div class="flash-sale-page">
 <NProgress v-if="loading" />

    <!-- 2. 顶部大 Banner (红色礼盒) -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="秒杀Banner" />
    </div>

    <!-- 4. 今日疯抢模块 (橙色卡片) -->
    <div class="today-rush-card">
      <div class="rush-header">

      </div>

      <!-- 3列横向秒杀商品 -->
      <div style="background: linear-gradient( 270deg, #FEAA48 0%, #FF4423 100%);
border-radius: 8px 8px 0px 0px;padding: 9px 0 10px 10px;font-weight: bold;">
        <span class="title" style="font-size: 15px ;color: #ffffff;"><span class="fire-icon">
            <!-- <img src="../../assets/ht.png" style="width: 16px;position: relative;top: 2px;" alt=""> -->
          </span>今日疯抢</span>
      </div>
      <div style="padding: 10px;background: #ffffff;border-radius: 0 0 8px 8px;">
        <div class="rush-grid">
          <div class="rush-item" v-for="(item, index) in rushList" :key="index">
            <div class="item-img-box">
              <img class="item-img" :src="item.img" alt="" />
            </div>
            <div class="item-name">{{ item.title }}</div>
            <!-- <div class="item-tags">
              <span class="tag-down" v-if="item.market_price && item.sell_price">直降 ¥{{ (item.market_price -
                item.sell_price).toFixed(2) }}</span>
            </div> -->
            <div class="item-bottom">
              <div class="price-box">
                <div style="">
                  <span class="symbol">¥</span>
                  <span class="price">{{ item.sell_price }}</span>
                </div>
                <span class="old-price" v-if="item.market_price">¥{{ item.market_price }}</span>
              </div>
              <div class="rush-btn" @click="goToDetail(item)">抢</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 分类 Tab 切换 (黄色背景) -->
    <div style="padding: 0 10px;">
      <div class="bgred"></div>
    </div>
    <div class="tab-section">
      <div class="bg">
        <div class="category-tabs">
          <div class="tab-btn" v-for="(tab, index) in categoryTabs" :key="index"
            :class="{ active: activeCategory === index }" @click="activeCategory = index">
            {{ tab }}
            <span></span>
          </div>
        </div>
      </div>
      <!-- 7. 商品列表 (左图右文) -->
      <div class="list-wrapper">
        <div class="list-item" v-for="(item, index) in currentGoodsList" :key="index">
          <div class="list-img-box">
            <img class="list-img" :src="item.img" alt="" />
          </div>
          <div class="list-info">
            <div class="list-name">{{ item.title }}</div>
            <div class="list-tags"  v-if="getPlatformName(item.platform)">
               {{ getPlatformName(item.platform, item.jd_type || item.items?.[0]?.jd_type) }}
            </div>
            <div class="list-bottom">
              <div class="price-box">
                <div class="price-line">
                  <span class="symbol">¥</span>
                  <span class="price">{{ item.sell_price }}</span>
                  <span class="old-price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.market_price
                    }}</span>
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
    return {loading: false,      // 新增
      baners: '',
      activeCategory: 0,
      rushList: [],
      categoryTabs: [],
      tabGoodsData: {
        0: [],
        1: [],
        2: [],
        3: []
      }
    }
  },
  computed: {
    currentGoodsList() {
      return this.tabGoodsData[this.activeCategory] || [];
    }
  },
   activated() {
  // 每次进入都重新请求
  this.zoneListIndex();
},
  mounted() {
    this.zoneListIndex();
  },
  methods: {
    getPlatformName,
    zoneListIndex() {
  this.loading = true;          // 请求开始，显示全屏加载

  zoneList()
    .then(res => {
      if (res.code == 200) {
        let allZones = res.data.list || [];

        // 1. 今日疯抢：取 id=5 的商品
        let rushZone = allZones.find(zone => zone.id == 5);
        if (rushZone && rushZone.goods) {
          this.rushList = rushZone.goods.slice(0, 3);
        }
        this.baners = rushZone.img;

        // 2. 分类 Tab：根据 id 对应
        allZones.forEach(zone => {
          if (zone.id == 6) {
            this.tabGoodsData[0] = zone.goods || [];
          } else if (zone.id == 7) {
            this.tabGoodsData[1] = zone.goods || [];
          } else if (zone.id == 8) {
            this.tabGoodsData[2] = zone.goods || [];
          } else if (zone.id == 9) {
            this.tabGoodsData[3] = zone.goods || [];
          }
        });
      }
    })
    .finally(() => {
      this.loading = false;     // 成功或失败都关掉
    });
},
    goToDetail(item) {
      this.$goDetail(item);
      
      // this.$router.push({ path: '/productDetail', query: { id: item.id } });
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
  // padding: 12px;

  // border-radius: 16px;
  // box-shadow: 0 4px 12px rgba(255, 94, 58, 0.2);

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
  // background: #FEEAB3; /* 淡黄色背景 */
  // margin: 0 10px 12px 10px;
  // border-radius: 16px;
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

      // span{
      //   width: 20px;height: 5px;border-radius: 5px;position: absolute;bottom: 0;left: 0;
      // }
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
        // border-bottom: 3px solid #A61616;
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
       // display: flex;
       // gap: 4px;
display: inline-block;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
 // margin-top: 4px;
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