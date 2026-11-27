<template>
  <div class="bghm">

    <img src="http://lh.bjyxfl.com/webIndex/imgs/hm-1.png" alt="" @click="handleItemClick(17)" style="    object-fit: cover;
    width: 100%;
">

  </div>
</template>

<script>
import { getOnlineBrand } from '@/api/lhjdtm'
import { getElemaLoginUrlshangcheng } from "@/api/elemashangcheng";
import { getYonghuiLoginUrl } from "@/api/yonghui";
import { getDingdongLoginUrl, createDingdongOrder, queryDingdongPayStatus } from "@/api/dingdong";
import { getYonghuiZhanfumaLoginUrl } from "@/api/yonghuiZhanfuma";
import { getGuoquanLoginUrl } from "@/api/guoquan";
import { getWumeiLoginUrl } from "@/api/wumei";
import { getDarunfaLoginUrl } from "@/api/darunfa";
import { getHaidilaoLoginUrl } from "@/api/haidilao";
import { getShanmuLoginUrl } from "@/api/shanmu";
import { getZhongshihuaLoginUrl } from "@/api/zhongshihua";
import { getJdJiazhengLoginUrl } from "@/api/jdjiazheng";
import { getJiudianLoginUrl } from "@/api/jiudian";
import { getElemaLoginUrl } from "@/api/elema";
import { getHemaLoginUrl } from "@/api/hema";
import { getDacheLoginUrl } from "@/api/dache";
import { getMaidelongLoginUrl } from "@/api/maidelong";
import { getQuchenshiLoginUrl } from "@/api/quchenshi";
import { getDongfangLoginUrl } from "@/api/dongfang";

import { getJuheShangchaoLoginUrl } from "@/api/juheshangchao";
import { getMeituanLoginUrl } from "@/api/meituan";
import { getTuangouLoginUrl } from "@/api/meituantuangou";
import { getXiaoxiangLoginUrl } from "@/api/xiaoxiang";
import { getHemaLoginUrlshangcheng } from "@/api/hemashangcheng";

export default {
  data() {
    return {
      topImg: '',
      onlineMallList: [],
      payCodeList: [],
      isGettingLocation: false, // 防止重复点击全局状态
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await getOnlineBrand()
        if (res.code === 200) {
          const data = res.data
          if (data.banner && data.banner.img) {
            this.topImg = data.banner.img
          }
          this.onlineMallList = data.online || []
          this.payCodeList = data.zhanfuma || []
        }
      } catch (error) {
        console.error('获取本地生活数据失败:', error)
      }
    },

    // 🔥 核心跳转路由：根据 id 和 title 匹配免密登录
    handleItemClick(item) {
      console.log("点击了卡片，ID:", item.id, "名称:", item.title);
      const id = Number(item.id);

      // 如果后台配置了自定义跳转链接，优先走链接
      if (item.url && item.url !== '#' && item.url !== '1') {
        if (item.url.startsWith('/')) {
          this.$router.push(item.url)
        } else {
          window.location.href = item.url
        }
        return
      }

      // ===== 线上商城 (online) 匹配 =====
      if (id === 34) return this.goToMeituan();
      if (id === 93) return this.goToTuangou();
      if (id === 92) return this.goToElemaLoginshangcheng();
      if (id === 90) { this.$router.push({ path: "/HemaFresh" }); return; }

      if (id === 16) return this.goToXiaoxiang();
      if (item === 17) return this.goToHemashangcheng();
      if (id === 18) return this.goToYonghuiLogin();
      if (id === 19) return this.goToDingdongLogin();


      if (id === 95) return this.goToJdJiazheng();
      if (id === 94) return this.goToJuheShangchao();


      if (id === 85) {
        this.$router.push({ path: "/TuhuZone" });
        return;
      }

      if (id === 33) {
        this.$router.push({ path: 'TmallSupermarket' }); // 或用 path: '/TmallSupermarket'
        return;
      }
      if (id === 32) {
        this.$router.push({ path: 'JingdongChannel' }); // 或用 path: '/JingdongChannel'
        return;
      }
      if (id === 31) {
        this.$router.push({ path: 'JingzaoHome' });     // 或用 path: '/JingzaoHome'
        return;
      }

      // ===== 展付码 (zhanfuma) 匹配 =====
      if (id === 40 || item.title === '麦德龙') return this.goToMaidelong();
      if (id === 41 || item.title === '海底捞') return this.goToHaidilao();
      if (id === 38 || item.title === '大润发') return this.goToDarunfa();
      if (id === 39 || item.title === '永辉超市') return this.goToYonghuiZhanfuma();
      if (id === 37 || item.title === '锅圈' || item.title === '锅圈食汇') return this.goToGuoquan();
      if (id === 36 || item.title === '物美超市') return this.goToWumei();
      if (id === 44 || item.title === '屈臣氏') return this.goToQuchenshi();
      if (id === 76 || item.title === '盒马') return this.goToHema();
      if (id === 77 || item.title === '中石化/油') return this.goToZhongshihua();
      if (id === 45 || item.title === '山姆超市') return this.goToShanmu();
      if (id === 79 || item.title === '东方甄选') return this.goToDongfang();

      // 兜底
      console.warn('该图标未匹配到跳转逻辑，请检查 id 或 title:', item);
    },

    handleBannerClick() {
      console.log("点击了Banner");
    },

    // ================= 以下为你提供的所有免密登录方法 =================

    async goToXiaoxiang() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转美团小象超市...', forbidClick: true, duration: 0 });
        const res = await getXiaoxiangLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data) { window.location.href = res.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToTuangou() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转美团到店...', forbidClick: true, duration: 0 });
        const res = await getTuangouLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data) { window.location.href = res.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToMeituan() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转美团外卖...', forbidClick: true, duration: 0 });
        const res = await getMeituanLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data) { window.location.href = res.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToElemaLoginshangcheng() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在获取位置...', forbidClick: true, duration: 0 });
        const position = await this.getCurrentPosition();
        this.$toast.loading({ message: '正在跳转饿了么...', forbidClick: true, duration: 0 });
        const res = await getElemaLoginUrlshangcheng({ latitude: position.latitude, longitude: position.longitude });
        this.$toast.clear();
        if (res.code === 200 && res.data) { window.location.href = res.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToJuheShangchao() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转聚合商超...', forbidClick: true, duration: 0 });
        const res = await getJuheShangchaoLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.jdUrl) { window.location.href = res.data.jdUrl; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToHemashangcheng() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转盒马商城...', forbidClick: true, duration: 0 });
        const res = await getHemaLoginUrlshangcheng();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.data) { window.location.href = res.data.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToDongfang() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转东方甄选...', forbidClick: true, duration: 0 });
        const res = await getDongfangLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToMaidelong() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转麦德龙...', forbidClick: true, duration: 0 });
        const res = await getMaidelongLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToQuchenshi() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转屈臣氏...', forbidClick: true, duration: 0 });
        const res = await getQuchenshiLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToHema() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转盒马...', forbidClick: true, duration: 0 });
        const res = await getHemaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToDache() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转打车...', forbidClick: true, duration: 0 });
        const res = await getDacheLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToElemaLogin() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转饿了么...', forbidClick: true, duration: 0 });
        const res = await getElemaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.data) { window.location.href = res.data.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToJiudian() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转酒店...', forbidClick: true, duration: 0 });
        const res = await getJiudianLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToJdJiazheng() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转京东家政...', forbidClick: true, duration: 0 });
        const res = await getJdJiazhengLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToShanmu() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转山姆...', forbidClick: true, duration: 0 });
        const res = await getShanmuLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToHaidilao() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转海底捞...', forbidClick: true, duration: 0 });
        const res = await getHaidilaoLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToDingdongLogin() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在获取位置...', forbidClick: true, duration: 0 });
        const position = await this.getCurrentPosition();
        this.$toast.loading({ message: '正在跳转叮咚买菜...', forbidClick: true, duration: 0 });
        const res = await getDingdongLoginUrl({ latitude: position.latitude, longitude: position.longitude });
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.data) { window.location.href = res.data.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToWumei() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转物美展码付...', forbidClick: true, duration: 0 });
        const res = await getWumeiLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToGuoquan() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转锅圈...', forbidClick: true, duration: 0 });
        const res = await getGuoquanLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToYonghuiZhanfuma() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转永辉展码付...', forbidClick: true, duration: 0 });
        const res = await getYonghuiZhanfumaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToDarunfa() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转大润发...', forbidClick: true, duration: 0 });
        const res = await getDarunfaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToZhongshihua() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转中石油...', forbidClick: true, duration: 0 });
        const res = await getZhongshihuaLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.h5Url) { window.location.href = res.data.h5Url; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    async goToYonghuiLogin() {
      if (this.isGettingLocation) return; this.isGettingLocation = true;
      try {
        this.$toast.loading({ message: '正在跳转永辉彩食鲜...', forbidClick: true, duration: 0 });
        const res = await getYonghuiLoginUrl();
        this.$toast.clear();
        if (res.code === 200 && res.data && res.data.data) { window.location.href = res.data.data; }
        else { this.$toast.fail(res.msg || '获取登录链接失败'); }
      } catch (error) { this.$toast.clear(); this.$toast.fail('跳转失败，请重试'); }
      finally { this.isGettingLocation = false; }
    },

    // 获取定位的小工具函数
    getCurrentPosition() {
      return new Promise((resolve) => {
        const defaultPosition = { latitude: "39.923125", longitude: "116.382997" };
        if (!navigator.geolocation) { resolve(defaultPosition); return; }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() }),
          () => resolve(defaultPosition),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
        );
      });
    }
  }
}
</script>

<style scoped lang="less">
/* 样式不变 */
.bg {
  background-color: #85AAE3;
  width: 100%;
  min-height: 100vh;
}

.content-bg {
  padding: 10px;
}

.banner {
  width: 100%;
  margin-bottom: 12px;
}

.banner .topImg {
  width: 100%;
  display: block;
}

.section-card {
  background: url(../../assets/daincan/bg.png);
  background-size: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.section-card .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 4px;
}

.section-card .section-header .title-left {
  display: flex;
  align-items: baseline;
  padding: 17px 0 0 10px;
}

.section-card .section-header .title-left .main-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.section-card .section-header .title-left .sub-title {
  font-size: 11px;
  color: #ffffff;
  margin-left: 6px;
}

.section-card .section-header .icon-right .sparkle {
  font-size: 14px;
}

.section-card .grid-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 12px;
  column-gap: 0px;
  padding-bottom: 10px;
}

.section-card .grid-list .grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.section-card .grid-list .grid-item:active {
  opacity: 0.8;
}

.section-card .grid-list .grid-item .icon-img {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  object-fit: contain;
  margin-bottom: 6px;
}

.section-card .grid-list .grid-item .item-name {
  font-size: 11px;
  color: #333;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>