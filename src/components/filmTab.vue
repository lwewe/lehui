<template>
  <!--  首页tabbbr-->
  <div>
    <van-tabbar v-model="activeNum"  active-color="#EE3E44">
      <van-tabbar-item @click="toFilmIndex">
        <span>首页</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toMultiplex">
        <span>影城</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mulIcon.active : mulIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toMine">
        <span>我的</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mineIcon.active : mineIcon.normal"
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "filmTab",
  props:{
    active:[Number,String]
  },
  data(){
    return {
      activeNum:0,
      // 首页
      icon: {
        normal: require('@/assets/filmicon/syh.png'),
        active: require('@/assets/filmicon/syx.png')
      },
      mulIcon:{
        normal: require('@/assets/filmicon/yh.png'),
        active: require('@/assets/filmicon/yx.png')
      },
      mineIcon:{
        normal: require('@/assets/filmicon/gh.png'),
        active: require('@/assets/filmicon/gx.png')
      },
      change:null
    }
  },
  methods:{
    toMine(){
        this.$router.push("/personCenter")
    },
    toFilmIndex(){
      window.location.href = this.$store.state.base +"/index"+"?token="+localStorage.getItem("token")
    },
    toMultiplex(){
      window.location.href = this.$store.state.base +"/multiplex"+"?token="+localStorage.getItem("token")
    }
  },
  created() {
    this.activeNum = this.active
    this.change = sessionStorage.getItem("change")
  }
}
</script>



<style scoped>
.van-tabbar--fixed {
  z-index: 99999 !important;
}
.van-tabbar-item__icon img{
  width: 100%;
  height: 100%;
}
/deep/.van-tabbar-item__icon {
  position: relative;
  font-size: 18%;
  margin-bottom: 5px;
  width: 20%;
}
/deep/.van-tabbar {
  height: auto;
  padding: 4px 0px;
}
</style>