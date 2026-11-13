<template>
  <div class="city-list-page">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <van-search 
        v-model="keyword" 
        placeholder="输入城市名或拼音" 
        @input="onSearch"
        @clear="clearSearch"
        shape="round"
      />
      <div class="current-city" v-if="currentCity">
        当前定位：<span>{{ currentCity }}</span>
      </div>
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-result" v-if="keyword && searchList.length > 0">
      <div class="city-item" v-for="item in searchList" :key="item.id" @click="selectCityItem(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="search-result empty" v-else-if="keyword && searchList.length === 0">
      没有找到相关城市
    </div>

    <!-- A-Z 城市列表 -->
    <div class="city-content" v-show="!keyword">
      <div class="letter-group" v-for="(cities, letter) in cityList" :key="letter" :id="'letter-' + letter">
        <div class="letter-title">{{ letter }}</div>
        <div class="city-item" v-for="item in cities" :key="item.id" @click="selectCityItem(item)">
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 右侧字母索引 -->
    <div class="letter-index" v-show="!keyword">
      <div 
        class="index-item" 
        v-for="letter in letters" 
        :key="letter" 
        @click="scrollToLetter(letter)"
      >
        {{ letter }}
      </div>
    </div>
  </div>
</template>

<script>
import { getCityList, searchCity } from "@/api/lehuicake";

export default {
  name: "CakeCityList",
  data() {
    return {
      keyword: "",
      cityList: {}, // A-Z 分组数据
      letters: [],  // ['A', 'B', 'C'...]
      searchList: [], // 搜索结果
      currentCity: "", // 当前选中的城市名
      timer: null, // 防抖定时器
    };
  },
  methods: {
    // 1. 获取 A-Z 城市列表
    fetchCityList() {
      getCityList().then(res => {
        if (res.code === 200 && res.data.city_list) {
          this.cityList = res.data.city_list;
          this.letters = Object.keys(this.cityList).sort(); // 提取字母并排序
        }
      });
    },

    // 2. 搜索防抖
    onSearch() {
      if (this.timer) clearTimeout(this.timer);
      if (!this.keyword.trim()) {
        this.searchList = [];
        return;
      }
      
      this.timer = setTimeout(() => {
        searchCity(this.keyword).then(res => {
          if (res.code === 200) {
            this.searchList = res.data.city_list || [];
          }
        });
      }, 300);
    },

    // 3. 清空搜索
    clearSearch() {
      this.keyword = "";
      this.searchList = [];
    },

    // 4. 点击选择城市
    selectCityItem(city) {
      // 存入缓存
      sessionStorage.setItem("cityName", city.name);
      sessionStorage.setItem("cityId", city.id);
      
      // 返回上一页 (首页)
      this.$router.back();
    },

    // 5. 滚动到指定字母
    scrollToLetter(letter) {
      const el = document.getElementById('letter-' + letter);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  created() {
    // 记录从上一页带过来的城市（回显）
    this.currentCity = this.$route.query.city || "";
    this.fetchCityList();
  },
};
</script>

<style scoped lang="less">
.city-list-page {
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部搜索区 */
.search-header {
  padding: 10px;
  background: #F8F8F8;
  border-bottom: 1px solid #eee;
  
  .current-city {
    padding: 8px 10px;
    font-size: 13px;
    color: #666;
    span {
      color: #BB3F42;
      font-weight: bold;
    }
  }
}

/* 搜索结果 & 城市列表共用项 */
.city-item {
  padding: 12px 15px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  
  &:active {
    background: #f9f9f9;
  }
}

.search-result {
  flex: 1;
  overflow-y: auto;
  &.empty {
    text-align: center;
    padding: 30px;
    color: #999;
    font-size: 14px;
  }
}

/* 城市列表区 */
.city-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 30px; /* 给右侧索引留位置 */

  .letter-group {
    .letter-title {
      padding: 8px 15px;
      background: #F8F8F8;
      font-size: 14px;
      font-weight: bold;
      color: #999;
    }
  }
}

/* 右侧字母索引 */
.letter-index {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 99;

  .index-item {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 11px;
    color: #666;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    
    &:active {
      background: #BB3F42;
      color: #fff;
    }
  }
}
</style>