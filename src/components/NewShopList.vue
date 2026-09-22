<template>
  <div class="waterfall-container">
    <!-- 左侧瀑布流 -->
    <div class="waterfall-column">
      <div v-for="(item, index) in leftList" :key="item.id || index" class="waterfall-item">
        <ShopList :flag="flag" :listItem="item"></ShopList>
      </div>
    </div>
    
    <!-- 右侧瀑布流 -->
    <div class="waterfall-column">
      <div v-for="(item, index) in rightList" :key="item.id || index" class="waterfall-item">
        <ShopList :flag="flag" :listItem="item"></ShopList>
      </div>
    </div>
  </div>
</template>

<script>
import ShopList from "@/components/ShopList.vue";

export default {
  name: "NewShopList",
  components: { ShopList },
  props: {
    shopList: {
      type: Array,
      default: () => []
    },
    flag: [Number, String],
  },
  data() {
    return {
      leftList: [],
      rightList: [],
    }
  },
  methods: {
    // 瀑布流分配
    distributeItems() {
      this.leftList = [];
      this.rightList = [];
      
      if (!this.shopList || this.shopList.length === 0) return;
      
      // 交替分配到左右两列
      this.shopList.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftList.push(item);
        } else {
          this.rightList.push(item);
        }
      });
      
      console.log('左列商品数:', this.leftList.length);
      console.log('右列商品数:', this.rightList.length);
    }
  },
  
  watch: {
    shopList: {
      handler() {
        this.distributeItems();
      },
      immediate: true,
      deep: true
    }
  },
  
  mounted() {
    this.distributeItems();
  }
}
</script>

<style scoped lang="less">
.waterfall-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.waterfall-column {
  flex: 1;
  min-width: 0;
}

.waterfall-item {
  margin-bottom: 10px;
}
</style>