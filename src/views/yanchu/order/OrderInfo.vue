<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <div class="tab">
      <van-tabs @click="changeType" v-model="active" title-active-color="#CA2354" color="#CA2354"
                title-inactive-color="#B0B0B0"
                :line-width="15" :line-height="2">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="待使用"></van-tab>
        <van-tab title="已完成"></van-tab>
      </van-tabs>
    </div>
    <div v-if="orderList.length>0">
      <OrderList :orderList="orderList"></OrderList>
      <div class="none">--没有更多数据了--</div>
    </div>
    <div class="noneBox" v-else>
      <div class="noneBack">
        <img class="img" src="@/assets/mine/none.png" alt="">
      </div>
      <div class="noneText">您还没有订单呢~</div>
    </div>
  </div>
</template>
<script>
import OrderList from "@/components/OrderList.vue";
import {getPerOrderList} from "@/api/lehuiperform";

export default {
  name: "OrderInfo",
  components: {OrderList},
  data() {
    return {
      active: 0,
      pageno: 1,
      orderList:[],
      type:"",
      isScroll:false,
      loadingflag:true
    }
  },
  methods: {
    calculateRemainingTime(expirationTime) {
      const expirationTimestamp = new Date(expirationTime).getTime();
      const currentTimestamp = new Date().getTime();
      const remainingMilliseconds = expirationTimestamp - currentTimestamp;
      const hours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60))

      return Number(minutes)
    },
    changeType(e) {
      this.orderList = []
      this.pageno = 1
      this.isScroll = false
      this.$router.replace({path: "/orderInfo", query: {tabIndex: e}})
      this.getOder(e+1)
    },
    getOder(type, pageno = this.pageno) {
      getPerOrderList({
        type,
        pageno,
        pagesize: 10
      }).then(res => {
        // console.log(res)
        this.loadingflag = false
        if(res.data.list.length==0){
          this.isScroll = true
        }
        if(res.code == 200){
          if(res.data.list){
            res.data.list.forEach(item=>{
              this.orderList.push({
                ...item,
                exTime:this.calculateRemainingTime(this.timestampToTime(item.expiretime))
              })
            })
          }
        }
      })
    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getOder(this.active+1)
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
  created() {
    this.active = Number(this.$route.query.tabIndex)
    this.getOder(this.active+1)
  }
}
</script>
<style scoped>
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
}
.none {
  text-align: center;
  font-size: 13px;
  color: #B1B1B1;
  margin-top: 50px;
  padding-bottom: 10px;
}

.noneBack {
  width: 268px;
  margin: auto;
}

.noneText {
  text-align: center;
  font-size: 13px;
  color: #A7AAAE;
  margin-top: -53px;
}

.noneBox {
  margin-top: 40px;
}
/deep/.van-tabs__line {
  bottom: 23px;
}
</style>