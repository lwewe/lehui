<template>
  <div class="bg">
    <!-- 顶部 Tab 切换 -->
    <!-- <div class="tab-bar">
      <div class="tab-item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">
        在线点餐
      </div>
      <div class="tab-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">
        饮品直冲
      </div>
    </div> -->

    <!-- 内容区域 -->
    <div class="content-bg">

      <!-- ==================== 1. 在线点餐 Tab ==================== -->
      <div v-if="currentTab === 0">
        <!-- 顶部 Banner -->
        <div class="banner" v-if="diancanBanner">
          <img :src="diancanBanner" class="topImg" alt="banner" @click="handleBannerClick">
        </div>

        <!-- 双列图片列表 -->
        <div class="img-grid-list">
          <div class="grid-item" v-for="(item, index) in foodList" :key="item.id || index"
            @click="handleItemClick(item)">
            <img :src="item.banner" alt="商品卡片" class="card-img">
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!diancanLoading && foodList.length === 0" class="empty-tip">
          暂无数据
        </div>
      </div>

      <!-- ==================== 2. 饮品直冲 Tab ==================== -->
      <div v-if="currentTab === 1">
        <!-- 顶部 Banner -->
        <div class="banner" v-if="zhichongBanner">
          <img :src="zhichongBanner" class="topImg" alt="banner" @click="handleBannerClick">
        </div>

        <!-- 双列图片列表 -->
        <div class="img-grid-list">
          <div class="grid-item" v-for="(item, index) in brandList" :key="item.id || index"
            @click="handleItemClick(item)">
            <img :src="item.img" alt="饮品直冲卡片" class="card-img">
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!zhichongLoading && brandList.length === 0" class="empty-tip">
          暂无数据
        </div>
      </div>

    </div>
  </div>
</template>

<script>
 import { food, diancanIndex } from "@/api/lhjdtm";
import { getDiancanBrand } from "@/api/diancan";

export default {
  data() {
    return {
      currentTab: 0,

      diancanLoading: false,
      zhichongLoading: false,

      diancanBanner: '',
      zhichongBanner: '',

      foodList: [],
      brandList: [],
      isGettingLocation: false // 防重复点击
    }
  },
  mounted() {
    this.getDiancanData();
    this.getFoodData();
  },
  methods: {
    mapList(list) {
      if (!Array.isArray(list)) return [];
      return list
        .filter(item => item.sh === 1)
        .sort((a, b) => b.px - a.px)
        .map(item => ({
          id: item.id,
          title: item.title,
          xtitle: item.xtitle,
          url: item.url,
          img: item.img,
          banner: item.banner,
          px: item.px,
          pid: item.pid
        }));
    },

    async getDiancanData() {
      this.diancanLoading = true;
      try {
        const res = await diancanIndex({});
        if (res.code === 200 && res.data) {
          const data = res.data;
          if (data.banner && data.banner.img) {
            this.diancanBanner = data.banner.img;
          }
          if (Array.isArray(data.diancan)) {
            this.foodList = this.mapList(data.diancan);
          }
        } else {
          this.$toast && this.$toast(res.msg || '获取在线点餐失败');
        }
      } catch (err) {
        console.error('获取在线点餐数据失败:', err);
        this.$toast && this.$toast('网络异常，请稍后重试');
      } finally {
        this.diancanLoading = false;
      }
    },

    async getFoodData() {
      this.zhichongLoading = true;
      try {
        const res = await food({});
        if (res.code === 200 && res.data) {
          const data = res.data;
          if (data.banner && data.banner.img) {
            this.zhichongBanner = data.banner.img;
          }
          if (Array.isArray(data.zhichong)) {
            this.brandList = this.mapList(data.zhichong);
          }
          if (
            Array.isArray(data.diancan) &&
            data.diancan.length > 0 &&
            this.foodList.length === 0
          ) {
            this.foodList = this.mapList(data.diancan);
          }
        } else {
          this.$toast && this.$toast(res.msg || '获取饮品直冲失败');
        }
      } catch (err) {
        console.error('获取美食频道数据失败:', err);
        this.$toast && this.$toast('网络异常，请稍后重试');
      } finally {
        this.zhichongLoading = false;
      }
    },

    // ✅ 新增：和首页一致的跳转方法
    async goToDiancan(brandCode) {
      if (this.isGettingLocation) return;
      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转点餐...',
          forbidClick: true,
          duration: 0
        });

        const res = await getDiancanBrand({ brandCode });

        this.$toast.clear();
        console.log('点餐品牌接口返回:', res);

        if (res.code === 200 && res.data && res.data.url) {
          window.location.href = res.data.url;
        } else {
          this.$toast.fail(res.msg || '获取跳转链接失败');
        }
      } catch (error) {
        console.error('点餐跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },

    // ✅ 改：url 优先，其次匹配品牌 code 走 goToDiancan
    handleItemClick(item) {
      console.log("点击了卡片，ID:", item.id, "title:", item.title);

      // 1. 有 url 直接跳
      if (item.url && item.url !== '#') {
        if (item.url.startsWith('/')) {
          this.$router.push(item.url);
        } else {
          window.location.href = item.url;
        }
        return;
      }

      // 2. 匹配品牌 code（兼容英文 code + 中文名）
      const brandMap = {
        'sbk': 'sbk', 'kfc': 'kfc', 'mcd': 'mcd', 'lk': 'lk',
        'cot': 'cot', 'pzh': 'pzh', 'tas': 'tas', 'nx': 'nx',
        'chagee': 'chagee', 'dicos': 'dicos', 'molly': 'molly', 'guming': 'guming',
        '星巴克': 'sbk', '肯德基': 'kfc', '麦当劳': 'mcd', '瑞幸': 'lk',
        '瑞幸咖啡': 'lk', '库迪': 'cot', '库迪咖啡': 'cot', '必胜客': 'pzh',
        '塔斯汀': 'tas', '塔斯汀中国汉堡': 'tas', '奈雪': 'nx', '奈雪的茶': 'nx',
        '霸王茶姬': 'chagee', '德克士': 'dicos', '茉莉奶白': 'molly', '古茗': 'guming'
      };

      const raw = (item.title || '').trim();
      const brandCode = brandMap[raw.toLowerCase()] || brandMap[raw];

      if (brandCode) {
        this.goToDiancan(brandCode);
        return;
      }

      console.warn('未匹配到品牌:', item.title);
      this.$toast && this.$toast('暂未开放该品牌点餐');
    },

    handleBannerClick() {
      console.log("点击了Banner");
    }
  }
}
</script>

<style scoped lang="less">
.bg {
  background-color: #F7F7F7;
  width: 100%;
  min-height: 100vh;
}

/* 顶部 Tab 切换栏（吸顶） */
.tab-bar {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(to right, #F0F4FF, #FFF0F5);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 16px 0;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    position: relative;
    cursor: pointer;

    &.active {
      font-weight: bold;
      color: #000;
      background-color: #ffffff;

      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: #3B82F6;
        border-radius: 2px;
      }
    }
  }
}

/* 内容区域 */
.content-bg {
  padding: 10px;
}

/* 顶部Banner */
.banner {
  width: 100%;
  margin-bottom: 12px;

  .topImg {
    width: 100%;
    display: block;
    border-radius: 10px;
  }
}

/* 双列图片列表通用样式 */
.img-grid-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  .grid-item {
    width: 100%;
    cursor: pointer;

    .card-img {
      width: 100%;
      display: block;
      object-fit: cover;
      border-radius: 10px;
    }

    &:active {
      opacity: 0.85;
    }
  }
}

/* 空状态 */
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}
</style>