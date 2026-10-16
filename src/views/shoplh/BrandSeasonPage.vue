<template>
  <div class="brand-season-page">
    <!-- 1. 顶部导航 -->


    <!-- 2. 顶部大 Banner (金色礼盒) -->
    <div class="top-banner-area">
      <img class="banner-img" src="../../assets/lh/b1.jpg" alt="品牌Banner" />

    </div>

    <!-- 3. 线上商城 (2行4列) -->
    <div class="section-box bg1">
      <div class="section-header">
        <span class="title">线上商城</span>
        <span class="sub">线上好物集市，大牌好物一站集齐</span>
      </div>
      <div class="store-grid">
        <div class="store-item" v-for="(item, index) in onlineList" :key="index">
          <div class="store-img-box">
            <img class="store-img" :src="item.img" alt="" @click="onlines(item.id)" />
          </div>

        </div>
      </div>
    </div>

    <!-- 4. 展码付 (线下实体) -->
    <div class="section-box bg2">
      <div class="section-header">
        <span class="title">展码付</span>
        <span class="sub">线下实体专属码付，省心高效买单</span>
      </div>
      <div class="pay-grid">
        <div class="pay-item" v-for="(item, index) in payList" :key="index" @click="schengWeb(item)">
          <div class="pay-logo-box">
            <img class="pay-logo" :src="item.img" alt="" />
          </div>
          <div style="display: flex;flex-direction: column;">
            <div class="pay-name">{{ item.title }}</div>
            <div class="pay-btn"><span>GO</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-safe"></div>
  </div>
</template>

<script>
import { getDongfangLoginUrl } from "@/api/dongfang";
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
import { onlineBrand } from "@/api/lhcard";


import { getHemaLoginUrlshangcheng } from "@/api/hemashangcheng";
// import { getDingdongLoginUrl, createDingdongOrder, queryDingdongPayStatus } from "@/api/dingdong";
import { getXiaoxiangLoginUrl } from "@/api/xiaoxiang";
import { getMeituanLoginUrl } from "@/api/meituan";
export default {
  name: "BrandSeasonPage",
  data() {
    return {
      isGettingLocation: false,
      // 线上商城数据 (注意：请把 img 换成门店实景图，logo 换成品牌圆标)
      onlineList: [

      ],
      // 展码付数据
      payList: [

      ]
    }
  },
  methods: {
    // 获取当前位置
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        // 默认坐标（北京）
        const defaultPosition = {
          latitude: "39.923125",
          longitude: "116.382997"
        };

        if (!navigator.geolocation) {
          console.warn('浏览器不支持定位，使用默认坐标');
          resolve(defaultPosition);
          return;
        }

        // 设置超时
        const timeout = setTimeout(() => {
          console.warn('定位超时，使用默认坐标');
          resolve(defaultPosition);
        }, 8000);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeout);
            resolve({
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            });
          },
          (error) => {
            clearTimeout(timeout);
            console.warn('定位失败，使用默认坐标', error.message);
            resolve(defaultPosition);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 30000
          }
        );
      });
    },
    // 跳转到东方甄选
    async goToDongfang() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转东方甄选...',
          forbidClick: true,
          duration: 0
        });

        const res = await getDongfangLoginUrl();

        this.$toast.clear();

        console.log('东方甄选响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('东方甄选H5URL:', h5Url);

          // 跳转到东方甄选
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('东方甄选跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    async goToMaidelong() {
      if (this.isGettingLocation) return;
      this.isGettingLocation = true;
      try {
        this.$toast.loading({
          message: '正在跳转麦德龙...',
          forbidClick: true,
          duration: 0
        });
        const res = await getMaidelongLoginUrl();
        this.$toast.clear();
        console.log('麦德龙免密登录接口返回:', res);
        if (res.code === 200 && res.data && res.data.h5Url) {
          window.location.href = res.data.h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('麦德龙免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },

    // 跳转到屈臣氏
    async goToQuchenshi() {
      if (this.isGettingLocation) return;
      this.isGettingLocation = true;
      try {
        this.$toast.loading({
          message: '正在跳转屈臣氏...',
          forbidClick: true,
          duration: 0
        });
        const res = await getQuchenshiLoginUrl();
        this.$toast.clear();
        console.log('屈臣氏免密登录接口返回:', res);
        if (res.code === 200 && res.data && res.data.h5Url) {
          window.location.href = res.data.h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('屈臣氏免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到盒马
    async goToHema() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转盒马...',
          forbidClick: true,
          duration: 0
        });

        const res = await getHemaLoginUrl();

        this.$toast.clear();

        console.log('盒马免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('盒马H5URL:', h5Url);

          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('盒马免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到特惠打车
    async goToDache() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转打车...',
          forbidClick: true,
          duration: 0
        });

        const res = await getDacheLoginUrl();

        this.$toast.clear();

        console.log('打车免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('打车H5URL:', h5Url);

          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('打车免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到饿了么免密登录
    async goToElemaLogin() {
      if (this.isGettingLocation) {
        return;
      }

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转饿了么...',
          forbidClick: true,
          duration: 0
        });

        // 调用饿了么免密登录接口（无需参数）
        const res = await getElemaLoginUrl();

        this.$toast.clear();

        console.log('饿了么免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.data) {
          const loginUrl = res.data.data;
          console.log('饿了么免密登录URL:', loginUrl);

          // 跳转到饿了么
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('饿了么免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到酒店
    async goToJiudian() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转酒店...',
          forbidClick: true,
          duration: 0
        });

        // 调用酒店免密登录接口（无需参数）
        const res = await getJiudianLoginUrl();

        this.$toast.clear();

        console.log('酒店免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('酒店H5URL:', h5Url);

          // 跳转到酒店
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('酒店免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到京东家政
    async goToJdJiazheng() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转京东家政...',
          forbidClick: true,
          duration: 0
        });

        // 调用京东家政免密登录接口（无需参数）
        const res = await getJdJiazhengLoginUrl();

        this.$toast.clear();

        console.log('京东家政免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('京东家政H5URL:', h5Url);

          // 跳转到京东家政
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('京东家政免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到山姆
    async goToShanmu() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转山姆...',
          forbidClick: true,
          duration: 0
        });

        const res = await getShanmuLoginUrl();

        this.$toast.clear();

        console.log('山姆响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('山姆H5URL:', h5Url);

          // 跳转到山姆
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('山姆跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },

    // 跳转到海底捞
    async goToHaidilao() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转海底捞...',
          forbidClick: true,
          duration: 0
        });

        const res = await getHaidilaoLoginUrl();

        this.$toast.clear();

        console.log('海底捞响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('海底捞H5URL:', h5Url);

          // 跳转到海底捞
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('海底捞跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },

    // 跳转到物美展码付
    async goToWumei() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转物美展码付...',
          forbidClick: true,
          duration: 0
        });

        const res = await getWumeiLoginUrl();

        this.$toast.clear();

        console.log('物美展码付响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('物美展码付H5URL:', h5Url);

          // 跳转到物美展码付
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('物美展码付跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到锅圈
    async goToGuoquan() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转锅圈...',
          forbidClick: true,
          duration: 0
        });

        const res = await getGuoquanLoginUrl();

        this.$toast.clear();

        console.log('锅圈响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('锅圈H5URL:', h5Url);

          // 跳转到锅圈
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('锅圈跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到永辉展码付
    async goToYonghuiZhanfuma() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转永辉展码付...',
          forbidClick: true,
          duration: 0
        });

        const res = await getYonghuiZhanfumaLoginUrl();

        this.$toast.clear();

        console.log('永辉展码付响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('永辉展码付H5URL:', h5Url);

          // 跳转到永辉展码付
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('永辉展码付跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    goToDetail(item) {
      this.$goDetail(item);

      // this.$router.push({ path: '/ProductDetail', query: { id: item.id } });
    },
    // 跳转到永辉彩食鲜免密登录
    async goToYonghuiLogin() {
      if (this.isGettingLocation) {
        return;
      }

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转永辉彩食鲜...',
          forbidClick: true,
          duration: 0
        });

        // 调用永辉免密登录接口（无需参数）
        const res = await getYonghuiLoginUrl();

        this.$toast.clear();

        console.log('永辉免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.data) {
          const loginUrl = res.data.data;
          console.log('永辉免密登录URL:', loginUrl);

          // 跳转到永辉彩食鲜
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('永辉免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },// 跳转到大润发
    async goToDarunfa() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转大润发...',
          forbidClick: true,
          duration: 0
        });

        const res = await getDarunfaLoginUrl();

        this.$toast.clear();

        console.log('大润发响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('大润发H5URL:', h5Url);

          // 跳转到大润发
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('大润发跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到中石油
    async goToZhongshihua() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转中石油...',
          forbidClick: true,
          duration: 0
        });

        const res = await getZhongshihuaLoginUrl();

        this.$toast.clear();

        console.log('中石油响应:', res);

        if (res.code === 200 && res.data && res.data.h5Url) {
          const h5Url = res.data.h5Url;
          console.log('中石油H5URL:', h5Url);

          // 跳转到中石油
          window.location.href = h5Url;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('中石油跳转失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    schengWeb(item) {
      if (item.id == 79) {
        this.goToDongfang();
        return;
      }
      if (item.id == 77) {
        this.goToZhongshihua();
        return;
      }
      if (item.id == 76) {
        this.goToHema();
        return;
      }
      console.log(item)
      if (item.id == 44) {
        this.goToQuchenshi();
        return;
      }
      if (item.id == 40) {//maidelong
        this.goToMaidelong();
        return;
      }
      if (item.id == 41) {
        this.goToHaidilao();
        return;
      }
      if (item.id == 37) {
        //锅圈的展码付
        this.goToGuoquan();
        return;
      }
      if (item.id == 38) {
        this.goToDarunfa();
        return;
      }
      if (item.id == 36) {
        this.goToWumei();
        return;
      }
      if (item.id == 39) {//yonghui
        this.goToYonghuiZhanfuma();
        return;
      }





      if (item.id == 70) {
        this.goToDache();
        return;
      }
      // 酒店
      if (item.id == 75) {
        this.goToJiudian();
        return;
      }
      // 京东家政
      if (item.id == 69) {
        this.goToJdJiazheng();
        return;
      }
      console.log(item)
      if (item.id == 45) {
        this.goToShanmu();
        return;
      }
      if (item.id == 46) {
        this.goToZhongshihua();
        return;
      }
      if (item.id == 22) {
        //永辉的展码付
        this.goToYonghuiZhanfuma();
        return;
      }





      if (item.id == 8) {
        this.goToDingdongLogin();
        return;
      }

      if (item.id == 17) {
        this.$router.push({ path: "/HemaFresh" })// 和马
        return;
      }

      if (item.id == 18) {
        this.goToYonghuiLogin();
        return;
      }
      if (item.id == 19) {
        this.goToDingdongLogin();
        return;
      }
    },
    // 跳转到叮咚买菜免密登录
    async goToDingdongLogin() {
      // 防止重复点击
      if (this.isGettingLocation) {
        return;
      }

      this.isGettingLocation = true;

      try {
        // 显示加载提示
        this.$toast.loading({
          message: '正在获取位置...',
          forbidClick: true,
          duration: 0
        });

        // 获取当前位置
        const position = await this.getCurrentPosition();

        console.log('获取到的位置:', position);

        // 更新加载提示
        this.$toast.loading({
          message: '正在跳转叮咚买菜...',
          forbidClick: true,
          duration: 0
        });

        // 调用免密登录接口
        const res = await getDingdongLoginUrl({
          latitude: position.latitude,
          longitude: position.longitude
        });

        // 关闭加载提示
        this.$toast.clear();

        console.log('免密登录接口返回:', res);

        if (res.code === 200 && res.data && res.data.data) {
          // 获取免密登录URL
          const loginUrl = res.data.data;
          console.log('免密登录URL:', loginUrl);

          // 跳转到叮咚买菜
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    async getIndex() {
      onlineBrand().then(res => {
        if (res.code == 200) {
          this.onlineList = res.data.online
          this.payList = res.data.zhanuma

        }
      })
    },
    async goToXiaoxiang() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转美团小象超市...',
          forbidClick: true,
          duration: 0
        });

        const res = await getXiaoxiangLoginUrl();

        this.$toast.clear();

        console.log('美团小象超市免密登录接口返回:', res);

        // ✅ 和饿了么、美团外卖、美团到店一样，res.data 本身就是 URL 字符串
        if (res.code === 200 && res.data) {
          const loginUrl = res.data;
          console.log('美团小象超市免密登录URL:', loginUrl);
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('美团小象超市免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到盒马免密登录
    async goToHemashangcheng() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转盒马商城...',
          forbidClick: true,
          duration: 0
        });

        const res = await getHemaLoginUrlshangcheng();

        this.$toast.clear();

        console.log('盒马商城免密登录接口返回:', res);

        // ✅ 商城返回的是 data.data
        if (res.code === 200 && res.data && res.data.data) {
          const loginUrl = res.data.data;
          console.log('盒马商城免密登录URL:', loginUrl);
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('盒马商城免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    // 跳转到美团外卖免密登录
    async goToMeituan() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转美团外卖...',
          forbidClick: true,
          duration: 0
        });

        const res = await getMeituanLoginUrl();

        this.$toast.clear();

        console.log('美团外卖免密登录接口返回:', res);

        // ✅ 和饿了么一样，res.data 本身就是 URL 字符串
        if (res.code === 200 && res.data) {
          const loginUrl = res.data;
          console.log('美团外卖免密登录URL:', loginUrl);
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('美团外卖免密登录失败:', error);
        this.$toast.clear();
        this.$toast.fail('跳转失败，请重试');
      } finally {
        this.isGettingLocation = false;
      }
    },
    onlines(ixd) {
      console.log(ixd)
      if (ixd == 16) {
        this.goToXiaoxiang();
        return;

      }
      if (ixd == 17) {
      
        this.goToHemashangcheng();
        return;

      }

      if (ixd == 18) {
        this.goToYonghuiLogin();
        return;
      }
      if (ixd == 19) {
        this.goToDingdongLogin();
        return;
      }
      if (ixd == 31) {
        this.$router.push({ path: "/JingzaoHome" }) // 京造
        return;
      }
      if (ixd == 32) {
        this.$router.push({ path: "/JingdongChannel" })// 京东自营
        return;
      }
      if (ixd == 33) {
        this.$router.push({ path: "/TmallSupermarket" }) //天猫
        return;
      }
      if (ixd == 34) {
        this.goToMeituan();
        return

      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }, mounted() {
    this.getIndex()
  },
}
</script>

<style scoped lang="less">
.brand-season-page {
  background: #FEFFEE;
  /* 米黄色背景，呼应金色礼盒主题 */
  min-height: 100vh;
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
  /* 透出米黄色 */
  position: absolute;
  width: 100%;
  z-index: 10;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .nav-left,
  .nav-right {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    width: 24px;
  }

  .nav-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}

/* ================= 2. Banner ================= */
.top-banner-area {
  position: relative;
  width: 100%;

  /* 给导航留出空间 */

  .banner-img {
    width: 100%;
    height: 180px;
    object-fit: cover;

    display: block;
  }

  .banner-btn {
    position: absolute;
    bottom: 15px;
    left: 40px;
    background: #D28C3D;
    color: #fff;
    font-size: 12px;
    padding: 6px 20px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(210, 140, 61, 0.3);
    cursor: pointer;
    z-index: 2;
  }
}

/* ================= 3. 通用板块容器 ================= */
.section-box {
  margin: 16px 10px;
  padding: 10px;

  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  &.bg1 {
    background: url(../../assets/lh/b3.jpg) no-repeat;
    background-size: cover;
  }

  &.bg2 {
    background: url(../../assets/lh/b2.jpg) no-repeat;
    background-size: cover;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: space-between;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .sub {
      font-size: 12px;
      color: #875828;
    }
  }
}

/* ================= 4. 线上商城 (2行4列) ================= */
.store-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .store-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;


    .store-img-box {
      width: 100%;
      // height: 84px;
      overflow: hidden;

      .store-img {
        width: 100%;
        // height: 100%;
        object-fit: cover;
      }
    }

    .store-info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 0;
      background: #fff;

      .store-logo {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        object-fit: contain;
      }

      .store-name {
        font-size: 11px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

/* ================= 5. 展码付 ================= */
.pay-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .pay-item {
    display: flex;
    // flex-direction: column;
    align-items: center;
    background: #F8F8F8;
    border-radius: 8px;
    padding: 10px 8px;

    .pay-logo-box {
      width: 38px;
      height: 38px;
      // margin-bottom: 6px;
      margin-right: 6px;

      .pay-logo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
        background: #fff;
      }
    }

    .pay-name {
      font-size: 12px;
      font-weight: 600;
      color: #333;

    }

    .pay-btn {
      line-height: 1;

      span {
        display: inline-block;
        // display: inline-flex;
        // align-items: center;
        // justify-content: center;
        background: #FF6B35;
        color: #fff;
        font-size: 10px;
        padding: 1px 4px;
        border-radius: 12px;
        cursor: pointer;

        line-height: 1;
      }

      .arrow {
        font-size: 12px;
        margin-left: 2px;
      }
    }
  }
}

.bottom-safe {
  height: 20px;
}
</style>