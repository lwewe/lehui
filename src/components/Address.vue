<template>
  <div class="addBox">
    <div class="address">
      <div class="title">请选择地址</div>
      <div class="choose">
        <div class="chooseItem" @click="change">{{ city || '请选择' }}</div>
        <div class="chooseItem" v-if="county">{{ county || '请选择' }}</div>
      </div>
      <!-- 市列表（按字母分组） -->
      <div class="addressList" v-if="addressList.length == 0">
        <div v-for="(list, letter) in addObj" :key="letter" :id="letter">
          <div style="padding-top: 1px">
            <div class="valeNum">{{ letter }}</div>
          </div>
          <div
            class="addrssItem"
            v-for="item2 in list"
            :key="item2.id"
            @click="chanegAddress(item2)"
          >
            <div :class="{ success: selectId == item2.id }">{{ item2.name }}</div>
            <div class="success" v-if="selectId == item2.id">
              <van-icon name="success"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 区列表 -->
      <div class="addressList" v-else>
        <div
          class="addrssItem"
          v-for="item in addressList"
          :key="item.id"
          @click="chanegAddress(item)"
        >
          <div :class="{ success: selectId == item.id }">{{ item.name }}</div>
          <div class="success" v-if="selectId == item.id">
            <van-icon name="success"/>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧锚点列表 -->
    <div
      class="find"
      v-if="addressList.length == 0"
      style="z-index:1000;position:fixed;top:45px;right:2.2vw;text-align:center;font-size:12px;overflow:scroll;"
    >
      <div
        style="margin-bottom:5px"
        v-for="(item, index) in findword"
        :key="index"
        :class="{ seltctS: seltctS == '#' + item }"
      >
        <a @click="changeHash('#' + item)">{{ item }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getShdzCity, getShdzArea } from "@/api/lehuicake";

export default {
  name: "Address",
  data() {
    return {
      selectId: null,
      addressList: [],
      addObj: {},
      city: "",
      county: "",
      city_id: "",
      city_name: "",
      county_id: "",
      county_name: "",
      findword: [],
      seltctS: ""
    };
  },
  methods: {
    // 返回上一级（市）
    change() {
      this.addressList = [];
      this.city = "";
      this.county = "";
      this.city_id = "";
      this.city_name = "";
      this.county_id = "";
      this.county_name = "";
      this.selectId = "";
      this.getSccityList();
    },

    // 回传父组件：显示文本 + { city_id, city_name, county_id, county_name }
    close() {
      this.$emit("chanegTown", false);
      const allAddress = `${this.city || ""} ${this.county || ""}`.trim();
      this.$emit("getAddress", allAddress, {
        city_id: this.city_id,
        city_name: this.city_name,
        county_id: this.county_id,
        county_name: this.county_name
      });
    },

    changeHash(idname) {
      const el = document.querySelector(idname);
      if (el) el.scrollIntoView(true);
      this.seltctS = idname;
    },

    chanegAddress(item) {
      // 有 first_letter 字段说明是市
      if (item.first_letter) {
        this.city = item.name;
        this.city_name = item.name;
        this.city_id = item.id;
        this.county = "";
        this.county_id = "";
        this.county_name = "";
        this.selectId = "";
        this.getSccountyList(this.city_id);
      } else {
        this.selectId = item.id;
        this.county = item.name;
        this.county_name = item.name;
        this.county_id = item.id;
        this.close();
      }
    },

    // 市列表
    getSccityList() {
      this.addObj = {};
      this.findword = [];
      getShdzCity().then(res => {
        if (res.code == 200) {
          const cityList = res.data.city_list || [];
          if (!cityList.length) return this.close();

          // 26 字母锚点
          for (let i = 65; i < 91; i++) {
            this.findword.push(String.fromCharCode(i));
          }

          // 按首字母分组
          const map = {};
          cityList.forEach(item => {
            const letter = item.first_letter || "#";
            if (!map[letter]) map[letter] = [];
            map[letter].push(item);
          });
          // 只保留有数据的字母
          this.addObj = map;
          this.findword = this.findword.filter(l => map[l]);
        }
      });
    },

    // 区列表
    getSccountyList(city_id) {
      this.addressList = [];
      getShdzArea(city_id).then(res => {
        if (res.code == 200) {
          const areaList = res.data.area_list || [];
          this.addressList = areaList;
          if (!areaList.length) this.close();
        }
      });
    }
  },
  created() {
    this.getSccityList();
  }
};
</script>

<style scoped lang="less">
.address {
  padding: 10px;
  height: 79vh;
  overflow: auto;
}
.title {
  text-align: center;
}
.choose {
  padding: 5px 0 10px;
  border-bottom: 1px solid #f6f6f6;
  display: flex;
  align-items: center;
  gap: 5px;
  .chooseItem {
    border-bottom: 2px solid #3392fe;
    padding: 15px 0;
    color: #adadad;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 20%;
    text-align: center;
  }
}
.addressList {
  margin-top: 10px;
  font-size: 15px;
  width: 95%;
  .addrssItem {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  .success {
    color: #3392fe;
  }
}
.valeNum {
  background-color: #dcdcdc5c;
  width: 35px;
  text-align: center;
  margin-top: 13px;
  font-size: 12px;
  padding: 2px 0;
}
.seltctS {
  color: #3392fe;
}
</style>