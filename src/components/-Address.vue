<template>
  <div class="address">
    <div class="title">请选择地址</div>
    <div class="choose">
      <div class="chooseItem" @click="change" :class="{active: province}">{{ province ? province : '请选择' }}</div>
      <div class="chooseItem" v-if="city" :class="{active: city}">{{ city ? city : '请选择' }}</div>
      <div class="chooseItem" v-if="county" :class="{active: county}">{{ county ? county : '请选择' }}</div>
      <div class="chooseItem screen" v-if="twon" :class="{active: twon}">{{ twon ? twon : '请选择' }}</div>
    </div>
    
    <!--    地区列表-->
    <div class="addressList">
      <div class="addrssItem" v-for="item in addressList" :key="item.id"
           @click="chanegAddress(item.id,item.name,item.type)">
        <div :class="{success:selectId==item.id}">{{ item.name }}</div>
        <div class="success" v-if="selectId==item.id">
          <van-icon name="success"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入最新的省市区联动接口
import { addressShow } from "@/api/lhjdtm";

export default {
  name: "Address",
  data() {
    return {
      selectId: null,
      addressList: [],
      province: "",
      city: "",
      county: "",
      twon: "",
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
    }
  },
  methods: {
    // 重新选择省
    change() {
      this.province = ""
      this.city = ""
      this.county = ""
      this.twon = ""
      this.province_id = ""
      this.city_id = ""
      this.county_id = ""
      this.town_id = ""
      this.getAddressList(0, "province")
    },
    
    // 关闭并传数据给父组件
    close() {
      this.$emit("chanegTown", false)
      this.allAddress = this.province + " " + this.city + " " + this.county + " " + this.twon
      let dataId = {
        province_id: this.province_id,
        city_id: this.city_id,
        county_id: this.county_id,
        town_id: this.town_id,
      }
      this.$emit("getAddress", this.allAddress, dataId)
    },

    // 选择下一级
    chanegAddress(id, name, type) {
      this.selectId = id
      if (type == "province") {
        this.province = name
        this.province_id = id
        // 获取市
        this.getAddressList(id, "city")
      } else if (type == "city") {
        this.city = name
        this.city_id = id
        // 获取区
        this.getAddressList(id, "county")
      } else if (type == "county") {
        this.county = name
        this.county_id = id
        // 获取街道
        this.getAddressList(id, "town")
      } else if (type == "town") {
        this.twon = name
        this.town_id = id
        this.close()
      }
    },

    // 调取最新接口 /jdtmshop/addressShow
    getAddressList(id, type) {
      addressShow({ id }).then(res => {
        if (res.code == 200) {
          if (res.data && res.data.length > 0) {
            // 给数据添加 type 属性，方便判断点击的是哪一级
            this.addressList = res.data.map(item => ({
              ...item,
              type: type
            }))
          } else {
            // 如果没有下一级数据，直接关闭弹窗
            this.close()
          }
        }
      })
    }
  },
  created() {
    this.getAddressList(0, "province")
  }
}
</script>

<style scoped lang="less">
.address {
  padding: 10px;
}

.title {
  text-align: center;
}

.choose {
  padding: 5px 0px 10px;
  border-bottom: 1px solid #F6F6F6;
  display: flex;
  align-items: center;
  gap: 5px;

  .chooseItem {
    border-bottom: 2px solid #3392FE;
    padding: 15px 0px;
    color: #ADADAD;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 20%;
    text-align: center;
  }

  .screen {
    width: 40%;
  }
  
  .active {
    color: #333;
    font-weight: bold;
  }
}

.addressList {
  margin-top: 10px;
  font-size: 15px;

  .addrssItem {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .success {
    color: #3392FE;
  }
}
</style>