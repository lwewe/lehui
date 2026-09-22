<template>
  <div class="bg">
    <NProgress v-if="loading" />
    <!-- 顶部Banner -->
    <div class="banner">
      <img :src="topImg" class="topImg" alt="">
    </div>

    <!-- 蓝色渐变背景区域 -->
    <div class="blue-bg">
      <!-- 顶部Tab（只展示 热带、蜜瓜、西瓜） -->
      <div class="category-tabs">
        <div 
          class="tab-item" 
          v-for="(cat, index) in filteredZoneList" 
          :key="cat.id"
          :class="{ active: currentCategory === index }"
          @click="scrollToSection(index)"
        >
          {{ cat.title }}
        </div>
      </div>

      <!-- 只渲染 热带、蜜瓜、西瓜 这三个板块 -->
      <div 
        class="section-box" 
        v-for="(section, index) in filteredZoneList" 
        :key="section.id"
        :ref="'section' + index"
      >
        <!-- 板块标题 -->
        <div class="section-title">
       
          <span class="title-text">{{ section.title }}</span>
      
        </div>

        <!-- 第一个板块（热带）使用纵向列表展示 -->
        <div class="vertical-list" v-if="index === 0">
          <div class="vertical-item" v-for="item in section.goods" :key="item.id" @click="detail(item.id)">
            <img :src="item.img" alt="" class="v-img">
            <div class="v-info">
              <div class="v-title">{{ item.title }}</div>
              <!-- <div class="v-spec">{{ getPlatformName(item.platform )}}</div> -->
              <div class="v-price-row">
                <span class="prod-price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
                <div class="add-btn" @click.stop="addToCart(item)">+</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 后面两个板块（蜜瓜、西瓜）使用横向滚动展示 -->
        <div class="horizontal-scroll" v-else>
          <div class="h-card" v-for="item in section.goods" :key="item.id" @click="detail(item.id)">
            <img :src="item.img" alt="" class="h-img">
            <div class="h-title">{{ item.title }}</div>
            <!-- <div class="h-spec">{{ getPlatformName(item.platform )}}</div> -->
            <div class="h-price-row">
              <span class="prod-price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
              <div class="add-btn" @click.stop="addToCart(item)">+</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { zoneList } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  data() {
    return {loading: false,
      currentCategory: 0,
      allZoneList: [], // 接口返回的所有分类数据
      leftIcon: require("../../assets/yj/1.png"),
      rightIcon: require("../../assets/yj/2.png"),
      topImg:''
    }
  },
  computed: {
    // 只筛选出 id 为 16(热带)、15(蜜瓜)、14(西瓜) 的分类
    filteredZoneList() {
      const targetIds = [17, 18, 19];
      return this.allZoneList.filter(item => targetIds.includes(item.id));
    }
  },
  activated() {
    // 每次进入都重新请求
    this.getZoneList();
  },
  created() {
    this.getZoneList();
  },
  methods: {
    getPlatformName,
    // 获取 zoneList 接口数据
    getZoneList() {
  this.loading = true;          // 请求开始

  zoneList()
    .then(res => {
      if (res.code == 200) {
        this.allZoneList = res.data.list || [];

        const watermelon = this.allZoneList.find(item => item.id === 17);
        if (watermelon && watermelon.img) {
          this.topImg = watermelon.img;
        }
      }
    })
    .finally(() => {
      this.loading = false;     // 成功或失败都关掉
    });
},
    // Tab 点击滚动到对应板块
    scrollToSection(index) {
      this.currentCategory = index;
      this.$nextTick(() => {
        const sectionEl = this.$refs['section' + index];
        if (sectionEl && sectionEl[0]) {
          const topOffset = sectionEl[0].getBoundingClientRect().top + window.pageYOffset - 60;
          window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
      });
    },
    detail(id) {
      this.$router.push({ path: "/productDetail", query: { id } });
    },
    addToCart(item) {
      this.$toast('已加入购物车');
    }
  }
}
</script>

<style scoped lang="less">
.bg {
  padding-bottom: 50px;
  background-color: #76CCFF;
  width: 100%;
  min-height: 100vh;
}

/* 顶部Banner */
.banner {
  width: 100%;
  .topImg {
    width: 100%;
    display: block;
  }
}

/* 蓝色渐变背景容器 */
.blue-bg {
 
  padding: 15px 15px 30px 15px;
  border-radius: 0;
  min-height: 400px;
}

/* 顶部Tab */
.category-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin: 15px 0 20px;
  padding: 10px 0;
  
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    font-size: 12px;
   
    border-radius: 25px;
   
   
    background-color: #F03131;
      color: #fff;
      
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    white-space: nowrap;
    
    &.active {
       color: #333; background: #FFFFFF;
    }
  }
}

/* 板块标题 */
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  .title-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  
  .title-text {
    font-size: 16px;
    font-weight: bold;
    color: #ffecb8;
    background: url(../../assets/lh/bj.png) no-repeat;
    background-size: cover;
    padding: 8px 20px;
    border-radius: 25px;
    width: 180px;text-align: center;
    margin: 0 8px;
    
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
}

.section-box {
  margin-bottom: 30px;
}

/* 纵向列表样式（第一个板块） */
.vertical-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vertical-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  
  .v-img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .v-info {
    flex: 1;
    
    .v-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      line-height: 1.4;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .v-spec {
      font-size: 11px;
      color: #888;
      border: 1px solid #ddd;
      padding: 1px 6px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 10px;
    }
    
    .v-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .prod-price {
        color: #E1251B;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}

/* 通用价格和加号按钮 */
.prod-price {
  color: #ed2e33;
  font-size: 16px;
  font-weight: bold;
}

.add-btn {
  width: 20px;
  height: 20px;
  background-color: #ed2e33;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

/* 横向滚动网格 */
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 5px;
  scrollbar-width: none; /* 隐藏滚动条 */
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.h-card {
  flex: 0 0 110px; /* 固定宽度，超过屏幕可滑动 */
  background-color: #fff;
  border-radius: 10px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  
  .h-img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    background: #F9F9F9;
    border-radius: 10px 10px 0 0;
    margin-bottom: 8px;
  }
  
  .h-title {
    font-size: 12px;
    font-weight: 500;
    color: #333;
    line-height: 1.3;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    padding: 0 10px;
  }
  
  .h-spec {
    font-size: 10px;
    color: #888;
    border: 1px solid #ddd;
    padding: 1px 4px;
    border-radius: 4px;
    display: inline-block;
    width: fit-content;
    margin-bottom: 8px;
  }
  
  .h-price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 6px 10px;
    .prod-price {
      font-size: 14px;
    }
    
    .add-btn {
      width: 20px;
      height: 20px;
      font-size: 14px;font-weight: bold;
    }
  }
}
</style>