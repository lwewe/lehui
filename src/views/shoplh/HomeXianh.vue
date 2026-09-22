<template>
  <div class="bg">
    <!-- 顶部Banner -->
    <div class="banner">
      <img :src="topImg" class="topImg" alt="">
    </div>

    <!-- 分类Tab -->
    <div class="category-tabs">
      <div 
        class="tab-item" 
        v-for="(cat, index) in categories" 
        :key="index"
        :class="{ active: currentCategory === index }"
        @click="currentCategory = index"
      >
        {{ cat.name }}
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="pd15">
      <!-- 当前分类下的商品 -->
      <div class="product-list" v-if="currentProducts.length > 0">
        <div class="product-item" v-for="item in currentProducts" :key="item.id" @click="detail(item.id)">
          <img :src="item.img" alt="" class="prod-img">
          <div class="prod-info">
            <div class="prod-title">{{ item.title }}</div>
            <div class="prod-spec">{{ item.spec_name || '规格: 5L' }}</div>
            <div class="prod-price-row">
              <span class="prod-price">￥{{ item.sell_price }}</span>
              <div class="add-btn" @click.stop="addToCart(item)">
                +
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty" v-else>
        暂无商品
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: 0,
      categories: [
        { name: '当季西瓜' },
        { name: '苹果' },
        { name: '桃李' },
        { name: '樱桃' }
      ],
      topImg: require("../../assets/yj/top.png"),
      productData: [
        {
          id: 1,
          category: 0,
          title: '麒麟西瓜 皮薄多汁 清甜可口',
          spec_name: '规格: 5L',
          sell_price: 155.0,
          img: require("../../assets/yj/1.png")
        },
        {
          id: 2,
          category: 0,
          title: '麒麟西瓜 皮薄多汁 清甜可口',
          spec_name: '规格: 5L',
          sell_price: 155.0,
          img: require("../../assets/yj/2.png")
        },
        {
          id: 3,
          category: 0,
          title: '麒麟西瓜 皮薄多汁 清甜可口',
          spec_name: '规格: 5L',
          sell_price: 155.0,
          img: require("../../assets/yj/3.png")
        },
        {
          id: 4,
          category: 1,
          title: '新疆阿克苏苹果 脆甜多汁',
          spec_name: '规格: 3kg',
          sell_price: 49.9,
          img: require("../../assets/yj/4.png")
        },
        {
          id: 5,
          category: 1,
          title: '烟台红富士苹果 香甜可口',
          spec_name: '规格: 5kg',
          sell_price: 59.9,
          img: require("../../assets/yj/5.png")
        },
        {
          id: 6,
          category: 2,
          title: '水蜜桃 软糯香甜',
          spec_name: '规格: 2kg',
          sell_price: 39.9,
          img: require("../../assets/yj/6.png")
        },
        {
          id: 7,
          category: 2,
          title: '黄桃 脆甜多汁',
          spec_name: '规格: 2.5kg',
          sell_price: 45.0,
          img: require("../../assets/yj/7.png")
        },
        {
          id: 8,
          category: 3,
          title: '车厘子 智利进口 JJ级',
          spec_name: '规格: 1kg',
          sell_price: 89.9,
          img: require("../../assets/yj/8.png")
        }
      ]
    }
  },
  computed: {
    currentProducts() {
      return this.productData.filter(item => item.category === this.currentCategory);
    }
  },
  methods: {
    detail(id) {
      this.$router.push({ path: "/productDetail", query: { id } });
    },
    addToCart(item) {
      this.$toast('已加入购物车');
      // 这里可以调用添加购物车的API
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
    border-radius: 0 0 15px 15px;
  }
}

/* 分类Tab */
.category-tabs {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 12px 0;
  margin: 10px 0;
  
  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
    color: #333;
    border-radius: 20px;
    background: #F5F5F5;
    
    &.active {
      background-color: #FFEBEB;
      color: #E1251B;
      font-weight: bold;
    }
  }
}

.pd15 {
  padding: 0 15px;
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  
  .prod-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .prod-info {
    flex: 1;
    
    .prod-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      line-height: 1.4;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .prod-spec {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .prod-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .prod-price {
        color: #E1251B;
        font-size: 18px;
        font-weight: bold;
      }
      
      .add-btn {
        width: 20px;
        height: 20px;
        background-color: #E1251B;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;font-weight: bold;
        
        &:active {
          opacity: 0.8;
        }
      }
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