<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 商品信息 -->
    <div class="addressBox addressBox2">
      <div class="platform-header">
        <span class="platform-tag">途虎养车</span>
      </div>

      <div class="shopInfo" v-for="item in orderList" :key="item.id">
        <div class="shopImg">
          <div class="face-block-small">
            <!-- <div class="face-value">{{ item.face || item.price }}</div> -->
          </div>
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.title }}</div>
          <div class="can" v-if="item.price">面值：{{ item.price }}</div>
          <div class="all">
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(item.sell_price).toFixed(2) }}
            </div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <!-- 充值账号 -->
      <div class="recharge-row" v-if="rechargeUuid">
        <span class="recharge-label">充值账号</span>
        <span class="recharge-value">{{ rechargeUuid }}</span>
      </div>

      <!-- 金额汇总 -->
      <div class="platform-summary">
        <div class="orderInfo">
          <div class="shopPrice">
            <div class="shopPriceText">商品金额</div>
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(total).toFixed(2) }}
            </div>
          </div>
          <div class="shopPrice" v-if="payPlan.dkprice > 0">
            <div class="shopPriceText">福利卡抵扣</div>
            <div class="price">
              -<span style="font-size: 10px;">￥</span>{{ Number(payPlan.dkprice).toFixed(2) }}
            </div>
          </div>
          <div class="shopPrice" v-if="payPlan.wxprice > 0">
            <div class="shopPriceText">微信支付</div>
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(payPlan.wxprice).toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="group-subtotal">
          应付：<div class="price"><span style="font-size: 10px;">￥</span>{{ Number(total).toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 支付方式（福利卡选择） -->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>

    <!-- 支付按钮 -->
    <div class="footer">
      <div class="allNumber">共{{ totalCount }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">
            合计: <span class="price">{{ changePrice1(total) }}</span><span class="priceNum">.{{ changePrice2(total)
            }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>

    <div class="loadingBox" v-if="isLoading && !isShow">
      <loading :loadingText="0"></loading>
    </div>

    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>

<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
import { cardList, userInfo } from "@/api/lhjdtm";
import {
  tuhuOrderDetail,
  tuhuPrePay,
  tuhuPayByCard,
  tuhuWxPay
} from "@/api/tuhu";

export default {
  name: "TuHuConfirmOrder",
  components: { Payment, PayPassword },
  data() {
    return {
      loadingflag: true,
      isLoading: false,

      order_id: "",
      total: 0,
      orderList: [],
      rechargeUuid: "",

      cardList: [],
      result: [],
      checked: "",
      isPaying: false,
      payPlan: {
        pay_amount: 0,
        dkprice: 0,
        wxprice: 0,
        pay_type: "",
        has_pay_pass: 0
      },

      isSet: false,
      isShow: false,
      pass: ""
    };
  },
  computed: {
    totalCount() {
      return this.orderList.reduce((s, i) => s + Number(i.quantity || 0), 0);
    }
  },
  methods: {
    changePrice1(price) {
      if (!price) return "0";
      return Number(price).toFixed(2).split(".")[0];
    },
    changePrice2(price) {
      if (!price) return "00";
      return Number(price).toFixed(2).split(".")[1];
    },

    getResult(result, checked) {
      this.result = result;
      this.checked = checked;
    },

    // ============ 订单详情 ============
    getOrderDetail() {
      return tuhuOrderDetail(this.order_id).then(res => {
        if (res.code == 200 && res.data) {
          const d = res.data;
          // ⚠ 接口不返回商品信息，只返回订单状态和金额
          this.total = Number(d.pay_amount || this.total || 0);
          this.loadingflag = false;
        } else {
          this.loadingflag = false;
          this.$toast(res.msg || "获取订单详情失败");
        }
      }).catch(() => {
        this.loadingflag = false;
        this.$toast("网络异常");
      });
    },

    // ============ 支付预计算 ============
    async fetchPrePay() {
      try {
        const res = await tuhuPrePay({
          order_id: Number(this.order_id),
          card_num_ids: (this.result || []).join(",")
        });
        if (res.code == 200 && res.data) {
          this.payPlan = {
            pay_amount: Number(res.data.pay_amount || 0),
            dkprice: Number(res.data.dkprice || 0),
            wxprice: Number(res.data.wxprice || 0),
            pay_type: res.data.pay_type || "",
            has_pay_pass: res.data.has_pay_pass || 0
          };
          this.isSet = this.payPlan.has_pay_pass === 1;
          return this.payPlan;
        } else {
          this.$toast(res.msg || "获取支付计划失败");
          return null;
        }
      } catch (e) {
        this.$toast("网络异常");
        return null;
      }
    },

    // ============ 支付方式 ============
    getCard() {
      cardList().then(res => {
        if (res.code == 200) {
          this.cardList = (res.data.data || [])
            .filter(item => item.is_expired !== 1)
            .map(item => ({
              id: item.id,
              balance: item.balance,
              disabled: item.disabled,
              title: item.card ? item.card.title : "",
              num: item.num,
              expire_time_text: item.expire_time_text || ""
            }));
          this.result = [];
        }
      });
    },

    checkPayPwd() {
      userInfo().then(res => {
        if (res.code == 200) {
          this.isSet = res.data && res.data.has_pay_pwd == 1;
        }
      });
    },

    isWeiXin() {
      return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    },

    // ============ 去支付 ============
    async toPay() {
      // 防重复点击，用 isLoading / isPaying
      if (this.isLoading || this.isPaying) return;

      if (!this.result || this.result.length === 0) {
        this.$toast("请选择福利卡支付");
        return;
      }

      this.isLoading = true;
      this.isPaying = true;

      try {
        const plan = await this.fetchPrePay();
        if (!plan) {
          this.isLoading = false;
          this.isPaying = false;
          return;
        }

        if (plan.wxprice === 0) {
          if (!this.isSet) {
            this.isLoading = false;
            this.isPaying = false;
            this.$toast("请先设置支付密码");
            sessionStorage.setItem("tuHuConfirmOrderId", this.order_id);
            this.$router.push({ path: "/payPassword", query: { from: "tuHuConfirm" } });
            return;
          }
          // ✅ 纯卡支付：先关再开，避免状态冲突
          this.isShow = false;
          this.isLoading = false;
          this.isPaying = false;
          this.$nextTick(() => {
            this.isShow = true;
            console.log("[TuHu] 打开密码框 isShow =", this.isShow);
          });
          return;
        }
        if (!this.isWeiXin()) {
          this.isLoading = false;
          this.isPaying = false;
          this.$toast("请使用微信打开支付");
          return;
        }

        // 卡 + 微信组合：走微信
        this.payByWechat();
      } catch (e) {
        this.isLoading = false;
        this.isPaying = false;
        this.$toast("网络异常");
      }
    },

    input(e) {
      console.log("[TuHu] PayPassword emit input =", e, "isShow 当前 =", this.isShow);
      this.isShow = e;
      if (!e) {
        this.isLoading = false;
        this.isPaying = false;
        this.pass = "";
      }
    },
    // ============ 微信支付 ============
    payByWechat() {
      const payload = {
        order_id: Number(this.order_id),
        openid: localStorage.getItem("openid"),
        use_card: 1
      };
      if (this.result && this.result.length > 0) {
        payload.card_num_ids = this.result.join(",");
      }

      tuhuWxPay(payload).then(res => {
        this.isPaying = false;
        this.isLoading = false;
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no);
        } else if (res.code == 4) {
          // 后端说余额够，走纯卡密码
          this.isShow = true;
        } else {
          this.$toast(res.msg || "支付失败");
        }
      }).catch(() => {
        this.isPaying = false;
        this.isLoading = false;
        this.$toast("网络异常");
      });
    },
    onBridgeReady(params, order_no) {
      this.isLoading = false;
      if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", () => {
            this.invokeWxPay(params, order_no);
          }, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", () => {
            this.invokeWxPay(params, order_no);
          });
          document.attachEvent("onWeixinJSBridgeReady", () => {
            this.invokeWxPay(params, order_no);
          });
        }
        return;
      }
      this.invokeWxPay(params, order_no);
    },

    invokeWxPay(params, order_no) {
      WeixinJSBridge.invoke("getBrandWCPayRequest", {
        appId: params.appId,
        timeStamp: params.timestamp || params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign
      }, res => {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          this.$toast("支付成功");
          setTimeout(() => this.$router.replace("/orderInfo"), 1000);
        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          this.$toast("已取消支付");
        } else {
          this.$toast("支付失败");
        }
      });
    },

    // ============ 纯卡密码输入 ============

    onInput(key) {
      this.pass = key;
      if (this.pass.length !== 6) return;

      this.isShow = false;   // 先关框
      this.isPaying = true;
      this.isLoading = true;

      const payload = {
        order_id: Number(this.order_id),
        pay_pass: this.pass
      };
      if (this.result && this.result.length > 0) {
        payload.card_num_ids = this.result.join(",");
      }

      tuhuPayByCard(payload).then(res => {
        this.isPaying = false;
        this.isLoading = false;
        if (res.code == 200) {
          this.$toast("支付成功");
          setTimeout(() => this.$router.replace("/orderInfo"), 1000);
        } else {
          this.pass = "";
          this.$toast(res.msg || "支付失败");
          // 密码错，重新打开密码框让用户重输
          this.isShow = true;
        }
      }).catch(() => {
        this.isPaying = false;
        this.isLoading = false;
        this.$toast("支付失败，请重试");
        this.pass = "";
        this.isShow = true;
      });
    },
  },
  created() {
    if (this.$route.query.order_id) {
      this.order_id = this.$route.query.order_id;

      // ⚠ 从 query 恢复商品信息
      const q = this.$route.query;
      this.rechargeUuid = q.uuid || "";
      if (q.item_name) {
        this.orderList = [{
          id: 0,
          title: q.item_name || "",
          img: "",
          face: q.item_face || "",
          sell_price: Number(q.item_price) || 0,
          quantity: 1
        }];
        this.total = Number(q.item_price) || 0;
      }

      this.getOrderDetail();
      this.getCard();
      this.checkPayPwd();
      this.fetchPrePay();
    } else {
      this.$toast("缺少订单信息");
      setTimeout(() => this.$router.go(-1), 800);
    }
  }
};
</script>

<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 66px;
}

.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.addressBox3 {
  padding: 0px;
}

.platform-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #F5F5F5;
  margin-bottom: 10px;
}

.platform-tag {
  font-size: 14px;
  font-weight: 600;
  color: #342C2C;
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 0px;
  }

  .nameBox {
    width: 100%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }

  .can {
    margin-top: 13px;
    font-size: 13px;
    color: #979797;
  }

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .price {
    color: #C63532;
    font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.recharge-row {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #F5F5F5;
  font-size: 13px;

  .recharge-label {
    color: #828282;
  }

  .recharge-value {
    color: #333;
    font-weight: 500;
  }
}

.platform-summary {
  margin-top: 15px;
  border-top: 1px solid #F5F5F5;
  padding-top: 10px;
}

.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
  }

  .price {
    font-size: 14px;
    font-weight: bold;
  }
}

.group-subtotal {
  width: 100%;

  text-align: right;
  font-size: 13px;
  margin-top: 10px;
  color: #333;

  .price {
    display: inline-block;
    color: #C93F3D;
    font-weight: bold;
    font-size: 16px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #F65958, #DD0A09);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .allNumber {
    font-size: 13px;
    color: #7a7979;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.loadingBox {
  width: 122px;
  position: fixed;
  top: calc(50% - 17px);
  left: calc(50% - 61px);
  background-color: rgba(50, 50, 51, .88);
  border-radius: 4px;
  height: 34px;
  line-height: 27px;
}

/deep/ .van-loading {
  color: white !important;
}

/deep/ .loadingText {
  color: #ffffff !important;
}
</style>