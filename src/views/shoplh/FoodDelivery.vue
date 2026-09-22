<template>
  <div class="food-page">
    <!-- 1. 顶部 Banner -->
    <div class="top-banner">
      <!-- <div class="banner-bg">
        <div class="title">美食狂欢季</div>
        <div class="subtitle">好味上新 即刻开吃</div>
      </div> -->
      <img class="banner-img" src="../../assets/lh/b-1.png" alt="Banner" />
    </div>

    <!-- 2. 在线点餐（到店/外卖） -->
    <div class="section-card pink-bg">
      <div class="section-header">
        <div class="title-box">
          <span class="main-title">在线点餐</span>
          <span class="sub-title">到店&外卖</span>
        </div>
      </div>

      <!-- 大卡片：美团 + 淘宝闪购 -->
      <div class="big-row">
        <div class="big-item" v-for="(item, index) in bigMealList" :key="index">
          <img class="big-logo" :src="item.img" alt="logo" />
          <!-- <div style="width: 60%;">
            <div class="big-info">
              <div class="big-name">{{ item.name }}</div>
              <div class="big-desc">{{ item.desc }}</div>
            </div>
            <span class="big-tag">立即查看 <span>›</span></span>
          </div> -->

        </div>
      </div>

      <!-- 品牌 Grid：自适应卡片布局 -->
      <div class="brand-grid">
        <div class="grid-item" v-for="(item, index) in fastFoodList" :key="index">
          <img class="grid-logo" :src="item.img" alt="logo" />
          <!-- <div class="grid-info">
            <div class="grid-name">{{ item.name }}</div>
            <div class="grid-tag type-pink">GO <span>›</span></div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 3. 饮品直冲（配送/到家） -->
    <div class="section-card yellow-bg">
      <div class="section-header">
        <div class="title-box">
          <span class="main-title" style="color: #FD8448;">饮品直冲</span>
          <span class="sub-title">配送到家</span>
        </div>
      </div>

      <!-- 品牌 Grid：自适应卡片布局 -->
      <div class="brand-grid">
        <div class="grid-item" v-for="(item, index) in drinkList" :key="index">
          <img class="grid-logo" :src="item.img" alt="logo" />
          <!-- <div class="grid-info">
            <div class="grid-name">{{ item.name }}</div>
            <div class="grid-tag type-red">查看<span>›</span></div>
          </div> -->
        </div>
      </div>

    </div>

    <!-- 4. 展码支付（到店使用） -->
    <div class="section-card blue-bg">
      <div class="section-header">
        <div class="title-box">
          <span class="main-title" style="color: #3baff2;">展码支付</span>
          <span class="sub-title">到店使用</span>
        </div>
      </div>

      <!-- 展码支付 Grid（同样是自适应，但在宽屏下会尽量保持 4 列） -->
      <div class="brand-grid pay-grid">
        <div class="pay-item" v-for="(item, index) in payList" :key="index">
          <div class="pay-logo-area">
            <img class="pay-logo" :src="item.banner" alt="支付卡" />
          </div>
          <!-- <div class="pay-name">{{ item.name }}</div>
          <div class="pay-tag type-blue">立即查看 <span>›</span></div> -->
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import { onlineBrand } from "@/api/lhjdtm";
import { getIndexList } from "@/api/lhcard";

export default {
  name: "FoodDelivery",
  data() {
    return {
      bigMealList: [
        { name: '美团外卖', desc: '吃喝玩乐，尽在美团', img: require('../../assets/lh/dc-1.png') },
        { name: '淘宝闪购', desc: '外卖放心点，美味准时达', img: require('../../assets/lh/dc-2.png') },
      ],
      fastFoodList: [
        { name: '麦当劳', img: require('../../assets/lh/dc-3.png') },
        { name: '肯德基', img: require('../../assets/lh/dc-4.png') },
        { name: '必胜客', img: require('../../assets/lh/dc-5.png') },
        { name: '星巴克', img: require('../../assets/lh/dc-6.png') },
        { name: '瑞幸', img: require('../../assets/lh/dc-7.png') },
        { name: '库迪', img: require('../../assets/lh/dc-8.png') },
        { name: '塔斯汀', img: require('../../assets/lh/dc-9.png') },
        { name: '奈雪的茶', img: require('../../assets/lh/dc-10.png') },
      ],
      drinkList: [
        { name: '瑞幸', img: require('../../assets/lh/zc-1.png') },
        { name: '库迪咖啡', img: require('../../assets/lh/zc-2.png') },
        { name: 'coco都可', img: require('../../assets/lh/zc-3.png') },
        { name: '古茗', img: require('../../assets/lh/zc-4.png') },
        { name: '霸王茶姬', img: require('../../assets/lh/zc-5.png') },
        { name: '书亦烧仙草', img: require('../../assets/lh/zc-6.png') },
        { name: '七分甜', img: require('../../assets/lh/zc-10.png') },
        { name: '茉莉奶白', img: require('../../assets/lh/zc-8.png') },
        { name: '爷爷不泡茶', img: require('../../assets/lh/zc-9.png') },
        { name: '茶百道', img: require('../../assets/lh/zc-11.png') },
        { name: '益禾堂', img: require('../../assets/lh/zc-12.png') },
      ],
      payList: [

      ]
    }
  }, mounted() {
    this.onlineBrands()
    this.getIndex()
  }, methods: {
    getIndex() {
      return getIndexList().then(res => {
        if (res.code == 200) {
          console.log(res.data.zhanuma)
          const all = res.data.zhanuma || []
          this.payList= all.filter(item=>item.banner)

        }
      })
    },
    onlineBrands() {
      onlineBrand().then(res => {
        if (res.code == 200) {

        }
      })
    },
  }
}
</script>

<style scoped lang="less">
/* 基础重置 */
.food-page {
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
  /* 强制隐藏横向滚动条 */
  min-height: 100vh;
  background-color: #F7F7F7;
  padding: 0 0 30px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

img {
  max-width: 100%;
  display: block;
  object-fit: contain;
}

/* ================= 1. 顶部 Banner ================= */
.top-banner {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #FFE4C2, #FFB775);
  padding-top: 35%;

  .banner-bg {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;

    .title {
      font-size: clamp(20px, 5vw, 32px);
      font-weight: bold;
      color: #D33713;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: clamp(12px, 2.5vw, 16px);
      color: #804428;
      letter-spacing: 1px;
    }
  }

  .banner-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
}

/* ================= 2. 卡片容器 ================= */
.section-card {
  margin: 12px 16px;
  padding: 10px 10px 14px 10px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;

  &.pink-bg {
    background: linear-gradient(to bottom, #FDEEF3, #FFF8FB);
  }

  &.yellow-bg {
    background: linear-gradient(to bottom, #FFFAE7, #FFFBF5);
  }

  &.blue-bg {
    background: linear-gradient(to bottom, #D4F1FF, #F5FDFF);
  }

  .section-header {
    margin-bottom: 10px;

    .title-box {
      display: flex;
      align-items: baseline;
      gap: 10px;

      .main-title {
        font-size: 18px;
        font-weight: bold;
        color: #FF5554;
      }

      .sub-title {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

/* ================= 3. 大卡片 (美团等) ================= */
.big-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .big-item {
    flex: 1;
    display: flex;
    align-items: center;
    // background: #fff;
    // border-radius: 12px;
    // padding: 12px 10px;
    // box-sizing: border-box;
    // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    min-width: 0;

    .big-logo {
      // width: 40px;
      // height: 40px;
      // border-radius: 50%;
      // margin-right: 12px;
      flex-shrink: 0;
    }

    .big-info {
      flex: 1;
      margin-right: 4px;
      overflow: hidden;

      .big-name {
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .big-desc {
        font-size: 11px;
        color: #999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .big-tag {
      font-size: 11px;
      color: #ffffff;
      background: linear-gradient(90deg, #FF6E9E, #FF6E9E);
      padding: 0px 2px 1px 2px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;

      span {
        font-size: 12px;
        margin-left: 2px;
      }
    }
  }
}

/* ================= 4. 核心网格布局 (白底卡片 - 修复自适应问题) ================= */
.brand-grid {
  display: grid;
  /* 修复自适应：最小宽度 100px，最多 3 列，自动填充。如果小于 300px 会变成 2 列 */
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .grid-item {
    display: flex;
    flex-direction: row;
    // align-items: center;
    // justify-content: center;
    // background: #ffffff;
    // border-radius: 12px;
    // padding: 8px 4px 1px 8px;
    box-sizing: border-box;
    cursor: pointer;

    .grid-logo {
      // width: 36px;
      // height: 36px;
      // border-radius: 50%;
      // margin-bottom: 8px;
    }

    .grid-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      .grid-name {
        font-size: 13px;
        color: #333;
        font-weight: 500;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
      }

      .grid-tag {
        font-size: 10px;
        padding: 1px 4px;
        border-radius: 10px;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;

        span {
          font-size: 11px;
          margin-left: 2px;
        }
      }

      .type-pink {
        color: #FF4B2B;
        background: #FFEEEE;
      }

      .type-red {
        color: #ffffff;
        background: #FC5C5C;
      }

    }
  }
}

.type-blue {
  color: #ffffff;
  background: linear-gradient(to right, #3D8DEB, #0366FF);
}

/* ================= 5. 展码支付区 (特殊布局) ================= */
/* 这里为了截图效果，尽量让展码支付一行显示 4 个，我们稍微调小一点最小宽度 */
.pay-grid {
  // grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .pay-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 100%;
    padding: 0;

    .pay-logo-area {
      width: 100%;
      // aspect-ratio: 1.35 / 1;
      // margin-bottom: 8px;
      // border-radius: 8px;
      overflow: hidden;

      .pay-logo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .pay-name {
      font-size: 11px;
      color: #333;
      text-align: center;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .pay-tag {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;

      span {
        font-size: 10px;
      }
    }
  }
}
</style>