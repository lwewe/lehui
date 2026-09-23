<template>
  <div class="location" :style="cssVars">
    <NProgress v-if="loadingflag" />
    <!-- <div class="model" v-if="isShow"></div> -->
    <!--    头部-->
    <div class="topBox" ref="topBox">
      <div class="topPage">

        <div class="searchBox">
          <div style="font-size: 14px;">
            <!--      地址-->
            <City @getCity="getCity"></City>
          </div>

          <!-- 自定义搜索框 (还原截图样式) -->
          <div class="searchValue" @click="toOther('/productList')" v-if="$store.state.festivals != 2">
            <div class="custom-search-box">
              <input type="text" placeholder="请输入商品名称" v-model="searchValue" />
              <span class="custom-search-btn">搜索</span>
            </div>
          </div>
          <div class="customer" @click="toCustomer">
            <img class="img" src="../assets/kf1.png" style="position: relative;top: 2px;" alt="">
          </div>
        </div>
      </div>
      <!--  banner-->

      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
          <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.img" @click="toBanner(item)">

            <img class="img" :src="item.img" alt="" style="border-radius: 4px;">
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="sortBox">
        <div class="sortScroll">
          <div class="sortTop" :style="'width:' + classList.length * 68 + 'px;'">
            <div v-for="(item, index) in classList" :key="index" @click="toClass(item, index)">
              <div class="iconBox">
                <img class="img" :src="item.img" alt="" loading="lazy">
              </div>
              <div class="sortText">{{ item.title }}</div>
            </div>
          </div>
        </div>


        <div class="sortWrapper" v-if="sortList.length > 0">
          <div class="sortSwiper" ref="sortSwiper" @scroll="onSortScroll">
            <div class="sortTop sortCenter" v-for="(page, pageIndex) in sortPages" :key="pageIndex">
              <div class="sortItem" v-for="item in page" :key="item.title" @click="toSort(item)">
                <div class="iconImg" :style="{ width: $store.state.festivals == 2 ? '50px' : '' }">
                  <img class="img" :src="item.img" alt="">
                </div>
                <div class="sortText">{{ item.title }}</div>
              </div>
            </div>
          </div>
          <div class="sortPagination" v-if="sortPages.length > 1">
            <span v-for="(page, index) in sortPages" :key="index" class="paginationDot"
              :class="{ active: index === currentSortPage }" @click="goToSortPage(index)"></span>
          </div>
        </div>

      </div>
      <!--      甄选-->


      <!--      限时抢购 addff-->
      <div class="imageSlider">
        <div class="sliderContainer">
          <div class="sliderItem" v-for="(item, index) in imageList" :key="index">
            <img :src="item.img" @click="goToFour(item)" alt="" class="sliderImg">
          </div>
        </div>
      </div>


      <!--  -->
      <div class="product-row">
        <!-- 特价好物 -->
        <div class="product-card">
          <div class="card-header" @click="HomeFlashSalePage()">
            <span style="display: flex; align-items: center;">
              <img src="../assets/lh/tj-1.png" alt="" style="margin-right: 6px;">
              <span class="title">特价好物</span>
            </span>
            <span class="sub">热抢中</span>
          </div>
          <div class="product-list">
            <div class="product-item" v-for="(item, index) in zoneGoods1" :key="item.id" @click="goToDetail(item)">
              <img class="product-img" :src="item.img" alt="">
              <div class="tag-row">
                <span class="name">{{ item.title }}</span>
              </div>
              <div class="price-row">
                <span class="current"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 热卖好物 -->
        <div class="product-card">
          <div class="card-header" @click="JingzaoSuperValue()">
            <span style="display: flex; align-items: center;">
              <img src="../assets/lh/tj-2.png" alt="" style="margin-right: 6px;">
              <span class="title">热卖好物</span>
            </span>
            <span class="sub">门店热销</span>
          </div>


          <div class="product-list">
            <div class="product-item" v-for="(item, index) in zoneGoods2" :key="item.id" @click="goToDetail(item)">
              <img class="product-img" :src="item.img" alt="">
              <div class="tag-row1">
                <span class="name">{{ item.title }}</span>
              </div>
              <div class="price-row">
                <span class="current"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</span>
              </div>
            </div>
          </div>


        </div>
      </div>
      <!--  -->
      <div>
        <div class="brandSection">
          <!-- 品牌推荐 -->
          <div class="brandTitle"><span>品牌推荐</span><span style="font-size: 12px;color: #707070;"
              @click="BrandSeasonPage()">更多<img src="../../src/assets/lh/more.png"
                style="width: 10px;height: 10px;opacity: 0.6;" alt=""></span>
          </div>
          <div class="brandList">
            <div class="brandItem" v-for="(brand, index) in brandList" :key="index">
              <img :src="brand.img" alt="" class="brandImg" @click="schengWeb(brand)">

            </div>
          </div>

          <!-- 第一个滚动图片区（7张） -->
          <div class="scrollPicSection">

            <div class="picScroll">
              <div class="picItem" v-for="(pic, index) in picList1" :key="index" @click="schengWeb1(pic)">
                <img :src="pic.img" alt="" class="scrollPic">
                <span>{{ pic.title }}</span>
              </div>
            </div>
          </div>

          <!-- 第二个滚动图片区（7张） -->
          <div class="scrollPicSection">

            <div class="picScroll">
              <div class="picItem" v-for="(pic, index) in picList2" :key="index" @click="schengWeb1(pic)">
                <img :src="pic.img" alt="" class="scrollPic">
                <span>{{ pic.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--  -->

    </div>
     
    <!--    tab切换-->


    <!--    tab切换 (改为: 由 zoneList 过滤出 id=10,11,12,13 的板块) :class="{ tabbar2: show }"  -->
    <div class="tabbar" ref="topScroll" v-if="currentTabs.length > 1">
      <!-- <div v-if="isLoading" class="isTab" :style="'width:' + currentTabs.length * 90 + 'px;'"></div> -->
      <div class="tabbarBox" :style="'width:' + currentTabs.length * 90 + 'px;'">
        <div class="tabItem" v-for="(item, index) in currentTabs" :key="item.id" @click="changeTab(item.id, index)">
          <div class="tabTop " :class="{ tabTop2: active == item.id }">{{ item.title }}<span class="lines"></span>
          </div>
        </div>
      </div>
    </div>
    <!--    列表-->
    <!-- 商品瀑布流列表 -->
    <div class="listMax">
      <div class="waterfall-container">
        <!-- 左列 -->
        <div class="waterfall-column">
          <div class="bannerBox" v-if="active == 0 && shopSwiper.length > 0">
            <van-swipe :autoplay="3000" indicator-color="white">
              <van-swipe-item class="bannerImg" v-for="(item, index) in shopSwiper" :key="item.id || index"
                @click="toDetail(item)">
                <img class="img" :src="item.img" alt="">
              </van-swipe-item>
            </van-swipe>
          </div>

          <div v-for="(item, index) in leftList" :key="item.id || index" class="shop-item">
            <div class="product-card1" @click="toDetail(item)">
              <div class="product-img-box">
                <img :src="item.img" alt="" class="product-img" v-if="item.img">
                <div class="img-placeholder" v-else>暂无图片</div>
              </div>
              <div class="product-info">
                <div class="product-title">{{ item.title }}</div>
                <span class="platform-tag" v-if="getPlatformName(item.platform, item.jd_type)">
                  {{ getPlatformName(item.platform, item.jd_type) }}

                </span>
                <!-- <div class="product-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div> -->
                <div class="product-price-row">
                  <span class="sell-price">{{ item.sell_price }}</span>
                  <span class="market-price" v-if="item.market_price">￥{{ item.market_price }}</span>
                </div>
                <!-- <div class="product-sales" v-if="item.sale_num">
                  已售{{ item.sale_num }}
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <!-- 右列 -->
        <div class="waterfall-column">
          <div v-for="(item, index) in rightList" :key="item.id || index" class="shop-item">
            <div class="product-card1" @click="toDetail(item)">
              <div class="product-img-box">
                <img :src="item.img" alt="" class="product-img" v-if="item.img">
                <div class="img-placeholder" v-else>暂无图片</div>
              </div>
              <div class="product-info">
                <div class="product-title">{{ item.title }}</div>
                <span class="platform-tag" v-if="getPlatformName(item.platform, item.jd_type)">
                  {{ getPlatformName(item.platform, item.jd_type) }}

                </span>
                <!-- <div class="product-subtitle" v-if="item.subtitle">{{ item.subtitle }}</div> -->
                <div class="product-price-row">
                  <span class="sell-price">{{ item.sell_price }}</span>
                  <span class="market-price" v-if="item.market_price">￥{{ item.market_price }}</span>
                </div>
                <!-- <div class="product-sales" v-if="item.sale_num">
                  已售{{ item.sale_num }}
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <loading style="margin-top: 2px" v-if="isLoading"></loading> -->
    </div>


  </div>
</template>
<script>
import City from "@/components/City.vue";
import { getElemaLoginUrlshangcheng } from "@/api/elemashangcheng";
import { getIndexList } from "@/api/lhcard";
import { brandList, productLists, categoryList, channelList, homeInd, zoneList } from "@/api/lhjdtm";
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
import { getPlatformName } from '@/utils/platform'

import { getJuheShangchaoLoginUrl } from "@/api/juheshangchao";
import { getMeituanLoginUrl } from "@/api/meituan";
import { getTuangouLoginUrl } from "@/api/meituantuangou";
import { getXiaoxiangLoginUrl } from "@/api/xiaoxiang";

export default {
  name: "IndexView",
  components: {
    City,
  },
  computed: {
    cssVars() {
      const colors = this.backColor.split(',')
      return {
        '--gradient-top': colors[0]?.trim() || '#FCF1DE',
        '--gradient-bottom': colors[1]?.trim() || '#EFEFEF'
      }
    },
    sortPages() {
      const pageSize = 10
      const pages = []
      for (let i = 0; i < this.sortList.length; i += pageSize) {
        pages.push(this.sortList.slice(i, i + pageSize))
      }
      return pages.length > 0 ? pages : [[]]
    }
  },
  data() {
    return {
      dingdongPosition: {
        latitude: "",
        longitude: ""
      },
      isGettingLocation: false,
      imageList: [

      ],
      brandList: [],
      picList1: [],
      picList2: [],
      currentSortPage: 0,
      lastLoadTime: 0,
      searchValue: "",
      bannerList: [],
      classList: [],
      sortList: [],
      backColor: "",
     
      active: 0,
      // tabList: [{
      //   flag: "1",
      //   id: "0",
      //   syname: "热门推荐",
      //   tag: "精选好物",
      // }],
      shopSwiper: [],
      itemHeight: 0,
      swiperHeight: 0,
      flashSale: [],
      shopList: [],
      leftList: [],
      rightList: [],
      page: 1,
      isScroll: false,
      timer: null,
      isHeight: false,
      isFixed: false,
      kefu: localStorage.getItem("kefu"),
      timeDowm: 1800,
      countdown: "",
      loadingflag: true,
      isLoading: false,
      show: false,
      timer2: null,
      support_farmers: '',
      isTab: false,
      // isShow: true,
      gonggao: "",
      brandPick: '',
      hasLoaded: false,
      zoneData: [],        // 存放 zoneList 返回的全部专区列表
      zoneGoods1: [],      // 存放第一个专区（特价好物）的商品
      zoneGoods2: [],      // 存放第二个专区（热卖好物）的商品

      currentTabs: [],     // 存放过滤后的 Tab (id为 10,11,12,13 的板块)
      zoneTabGoods: {},    // 存放各个板块的商品数据 (按 id 索引)
    }
  },
  methods: {
    // 跳转到美团小象超市免密登录
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
    // 跳转到美团到店(美食团购)免密登录
    async goToTuangou() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转美团到店...',
          forbidClick: true,
          duration: 0
        });

        const res = await getTuangouLoginUrl();

        this.$toast.clear();

        console.log('美团到店免密登录接口返回:', res);

        // ✅ 和饿了么、美团外卖一样，res.data 本身就是 URL 字符串
        if (res.code === 200 && res.data) {
          const loginUrl = res.data;
          console.log('美团到店免密登录URL:', loginUrl);
          window.location.href = loginUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('美团到店免密登录失败:', error);
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
    // 跳转到饿了么(开票版)免密登录
    async goToElemaLoginshangcheng() {
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        // 1. 提示获取位置
        this.$toast.loading({
          message: '正在获取位置...',
          forbidClick: true,
          duration: 0
        });

        // 2. 拿经纬度
        const position = await this.getCurrentPosition();
        console.log('饿了么获取到的位置:', position);

        // 3. 更新提示
        this.$toast.loading({
          message: '正在跳转饿了么...',
          forbidClick: true,
          duration: 0
        });

        // 4. 传经纬度调接口
        const res = await getElemaLoginUrlshangcheng({
          latitude: position.latitude,
          longitude: position.longitude
        });

        this.$toast.clear();

        console.log('饿了么免密登录接口返回:', res);

        // ✅ 饿了么特殊：res.data 本身就是 URL 字符串
        if (res.code === 200 && res.data) {
          const loginUrl = res.data;
          console.log('饿了么免密登录URL:', loginUrl);
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
    // 跳转到聚合商超免密登录
    async goToJuheShangchao() {
      // 防止重复点击
      if (this.isGettingLocation) return;

      this.isGettingLocation = true;

      try {
        this.$toast.loading({
          message: '正在跳转聚合商超...',
          forbidClick: true,
          duration: 0
        });

        const res = await getJuheShangchaoLoginUrl();

        this.$toast.clear();

        console.log('聚合商超免密登录接口返回:', res);

        // ✅ 注意：返回的是 data.jdUrl
        if (res.code === 200 && res.data && res.data.jdUrl) {
          const jdUrl = res.data.jdUrl;
          console.log('聚合商超免密登录URL:', jdUrl);

          // 跳转到聚合商超
          window.location.href = jdUrl;
        } else {
          this.$toast.fail(res.msg || '获取登录链接失败');
        }
      } catch (error) {
        console.error('聚合商超免密登录失败:', error);
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
    // 跳转到麦德龙
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
    },
    // 获取分类列表
    IndexchannelList() {
      channelList().then(res => {
        if (res.code == 200) {

          let tubiaoData = res.data || [];

          tubiaoData.sort((a, b) => {
            return (a.sort || 0) - (b.sort || 0)
          })

          this.classList = tubiaoData.slice(0, 9)  // 前8个作为主分类

        }
      })
    },
    indexFourImg() {
      homeInd().then(res => {
        if (res.code == 200) {

          this.imageList = res.data.activity

        }
      })
    },
    zoneListIndex() {
      zoneList().then(res => {
        if (res.code == 200) {
          // 把接口返回的专区列表存起来
          this.zoneData = res.data.list || [];
          let targetZone = this.zoneData.find(zone => zone.id == 4);
          console.log(targetZone)
          // 如果有这个专区，取它的商品
          if (targetZone && targetZone.goods) {
            this.zoneGoods2 = targetZone.goods.slice(0, 2) || [];
          }

          let targetZone1 = this.zoneData.find(zone => zone.id == 5);
          console.log(targetZone1)
          // 如果有这个专区，取它的商品
          if (targetZone1 && targetZone1.goods) {
            this.zoneGoods1 = targetZone1.goods.slice(0, 2) || [];
          }





          const targetIds = [10, 11, 12, 13];
          this.currentTabs = this.zoneData.filter(item => targetIds.includes(item.id));

          // 将筛选出的板块的商品数据存起来
          this.currentTabs.forEach(item => {
            this.zoneTabGoods[item.id] = item.goods || [];
          });

          // 默认选中第一个 Tab (id = 10)
          if (this.currentTabs.length > 0) {
            this.active = this.currentTabs[0].id;

            // 这里直接调用请求方法，不要用 changeTab！因为DOM还没渲染好
            this.getGoodPickByCategory(this.active, 1);
          }
        }
      });
    },
    IndexcategoryList() {
      categoryList().then(res => {
        console.log('天猫分类数据:', res);
        if (res.code == 200) {

        }
      })
    },
    // 跳转到商品详情
    toDetail(item) {
      // if (id) {
      //   this.$router.push({
      //     path: "/productDetail",
      //     query: { id }
      //   })
      // }
      this.$goDetail(item);
    },

    // 分割商品列表到左右两列
    splitShopList(list) {
      console.log('开始分割商品列表，总长度:', list.length)

      this.leftList = []
      this.rightList = []

      if (!Array.isArray(list) || list.length === 0) {
        console.warn('商品列表为空或不是数组')
        return
      }

      list.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftList.push(item)
        } else {
          this.rightList.push(item)
        }
      })

      console.log('分割完成 - 左列:', this.leftList.length, '右列:', this.rightList.length)
    },

    onSortScroll(e) {
      const scrollLeft = e.target.scrollLeft
      const pageWidth = e.target.offsetWidth
      const pageIndex = Math.round(scrollLeft / pageWidth)
      this.currentSortPage = pageIndex
    },
    goToFour(item) {
      console.log(item)
      if (item.id == 7) {
        this.$router.push('DrinkFreshMilkPage?id=8&nav=0&index=0')
        return
      }
      console.log(item.link)
      this.$router.push(item.link)
    },
    goToSortPage(index) {
      this.currentSortPage = index
      const sortSwiper = this.$refs.sortSwiper
      if (sortSwiper) {
        sortSwiper.scrollLeft = index * sortSwiper.offsetWidth
      }
    },

    async initPageData() {
      if (this.hasLoaded) return
      this.hasLoaded = true

      console.log('开始初始化数据...')

      try {
        await this.getIndex()
        console.log('getIndex 完成')

        // await this.getFlashSaleList()
        // console.log('getFlashSaleList 完成')

        if (this.$store.state.festivals != 2) {
          await this.getGoodPick(1)
          console.log('getGoodPick 完成')
        }

        console.log('所有数据加载完成，shopList长度:', this.shopList.length)
      } catch (error) {
        console.error('数据加载失败:', error)
      }
    },

    // showSearch() {
    //   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //   if (scrollTop > this.$refs.topBox.getBoundingClientRect().height) {
    //     this.show = true;
    //   } else {
    //     this.show = false;
    //   }
    // },

    toBanner(item) {
      console.log(item)
    },
    // 跳转到大润发
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
    toSort(item) {
      //   alert(item.id)
      // return false
      if (item.id == 10) {//xiaoxiang
        this.goToXiaoxiang();
        return;
      }
      if (item.id == 6) {//meituan
        this.goToMeituan();
        return;
      }
      if (item.id == 11) {//meituan daodian tuangou
        this.goToTuangou();
        return;
      }
      if (item.id == 80) {
        this.goToJuheShangchao();
        return;
      }
      if (item.id == 7) {
        this.goToElemaLoginshangcheng();
        return;
      }

      if (item.id == 15) {
        this.$router.push({
          path: "/TuhuZone",

        });
        return;
      }
      if (item.id == 78) {
        this.$router.push({
          path: "/FlowerZone",

        });
        return;
      }

      if (item.id == 26) {
        this.goToMaidelong();
        return;
      }
      if (item.id == 27) {
        this.goToQuchenshi();
        return;
      }




      if (item.id == 71) {
        this.goToDache();
        return;
      }
      if (item.id == 13) {
        this.goToHemashangcheng();
        return;
      }
      if (item.id == 80) {
        this.goToJuheShangchao();
        return;
      }
      // 酒店
      if (item.id == 7) {
        this.goToElemaLogin();
        return;
      }
      // 酒店
      if (item.id == 74) {
        this.goToJiudian();
        return;
      }


      console.log(item)
      if (item.id == 73) {
        this.goToJdJiazheng();
        return;
      }

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
      if (item.id == 23) {
        this.goToHaidilao();
        return;
      }
      if (item.id == 21) {
        //锅圈的展码付
        this.goToGuoquan();
        return;
      }
      if (item.id == 24) {
        this.goToWumei();
        return;
      }

      if (item.id == 25) {

        this.goToDarunfa();
        return;
      }

      if (item.id == 8) {
        this.goToDingdongLogin();
        return;
      }
      if (item.id == 14) {
        this.goToYonghuiLogin();
        return;
      }
      const url = item.url;
      const externalPaths = ['/cake/']
      if (externalPaths.some(path => url.startsWith(path))) {
        window.location.href = url
        return
      }
      if (url.includes('#')) {
        this.$router.push(url.split('#')[1])
        return
      }
      this.$router.push(url)
    },

    JingzaoSuperValue() {
      this.$router.push('/HomeHot');
    },

    toClass(item, index) {
      console.log(item)
        console.log('点击分类', item.title, 'index=', index, 'ixd=', index + 1)   // ← 加这行
      const ixd = index + 1;
      if (ixd == 1) this.$router.push({ path: "/FoodDelivery", query: { id: item.id } })
      if (ixd == 6) this.$router.push({ path: "/ApplianceChannel", query: { id: item.id } })
      if (ixd == 4) this.$router.push({ path: "/DrinkZone", query: { id: item.id } })
      if (ixd == 5) this.$router.push({ path: "/BeautyZone", query: { id: item.id } })
      if (ixd == 7) this.$router.push({ path: "/TissueZone", query: { id: item.id } })
      if (ixd == 3) this.$router.push({ path: "/SnackZone", query: { id: item.id } })
        if (ixd == 8) this.$router.push({ path: "/filmindex" })   // ← 加这行
    },

    toCustomer() {
      window.location.href = this.kefu
    },

    getGoodPickByCategory(cate_id, page = 1) {
      // ✅ 完全不使用任何 loading 状态，避免页面跳动
      productLists({
        cate_id: cate_id,
        platform: 0,
        page: page,
        pagesize: 10
      }).then(res => {
        if (res.code == 200) {
          let productData = []
          if (res.data && Array.isArray(res.data)) {
            productData = res.data
          } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            productData = res.data.data
          } else if (res.data && res.data.product_list && Array.isArray(res.data.product_list)) {
            productData = res.data.product_list
          } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
            productData = res.data.list
          }
          if (productData.length === 0) {
            this.isScroll = true
            return
          }
          if (page === 1) {
            this.shopList = []
            this.leftList = []
            this.rightList = []
          }
          if (page === 1) {
            this.shopList = []
          }
          productData.forEach(item => {
            this.shopList.push(item)
          })
          this.splitShopList(this.shopList)
        }
      }).catch(error => {
        console.error('获取商品失败:', error)
      })
    },

    changeTab(id, index) {
      // this.isHeight = true
      this.loadingflag = false
      this.isScroll = false
      // this.shopList = []
      // this.leftList = []
      // this.rightList = []
      this.page = 1
      this.active = id
      // this.isTab = true

      // document.documentElement.scrollTop += this.$refs.topScroll.getBoundingClientRect().top + 5

      // 调用 productList 接口（关键改动）
      this.getGoodPickByCategory(id, 1)

      // this.timer2 = null
      // if ((index + 1) >= 3) {
      //   this.$refs.topScroll.scrollLeft = 60 * (index + 1)
      // } else {
      //   this.$refs.topScroll.scrollLeft = 0
      // }
    },


    toNext(path) {
      this.$router.push(path)
    },
    schengWeb1(item) {
      console.log(item)
      if (item.id == 40) {
        this.goToMaidelong();
        return;
      }
      if (item.id == 44) {
        this.goToQuchenshi();
        return;
      }
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
      if (item.id == 41) {
        this.goToHaidilao();
        return;
      }
      if (item.id == 37) {
        //锅圈的展码付
        this.goToGuoquan();
        return;
      }
      if (item.id == 36) {
        this.goToWumei();
        return;
      }

      if (item.id == 38) {

        this.goToDarunfa();
        return;
      }

      if (item.id == 8) {
        this.goToDingdongLogin();
        return;
      }
      if (item.id == 39) {//yonghui
        this.goToYonghuiLogin();
        return;
      }


    },
    schengWeb(items) {
      console.log(items)
      if (items.id == 17) {
        this.$router.push({ path: "/HemaFresh" })// 和马
        return;
      }

      if (items.id == 18) {
        this.goToYonghuiLogin();
        return;
      }
      if (items.id == 19) {
        this.goToDingdongLogin();
        return;
      }
    },
    BrandSeasonPage() {
      this.$router.push('/BrandSeasonPage');
    },

    HomeFlashSalePage() {
      this.$router.push('/HomeFlashSalePage');
    },

    onChange(index) {
      if (this.bannerList[index] && this.bannerList[index].yanse1) {
        this.backColor = this.bannerList[index].yanse1 + ',' + this.bannerList[index].yanse2
      }
    },

    brandLists() {
      brandList({ platform: 3 }).then(res => {
        console.log('分类数据:', res);
        if (res.code == 200) {
          // 处理品牌数据
        }
      })
    },

    getIndex() {
      return getIndexList().then(res => {
        if (res.code == 200) {
          this.brandList = res.data.online.slice(0, 4) || []
          this.bannerList = res.data.banner || []
          // this.classList = (res.data.tubiao || []).slice(0, 8)
          this.picList1 = (res.data.zhanuma || []).slice(0, 6)
          this.picList2 = (res.data.zhanuma || []).slice(6, 20)
          this.sortList = (res.data.tubiao || []).slice(8, 100)

          if (this.bannerList.length > 0 && this.bannerList[0].yanse1) {
            this.backColor = this.bannerList[0].yanse1 + ',' + this.bannerList[0].yanse2
          }
        }
      })
    },



    // 获取商品列表
    getGoodPick(page = this.page) {
      console.log('getGoodPick 开始，页码:', page)

      if (this.isTab) {
        this.shopList = []
      }
      this.isLoading = true

      return productLists({
        cate_id: 10,
        platform: 0,

        page,
        pagesize: 10
      }).then(res => {
        console.log('productList 完整返回:', res)

        this.isLoading = false
        setTimeout(() => {
          this.loadingflag = false
        }, 500)

        if (res.code == 200) {
          let productData = []

          // 兼容多种数据结构
          if (res.data && Array.isArray(res.data)) {
            productData = res.data
          } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            productData = res.data.data
          } else if (res.data && res.data.product_list && Array.isArray(res.data.product_list)) {
            productData = res.data.product_list
          } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
            productData = res.data.list
          }

          console.log('解析后的商品数据:', productData)

          if (productData.length === 0) {
            console.log('商品数据为空')
            this.isScroll = true
            return
          }

          // 如果是第一页，清空数据
          if (page === 1) {
            this.shopList = []
          }

          // 添加数据
          productData.forEach(item => {
            this.shopList.push(item)
          })

          // 分割数据到左右两列
          this.splitShopList(this.shopList)

          console.log('shopList 最终长度:', this.shopList.length)

          this.isTab = false
        } else {
          console.error('接口返回错误:', res)
        }
      }).catch(error => {
        console.error('获取商品列表失败:', error)
        this.isLoading = false
      })
    },

    getCity(city) {
      console.log('收到城市:', city);
      this.isShow = false;

      // 如果收到的是对象，取 name 属性
      if (city && typeof city === 'object') {
        city = city.name || '';
      }

      // 存储城市名
      if (city && typeof city === 'string') {
        sessionStorage.setItem("cityName", city);
      }
    },



    toOther(path) {
      this.$router.push(path)
    },

    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && !this.isTab) {
        this.onMost()
      }
    },

    onMost() {
      if (!this.isScroll) {
        this.page++
        if (this.active == 0) {
          this.getGoodPick(this.page)
        } else {

        }
      }
    },
    // 获取当前位置并跳转叮咚免密登录

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

    // 获取当前位置

    // 创建叮咚订单
    async createDingdongOrder(orderData) {
      try {
        const res = await createDingdongOrder(orderData);

        if (res.code === 200 && res.success) {
          // 订单创建成功
          const { cashierUrl, thirdOrderNo } = res.data;

          // 跳转到收银台
          if (cashierUrl) {
            window.location.href = cashierUrl;
          }

          return res.data;
        } else {
          this.$toast.fail('创建订单失败');
          return null;
        }
      } catch (error) {
        console.error('创建订单失败:', error);
        this.$toast.fail('创建订单失败');
        return null;
      }
    },

    // 查询支付状态
    async queryPayStatus(orderNo, tradeNo) {
      try {
        const res = await queryDingdongPayStatus({
          orderNo: orderNo,
          tradeNo: tradeNo
        });

        if (res.code === 200) {
          return res.data;
        } else {
          return null;
        }
      } catch (error) {
        console.error('查询支付状态失败:', error);
        return null;
      }
    },


    // 获取平台名称
    getPlatformName,

  },
  created() {
    console.log('组件创建')

    this.$router.options.routes.forEach(item => {
      if (item.path === '/index' && item.meta) {
        item.meta.keepAlive = true
      }
    })

    this.initPageData();


    // if (sessionStorage.getItem("cityName") || sessionStorage.getItem("promptcity") == 2) {
    //   this.isShow = false
    // }
  },
  mounted() {
    console.log('组件挂载')
    this.IndexchannelList()
    this.brandLists();
    this.IndexcategoryList();
    this.indexFourImg()
    this.zoneListIndex()
    window.addEventListener('scroll', this.handleScroll);
    // window.addEventListener('scroll', this.showSearch);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
    // window.removeEventListener('scroll', this.showSearch, false);
  },
}
</script>

<style scoped lang="less">
.platform-tag {
  display: inline-block;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 4px;
}

.location {
  padding-bottom: 50px;
  background-color: #F0F0F0;
  min-height: 100vh;
  position: relative;
  /* 为伪元素定位做准备 */
  z-index: 1;
}

.location::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  background-image: linear-gradient(to bottom,
      var(--gradient-top, #FCF1DE),
      var(--gradient-bottom, #EFEFEF));
  z-index: -1;
  /* 放在最底层 */
}

/deep/ .van-swipe__indicator {
  display: none;
}

.topBox {
  padding: 6px 10px 10px 10px;
  overflow: hidden;

  //头部
  .topPage {
    padding: 0px 0px;

    .title {
      text-align: center;
      color: white;
      font-size: 14px;
    }

    .address {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }


    .searchValue {
      width: 66%;
    }

    .van-search {
      padding-bottom: 6px;
      padding-top: 6px;
    }

    .van-search .van-cell {
      background-color: transparent;
    }

    .van-search__content {
      background-color: #FFFFFF;
      border-radius: 30px;
    }

    /deep/ .van-field__control {
      color: #92716D;
    }

    .customer {
      width: 23px;
    }
  }

  .banner {
    width: calc(100%);
    // width: calc(100% + 30px);
    box-sizing: border-box;
    //margin-left: -15px;
    border-radius: 8px;
    margin-top: 6px;
  }

  .sortBox {
    border-radius: 10px;
    background-color: #ffffff;
    padding: 19px 7px 10px 7px;
    margin-top: 5px;


    .sortWrapper {
      position: relative;
      margin-top: 16px;
    }

    .sortSwiper {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      >div {
        flex: 0 0 100%;
        scroll-snap-align: start;
      }
    }

    .sortPagination {
      display: flex;
      justify-content: center;
      gap: 2px;
      margin-top: 6px;

      .paginationDot {
        width: 8px;
        height: 4px;
        border-radius: 4px;
        background-color: #CCCCCC;
        cursor: pointer;
        transition: all 0.3s;

        &.active {
          background-color: #f57512;
          width: 20px;
          border-radius: 4px;
        }
      }
    }

    .sortTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      //width: 87%;
      margin: auto;

      .iconBox {
        width: 50px;
        width: 74%;
        margin: auto;
      }

      .sortText {
        text-align: center;
        font-size: 12px;
        font-weight: bold;
      }
    }

    .sortCenter {
      display: grid;
      /* ✅ 强制一行5个，永远平分宽度 */
      grid-template-columns: repeat(5, 1fr);
      /* ✅ 强制两行的高度，即使没有数据，也占用两行的空间 */
      grid-template-rows: repeat(2, 1fr);
      /* ✅ 让内容垂直居中，不贴顶 */
      align-items: center;
      /* ✅ 让每个格子的图标水平居中 */
      justify-items: center;
      /* 上下间距 */
      row-gap: 10px;
      color: #212226;
      width: 100%;
      /* ✅ 确保容器撑开两行的高度 */
      min-height: 120px;
      /* 你可以根据实际图标高度微调这个值 */

      .sortItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 防止文字换行 */
        white-space: nowrap;
      }

      .iconImg {
        width: 38px;
        margin: auto;
      }
    }
  }

 

  .flexBox {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 7px;

    .toHome {
      width: 50%;
      position: relative;
    }

    .titleBox {
      position: absolute;
      top: 11px;
      left: 10px;

      .title {
        font-weight: bold;
        font-size: 18px;
      }

      .text {
        font-size: 12px;
        color: #675f61;
        padding-top: 2px;
      }
    }

    .newShop {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .newShopText {
      border-radius: 30px;
      background-image: linear-gradient(to bottom, #FE0D50, #FE6E21, #FEBE90);
      color: white;
      font-size: 12px;
      padding: 3px;
      border-bottom-left-radius: 0px;
    }

    .goRight {
      transform: rotate(90deg);
      padding-top: 1px;
      font-size: 8px;
    }

    .once {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 20px;
      left: 10px;
      gap: 2px;
      font-size: 12px;
      border-radius: 30px;
      padding: 1px 5px 2px 6px;
      border: 1px solid;
    }
  }
}

.imgTitle {
  border-radius: 10px;
}

.plus {
  color: white;
  background-color: #CA403E;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  font-size: 12px;
  text-align: center;
  line-height: 13px;
  padding: 1px;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.price {
  color: #CA4240;
  font-size: 13px;
  white-space: nowrap;
}

.price span {
  font-size: 15px;
}

.tabbar {
  // background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 3px 15px;
  margin-top: 5px;
  position: relative;

  .tabbarBox {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
  }

  .tabItem {
    width: 100%;
  }

  .tabTop {
    //font-weight: bold;
    text-align: center;
    font-size: 15px;
  }

  .tabBottom {
    font-size: 12px;
    color: #A8A8A8;
    text-align: center;
    padding-top: 2px;
  }

  .tabTop2 {
    position: relative;

    color: #000000;
    font-weight: bold;

    .lines {
      width: 60px;
      height: 4px;
      position: absolute;
      bottom: -3px;
      left: 6px;
      border-radius: 5px;

      display: inline-block;
      background: linear-gradient(90deg, #FF627C 0%, #FD9349 100%);
    }
  }

  .tabBottom2 {
    padding: 2px 0px;
    width: 85%;
    margin: auto;
    margin-top: 2px;
    background-color: #3EA5FF;
    color: #F1F8FF;
    border-radius: 30px;
    font-size: 13px;
  }
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 100%;
  background-color: #ffffff;
}


.listMax {
  padding: 0px 10px;
  padding-bottom: 10px;

  .bannerBox {
    width: 48%;
    margin-top: 10px;
  }

  .listBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    //gap: 6px;
    width: 100%;
    align-items: flex-start;
  }

  .listItem {
    width: 48.9%;
    background-color: white;
    border-radius: 10px;
  }
}

.shopImg {
  border-bottom-right-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}

.imgMax {
  width: 100%;
  //height: 103px;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  border-radius: 10px;
  height: 51px;
}

.imgMax2 {
  //height: 164px;
}

//.van-swipe {
//  border-radius: 10px;
//}

.shopList {
  width: 48.9%;
  //width: 100%;
  margin-top: 10px;
}

.listBox2 {
  margin-top: -39px;
}

.imgBox {
  width: 80%;
  margin: auto;
}

.leftBox {
  display: flex;
  justify-content: space-between;
  //gap: 10px;
  margin-top: -10px;
}

.bannerImg {
  width: 100%;

}

.tabbar::-webkit-scrollbar {
  display: none
}

.sortScroll {
  overflow-x: auto;
  overflow-y: hidden;
}

.sortScroll::-webkit-scrollbar {
  display: none
}

.fixedHeight {
  padding-top: 50px;
}

.isTab {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.model {
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 50px;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}

/deep/.van-notice-bar {
  border-radius: 6px;
}

.bannerDw {
  padding: 5px 10px 0px;
}

// ffadd
.imageSlider {

  padding: 10px 0;

  .sliderContainer {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;

    .sliderItem {
      flex: 0 0 calc((100% - 30px) / 3.5);
      /* 显示3.5个 */
      scroll-snap-align: start;

      .sliderImg {
        width: 100%;
        border-radius: 8px;
        display: block;
      }
    }
  }
}

//end1
.brandSection {
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;

  .brandTitle {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 6px;
    display: flex;
    color: #000000;
    justify-content: space-between;
    align-items: center;
  }

  .brandList {
    display: flex;
    justify-content: space-between;
    gap: 10px;


    .brandItem {
      flex: 1;
      text-align: center;

      .brandImg {
        width: 100%;
        border-radius: 10px;
        box-shadow: 2px 2px 7px #e1dddd;
      }

      .brandName {
        font-size: 12px;
        margin-top: 5px;
        color: #666;
      }
    }
  }

  .scrollPicSection {
    // margin-bottom: 20px;
    margin-top: 10px;

    .sectionTitle {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .picScroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;

      /* 隐藏滚动条 */
      &::-webkit-scrollbar {
        display: none;
      }

      scrollbar-width: none;

      .picItem {
        display: flex;
        align-items: center;
        background-color: #F3F5FB;
        border-radius: 4px;
        padding: 4px 8px;
        //  flex: 0 0 3%;
        flex: 0 0 auto;
        /* ✅ 关键：防止压缩 */
        min-width: 60px;
        /* ✅ 设置最小宽度，确保可以滚动 */
        white-space: nowrap;

        /* ✅ 防止文字换行 */
        /* 控制显示大小 */
        span {
          font-size: 12px;
          display: inline-block;
          padding-left: 8px;
        }

        .scrollPic {
          width: 18px;
          height: 18px;
          border-radius: 8px;
          display: block;

        }
      }
    }
  }
}

//denc2

.product-row {
  display: flex;
  gap: 10px;
  max-width: 100%;

  grid-template-columns: 1fr 1fr; // 两列等宽
}

.product-card {

  min-width: 0;

  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px 10px 4px 10px;

  overflow: hidden;
}

.product-card1 {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 4px;
}

.card-header img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.card-header .title {
  font-size: 15px;
  font-weight: bold;
  white-space: nowrap;
}

.card-header .sub {
  color: #b9b9b9;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.product-list {
  display: flex;
  gap: 8px;
}

.product-item {
  flex: 1;
  min-width: 0;
}

.product-img {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  display: block;
}

.tag-row {
  display: flex;
  align-items: end;
  gap: 4px;
  line-height: 13px;
  margin-bottom: 4px;
  // flex-wrap: wrap;
}

.tag-row1 {
  text-align: center;
  margin-bottom: 4px;
  line-height: 13px;
  // flex-wrap: wrap;
}

.tag-row .badge {
  background-color: #FD3631;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 3px 0px 3px;
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
}

.tag-row .name,
.tag-row1 .name {
  font-size: 12px;
  /* 关键：强制一行，超出隐藏，带省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 加上固定宽度，防止撑破 */
  width: 100%;
  display: block;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
}

.price-info {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 2px;
}

.price-row .symbol {
  font-size: 10px;
  color: #FD3631;
  font-weight: bold;
}

.price-row .current {
  font-size: 12px;
  color: #ed2e33;
  font-weight: bold;
}

.price-row .original {
  font-size: 10px;
  color: #707070;
  text-decoration: line-through;

}

.price-row .btn-add {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #FF6B6C 0%, #FF7D2C 100%);
  color: #ffffff;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

/* 响应式设计 */
@media screen and (max-width: 480px) {
  body {
    padding: 10px;
  }

  .product-card1 {
    padding: 0px;
  }

  .card-header .title {
    font-size: 15px;
    font-weight: bold;
    color: #38393b;
  }

  .card-header .sub {
    font-size: 12px;
  }

  .tag-row .name {
    font-size: 12px;
  }

  .price-row .current {
    font-size: 12px;
  }
}

@media screen and (max-width: 360px) {
  .product-row {
    grid-template-columns: 1fr 1fr; // 保持两列
    gap: 6px; // 小屏幕减小间距
  }

  .product-card {
    padding: 8px; // 小屏幕减小内边距
  }
}

/* ================= 自定义搜索框 (仿截图样式) ================= */
.custom-search-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  /* 浅蓝色胶囊背景 */
  border-radius: 30px;
  /* 较大的圆角 */
  padding: 6px 4px 6px 12px;
  width: 100%;
  height: 34px;
  box-sizing: border-box;

  .search-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #333;
    height: 100%;

    &::placeholder {
      color: #999;
    }
  }

  .custom-search-btn {
    background: linear-gradient(90deg, #FF6B6B 0%, #FF7D2C 100%);
    /* 橙红渐变按钮 */
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    height: 100%;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    // line-height: 1;
  }



}


// 瀑布流样式
.waterfall-container {
  display: flex;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0px;
}

.waterfall-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bannerBox {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;

  .van-swipe {
    border-radius: 10px;
  }

  .bannerImg {
    width: 100%;

    .img {
      width: 100%;
      display: block;
    }
  }
}

.shop-item {
  width: 100%;
}

.product-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.product-img-box {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #ffffff;

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 8px 8px 0 0 !important;
  }

  .img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 14px;
  }
}

.product-info {
  padding: 10px 10px 8px 10px;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.product-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price-row {
  margin-top: 4px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.sell-price {
  color: #ed2e33;
  font-size: 16px;
  font-weight: bold;

  &::before {
    content: '￥';
    font-size: 10px;
  }
}

.market-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-sales {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.listMax {
  padding-bottom: 10px;
}
</style>