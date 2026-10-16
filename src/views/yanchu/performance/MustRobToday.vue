<template>
  <div class="conPage">
    <div>
      <img class="img" src="@/assets/yanchu/banner2.png" alt="">
    </div>
    <div class="centerBox">
      <!--      列表-->
      <div>
        <div v-for="(item,index) in shopList" :key="item.id">
          <NewProductList :listItem="item" :index="index" :board="2"></NewProductList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dramaApi } from "@/api/lehuiperform";
import NewProductList from "@/components/NewProductListyanchu.vue";

export default {
  name: "MustRobToday",
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
      dramaApi("xuankua.drama.dramaProjectList", {
        cityCode: sessionStorage.getItem("targetId"),
        pageNo: this.pageno,
        pageSize: 100,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          const records = (res.data && res.data.records) || []
          if (records.length == 0) {
            this.isScroll = true
            return
          }
          records.forEach(item => {
            if (this.calculateDaysDiff(item.showStartTime) == 1) {
              this.shopList.push(item)
            }
            setTimeout(() => {
              if (this.shopList.length == 0) {
                if (this.calculateDaysDiff(item.showStartTime) <= 30 && this.calculateDaysDiff(item.showStartTime) > 1) {
                  this.shopList.push(item)
                }
              }
            }, 100)
          })
        }
      })
    },
    // 距离现在有多少天
    calculateDaysDiff(date) {
      const targetDate = new Date(date);
      const currentDate = new Date();
      const timeDiff = targetDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff
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
.conPage {
  min-height: 100vh;
  background-color: #FFEFDD;
}

.centerBox {
  position: relative;
  z-index: 9;
  margin-top: -17px;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  overflow: hidden;
  padding: 10px 10px 15px;
  background-color: #FFEFDD;
  min-height: calc(100vh - 145px);
}
</style>