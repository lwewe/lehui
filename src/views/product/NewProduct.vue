<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <div class="backImg">
      <img class="img" src="../../assets/hotshop/xp.png" alt="">
    </div>
<!--    列表-->
  <div class="listBox">
   <div v-for="item in productList" :key="item.id">
     <NewProductList :change="1"  :listItem="item" ></NewProductList>
   </div>
  </div>
  </div>
</template>
<script>
import NewProductList from "@/components/NewProductList.vue";
import {getNewProductList} from "@/api";

export default {
name: "NewProduct",
  components: {NewProductList},
  data() {
    return {
      pageno: 1,
      productList: [],
      isScroll: false,
      loadingflag:true
    }
  },
  methods: {
    // 下方列表
    getSale(pageno = this.pageno) {
      getNewProductList({
        pageno,
        pagesize: 10
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.product_list.forEach(item => {
            this.productList.push(item)
          })
        }
      })
    },
//滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        this.pageno++
        this.getSale()
      }
    }
  },
  created() {
    this.getSale()
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
  min-height: calc(100vh  + 85px);
  //background-image: linear-gradient(to right,#D5F0FA,#D4F0F9,#CFECF5);
  background-image: linear-gradient(to bottom,#f0dfe4,#3C80CD);
}
.backImg{
 // margin-top: -85px;//
}
.listBox{
  padding:15px ;
  margin-top: -62px;
  position: relative;
}
</style>