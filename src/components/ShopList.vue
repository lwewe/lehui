<template>
  <div class="shop-card" @click="toDetail">
    <div class="img-wrapper">
      <img class="shop-img" :src="listItem.img" :alt="listItem.title" loading="lazy">
    </div>
    <div class="shop-info">
      <div class="shop-title"> {{ listItem.title }}</div>
      <span style=" 
       background-color: #DD0A09;color: #ffffff;border-radius: 2px;font-size: 10px;font-weight: 400;
       line-height: 14px;padding: 1px 2px; "> {{ getPlatformName(listItem.platform, listItem.jd_type) }}</span>
      <!-- <div class="shop-subtitle" v-if="listItem.subtitle">{{ listItem.subtitle }}</div> -->

      <div class="shop-price-box">
        <span class="price-symbol">¥</span>
        <span class="price">{{ formatPrice(listItem.sell_price) }}</span>
        <span class="market-price" v-if="showMarketPrice">
          ¥{{ formatPrice(listItem.market_price) }}
        </span>
      </div>

      <!-- <div class="shop-bottom">
        <span class="source-tag" v-if="getSourceName()">
          {{ getSourceName() }}
        </span>
        <span class="sale-num" v-if="listItem.sale_num > 0">
          已售{{ formatSaleNum(listItem.sale_num) }}
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getPlatformName } from '@/utils/platform'

export default {
  name: "ShopList",
  props: {
    listItem: {
      type: Object,
      default: () => ({})
    },
    flag: [Number, String]
  },
  computed: {
    showMarketPrice() {
      const marketPrice = parseFloat(this.listItem.market_price || '0');
      const sellPrice = parseFloat(this.listItem.sell_price || '0');
      return marketPrice > 0 && marketPrice > sellPrice;
    }
  },
  methods: {
    formatPrice(price) {
      const num = parseFloat(price || '0');
      return num.toFixed(2);
    },
    formatSaleNum(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      }
      return num;
    },
    getPlatformName,
    toDetail() {
      const item = this.listItem;
      const platform = Number(item.platform) || 0;

      // 鲜花
      if (platform === 5) {
        this.$router.push({
          path: "/FlowerDetail",
          query: { product_id: item.product_id || item.id }
        });
        return;
      }

      // 盒马
      if (platform === 4) {
        // 盒马 → 跳盒马详情
        this.$router.push({
          path: '/HemaDetail',
          query: {
            product_id: item.product_id || item.third_product_id
          }
        })
        return
      }

      // 京东/天猫/京造
      if (item.id) {
        this.$router.push({
          path: "/productDetail",
          query: { id: item.id }
        });
      }
    }
    // toDetail() {
    //   if (this.listItem.id) {
    //     this.$router.push({
    //       path: "/productDetail",
    //       query: { id: this.listItem.id }
    //     })
    //   }
    // }
  }
}
</script>

<style scoped lang="less">
.shop-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;

  &:active {
    transform: scale(0.98);
  }

  .img-wrapper {
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    background: #f5f5f5;

    .shop-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .shop-info {
    padding: 10px 10px 7px 10px;

    .shop-title {
      font-size: 14px;
      color: #333;
      line-height: 20px;
      /* 固定行高 */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* 最多显示2行 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 1px;
      word-break: break-all;
      /* 允许单词内换行 */
      /* 不设置固定高度，让内容自动撑开 */
    }

    .platform-tag {
      display: inline-block;
      background-color: #DD0A09;
      color: #ffffff;
      border-radius: 2px;
      font-size: 10px;
      font-weight: 400;
      line-height: 14px;
      padding: 1px 4px;
      margin-bottom: 4px;
    }

    .shop-subtitle {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 16px;
    }

    .shop-price-box {
      display: flex;
      align-items: baseline;
      gap: 2px;
      margin-top: 4px;

      .price-symbol {
        font-size: 10px;
        color: #ed2e33;
        font-weight: bold;
      }

      .price {
        font-size: 18px;
        color: #ed2e33;
        font-weight: bold;
      }

      .market-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
        margin-left: 4px;
      }
    }
  }
}
</style>