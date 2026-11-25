<template>
  <div class="drink-zone-page">
    <NProgress v-if="loading" />

    <!-- 顶部大 Banner -->
    <div class="top-banner-area">
      <img class="banner-img" :src="baners" alt="饮品Banner" />
    </div>

    <!-- Banner 下方四个切换 Tab（带大小标题） -->
    <div class="zone-tab-bar" v-if="zoneList.length">
      <div v-for="(zone, index) in zoneList" :key="zone.id || index" class="zone-tab-item"
        :class="{ active: activeZoneIndex === index }" @click="handleZoneTab(index)">
        <span class="zone-tab-title">{{ zone.title }}</span>
        <span class="zone-tab-subtitle">{{ zone.subtitle }}</span>
      </div>
    </div>

    <!-- 切换内容区 -->
    <div class="zone-content" v-if="currentZone">
      <!-- 商品列表：两列网格 -->
      <div v-if="currentZone.goods && currentZone.goods.length" class="goods-grid">
        <div class="goods-item" v-for="item in currentZone.goods" :key="item.id" @click="goToDetail(item)">
          <img class="goods-img" :src="item.img" alt="" />
          <div class="goods-info">
            <!-- 来源名称 (source_name) 作为小标签 -->

            <div class="goods-name">{{ item.title }}</div>
            <div class="goods-source" v-if="item.source_name">{{ item.source_name }}</div>
            <div class="goods-price">
              <span class="symbol">¥</span>
              <span class="price">{{ item.sell_price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-tip">暂无商品数据</div>
    </div>
  </div>
</template>

<script>
import { zoneList } from "@/api/lhjdtm";

export default {
  name: "DrinkZone",
  data() {
    return {
      loading: false, baners: '',
      channelData: {},
      zoneList: [],
      activeZoneIndex: 0,
    };
  },
  computed: {
    currentZone() {
      return this.zoneList[this.activeZoneIndex] || null;
    }
  },
  methods: {
    goToDetail(item) {
      this.$goDetail(item);
    },
    zoneListIndex() {

      zoneList({ pid: 0 })
        .then(res => {
          if (res.code === 200) {
            const arr = res.data.list.filter(item =>  item.id === 60 );
            console.log(arr)
            this.baners = arr[0].banner
          }
        })
        .catch(err => {
          console.error('获取 zoneList 失败:', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    zoneListIndex1() {
      this.loading = true;
      zoneList({ pid: 60 })
        .then(res => {
          if (res.code === 200 && res.data && Array.isArray(res.data.list)) {
            // 对接口数据进行排序（按 sort 字段，如果有的话），保证 Tab 顺序一致
            // 接口返回的 list 顺序是：64户外休闲, 63追剧必备, 62清凉一夏, 61热门推荐
            // 但截图显示的 Tab 顺序是：热门推荐, 清凉一夏, 休闲食品, 户外休闲
            // 所以这里我们重新排序以匹配截图
            const sortedList = [...res.data.list].sort((a, b) => {
              const order = { 61: 0, 62: 1, 63: 2, 64: 3 };
              return (order[a.id] ?? 999) - (order[b.id] ?? 999);
            });
            this.zoneList = sortedList;
            this.activeZoneIndex = 0; // 默认选中第一个（热门推荐）
          }
        })
        .catch(err => {
          console.error('获取 zoneList 失败:', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleZoneTab(index) {
      if (this.activeZoneIndex === index) return;
      this.activeZoneIndex = index;
    }
  },
  mounted() {
    this.zoneListIndex1();
    this.zoneListIndex()
  }
}
</script>

<style scoped lang="less">
.drink-zone-page {
  background: #F4F4F4;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* Banner */
.top-banner-area {
  .banner-img {
    width: 100%;

    object-fit: cover;
    background: #f0f0f0;
  }
}

/* 四个切换 Tab（带大小标题） */
.zone-tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 6px 0;
  /* 增加一点上下内边距让整体更协调 */

  .zone-tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.25s ease;

    .zone-tab-title {
      font-size: 15px;
      color: #333;
      font-weight: 500;
      transition: color 0.25s ease;
      margin-bottom: 4px;
      /* 标题与副标题的间距 */
    }

    .zone-tab-subtitle {
      font-size: 12px;
      color: #999;
      transition: all 0.25s ease;
      padding: 2px 8px;
      border-radius: 10px;
      /* 胶囊形状 */
      background: transparent;
      /* 默认无背景 */
    }

    /* 选中状态：标题变橙红，副标题变胶囊底色 */
    &.active {
      .zone-tab-title {
        color: #EB4D3D;
        /* 截图中的橙红色 */
        font-weight: bold;
      }

      .zone-tab-subtitle {
        color: #fff;
        background: #EB4D3D;
        /* 截图中的胶囊背景色 */
      }
    }

    /* 未选中状态 hover 效果（可选） */
    &:not(.active):hover {
      .zone-tab-title {
        color: #EB4D3D;
      }
    }
  }
}

/* 切换内容区 */
.zone-content {
  margin: 0 10px;

  /* 两列商品网格 */
  .goods-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px 0;

    .goods-item {
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .goods-img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        background: #f9f9f9;
      }

      .goods-info {
        padding: 8px 10px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .goods-source {
          font-size: 10px;
          color: #ffffff;
          background: #DD0A09;
          padding: 1px 4px;
          border-radius: 4px;
          align-self: flex-start;
          font-weight: 400;
        }

        .goods-name {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 36px;
        }

        .goods-price {
          color: #ed2e33;
          font-weight: bold;
          display: flex;
          align-items: baseline;

          .symbol {
            font-size: 12px;
          }

          .price {
            font-size: 16px;
          }
        }
      }
    }
  }

  .empty-tip {
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 40px 0;
  }
}
</style>