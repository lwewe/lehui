<template>
  <div class="address">
    <div class="title">请选择地址</div>
    <div class="choose">
      <div class="chooseItem" @click="change">{{ province ? province : '请选择' }}</div>
      <div class="chooseItem" v-if="city">{{ city ? city : '请选择' }}</div>
      <div class="chooseItem" v-if="county">{{ county ? county : '请选择' }}</div>
    </div>
    <!--    地区列表-->
    <div class="addressList">
      <div class="addrssItem" v-for="item in addressList" :key="item.id"
           @click="chanegAddress(item.id,item.name,item.addressType,item)">
        <div :class="{success:selectId==item.id}">{{ item.name }}</div>
        <div class="success" v-if="selectId==item.id">
          <van-icon name="success"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


 

import { getDramaAddressList } from "@/api/lehuiperform";

export default {
  name: "Address",
  data() {
    return {
      selectId: null,
      addressList: [],
      province: "",
      city: "",
      county: "",
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
      superiorId:''
    }
  },
  methods: {
    change() {
      this.province = ""
      this.city = ""
      this.county = ""
    },
    close() {
      this.$emit("chanegTown", false)
      this.allAddress = this.province + " " + this.city + " " + this.county
      let dataId = {
        province_id: this.province_id,
        city_id: this.city_id,
        county_id: this.county_id,
        province:this.province,
        city:this.city,
        county:this.county,
      }
      this.$emit("getAddress", this.allAddress, dataId)
    },
    chanegAddress(id, name, addressType, item) {
      // console.log(item)
      this.getAddressList(addressType)
      // console.log(addressType)
      if (addressType ==2) {
        this.province = name
        this.city = ""
        this.county = ""
        //   获取市
        this.province_id =item.code
        this.superiorId = item.code
      } else if (addressType == 3) {
        this.city = name
        this.city_id = item.code
        // 获取区
        this.superiorId = item.code
      } else if (addressType == 4) {
        this.county = name
        this.county_id = item.code
        this.close()
      }
    },
    // 演出详情
    getAddressList(type) {
      let data = {
        method: "xuankua.drama.addressList",
        ...this.$store.state.parameter,
      }
      
      getDramaAddressList({
       
        ...data
      }).then(res => {
        // console.log(res, "地址")
        if (res.code == 200) {
          this.addressList=res.data.filter(item=>item.addressType==2)
          // console.log(type)
          if (type == 2) {
            this.addressList=res.data.filter(item=>item.addressType==3&&item.superiorId==this.superiorId)
            // console.log(this.addressList)
          } else if (type == 3) {
            this.addressList=res.data.filter(item=>item.addressType==4&&item.superiorId==this.superiorId)
          } else if (type == 4) {

          }
        }
      })
    },
  },
  created() {
    this.getAddressList()
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
  //justify-content: space-around;
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