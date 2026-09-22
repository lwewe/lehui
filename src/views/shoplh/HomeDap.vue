<template>
  <div class="bg">
    <!-- 顶部Banner -->
    <div class="banner">
      <img :src="topImg" class="topImg" alt="">
    </div>

    <!-- 内容区域（黄色渐变背景） -->
    <div class="content-bg">
      <!-- 每日好券标题 -->
      <div class="voucher-title">
        <span class="title-text">每日好券</span>
        <img src="../../assets/yj/3.png" class="title-icon" alt="">
      </div>

      <!-- 商品列表（纵向卡片） -->
      <div class="product-list" v-if="productData.length > 0">
        <div class="product-card" v-for="item in productData" :key="item.id" @click="detail(item.id)">
          <!-- 左侧卡片图 -->
          <div class="card-img-box">
            <img :src="item.img" alt="" class="card-img">
          </div>
          
          <!-- 中间信息 -->
          <div class="prod-info">
            <div class="prod-title">{{ item.title }}</div>
            <!-- 标签 -->
            <div class="prod-tag">{{ item.spec_name }}</div>
            <!-- 价格 -->
            <div class="prod-price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</div>
          </div>

          <!-- 右侧按钮 -->
          <div class="buy-btn" @click.stop="addToCart(item)">去购买</div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty" v-else>暂无商品</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topImg: require("../../assets/yj/top.png"),
      productData: [
        {
          id: 1,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/1.png")
        },
        {
          id: 2,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/2.png")
        },
        {
          id: 3,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/3.png")
        },
        {
          id: 4,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/4.png")
        },
        {
          id: 5,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/5.png")
        },
        {
          id: 6,
          title: 'keep大会员周卡',
          spec_name: 'keep',
          sell_price: 158.0,
          img: require("../../assets/yj/6.png")
        }
      ]
    }
  },
  methods: {
    detail(id) {
      this.$router.push({ path: "/productDetail", query: { id } });
    },
    addToCart(item) {
      this.$toast('已加入购物车');
    }
  }
}
</script>

<style scoped lang="less">
.bg {
  padding-bottom: 50px;
  background-color: #F7F7F7;
  width: 100%;
  min-height: 100vh;
}

/* 顶部Banner */
.banner {
  width: 100%;
  .topImg {
    width: 100%;
    display: block;
  }
}

/* 黄色渐变内容区域 */
.content-bg {
  background: linear-gradient(180deg, #FFE8A9 0%, #FFF3D6 50%, #FFFFFF 100%);
  padding: 15px;
  min-height: calc(100vh - 200px);
}

/* 每日好券标题 */
.voucher-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 20px;
  
  .title-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-left: 5px;
  }
  
  .title-text {
    font-size: 18px;
    font-weight: bold;
    color: #FF4D00;
    text-shadow: 0 1px 2px rgba(255, 77, 0, 0.2);
  }
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 单个商品卡片 */
.product-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  /* 左侧图片 */
  .card-img-box {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    background: #F5F5F5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  /* 中间信息 */
  .prod-info {
    flex: 1;
    
    .prod-title {
      font-size: 15px;
      font-weight: bold;
      color: #333;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .prod-tag {
      display: inline-block;
      font-size: 11px;
      color: #FF4D00;
      background: #FFF0E8;
      border: 1px solid #FFD4BC;
      border-radius: 4px;
      padding: 1px 8px;
      margin-bottom: 8px;
    }
    
    .prod-price {
      color: #D7000F;
      font-size: 15px;
      font-weight: bold;
    }
  }
  
  /* 右侧按钮 */
  .buy-btn {
    flex-shrink: 0;
    font-size: 13px;
    color: #fff;
   background: linear-gradient( to left, #FF4A25 0%, #FEA345 100%);
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 77, 0, 0.3);
    
    &:active {
      opacity: 0.9;
    }
  }
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}
</style>