<template>
  <div class="light-food-page" :style="pageBgStyle">
    <!-- 1. 顶部导航 -->

    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="轻卡Banner" />
    </div>

    <!-- 3. 绿色背景区域 -->
    <div class="green-bg-container">

      <!-- ===== 板块 1：早安食光 ===== -->
      <div class="section-wrapper">
        <div class="section-title-bar">
          <span class="title-text" :style="pageBgStyle1">{{title1}}</span>
        </div>
        <div class="goods-grid-3">
          <div class="goods-item" v-for="(item, index) in morningList" :key="index" @click="goToDetail(item)">
            <img class="item-img" :src="item.img" alt="" />
            <div class="item-name">{{ item.title }}</div>
            <div class="item-bottom">
              <span class="price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
              <span class="add-btn">+</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 板块 2：悦享时光 ===== -->
      <div class="section-wrapper">
        <div class="section-title-bar">
          <span class="title-text" :style="pageBgStyle1">{{title2}}</span>
        </div>
        <div class="goods-grid-3">
          <div class="goods-item" v-for="(item, index) in enjoyList" :key="index" @click="goToDetail(item)">
            <img class="item-img" :src="item.img" alt="" />
            <div class="item-name">{{ item.title }}</div>
            <div class="item-bottom">
              <span class="price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
              <span class="add-btn">+</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 板块 3：更多推荐 (双列瀑布流) ===== -->
      <div class="section-wrapper">
        <div class="section-title-bar">
          <span class="title-text" :style="pageBgStyle1">{{title3}}</span>
        </div>
        <div class="goods-grid-2">
          <div class="goods-item-2" v-for="(item, index) in moreList" :key="index" @click="goToDetail(item)">
            <img class="goods-img" :src="item.img" alt="" />
            <div class="goods-info">
              <div class="goods-name">{{ item.title }}</div>
               <span class="platform-tag" v-if="getPlatformName(item.platform)">
                  {{ getPlatformName(item.platform) }}
                </span>
              <div class="goods-tags">
                <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
              </div>
              <div class="goods-bottom">
                <div class="price-box">
                  <span class="symbol"><span style="font-size: 10px;font-weight: bold;">¥</span></span>
                  <span class="price">{{ item.sell_price }}</span>
                </div>
                <div class="add-btn">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import { getPlatformName } from '@/utils/platform'
import { channelChildrenDetaill } from "@/api/lhjdtm";
export default {
  name: "LightFoodZone",
  data() {
    return {
      title3:'',
      title2:'',
      title1:'',
      pageBgStyle:{},
      pageBgStyle1:{},
      baners: '',
      // 板块 1：早安食光 (6个商品)
      morningList: [

      ],
      // 板块 2：悦享时光 (6个商品)
      enjoyList: [

      ],
      // 板块 3：更多推荐 (双列)
      moreList: [

      ]
    }
  },
  mounted() {
    this.channelDetailIndex()
  },
  methods: {
     // 获取平台名称
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
          this.morningList = res.data.sections[0].items;
          this.enjoyList = res.data.sections[1].items;
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
  margin-top: 4px;
}
.light-food-page {
  background: #F9D89F;
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
    object-fit: cover;
  }
}

/* ================= 3. 绿色背景区域 ================= */
.green-bg-container {
  // background: #8CBF55; /* 整体绿色背景 */
  padding: 0 10px 20px 10px;


}

/* ===== 单个板块 ===== */
.section-wrapper {
  padding-top: 16px;

  .section-title-bar {

    border-radius: 30px;
    padding: 8px 20px;
    margin-bottom: 16px;
    display: table;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  /* 3列网格 */
  .goods-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .goods-item {
      background: #ffffff;
      border-radius: 10px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

      .item-img {
        width: 100%;
        // height: 60px;
        background: #f5f6fa;
        border-radius: 10px 10px 0 0;
        object-fit: cover;
        margin-bottom: 6px;
      }

      .item-name {
        font-size: 11px;
        color: #333;
        text-align: left;
        line-height: 1.3;
        height: 28px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
        padding: 0 10px;
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-bottom: 6px;

        .price {
          font-size: 14px;
          color: #ed2e33;
          font-weight: bold;
          padding-left: 10px;
        }

        .add-btn {
          margin-right: 10px;
          width: 18px;
          height: 18px;
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

  /* 双列网格 (更多推荐) */
  .goods-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding-bottom: 16px;

    .goods-item-2 {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      padding-bottom: 2px;

      .goods-img {
        width: 100%;
        aspect-ratio: 1/1;
        background: #f0f0f0;
        object-fit: cover;
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
        overflow: hidden;
        line-height: 1.4; -webkit-box-orient: vertical;  /* ✅ 新增这一行 */
      }

      .goods-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin-bottom: 6px;

        .tag {
          font-size: 10px;
          color: #ff4d30;
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

.bottom-safe {
  height: 20px;
}
</style>