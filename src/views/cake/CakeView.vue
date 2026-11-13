<template>
  <div class="location">
    <!-- 头部：城市 / 搜索 / 客服 -->
    <div class="topBox" ref="topBox">
      <div class="topPage">
        <div class="searchBox">
          <div class="city-wrapper">
            <City :type="1" @getCityId="getCityId"></City>
          </div>
          <div class="searchValue" v-if="!isCityId">
            <van-search background="#fff0" placeholder="搜索你想要的商品" v-model="searchValue" @search="handleSearch"
              @clear="handleSearch" />
          </div>
          <div class="customer" @click="tokf">
            <img class="img" src="@/assets/kf1.png" alt="">
          </div>
        </div>
      </div>
    </div>


    <!-- 顶部 Banner (nav 数据) -->
    <div class="banner-box" v-if="navList.length > 0">
      <van-swipe :autoplay="3000" indicator-color="#fff">
        <van-swipe-item v-for="item in navList" :key="item.id" >
          <img :src="item.img" alt="" class="banner-img">
        </van-swipe-item>
      </van-swipe>
    </div>
<!-- @click="handleNavClick(item)" -->
    <!-- 大牌蛋糕 (brand 数据) -->
    <div class="cakeBrand cakeBrand2" v-if="brandList.length > 0" @click="toOtherNext('/birthdayCake')">
      <div class="brandtitleBox">
        <div class="title"></div>
        <div class="seeAll" >
          <!-- 严选原料，一口就是甜蜜享受 -->
        </div>
      </div>
      <div class="cakeBoxImg">
        <div class="imgMax2" v-for="brand in brandList" :key="brand.id" @click.stop="toBrandDetail(brand)">
          <div class="imgMax">
            <img :src="brand.image_path" alt="" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <!-- <div class="brand-name">{{ brand.name }}</div> -->
        </div>
      </div>
    </div>

    <!-- 电子券分类 (coupons_list 数据) -->
    <div class="cakeBrand cakeBrand1" style="margin-top: 10px;" v-if="couponsList.length > 0" @click="toOtherNext('/orderfood')"> 
      <div class="brandtitleBox">
        <div class="title"></div>
        <div class="seeAll" >
          <!-- 严选原料，每一口都是甜蜜享受 -->
        </div>
      </div>
      <div class="coupons-grid">
        <div class="coupon-item" v-for="coupon in couponsList" :key="coupon.id"
          :style="{ backgroundColor: coupon.yanse || '#F5F5F5' }" @click.stop="toCouponDetail(coupon)">
          <img :src="coupon.img" alt="">
          <!-- <div class="coupon-title">{{ coupon.title }}</div> -->
        </div>
      </div>
    </div>

    <!-- 更多推荐 / 商品列表 -->
    <div class="listBox">
      <!-- 列表标题与排序筛选 (吸顶) -->
      <!-- <div class="list-header" :class="{ 'is-fixed': show }">
        <div class="list-title">更多推荐</div>
        <div class="filter-bar">
          <div class="filter-item" :class="{ active: currentType === 1 }" @click="changeSort(1)">综合推荐</div>
          <div class="filter-item" :class="{ active: currentType === 2 }" @click="changeSort(2)">销量</div>
          <div class="filter-item" :class="{ active: currentType === 4 || currentType === 5 }" @click="changeSort(currentType === 4 ? 5 : 4)">
            价格 <van-icon :name="currentType === 5 ? 'arrow-up' : 'arrow-down'" size="10" />
          </div>
        </div>
      </div> -->

      <div style="text-align: center;">

        <img src="../../assets/dangao/bg22.png" style="width: 100%;margin: auto; position: relative;top: -30px;" alt=""
          v-if="couponsList.length > 0">
        <img src="../../assets/dangao/bg3.png" style="width: 150px;margin: auto;padding-bottom: 10px;" alt="">

      </div>
      <!-- 商品网格 -->
      <div class="product-grid">
        <div class="product-item" v-for="item in productList" :key="item.id" @click="toProductDetail(item)">
          <div class="img-box">
            <img :src="item.image_path" alt="" loading="lazy">
          </div>
          <div class="info-box">
            <div class="name">{{ item.title }}</div>
            <div class="brand">{{ item.brand_name }}</div>
            <div class="bottom">
              <div class="price"><span>¥</span>{{ item.price }}</div>
              <div class="tag" v-if="item.label_name">{{ item.label_name.split(',')[0] }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <loading style="margin-top: 10px" v-if="isLoading"></loading>
      <div v-if="!isLoading && isScroll && productList.length > 0" class="no-more">没有更多了~</div>
      <div v-if="!isLoading && isScroll && productList.length === 0" class="no-more">暂无相关商品</div>
    </div>
  </div>
</template>

<script>
import { getCakeIndex, getCakeBirthday } from "@/api/lehuicake";
import City from "@/components/Citycake.vue";

export default {
  name: "IndexView",
  components: { City },
  data() {
    return {
      currentCityId: '',
      searchValue: "",
      show: false,
      isLoading: false,
      loadingflag: true,
      pageno: 1,
      isScroll: false,
      currentType: 1,

      navList: [],       // Banner 列表
      brandList: [],     // 大牌蛋糕
      couponsList: [],   // 电子券
      noticeText: "",    // 公告文本
      productList: [],   // 商品列表

      isCityId: true,
      kefu: "",
      cid: "",
      reqSeq: 0
    }
  },
  watch: {
    searchValue() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.doSearch();
      }, 400);
    }
  },
  methods: {
    // ✅ 新增方法
    checkAndReloadCity() {
      const cacheCityId = sessionStorage.getItem("cityId");
      if (cacheCityId && cacheCityId !== this.currentCityId) {
        this.currentCityId = cacheCityId;
        this.cid = cacheCityId;
        localStorage.setItem("cid", cacheCityId);
        this.pageno = 1;
        this.isScroll = false;
        this.productList = [];
        this.getCakeIndexList();   // 重新拉首页数据
      }
    },
    doSearch() {
      clearTimeout(this.searchTimer);   // 回车/清空时干掉防抖定时器，避免二次触发
      this.pageno = 1;
      this.isScroll = false;
      this.productList = [];
      this.getCakeProduct(1);
    },

    // ✅ 回车 / 点清空 都走这里
    handleSearch() {
      this.doSearch();
    },

    tokf() {
      window.location.href = this.kefu || 'javascript:;'
    },
    toOtherNext(path) {
      // this.$router.push(path)
      this.$router.push({ path, query: { cid: this.cid } })
    },
    // 点击大牌跳转
    toBrandDetail(brand) {
      this.$router.push({ path: '/birthdayCake', query: { brand_id: brand.brand_id, cid: this.cid } })
    },
    // 点击电子券跳转
    toCouponDetail(coupon) {
      // this.$router.push({ path: '/orderfood', query: { id: coupon.id, cid: this.cid } })
      this.$router.push({path: "/brandCouPon", query: {id: coupon.id}})
    },
    // 点击商品跳转
    toProductDetail(item) {
      this.$router.push({ path: '/CakeproductDetail', query: { id: item.id, cid: this.cid } })
    },
    // 点击 Banner 跳转 (处理接口返回的 url)
    handleNavClick(nav) {
      if (!nav.url || nav.url === '#' || nav.url === '1') return;
      // 如果是完整链接，可以使用 window.location.href 或提取出路由
      if (nav.url.startsWith('http')) {
        window.location.href = nav.url;
      } else {
        this.$router.push(nav.url);
      }
    },

    // 1. 获取首页基础数据
    getCakeIndexList() {
      this.loadingflag = true;
      getCakeIndex(this.cid).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          const data = res.data;
          // 数据映射
          this.navList = data.nav || [];
          this.brandList = (data.brand || []).slice(0, 8); // 最多展示8个
          this.couponsList = data.coupons_list || [];
          this.noticeText = data.gonggao ? data.gonggao.gonggao : '';

          this.isCityId = false
          // 获取完基础数据后加载商品
          this.getCakeProduct(1)
        }
      }).catch(() => { this.loadingflag = false })
    },

    // 2. 获取商品列表
    getCakeProduct(pageno = 1) {
      if (this.isLoading) return;
      this.isLoading = true;

      getCakeBirthday({ keyword: this.searchValue, cid: this.cid, type: this.currentType, page: pageno, limit: 10 }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          const list = res.data.data || []
          if (list.length === 0) {
            this.isScroll = true
            return
          }
          this.productList = pageno === 1 ? list : [...this.productList, ...list]
        }
      }).catch(() => { this.isLoading = false })
    },

    // 切换排序
    changeSort(type) {
      if (this.currentType === type) return;
      this.currentType = type;
      this.pageno = 1;
      this.isScroll = false;
      this.productList = [];
      this.getCakeProduct(1);
    },

    // 滚动监听：控制吸顶和分页
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const topHeight = this.$refs.topBox ? this.$refs.topBox.getBoundingClientRect().height : 0;
      // 当滑过 Banner、大牌、电子券之后吸顶
      this.show = scrollTop > 450;

      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 100) {
        this.onMost()
      }
    },

    onMost() {
      if (!this.isScroll && !this.isLoading) {
        this.pageno++
        this.getCakeProduct(this.pageno)
      }
    },

    // 城市选择回调
    getCityId(e) {
      if (e === "" || e == null) {
        this.loadingflag = false
        this.isCityId = true
        this.$toast("定位失败，请选择城市")
        return
      }
      this.cid = e
      this.currentCityId = e;
      localStorage.setItem("cid", e)
      this.pageno = 1
      this.isScroll = false
      this.productList = []
      this.getCakeIndexList()
    }
  },
  created() {
    this.kefu = localStorage.getItem("kefu") || ''
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.currentCityId = sessionStorage.getItem("cityId") || this.cid || '';
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  }, activated() {
    this.checkAndReloadCity();
  },

  // ✅ 新增：若没用 keep-alive，路由返回也会经过 beforeRouteEnter
  beforeRouteEnter(to, from, next) {
    next(vm => { vm.checkAndReloadCity(); });
  }
}
</script>
<style>
.searchValue .van-search__content {
  background-color: transparent;
}
</style>
<style scoped lang="less">
.location {
  min-height: 100vh;
  background: linear-gradient(180deg, #FCEDC2 0%, #FAE3A0 100%);
  padding-bottom: 60px;
  box-sizing: border-box;
}

/* 顶部 */
.topBox {
  // background: linear-gradient(to bottom, #FCE4E5, #F8F8F8);
  padding-bottom: 10px;

  .topPage {
    padding: 10px 15px 0;

    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .city-wrapper {
      flex-shrink: 0;
    }

    .searchValue {
      flex: 1;
      min-width: 0;
    }

    .van-search {
      padding: 0;
      background: transparent;
    }

    .van-search .van-cell {
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 30px;
      padding: 6px 12px;
    }

    /deep/ .van-field__control {
      color: #92716D;
      font-size: 13px;
    }

    .customer {
      width: 26px;
      flex-shrink: 0;

      .img {
        width: 100%;
        height: auto;
      }
    }
  }
}

/* 公告栏 */
.notice-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 10px 10px;
  padding: 8px 12px;
  background: #FFF5E6;
  border-radius: 8px;
  font-size: 12px;
  color: #B5595B;

  .notice-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* Banner 轮播 */
.banner-box {
  margin: 0 10px 10px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .banner-img {
    width: 100%;
    height: 140px;
    /* 根据实际图片比例调整 */
    object-fit: cover;
    display: block;
  }
}

.cakeBrand1 {
  background: url('../../assets/dangao/bg2.png') no-repeat;
  background-size: cover;
}

.cakeBrand2 {
  background: url('../../assets/dangao/bg1.png') no-repeat;
  background-size: cover;
}

/* 品牌与分类区块 */
.cakeBrand {

  //  linear-gradient(180deg, #FFC029 0%, #FFDC4F 100%);
  margin: 10px 10px 0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  .brandtitleBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        // background: #F99E9B;
        border-radius: 2px;
        margin-right: 6px;
      }
    }

    .seeAll {
      font-size: 12px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  /* 大牌蛋糕图片样式 */
  .cakeBoxImg {
    padding-top: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 0;
    justify-content: space-between;

    .imgMax2 {
      width: 23%;
      // margin-bottom: 8px;
      cursor: pointer;
    }

    .imgMax {
      width: 100%;
      height: 36px;
      aspect-ratio: 1 / 1;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      border: 1px solid #F0F0F0;
    }

    .brand-name {
      font-size: 12px;
      text-align: center;
      margin-top: 4px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* 电子券卡片样式 */
  .coupons-grid {
    padding-top: 4px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 一行3个 */
    gap: 10px;

    .coupon-item {
      border-radius: 8px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 100%;
        max-height: 24px;
        object-fit: contain;
        margin-bottom: 4px;
      }

      .coupon-title {
        font-size: 12px;
        color: #333;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
      }
    }
  }
}

/* 商品列表区 */
.listBox {
  padding: 0 10px;
  margin-top: 10px;

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0 10px;
    transition: all 0.2s;
    background: #F8F8F8;
    padding: 10px 0;
    z-index: 99;

    &.is-fixed {
      position: sticky;
      top: 0;
      margin: 0 -10px;
      padding: 10px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .list-title {
      color: #BB3F42;
      font-weight: bold;
      font-size: 16px;
    }

    .filter-bar {
      display: flex;
      gap: 10px;
      font-size: 12px;
      color: #666;

      .filter-item {
        display: flex;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;

        &.active {
          color: #BB3F42;
          font-weight: bold;
          background: #FFF0F0;
        }
      }
    }
  }
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  .product-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    cursor: pointer;

    .img-box {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-box {
      padding: 8px;

      .name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        line-height: 1.4;
        height: 18px;
      }

      .brand {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 8px;

        .price {
          color: #BB3F42;
          font-weight: bold;
          font-size: 18px;

          span {
            font-size: 12px;
            margin-right: 2px;
          }
        }

        .tag {
          font-size: 10px;
          color: #B5595B;
          background: #FFF0F0;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.no-more {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 15px 0;
}
</style>