<template>
  <div class="exclusive-page">
    <!-- 1. 顶部导航 -->
    

    <!-- 2. 顶部黄色 Banner -->
    <div class="banner-area">
      <img class="banner-img" src="../../assets/lh/tm/b5.png" alt="Banner" />
    </div>

    <!-- 3. 商品列表 -->
    <div class="list-wrapper" v-if="goodsList.length > 0">
      <div class="list-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        <!-- 左侧图片 -->
        <div class="item-img-box">
          <img class="item-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧信息 -->
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          
          <!-- 副标题 -->
          <!-- <div class="item-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div> -->

          <!-- 标签 -->
          <div class="item-tags">
            <span class="tag-orange" v-if="item.cate_name">{{ item.cate_name }}</span>
            <span class="tag-gray" v-if="item.sale_num">已售{{ formatSaleNum(item.sale_num) }}</span>
          </div>

          <!-- 底部价格行 -->
          <div class="item-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
              <span class="original-price" v-if="item.market_price">¥{{ item.market_price }}</span>
            </div>
            <div class="add-btn" @click.stop="addToCart(item)">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-tip" v-else-if="!loading">
      暂无新品
    </div>
  </div>
</template>

<script>
import { home } from "@/api/lhjdtm";

export default {
  name: "ExclusiveNew",
  data() {
    return {
      platform: 2,           // 默认天猫平台
      loading: false,
      goodsList: [],
    }
  },
  methods: {
    // 获取独家上新数据（home接口的new）
    getNewData() {
      this.loading = true;
      home({ platform: this.platform, limit: 10 }).then(res => {
        console.log('独家上新数据:', res);
        if (res.code == 200) {
          const data = res.data;
          
          // 获取 new 数据
          if (data && data.new && data.new.length > 0) {
            this.goodsList = data.new;
          }
          // 如果没有 new，使用 recommend 备选
          else if (data && data.recommend && data.recommend.length > 0) {
            this.goodsList = data.recommend;
          }
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    
    // 格式化销量
    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      }
      return num;
    },
    
    // 查看商品详情
    goToDetail(item) {
      if (item.id) {
        this.$router.push({
          path: '/ProductDetail',
          query: { id: item.id }
        });
      }
    },
    
    // 加入购物车
    addToCart(item) {
      console.log('加入购物车:', item);
    },
    
    goBack() {
      this.$router.go(-1);
    }
  },
  
  created() {
    // 接收平台参数
    if (this.$route.query.platform) {
      this.platform = Number(this.$route.query.platform);
    }
  },
  
  mounted() {
    this.getNewData();
  }
}
</script>

<style scoped lang="less">
.exclusive-page {
  background: linear-gradient(to bottom, #FEE7A6, #FBCA72);
  min-height: 100vh;
  padding-bottom: 20px;
}

/* ================= 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: transparent;
  position: relative;
  z-index: 10;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    width: 24px;
    display: flex;
    align-items: center;
  }

  .nav-left {
    justify-content: flex-start;
  }

  .nav-right {
    justify-content: flex-end;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 黄色 Banner ================= */
.banner-area {
  width: 100%;
  height: 160px;
 

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ================= 列表 ================= */
.list-wrapper {
  padding: 0 12px 10px 12px;
}

.list-item {
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  align-items: center;
  cursor: pointer;

  .item-img-box {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 12px;
    background: #f5f6fa;
    border-radius: 8px;
    overflow: hidden;

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-subtitle {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      flex-wrap: wrap;

      .tag-orange {
        font-size: 10px;
        color: #fff;
        background: linear-gradient(270deg, #FEAA48 0%, #FF4423 100%);
        padding: 2px 8px;
        border-radius: 10px;
      }
      
      .tag-gray {
        font-size: 10px;
        color: #666;
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      color: #d32f2f;
      display: flex;
      align-items: baseline;
      gap: 2px;

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 18px;
        font-weight: bold;
      }

      .original-price {
        font-size: 11px;
        color: #999;
        text-decoration: line-through;
        margin-left: 4px;
        font-weight: normal;
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
      line-height: 1;
    }
  }
}

.empty-tip {
  text-align: center;
  color: #666;
  padding: 60px 0;
  font-size: 14px;
}
</style>