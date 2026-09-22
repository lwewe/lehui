<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 地址（只读，从上一页带过来） -->
    <div class="addressBox">
      <div class="address">
        <div v-if="!addrShow" style="font-size: 14px">未获取到配送地址</div>
        <div class="leftBox" v-else>
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ addrShow.name }}</span>
              <span class="phone">{{ addrShow.phone }}</span>
            </div>
            <div class="addressDetail">{{ addrShow.addr }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 盒马商品信息 -->
    <div class="addressBox addressBox2">
      <div class="platform-header">
        <span class="platform-tag">盒马</span>
      </div>

      <div class="shopInfo" v-for="item in orderList" :key="item.id">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="item.img" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.title }}</div>
          <div class="can" v-if="item.spec_name">{{ item.spec_name }}</div>
          <div class="all">
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(item.sell_price).toFixed(2) }}
            </div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <div class="platform-summary">
        <div class="orderInfo">
          <div class="shopPrice">
            <div class="shopPriceText">商品金额</div>
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(goodsTotal).toFixed(2) }}
            </div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">运费</div>
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ Number(freight || 0).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式（福利卡） -->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>

    <!-- 支付按钮 -->
    <div class="footer">
      <div class="allNumber">共{{ totalCount }}件</div>
      <div class="rightBox">
        <div class="all">
          合计:
          <span class="price">{{ changePrice1(total) }}</span><span class="priceNum">.{{ changePrice2(total) }}</span>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>

    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>

    <!-- 支付密码 -->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>

<script>
// import { orderDetail, cardList, userInfo } from "@/api/lhjdtm";
// ⚠ 按你实际接口名替换
// import { hemaPay, hemaPayByCard } from "@/api/hemaapi";

import { wxPay } from "@/api/cart";          // 或你项目里 wxPay 所在位置
import { cardList, userInfo, payByCard, orderDetail } from "@/api/lhjdtm";

import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";

export default {
  name: "ConfirmOrderHema",
  components: { Payment, PayPassword },
  data() {
    return {
      loadingflag: true,
      isLoading: false,

      order_id: "",
      order_no: "",
      total: 0,
      goodsTotal: 0,
      freight: 0,

      orderList: [],
      addrShow: null,

      // 支付相关
      cardList: [],
      result: [],
      checked: "",
      isShow: false,
      pass: "",
      isSet: false
    };
  },
  computed: {
    totalCount() {
      return this.orderList.reduce((s, i) => s + Number(i.quantity), 0);
    },
    selectedCardBalance() {
      if (!this.result || this.result.length === 0) return 0;
      return this.result.reduce((sum, id) => {

        const card = this.cardList.find(c => String(c.id) === String(id))
        if (!card || card.disabled == 1) return sum;
        return sum + Number(card.balance);
      }, 0);
    }
  },
  methods: {
    toPay() {
      if (this.isLoading) return;
      if (!this.addrShow || !this.addrShow.addr) return this.$toast("缺少收货地址");
      if (!this.order_id) return this.$toast("订单信息缺失");

      // ✅ 先拦"没选卡"
      if (this.result.length == 0 && !this.checked) {
        this.$toast("请选择福利卡支付");
        return;
      }



      this.isLoading = true;

      userInfo().then(res => {
        if (res.code == 200) {
          this.isSet = res.data.has_pay_pwd == 1;
          this.doPay();
        } else {
          this.isLoading = false;
          this.$toast(res.msg || '获取用户信息失败');
        }
      }).catch(() => {
        this.isLoading = false;
        this.$toast('网络异常');
      });
    },
    isWeiXin() {
      return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    },

    // 支付方式组件回调
    getResult(result, checked) {
      this.result = result;
      this.checked = checked;
    },

    // 福利卡列表
    getCard() {
      cardList().then(res => {
        if (res.code == 200) {
          this.cardList = (res.data.data || []).filter(item => item.is_expired !== 1).map(item => ({
            id: item.id,
            balance: item.balance,
            disabled: item.disabled,
            title: item.card ? item.card.title : '',
            num: item.num,
            expire_time_text: item.expire_time_text || ''
          }));
          this.result = []; // 默认不选
        }
      });
    },

    // 是否设置支付密码
    checkPayPwd() {
      userInfo().then(res => {
        if (res.code == 200) {
          this.isSet = res.data && res.data.has_pay_pwd == 1;
        }
      });
    },

    // 订单详情
    getOrderDetail() {
      return orderDetail({ id: this.order_id }).then(res => {
        if (res.code == 200 && res.data) {
          const detail = res.data;

          const items = (detail.items && detail.items.length)
            ? detail.items
            : [{
              id: 0,
              product_title: detail.product_title,
              product_img: detail.product_img,
              sell_price: detail.sell_price,
              spec_name: '',
              quantity: detail.quantity
            }];

          this.orderList = items.map((it, idx) => ({
            id: it.id || idx,
            title: it.product_title || it.title,
            img: it.product_img || it.img,
            sell_price: it.sell_price,
            spec_name: it.spec_name || '',
            quantity: Number(it.quantity) || 1
          }));

          this.goodsTotal = Number(detail.total_price) || 0;
          this.freight = Number(detail.freight) || 0;
          this.total = this.goodsTotal + this.freight;

          this.loadingflag = false;
        } else {
          this.loadingflag = false;
          this.$toast(res.msg || '获取订单详情失败');
        }
      }).catch(() => {
        this.loadingflag = false;
        this.$toast('网络异常');
      });
    },

    // 支付入口

    doPay() {
      // 1. 没选卡 → 纯微信（有 toPay 拦截，实际走不到）
      if (!this.result || this.result.length === 0) {
        if (!this.isWeiXin()) {
          this.$toast("请使用微信打开支付");
          this.isLoading = false;
          return;
        }
        this.payByWechat([]);
        return;
      }

      // 2. 选了卡 → 判断余额
      const enough = this.selectedCardBalance >= Number(this.total);

      if (enough) {
        // 余额够 → 弹密码
        if (!this.isSet) {
          this.$toast("请先设置支付密码");
          this.isLoading = false;
          this.$router.push({ path: "/payPassword", query: { from: 'confirmHema' } });
          return;
        }
        this.isShow = false;
        this.$nextTick(() => {
          this.isShow = true;
          this.isLoading = false;
        });
        return;
      }

      // 3. 余额不够 → 卡 + 微信
      if (!this.isWeiXin()) {
        this.$toast("请使用微信打开支付");
        this.isLoading = false;
        return;
      }
      this.payByWechat(this.result);
    },

    // 微信 / 组合支付
    payByWechat(kaIds) {
      const wxPayload = {
        order_id: Number(this.order_id),
        order_no: this.order_no,
        openid: localStorage.getItem("openid")
      };
      if (kaIds && kaIds.length > 0) {
        wxPayload.ka_ids = kaIds.join(',');
      }

      wxPay(wxPayload).then(res => {
        if (res.code == 200 && res.data && res.data.jsApiParameters) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no);
        } else if (res.code == 4) {
          // 卡余额够，走 payByCard 输密码
          this.isLoading = false;
          this.isShow = true;
        } else {
          this.isLoading = false;
          this.$toast(res.msg || "支付失败");
        }
      }).catch(() => {
        this.isLoading = false;
        this.$toast("网络异常");
      });
    },

    // 福利卡密码支付
    onInput(key) {
      this.pass = key;
      if (this.pass.length == 6) {
        this.isShow = false;

        payByCard({
          order_id: Number(this.order_id),
          card_num_ids: (this.result || []).join(','),
          pay_pass: this.pass
        }).then(res => {
          if (res.code == 200) {
            this.$toast('支付成功');
            setTimeout(() => this.$router.replace("/orderInfo"), 1000);
          } else {
            this.pass = "";
            this.$toast(res.msg || '支付失败');
          }
        }).catch(() => {
          this.pass = "";
          this.$toast('支付失败，请重试');
        });
      }
    },

    input(e) {
      this.isShow = e;
      this.isLoading = false;
    },

    onBridgeReady(params, order_no) {
      this.isLoading = false;

      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no);
          }, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no);
          });
          document.attachEvent('onWeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no);
          });
        }
        return;
      }

      this.invokeWxPay(params, order_no);
    },

    invokeWxPay(params, order_no) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        appId: params.appId,
        timeStamp: params.timestamp || params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign
      }, res => {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          this.$toast('支付成功');
          setTimeout(() => this.$router.replace("/orderInfo"), 1000);
        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          this.$toast('已取消支付');
        } else {
          this.$toast('支付失败');
        }
      });
    },

    changePrice1(price) {
      if (!price) return '0';
      return Number(price).toFixed(2).split('.')[0];
    },
    changePrice2(price) {
      if (!price) return '00';
      return Number(price).toFixed(2).split('.')[1];
    }
  },
  created() {
    const q = this.$route.query;

    this.order_id = q.order_id || "";
    this.order_no = q.order_no || "";
    this.total = Number(q.total_price || 0);

    if (q.address_detail) {
      this.addrShow = {
        name: q.consignee_name || "",
        phone: q.consignee_phone || "",
        addr: q.address_detail
      };
    } else {
      this.addrShow = null;
    }

    if (!this.order_id) {
      this.loadingflag = false;
      this.$toast("缺少订单ID");
      return;
    }

    this.getCard();
    this.checkPayPwd();
    this.getOrderDetail();
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

  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .addressIcon {
    width: 20px;
  }

  .phone {
    padding-left: 10px;
    font-size: 12px;
    color: #797979;
  }

  .addressDetail {
    font-size: 13px;
    font-weight: bold;
    margin-top: 3px;
  }

  .userName {
    font-size: 15px;
    font-weight: bold;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
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
    width: 77px;
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
  }

  .can {
    margin-top: 13px;
    font-size: 13px;
    color: #979797;
    overflow: hidden;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
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