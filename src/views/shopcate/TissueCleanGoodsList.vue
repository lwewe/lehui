<template>
  <div class="clean-goods-page">
    <!-- 1. 顶部导航 -->
   

    <!-- 2. 顶部大 Banner (蓝色调) -->
    <div class="top-banner-area">
      <img class="banner-img" src="../../assets//lh/cate/zj/b1.png" alt="清洁Banner" />
    </div>

    <!-- 3. 商品列表区域 -->
    <div class="main-list-wrapper">

      <!-- ===== 板块 1：单列左图右文列表 ===== -->
      <div class="single-list">
        <div class="single-item" v-for="(item, index) in singleList" :key="index">
          <!-- 左图 -->
          <img class="single-img" :src="item.img" alt="" />
          <!-- 右文 -->
          <div class="single-info">
            <div class="single-title">{{ item.name }}</div>
            <div class="single-tags">
              <span class="spec-tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
            </div>
            <div class="single-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.price }}</span>
              </div>
              <div class="add-btn">+</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 板块 2：双列瀑布流 (底部推荐) ===== -->
      <div class="dual-list">
        <div class="dual-item" v-for="(item, index) in dualList" :key="index">
          <img class="dual-img" :src="item.img" alt="" />
          <div class="dual-info">
            <div class="dual-name">{{ item.name }}</div>
            <div class="dual-tags">
              <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
            </div>
            <div class="dual-bottom">
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

    
  </div>
</template>

<script>
export default {
  name: "CleanGoodsList",
  data() {
    return {
      // 单列商品数据 (3个)
      singleList: [
        {
          name: '肌肤之钥光采洗面膏125ml(清爽型·滋润型)',
          price: '441.0',
          tags: ['50'],
          img: require('../../assets/lh/img-2.png')
        },
        {
          name: '肌肤之钥光采洗面膏125ml(清爽型·滋润型)',
          price: '441.0',
          tags: ['50'],
          img: require('../../assets/lh/img-2.png')
        },
        {
          name: '肌肤之钥光采洗面膏125ml(清爽型·滋润型)',
          price: '441.0',
          tags: ['50'],
          img: require('../../assets/lh/img-2.png')
        }
      ],
      // 双列商品数据 (4个)
      dualList: [
        { name: '繁花心意礼盒缤纷曲奇', price: '203.00', tags: ['全国包邮'], img: require('../../assets/lh/img-2.png') },
        { name: '繁花心意礼盒悠享时光', price: '155.00', tags: ['同城配送'], img: require('../../assets/lh/img-2.png') },
        { name: '十拼慕斯生日蛋糕', price: '203.00', tags: ['门店自提'], img: require('../../assets/lh/img-2.png') },
        { name: '纷享礼盒 冷冻蛋糕系列', price: '203.00', tags: ['全国包邮'], img: require('../../assets/lh/img-2.png') }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="less">
.clean-goods-page {
  background: #42B1FE;
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .nav-left, .nav-right { font-size: 20px; color: #fff; cursor: pointer; width: 24px; }
  .nav-title { font-size: 16px; font-weight: 500; color: #fff; }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  width: 100%;
  .banner-img { width: 100%; height: 160px; object-fit: cover; display: block; background: #f0f0f0; }
}

/* ================= 3. 主体列表区 ================= */
.main-list-wrapper {
  padding: 10px 10px 20px 10px;
  
  position: relative;
  z-index: 2;
}

/* ===== 单列列表 (左图右文) ===== */
.single-list {
  
  
  // padding: 12px;
  margin-bottom: 10px;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  .single-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
background: #fff;border-radius: 12px;
margin-bottom: 10px;
    &:last-child {
      border-bottom: none;
    }

    .single-img {
      width: 70px;
      height: 70px;
      flex-shrink: 0;
      margin-right: 12px;
      border-radius: 8px;
      background: #f5f6fa;
      object-fit: contain;
    }

    .single-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .single-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }

      .single-tags {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;

        .spec-tag {
          font-size: 10px;
          color:  #3C80CD;
          background:#ffffff;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid #3C80CD;
        }
      }

      .single-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-box {
          color: #d32f2f;
          .symbol { font-size: 12px;font-weight: bold; }
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
          font-size: 14px;font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }
}

/* ===== 双列瀑布流 (底部推荐) ===== */
.dual-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .dual-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 1px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

    .dual-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .dual-info {
      padding: 10px 12px;
    }

    .dual-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
    }

    .dual-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 8px;

      .tag {
        font-size: 10px;
        color: #ff4d30;
        background: #fff0f0;
        padding: 1px 4px;
        border-radius: 4px;
      }
    }

    .dual-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-box {
        color: #d32f2f;
        .symbol { font-size: 12px;font-weight: bold; }
        .price { font-size: 16px; font-weight: bold; }
      }

      .add-btn {
        width: 20px;
        height: 20px;
        background: #ff6b6b;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.bottom-safe { height: 20px; }
</style>