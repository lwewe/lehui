<template>
  <div class="conPage">
    <div>
      <img class="img" src="@/assets/yanchu/banner1.png" alt="">
    </div>
    <div class="centerBox">
      <!--      列表-->
      <div>
        <div v-for="(item,index) in shopList" :key="item.id">
          <NewProductList :listItem="item" :index="index" :board="1"></NewProductList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDramaProjectList as apiProjectList } from "@/api/lehuiperform";
import NewProductList from "@/components/NewProductListyanchu.vue";

export default {
  name: "Leaderboard",
  components: {NewProductList},
  data() {
    return {
      pageno: 1,
      isScroll: false,
      shopList: [],
    }
  },
  methods: {
    // 获取演出列表
     getDramaProjectList() {
  apiProjectList({
    cityCode: sessionStorage.getItem("targetId"),
    pageNo: this.pageno,
    pageSize: 10,
    ...this.$store.state.parameter
  }).then(res => {
    if (res.code == 200) {
      const records = (res.data && res.data.records) || []
      if (records.length == 0) {
        this.isScroll = true
        return
      }
      records.forEach(item => this.shopList.push(item))
    }
  })
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
        this.getDramaProjectList()
      }
    },
  },
  created() {
    this.getDramaProjectList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>

<style scoped lang="less">
.conPage{
  background-color: #F0F0F0;
  min-height: 100vh;
}
.centerBox{
  margin-top: -36px;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  overflow: hidden;
  padding-bottom: 15px;
}
</style>