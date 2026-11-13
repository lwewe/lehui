<template>
  <div class="tmall-page">
    <!-- 1. 顶部大图 + 悬浮搜索 -->
    <div class="top-wrapper">
      <img class="top-banner-img" :src="bannerImg || defaultBanner" alt="Banner" />

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
          <img class="cat-icon" :src="item.img || defaultImg" alt="" />
          <div class="cat-name">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 3. 超级补贴 + 独家上新 -->
    <div class="subsidy-row">
      <div class="subsidy-left-box">
        <div class="subsidy-header">
          <div style="display: flex;align-items: center;">
            <span class="main-title">超级补贴</span>
            <span class="badge">爆款低价</span>
          </div>
          <span style="color: #FA2C19; font-size: 12px;" @click="goToSuperValue('recommend')">减运费专区</span>
        </div>
        <div class="subsidy-scroll">
          <div class="subsidy-item" v-for="(item, index) in recommendList" :key="index" @click="goToDetail(item)">
            <img class="subsidy-img" :src="item.img || defaultImg" alt="" />
            <div class="subsidy-name">{{ item.title }}</div>
            <div class="subsidy-price">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="new-arrival-box">
        <div class="new-title" @click="TmallExclusiveNew('new')">独家上新</div>
        <div class="new-desc">去购买 ▶</div>
        <img class="new-img" :src="(newList[0] && newList[0].img) || defaultImg" alt=""
          @click="goToDetail(newList[0])" />
      </div>
    </div>

    <!-- 4. 四个切换 Tab -->
    <div class="tab-header-row">
      <div class="tab-btn" :class="{ active: currentTab === 0 }" @click="changeTab(0)">猜你喜欢</div>
      <div class="tab-btn" :class="{ active: currentTab === 1 }" @click="changeTab(1)">热门推荐</div>
      <div class="tab-btn" :class="{ active: currentTab === 2 }" @click="changeTab(2)">热销榜</div>
      <div class="tab-btn" :class="{ active: currentTab === 3 }" @click="changeTab(3)">新品</div>
    </div>

    <!-- 5. 底部商品瀑布流 -->
    <div class="goods-grid" v-if="currentGoodsList.length > 0">
      <div class="goods-item" v-for="(item, index) in currentGoodsList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.img || defaultImg" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
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

    <!-- 空状态 -->
    <!-- 空状态 -->
    <div class="empty-tip" v-if="!loading && currentGoodsList.length === 0">
      暂无商品
    </div>

    <!-- 加载状态提示 -->
    <div class="load-more-status" v-if="currentGoodsList.length > 0">
      <span v-if="pageData[currentTab] && pageData[currentTab].loading">正在加载中...</span>
      <span v-else-if="pageData[currentTab] && pageData[currentTab].finished">没有更多商品了</span>
    </div>

    <div ref="loadMoreTrigger" style="height: 10px; width: 100%;"></div>

    <!-- 6. 底部导航 -->
    <div class="tab-bar">
      <div class="tab-item" @click="goToHome">
        <img class="tab-icon"
          :src="$route.path === '/TmallSupermarket' ? require('../../assets/lh/tm/t-1.png') : require('../../assets/lh/tm/t-11.png')"
          alt="首页" />
        <div class="tab-text" :class="{ active: $route.path === '/TmallSupermarket' }">首页</div>
      </div>

      <div class="tab-item" @click="goToCategory">
        <img class="tab-icon"
          :src="$route.path === '/TmallCategory' ? require('../../assets/lh/tm/t-2.png') : require('../../assets/lh/tm/t-22.png')"
          alt="分类" />
        <div class="tab-text" :class="{ active: $route.path === '/TmallCategory' }">分类</div>
      </div>
    </div>
  </div>
</template>

<script>
import { channelDetail, productList } from "@/api/lhjdtm";

export default {
  name: "TmallSupermarket",
  data() {
    return {
      observer: null,
      platform: 2,
      searchKeyword: '',
      currentTab: 0,
      loading: false,
      defaultImg: require('../../assets/lh/730.png'),
      defaultBanner: require('../../assets/lh/tm/b1.png'),
      bannerImg: '',
      baners: '',
      categoryList: [],
      recommendList: [],
      newList: [],
      tabList: [],
      pageData: {},
      tabReqId: 0, // ✅ 新增：防止 Tab 切换后旧请求覆盖新数据
    }
  },
  computed: {
    currentGoodsList() {
      if (this.tabList.length === 0) return [];
      const tab = this.tabList[this.currentTab];
      return (tab && tab.items) || [];
    }
  },
  methods: {
    channelDetailIndex() {
      channelDetail({ id: 16 }).then(res => {
        if (res.code !== 200) return;
        const modules = res.data?.modules || [];

        const bannerModule = modules.find(m => m.type === 'banner');
        if (bannerModule) {
          this.bannerImg = bannerModule.banner_img || '';
          this.baners = bannerModule.banner_img || '';
        }

        const iconModule = modules.find(m => m.type === 'entry' && m.list_type === 'icon');
        if (iconModule) {
          this.categoryList = (iconModule.items || []).map(item => ({
            id: item.cate_id || item.id,
            img: item.img || this.defaultImg,
            title: item.title,
            link: item.link
          }));
        }

        const subsidyModule = modules.find(m => m.type === 'grid' && m.title === '超级补贴');
        if (subsidyModule) {
          this.recommendList = (subsidyModule.items || []).slice(0, 3);
        }

        const newModule = modules.find(m => m.type === 'grid' && m.title === '独家上新');
        if (newModule) {
          this.newList = newModule.items || [];
        }

        const tabModule = modules.find(m => m.type === 'entry' && m.list_type === 'tab');
        if (tabModule && tabModule.items) {
          this.tabList = tabModule.items.map(item => ({
            name: item.title,
            items: item.items || [] // 如果是空的，后续用接口填补
          }));

          this.currentTab = 0;
          this.pageData = {};
          this.fetchTabProducts(0);

          this.$nextTick(() => {
            this.initObserver();
          });
        }
      });
    },

    fetchTabProducts(index, isLoadMore = false) {
      if (!this.pageData[index]) {
        this.pageData[index] = { page: 1, finished: false, loading: false };
      }
      const status = this.pageData[index];

      if (status.loading || status.finished) return;

      if (isLoadMore && (!this.tabList[index] || this.tabList[index].items.length === 0)) {
        return;
      }

      status.loading = true;
      this.loading = true;

      // ✅ 锁定当前请求的 Tab ID
      const reqId = ++this.tabReqId;
      const reqTab = index;

      let params = {
        platform: 2,
        page: status.page,
        limit: 10
      };

      if (index === 1) {
        params.hot = 1;
      } else if (index === 2) {
        params.sort = 'sales';
        params.order = 'desc';
      } else if (index === 3) {
        params.sort = 'id';
        params.order = 'desc';
      } else {
        params.sort = 'px';
        params.order = 'desc';
      }

      productList(params).then(res => {
        // ✅ 如果请求返回时，用户已经切了别的 Tab，直接丢弃数据
        if (reqId !== this.tabReqId || reqTab !== this.currentTab) return;

        if (res.code === 200) {
          const payload = res.data || {};
          let list = [];
          if (Array.isArray(payload.data)) list = payload.data;
          else if (Array.isArray(payload.list)) list = payload.list;

          const formatList = list.map(p => ({
            ...p,
            img: p.img ? String(p.img).replace(/^http:\/\//, 'https://') : this.defaultImg
          }));

          if (isLoadMore) {
            const oldList = this.tabList[index].items || [];
            const existingIds = new Set(oldList.map(item => item.id));
            const uniqueList = formatList.filter(item => !existingIds.has(item.id));
            this.$set(this.tabList[index], 'items', oldList.concat(uniqueList));
          } else {
            this.$set(this.tabList[index], 'items', formatList);
          }

          const currentPage = Number(payload.current_page || status.page);
          const lastPage = Number(payload.last_page || 1);

          if (currentPage >= lastPage || list.length < 10) {
            status.finished = true;
          } else {
            status.page = currentPage + 1;
          }
        }
      }).catch(err => {
        if (reqId !== this.tabReqId) return;
        console.error(`获取商品失败:`, err);
      }).finally(() => {
        if (reqId === this.tabReqId) {
          // ✅ 保证当前 Tab 状态解锁
          setTimeout(() => {
            status.loading = false;
            this.loading = false;
          }, 150);
        }
      });
    },

    initObserver() {
      this.disconnectObserver();
      const trigger = this.$refs.loadMoreTrigger;
      if (trigger && window.IntersectionObserver) {
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            const index = this.currentTab;
            const status = this.pageData[index];
            if (status && !status.loading && !status.finished) {
              this.fetchTabProducts(index, true);
            }
          }
        }, { threshold: 0.1 });
        this.observer.observe(trigger);
      } else {
        window.addEventListener('scroll', this.handleScrollFallback, true);
      }
    },

    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      window.removeEventListener('scroll', this.handleScrollFallback, true);
    },

    handleScrollFallback() {
      const index = this.currentTab;
      const status = this.pageData[index];
      if (!status || status.loading || status.finished) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight >= scrollHeight - 150) {
        this.fetchTabProducts(index, true);
      }
    },

    // ✅ 终极修复的切换 Tab 逻辑
    changeTab(index) {
      if (this.currentTab === index) return;

      // 1. 立刻断开观察器
      this.disconnectObserver();

      // 2. 切换 Tab
      this.currentTab = index;

      // 3. 立刻将页面滚回顶部，打断旧 Tab 的滚动位置
      window.scrollTo(0, 0);

      // 4. 重置目标 Tab 的数据并请求
      this.pageData[index] = { page: 1, finished: false, loading: false };
      this.fetchTabProducts(index, false);

      // 5. 等待 DOM 更新完毕（新数据加载显示）后，重新恢复观察器
      this.$nextTick(() => {
        // 双保险：等浏览器渲染帧结束再挂载
        requestAnimationFrame(() => {
          this.initObserver();
        });
      });
    },

    formatSaleNum(num) {
      if (num >= 10000) return (num / 10000).toFixed(1) + '万';
      return num;
    },

    handleSearch() {
      if (this.searchKeyword.trim()) {
        console.log('搜索:', this.searchKeyword);
      }
    },

    goToCategoryWithId(item) {
      this.$router.push({
        path: '/productList',
        query: {
          // keyword: item.title,
          shop_cate_id: item.id,
          platform: 2,
          t: Date.now()
        }
      });
    },

    goToSuperValue() {
      this.$router.push('/TmallTodaySuperLow');
    },

    goToDetail(item) {
      if (!item) return;
      this.$goDetail(item);
    },

    addToCart(item) {
      console.log('加入购物车:', item);
    },

    goBack() {
      this.$router.go(-1);
    },

    TmallExclusiveNew() {
      this.$router.push('/TmallExclusiveNew');
    },

    goToHome() {
      if (this.$route.path !== '/TmallSupermarket') {
        this.$router.push('/TmallSupermarket');
      }
    },

    goToCategory() {
      this.$router.push('/TmallCategory');
    }
  },

  mounted() {
    this.channelDetailIndex();
  },

  activated() {
    this.$nextTick(() => {
      this.initObserver();
    });
  },

  deactivated() {
    this.disconnectObserver();
  },

  beforeDestroy() {
    this.disconnectObserver();
  }
}
</script>

<style scoped lang="less">
.goods-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.market-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  margin-left: 6px;
  font-weight: normal;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

.tmall-page {
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 70px;
}

/* ================= 1. 顶部大图 + 悬浮搜索 ================= */
.top-wrapper {
  position: relative;
  width: 100%;
  line-height: 0;

  .top-banner-img {
    width: 100%;
    display: block;
    object-fit: cover;
    padding-top: 49px;
  }

  .search-overlay {
    background-color: #fd0046;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 10px;
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
        background: #F42E45;
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

/* ================= 2. 分类图标 ================= */
.category-box {
  margin: -12px 10px 10px 10px;
  padding: 0;
  background: #fff;
  border-radius: 12px 12px 0 0;
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
      font-weight: 600;
    }
  }
}

/* ================= 3. 超级补贴 ================= */
.subsidy-row {
  display: flex;
  gap: 10px;
  padding: 0 10px 12px;
}

.subsidy-left-box {
  flex: 2.5;
  background: #fff;
  border-radius: 12px;
  padding: 12px;

  .subsidy-header {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    margin-bottom: 10px;

    .main-title {
      font-size: 15px;
      font-weight: bold;
      color: #333;
    }

    .badge {
      font-size: 9px;
      color: #fff;
      background: #ff4d30;
      padding: 0px 4px;
      border-radius: 10px 10px 10px 0;
    }
  }

  .subsidy-scroll {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    justify-content: space-between;

    &::-webkit-scrollbar {
      display: none;
    }

    .subsidy-item {
      flex: 0 0 60px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .subsidy-img {
        width: 50px;
        height: 50px;
        background: #f5f6fa;
        border-radius: 8px;
        object-fit: cover;
      }

      .subsidy-name {
        font-size: 10px;
        color: #333;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60px;
      }

      .subsidy-price {
        color: #d32f2f;

        .symbol {
          font-size: 10px;
          font-weight: bold;
        }

        .price {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}

.new-arrival-box {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .new-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }

  .new-desc {
    font-size: 10px;
    color: #999;
    margin-bottom: 8px;
  }

  .new-img {
    width: 60px;
    height: 60px;
    background: #f5f6fa;
    border-radius: 8px;
    object-fit: cover;
  }
}

/* ================= 4. 切换 Tabs ================= */
.tab-header-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 10px 12px;
  overflow-x: auto;

  .tab-btn {
    display: inline-block;
    font-size: 14px;
    color: #3D3D3D;
    cursor: pointer;
    position: relative;

    &.active {
      color: #000000;
      font-weight: bold;
      border-bottom: 3px solid #00c46d;
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
      padding: 8px 12px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
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
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
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

    .tab-text.active {
      color: #46C800;
      font-weight: bold;
    }
  }
}

.load-more-status {
  text-align: center;
  padding: 16px 0 30px 0;
  font-size: 12px;
  color: #999;
  background: #f7f7f7;
}
</style>