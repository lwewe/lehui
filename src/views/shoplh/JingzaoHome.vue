<template>
  <div class="jingzao-home">
    <div class="scroll-content">

      <!-- 1. 顶部导航与搜索 -->
      <div class="header-area" style="padding-top: 10px;background: linear-gradient(to left,#F88B65,#F35B4D,#ED403A);">
        <div class="search-row">
          <div class="location">
            <div class="back-btn" @click="goBack">
         
              <img src="../../assets/lh/bk1.png" style="width: 12px;" alt="返回" />
            </div>
          </div>
          <div class="search-box">
            <img src="../../assets/lh/serchico.png" style="width: 20px;height: 20px;" alt="">
            <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
            <span class="search-btn" @click="handleSearch">搜索</span>
          </div>
        </div>
      </div>

      <!-- 2. 大 Banner -->
      <div class="banner-area">
        <div class="banner-bg">
          <img class="banner-img" :src="bannerImg" alt="Banner图" />
        </div>
      </div>

      <!-- 3. 分类图标（接口 nav） -->
      <div style="padding: 10px;">
        <div class="category-grid">
          <div class="cat-item" v-for="(item, index) in categoryList" :key="index" @click="goToCategoryWithId(item)">
            <img class="cat-icon" :src="item.img" alt="" />
            <div class="cat-name">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <!-- 4. 超值推荐 -->
      <div class="section-card pink-card" v-if="hotList.length > 0">
        <div class="section-header">
          <div class="title-left">
            <span class="main-title">超值推荐</span>
            <span class="sub-title">TOP</span>
          </div>
          <div class="title-right" @click="JingzaoSuperValue()">查看更多</div>
        </div>
        <div class="grid-wrapper">
          <div class="product-card-small" v-for="(item, index) in hotList" :key="index" @click="goToDetail(item)">
            <img class="small-img" :src="item.img" alt="" />
            <div class="small-price">
              <span style="font-size: 10px;">¥</span>{{ item.sell_price }}
            </div>
          </div>
        </div>
      </div>

      <!-- 5. 京造好物 -->
      <div class="section-title">
        <span class="line"></span>
        <span class="text">京造好物</span>
        <span class="line"></span>
      </div>

      <div class="goods-grid" v-if="goodsList.length > 0">
        <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
          <img class="goods-img" :src="item.img" alt="" />
          <div class="goods-info">
            <div class="goods-name">{{ item.title }}</div>
            <div class="goods-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div>
            <!-- <div class="goods-tags">
              <span class="tag" v-if="item.sale_num">已售{{ formatSaleNum(item.sale_num) }}</span>
              <span class="tag" v-if="item.stock > 0">有货</span>
            </div> -->
            <div class="goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.sell_price }}</span>
                <span class="market-price" v-if="item.market_price">¥{{ item.market_price }}</span>
              </div>
              <div class="add-cart" @click.stop="addToCart(item)">+</div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-tip" v-else-if="!loading">
        暂无商品
      </div>

      <div class="bottom-safe-area"></div>
    </div>

    <!-- 6. 底部固定导航栏 -->
    <div class="tab-bar">
      <div class="tab-item" @click="goToHome">
        <img class="tab-icon"
          :src="$route.path === '/JingzaoHome' ? require('../../assets/lh/jdzy/hm1-1.png') : require('../../assets/lh/jdzy/hm1-0.png')"
          alt="首页" />
        <div class="tab-text" :class="{ active: $route.path === '/JingzaoHome' }">首页</div>
      </div>

      <div class="tab-item" @click="goToCategory">
        <img class="tab-icon"
          :src="$route.path === '/JingzaoCategory' ? require('../../assets/lh/jdzy/hm2-2.png') : require('../../assets/lh/jdzy/hm2-2.png')"
          alt="分类" />
        <div class="tab-text" :class="{ active: $route.path === '/JingzaoCategory' }">分类</div>
      </div>
    </div>
  </div>
</template>

<script>
import { channelDetail } from "@/api/lhjdtm";

export default {
  name: "JingzaoHome",
  data() {
    return {
      page: 1,
      baners: '',
      currentSort: 'px',
      searchKeyword: '',
      loading: false,
      bannerImg: require('../../assets/lh/jdzy/b1.jpg'),
      categoryList: [],
      hotList: [],
      goodsList: [],
    }
  },
  methods: {
    // 获取频道详情（banner + nav + sections）
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
            data.sections.forEach(section => {
              if (section.items && section.items.length > 0) {
                // 根据 section.type 或 title 区分
                if (section.title === '超值购') {
                  this.hotList = section.items.slice(0,4);
                } else if (section.title === '热销推荐' || section.title === '上新') {
                  this.goodsList = section.items;
                }
              }
            });
          }
        }
      })
    },

    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      }
      return num;
    },

    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.page = 1;
        // 搜索接口
      }
    },

    goToCategoryWithId(item) {
      this.$router.push({
        path: '/JingzaoCategory',
        query: { categoryId: item.id, categoryTitle: item.title }
      });
    },

    goToDetail(item) {
      this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    goBack() {
      this.$router.go(-1);
    },

    JingzaoSuperValue() {
      if (this.$route.path !== '/JingzaoSuperValue') {
        this.$router.push('/JingzaoSuperValue');
      }
    },

    goToHome() {
      if (this.$route.path !== '/JingzaoHome') {
        this.$router.push('/JingzaoHome');
      }
    },

    goToCategory() {
      this.$router.push('/JingzaoCategory');
    }
  },

  mounted() {
    this.channelDetailIndex();
  }
}
</script>

<style scoped lang="less">
/* 样式部分完全不变，直接沿用你原来的 */
.jingzao-home {
  background: #f7f7f7;
  min-height: 100vh;
  position: relative;
}

.header-area {
  background: #fff;
  padding-bottom: 10px;

  .search-row {
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 12px;

    .location {
      font-size: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: #f0f2f5;
      border-radius: 20px;
      padding: 6px 12px;

      input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 13px;
      }

      .search-btn {
        font-size: 12px;
        color: #fff;
        background: #ff3b30;
        padding: 4px 12px;
        border-radius: 16px;
        cursor: pointer;
      }
    }
  }
}

.banner-area {
  .banner-bg {
    position: relative;
    overflow: hidden;

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 0;
  padding: 10px 0px;
  background: #fff;
  border-radius: 10px;

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .cat-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #f5f6fa;
      margin-bottom: 4px;
      object-fit: cover;
    }

    .cat-name {
      font-size: 12px;
      color: #333;
      font-weight: 600;
    }
  }
}

.section-card {
  margin: 0px 10px;
  padding: 10px;
  border-radius: 12px;

  &.pink-card {
    background: linear-gradient(to right, #FFE7EF, #FEEEE2);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title-left {
      display: flex;
      align-items: center;
      gap: 6px;

      .main-title {
        font-size: 15px;
        font-weight: bold;
        color: #3D3D3D;
      }

      .sub-title {
        font-size: 10px;
        color: #ffffff;
        background: #fe89a0;
        padding: 1px 6px;
        line-height: 1;
        border-radius: 10px 10px 10px 0px;
        font-weight: 600;
      }
    }

    .title-right {
      font-size: 10px;
      padding: 0px 4px 1px 4px;
      color: #ffffff;
      font-weight: 600;
      border-radius: 126px;
      background: linear-gradient(90deg, #F93E3C 0%, #FC7A63 100%);
      cursor: pointer;
    }
  }

  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    overflow: hidden;

    .product-card-small {
      background: #fff;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;

      .small-img {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #f5f6fa;
        margin-bottom: 6px;
        border-radius: 4px;
        object-fit: cover;
      }

      .small-price {
        display: flex;
        align-items: baseline;
        font-size: 13px;
        color: #d32f2f;
        font-weight: bold;
      }
    }
  }
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;

  .text {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    padding: 0 10px;
  }

  .line {
    height: 1px;
    background: #e0e0e0;
    flex: 1;
    max-width: 40px;
  }
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 10px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 2px;
    cursor: pointer;

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f5f6fa;
      object-fit: cover;
    }

    .goods-info {
      padding: 8px 10px 4px 10px;
    }

    .goods-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .goods-subtitle {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .goods-tags {
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

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      color: #d32f2f;
      display: flex;
      align-items: baseline;

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }

      .market-price {
        font-size: 11px;
        color: #999;
        text-decoration: line-through;
        margin-left: 6px;
        font-weight: normal;
      }
    }

    .add-cart {
      width: 20px;
      height: 20px;
      background: #ff4d30;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      line-height: 1;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

.bottom-safe-area {
  height: 70px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .tab-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 2px;
    }

    .tab-text {
      font-size: 10px;
      color: #999;
    }

    .active {
      color: #ff3b30;
      font-weight: bold;
    }
  }
}
</style>