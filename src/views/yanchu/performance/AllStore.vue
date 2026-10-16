<template>
  <div class="conPage">
    <!--    <NProgress v-if="loadingflag"/>-->
    <!--    门店列表-->
    <div>
      <van-radio-group v-model="radio" v-for="(item,index) in storeList" :key="item.pointId">
        <div class="storeItem">
          <div class="storeIcon">
            <div style="width: 100%;">
              <div class="storeName">{{ item.pointName }}</div>
              <div class="storeAddress" style="border: none;margin: 0;">
                <div style="padding-top: 2px">
                  <van-icon name="location-o"/>
                </div>
                <div style="color:#6D6D6D;width: 90%;">{{ item.pointAddr }}</div>
              </div>
            </div>
            <div @click="chooseStore(item)">
              <van-radio checked-color="#F26C92" :name="index"/>
            </div>
          </div>
          <div class="storeAddress" style="font-size: 10px;align-items: baseline;justify-content: space-between"
               v-if="item.bizTimeShow">
            <div style="color:#6D6D6D" v-if="item.bizTimeShow.split('、').length!=7">取票时间：{{ item.bizTimeShow }}
            </div>
            <div style="color:#6D6D6D" v-else>
              取票时间：周一至周日({{
                item.bizTimeShow.split('、')[item.bizTimeShow.split('、').length - 1].split(" ").slice(1).join("")
              }})
            </div>
            <div>{{ item.km }}km</div>
          </div>
        </div>
      </van-radio-group>
    </div>

  </div>
</template>
<script>

import {getDramaList} from "@/api/lehuiperform";

export default {
  name: "AllStore",
  data() {
    return {
      searchValue: "",
      city: "",
      storeList: [{
        "pointId": 174,
        "pointName": "北京-盒马鲜生(西直门店)",
        "pointAddr": "北京北京市西城区西直门外大街112号阳光大厦B1层盒马鲜生麦田间左手边",
        "longitude": "116.345853",
        "latitude": "39.937644",
        "bizTimeShow": "周日、周六、周五、周四、周三、周二、周一  09:00 - 21:00",
        "remark": "",
        "pointType": "固定换票点",
        "exchangeType": "自助机",
        "validPeriod": "永久"
      },
        {
          "pointId": 159,
          "pointName": "北京-隆福剧场（东宫影剧院）",
          "pointAddr": "北京北京市东城区隆福寺大街47号",
          "longitude": "116.415511",
          "latitude": "39.925432",
          "bizTimeShow": "周日、周六、周五、周四、周三、周二、周一  09:00 - 20:00",
          "remark": "为防止自助机未开机，建议您演出开始前2小时前往取票点取票",
          "pointType": "固定换票点",
          "exchangeType": "自助机",
          "validPeriod": "永久"
        }],
      list: [],
      dataList: [],
      loadingflag: true,
      radio: '0',
      lat: "",
      lng: ''
    }
  },
  methods: {
    chooseStore(item) {
      // console.log(item)
      sessionStorage.setItem("StoreName", JSON.stringify(item))
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },
    getAll(projectId) {
      let data = {
        method: "xuankua.drama.ticketExchangePoint",
        projectId,
        ...this.$store.state.parameter,
      }
      let sign = this.$utils.getASCII(data)
      getDramaList({
        sign: sign,
        ...data
      }).then(res => {
        // console.log(res, "m")
        if (res.code == 200) {
          // this.storeList = res.data
          // if(this.storeList.length>0){
          //   this.storeList.forEach(item => {
          //     item.km = this.getDistance(item.latitude, item.longitude, this.lat, this.lng)
          //   })
          // }
        }
      })
    },
    // 计算距离
    getDistance(lat1, lng1, lat2, lng2) {
      let EARTH_RADIUS = 6378.137;
      let radLat1 = this.rad(lat1);
      let radLat2 = this.rad(lat2);
      let a = radLat1 - radLat2;
      let b = this.rad(lng1) - this.rad(lng2);
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
          + Math.cos(radLat1) * Math.cos(radLat2)
          * Math.pow(Math.sin(b / 2), 2)));
      s = s * EARTH_RADIUS;
      //s = Math.round(s * 10000d) / 10000d;
      s = Math.round(s * 10000) / 10000;
      s = s.toFixed(2);    //乘以1000是换算成米
      // console.log(s," km")
      this.distance = s
      return s;
    },
    rad(d) {
      return d * Math.PI / 180.0;
    },
  },
  created() {
    this.getAll(this.$route.query.id)
    this.lat = sessionStorage.getItem("latitude")
    this.lng = sessionStorage.getItem("longitude")
    // console.log(this.storeList)
    if (sessionStorage.getItem("StoreName")) {
      this.dataList = JSON.parse(sessionStorage.getItem("StoreName"))
    }
    this.storeList.forEach((item,index)=>{
        item.km = this.getDistance(item.latitude, item.longitude, this.lat, this.lng,)
     if(item.pointId==this.dataList.pointId){
       this.radio = index
     }
    })
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: calc(100vh + 10px);
  background-color: #F0F0F0;
  padding: 10px;
  box-sizing: border-box;
  margin-top: -10px;
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
  padding: 15px;
  font-size: 15px;
  margin-top: 10px;

  .storeAddress {
    display: flex;
    gap: 4px;
    font-size: 12px;
    color: #535353;
    border-top: 1px solid #efefef;
    margin-top: 6px;
    padding-top: 7px;
  }
}

.storeIcon {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>