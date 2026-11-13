<template>
  <div class="channel-page">

    <!-- 1. 顶部区域 -->
    <div class="top-wrapper">
      <img class="top-banner-img" :src="bannerImg" alt="Banner" />

      <div class="search-overlay">
        <div class="location">
          <div class="back-btn" @click="goBack">
            <img src="../../assets/lh/bk1.png" style="width: 12px;" alt="返回" />
          </div>
        </div>
        <div class="search-bar">
          <img src="../../assets/lh/serchico.png" class="search-icon" alt="" />
          <input type="text" placeholder="请输入商品名称" v-model="searchKeyword" @keyup.enter="handleSearch" />
          <span class="search-btn" @click="handleSearch">搜索</span>
        </div>
      </div>
    </div>

    <!-- 2. 分类图标 -->
    <div class="category-box">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in categoryList" :key="index" @click="goToCategoryWithId(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 3. 超值购 & 上新了 -->
    <div class="double-card-row">
      <div class="card-box pink">
        <div class="card-header" @click="goToSuperValue('recommend')">
          <span class="main-title">超值购</span>
          <span class="sub-title">低价好物限量抢</span>
        </div>
        <div class="card-imgs">
          <img :src="recommendList[0]?.img || defaultImg" alt="" />
          <img :src="recommendList[1]?.img || defaultImg" alt="" />
        </div>
      </div>
      <div class="card-box green">
        <div class="card-header" @click="goToSuperValue('new')">
          <span class="main-title">上新了</span>
          <span class="sub-title">每日更新</span>
        </div>
        <div class="card-imgs">
          <img :src="newList[0]?.img || defaultImg" alt="" />
          <img :src="newList[1]?.img || defaultImg" alt="" />
        </div>
      </div>
    </div>

    <!-- 4. 热销推荐 -->
    <div class="hot-card">
      <div class="hot-left-fixed">
        <div class="main-title">热销推荐</div>
        <div class="sub-title">TOP 100</div>
        <div class="view-all" @click="goToSuperValue('hot')">去看看 ></div>
      </div>

      <div class="hot-scroll-wrapper">
        <div class="hot-item" v-for="(item, index) in hotList" :key="index" @click="goToDetail(item)">
          <img class="hot-img" :src="item.img" alt="" />
          <div class="hot-name">{{ item.title }}</div>
          <div class="hot-points">
            <span style="font-size: 10px;">¥</span>{{ item.sell_price }}
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 底部商品瀑布流 -->
    <div class="goods-grid" v-if="goodsList.length > 0">
      <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="loadMoreTrigger" style="height: 10px; width: 100%;"></div>
    <!-- 加载状态提示 -->
    <div class="load-more-status" style="text-align: center; padding: 15px 0; font-size: 13px; color: #999;">
      <span v-if="goodsLoading">正在加载中...</span>
      <span v-else-if="goodsFinished && goodsList.length > 0">没有更多商品了</span>
      <span v-else-if="!goodsLoading && goodsList.length === 0">暂无商品</span>
    </div>

    <!-- 6. 底部导航 -->
    <div class="tab-bar">
      <div class="tab-item" @click="goToHome" :class="{ active: $route.path === '/JingdongChannel' }">
        <img class="tab-icon"
          :src="$route.path === '/JingdongChannel' ? require('../../assets/lh/jdzy/hm1-1.png') : require('../../assets/lh/jdzy/hm1-0.png')"
          alt="首页" />
        <div class="tab-text">首页</div>
      </div>
      <div class="tab-item" @click="goToCategory" :class="{ active: $route.path === '/JingdongCategory' }">
        <img class="tab-icon"
          :src="$route.path === '/JingdongCategory' ? require('../../assets/lh/jdzy/hm2-2.png') : require('../../assets/lh/jdzy/hm2-2.png')"
          alt="分类" />
        <div class="tab-text">分类</div>
      </div>
    </div>
  </div>
</template>
<script>
import { home, categoryList, productList, channelDetail } from "@/api/lhjdtm";

export default {
  name: "JingdongChannel",
  data() {
    return {
      observer: null,
      bannerImg: '',
      platform: 1,
      searchKeyword: '',
      page: 1,
      currentSort: 'px',
      loading: false,
      defaultImg: require('../../assets/lh/jdzy/b.png'),
      categoryList: [],
      hotList: [],
      recommendList: [],
      newList: [],
      goodsList: [],
      // 分页控制
      goodsPage: 1,
      goodsFinished: false,
      goodsLoading: false,
      goodsReqId: 0,
      scrollTimer: null,
    }
  },
  methods: {
    // ✅ 抽离出来的 fetch 请求
    fetchBottomGoods(isLoadMore = false) {
      // 只要正在加载，或者已经到底，直接拦截
      if (this.goodsLoading || this.goodsFinished) return;

      this.goodsLoading = true;
      const reqId = ++this.goodsReqId;
      const page = isLoadMore ? this.goodsPage : 1;

      productList({
        platform: 1,
        jd_type: 2,
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

          const formatList = list.map(p => ({
            ...p,
            img: p.img ? String(p.img).replace(/^http:\/\//, 'https://') : ""
          }));

          if (isLoadMore) {
            const existingIds = new Set(this.goodsList.map(item => item.id));
            const uniqueList = formatList.filter(item => !existingIds.has(item.id));
            this.goodsList = this.goodsList.concat(uniqueList);
          } else {
            this.goodsList = formatList;
          }

          const currentPage = Number(payload.current_page || page);
          const lastPage = Number(payload.last_page || 1);

          if (currentPage >= lastPage || list.length < 10) {
            this.goodsFinished = true;
          } else {
            this.goodsPage = currentPage + 1;
          }
        }
      }).catch(err => {
        if (reqId !== this.goodsReqId) return;
        console.error('获取商品流失败:', err);
      }).finally(() => {
        if (reqId === this.goodsReqId) {
          // 延迟解锁，确保页面渲染完毕，撑开高度
          setTimeout(() => {
            this.goodsLoading = false;
          }, 150);
        }
      });
    },

    // ✅ IntersectionObserver 初始化
    initObserver() {
      this.disconnectObserver();
      const trigger = this.$refs.loadMoreTrigger;
      if (trigger && window.IntersectionObserver) {
        this.observer = new IntersectionObserver((entries) => {
          // 如果哨兵出现在屏幕内，说明到底了
          if (entries[0].isIntersecting) {
            if (!this.goodsLoading && !this.goodsFinished) {
              this.fetchBottomGoods(true);
            }
          }
        }, { threshold: 0.1 });
        this.observer.observe(trigger);
      } else {
        // 兜底处理（旧浏览器）
        window.addEventListener('scroll', this.handleScroll, true);
      }
    },

    // ✅ IntersectionObserver 销毁
    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      window.removeEventListener('scroll', this.handleScroll, true);
    },

    // 兜底用的滚动
    handleScroll() {
      if (this.scrollTimer) clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        if (this.goodsLoading || this.goodsFinished) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
        if (scrollTop + windowHeight >= scrollHeight - 150) {
          this.fetchBottomGoods(true);
        }
      }, 500);
    },

    goToCategoryWithId(item) {
      this.$router.push({
        path: '/productList',
        query: {
          // keyword: item.title,
          shop_cate_id: item.id,
          platform: 1,
          jd_type: 2,
          t: Date.now()
        }
      });
    },

    Indexhome() {
      home({ platform: this.platform, limit: 10 }).then(res => {
        if (res.code == 200) {
          const data = res.data;
          if (data && data.recommend && data.recommend.length > 0) {
            this.recommendList = data.recommend;
          }
          if (data && data.new && data.new.length > 0) {
            this.newList = data.new;
          }
          if (data && data.hot && data.hot.length > 0) {
            this.hotList = data.hot;
          }
        }
      })
    },

    IndexcategoryList() {
      categoryList({ platform: this.platform }).then(res => {
        if (res.code == 200) {
          const apiData = res.data || [];
          const topCategories = apiData.filter(item => item.pid === 0);
          if (topCategories.length > 0) {
            this.categoryList = topCategories.slice(0, 10).map((item, index) => {
              return {
                id: item.id,
                title: item.title,
                img: item.img || this.localCategoryIcons[index] || this.localCategoryIcons[0]
              };
            });
          }
        }
      })
    },

    IndexproductList() {
      this.loading = true;
      productList({
        platform: this.platform,
        page: this.page,
        limit: 10,
        sort: this.currentSort,
        order: 'desc',
      }).then(res => {
        if (res.code == 200) {
          if (res.data && res.data.data) {
            this.goodsList = res.data.data;
          } else if (Array.isArray(res.data)) {
            this.goodsList = res.data;
          }
        }
      }).finally(() => {
        this.loading = false;
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
        this.IndexproductList();
      }
    },

    goToSuperValue(type) {
      this.$router.push({
        path: '/JingdongSuperValueList',
        query: { type: type, platform: this.platform }
      });
    },

    goToDetail(item) {
      this.$goDetail(item);
    },

    goBack() {
      this.$router.go(-1);
    },

    JingdongSuperValueList() {
      this.$router.push('/JingdongSuperValueList');
    },

    goToCategory() {
      this.$router.push('/JingdongCategory');
    },

    goToHome() {
      if (this.$route.path !== '/JingdongChannel') {
        this.$router.push('/JingdongChannel');
      }
    },

    channelDetailIndex() {
      const fixImg = (url) => url ? url.replace('http://', 'https://') : '';

      channelDetail({ id: 14 }).then(res => {
        if (res.code !== 200) return;

        const modules = res.data?.modules || [];

        const bannerModule = modules.find(m => m.type === 'banner');
        if (bannerModule) {
          this.bannerImg = fixImg(bannerModule.banner_img);
        }

        const iconModule = modules.find(m => m.type === 'entry' && m.list_type === 'icon');
        if (iconModule) {
          this.categoryList = (iconModule.items || []).map(item => ({
            id: item.cate_id || item.id,
            img: fixImg(item.img),
            title: item.title,
            link: item.link
          }));
        }

        const newModule = modules.find(m => m.type === 'grid' && m.title === '上新');
        if (newModule) {
          const items = (newModule.items || []).map(p => ({ ...p, img: fixImg(p.img) }));
          this.newList = items;
        }

        const hotModule = modules.find(m => m.type === 'grid' && m.title === '热销');
        if (hotModule) {
          const items = (hotModule.items || []).map(p => ({ ...p, img: fixImg(p.img) }));
          this.hotList = items;
        }

        const superModule = modules.find(m => m.type === 'grid' && m.title === '超值');
        if (superModule) {
          const items = (superModule.items || []).map(p => ({ ...p, img: fixImg(p.img) }));
          this.recommendList = items;
        }

        // ❌ 删掉了原本第 6 步给 goodsList 赋值的代码，防止和瀑布流互相覆盖！
      }).catch(err => {
        console.error('获取京东频道数据失败:', err);
      });
    }
  },

  mounted() {
    this.channelDetailIndex();
    this.fetchBottomGoods(false);

    // 初始化交叉观察器
    this.$nextTick(() => {
      this.initObserver();
    });
  },

  activated() {
    this.channelDetailIndex();
    this.$nextTick(() => {
      this.initObserver();
    });
  },

  deactivated() {
    this.disconnectObserver();
  },

  beforeDestroy() {
    this.disconnectObserver();
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }
}
</script>

<style scoped lang="less">
.channel-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 70px;
}

/* ================= 1. 顶部大图与悬浮搜索 ================= */
.top-wrapper {
  position: relative;
  /* 给内部的绝对定位做参照 */
  width: 100%;
  line-height: 0;

  .top-banner-img {
    width: 100%;
    display: block;
    object-fit: cover;
    height: 220px;
  }

  .search-overlay {
    position: absolute;
    top: 10px;
    /* 根据实际图片中搜索栏的高度调整，通常在大约 banner 顶部往下 10%-15% */
    left: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10;

    .location {
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      display: flex;
      align-items: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      .arrow {
        font-size: 10px;
        margin-left: 2px;
      }
    }

    .search-bar {
      flex: 1;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 20px;
      padding: 6px 6px 6px 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

      .search-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-size: 13px;
        color: #333;
      }

      .search-btn {
        background: #ff3b30;
        color: #fff;
        padding: 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
      }
    }
  }
}

/* ================= 2. 分类图标 (白底圆角盖在顶部) ================= */
.category-box {
  margin: -12px 10px 10px 10px;
  /* 让白色区域稍微向上覆盖一点 Banner */
  padding: 0 0px;
  background: #fff;
  border-radius: 12px 12px 10px 10px;
  position: relative;
  z-index: 2;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 0;
  padding: 16px 0;

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #f5f6fa;
      margin-bottom: 4px;
      object-fit: cover;
    }

    .cat-name {
      font-size: 12px;
      color: #333;
      font-weight: bold;
    }
  }
}

/* ================= 3. 双卡片 ================= */
.double-card-row {
  display: flex;
  gap: 10px;
  padding: 0px 10px 10px 10px;

  .card-box {
    flex: 1;
    border-radius: 12px;
    padding: 12px;

    &.pink {
      background: linear-gradient(180deg, #FCE8C1, #FCF8EC);
    }

    &.green {
      background: linear-gradient(180deg, #B1EACA, #e9f7f0);
    }

    .card-header {
      margin-bottom: 8px;

      .main-title {
        font-size: 15px;
        font-weight: bold;
        color: #333;
      }

      .sub-title {
        font-size: 10px;
        color: #999;
        margin-left: 4px;
      }
    }

    .card-imgs {
      display: flex;
      gap: 8px;

      img {

        flex: 1;
        aspect-ratio: 1/1;
        background: #fff;
        border-radius: 8px;
        object-fit: contain;
        width: 70px;
        height: 70px;
      }
    }
  }
}

/* ================= 4. 热销推荐 ================= */
/* ================= 4. 热销推荐 (左侧固定 + 右侧滑动) ================= */
.hot-card {
  margin: 0 10px 10px;
  background: #FFEDED;
  border-radius: 12px;
  // padding: 12px;
  padding: 12px 12px 8px 12px;
  display: flex;
  /* 关键：改为 Flex 布局，左右排列 */
  align-items: center;
  gap: 12px;

  /* 左侧固定区域 */
  .hot-left-fixed {
    flex-shrink: 0;
    /* 防止被压缩 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 文字靠左对齐 */
    justify-content: center;
    width: 40px;
    /* 保证区域足够宽，避免文字折行 */

    .main-title {
      font-size: 15px;
      font-weight: bold;
      color: #d32f2f;
      /* 标题变红，与截图一致 */
      line-height: 1.5;
      margin-bottom: 2px;
    }

    .sub-title {
      font-size: 10px;
      color: #999;
      margin-bottom: 4px;
      margin-top: 3px;
    }

    .view-all {
      font-size: 10px;
      color: #d32f2f;
      /* 按钮变红 */
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-weight: 500;
    }
  }

  /* 右侧滚动区域 */
  .hot-scroll-wrapper {
    flex: 1;
    /* 占满剩余空间 */
    display: flex;
    overflow-x: auto;
    /* 允许横向滚动 */
    gap: 8px;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    /* 苹果设备滑动更顺滑 */

    &::-webkit-scrollbar {
      display: none;
      /* 隐藏滚动条 */
    }

    .hot-item {
      flex: 0 0 calc((100% - 16px) / 3);
      /* 一屏 3 个，减去 gap */
      background: #fff;
      border-radius: 8px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;

      .hot-img {
        width: 100%;
        /* 图片跟着卡片宽 */
        aspect-ratio: 1 / 1;
        /* 正方形 */
        background: #f5f6fa;
        border-radius: 6px 6px 0 0;
        margin-bottom: 6px;
        object-fit: cover;
      }

      .hot-name {
        font-size: 11px;
        color: #333;
        text-align: center;
        padding: 0px 8px;
        line-height: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /* 最多两行 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .hot-points {
        padding-bottom: 4px;
        display: flex;
        align-items: baseline;
        font-size: 13px;
        color: #d32f2f;
        font-weight: bold;
        margin-top: 2px;
      }
    }
  }
}

/* ================= 5. 商品流 ================= */
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

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .goods-info {
      padding: 8px 10px 4px 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      /* 关键：垂直排列 */
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      /* 长串也能断行 */
      line-height: 1.3;
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

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .add-cart {
      width: 20px;
      height: 20px;
      background: #ff4d30;
      color: #fff;
      border-radius: 50%;
      display: flex;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  }
}

.bottom-safe {
  height: 60px;
}

/* ================= 6. TabBar ================= */
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
  padding-bottom: env(safe-area-inset-bottom);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
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

    &.active .tab-text {
      color: #ff3b30;
      font-weight: bold;
    }
  }

  // 商品副标题
  .goods-subtitle {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 市场价（划线价）
  .market-price {
    font-size: 11px;
    color: #999;
    text-decoration: line-through;
    margin-left: 6px;
    font-weight: normal;
  }

  // 空状态
  .empty-tip {
    text-align: center;
    color: #999;
    padding: 40px 0;
    font-size: 14px;
  }
}
</style>