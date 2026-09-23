<template>
  <div class="fresh-milk-page" :style="pageBgStyle">
    <!-- 1. 顶部导航 -->
    <NProgress v-if="loading" />
    <!-- 2. 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="" />
    </div>

    <!-- 3. 板块一：每日鲜活 (6个商品) -->
    <div class="section-box">
      <div class="section-title"> <span class="title-text" :style="pageBgStyle1">{{ title1 }}</span>
      </div>
      <div class="goods-grid-3">
        <div class="goods-item-3" v-for="(item, index) in dailyList" :key="index" @click="goToDetail(item)">
          <img class="item-img" :src="item.img" alt="" />
          <div class="item-name">{{ item.title }}</div>

          <div class="item-bottom">
            <span class="price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
            <span class="add-btn">+</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 4. 板块二：成长补给站 (6个商品) -->
    <div class="section-box">
      <div class="section-title"> <span class="title-text" :style="pageBgStyle1">{{ title2 }}</span></div>
      <div class="goods-grid-3">
        <div class="goods-item-3" v-for="(item, index) in growthList" :key="index" @click="goToDetail(item)">
          <img class="item-img" :src="item.img" alt="" />
          <div class="item-name">{{ item.title }}</div>

          <div class="item-bottom">
            <span class="price"><span style="font-size: 10px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
            <span class="add-btn">+</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 5. 板块三：更多推荐 (双列瀑布流) -->
    <div class="section-box">
      <div class="section-title"> <span class="title-text" :style="pageBgStyle1">{{ title3 }}</span>
      </div>
      <div class="goods-grid-2">
        <div class="goods-item-2" v-for="(item, index) in moreList" :key="index" @click="goToDetail(item)">
          <img class="item-img-big" :src="item.img" alt="" />
          <div class="item-info">
            <div class="item-name-big">{{ item.title }}</div>
            <span class="platform-tag" v-if="getPlatformName(item.platform)">
              {{ getPlatformName(item.platform) }}
            </span>
            <div class="item-tags">
              <span class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</span>
            </div>
            <div class="item-bottom">
              <span class="price"><span style="font-size: 12px;font-weight: bold;">¥</span>{{ item.sell_price }}</span>
              <span class="add-btn">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { channelChildrenDetaill } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "FreshMilkPage",
  data() {
    return {
      loading: false,      // 新增
      title1: '',
      title2: '',
      title3: '',
      baners: '',
      pageBgStyle1: {},
      pageBgStyle: {},
      // 板块一：每日鲜活 (6个)
      dailyList: [

      ],
      // 板块二：成长补给站 (6个)
      growthList: [

      ],
      // 板块三：更多推荐 (双列，可继续增加数据)
      moreList: [

      ]
    }
  },
  mounted() {
    this.channelDetailIndex()
  },
  activated() {
    this.channelDetailIndex()
  },
  methods: {
    getPlatformName,
    channelDetailIndex() {
      this.loading = true;          // 请求开始

      channelChildrenDetaill({
        id: this.$route.query.id,
        nav_index: this.$route.query.nav,
        child_index: this.$route.query.index
      })
        .then(res => {
          if (res.code == 200) {
            this.baners = res.data.banner[0].img;
            this.dailyList = res.data.sections[0].items;
            this.growthList = res.data.sections[1].items;
            this.moreList = res.data.sections[2].items;

            this.title1 = res.data.sections[0].title;
            this.title2 = res.data.sections[1].title;
            this.title3 = res.data.sections[2].title;

            const bgColorStr = res.data.bg_color || '';
            const colors = bgColorStr.split(',').map(item => item.trim()).filter(item => item);
            this.pageBgStyle = { backgroundColor: colors[0] };
            this.pageBgStyle1 = { color: colors[1] };
          }
        })
        .finally(() => {
          this.loading = false;     // 成功或失败都关掉
        });
    },
    // channelDetailIndex() {
    //   channelChildrenDetaill({ id: this.$route.query.id, nav_index: this.$route.query.nav, child_index: this.$route.query.index }).then(res => {
    //     if (res.code == 200) {
    //       console.log(res)
    //       this.baners = res.data.banner[0].img;
    //       this.dailyList = res.data.sections[0].items;
    //       this.growthList = res.data.sections[1].items;
    //       this.moreList = res.data.sections[2].items;



    //       this.title1 = res.data.sections[0].title;
    //       this.title2 = res.data.sections[1].title;
    //       this.title3 = res.data.sections[2].title;

    //       const bgColorStr = res.data.bg_color || '';
    //       const colors = bgColorStr.split(',').map(item => item.trim()).filter(item => item);
    //       this.pageBgStyle = {
    //         backgroundColor: colors[0]
    //       };
    //       this.pageBgStyle1 = {
    //         color: colors[1]
    //       };

    //     }
    //   })
    // },
    goToDetail(item) {
      this.$goDetail(item);
      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="less">
.platform-tag {
  width: fit-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 3px;
  margin-bottom: 4px;
}

.fresh-milk-page {
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

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    width: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {

  .banner-img {
    width: 100%;
    // height: 410px;
    object-fit: cover;
  }
}

.title-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* ================= 3. 通用板块容器 ================= */
.section-box {
  margin: 0 10px 16px 10px;
  // background: #fff;
  border-radius: 12px;
  // padding: 16px 12px 12px 12px;

  .section-title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;

    .banner-img {
      width: 150px;
    }
  }

  /* “查看更多”通栏按钮 */
  .more-btn-box {
    text-align: center;
    color: #999;
    font-size: 13px;
    background: #F5F5F5;
    padding: 8px 0;
    border-radius: 20px;
    margin-top: 12px;
    cursor: pointer;
  }
}

/* ================= 4. 3列网格布局 (6个商品平铺) ================= */
.goods-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .goods-item-3 {
    background: #ffffff;
    border-radius: 10px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item-img {
      width: 100%;

      object-fit: cover;
      background: #fff;
      border-radius: 10px 10px 0 0;
      margin-bottom: 6px;
    }

    .item-name {
      font-size: 11px;
      color: #333;
      text-align: left;
      line-height: 1.3;
      height: 28px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 4px;
      padding: 0 10px;
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 4px;
      padding-bottom: 6px;

      .price {
        font-size: 14px;
        color: #d32f2f;
        font-weight: bold;
        padding-left: 10px;
      }

      .add-btn {
        width: 18px;
        margin-right: 10px;
        height: 18px;
        background: #ed2e33;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

/* ================= 5. 双列网格布局 (更多推荐) ================= */
.goods-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .goods-item-2 {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 10px;

    .item-img-big {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      object-fit: cover;
    }

    .item-info {
      padding: 8px 10px 0 10px;
    }

    .item-name-big {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 1px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 6px;

      .tag {
        font-size: 10px;
        color: #ff4d30;
        background: #fff0f0;
        padding: 1px 4px;
        border-radius: 4px;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2px;

      .price {
        font-size: 16px;
        color: #ed2e33;
        font-weight: bold;
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
      }
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>