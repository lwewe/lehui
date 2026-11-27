<template>
  <div class="order-page">
    <!-- 右上角规则 -->
    <div class="header-rule" @click="showRule">
      <span>支付规则</span>
    </div>

    <!-- 订单信息区 -->
    <div class="order-info">
      <div class="countdown" v-if="orderInfo.payExpireTime">
        支付剩余时间 <span class="time-text">{{ formatTime(countdown) }}</span>
      </div>
      <div class="amount"><span style="font-size: 18px;">￥</span>{{ orderInfo.totalAmount || '0.00' }}</div>
      <div class="order-number">订单编号：{{ orderInfo.orderCode || '---' }}</div>
      <div class="order-number" v-if="orderInfo.storeName" style="margin-top:6px;">
        {{ orderInfo.storeName }}
      </div>
    </div>

    <!-- 提示信息 -->
    <div style="padding: 10px;background: #ffffff;">
      <div style="background: #FFF5F2; border-radius: 8px;">
        <div style="font-weight: 400; font-size: 12px; color: #EB6A73; padding: 10px;">
          请确认您的乐汇卡是否已经绑定或充值，如未操作，请前往"我的-福利卡"完成绑定或充值
        </div>
      </div>
    </div>

    <!-- 卡券支付列表 -->
    <div class="card-section">
      <div class="section-title">
        <span class="title-text">卡券支付</span>
        <span class="sub-text">（请选择要使用的卡）</span>
      </div>

      <div class="card-list">
        <div class="card-item" v-for="(item, index) in cardList" :key="item.id" @click="toggleCard(index)">
          <div class="card-info">
            <div class="card-name">{{ item.num }}</div>
            <div class="card-sub">有效期至 {{ formatDate(item.end_time) }}</div>
          </div>
          <div class="card-right">
            <div class="card-balance"><span style="font-size: 10px;">￥</span>{{ item.price }}</div>
            <div class="checkbox-wrapper">
              <div class="checkbox-box" :class="{ 'active': isSelected(index) }">
                <span v-if="isSelected(index)" class="check-mark">✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 无卡提示 -->
        <div v-if="cardList.length === 0" class="no-card">
          暂无可用福利卡
        </div>

        <!-- 微信支付单独选项（可微信支付时才露出） -->
        <div class="card-item wx-pay-item" v-if="wxPayVisible" @click="selectWxPay">
          <div class="card-info">
            <div class="card-name wx-name">
              <img src="../../assets/lh/wxpay.png" class="wx-icon" alt="">
              <span>微信支付</span>
            </div>
            <div class="card-sub">{{ isWxSelected ? '当前使用微信支付' : '点击使用微信支付' }}</div>
          </div>
          <div class="card-right">
            <div class="card-balance wx-balance"><span style="font-size: 10px;">￥</span>{{ wxPayAmount }}</div>
            <div class="checkbox-wrapper">
              <div class="checkbox-box" :class="{ 'active': isWxSelected }">
                <span v-if="isWxSelected" class="check-mark">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付金额信息 -->
      <div class="pay-info" v-if="payInfo">
        <div class="pay-info-title">支付明细</div>
        <div class="pay-info-row">
          <span>订单金额：</span>
          <span><span style="font-size: 10px;">￥</span>{{ orderInfo.totalAmount || '0.00' }}</span>
        </div>
        <div class="pay-info-row" v-if="payInfo.dkprice && payInfo.dkprice !== '0.00'">
          <span>卡支付金额：</span>
          <span style="color: #d32f2f;"><span style="font-size: 10px;">￥</span>{{ payInfo.dkprice }}</span>
        </div>
        <div class="pay-info-row" v-if="payInfo.wxprice && payInfo.wxprice !== '0.00'">
          <span>微信支付金额：</span>
          <span style="color: #07c160;"><span style="font-size: 10px;">￥</span>{{ payInfo.wxprice }}</span>
        </div>
      </div>

      <!-- 支付方式提示 -->
      <div class="pay-method-tip" v-if="payInfo">
        <!-- 组合支付 -->
        <div v-if="payInfo.wxprice && payInfo.wxprice !== '0.00' && payInfo.dkprice && payInfo.dkprice !== '0.00'"
          style="display: flex;align-items: center;flex-wrap:wrap;">
          <span style="display: flex;align-items: center;">
            <img src="../../assets/lh/wxpay.png" style="width: 20px;height: 20px;margin-right: 4px;" alt=""> 将使用
          </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.dkprice }}</span>
          <span> + </span>
          <span style="color: #07c160; font-weight: bold;">微信支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.wxprice }}</span>
        </div>
        <!-- 纯卡支付 -->
        <div v-else-if="payInfo.dkprice && payInfo.dkprice !== '0.00'" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;">
            <img src="../../assets/lh/czf.png" style="width:20px;height:20px;margin-right: 4px;" alt=""> 将使用
          </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.dkprice }}</span>
        </div>
        <!-- 纯微信支付 -->
        <div v-else-if="payInfo.wxprice && payInfo.wxprice !== '0.00'" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;">
            <img src="../../assets/lh/wxpay.png" style="width: 20px;height: 20px;margin-right: 4px;" alt=""> 将使用
          </span>
          <span style="color: #07c160; font-weight: bold;">微信支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.wxprice }}</span>
        </div>
      </div>
    </div>

    <!-- 底部确认按钮 -->
    <div class="footer">
      <button class="btn-confirm" @click="handlePay" :disabled="isPaying">
        {{ payButtonText }}
      </button>
    </div>

    <!-- 密码输入弹窗 -->
    <PayPassword :is-show="showPasswordDialog" :key="'pay-' + showPasswordDialog" @onInput="onPasswordInput" />
  </div>
</template>

<script>
import PayPassword from "@/components/PayPassword.vue";
import {
  getDiancanOrderDetail,
  getDiancanCardList,
  calculateDiancanPay,
  payDiancanByCard,
  payDiancanByWechat,
  payDiancanSuccess
} from "@/api/diancan";
import wx from "weixin-js-sdk";

export default {
  name: "FoodPayOrder",
  components: { PayPassword },
  data() {
    return {
      // URL 参数
      orderCode: "",
      customerCode: "",
      brandCode: "",
      money: "",          // 单位：分
      extend: "",
      requestTime: "",
      sign: "",

      countdown: 0,
      timer: null,

      orderInfo: {},      // 结算信息（checkout 接口返回）
      cardList: [],
      selectedList: [],
      payInfo: null,
      showPasswordDialog: false,
      password: "",
      isPaying: false
    };
  },
  computed: {
    // 微信支付是否露出：点餐订单没有"只能卡支付"限制，始终可露出
    wxPayVisible() {
      return true;
    },
    // 没有勾选任何卡 = 微信支付
    isWxSelected() {
      return this.selectedList.length === 0;
    },
    // 微信支付选项右侧金额
    wxPayAmount() {
      if (this.payInfo && this.payInfo.wxprice && this.payInfo.wxprice !== '0.00') {
        return this.payInfo.wxprice;
      }
      return this.orderInfo.totalAmount || '0.00';
    },
    selectedCardIds() {
      return this.selectedList
        .map(idx => this.cardList[idx])
        .filter(card => card)
        .map(card => card.id);
    },
    payButtonText() {
      if (this.isPaying) return '支付中...';

      if (this.payInfo) {
        const dkPrice = parseFloat(this.payInfo.dkprice || 0);
        const wxPrice = parseFloat(this.payInfo.wxprice || 0);

        if (dkPrice > 0 && wxPrice > 0) {
          return `卡支付￥${dkPrice} + 微信支付￥${wxPrice}`;
        } else if (dkPrice > 0) {
          return `确认支付 ￥${dkPrice}`;
        } else if (wxPrice > 0) {
          return `微信支付 ￥${wxPrice}`;
        }
      }

      return `确认支付 ￥${this.orderInfo.totalAmount || '0.00'}`;
    }
  },
  methods: {
    // ============ 初始化 ============
    initParams() {
      const q = this.$route.query;
      this.orderCode = q.orderCode || "";
      this.customerCode = q.customerCode || "";
      this.brandCode = q.brandCode || "";
      this.money = q.money || "";
      this.extend = q.extend || "";
      this.requestTime = q.requestTime || "";
      this.sign = q.sign || "";
    },

    // ============ 获取订单结算信息 ============
    async fetchOrderInfo() {
      try {
        this.$toast.loading({ message: '加载中...', forbidClick: true, duration: 0 });

        const res = await getDiancanOrderDetail({
          orderCode: this.orderCode,
          customerCode: this.customerCode,
          brandCode: this.brandCode,
          money: this.money,
          extend: this.extend,
          requestTime: this.requestTime,
          thirdsign: this.sign
        });

        this.$toast.clear();

        if (res.code === 200 && res.data) {
          this.orderInfo = res.data;
          // 用 payExpireTime 计算倒计时
          if (res.data.payExpireTime) {
            const expireTs = Math.floor(new Date(res.data.payExpireTime.replace(/-/g, '/')).getTime() / 1000);
            const now = Math.floor(Date.now() / 1000);
            this.countdown = expireTs - now;
            if (this.countdown > 0) this.startCountdown();
          }
          await this.fetchCardList();
        } else {
          this.$toast.fail(res.msg || '获取订单信息失败');
        }
      } catch (e) {
        this.$toast.clear();
        console.error('获取订单信息失败:', e);
        this.$toast.fail('获取订单信息失败');
      }
    },

    // ============ 获取福利卡列表 ============
    async fetchCardList() {
      try {
        const res = await getDiancanCardList({});
        if (res.code === 200 && res.data) {
          this.cardList = res.data || [];
          // 默认选中第一张有余额的卡
          const validIndex = this.cardList.findIndex(card => parseFloat(card.price) > 0);
          this.selectedList = validIndex > -1 ? [validIndex] : [];
        } else {
          this.cardList = [];
          this.selectedList = [];
        }
        await this.calculatePayInfo();
      } catch (e) {
        console.error('获取卡列表失败:', e);
        this.cardList = [];
        this.selectedList = [];
        await this.calculatePayInfo();
      }
    },

    // ============ 计算支付信息 ============
    async calculatePayInfo() {
      if (!this.orderCode) return;
      // 点餐订单的 price 用结算接口返回的 totalAmount
      const price = this.orderInfo.totalAmount || (parseFloat(this.money) / 100) || 0;

      try {
        const params = {
          orderCode: this.orderCode,
          price: String(price)
        };
        if (this.selectedCardIds.length > 0) {
          params.fulika = this.selectedCardIds.join(',');
        }

        const res = await calculateDiancanPay(params);

        if (res.code === 200 && res.data) {
          this.payInfo = res.data;
        } else {
          this.payInfo = {
            dkprice: "0.00",
            wxprice: String(price),
            ka_ids: []
          };
        }
      } catch (e) {
        console.error('计算支付信息失败:', e);
        this.payInfo = {
          dkprice: "0.00",
          wxprice: String(price),
          ka_ids: []
        };
      }
    },

    // ============ 卡选择 ============
    isSelected(index) {
      return this.selectedList.includes(index);
    },
    async toggleCard(index) {
      const idx = this.selectedList.indexOf(index);
      if (idx > -1) this.selectedList.splice(idx, 1);
      else this.selectedList.push(index);
      await this.calculatePayInfo();
    },
    async selectWxPay() {
      if (this.isWxSelected) {
        this.$toast('当前已是微信支付');
        return;
      }
      this.selectedList = [];
      await this.calculatePayInfo();
    },

    // ============ 密码输入回调 ============
    onPasswordInput(password) {
      this.password = password;
      if (password.length === 6) {
        this.confirmCardPay();
      }
    },

    // ============ 支付按钮 ============
    async handlePay() {
      if (this.isPaying) return;
      this.isPaying = true;

      if (!this.payInfo) await this.calculatePayInfo();

      const dkPrice = parseFloat(this.payInfo?.dkprice || 0);
      const wxPrice = parseFloat(this.payInfo?.wxprice || 0);

      // 纯卡支付 → 弹密码框
      if (dkPrice > 0 && wxPrice <= 0) {
        if (this.selectedList.length === 0) {
          this.isPaying = false;
          this.$toast.fail('请选择福利卡');
          return;
        }
        this.password = "";
        this.showPasswordDialog = false;
        this.$nextTick(() => {
          this.showPasswordDialog = true;
          this.isPaying = false;
        });
        return;
      }

      // 组合支付 / 纯微信支付 → 调微信
      await this.handleWechatPay();
    },

    // ============ 卡支付 ============
    async confirmCardPay() {
      if (this.password.length < 6) {
        this.$toast.fail('请输入6位支付密码');
        return;
      }
      this.isPaying = true;
      this.showPasswordDialog = false;

      const kaIds = this.payInfo?.ka_ids || this.selectedCardIds;
      const price = this.orderInfo.totalAmount || (parseFloat(this.money) / 100) || 0;

      try {
        this.$toast.loading({ message: '卡支付中...', forbidClick: true, duration: 0 });

        const res = await payDiancanByCard({
          orderCode: this.orderCode,
          ka_ids: JSON.stringify(kaIds),
          pass: this.password,
          price: String(price)
        });

        this.$toast.clear();
        this.password = "";

        if (res.code === 200) {
          this.isPaying = false;
          this.$toast.success('支付成功');
          await this.callPaySuccess(res.data?.order_no || this.orderCode);
          setTimeout(() => {
            this.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
          }, 1500);
        } else {
          this.isPaying = false;
          this.$toast.fail(res.msg || '卡支付失败');
        }
      } catch (e) {
        this.$toast.clear();
        this.isPaying = false;
        this.password = "";
        this.$toast.fail('卡支付失败');
      }
    },

    // ============ 微信支付 ============
    async handleWechatPay() {
      try {
        this.$toast.loading({ message: '正在调起微信支付...', forbidClick: true, duration: 0 });

        const openid = localStorage.getItem('openid');
        if (!openid) {
          this.$toast.clear();
          this.$toast.fail('未获取到openid，请重新登录');
          this.isPaying = false;
          return;
        }

        // const price = this.payInfo?.wxprice || this.orderInfo.totalAmount || (parseFloat(this.money) / 100) || 0;
        const price = this.orderInfo.totalAmount || (parseFloat(this.money) / 100) || 0;
        const kaIds = this.selectedCardIds.length > 0 ? this.selectedCardIds : [];

        const res = await payDiancanByWechat({
          orderCode: this.orderCode,
          ka_ids: JSON.stringify(kaIds),
          openid: openid,
          price: String(price)
        });

        this.$toast.clear();

        if (res.code === 200 && res.data && res.data.jsApiParameters) {
          this.invokeWechatPay(res.data.jsApiParameters, res.data.order_no);
        } else {
          this.isPaying = false;
          this.$toast.fail(res.msg || '获取支付参数失败');
        }
      } catch (e) {
        this.$toast.clear();
        this.isPaying = false;
        console.error('微信支付失败:', e);
        this.$toast.fail('微信支付失败');
      }
    },

    // ============ 调起微信支付 ============
    invokeWechatPay(jsApiParameters, orderNo) {
      const that = this;
      const payParams = {
        appId: jsApiParameters.appId,
        timeStamp: jsApiParameters.timestamp || jsApiParameters.timeStamp,
        nonceStr: jsApiParameters.nonceStr,
        package: jsApiParameters.package,
        signType: jsApiParameters.signType || 'MD5',
        paySign: jsApiParameters.paySign
      };

      const onSuccess = () => {
        that.$toast.success('支付成功');
        that.isPaying = false;
        that.callPaySuccess(orderNo || that.orderCode);
        setTimeout(() => {
          that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
        }, 1500);
      };
      const onFail = () => {
        that.$toast.fail('支付失败');
        that.isPaying = false;
      };

      if (typeof WeixinJSBridge !== 'undefined') {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": payParams.appId,
          "timeStamp": String(payParams.timeStamp),
          "nonceStr": payParams.nonceStr,
          "package": payParams.package,
          "signType": payParams.signType,
          "paySign": payParams.paySign
        }, function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") onSuccess();
          else if (res.err_msg === "get_brand_wcpay_request:fail") onFail();
          else if (res.err_msg === "get_brand_wcpay_request:cancel") that.isPaying = false;
        });
      } else if (typeof wx !== 'undefined' && wx.chooseWXPay) {
        wx.chooseWXPay({
          ...payParams,
          success: onSuccess,
          fail: onFail
        });
      } else {
        this.$toast.fail('微信支付环境不可用');
        this.isPaying = false;
      }
    },

    // ============ 支付完成回调 ============
    async callPaySuccess(orderNo) {
      try {
        const res = await payDiancanSuccess({ order_no: orderNo || this.orderCode });
        console.log('支付回调结果:', res);
      } catch (e) {
        console.error('支付回调失败:', e);
      }
    },

    // ============ 倒计时 ============
    startCountdown() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.$dialog.alert({ title: '提示', message: '支付时间已到，请重新下单' })
            .then(() => window.history.back());
        }
      }, 1000);
    },

    // ============ 工具方法 ============
    formatTime(seconds) {
      if (seconds <= 0) return "0分0秒";
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}分${s}秒`;
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    showRule() {
      const tips = [
        '**实际支付金额可能高于输入金额，差额为手续费，请以支付页面显示为准**'
      ];
      const msg = (this.cardOnly
        ? [
          '1. 本商户仅支持乐汇卡支付，请选余额充足的卡',
          '2. 卡内余额需 ≥ 订单金额',
          '3. 支付需验证6位支付密码'
        ]
        : [
          '1. 优先用乐汇卡抵扣，余额不足自动「卡+微信」组合支付',
          '2. 未选卡则微信支付全额',
          '3. 请在倒计时结束前完成支付'
        ]
      ).concat(tips).join('\n');

      this.$dialog.alert({
        title: '支付规则',
        message: msg,
        messageAlign: 'left'
      });
      // this.$dialog.alert({
      //   title: '支付规则',
      //   message: '1. 请选择要使用的乐汇卡\n2. 卡内余额足够时，直接使用卡支付\n3. 卡内余额不足时，自动使用卡+微信组合支付\n4. 未选择卡时，使用微信支付'
      // });
    }
  },
  created() {
    this.initParams();
    if (this.orderCode) {
      this.fetchOrderInfo();
    } else {
      this.$toast.fail('缺少订单号');
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>

<style scoped>
/* 样式与原文件完全一致，无需改动 */
.no-card {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 14px;
}

.pay-info {
  margin: 20px 16px 0;
  padding: 16px;
  background: #FFF5F2;
  border-radius: 8px;
}

.pay-info-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.pay-info-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
  color: #333;
}

.pay-method-tip {
  margin: 10px 16px 0;
  padding: 12px;
  background: #F0F9FF;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
}

.btn-confirm {
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(90deg, #FF4A25 0%, #FEA345 100%);
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s;
  font-weight: 500;
}

.btn-confirm:active {
  opacity: 0.8;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
  color: #333;
  position: relative;
}

.header-rule {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 14px;
  color: #e6a23c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-info {
  background: #fff;
  text-align: center;
  padding: 40px 20px 10px;
}

.countdown {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.time-text {
  color: #d9534f;
  font-weight: 500;
}

.amount {
  color: #d32f2f;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 12px;
}

.order-number {
  color: #999;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.card-section {
  background: #fff;
  padding: 16px 0 10px;
}

.section-title {
  display: flex;
  align-items: center;
  padding: 0 16px 16px;
  font-size: 15px;
  font-weight: 600;
}

.title-text {
  color: #d32f2f;
}

.sub-text {
  color: #d32f2f;
  font-weight: normal;
  font-size: 13px;
  margin-left: 4px;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.card-item:active {
  background: #f9f9f9;
}

.card-item:last-child {
  border-bottom: none;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 6px;
}

.card-sub {
  font-size: 13px;
  color: #999;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-balance {
  font-size: 16px;
  color: #333;
}

.checkbox-wrapper {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 30px;
  position: relative;
  box-sizing: border-box;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-box.active {
  background: #d32f2f;
  border-color: #d32f2f;
}

.check-mark {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f5f5f5;
  padding: 12px 16px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.wx-pay-item {
  border-top: 8px solid #f5f5f5;
  border-bottom: 1px solid #f0f0f0;
}

.wx-name {
  display: flex;
  align-items: center;
}

.wx-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.wx-balance {
  color: #07c160;
}
</style>