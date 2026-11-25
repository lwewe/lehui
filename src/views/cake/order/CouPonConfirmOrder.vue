<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    商品信息-->
    <div class="addressBox">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="coupons.img" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ coupons.title }}</div>
          <div class="noReapt">不可退换</div>
          <div class="all">
            <div class="price">￥{{ coupons.price }}</div>
            <div class="number">
              <!-- 这里的 max 直接绑定 limitNum -->
              <van-stepper :min="1" :max="limitNum" v-model="safeValueNumber" integer />
            </div>
          </div>
        </div>
      </div>
      <div class="totalBox">合计:
        <!-- 全部替换成 innerValue -->
        <span class="priceIcon">￥</span>
        <span class="price2">{{ changePrice1(coupons.price * innerValue) }}</span>
        <span class="priceNmber">.{{ changePrice2(coupons.price * innerValue) }}</span>
      </div>
    </div>
    <!--    支付方式-->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付按钮-->
    <div class="footer">
      <!-- 全部替换成 innerValue -->
      <div class="allNumber">共{{ innerValue }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">合计:
            <span class="price">{{ changePrice1(coupons.price * innerValue) }}</span>
            <span class="priceNum">.{{ changePrice2(coupons.price * innerValue) }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--    支付密码-->
    <PayPassword v-if="isShow" :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
import {
  couponsAddNum,
  couponsPayDate,
  couponsPayByCard,
  couponsPayByWx,
  couponsPaySuccess,
  getCouponsDetail,
  getCouponsCardList
} from "@/api/lehuicake";

export default {
  name: "ConfirmOrder",
  components: { PayPassword, Payment },
  data() {
    return {
      cardList: [],
      result: [],
      checked: "",
      isShow: false,
      code: "",
      dkprice: "",
      wxprice: "",
      ka_ids: [],
      pass: "",
      openid: "",
      loadingflag: true,
      isLoading: false,

      innerValue: 1, // 实际选择的数量
      limitNum: 1,   // 后端限制的最大购买量

      brand: {},
      coupons: {},
      cid: "2",
    };
  },
  computed: {
    // 核心：限制数量并完美拦截
    safeValueNumber: {
      get() {
        return this.innerValue;
      },
      set(val) {
        let num = parseInt(val) || 1;
        if (num > this.limitNum) {
          this.$toast(`该电子券最多只能购买 ${this.limitNum} 件`);
          this.innerValue = this.limitNum;
        } else {
          this.innerValue = num;
        }
      }
    }
  },
  watch: {
    // 数量改变时，重新计算总价
    innerValue(newVal) {
      if (this.coupons.id) {
        this.dkprice = "";
        this.wxprice = "";
        this.ka_ids = [];
        this.code = "";
        this.updateTotalPrice(newVal);
      }
    }
  },
  methods: {
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },

    // 【微信支付回调处理（绝对纯净版）】
    onBridgeReady(params, order_no) {
      var that = this;

      // 1. 打印排查（如果还报错，就把这里打印的发给后端）
      console.log("收到的微信支付参数:", params);

      // 2. 极其暴力的取值（兼容各种大小写、拼写错误）
      let timeStampStr = params.timeStamp || params.timestamp || params.time_stamp || "";
      let appIdStr = params.appId || params.appid || "";
      let nonceStrStr = params.nonceStr || params.noncestr || params.nonce_str || "";

      if (!timeStampStr || !appIdStr || !nonceStrStr) {
        that.$toast("微信支付参数缺失，请重试");
        that.isLoading = false;
        return;
      }

      // 3. 手动组装纯净的 JS 对象，绝不带任何多余属性
      let wxPayload = {
        appId: appIdStr,
        timeStamp: timeStampStr.toString(),
        nonceStr: nonceStrStr,
        package: params.package || params.packagestr || "",
        signType: params.signType || params.sign_type || "MD5",
        paySign: params.paySign || params.paysign || params.pay_sign || "",
      };

      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        wxPayload,
        function (res) {
          that.isLoading = false;

          if (res.err_msg === "get_brand_wcpay_request:ok") {
            that.$toast("支付成功！");
            couponsPaySuccess(order_no).then((payRes) => {
              that.getCard();
              if (payRes.code == 200) {
                setTimeout(() => {
                  that.$router.replace({ path: "/orderInfo", query: {  refresh: Date.now() } });
                }, 1000);
              } else {
                that.$toast(payRes.msg || "支付成功，但后台校验异常");
              }
            }).catch(err => {
              console.error("回调检测异常", err);
              that.$toast("支付完成，但网络异常");
            });
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            that.$toast("微信支付失败");
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            that.$toast("您取消了支付");
          }
        }
      );
    },

    // 接收支付方式选择
    getResult(result, checked) {
      this.result = Array.isArray(result) ? result : [];
      this.checked = checked;
    },

    // 更新数量计算总价
    updateTotalPrice(shuliang) {
      couponsAddNum({
        cid: this.cid,
        id: this.coupons.id,
        shuliang: shuliang
      }).then((res) => {
        if (res.code == 200 && res.data) {
          console.log("【增加数量接口返回】:", res.data);
        } else {
          this.$toast(res.msg || "数量更新失败");
          this.innerValue = 1;
        }
      }).catch((err) => {
        console.error("增加数量接口报错:", err);
        this.innerValue = 1;
      });
    },

    // 点击去支付
    toPay() {
      if (this.isLoading) return;
      if ((!this.result || this.result.length === 0) && !this.checked) {
        this.$toast("请选择支付方式");
        return;
      }

      // 预先关闭密码框并开启 Loading
      this.isShow = false;
      this.isLoading = true;
      this.judgmentPayDate();
    },

    // 判断是卡支付还是微信支付
    judgmentPayDate() {
      let fulikaStr = this.result.join(",");
      let data = {
        cid: this.cid,
        fulika: fulikaStr,
        shuliang: this.innerValue,
        id: this.coupons.id
      };

      couponsPayDate(data).then((res) => {
        if (res.code == 200) {
          const wxPriceNum = Number(res.data.wxprice) || 0;
          const dkPriceNum = Number(res.data.dkprice) || 0;

          this.dkprice = res.data.dkprice;
          this.wxprice = res.data.wxprice;
          this.ka_ids = res.data.ka_ids;
          this.code = res.data.code;

          // ===== 归一化：算最终 dk / wx =====
          const goodsTotal = Number((Number(this.coupons.price || 0) * Number(this.innerValue || 1)).toFixed(2));
          const hasCard = fulikaStr !== "" && Array.isArray(this.ka_ids) && this.ka_ids.length > 0;

          let finalDk = dkPriceNum;
          let finalWx = wxPriceNum;

          if (finalDk > goodsTotal) finalDk = goodsTotal;      // 卡抵扣不超总价
          finalWx = Number((goodsTotal - finalDk).toFixed(2));  // 微信应付 = 总价 − 卡抵扣（恒等式）
          if (!hasCard) { finalDk = 0; finalWx = goodsTotal; }  // 没选卡 → 全微信
          finalDk = Math.max(0, finalDk);
          finalWx = Math.max(0, finalWx);

          // 写回最终值
          this.dkprice = finalDk;
          this.wxprice = finalWx;

          console.log("【支付拆分】", { 总价: goodsTotal, dk: finalDk, wx: finalWx, hasCard });

          // ===== 统一按最终值分支 =====
          if (finalWx > 0) {
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付");
              this.isLoading = false;
              return;
            }
            this.shoptoWxpay();
          } else {
            if (finalDk > 0) {
              this.isShow = true;
              this.isLoading = false;
            } else {
              this.$toast("请先选择福利卡支付");
              this.isLoading = false;
            }
          }
          // ===== 结束 =====



        } else {
          this.isLoading = false;
          this.$toast(res.msg || "计算支付价格失败");
        }
      }).catch((err) => {
        this.isLoading = false;
        this.$toast("网络请求失败");
        console.error("【计算卡支付报错】", err);
      });
    },

    // 接收密码并支付
    onInput(key) {
      this.pass = key;
      if (this.pass.length == 6) {
        this.isShow = false;
        this.isLoading = true; // 输入完密码后开启 Loading 防止连点
        this.flkpay(this.pass);
        this.pass = "";
      }
    },

    input(e) {
      if (e === false) {
        this.isShow = false;
      }
    },

    // 纯福利卡支付
    flkpay(pass) {
      let kaIdsStr = JSON.stringify(this.ka_ids);
      let data = {
        cid: this.cid,
        ka_ids: kaIdsStr,
        dkprice: this.dkprice,
        pass: pass,
        code: this.code,
        shuliang: this.innerValue,
        id: this.coupons.id
      };

      couponsPayByCard(data).then((res) => {
        this.isLoading = false;
        if (res.code == 200 && res.data) {
          this.$toast("支付成功！");
          // 【核心】卡支付成功后，同样需要通知后端
          couponsPaySuccess(res.data.order_no).then(() => {
            this.getCard();
            setTimeout(() => {
              this.$router.replace({ path: "/orderInfo", query: { refresh: Date.now()  } });
            }, 1000);
          });
        } else {
          this.$toast(res.msg || "支付失败");
        }
      }).catch(() => {
        this.isLoading = false;
        this.$toast("网络异常");
      });
    },

    // 发起微信支付（获取支付参数）
    shoptoWxpay() {
      // ===== 联合支付下单前校验 =====
      const goodsTotal = Number((Number(this.coupons.price || 0) * Number(this.innerValue || 1)).toFixed(2));
      const dk = Number(this.dkprice) || 0;
      const wx = Number(this.wxprice) || 0;

      if (Math.abs(dk + wx - goodsTotal) > 0.01) {
        this.isLoading = false;
        this.$toast("支付金额计算异常，请重试");
        console.error("【联合支付金额异常】总价:", goodsTotal, "dkprice:", dk, "wxprice:", wx, "加和:", dk + wx);
        return;
      }
      // ===== 校验结束 =====
      let data = {
        cid: this.cid,
        ka_ids: JSON.stringify(this.ka_ids),
        dkprice: this.dkprice,
        wxprice: this.wxprice,
        openid: this.openid,
        code: this.code,
        shuliang: this.innerValue,
        id: this.coupons.id
      };

      couponsPayByWx(data).then((res) => {
        this.isLoading = false;
        if (res.code == 200 && res.data) {
          // 这里我们直接传 JSON 字符串再解析，彻底剥离 Vue 的响应式代理
          let cleanParams = JSON.parse(JSON.stringify(res.data.jsApiParameters));

          this.onBridgeReady(cleanParams, res.data.order_no);
        } else {
          this.$toast(res.msg || "微信支付下单失败");
        }
      }).catch(() => {
        this.isLoading = false;
        this.$toast("网络异常");
      });
    },
    changePrice1(price) {
      if (!price && price !== 0) return "0";
      return price.toString().includes(".") ? price.toString().split(".")[0] : price;
    },
    changePrice2(price) {
      if (!price && price !== 0) return "00";
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split(".")[1] : "00";
    },

    getCard() {
      getCouponsCardList().then((res) => {
        if (res.code == 200) {
          const listData = res.data?.data || res.data;
          this.cardList = Array.isArray(listData) ? listData : [];
          if (this.cardList.length !== 0 && this.result.length === 0) {
            this.result = [this.cardList[0].id];
          }
        }
      });
    },

    getCouPonShopDetail(id) {
      this.loadingflag = true;
      if (this.$route.query.cid) {
        this.cid = this.$route.query.cid;
      }

      getCouponsDetail({
        cid: this.cid,
        id: id
      }).then((res) => {
        this.loadingflag = false;
        const resData = res.data?.data || res.data;
        if (res.code == 200) {
          this.brand = resData.brand || {};
          this.coupons = resData.coupons || {};
          // 强制将限购数量赋值给 limitNum，如果接口没返回，默认为1
          this.limitNum = Number(this.coupons.num) || 1;
        }
      }).catch(() => {
        this.loadingflag = false;
      });
    },
  },
  created() {
    this.getCard();
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid");
    }
    const id = this.$route.query.id;
    if (id) {
      this.getCouPonShopDetail(id);
    } else {
      this.loadingflag = false;
    }
  },
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
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.addressBox3 {
  padding: 0px;
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

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.textarea {
  background-color: #F6F6F6;
  height: 94px;
  border-radius: 3px;
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.textarea textarea {
  border: none;
  background-color: #fff0;
  font-size: 13px;
}


.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 80px;
    height: 80px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    /* 显示两行 */
  }

  .can {
    margin-top: 7px;
    font-size: 13px;
    color: #979797;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
    /* 显示两行 */
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


.noReapt {
  color: #D25D5B;
  border: 1px solid #D25D5B;
  display: inline-block;
  font-size: 10px;
  margin-top: 5px;
  border-radius: 2px;
  padding: 0px 5px 1px;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after,
.van-stepper__minus::before,
/deep/ .van-stepper__plus::after,
/deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.totalBox {
  border-top: 1px solid #F6F6F6;
  margin-top: 10px;
  padding-top: 10px;
  text-align: end;
  font-size: 14px;
}

.priceIcon {
  color: #CB4342;
  font-size: 13px;
}

.price2 {
  color: #CB4342;
  font-size: 16px;
}

.priceNmber {
  color: #CB4342;
  font-size: 13px;
}
</style>