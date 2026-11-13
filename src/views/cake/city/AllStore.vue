<template>
  <div class="conPage">
    <NProgress v-if="loadingflag" />
    <div class="searchBox">
      <div>
        <!--      地址-->
        {{ city }}
      </div>
      <div class="searchValue">
        <van-search @input="searchStore" background="#fff0" placeholder="搜索门店" v-model="searchValue" />
      </div>
    </div>
    <div class="title">
      <div>所有门店</div>
      <div class="line"></div>
    </div>

    <!--    门店列表-->
    <div>
      <div class="storeItem" v-for="item in storeList" :key="item.shop_id" @click="chooseStore(item)">
        <div class="storeName">{{ item.shop_name }}</div>
        <div class="storeAddress">
          <div style="padding-top: 2px">
            <van-icon name="location-o" />
          </div>
          <div style="color:#6D6D6D">{{ item.address }}</div>
        </div>
      </div>

      <!-- ✅ 新增：空态提示 -->
      <div v-if="!loadingflag && !storeList.length" class="empty-tip">暂无门店</div>
    </div>
  </div>
</template>
<script>
import City from "@/components/Citycake.vue";
import { getSelShop } from "@/api/lehuicake";

export default {
  name: "AllStore",
  components: { City },
  data() {
    return {
      searchValue: "",
      city: "",
      storeList: [],
      list: [],
      dataList: [],
      loadingflag: true
    }
  },
  methods: {
    // ✅ 空关键词返回全量副本；list 空保护
    searchStore(e) {
      const keyword = (e || '').trim();
      const source = this.list || [];
      this.storeList = keyword
        ? source.filter(item => (item.shop_name || '').includes(keyword))
        : source.slice();
    },
    chooseStore(item) {
      // ✅ indexs 比较统一 String，address 空值保护
      const currentIndex = String(this.$route.query.index);
      this.dataList = this.dataList.filter(item => String(item.indexs) !== currentIndex);
      this.dataList.push({
        id: item.shop_id,
        name: item.shop_name,
        indexs: this.$route.query.index,
        detail: (item.address || '').replace(/\s*/g, '')
      });
      sessionStorage.setItem("StoreName", JSON.stringify(this.dataList));
      // ✅ 去掉 500ms 延迟，直接返回
      this.$router.go(-1);
    },
    getAll(id) {
      if (!id) {
        this.loadingflag = false;
        return;
      }
      // ✅ cid 从缓存取（City 组件已写入 sessionStorage）
      const cid = sessionStorage.getItem("cityId");
      if (!cid) {
        // 没城市缓存，兜底：不传 cid 让后端返回默认，或提示
        console.warn('缺少 cityId 缓存');
      }

      getSelShop({
        cid: cid,          // ✅ 补上必填 cid
        brand_id: id
      }).then(res => {
        if (res.code == 200 && res.data && res.data.shop_list) {
          const shopList = res.data.shop_list;
          this.city = (shopList.city && shopList.city.name) || '';
          this.storeList = shopList.shops || [];
          this.list = (shopList.shops || []).slice();
        }
      }).catch(() => { }).finally(() => {
        this.loadingflag = false;
      });
    }
  },
  created() {
    // ✅ query.id 可能是数组，归一化
    const id = Array.isArray(this.$route.query.id)
      ? this.$route.query.id[0]
      : this.$route.query.id;
    this.getAll(id);
    // ✅ JSON.parse 加 try/catch
    if (sessionStorage.getItem("StoreName")) {
      try {
        this.dataList = JSON.parse(sessionStorage.getItem("StoreName")) || [];
      } catch (e) {
        this.dataList = [];
      }
    }
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  padding: 10px;
  box-sizing: border-box;
}

.searchBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  gap: 5px;
}


.searchValue {
  width: 80%;
}

.van-search {
  padding: 10px;
  padding-bottom: 6px;
  padding-top: 6px;
}

.van-search .van-cell {
  background-color: transparent;
}

.van-search__content {
  background-color: #F9F9F9;
  border-radius: 30px;
}

.title {
  text-align: center;
  font-size: 15px;
  margin-top: 3px;
  font-weight: bold;

  .line {
    background-color: #C83937;
    width: 20px;
    height: 3px;
    margin: auto;
    margin-top: 5px;
    border-radius: 30px;
  }
}

.storeItem {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 15px;
  margin-top: 10px;

  .storeAddress {
    display: flex;
    gap: 4px;
    font-size: 14px;
    color: #535353;
    border-top: 1px solid #efefef;
    margin-top: 6px;
    padding-top: 7px;
  }
}

/* ✅ 新增空态样式 */
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}
</style>