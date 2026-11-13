<template>
  <div class="shop-card" @click="toDetail">
    <div class="img-wrapper">
      <img 
        class="shop-img" 
        :src="imgSrc" 
        :alt="listItem.title" 
        loading="lazy"  
        referrerpolicy="no-referrer" 
        @error="handleImgError"
      >
    </div>
    <div class="shop-info">
      <div class="shop-title"> {{ listItem.title }}</div>
      <span style=" 
       background-color: #DD0A09;color: #ffffff;border-radius: 2px;font-size: 10px;font-weight: 400;
       line-height: 14px;padding: 1px 2px; "> {{ getPlatformName(listItem.platform, listItem.jd_type) }}</span>
      
      <div class="shop-price-box">
        <span class="price-symbol">¥</span>
        <span class="price">{{ formatPrice(listItem.sell_price) }}</span>
        <span class="market-price" v-if="showMarketPrice">
          ¥{{ formatPrice(listItem.market_price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlatformName } from '@/utils/platform'
import defaultImg from '@/assets/no-img.png'

export default {
  name: "ShopList",
  props: {
    listItem: {
      type: Object,
      default: () => ({})
    },
    flag: [Number, String]
  },
  data() {
    return {
      defaultImg
    }
  },
  computed: {
    imgSrc() {
      return this.listItem.img
        || this.listItem.thumbnailimage
        || this.listItem.thumbnail
        || this.defaultImg;
    },
    showMarketPrice() {
      const marketPrice = parseFloat(this.listItem.market_price || '0');
      const sellPrice = parseFloat(this.listItem.sell_price || '0');
      return marketPrice > 0 && marketPrice > sellPrice;
    }
  },
  methods: {
    handleImgError(e) {
      // 如果当前 src 已经是默认图了，直接 return，防止死循环
      if (e.target.src.includes(this.defaultImg)) return;
      // 否则替换为默认图
      e.target.src = this.defaultImg;
    },
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
        this.$router.push({
          path: '/HemaDetail',
          query: {
            product_id: item.product_id || item.third_product_id,homeFlg:1
          }
        })
        return
      }

      // 京东/天猫/京造
      if (item) {
        this.$goDetail(item);
      }
    }
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
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 1px;
      word-break: break-all;
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