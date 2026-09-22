<template>
  <div class="bindPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    
    <!-- 扫码绑定 -->
    <div class="btn" @click="scanQRCode" v-if="isWeiXin()">扫码绑定</div>
    
    <!-- 券密绑定 -->
    <div class="btn" style="margin-top: 20px" @click="toCouponCode">券密绑定</div>
    
    <!-- 温馨提示 -->
    <div class="prompt">
      <div class="title">{{ bindInfo?.title }}</div>
      <div class="promptText" v-html="bindInfo?.content"></div>
    </div>
  </div>
</template>

<script>
import VConsole from 'vconsole';
const vConsole = new VConsole(); // 调试用，上线后建议删除这两行
import { bindingcard, scanbinding, getWechat } from "@/api/lhcard";
import wx from "weixin-js-sdk";

export default {
  name: "BindingCard",
  data() {
    return {
      bindInfo: {},
      info: {},
      isConfigReady: false // 新增：用于控制按钮可点击状态
    }
  },
  created() {
    this.getBindingInfo();
    this.getbindingcard();
  },
  methods: {
    // 1. 获取页面底部的温馨提示
    getBindingInfo() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');

      bindingcard({
        url: purl
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.bindInfo = res.data.single || {};
        }
      }).catch(err => {
        console.error("获取温馨提示失败", err);
      })
    },

    // 2. 检查是否在微信环境
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },

    // 3. 跳转券密绑定
    toCouponCode() {
      this.$router.push("/couponCode");
    },

    // 4. 获取微信 JSSDK 配置
    getbindingcard() {
      // 获取当前页面的完整URL（不包含#后面的部分），这是微信签名必须的
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      let token = localStorage.getItem("token");

      getWechat({
        token,
        url: purl
      }).then(res => {
        if (res.code == 200) {
          const configData = res.data;
          this.info = configData; // 将配置保存下来，防止后续扫码时丢失

          // 绑定微信 wx.config
          wx.config({
            debug: false,
            appId: configData.appId,
            timestamp: "" + configData.timestamp,
            nonceStr: configData.nonceStr,
            signature: configData.signature,
            jsApiList: ['scanQRCode', 'checkJsApi']
          });

          console.log("wx.config 配置完毕", configData);

          // 放行按钮
          this.isConfigReady = true;

        } else {
          this.$toast(res.msg || "获取微信配置失败");
        }
      }).catch(err => {
        console.error("获取微信配置出错", err);
        this.$toast("微信配置获取异常，请重试");
      });
    },

    // 5. 唤起扫一扫
    scanQRCode() {
      let _that = this;

      // 安全保护：如果配置还没准备好，提示用户等待
      if (!this.isConfigReady) {
        this.$toast("微信配置加载中，请稍后重试");
        return;
      }

      // 如果 wx 对象没加载出来，直接报错
      if (typeof wx === 'undefined') {
        this.$toast("微信环境检测失败，请刷新重试");
        return;
      }

      // 调用微信扫一扫
      wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: function (res) {
          // res.resultStr 是扫码得到的内容（格式取决于后端生成二维码的规则）
          let content = res.resultStr;
          let token = localStorage.getItem("token");

          console.log("微信扫码获取到的内容:", content);

          // 调用后端接口进行绑定
          scanbinding({
            token,
            content: content
          }).then(res => {
            if (res.code == 200) {
              _that.$toast.success(res.data || "绑定成功");
              setTimeout(() => {
                _that.$router.go(-1);
              }, 1000);
            } else {
              _that.$toast.fail(res.msg || "绑定失败");
            }
          }).catch(err => {
            console.error("绑定接口报错", err);
            _that.$toast.fail("网络异常，请稍后重试");
          });
        },
        fail: function (err) {
          console.error('微信扫码失败:', err);
          _that.$toast("用户取消扫码或扫码失败");
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.bindPage {
  padding: 80px 20px;
}

.btn {
  background: linear-gradient(90deg, #FF4A25 0%, #FEA345 100%);
  color: white;
  border-radius: 50px;
  text-align: center;
  padding: 8px 10px;
  font-size: 16px;
  letter-spacing: 2px;
  height: 28px;
  line-height: 28px;
  /* 禁用状态 */
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.prompt {
  margin-top: 43px;
  color: #807f7f;
  font-size: 12px;
  line-height: 18px;
}

.title {
  font-size: 15px;
  color: #353535;
  font-weight: bold;
}

.promptText {
  margin-top: 8px;
}

/deep/ .promptText p {
  margin-top: 2px;
}

/deep/ .promptText p span {
  color: #807f7f !important;
}
</style>