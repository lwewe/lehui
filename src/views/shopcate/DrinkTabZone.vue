<template>
  <div class="drink-tab-zone">
    <!-- 1. 顶部导航栏 -->
    

    <!-- 2. 顶部背景与按钮 -->
    <div class="top-area-wrapper">
      <div class="top-bg-img"></div>
      <div class="top-tab-btn-group">
        <div v-for="(section, index) in sectionsList" :key="index" class="tab-btn"
          :class="{ active: activeTab === index }" @click="scrollToSection(index)">
          {{ section.title }}
        </div>
      </div>
    </div>

    <!-- 3. 蓝色背景区域 -->
    <div class="blue-bg-container">
      <!-- 动态渲染每个板块 -->
      <div v-for="(section, sectionIndex) in sectionsList" :key="sectionIndex" class="section-wrapper"
        :ref="'section' + sectionIndex">
        <div class="section-title-bar">
          <span class="title-text">{{ section.title }}</span>
        </div>

        <div class="goods-scroll-wrapper">
          <div class="goods-grid-col" v-for="(item, itemIndex) in section.items || []" :key="itemIndex"
            @click="goToDetail(item)">
            <div class="goods-item">
              <img class="item-img" :src="item.img" alt="" />
              <div class="item-name">{{ item.title }}</div>
              <div class="item-bottom">
                <span class="price">
                  <span style="font-size: 12px; font-weight: bold;">¥</span>
                  {{ item.sell_price || '--' }}
                </span>
                <span class="add-btn">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import { channelDetail } from "@/api/lhjdtm";

export default {
  name: "DrinkTabZone",
  data() {
    return {
      activeTab: 0,
      sectionsList: []
    };
  },
  mounted() {
    this.channelDetailIndex();
  },
  methods: {
    goToDetail(item) {
      this.$router.push({ path: "/ProductDetail", query: { id: item.id } });
    },
    goBack() {
      this.$router.go(-1);
    },
    channelDetailIndex() {
      channelDetail({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.sectionsList = res.data.nav[2].children[0].sections || [];
          console.log('sectionsList:', this.sectionsList);
        }
      });
    },
    scrollToSection(index) {
      console.log('点击tab:', index);
      this.activeTab = index;
      
      // 确保DOM更新后再滚动
      this.$nextTick(() => {
        // 使用 querySelectorAll 获取所有板块元素
        const sections = document.querySelectorAll('.section-wrapper');
        console.log('找到板块数量:', sections.length);
        
        if (sections[index]) {
          // 获取目标元素的位置
          const targetElement = sections[index];
          const elementTop = targetElement.getBoundingClientRect().top;
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          
          // 计算滚动位置，减去顶部导航栏高度
          const targetScroll = elementTop + currentScroll - 100;
          
          console.log('目标滚动位置:', targetScroll);
          
          // 使用 scrollTo 滚动
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.drink-tab-zone {
  min-height: 100vh;
  background: #e3f2fd;
  padding-bottom: 20px;
}

/* ================= 1. 顶部导航 ================= */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 24px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

/* ================= 2. 顶部背景 ================= */
.top-area-wrapper {
  position: relative;
  width: 100%;
  height: 280px;

  .top-bg-img {
    width: 100%;
    height: 100%;
    background: url("../../assets/lh/cate/jd/b7.png") no-repeat center center / cover;
  }

  .top-tab-btn-group {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 26px;
    padding: 0 10px;
    box-sizing: border-box;

    .tab-btn {
      background: #ffffff;
      color: #333;
      font-size: 14px;
      padding: 6px 18px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        color: #ffffff;
        background: #007bff;
        font-weight: bold;
        box-shadow: 0 0 0 1px #007bff inset;
      }
    }
  }
}

/* ================= 3. 板块与网格 ================= */
.blue-bg-container {
  padding: 0 16px 20px 16px;
}

.section-wrapper {
  margin-bottom: 30px;
  scroll-margin-top: 100px; /* 减小这个值 */

  .section-title-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
    width: max-content;
    max-width: 90%;

    .title-text {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .goods-scroll-wrapper {
      display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  .goods-grid-col {
    flex: 0 0 calc((100% - 24px) / 3);
    scroll-snap-align: start;
    height: 100%;
  }

    .goods-item {
      background: #ffffff;
      border-radius: 10px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      height: 100%;
      box-sizing: border-box;
      justify-content: space-between;

      .item-img {
        width: 100%;
        
        background: #f5f6fa;
        border-radius: 10px 10px 0 0;
        object-fit: cover;
        margin-bottom: 6px;
      }

      .item-name {
        font-size: 12px;
        color: #333;
        text-align: left;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 2px;
        padding:  0 10px;
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: 2px;
        padding-bottom: 6px;

        .price {
          padding-left: 10px;
          font-size: 14px;
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
          margin-right: 10px;
        }
      }
    }
  }
}
</style>