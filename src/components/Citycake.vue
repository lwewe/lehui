<template>
  <div class="city-selector" @click="showPopup">
    <van-icon name="location-o" class="icon-location" />
    <span class="city-name">{{ city || '选择城市' }}</span>
    <van-icon name="arrow-down" class="icon-arrow" />
  </div>
</template>

<script>
import { selectCity } from "@/api/lehuicake";

export default {
  name: "City",
  props: {
    type: [Number, String], // 1-蛋糕业务 
  },
  data() {
    return {
      city: "",
      cityId: "",
    };
  },
  // City.vue 的 script 中新增
watch: {
  '$route'(to, from) {
    // 从城市列表页返回时，重新读缓存并通知父组件
    if (from.path === '/cakeCityList' || from.path === '/newCitylist') {
      const cacheCity = sessionStorage.getItem("cityName");
      const cacheId = sessionStorage.getItem("cityId");
      if (cacheCity && cacheId) {
        this.city = cacheCity;
        this.cityId = cacheId;
        this.$emit("getCityId", cacheId);  // ✅ 关键：重新通知首页
      }
    }
  }
},
  methods: {
    // 跳转到城市列表页
    showPopup() {
      const path = this.type == 1 ? "/cakeCityList" : "/newCitylist";
      this.$router.push({
        path: path,
        query: { city: this.city }
      });
    },
    // 初始化：优先读缓存，否则给默认城市
    initCity() {
      const cacheCity = sessionStorage.getItem("cityName");
      const cacheId = sessionStorage.getItem("cityId");

      if (cacheCity && cacheId) {
        this.city = cacheCity;
        this.cityId = cacheId;
        this.$emit("getCityId", this.cityId);
      } else {
        // 实际项目中这里应该调用微信/百度定位，这里为了不阻塞首页，先默认北京
        this.searchCityId("北京市");
      }
    },
    // 根据名字反查ID
    searchCityId(cityName) {
      if (!cityName) return;
      
      selectCity(cityName).then((res) => {
        if (res.code == 200 && res.data.city_show) {
          const cityData = res.data.city_show;
          this.city = cityData.name;
          this.cityId = cityData.id;
          
          sessionStorage.setItem("cityName", cityData.name);
          sessionStorage.setItem("cityId", cityData.id);
          
          this.$emit("getCityId", cityData.id);
        }
      }).catch(() => {
        this.city = "北京市"; // 兜底
      });
    }
  },
  created() {
    this.initCity();
  },
};
</script>

<style scoped>
/* 样式同上，保持不变 */
.city-selector {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  background-color: rgba(255, 255, 255, 0.8); padding: 6px 10px;
  border-radius: 30px; font-size: 13px; color: #333;
  cursor: pointer; height: 32px; box-sizing: border-box; white-space: nowrap;
}
.city-selector:active { background-color: rgba(255, 255, 255, 1); }
.icon-location { font-size: 14px; color: #92716D; }
.city-name { max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.icon-arrow { font-size: 10px; color: #999; margin-left: 2px; }
</style>