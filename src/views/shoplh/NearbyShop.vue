<template>
  <div class="nearby-shop-page">
    <!-- 1. 顶部搜索与返回 -->
    <div class="header-area">
      <div class="back-btn" @click="goBack">
        <van-icon name="arrow-left" color="#333" />
      </div>
      <div class="search-box">
        <van-icon name="search" class="search-icon" />
        <input 
          type="text" 
          v-model="keyword" 
          placeholder="搜索超市(物美/盒马/山姆)" 
          @keyup.enter="doSearch"
        />
        <div class="search-btn" @click="doSearch">搜索</div>
      </div>
    </div>

    <!-- 2. 定位按钮 -->
    <div class="location-bar" @click="triggerGetLocation">
      <van-icon name="location-o" class="loc-icon" />
      <span class="loc-text">
        {{ locationText || '点击获取当前位置' }}
      </span>
      <van-icon name="arrow" class="arrow-icon" />
    </div>

    <!-- 3. 门店列表 -->
    <div class="shop-list">
      <div 
        class="shop-item" 
        v-for="(item, index) in shopList" 
        :key="index" 
        @click="selectShop(item)"
      >
        <div class="shop-img-box"></div>
        <div class="shop-info">
          <div class="shop-name">{{ item.name }}</div>
          <div class="shop-address">
            <van-icon name="location-o" class="addr-icon" />
            {{ item.address }}
          </div>
        </div>
        <div class="shop-distance">{{ item.distance }}Km</div>
      </div>

      <div class="load-more-tip" v-if="loading">加载中...</div>
      <div class="empty-tip" v-if="!loading && shopList.length === 0">暂无门店数据</div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";

export default {
  name: "NearbyShop",
  data() {
    return {
      keyword: "",
      shopList: [],
      // ✅ 新增：保留一份完整的数据源，搜索靠它
      allShopList: [], 
      loading: false,
      locationText: "定位中...",
    };
  },
  created() {
    // 页面加载时先加载假数据
    this.loadMockData();
  },
  methods: {
    goBack() { this.$router.go(-1); },

    // 加载门店假数据
    loadMockData() {
      this.loading = true;
      setTimeout(() => {
        // ✅ 给数据加上唯一的 id，防止点击跳转出问题
        const mockData = [
          { id: 101, name: '物美-科兴店', address: '丰台区马家堡西路36号', distance: '2.31' },
          { id: 102, name: '物美-华联店', address: '海淀区中关村大街1号', distance: '3.50' },
          { id: 103, name: '永辉-大悦城店', address: '西城区西单北大街', distance: '4.20' },
          { id: 104, name: '盒马-十里堡店', address: '朝阳区十里堡路', distance: '5.10' },
          { id: 105, name: '山姆-亦庄店', address: '大兴区亦庄经济开发区', distance: '6.00' },
        ];
        // ✅ 同时赋值给显示列表和总数据源
        this.allShopList = mockData;
        this.shopList = mockData;
        this.loading = false;
      }, 300);
    },

    // ✅ 核心修正：搜索逻辑
    doSearch() {
      // 如果输入了关键字，从完整数据源中过滤
      if (this.keyword && this.keyword.trim() !== '') {
        this.shopList = this.allShopList.filter(item => 
          item.name.includes(this.keyword.trim())
        );
      } else {
        // 如果清空了搜索框，显示全部数据
        this.shopList = [...this.allShopList];
      }
    },

    // 定位逻辑（保持您原来的逻辑）
    triggerGetLocation() {
      this.locationText = "定位中...";
      const ua = window.navigator.userAgent.toLowerCase();
      
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        if (typeof wx === 'undefined') {
          this.$toast("微信JS-SDK未加载");
          return;
        }
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            console.log("定位成功", res);
            this.locationText = "已定位";
          },
          fail: (err) => {
            console.error("定位失败", err);
            this.locationText = "定位失败，点击重试";
          }
        });
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              console.log("定位成功", pos);
              this.locationText = "已定位";
            },
            (err) => {
              console.error("定位失败", err);
              this.locationText = "定位失败，点击重试";
            }
          );
        }
      }
    },

    // 点击选择门店并跳转
    selectShop(item) {
      if (!item.id) {
        this.$toast("该门店信息不完整");
        return;
      }
      this.$router.push({ 
        path: "/productList", 
        query: { shopId: item.id, shopName: item.name } 
      });
    }
  }
};
</script>

<style scoped lang="less">
.nearby-shop-page {
  background-color: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 20px;
}

.header-area {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  .back-btn { font-size: 20px; margin-right: 12px; cursor: pointer; }
  .search-box {
    flex: 1; display: flex; align-items: center; background: #f0f2f5;
    border-radius: 20px; padding: 4px 12px 4px 16px;
    .search-icon { color: #999; margin-right: 8px; }
    input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: #333; }
    .search-btn { background: #ff3b30; color: #fff; font-size: 12px; padding: 4px 14px; border-radius: 16px; cursor: pointer; margin-left: 8px; }
  }
}

.location-bar {
  display: flex; align-items: center; padding: 10px 16px; background: #fff;
  margin: 10px; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  .loc-icon { color: #ff3b30; font-size: 18px; margin-right: 8px; }
  .loc-text { flex: 1; font-size: 14px; color: #333; }
  .arrow-icon { color: #999; }
}

.shop-list { padding: 0 10px; }
.shop-item {
  display: flex; align-items: center; background: #fff; border-radius: 12px;
  padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); position: relative; cursor: pointer;
  .shop-img-box { width: 60px; height: 60px; border-radius: 8px; flex-shrink: 0; margin-right: 12px; background: #e0e0e0; }
  .shop-info { flex: 1; .shop-name { font-size: 16px; font-weight: 500; color: #333; margin-bottom: 4px; } .shop-address { font-size: 13px; color: #999; display: flex; align-items: center; .addr-icon { font-size: 14px; margin-right: 4px; color: #ff4d30; } } }
  .shop-distance { font-size: 12px; color: #999; position: absolute; top: 16px; right: 16px; }
}

.load-more-tip { text-align: center; font-size: 13px; color: #999; padding: 16px 0; }
.empty-tip { text-align: center; font-size: 14px; color: #999; padding: 60px 0; }
</style>