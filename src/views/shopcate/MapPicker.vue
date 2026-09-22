<template>
  <div class="map-picker-page">
    <!-- 顶部搜索栏 -->
    <div class="header">
      <div class="back" @click="goBack">
        <van-icon name="arrow-left" size="20" color="#333" />
      </div>
      <div class="search-box">
        <van-icon name="search" color="#999" />
        <input
          v-model="keyword"
          class="search-input"
          type="text"
          placeholder="搜索地点"
          @keyup.enter="doSearch"
        />
        <span v-if="keyword" class="clear" @click="clearSearch">
          <van-icon name="cross" color="#999" />
        </span>
      </div>
      <div class="search-btn" @click="doSearch">搜索</div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchList.length" class="search-list">
      <div
        v-for="(item, idx) in searchList"
        :key="idx"
        class="search-item"
        @click="pickSearch(item)"
      >
        <div class="search-name">{{ item.title }}</div>
        <div class="search-addr">{{ item.address }}</div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="bmap-container" class="map-container"></div>

    <!-- 中心针 -->
    <div class="center-pin">
      <van-icon name="location" size="32" color="#ED2F35" />
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="current-addr">
        <van-icon name="location-o" color="#ED2F35" size="18" />
        <span class="addr-text">{{ currentAddress || '拖动地图选择位置' }}</span>
      </div>
      <div class="confirm-btn" :class="{ disabled: !currentAddress }" @click="confirm">
        确定
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapPicker",
  data() {
    return {
      map: null,
      geocoder: null,
      localSearch: null,
      keyword: "",
      searchList: [],
      center: { lng: 116.397428, lat: 39.90923 },
      currentAddress: "",
      mapReady: false
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.clearOverlays();
      this.map = null;
    }
  },
  methods: {
    // ---------- 初始化百度地图 ----------
    initMap() {
      if (typeof BMap === "undefined") {
        this.$toast("地图加载失败，请检查百度地图 Key");
        return;
      }

      this.map = new BMap.Map("bmap-container", { enableMapClick: false });
      this.map.centerAndZoom(new BMap.Point(this.center.lng, this.center.lat), 16);
      this.map.enableScrollWheelZoom(true);

      this.geocoder = new BMap.Geocoder();

      // 拖动结束后反查中心点地址
      this.map.addEventListener("moveend", () => {
        const c = this.map.getCenter();
        this.center = { lng: c.lng, lat: c.lat };
        this.reverseGeocode(c.lng, c.lat);
      });

      this.reverseGeocode(this.center.lng, this.center.lat);
      this.mapReady = true;
    },

    // ---------- 逆地理编码：坐标 → 地址 ----------
    reverseGeocode(lng, lat) {
      if (!this.geocoder) return;
      const point = new BMap.Point(lng, lat);
      this.geocoder.getLocation(point, (rs) => {
        if (rs) {
          this.currentAddress = rs.address || "";
        } else {
          this.currentAddress = "";
        }
      });
    },

    // ---------- 关键词搜索 ----------
    doSearch() {
      const kw = (this.keyword || "").trim();
      if (!kw) {
        this.searchList = [];
        return;
      }
      if (!this.map) return;

      const local = new BMap.LocalSearch(this.map, {
        pageCapacity: 20,
        onSearchComplete: (results) => {
          if (local.getStatus() !== BMAP_STATUS_SUCCESS) {
            this.searchList = [];
            this.$toast("未找到相关地点");
            return;
          }
          const list = [];
          for (let i = 0; i < results.getCurrentNumPois(); i++) {
            const poi = results.getPoi(i);
            list.push({
              title: poi.title,
              address: poi.address || "",
              point: poi.point
            });
          }
          this.searchList = list;
        }
      });
      local.search(kw);
    },

    // ---------- 选中搜索结果 ----------
    pickSearch(item) {
      if (!item.point || !this.map) return;
      this.map.setCenter(item.point);
      this.center = { lng: item.point.lng, lat: item.point.lat };
      this.currentAddress = item.title + " " + (item.address || "");
      this.searchList = [];
      this.keyword = item.title;
    },

    clearSearch() {
      this.keyword = "";
      this.searchList = [];
    },

    // ---------- 确定并返回 ----------
    confirm() {
      if (!this.currentAddress) {
        this.$toast("请选择位置");
        return;
      }

      // ⚠ 百度 BD-09 → 高德/微信 GCJ-02，接口要 GCJ-02
      const gcj = this.bd09ToGcj02(this.center.lng, this.center.lat);

      const payload = {
        location: `${gcj.lng.toFixed(6)},${gcj.lat.toFixed(6)}`,
        text: this.currentAddress
      };

      sessionStorage.setItem("flowerLocation", JSON.stringify(payload));
      this.$toast("已选择位置");
      setTimeout(() => this.$router.back(), 300);
    },

    // ---------- BD-09 → GCJ-02 ----------
    bd09ToGcj02(bdLng, bdLat) {
      const X_PI = (Math.PI * 3000.0) / 180.0;
      const x = bdLng - 0.0065;
      const y = bdLat - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
      return {
        lng: z * Math.cos(theta),
        lat: z * Math.sin(theta)
      };
    },

    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="less">
.map-picker-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

/* 顶部搜索 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  .back {
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 18px;
    padding: 6px 12px;
    margin: 0 8px;
    gap: 6px;

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;
    }

    .clear {
      display: flex;
      align-items: center;
    }
  }

  .search-btn {
    font-size: 14px;
    color: #ED2F35;
    font-weight: 500;
    padding: 0 6px;
  }
}

/* 搜索结果 */
.search-list {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 90px;
  z-index: 19;
  background: #fff;
  overflow-y: auto;

  .search-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;

    .search-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .search-addr {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
}

.map-container {
  width: 100%;
  height: 100vh;
}

/* 中心针 */
.center-pin {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  z-index: 10;
  pointer-events: none;
  margin-top: -10px;
}

/* 底部 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: #fff;
  padding: 12px 16px 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  .current-addr {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    color: #333;
    margin-bottom: 12px;

    .addr-text {
      flex: 1;
      line-height: 1.4;
      min-height: 18px;
    }
  }

  .confirm-btn {
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    border-radius: 22px;
    background-image: linear-gradient(to right, #F65958, #DD0A09);

    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>