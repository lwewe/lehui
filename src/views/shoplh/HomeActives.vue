 <template>
  <div class="bg" :style="{ background: `linear-gradient(to bottom, ${bg1}, ${bg2})` }">
    <NProgress v-if="loading" />
    <!-- 顶部Banner -->
    <div class="banner">
      <img :src="topImg" class="topImg" alt="">
    </div>

    <!-- 蓝色渐变背景区域 -->
    <div class="blue-bg">
      <!-- 顶部Tab：动态渲染 清凉3、清凉2、清凉1 -->
      

      <!-- 渲染所有板块 -->
      <div class="section-box" v-for="(section, index) in allZoneList" :key="section.id" :ref="'section' + index">
        <!-- 板块标题 -->
        <div class="section-title">
          <span class="title-text">{{ section.title }}</span>
        </div>

        <!-- 第一个板块（清凉3）使用纵向列表展示 -->
        <div class="vertical-list" v-if="index === 0">
          <div class="vertical-item" v-for="item in section.goods" :key="item.id" @click="detail(item)">
            <img :src="item.img" alt="" class="v-img">
            <div class="v-info">
              <div class="v-title">{{ item.title }}</div>
              <div class="v-price-row">
                <span class="prod-price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 后面两个板块（清凉2、清凉1）使用横向滚动展示 -->
        <div class="horizontal-scroll" v-else>
          <div class="h-card" v-for="item in section.goods" :key="item.id" @click="detail(item)">
            <img :src="item.img" alt="" class="h-img">
            <div class="h-title">{{ item.title }}</div>
            <div class="h-price-row">
              <span class="prod-price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

 <script>
import { zoneList } from "@/api/lhjdtm";

export default {
  data() {
    return {
      loading: false,
      currentCategory: 0,
      allZoneList: [], // 接口返回的完整模块数据（清凉123）
      topImg: this.$route.query.banners,
      bg1:this.$route.query.bg1,
      bg2:this.$route.query.bg2,
    }
  },
  activated() {
     const q = this.$route.query || {};
  this.topImg = q.banners || '';
  this.bg1 = q.bg1 || '#FCF1DE';
  this.bg2 = q.bg2 || '#EFEFEF';
    // ✅ 修复：每次进入页面都重新请求，防止缓存导致数据不更新
    this.getZoneList();
  },
  methods: {
    getZoneList() {
      this.loading = true;
      
      // 获取路由传过来的 pid (比如 45)
      const pid = this.$route.query.pid || 45; 

      zoneList({ pid: pid })
        .then(res => {
          if (res.code == 200 && res.data.list) {
            // ✅ 关键修复：直接赋值整个 list 数组，保证能拿到每一个模块
            this.allZoneList = res.data.list; 
            
            // 如果有数据，顺便取一下第一张图作为顶部 banner（按你实际字段调整）
            // if (this.allZoneList.length > 0) {
            //   this.topImg = this.allZoneList[0].img || ''; 
            // }
          }
        })
        .catch(err => {
          console.error("获取失败", err);
        })
        .finally(() => {
          this.loading = false; 
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
    detail(item) {
      this.$goDetail(item);
    }
  }
}
</script>

<style scoped lang="less">
.bg {
  padding-bottom: 50px;
  background-color: #f0f0f0;
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

    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    white-space: nowrap;

    &.active {
      color: #333;
      background: #FFFFFF;
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
    font-size: 17px;
    font-weight: bold;
    color: #ffffff;
    // background: url(../../assets/lh/bj.png) no-repeat;
    background-size: cover;
    padding: 8px 20px;
    border-radius: 25px;
    width: 180px;
    text-align: center;
    margin: 0 8px;
    // text-shadow: 1px 1px 5px #6d6d6d;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

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
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;

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
  scrollbar-width: none;
  /* 隐藏滚动条 */

  &::-webkit-scrollbar {
    display: none;
  }
}

.h-card {
  flex: 0 0 110px;
  /* 固定宽度，超过屏幕可滑动 */
  background-color: #fff;
  border-radius: 10px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  .h-img {
    width: 100%;
    // height: 100px;
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
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>