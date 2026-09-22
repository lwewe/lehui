<template>
  <div class="brand-season-page">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部大 Banner (金色礼盒) -->
    <div class="top-banner-area">
      <img class="banner-img" src="../../assets/lh/b1.jpg" alt="品牌Banner" />
       
    </div>

    <!-- 3. 线上商城 (2行4列) -->
    <div class="section-box bg1">
      <div class="section-header">
        <span class="title">线上商城</span>
        <span class="sub">线上好物集市，大牌好物一站集齐</span>
      </div>
      <div class="store-grid">
        <div class="store-item" v-for="(item, index) in onlineList" :key="index">
          <div class="store-img-box">
            <img class="store-img" :src="item.img" alt="" @click="onlines(index)" />
          </div>
          <!-- <div class="store-info">
            <img class="store-logo" :src="item.logo" alt="" />
            <div class="store-name">{{ item.name }}</div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 4. 展码付 (线下实体) -->
    <div class="section-box bg2">
      <div class="section-header">
        <span class="title">展码付</span>
        <span class="sub">线下实体专属码付，省心高效买单</span>
      </div>
      <div class="pay-grid">
        <div class="pay-item" v-for="(item, index) in payList" :key="index">
          <div class="pay-logo-box">
            <img class="pay-logo" :src="item.img" alt="" />
          </div>
          <div style="display: flex;flex-direction: column;">
            <div class="pay-name">{{ item.title }}</div>
          <div class="pay-btn"><span>GO</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import { onlineBrand } from "@/api/lhcard";
export default {
  name: "BrandSeasonPage",
  data() {
    return {
      // 线上商城数据 (注意：请把 img 换成门店实景图，logo 换成品牌圆标)
      onlineList: [
       
      ],
      // 展码付数据
      payList: [
       
      ]
    }
  },
  methods: {
     async getIndex() {
       onlineBrand().then(res => {
        if (res.code == 200) {
          this.onlineList = res.data.online
          this.payList = res.data.zhanuma
          
        }
      })
    },
    onlines(ixd){
       if (ixd == 5) {
        this.$router.push({ path: "/JingzaoHome" }) // 京造

      }
      if (ixd == 4) {
        this.$router.push({ path: "/JingdongChannel" })// 京东自营

      }
      if (ixd == 7) {
        this.$router.push({ path: "/TmallSupermarket" }) //天猫

      }
      if (ixd == 1) {
        this.$router.push({ path: "/HemaFresh" })// 和马

      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },mounted(){
    this.getIndex()
  },
}
</script>

<style scoped lang="less">
.brand-season-page {
  background: #FEFFEE;
  /* 米黄色背景，呼应金色礼盒主题 */
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
  /* 透出米黄色 */
  position: absolute;
  width: 100%;
  z-index: 10;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
  position: relative;
  width: 100%;

  /* 给导航留出空间 */

  .banner-img {
    width: 100%;
    height: 180px;
    object-fit: cover;

    display: block;
  }

  .banner-btn {
    position: absolute;
    bottom: 15px;
    left: 40px;
    background: #D28C3D;
    color: #fff;
    font-size: 12px;
    padding: 6px 20px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(210, 140, 61, 0.3);
    cursor: pointer;
    z-index: 2;
  }
}

/* ================= 3. 通用板块容器 ================= */
.section-box {
  margin: 16px 10px;
  padding: 10px;

  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  &.bg1 {
    background: url(../../assets/lh/b3.jpg) no-repeat;
    background-size: cover;
  }

  &.bg2 {
    background: url(../../assets/lh/b2.jpg) no-repeat;
    background-size: cover;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: space-between;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .sub {
      font-size: 12px;
      color: #875828;
    }
  }
}

/* ================= 4. 线上商城 (2行4列) ================= */
.store-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .store-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
     

    .store-img-box {
      width: 100%;
      // height: 84px;
      overflow: hidden;

      .store-img {
        width: 100%;
        // height: 100%;
        object-fit: cover;
      }
    }

    .store-info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 0;
      background: #fff;

      .store-logo {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        object-fit: contain;
      }

      .store-name {
        font-size: 11px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

/* ================= 5. 展码付 ================= */
.pay-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .pay-item {
    display: flex;
    // flex-direction: column;
    align-items: center;
    background: #F8F8F8;
    border-radius: 8px;
    padding: 10px 8px;

    .pay-logo-box {
      width: 38px;
      height: 38px;
      // margin-bottom: 6px;
margin-right: 6px;
      .pay-logo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
        background: #fff;
      }
    }

    .pay-name {
      font-size: 12px;
       font-weight: 600;
      color: #333;
      
    }

    .pay-btn {line-height: 1;
      span{display: inline-block;
      // display: inline-flex;
      // align-items: center;
      // justify-content: center;
      background: #FF6B35;
      color: #fff;
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 12px;
      cursor: pointer;
  
line-height: 1;}
      .arrow {
        font-size: 12px;
        margin-left: 2px;
      }
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>