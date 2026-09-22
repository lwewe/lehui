<template>
  <div class="low-price-page">
    <!-- 1. 顶部导航 -->
    
    <!-- 2. 红色 Banner 区域 (包含内部白色卡片) -->
    <div class="header-banner-wrapper">
      
      <!-- 白底圆角卡片 -->
      <div class="white-panel">
        <div class="panel-title">
          今日超低
        </div>
        
        <!-- 4个微缩商品：前4个 recommend -->
        <div class="top-grid-list">
          <div class="top-item" v-for="(item, index) in topList" :key="index" @click="goToDetail(item)">
            <img class="top-img" :src="item.img" alt="" />
            <div class="top-tag">{{ index === 0 ? '疯抢中' : index === 1 ? '省心价' : index === 2 ? '热卖中' : '限时直播' }}</div>
            <div class="top-price">
              <span style="font-size: 10px;">¥</span>{{ item.sell_price }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. 商品主列表 (从第5个开始) -->
    <div class="list-wrapper" v-if="goodsList.length > 0">
      <div class="list-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        
        <!-- 左侧图片 -->
        <div class="item-img-box">
          <img class="item-img" :src="item.img" alt="" />
        </div>

        <!-- 右侧信息 -->
        <div class="item-info">
          <!-- 标题区域 -->
          <div class="item-title-box">
            <span class="title-text">
              <span class="title-tag" v-if="item.cate_name">{{ item.cate_name }}</span>
              <span style="line-height: 1.3;">{{ item.title }}</span>
            </span>
          </div>

          <!-- 底部胶囊条 -->
          <div class="price-capsule">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
              <span class="original-price" v-if="item.market_price">¥{{ item.market_price }}</span>
            </div>
            <!-- 红底闪电抢按钮 -->
            <div class="snap-btn" @click.stop="addToCart(item)">抢</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-tip" v-else-if="!loading">
      暂无商品
    </div>
  </div>
</template>

<script>
import { home } from "@/api/lhjdtm";

export default {
  name: "TmallTodaySuperLow",
  data() {
    return {
      platform: 2,           // 天猫平台
      loading: false,
      topList: [],           // 顶部4个商品（recommend前4个）
      goodsList: [],         // 下方列表（recommend从第5个开始）
    }
  },
  methods: {
    // 获取超级补贴数据
    getData() {
      this.loading = true;
      home({ platform: this.platform, limit: 20 }).then(res => {
        console.log('今日超低数据:', res);
        if (res.code == 200) {
          const data = res.data;
          
          // 获取 recommend 数据
          let recommendData = [];
          if (data && data.recommend && data.recommend.length > 0) {
            recommendData = data.recommend;
          }
          // 如果没有 recommend，使用 hot 备选
          else if (data && data.hot && data.hot.length > 0) {
            recommendData = data.hot;
          }
          // 最后使用 new 备选
          else if (data && data.new && data.new.length > 0) {
            recommendData = data.new;
          }
          
          // 前4个作为顶部展示
          this.topList = recommendData.slice(0, 4);
          
          // 从第5个开始作为下方列表
          this.goodsList = recommendData.slice(4);
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
      if (item && item.id) {
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
    this.getData();
  }
}
</script>

<style scoped lang="less">
.low-price-page {
  background: #f7f7f7;
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
  
  .nav-left, .nav-right { 
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

/* ================= 2. 红色 Banner 区 ================= */
.header-banner-wrapper {
  background: #FF4E50;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  
  .white-panel {
    background: #FFE9E9;
    border-radius: 12px;
    
    .panel-title {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #333;
      padding: 8px;
      
      .icon {
        color: #FF4E50;
        font-size: 16px;
        margin-right: 6px;
        font-weight: normal;
      }
    }
    
    .top-grid-list {
      background-color: #fff;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      padding: 10px 0;
      border-radius: 10px 10px 0 0;
      
      .top-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        
        .top-img { 
          width: 44px; 
          height: 44px; 
          background: #f5f6fa; 
          border-radius: 6px; 
          margin-bottom: 6px; 
          object-fit: cover; 
        }
        
        .top-tag { 
          font-size: 10px; 
          color: #FF4E50; 
          text-align: center; 
          white-space: nowrap; 
          padding: 2px 8px;
          border-radius: 10px;
          background: #FFF6FB;
          border: 1px solid #F8D7E4;
        }
        
        .top-price { 
          font-size: 13px; 
          font-weight: bold; 
          color: #FF4E50; 
          margin-top: 4px;
          display: flex;
          align-items: baseline;
        }
      }
    }
  }
}

/* ================= 3. 商品列表 ================= */
.list-wrapper { 
  padding: 0 12px; 
}

.list-item {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  
  .item-img-box {
    width: 90px; 
    height: 90px; 
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
    min-width: 0;
    
    .item-title-box {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      width: 100%;
      overflow: hidden;
      
      .title-tag {
        position: relative;
        top: -2px;
        display: inline-block;
        font-size: 10px;
        color: #fff;
        background: #d32f2f;
        padding: 3px 4px 2px 4px;
        border-radius: 4px;
        margin-right: 6px;
        flex-shrink: 0;
      }
      
      .title-text {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        line-height: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-all;
      }
    }
    
    .price-capsule {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFF5F5;
      border-radius: 8px;
      padding: 6px 6px 6px 12px;
      height: 34px;
      
      .price-box {
        display: flex;
        align-items: baseline;
        gap: 2px;
        
        .symbol { 
          font-size: 12px; 
          color: #d32f2f; 
          font-weight: bold; 
        }
        
        .price { 
          font-size: 18px; 
          color: #d32f2f; 
          font-weight: bold; 
        }
        
        .original-price {
          font-size: 11px;
          color: #999;
          text-decoration: line-through;
          margin-left: 4px;
        }
      }
      
      .snap-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(90deg, #FF4500, #FF4500);
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        padding: 0 14px;
        height: 100%;
        border-radius: 6px;
        cursor: pointer;
        letter-spacing: 1px;
        box-shadow: 0 2px 4px rgba(255, 69, 0, 0.3);
      }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 14px;
}
</style>