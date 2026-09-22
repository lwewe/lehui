<template>
  <!--  登录-->
  <div class="login">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div class="picbox">
      <div class="logo">
        <img class="img" :src=" webinfo.weblogo" alt="">
      </div>
      <!-- <img src="../assets/02.png" alt=""> -->
      <!-- {{ webinfo }} -->
    </div>
    <div class="wrap">
      <input style="margin: 0px;" v-model="phone" class="phone" placeholder="手机号" type="text">
      <input v-model="phonecode" class="code" placeholder="验证码" type="text">
      <input v-if="show" type="button" class="send" @click="getcodetime()" name="" id="" value="获取验证码">
      <input v-if="!show" type="button" class="send" name="" id="" :value="count+'秒后重新获取'">
      <!-- <a ></a> -->
    </div>
    <div style="width: 88%;margin: 0 auto;margin-top: 10px;">
      <van-checkbox v-model="checked" checked-color="#ee0a24" style="float: left;margin-right: 5px;"></van-checkbox>
      <p class="prompt" style="padding-left: 5vw;">未注册的手机号验证后将自动创建账号，登录即代表您已同意<a
          style="color: red;" @click="yinsipage()">《用户隐私政策》</a>及<a style="color: red;" @click="useexplain()">《使用说明及规则》</a>
      </p>
    </div>
    <button class="loginbtn" :style="{background:checked?'#ed3036':'#c7c7c7',disable:checked?false:true}"
            @click="login()">立 即 登 录
    </button>
    <!--  v-if="isphone"-->
    <!--    <div class="wxlogin" v-if="isphone" @click="getOpenid">-->
    <!--      <img style="width: 54px;height: auto;" src="../../assets/pay.png" alt="">-->
    <!--    </div>-->
  </div>
</template>
<script>
import {getLogo, phoneLogin, sendCode, wxbindingPhone, wxlogin} from "@/api/login"
import {showFailToast, showSuccessToast} from 'vant';

export default {
  data() {
    return {
      webinfo: [],
      checked: false,
      phone: null,
      phonecode: "",
      show: true,
      count: "",
      timer: null,
      isphone: false,
      wxCode: "",
      openid: "",
      yz_code: "",
      loadingflag: false,
      historyLength: 0
    }
  },
  methods: {
    // 获取登录页信息
    getLoginInfo() {
      getLogo().then(res => {
        if (res.code == 200) {
          this.webinfo = res.data
        }
      })
    },
    // 登录
        // 登录
    async login() {
      if (!this.checked) {
        this.$toast("请阅读并勾选用户协议")
        return;
      }
      const reg = /^1[3-9]\d{9}$/;
      if (reg.test(this.phone) == false) {
        this.$toast("请输入正确手机号")
        return
      }
      if (this.phonecode == "") {
        this.$toast("请输入验证码")
        return
      }

      try {
        let res;
        
        // 1. 发起登录请求
        if (!this.isphone) {
          res = await phoneLogin({
            phone: this.phone,
            code: this.phonecode
          });
        } else {
          res = await wxbindingPhone({
            phone: this.phone,
            code: this.phonecode,
            openid: this.openid,
            yz_code: this.yz_code
          });
        }

        // 2. 判断登录结果
        if (res.code == 200) {
          this.$toast("登录成功");

          // 3. 存储 Token 和 UID 到 Vuex 和 localStorage
          const token = res.data.access_token;
          const uid = res.data.register.id;
          this.$store.commit("settoken", token);
          this.$store.commit("setuid", uid);
          localStorage.setItem('token', token);
          localStorage.setItem('uid', uid);
          
          // 4. 清除 keep-alive 缓存（确保进入首页时重新加载）
          this.$router.options.routes.forEach(item => {
            if (item.meta && item.meta.keep) {
              item.meta.keepAlive = false;
            }
          });

          // 5. 【核心修改】不需要查卡，直接跳到绑卡页，查卡交由 AddCard.vue 的 created 处理
          this.$router.replace("/AddCard");

        } else {
          this.$toast(res.msg || "登录失败");
        }

      } catch (error) {
        console.error("登录流程出现异常:", error);
        this.$toast("网络异常，请稍后重试");
      }
    },
    // 发送短信
    sendPhonecode() {
      sendCode({
        phone: this.phone,
      }).then(res => {
        if (res.data != undefined) {
          if (res.code == 200) {
            this.$toast(res.data)
          } else {
            this.$toast(res.msg)
          }
        }
      })
    },
    // 请求 成功
    showSuccessToast(option) {
      if (option == "success") {
        // 登录成功
        this.$toast({message: "登录成功", type: "success"})
      } else {
        // 发送验证码成功
        this.$toast({message: option, type: "success"})
      }

    },
    // 请求失败
    showFailToast(option) {
      if (option == "fail") {
        // 登录失败
        this.$toast({message: "登录失败", type: "fail"})
      } else {
        // 发送验证码失败
        this.$toast({message: "请输入正确的手机号", type: "fail"})
      }

    },
    // 点击获取验证码  倒计时替换验证码
    getcodetime() {
      // 手机号格式
      const reg = /^1[3-9]\d{9}$/;
      if (reg.test(this.phone) == false) {
        this.showFailToast()
      } else {
        this.show = !this.show
        let TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.sendPhonecode()
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      }
      // 7f7f59afc3639c99dc6c27fbeb956322c947acf119a472e97703b3d5c6b62f55
    },
    //隐私政策页面
    yinsipage() {
      if (this.phone != "" || this.phonecode != "") {
        sessionStorage.setItem("phone", this.phone)
        sessionStorage.setItem("phonecode", this.phonecode)
        sessionStorage.setItem("timecount", this.count)
      }
      // window.location.href = this.$store.state.base + "/yinsizhengce"
     
        this.$router.push({path:"/yinsizhengce"})

    },
    // 使用说明页面
    useexplain() {
      if (this.phone != "" || this.phonecode != "") {
        sessionStorage.setItem("phone", this.phone)
        sessionStorage.setItem("phonecode", this.phonecode)
        sessionStorage.setItem("timecount", this.count)
      }
      // window.location.href = this.$store.state.base + "/useexplain"
      
        this.$router.push({path:"/useexplain"})

    },
  },
  created() {
    this.historyLength = Number(window.history.length)
    if (sessionStorage.getItem("phone") != 'null') {
      this.phone = sessionStorage.getItem("phone")
    }
    if (sessionStorage.getItem("timecount")) {
      this.count = sessionStorage.getItem("timecount")
      this.show = !this.show
      this.timer = setInterval(() => {
        if (this.count > 0) {
          this.count--;
        } else {
          this.show = true;
          sessionStorage.removeItem("timecount")
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    }
    // 获取登录页信息
    this.getLoginInfo()
    if (this.$route.query.isphone) {
      this.isphone = this.$route.query.isphone
    }
    this.openid = this.$route.query.openid
    this.yz_code = this.$route.query.yz_code
  },
  destroyed() {
    // sessionStorage.removeItem("phonecode")
    if (this.phone) {
      sessionStorage.getItem("phone", this.phone)
    }
    if (this.count) {
      sessionStorage.getItem("count", this.count)
    }
  }
}
</script>

<style scoped>
.login .picbox {
  width: 100%;
  text-align: center;
}

.login .wrap {
  text-align: center;
  position: relative;
}

.login .wrap .phone, .code {
  width: 84%;
  height: 40px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  background-color: #f0f0f0;
  padding: 5px;
  font-size: 14px;
  padding-left: 15px;
}

.login .wrap .send {
  position: absolute;
  font-size: .7rem;
  right: 9vw;
  color: red;
  bottom: 18px;
  border: none;
}

.login .prompt {
  font-size: .7rem;
  width: 90%;
  margin: 0 auto;
  line-height: 20px;
  margin-top: 1vh;
}

.login .loginbtn {
  width: 84%;
  height: 45px;
  border-radius: 5px;
  border: none;
  /* background-color: #c7c7c7; */
  background-color: #ed3036;
  color: #fff;
  font-size: 16px;
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}

.login .wxlogin {
  width: 10vw;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 40px;
}

.logo {
  width: 165px;
  margin: auto;
  padding-top: 10px;
}
</style>