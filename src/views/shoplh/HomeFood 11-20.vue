<template>
  <div>
    <div class="exchange-wrap">

      <!-- 1. 顶部搜索框 + 地区检索 -->
      <div class="search-header">
        <div class="search-area" style="display: flex; align-items: center; gap: 8px;">
          <!-- 地区检索按钮 -->
          <div class="area-btn" @click="goToCityList"
            style="background: #f5f5f5; border-radius: 20px; padding: 6px 12px; font-size: 13px; white-space: nowrap;">
            {{ searchCity || '选择地区' }} <van-icon name="arrow-down" size="12" />
          </div>

          <!-- 搜索框 -->
          <div class="search-box"
            style="flex: 1; display: flex; align-items: center; background: #f5f5f5; border-radius: 20px; padding: 6px 12px;">
            <van-icon name="search" class="search-icon" style="margin-right: 6px; color: #999;" />
            <input type="text" v-model="searchKeyword" placeholder="输入门店名称" class="search-input" @keyup.enter="onSearch"
              style="border: none; background: transparent; outline: none; font-size: 14px; flex: 1;" />
          </div>
        </div>
      </div>

      <!-- 2. 品牌区域 -->
      <div class="brand-section">
        <!-- 2.1 横滑区域 -->
        <div class="brand-scroll-wrap">
          <div class="brand-item" v-for="(brand, index) in exchangeBrands" :key="brand.id" :id="'brand-' + brand.id"
            :class="{ active: currentBrandId === brand.id }" :style="{ backgroundImage: getBrandGradient(index) }"
            @click="selectBrand(brand, brand.id)">
            <div class="brand-inner">
              <img :src="brand.logo || brand.img" alt="" class="brand-logo">
              <div class="brand-name">{{ brand.name || brand.title }}</div>
            </div>
          </div>

          <!-- 右侧固定的"全部"按钮 -->
          <div class="brand-all-btn" :class="{ active: showAllBrands || !currentBrandId }" @click="toggleAllBrands">
            全部 <van-icon :name="showAllBrands ? 'arrow-up' : 'arrow-down'" />
          </div>
        </div>

        <!-- 2.2 全部品牌面板 -->
        <div class="all-brand-panel" v-show="showAllBrands">
          <div @click="clearBrandAndLoadAll"
            style="font-weight: bold; font-size: 14px; text-align: center; padding-bottom: 10px; cursor: pointer;">
            全部品牌
          </div>
          <div class="all-brand-grid">
            <div class="grid-brand" v-for="brand in exchangeBrands" :key="'all-' + brand.id"
              @click="selectBrand(brand, brand.id)">
              <img :src="brand.logo || brand.img" alt="">
              <div class="grid-brand-name">{{ brand.name || brand.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 门店列表 -->
      <div class="shop-list">
        <!-- 状态 1：加载中 -->
        <div v-if="isShopLoading && !isLoadMore" style="text-align: center; color: #999; padding: 40px 0;">
          <van-loading size="24" vertical style="margin: auto;">正在加载...</van-loading>
        </div>

        <!-- 状态 2：无数据 -->
        <div v-else-if="!isShopLoading && exchangeShopList.length === 0"
          style="text-align: center; font-size: 12px; color: #999; padding: 40px 0;">
          <p>没有找到相关门店</p>
        </div>

        <!-- 状态 3：有数据 -->
        <template v-else>
          <div class="shop-card" v-for="(item, index) in exchangeShopList" :key="item.id || index" v-if="item.brand">
            <div class="shop-logo">
              <img :src="item.brand.logo || item.logo || logoImg" alt="">
            </div>
            <div class="shop-info">
              <div class="shop-title-row">
                <div class="shop-name">{{ item.name }}</div>
                <div class="shop-distance" v-if="item.distance != null && item.distance !== ''">
                  距您约 {{
                    Number(item.distance) >= 1000
                      ? (Number(item.distance) / 1000).toFixed(2) + 'km'
                      : Number(item.distance).toFixed(0) + 'm'
                  }}
                </div>
              </div>
              <div class="shop-address"><van-icon name="location-o" /> {{ item.address }}</div>
              <div class="shop-tags">
                <span class="tag">到店兑换</span>
              </div>
              <div style="text-align: right;">
                <span @click="openMap(item)" class="shop-btn1">
                  <img src="../../assets/dh.png"
                    style="padding-right: 2px; position: relative;top: 2px; width: 13px;height: 13px;" alt="">去这里
                </span>
                <span class="shop-btn" @click="goExchange(item)">去兑换</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 状态 4：上拉加载更多 -->
        <div v-if="isLoadMore" style="text-align: center; color: #999; padding: 10px 0; font-size: 12px;">
          <van-loading size="16"
            style="display: inline-block; vertical-align: middle; margin-right: 4px;">加载中...</van-loading>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getWxLocation } from '@/utils/wxLocation'
  import {   getBrandList, getStoreList } from '@/api/lehuicake'

export default {
  name: "TmallTodaySuperLow",
  data() {
    return {
      cake: 0,
      // 搜索 & 城市
      searchCity: sessionStorage.getItem('cityName') || '',
      searchKeyword: "",
      logoImg: '',
    

      // 分页 & 加载状态
      shopPageNo: 1,
      isShopLoading: false,
      isLoadMore: false,
      isFetching: false,
      isScroll: false,

      // 品牌
      showAllBrands: false,
      currentBrandId: 0,
      exchangeBrands: [],
      isInitExchangeRunning: false,

      // 门店列表
      exchangeShopList: [],
    }
  },
  methods: {
    /* ============ 地图跳转 ============ */
    openMap(item) {
      const url = `https://uri.amap.com/marker?position=${item.lng},${item.lat}&name=${item.name}`;
      window.location.href = url;
    },

    /* ============ WGS84 -> GCJ02 坐标转换 ============ */
    transformToGCJ02(lng, lat) {
      const PI = 3.1415926535897932384626;
      const a = 6378245.0;
      const ee = 0.00669342162296594323;

      const outOfChina = (lng, lat) => (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271);
      const transformLat = (x, y) => {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
        return ret;
      };
      const transformLng = (x, y) => {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
      };

      if (outOfChina(lng, lat)) return [lng, lat];

      let dLat = transformLat(lng - 105.0, lat - 35.0);
      let dLng = transformLng(lng - 105.0, lat - 35.0);
      const radLat = lat / 180.0 * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      const sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
      dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
      return [lng + dLng, lat + dLat];
    },

    /* ============ 城市选择 ============ */
    goToCityList() {
      this.$router.push({
        path: '/cakeCityList',
        query: { from: 'orderfood' }
      });
    },

    /* ============ 品牌渐变底色 ============ */
    getBrandGradient(index) {
      const gradients = [
        'linear-gradient(to bottom, #E45FB9, #F1608A, #FB6768)',
        'linear-gradient(to bottom, #F8E59B, #FAC67D, #FD9C59)',
        'linear-gradient(to bottom, #A9D8E6, #73A5EC, #5582F2)',
        'linear-gradient(to bottom, #FFD5B3, #F793BA, #F05CC3)',
      ]
      return gradients[index % 4]
    },

    /* ============ 两点距离（米） ============ */
    getDistance(lat1, lng1, lat2, lng2) {
      if (!lat1 || !lng1 || !lat2 || !lng2) return null;
      const radLat1 = lat1 * Math.PI / 180.0;
      const radLat2 = lat2 * Math.PI / 180.0;
      const a = radLat1 - radLat2;
      const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378137.0;
      s = Math.round(s * 10000) / 10000;
      return Math.round(s);
    },

    /* ============ 品牌选中后滚动居中 ============ */
    scrollToActiveBrand(brandId) {
      if (!brandId) return;
      this.$nextTick(() => {
        const container = document.querySelector('.brand-scroll-wrap');
        const target = document.getElementById('brand-' + brandId);
        if (container && target) {
          const offsetLeft = target.offsetLeft;
          container.scrollTo({
            left: offsetLeft - 100,
            behavior: 'smooth'
          });
        }
      });
    },

    /* ============ 初始化随心兑数据 ============ */
    initExchangeData() {
      if (!this.exchangeBrands || this.exchangeBrands.length === 0) return;

      this.isInitExchangeRunning = true;

      // 处理 URL 里的 brandId
      const urlBrandId = this.$route.query.brandId;
      let cleanBrandId = '';
      if (urlBrandId) {
        if (typeof urlBrandId === 'string') {
          cleanBrandId = urlBrandId.split('brandId=')[0];
        } else if (typeof urlBrandId === 'object' && urlBrandId[0]) {
          cleanBrandId = urlBrandId[0].split('brandId=')[0];
        }
      }

      if (cleanBrandId) {
        this.currentBrandId = cleanBrandId;
        const currentBrandObj = this.exchangeBrands.find(b => b.id == this.currentBrandId || b.brand_id == this.currentBrandId);
        if (currentBrandObj) this.logoImg = currentBrandObj.logo;
        this.scrollToActiveBrand(this.currentBrandId);
      } else {
        this.currentBrandId = '';
        this.logoImg = '';
      }

      // 清洗城市名
      let rawCity = sessionStorage.getItem('cityName') || '';
      let cleanCity = rawCity.replace(/\d+/g, '');
      if (cleanCity) sessionStorage.setItem('cityName', cleanCity);
      this.searchCity = cleanCity || '北京市';

      // 重置列表
      this.exchangeShopList = [];
      this.shopPageNo = 1;
      this.isFetching = false;
      this.isScroll = false;
      this.isShopLoading = true;

      const userLat = sessionStorage.getItem('latitude');
      const userLng = sessionStorage.getItem('longitude');

      // 有缓存直接查
      if (userLat && userLng) {
        this.fetchExchangeShopList(this.currentBrandId, this.searchKeyword, false, userLat, userLng);
        this.isInitExchangeRunning = false;
        return;
      }

      // 无缓存获取定位
      getWxLocation()
        .then(loc => {
          const [gcjLng, gcjLat] = this.transformToGCJ02(Number(loc.longitude), Number(loc.latitude));
          sessionStorage.setItem('latitude', gcjLat);
          sessionStorage.setItem('longitude', gcjLng);

          if (loc.city) {
            let locCityClean = loc.city.replace(/\d+/g, '');
            if (!this.$route.query.from) {
              sessionStorage.setItem('cityName', locCityClean);
              this.searchCity = locCityClean;
            }
          }
          this.fetchExchangeShopList(this.currentBrandId, this.searchKeyword, false, gcjLat, gcjLng);
        })
        .catch(() => {
          const defaultLat = 39.908;
          const defaultLng = 116.397;
          sessionStorage.setItem('latitude', defaultLat);
          sessionStorage.setItem('longitude', defaultLng);
          this.fetchExchangeShopList(this.currentBrandId, this.searchKeyword, false, defaultLat, defaultLng);
        })
        .finally(() => {
          this.isInitExchangeRunning = false;
        });
    },

    /* ============ 拉取品牌数据 ============ */
    brandnews() {
      return getBrandList().then(res => {
        if (res.code == 200 && res.data) {
          const rawCity = sessionStorage.getItem('cityName') || '';
          const city = rawCity.replace(/\d+/g, '');
          const isBeijing = ['北京', '北京市'].includes(city);

          const beijingAllowList = [
            '味多美', '元祖食品', '金凤成祥', '小丽都', '巴黎贝甜',
            '龙山村', '姆们', '泸溪河', '北京池田', 'DQ',
            '老莫西饼', '西村叔叔的店', '三宝乐', '𫖰客烘焙', 'FALANC CAKE',
            '爸爸糖', '小咖咖啡','㞭客烘焙', 'cococean', '百果园', '茉莉奶白',
            '爷爷不泡茶', '周黑鸭', '北京来伊份', '正本原', '喜士蛋糕',
            '顶风针蛋糕', '明明烘焙', '夏埠村', '唐饼家', '五度蛋糕',
            '牛仕西饼屋'
          ];

          let list = res.data;

          if (isBeijing) {
            list = list.filter(item => beijingAllowList.includes(item.name));
          }

          this.exchangeBrands = list.map(item => ({
            id: item.brand_id,
            name: item.name,
            logo: item.logo
          }));

          if (this.exchangeBrands.length > 0) {
            this.logoImg = this.exchangeBrands[0].logo;
          }

          // 拉取门店
          this.initExchangeData();
        }
      });
    },

    /* ============ 校验随心兑入口 ============ */


    /* ============ 全部品牌切换 ============ */
    toggleAllBrands() {
      this.showAllBrands = !this.showAllBrands;
    },

    /* ============ 选择品牌 ============ */
    selectBrand(val, id) {
      let targetId = id;
      if (val && val.id) {
        targetId = val.id;
      }

      this.logoImg = val.logo;
      this.currentBrandId = targetId;
      this.showAllBrands = false;
      this.searchKeyword = "";

      window.scrollTo(0, 0);
      this.isScroll = false;
      this.isFetching = false;
      this.shopPageNo = 1;

      const lat = sessionStorage.getItem('latitude') || '';
      const lng = sessionStorage.getItem('longitude') || '';

      this.fetchExchangeShopList(targetId, this.searchKeyword, false, lat, lng);
    },

    /* ============ 清空品牌，加载全部 ============ */
    clearBrandAndLoadAll() {
      this.showAllBrands = false;
      this.currentBrandId = '';
      this.logoImg = '';
      this.searchKeyword = "";

      window.scrollTo(0, 0);
      this.isScroll = false;

      const lat = sessionStorage.getItem('latitude') || '';
      const lng = sessionStorage.getItem('longitude') || '';

      this.fetchExchangeShopList('', this.searchKeyword, false, lat, lng);
    },

    /* ============ 去兑换 ============ */
    goExchange(item) {
      const brandIds = item.brand && item.brand.brand_id ? item.brand.brand_id : '';
      const brandLogo = item.brand && item.brand.logo ? item.brand.logo : '';
      const brandName = item.brandName || (item.brand ? item.brand.name : '好利来');

      this.$router.push({
        path: '/GetpayqrCode',
        query: {
          brandIds,
          brandLogo,
          brandId: item.id,
          shopId: item.shopId,
          brandName,
          shopName: item.name,
          address: item.address,
          distance: item.distance
        }
      })
    },

    /* ============ 搜索 ============ */
    onSearch() {
      const lat = sessionStorage.getItem('latitude') || '';
      const lng = sessionStorage.getItem('longitude') || '';
      this.fetchExchangeShopList(this.currentBrandId, this.searchKeyword, false, lat, lng);
    },

    /* ============ 拉取门店列表 ============ */
    fetchExchangeShopList(brandId = '', keyword = '', append = false, lat = '', lng = '') {
      if (!append) {
        this.isFetching = false;
        this.shopPageNo = 1;
        this.exchangeShopList = [];
        this.isScroll = false;
        this.isShopLoading = true;
      }

      if (this.isFetching) return;
      this.isFetching = true;

      if (append) {
        this.isLoadMore = true;
      }

      const finalLat = lat || sessionStorage.getItem('latitude') || 39.908;
      const finalLng = lng || sessionStorage.getItem('longitude') || 116.397;
      const finalCity = (sessionStorage.getItem('cityName') || '').replace(/\d+/g, '') || '北京市';

      const params = {
        pageNo: this.shopPageNo,
        pageSize: 10,
        brandId: brandId || '',
        shopName: keyword || '',
        latitude: finalLat,
        longitude: finalLng,
        city: finalCity,
      };

      getStoreList(params).then(res => {
        if (res.code == 200 && res.data) {
          let rows = res.data.rows || [];
          const originalLength = rows.length;

          rows = rows.filter(item => {
            if (!item.brand || !item.brand.logo) return false;
            if (!brandId) {
              const isBrandValid = this.exchangeBrands.some(b => b.id == item.brand.brand_id);
              if (!isBrandValid) return false;
            }
            return true;
          }).map(item => {
            item.logo = item.brand.logo;
            return item;
          });

          const userLat = Number(finalLat);
          const userLng = Number(finalLng);

          rows.forEach(item => {
            if (!item.distance && item.lat && item.lng) {
              item.distance = this.getDistance(userLat, userLng, Number(item.lat), Number(item.lng));
            }
          });

          if (originalLength < 10) {
            this.isScroll = true;
          }

          if (append) {
            this.exchangeShopList = this.exchangeShopList.concat(rows);
          } else {
            this.exchangeShopList = rows;
          }
        } else {
          if (!append) this.exchangeShopList = [];
          this.isScroll = true;
        }
      }).catch(() => {
        if (!append) this.exchangeShopList = [];
        this.$toast('获取门店列表失败');
      }).finally(() => {
        this.isFetching = false;
        this.isShopLoading = false;
        this.isLoadMore = false;
      });
    },

    /* ============ 滚动加载 ============ */
    handleScroll() {
      if (this.scrollTimer) return;
      this.scrollTimer = setTimeout(() => {
        this.scrollTimer = null;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 150) {
          this.onMost();
        }
      }, 200);
    },

    onMost() {
      if (this.isFetching || this.isScroll) return;
      if (this.exchangeShopList.length === 0 && this.shopPageNo > 1) return;

      this.shopPageNo++;
      const lat = sessionStorage.getItem('latitude') || '';
      const lng = sessionStorage.getItem('longitude') || '';
      this.fetchExchangeShopList(this.currentBrandId, this.searchKeyword, true, lat, lng);
    },
  },
  created() {
    if (sessionStorage.getItem("cake")) {
      this.cake = sessionStorage.getItem("cake");
    }
  },
  mounted() {
     
    this.brandnews();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>

<style scoped lang="less">
/* 随心兑模块样式 */
.exchange-wrap {
  background: #f0f0f0;
  min-height: 100vh;
  position: relative;
  padding-bottom: 20px;
}

/* 顶部搜索 */
.search-header {
  padding: 10px 15px;
  background: #fff;

  .search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 6px 12px;

    .search-icon {
      color: #999;
      font-size: 16px;
      margin-right: 6px;
    }

    .search-input {
      border: none;
      background: transparent;
      flex: 1;
      outline: none;
      font-size: 14px;
    }
  }
}

/* 品牌区域包裹层 */
.brand-section {
  position: relative;
  background: #fff;
}

/* 品牌横滑 */
.brand-scroll-wrap {
  display: flex;
  overflow-x: auto;
  padding: 10px 15px;
  gap: 15px;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-right: 60px;

  &::-webkit-scrollbar {
    display: none;
  }

  .brand-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    border-radius: 10px;
    padding: 3px;
    width: 62px;
    box-sizing: border-box;
    background-color: transparent;

    .brand-inner {
      border-radius: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 0 3px;
      box-sizing: border-box;
    }

    .brand-logo {
      width: 46px;
      height: 46px;
      border-radius: 8px;
      object-fit: contain;
      margin-bottom: 3px;
    }

    .brand-name {
      font-size: 11px;
      color: #ffffff;
      text-align: center;
      width: 100%;
      padding: 0 2px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.active {
      .brand-name {
        color: #ffffff;
      }
      .brand-inner {
        box-shadow: 0 0 0 2px #ffffff inset;
      }
    }
  }
}

/* 右侧悬浮的"全部"按钮 */
.brand-all-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), #fff 40%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #333;
  z-index: 10;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  .van-icon {
    margin-left: 2px;
    font-size: 12px;
  }

  &.active {
    color: #F99E9B;
    font-weight: bold;
  }
}

/* 在当前页面展开的面板 */
.all-brand-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 99;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 10px 10px;

  .all-brand-grid {
    display: flex;
    flex-wrap: wrap;
    row-gap: 15px;
    max-height: 50vh;
    overflow-y: auto;

    .grid-brand {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        border: 1px solid #eee;
        object-fit: contain;
        margin-bottom: 5px;
      }

      .grid-brand-name {
        font-size: 13px;
        color: #333;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

/* 底部列表 */
.shop-list {
  padding: 10px;

  .shop-card {
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .shop-logo {
      width: 76px;
      height: 76px;
      margin-right: 12px;

      img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .shop-info {
      flex: 1;
      min-width: 0;

      .shop-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .shop-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shop-distance {
          font-size: 12px;
          color: #999;
        }
      }

      .shop-address {
        font-size: 12px;
        color: #666;
        margin-top: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .shop-tags {
        margin-top: 2px;

        .tag {
          font-size: 10px;
          color: #FF7D2C;
          border: 1px solid #FF7D2C;
          background-color: #FEECDB;
          padding: 2px 5px;
          border-radius: 4px;
        }
      }
    }

    .shop-btn {
      margin-left: 10px;
      display: inline-block;
      background: #3FA6FF;
      color: #fff;
      font-size: 12px;
      padding: 4px 16px;
      border-radius: 15px;
    }

    .shop-btn1 {
      background: #e6e6e6;
      color: #4b4b4b;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 15px;
    }
  }
}
</style>

<style>
.shop-address .van-icon {
  color: #EB6A73;
  position: relative;
  top: 2px;
  font-weight: bold;
}
</style>