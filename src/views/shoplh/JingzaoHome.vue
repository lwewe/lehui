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
      <div style="padding: 10px;    position: relative;
    top: -25px;">
        <div class="category-grid">
          <div class="cat-item" v-for="(item, index) in categoryList" :key="index" @click="goToCategoryWithId(item)">
            <img class="cat-icon" :src="item.img" alt="" />
            <div class="cat-name">{{ item.title }}</div>
          </div>
        </div>
      </div>
<div style="  position: relative;
    top: -25px;">
    
  
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
                <span class="market-price" v-if="item.sell_price < item.market_price">¥{{ item.market_price }}</span>
              </div>
              <!-- <div class="add-cart" @click.stop="addToCart(item)">+</div> -->
            </div>
          </div>
        </div>
      </div>

      <div class="empty-tip" v-else-if="!loading">
        暂无商品
      </div>
</div>

      <!-- 加载状态提示 -->
      <div class="load-more-status" style="text-align: center; padding: 15px 0; font-size: 13px; color: #999;">
        <span v-if="goodsLoading">正在加载中...</span>
        <span v-else-if="goodsFinished && goodsList.length > 0">没有更多商品了</span>
        <span v-else-if="!goodsLoading && goodsList.length === 0">暂无商品</span>
      </div>
      <div class="bottom-safe-area"></div>

      <div ref="loadMoreTrigger" style="height: 10px; visibility: hidden;"></div>




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
import { channelDetail, productList } from "@/api/lhjdtm";

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
      // 分页
      goodsPage: 1,
      goodsFinished: false,
      goodsLoading: false,
      // 并发/生命周期控制
      goodsReqId: 0,       // 请求序号，防并发覆盖
      inited: false,       // 首次是否已拉过底部流
      scrollTimer: null,
      scrollEl: null,      // 实际滚动容器
      isRequestingMore: false,
      observer: null,
    }
  },
  methods: {
    fetchBottomGoods(isLoadMore = false) {
      // 只要正在加载，或者已经到底，直接拦截
      if (this.goodsLoading || this.goodsFinished) return;

      this.goodsLoading = true;
      const reqId = ++this.goodsReqId;
      const page = isLoadMore ? this.goodsPage : 1;

      productList({
        platform: 1,
        jd_type: 3,
        page: page,
        limit: 10,
        sort: 'px',
        order: 'desc'
      }).then(res => {
        if (reqId !== this.goodsReqId) return;

        if (res.code === 200) {
          const payload = res.data || {};
          let list = [];
          if (Array.isArray(payload.data)) list = payload.data;
          else if (Array.isArray(payload.list)) list = payload.list;

          if (list.length && list.some(p => p.jd_type !== undefined)) {
            const onlyJingzao = list.filter(p => Number(p.jd_type) === 3);
            if (onlyJingzao.length) list = onlyJingzao;
          }

          const fixImg = url => (url ? String(url).replace(/^http:\/\//, 'https://') : '');
          const formatList = list.map(p => ({ ...p, img: fixImg(p.img) }));

          if (isLoadMore) {
            const existingIds = new Set(this.goodsList.map(item => item.id));
            const uniqueList = formatList.filter(item => !existingIds.has(item.id));
            this.goodsList = this.goodsList.concat(uniqueList);
          } else {
            this.goodsList = formatList;
          }

          const currentPage = Number(payload.current_page || page);
          const lastPage = Number(payload.last_page || 1);

          if (currentPage >= lastPage || list.length === 0 || list.length < 10) {
            this.goodsFinished = true;
          } else {
            this.goodsPage = currentPage + 1;
          }
        }
      }).catch(err => {
        console.error('[productList] 获取商品流失败:', err);
      }).finally(() => {
        if (reqId === this.goodsReqId) {
          // 延迟 100ms 解锁，给页面渲染留出充足时间
          setTimeout(() => {
            this.goodsLoading = false;
          }, 100);
        }
      });
    },


    handleScroll() {
      if (this.scrollTimer) clearTimeout(this.scrollTimer);

      this.scrollTimer = setTimeout(() => {
        // 正在加载，或者已经没数据了，直接返回
        if (this.goodsLoading || this.goodsFinished) return;

        const el = this.scrollEl;
        const scrollTop = el ? el.scrollTop : (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
        const clientHeight = el ? el.clientHeight : (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0);
        const scrollHeight = el ? el.scrollHeight : (document.documentElement.scrollHeight || document.body.scrollHeight || 0);

        if (scrollHeight <= clientHeight) return;

        // ✅ 距离底部 200px 时触发（不要太小，防止连续触发）
        if (scrollTop + clientHeight >= scrollHeight - 200) {
          this.fetchBottomGoods(true);
        }
      }, 200); // 200ms 防抖
    },

    /* ---------------- 频道数据 ---------------- */
    channelDetailIndex() {
      const fixImg = url => (url ? String(url).replace(/^http:\/\//, 'https://') : '');

      channelDetail({ id: 13 }).then(res => {
        if (!res || res.code !== 200) {
          console.warn('[channelDetail] code != 200:', res);
          return;
        }
        const modules = (res.data && res.data.modules) || [];

        // 1. Banner
        const bannerModule = modules.find(m => m.type === 'banner');
        if (bannerModule) {
          const img = fixImg(bannerModule.banner_img);
          this.baners = img;
          this.bannerImg = img || this.bannerImg;
        }

        // 2. 分类图标
        const iconModule = modules.find(m => m.type === 'entry' && m.list_type === 'icon');
        if (iconModule) {
          this.categoryList = (iconModule.items || []).map(item => ({
            id: item.cate_id || item.id,
            img: fixImg(item.img),
            title: item.title,
            link: item.link,
            shopCateId: item.shop_cate_id || item.cate_id || item.id
          }));
        }

        // 3. 超值推荐
        const recommendModule = modules.find(m => m.type === 'grid' && m.title === '推荐');
        if (recommendModule) {
          const items = (recommendModule.items || []).map(p => ({
            ...p,
            img: fixImg(p.img)
          }));
          this.hotList = items.slice(0, 4);
        }
      }).catch(err => {
        console.error('[channelDetail] 获取京造频道数据失败:', err);
      });
    },

    formatSaleNum(num) {
      const n = Number(num) || 0;
      return n >= 10000 ? (n / 10000).toFixed(1) + '万' : n;
    },

    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.page = 1;
        // 搜索接口
      }
    },

    goToCategoryWithId(item) {
      const shopCateId = item.shopCateId || item.shop_cate_id || item.cate_id || item.id;
      if (!shopCateId) {
        console.warn('[goToCategoryWithId] 没有 shop_cate_id', item);
        return;
      }
      this.$router.push({
        path: '/productList',
        query: {
          // shop_cate_id: shopCateId,
          shop_cate_id: item.id,
          platform: 1,
          jd_type: 3,
          t: Date.now()
        }
      });
    },

    goToDetail(item) {
      this.$goDetail(item);
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
    },

    /* ---------------- 滚动容器/监听 ---------------- */
    getScrollEl() {
      const root = this.$el;
      if (!root) return null;
      const candidates = root.querySelectorAll('.scroll-content');
      for (const el of candidates) {
        const style = window.getComputedStyle(el);
        if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
          return el;
        }
      }
      return null;
    },
    bindScroll() {
      this.scrollEl = this.getScrollEl();
      const target = this.scrollEl || window;
      target.addEventListener('scroll', this.handleScroll, true);
    },
    unbindScroll() {
      const target = this.scrollEl || window;
      target.removeEventListener('scroll', this.handleScroll, true);
      this.scrollEl = null;
    }
  },
  mounted() {
    this.channelDetailIndex();
    this.fetchBottomGoods(false);

    // ✅ 初始化 IntersectionObserver 监听底部哨兵
    this.$nextTick(() => {
      const trigger = this.$refs.loadMoreTrigger;
      if (trigger) {
        this.observer = new IntersectionObserver((entries) => {
          // 如果哨兵出现在屏幕内，说明到底了
          if (entries[0].isIntersecting) {
            if (!this.goodsLoading && !this.goodsFinished) {
              this.fetchBottomGoods(true);
            }
          }
        }, { threshold: 0.1 }); // 出现 10% 就触发
        this.observer.observe(trigger);
      }
    });
  },

  activated() {
    // keep-alive 回来时刷新上半部分即可，数据保活就不需要重新拉分页
    this.channelDetailIndex();
  },

  deactivated() {
    // 离开页面销毁观察器，防止在其他页面触发了当前页面的请求
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
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