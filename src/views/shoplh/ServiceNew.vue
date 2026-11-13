<template>
  <div class="bg">
    <div class="banner" v-if="topImg">
        <img :src="topImg" class="topImg" alt="便民服务" @click="handleBannerClick">
      </div>
    <div class="content-bg">
      
      <!-- 1. 顶部 Banner -->
      

      <!-- 2. 便民服务 列表 -->
      <div class="service-list">
        <div 
          class="service-card" 
          v-for="(item, index) in serviceList" 
          :key="item.id"
          @click="handleItemClick(item)"
        >
          <!-- 左侧图标 -->
          <div class="icon-box">
            <img :src="item.img" alt="icon" class="icon-img">
          </div>
          
          <!-- 右侧文字区 -->
          <div class="info-box">
            <div class="title">{{ item.title }}</div>
            <div class="desc">
              <!-- 根据名称匹配副标题 -->
              {{ getSubTitle(item.title) }}
            </div>
          </div>
          
          <!-- 右侧箭头 -->
          <div class="arrow-box">
            
            <img src="../../assets/yj/r.png" alt="icon" style="width: 10px;" class="icon-img">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// 直接使用你引入的接口
import { getIndexService } from "@/api/lhjdtm";

import { getShanmuLoginUrl } from "@/api/shanmu";
import { getZhongshihuaLoginUrl } from "@/api/zhongshihua";
import { getJiudianLoginUrl } from "@/api/jiudian";
import { getDacheLoginUrl } from "@/api/dache";
import { getJdJiazhengLoginUrl } from "@/api/jdjiazheng";

export default {
  name: "ConvenienceService",
  data() {
    return {
      topImg: '',           // 接口获取的 Banner
      serviceList: [],      // 便民服务列表
      isGettingLocation: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取接口数据
    async fetchData() {
      try {
        // ✅ 改为直接调用引入的 getIndexService
        const res = await getIndexService()
        
        if (res.code === 200) {
          const data = res.data
          
          // 1. 设置 Banner
          if (data.banner && data.banner.img) {
            this.topImg = data.banner.img
          }
          
          // 2. 设置列表数据
          this.serviceList = data.service || []
        }
      } catch (error) {
        console.error('获取便民服务数据失败:', error)
      }
    },

    // 副标题匹配规则
    getSubTitle(title) {
      const map = {
        '途虎养车': '养车洗车，一站搞定',
        '中石化/油': '出示展码付，立享专属折扣',
        '鲜花配送': '鲜花速递，传递心意不等待',
        '特惠打车': '首单立减，随时叫车',
        '特惠酒店': '全国酒店，低价预定'
      }
      return map[title] || '为您提供优质服务'
    },

    // 列表卡片点击事件
    handleItemClick(item) {
      console.log("点击了服务卡片:", item);
      const id = Number(item.id);

      // 优先判断接口返回的自定义 url
      if (item.url && item.url !== '#' && item.url !== '1') {
        if (item.url.startsWith('/')) {
          this.$router.push(item.url)
        } else {
          window.location.href = item.url
        }
        return
      }

      // 根据 ID 匹配免密登录方法 (基于你首页的逻辑)
      if (id === 85 || item.title === '途虎养车') {
        this.$router.push({ path: "/TuhuZone" }); 
        return;
      }
      if (id === 87 || item.title === '中石化/油') return this.goToZhongshihua();
      if (id === 86 || item.title === '鲜花配送') { 
        this.$router.push({ path: "/FlowerZone" }); 
        return; 
      }
      if (id === 88 || item.title === '特惠打车') return this.goToDache();
      if (id === 89 || item.title === '特惠酒店') return this.goToJiudian();
      
      console.warn('该图标暂无配置跳转逻辑');
    },

    handleBannerClick() {
      console.log("点击了Banner");
    },

    // ================= 免密登录方法 =================
    async goToZhongshihua() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转中石化...', forbidClick: true, duration: 0 });
        const res = await getZhongshihuaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; } 
        else { this.$toast.fail(res.msg || '获取链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败'); } 
      finally { this.isGettingLocation = false; }
    },

    async goToDache() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转打车...', forbidClick: true, duration: 0 });
        const res = await getDacheLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; } 
        else { this.$toast.fail(res.msg || '获取链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败'); } 
      finally { this.isGettingLocation = false; }
    },

    async goToJiudian() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转酒店...', forbidClick: true, duration: 0 });
        const res = await getJiudianLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; } 
        else { this.$toast.fail(res.msg || '获取链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败'); } 
      finally { this.isGettingLocation = false; }
    }
  }
}
</script>

<style scoped lang="less">
.bg {
 background: linear-gradient( 180deg, #C5DFFA 0%, rgba(247,248,250,0) 100%);
  width: 100%;
  min-height: 100vh;
}

.content-bg {
  padding: 10px;
}

/* 顶部 Banner */
.banner {
  width: 100%;
  margin-bottom: 2px;
  
  .topImg {
    width: 100%;
    display: block;
    // border-radius: 12px;
  }
}

/* 服务列表容器 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 卡片之间的垂直间距 */
}

/* 单个服务卡片 */
.service-card {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    background-color: #F9F9F9;
    transform: scale(0.98);
  }

  /* 左侧大图标 */
  .icon-box {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin-right: 16px;
    border-radius: 10px;
    overflow: hidden;

    .icon-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* 中间文字信息 */
  .info-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 6px;
    }

    .desc {
      font-size: 12px;
      color: #999;
    }
  }

  /* 右侧箭头 */
  .arrow-box {
    width: 20px;
    color: #CCC;
    font-size: 16px;
    text-align: right;
  }
}
</style>