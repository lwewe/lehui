<template>
  <div class="hema-page">
    <div class="search-bar">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="search-input-box">
        <van-icon name="search" class="search-icon" />
        <input class="search-input" v-model="keyword" placeholder="请输入商品名称" @keyup.enter="handleSearch" />
      </div>
      <div class="search-btn" @click="handleSearch">搜索</div>
    </div>

    <!-- Banner（本地图，保留） -->
    <div class="banner-area">
      <img class="banner-img" src="../../assets/lh/hm/b1.png" alt="盒马Banner" />
    </div>

    <!-- 分类图标 -->
    <div class="category-box" v-if="categoryList.length">
      <div class="category-grid">
        <div class="cat-item" v-for="(item, index) in categoryList.slice(0, 10)" :key="index" @click="goCategory(item)">
          <img class="cat-icon" :src="item.img" alt="" />
          <div class="cat-name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 每日特惠 -->
    <!-- <div class="daily-special" v-if="dailyList.length">
      <div class="ds-header">
        <span class="ds-title">每日特惠</span>
        <div class="ds-more" @click="HemaFreshnew()">进入频道 ›</div>
      </div>

      <div class="ds-scroll-list">
        <div class="ds-item" v-for="(item, index) in dailyList" :key="index" @click="goDetail(item)">
          <img class="ds-img" :src="item.img" alt="" />
          <div class="ds-info">
            <div class="ds-tag" v-if="item.tag">{{ item.tag }}</div>
            <div class="ds-name">{{ item.name }}</div>
            <div class="ds-bottom">
              <div class="ds-price"><span style="font-size: 10px;">¥</span>{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 底部商品瀑布流 -->
    <div class="goods-grid" v-if="goodsList.length">
      <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goDetail(item)">
        <img class="goods-img" :src="item.picUrl" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-bottom">
            <div class="price-box">
              <span class="symbol">¥</span>
              <span class="price">{{ item.price }}</span>
              <span v-if="item.sell_price < item.market_price"
                style="color: #9F9D9D;font-size: 10px;text-decoration: line-through;">
                {{ item.market_price }}
              </span>
            </div>
            <div class="add-cart">+</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import { channelDetail, categoryList } from "@/api/lhjdtm";
import { hemaCategoriesList, hemaProductsList } from "@/api/hemaapi";
export default {
  name: "HemaFresh",
  data() {
    return {
      bannerImg: "",
      categoryList: [],
      dailyList: [],
      goodsList: [],
      page: 1,
      limit: 10,keyword: "",
      isLoading: false,
      isScroll: false,   // true 表示没有更多了
      timer: null
    };
  },
  methods: {
    goBack() {
  this.$router.go(-1);
},

handleSearch() {
  // 重置分页，从第 1 页开始
  this.page = 1;
  this.isScroll = false;
  this.goodsList = [];   // 搜索时清空旧列表
  this.hemaProductsLists(1);
},

    async hemaProductsLists(page = this.page) {
      if (this.isLoading) return       // 防止重复请求
      if (this.isScroll && page > 1) return  // 没有更多了就不请求

      this.isLoading = true
      try {
        const res = await hemaProductsList({ page, limit: this.limit,keyword: this.keyword || ""  })
        this.isLoading = false

        if (res.code === 200 && res.data) {
          const list = res.data.list || []

          if (list.length === 0) {
            this.isScroll = true    // 没有更多
            return
          }

          if (page === 1) {
            this.goodsList = []
          }
          this.goodsList = [...this.goodsList, ...list]

          // 如果返回数量小于 limit，说明没有下一页
          if (list.length < this.limit) {
            this.isScroll = true
          }
        }
      } catch (err) {
        this.isLoading = false
        console.error("hemaProductsList 失败:", err)
      }
    },
    handleScroll() {
      if (this.timer) return
      this.timer = setTimeout(() => {
        this.timer = null

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight

        // ✅ 留 50px 余量，提前触发
        if (scrollTop + clientHeight >= scrollHeight - 50) {
          if (this.isScroll || this.isLoading) return
          this.page++
          this.hemaProductsLists(this.page)
        }
      }, 200)
    },
    async categoryLists() {
      try {
        const res = await categoryList({ platform: 4 });
        if (res.code === 200 && res.data) {

        }
      } catch (err) {
        console.error("categoryList 失败:", err);
      }
    },
    async fetchHomeData1() {
      try {
        const res = await hemaCategoriesList({ parent_id: 15, page: 1, limit: 50 });
        if (res.code === 200 && res.data) {

        }
      } catch (err) {
        console.error("hemaCategoriesList 失败:", err);
      }
    },
    async fetchHomeData() {
      try {
        const res = await channelDetail({ id: 15 });
        if (res.code === 200 && res.data) {
          const data = res.data;

          // 1. Banner
          if (data.banner && data.banner.length) {
            this.bannerImg = data.banner[0].img;
          }



          // 3. sections
          if (data.sections && data.sections.length) {
            // 每日特惠
            const dailySec = data.sections.find(s => s.title === "每日特惠");
            if (dailySec && dailySec.items) {
              this.dailyList = dailySec.items.map(item => ({
                id: item.product_id,
                local_id: item.id,
                name: item.title,
                img: item.img,
                price: item.sell_price,
                market_price: item.market_price || "",
                platform: 4
              }));
            }

            // 底部商品瀑布流

          }
        }
      } catch (err) {
        console.error("channelDetail 失败:", err);
      }
    },

    goCategory(item) {
      this.$router.push({
        path: "/HemaFreshnew",
        query: { cate_id: item.id, title: item.name }
      });
    },

    goDetail(item) {
      console.log('goDetail 被点击，item =', JSON.stringify(item));
      this.$router.push({
        path: '/HemaDetail',
        query: {
          product_id: item.product_id,
          // local_id: item.local_id
        }
      }).then(() => {
        console.log('跳转成功，当前路由 =', this.$route.fullPath);
      }).catch(err => {
        console.log('跳转失败 =', err);
      });
    },

    HemaFreshnew() {
      this.$router.push("/HemaFreshnew");
    }
  },
  mounted() {
    this.fetchHomeData();
    this.fetchHomeData1();
    this.hemaProductsLists(1);   // ✅ 明确传 1

    window.addEventListener('scroll', this.handleScroll);
    this.categoryLists()
  },
  activated() {


    window.addEventListener('scroll', this.handleScroll);
  },
  deactivated() {

    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>


<style scoped lang="less">
.hema-page {
  background: #bdecff;
  min-height: 100vh;
  // padding-bottom: 70px;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #fff;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    width: 24px;
  }

  .nav-left {
    .back-icon {
      font-size: 24px;
    }
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 2. Banner ================= */
.banner-area {
  width: 100%;

  .banner-img {
    width: 100%;
    display: block;
    object-fit: cover;
  }
}

/* ================= 3. 分类图标 ================= */
.category-box {
  padding: 16px 0;
  background: #fff;
  border-radius: 12px;
  margin: -12px 10px 10px 10px;
  position: relative;
  z-index: 2;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 0;

  .cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    /* ⚠ 关键：允许子元素收缩 */

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
      width: 100%;
      white-space: nowrap;
      /* ⚠ 不换行 */
      overflow: hidden;
      /* ⚠ 超出隐藏 */
      text-overflow: ellipsis;
      /* ⚠ 省略号 */
      text-align: center;
      padding: 0 2px;
      /* 左右留一点空间 */
      box-sizing: border-box;
    }
  }
}

/* ================= 4. 每日特惠 ================= */
.daily-special {
  margin: 0 10px 12px 10px;
  background: #FFF3F3;
  border-radius: 12px;
  padding: 12px;

  .ds-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .ds-title {
      font-size: 15px;
      font-weight: bold;
      color: #333;
    }

    .ds-more {
      font-size: 12px;
      color: #999;
    }
  }

  .ds-scroll-list {
    display: flex;
    overflow-x: auto;
    gap: 10px;

    // padding-bottom: 4px;
    &::-webkit-scrollbar {
      display: none;
    }

    .ds-item {
      position: relative;
      flex: 0 0 84px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;

      .ds-img {
        width: 100%;
        aspect-ratio: 1/1;
        background: #f5f6fa;
        object-fit: contain;
      }

      .ds-info {
        padding: 0px;
      }

      .ds-tag {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 10px;
        color: #fff;
        background: #ff4d30;
        display: inline-block;
        padding: 0px 2px;
        border-radius: 0 0px 4px 0;
        margin-bottom: 2px;
      }

      .ds-name {
        font-size: 12px;
        color: #333;
        white-space: nowrap;
        padding: 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        // margin-bottom: 4px;
      }

      .ds-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px 4px 8px;
      }

      .ds-price {
        font-size: 13px;
        font-weight: bold;
        color: #d32f2f;
        padding-bottom: 4px;
      }

      .ds-cart {
        width: 16px;
        height: 16px;
        background: #ff4d30;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
    }
  }
}

/* ================= 5. 商品瀑布流 ================= */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 10px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;

    .goods-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #e0e0e0;
      object-fit: cover;
    }

    .goods-info {
      padding: 10px 10px 6px 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 2px;
      line-height: 1.4;
      height: calc(14px * 1.4 * 2);

      /* 两行省略 */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
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
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }
}

/* ================= 6. 底部导航 ================= */


.bottom-safe {
  height: 60px;
}

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
     background: #e3e3e3;
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
    background: #28A2EB;
    color: #fff;
    font-size: 14px;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
  }
}
</style>