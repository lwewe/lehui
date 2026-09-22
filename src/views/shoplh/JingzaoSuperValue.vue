<template>
  <div class="super-value-page">

    <!-- 1. 顶部导航栏 -->
    

    <!-- 2. 顶部大 Banner -->
    <div class="banner-area">
      <img class="banner-img" src="../../assets/lh/jdzy/b2.png" alt="Banner" />
    </div>

    <!-- 3. 商品列表区域 -->
    <div class="goods-container">
      <div class="goods-list" v-if="goodsList.length > 0">
        <div class="goods-item" v-for="(item, index) in goodsList" :key="index"  @click="goToDetail(item)">

          <!-- 商品图片区域 (包含角标) -->
          <div class="img-wrapper">
            <div class="rank-badge" v-if="index < 3">{{ index + 1 }}</div>
            <img class="goods-img" :src="item.img" alt="" />
          </div>

          <!-- 商品信息 -->
          <div class="goods-info">
            <div class="goods-name">{{ item.title }}</div>
            
            <div class="goods-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div>

            <div class="goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
                <span class="original-price" v-if="item.market_price">¥{{ item.market_price }}</span>
              </div>
              <div class="add-btn" @click="addToCart(item)">+</div>
            </div>
            
             
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-tip" v-else>
        暂无推荐商品
      </div>
    </div>

  </div>
</template>

<script>
import { home,channelDetail } from "@/api/lhjdtm";

export default {
  name: "JingzaoSuperValue",
  data() {
    return {
      goodsList: [],
      loading: false,
    }
  },
  methods: {
     channelDetailIndex() {
      channelDetail({ id: 13 }).then(res => {
        if (res.code == 200) {
          const data = res.data;

          // 1. 返回按钮图标（用 banner 图，或者你单独配一个返回图标）
          if (data.banner && data.banner.length > 0) {
            this.baners = data.banner[0].img;
            this.bannerImg = data.banner[0].img;
          }

          // 2. 分类图标：直接用 nav
          if (data.nav && data.nav.length > 0) {
            this.categoryList = data.nav.map(item => ({
              id: item.cate_id || item.id,
              img: item.img,
              title: item.title,
              link: item.link
            }));
          }

          // 3. sections 里如果有 items，可以在这里处理
          // 目前接口 items 为空，所以 hotList / goodsList 保持空
          if (data.sections && data.sections.length > 0) {
          
          this.goodsList = res.data.sections[0].items
            // data.sections.forEach(section => {
             
            //   // if (section.items && section.items.length > 0) {
            //   //   // 根据 section.type 或 title 区分
            //   //   if (section.title === '超值购') {
            //   //     // this.goodsList = section.items;
            //   //   } else if (section.title === '热销推荐' || section.title === '上新') {
            //   //     this.goodsList = section.items;
            //   //   }
            //   // }
            // });
          }
        }
      })
    },
    goToDetail(item) {
      console.log('查看商品详情:', item);
      // 跳转到详情页
        this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    // 获取超值推荐数据
    getRecommendData() {
      this.loading = true;
      home({ platform: 3, limit: 10 }).then(res => {
        console.log('超值推荐数据:', res);
        if (res.code == 200) {
          const data = res.data;
          
          // 优先使用 recommend 数据
          if (data && data.recommend && data.recommend.length > 0) {
            this.goodsList = data.recommend;
          } 
          // 如果没有 recommend，使用 hot
          else if (data && data.hot && data.hot.length > 0) {
            this.goodsList = data.hot;
          }
          // 最后使用 new
          else if (data && data.new && data.new.length > 0) {
            this.goodsList = data.new;
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
    
    // 加入购物车
    addToCart(item) {
      console.log('加入购物车:', item);
      // 调用加入购物车接口
    },
    
    goBack() { 
      this.$router.go(-1); 
    }
  },
  
  mounted() {
      this.channelDetailIndex();
  },
  activated() {
  // 每次进入都重新请求
  this.channelDetailIndex();
},
}
</script>

<style scoped lang="less">
.super-value-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FD2104, #FCFCFC);
  padding-bottom: 0px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ================= 1. 顶部导航 ================= */
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
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 24px;
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
    color: #fff;
  }
}

/* ================= 2. 顶部 Banner ================= */
.banner-area {
  width: 100%;
  height: 170px;
  position: relative;
 

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ================= 3. 商品列表容器 ================= */
.goods-container {
  padding: 12px 12px 20px 12px;
  border-radius: 16px 16px 0 0;
  margin-top: -10px;
  position: relative;
  z-index: 2;
  min-height: 60vh;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .goods-item {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(244, 119, 119, 0.05);
    display: flex;
    flex-direction: column;

    .img-wrapper {
      position: relative;
      width: 100%;
      background: #FFFDFD;

      .goods-img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        display: block;
      }

      .rank-badge {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 225, 130, 0.9);
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        padding: 4px 14px 4px 8px;
        clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        border-top-left-radius: 10px;
        z-index: 2;
        min-width: 20px;
        text-align: center;
        line-height: 1;
      }
    }

    .goods-info {
      padding: 10px 10px 6px 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
        min-height: 28px;
      }

      .goods-subtitle {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin-top: 8px;

        .price-box {
          display: flex;
          align-items: baseline;
          gap: 3px;

          .symbol {
            font-size: 12px;
            color: #FD4C38;
            font-weight: bold;
          }

          .price {
            font-size: 18px;
            font-weight: 600;
            color: #ed2e33;
          }

          .original-price {
            font-size: 11px;
            color: #999;
            text-decoration: line-through;
            margin-left: 2px;
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
          line-height: 1;
          cursor: pointer;
        }
      }

      .sale-info {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
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