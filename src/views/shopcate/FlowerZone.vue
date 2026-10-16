<template>
  <div class="flower-zone-page" ref="scrollPage" @scroll="onScroll">
    <NProgress v-if="pageLoading" />
    <!-- 1. 顶部 Banner -->
    <div class="search-bar">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="search-input-box">
        <van-icon name="search" class="search-icon" />
        <input class="search-input" v-model="keyword" placeholder="请输入商品名称" @keyup.enter="handleSearch" />
      </div>
      <div class="search-btn" @click="handleSearch">搜索</div>
    </div>
    <div class="top-banner-area">
      <div style="padding: 10px;">
        <img class="banner-img" :src="bannerImg" alt="鲜花Banner" @click="handleBannerClick" />
      </div>
    </div>

    <!-- 2. 中间左右滚动的图标分类 -->
    <div class="scroll-category-container">
      <div class="tab-wrapper">
        <div v-for="(item, index) in flowscage" :key="index" class="tab-item"
          :class="{ active: currentGroupId === item.group_id }" @click="handleNavClick(item)">
          <div class="tab-name">{{ item.group_name }}</div>
          <div class="tab-sub" v-if="index == 0">{{ '鲜花臻选' }}</div>
          <div class="tab-sub" v-if="index == 1">{{ '视觉绚烂' }}</div>

        </div>
      </div>
      <!-- <div class="scroll-wrapper">
        <div class="scroll-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
          <img class="scroll-icon" :src="item.img" alt="" />
          <div class="scroll-name">{{ item.title }}</div>
        </div>
      </div> -->
    </div>

    <!-- 3. 鲜花产品瀑布流 -->
    <div class="goods-grid">
      <div class="goods-item" v-for="(item, index) in flowerList" :key="index" @click="goToDetail(item)">
        <img class="goods-img" :src="item.product_image || noImgs" alt="" @error="onImgError" />
        <div class="goods-info">
          <div class="goods-name">{{ item.product_name }}</div>
          <!-- {{ item.product_spu }}支 -->

          <span class="platform-tag" v-if="item.product_classify_name">
            {{ item.product_classify_name }}
          </span>

          <div class="goods-tags" v-if="item.tags && item.tags.length">
            <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
          </div>

          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.discount_price }}</span>
              <span class="origin-price" v-if="item.original_price && item.original_price !== item.discount_price">
                ¥{{ item.original_price }}
              </span>
            </div>
            <div class="add-btn">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="load-more">
      <span v-if="loading">加载中...</span>
      <span v-else-if="finished">没有更多了</span>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import noImg from '@/assets/no-img.png'
import { channelDetail } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
import { flowerClassify, flowerProducts } from '@/api/flower'

export default {
  name: "FlowerZone",
  data() {
    return {
      keyword: "",
      currentGroupId: "",
      flowscage: [],
      bannerImg: '',
      navList: [],
      flowerList: [],
      noImgs: noImg,

      page: 1,
      limit: 20,
      total: 0,
      loading: false,
      pageLoading: false,
      finished: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 搜索：不清空列表，接口回来直接替换
    handleSearch() {
      this.page = 1;
      this.total = 0;
      this.finished = false;
      // 不清 flowerList
      this.flowerProducts1(true, false);
    },

    onImgError(e) {
      e.target.src = this.noImgs
    },
    getPlatformName,

    /**
     * 获取鲜花列表
     * @param {Boolean} isRefresh     是否重置列表（true=替换，false=追加）
     * @param {Boolean} showTopLoading 是否显示顶部 NProgress（只有首屏才传 true）
     */
    async flowerProducts1(isRefresh = false, showTopLoading = false) {
      if (this.loading) return;
      if (!isRefresh && this.finished) return;

      this.loading = true;
      if (showTopLoading) this.pageLoading = true;

      try {
        const res = await flowerProducts({
          page: this.page,
          limit: this.limit,
          product_name: this.keyword || "",
          cate_id: this.currentGroupId || ""
        });

        if (res.code === 200 && res.data) {
          const list = res.data.list || [];
          this.total = res.data.total || 0;

          if (isRefresh) {
            this.flowerList = list;          // 接口回来才替换，不提前清空
          } else {
            this.flowerList = [...this.flowerList, ...list];
          }

          if (this.flowerList.length >= this.total) {
            this.finished = true;
          } else {
            this.page += 1;
          }
        }
      } catch (err) {
        console.error('flowerProducts 失败:', err);
      } finally {
        this.loading = false;
        this.pageLoading = false;
      }
    },

    onScroll() {
      const el = this.$refs.scrollPage;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        this.flowerProducts1();
      }
    },

    async flowerClassifys() {
      try {
        const res = await flowerClassify({ group_id: '', parent_id: 0 });
        if (res.code === 200 && res.data) {
          this.flowscage = res.data;

          if (this.flowscage.length && !this.currentGroupId) {
            this.currentGroupId = this.flowscage[0].group_id;
            this.page = 1;
            this.finished = false;
            // 首屏才显示 NProgress
            this.flowerProducts1(true, true);
          }
        }
      } catch (err) {
        console.error('flowerClassify 失败:', err);
      }
    },

    async fetchHomeData() {
      try {
        const res = await channelDetail({ id: 12 });
        if (res.code === 200 && res.data) {
          const data = res.data;

          if (data.banner && data.banner.length) {
            this.bannerImg = data.banner[0].img;
          }

          this.navList = (data.nav || []).map((item, index) => ({
            id: index,
            title: item.title,
            img: item.img || '',
            products: item.products || []
          }));
        }
      } catch (err) {
        console.error('channelDetail 失败:', err);
      }
    },

    // tab 切换：不清空列表，接口回来直接替换
    handleNavClick(item) {
      if (this.currentGroupId === item.group_id) return;

      this.currentGroupId = item.group_id;
      this.page = 1;
      this.total = 0;
      this.finished = false;
      // 不清 flowerList
      this.flowerProducts1(true, false);
    },

    goToDetail(item) {
      this.$router.push({
        path: '/FlowerDetail',
        query: {
          product_id: item.product_id,
          local_id: item.local_id
        }
      });
    },

    handleBannerClick() {
      console.log('点击Banner');
    },

    // 只重置分页状态，不清空列表
    resetPage() {
      this.page = 1;
      this.total = 0;
      this.finished = false;
      this.pageLoading = false;
      // 不清 flowerList
    }
  },

  activated() {
    this.resetPage();
    this.fetchHomeData();
    // 不直接调 flowerProducts1，交给 flowerClassifys 拿到默认分类后再调
    this.flowerClassifys();
  },
}
</script>

<style scoped lang="less">
.flower-zone-page {
  background: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 分类标签 */
.platform-tag {
  display: inline-block;
  width: max-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 2px;
  margin-bottom: 4px;
}

/* ================= 1. Banner ================= */
.top-banner-area {
  width: 100%;

  .banner-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    background: #f0f0f0;
    margin-bottom: 10px;
  }
}

/* ================= 2. 横向滚动图标 ================= */
.scroll-category-container {
  background: #fff;
  margin: -12px 10px 10px 10px;
  border-radius: 10px;
  padding: 12px 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .scroll-wrapper {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 0 10px;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .scroll-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 72px;
      margin-right: 8px;
      cursor: pointer;

      .scroll-icon {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #f5f6fa;
        margin-bottom: 6px;
        object-fit: cover;
      }

      .scroll-name {
        font-size: 12px;
        color: #333;
        font-weight: 600;
        text-align: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

/* ================= 3. 商品瀑布流 ================= */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 20px 16px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    cursor: pointer;

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .goods-info {
      padding: 10px 10px 6px 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      -webkit-box-orient: vertical;
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
      gap: 4px;

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }

      .origin-price {
        font-size: 11px;
        color: #999;
        text-decoration: line-through;
        margin-left: 4px;
      }
    }

    .add-btn {
      width: 20px;
      height: 20px;
      background: #ed2e33;
      font-weight: bold;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

/* 加载更多 */
.load-more {
  text-align: center;
  font-size: 13px;
  color: #999;
  padding: 12px 0 20px;
}

.bottom-safe {
  height: 20px;
}

/* ================= 0. 顶部搜索栏 ================= */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;

  .back-icon {
    font-size: 20px;
    color: #333;
    flex-shrink: 0;
  }

  .search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 6px 12px;
    gap: 6px;

    .search-icon {
      font-size: 16px;
      color: #999;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;

      &::placeholder {
        color: #bbb;
      }
    }
  }

  .search-btn {
    flex-shrink: 0;
    background: #FF6E9E;
    color: #fff;
    font-size: 14px;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
  }
}

/* ================= 2. 分类切换 ================= */
.scroll-category-container {
  background: #fff;
  margin: -12px 10px 10px 10px;
  border-radius: 10px;
  padding: 12px 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .tab-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .tab-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    position: relative;
    padding: 4px 0;

    .tab-name {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }

    .tab-sub {
      font-size: 11px;
      color: #bbb;
      margin-top: 4px;
    }

    &.active {
      .tab-name {
        color: #FF6E9E;
        font-weight: bold;
      }

      .tab-sub {
        color: #FF6E9E;
        background: #FFE8F0;
        border-radius: 10px;
        padding: 2px 8px;
        display: inline-block;
      }
    }
  }
}
</style>