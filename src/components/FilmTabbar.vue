<template>
  <van-tabbar
    v-model="activeTab"
    active-color="#FF2F70"
    inactive-color="#666"
    fixed
    placeholder
  >
    <van-tabbar-item icon="video-o" @click="goTab('/FilmIndex')">影片</van-tabbar-item>
    <van-tabbar-item icon="shop-o" @click="goTab('/multiplex')">影城</van-tabbar-item>
    <van-tabbar-item icon="user-o" @click="goTab('/mine')">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "FilmTabbar",
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeTab: this.active
    }
  },
  watch: {
    active(val) {
      this.activeTab = val
    }
  },
  methods: {
    goTab(path) {
      if (path === '/mine') {
        // 「我的」跳商城首页
        // 如果商城是同项目，用 router：
        // this.$router.push({ path: '/mine' })
        // 如果是另一个项目（8080 商城），用：
        window.location.href = 'http://127.0.0.1:8080/#/mine'
        return
      }
      if (this.$route.path !== path) {
        this.$router.push({ path })
      }
    }
  }
}
</script>