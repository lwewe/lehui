<template>
  <div id="app">


    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <!-- 
    <keep-alive>
  <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" /> -->

    <NavigationTab :active="$route.meta.active" v-if="$route.meta.active >= 0"></NavigationTab>
  </div>
</template>

<script>
import { getopenid } from "@/api/login";
import NavigationTab from "@/components/NavigationTab.vue";

export default {
  name: 'App',
  components: { NavigationTab },
  data() {
    return {
      wxCode: "",
      openid: "",
      token: "123",
      fullList: []
    }
  },
  methods: {
    // clearNone(){
    //   localStorage.removeItem("openid")
    // },
    getOpenId(code) {
      getopenid({
        code
      }).then(res => {
        this.aaaaaa = res
        if (res.code == 200) {
          this.openid = res.data.openid
          localStorage.setItem("openid", this.openid)
          window.history.go(-1)
        }
      })
    },
    // ///////微信登录
    getUrl() {
      let userAgent = navigator.userAgent;
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        sessionStorage.setItem("originUrl", location.href); // 用于ios分享
      }
      this.getBaseInfos();
    },

    // 编码函数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数

      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },

    getBaseInfos() {
      if (this.isWeiXin()) {
        const code = this.getUrlParam("code"); // 截取路径中的code
        if (code == null || code === "") {
          let url = "";
          let userAgent = navigator.userAgent;
          if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
            url = sessionStorage.getItem("originUrl");
          } else {
            url = window.location.href;
          }
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05cc5223511e93c3&redirect_uri=" +
            encodeURIComponent(url) +
            "&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect";
          // window.close();
        }
        if (code != "" && code != null) {
          this.wxCode = code;
          // window.history.go(-1)
          this.getOpenId(code)
        }
      } else {
      }
    },

    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 微信登录
  },
  created() {
    window.localStorage.setItem('scanUrl', location.href.split('#')[0])
    // this.openid = localStorage.getItem("openid")
    if (!localStorage.getItem("openid")) {
      this.getUrl()
    }
    this.$store.dispatch("getUserInfoAction")
    if (this.$route.query.token) {
      // console.log(this.$route.query.token)
      this.$store.commit("settoken", this.$route.query.token)
      localStorage.setItem("token", this.$route.query.token)
    }
    // 悦享福满满
    if (this.$route.query.full) {
      sessionStorage.setItem("full", this.$route.query.full)
      sessionStorage.setItem("isFirst", this.$route.query.full)
    }
    if (this.$route.query.isFirst) {
      sessionStorage.setItem("full", this.$route.query.isFirst)
      sessionStorage.setItem("isFirst", this.$route.query.isFirst)
    }
    if (this.$route.query.festivals) {
      sessionStorage.setItem("festivals", this.$route.query.festivals)
    }
    
  },
  mounted() {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 342px;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.van-dialog {
  border-radius: 20px !important;
}

.van-button__text {
  font-size: 13px !important;
}

/* .content{
  display: flex;
  flex-direction: column;
} */
.mb10 {
  margin-bottom: 10px;
}

.bdr10 {
  border-radius: 10px;
}

.pd10 {
  padding: 10px;
}

.bgfff {
  background: #ffffff;
}

.df {
  display: flex;
}

.jcsb {
  justify-content: space-between;
}

.fs12 {
  font-size: 12px;
}
.fs14 {
  font-size: 14px;
}
.fs10 {
  font-size: 10px;
}

.cl8{color: #b5691a;}
.txtrg{
  text-align: right;
}
 
</style>
