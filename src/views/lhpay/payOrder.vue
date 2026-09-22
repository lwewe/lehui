<template>
  <div class="order-page">
    <!-- 右上角规则 -->
    <div class="header-rule" @click="showRule">
      <span>支付规则</span>
    </div>

    <!-- 订单信息区 -->
    <div class="order-info">
      <div class="countdown" v-if="orderInfo.orderexpire > 0">
        支付剩余时间 <span class="time-text">{{ formatTime(countdown) }}</span>
      </div>
      <div class="amount"><span style="font-size: 18px;">￥</span>{{ orderInfo.total_fee || '0.00' }}</div>
      <div class="order-number">订单编号：{{ orderInfo.order_no || '---' }}</div>
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
      </div>

      <!-- 支付金额信息 -->
      <div class="pay-info" v-if="payInfo">
        <div class="pay-info-title">支付明细</div>
        <div class="pay-info-row">
          <span>订单金额：</span>
          <span><span style="font-size: 10px;">￥</span>{{ orderInfo.total_fee || '0.00' }}</span>
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
        <div v-if="payInfo.wxprice && payInfo.wxprice !== '0.00' && payInfo.dkprice && payInfo.dkprice !== '0.00'" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/wxpay.png" style="width: 20px;height: 20px;    margin-right: 4px;" alt=""> 将使用 </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.dkprice }}</span>
          <span> + </span>
          <span style="color: #07c160; font-weight: bold;">微信支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.wxprice }}</span>
        </div>
        <div v-else-if="payInfo.dkprice && payInfo.dkprice !== '0.00'" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/czf.png" style="width:20px;height:20px;    margin-right: 4px;" alt=""> 将使用 </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 <span style="font-size: 10px;">￥</span>{{
            payInfo.dkprice }}</span>
        </div>
        <div v-else-if="payInfo.wxprice && payInfo.wxprice !== '0.00'" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/wxpay.png" style="width: 20px;height: 20px;    margin-right: 4px;" alt=""> 将使用 </span>
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
    <PayPassword :is-show="showPasswordDialog" @onInput="onPasswordInput" />
  </div>
</template>

<script>
import PayPassword from "@/components/PayPassword.vue";
import { getOrderInfo, getCardList, calculatePayment, payByCard, payByWechat, paySuccess } from "@/api/payment";
import wx from "weixin-js-sdk";

export default {
  name: "OrderInfo",
  components: {
    PayPassword
  },
  data() {
    return {
      orderNo: "",
      orderType: "2", // 1-叮咚买菜,2-永辉彩食鲜
      countdown: 0,
      timer: null,
      selectedList: [], // 存储多个被选中的索引
      cardList: [],
      orderInfo: {},
      payInfo: null,
      showPasswordDialog: false,
      password: "",
      isPaying: false
    };
  },
  computed: {
    selectedCardIds() {
      return this.selectedList.map(idx => this.cardList[idx].id);
    },
    selectedCardBalance() {
      return this.selectedList.reduce((sum, idx) => sum + parseFloat(this.cardList[idx].price || 0), 0);
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

      return `确认支付 ￥${this.orderInfo.total_fee || '0.00'}`;
    }
  },
  methods: {
    // 密码输入回调（PayPassword 组件触发）
    onPasswordInput(password) {
      this.password = password;
      console.log('输入的密码长度:', password.length);

      // 当输入满6位时，自动调用支付
      if (password.length === 6) {
        console.log('密码输入完成，开始支付');
        this.confirmCardPay();
      }
    },
    // 格式化时间
    formatTime(seconds) {
      if (seconds <= 0) return "0分0秒";
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}分${s}秒`;
    },

    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    // 判断是否选中
    isSelected(index) {
      return this.selectedList.includes(index);
    },

    // 切换卡片选择
    async toggleCard(index) {
      const idx = this.selectedList.indexOf(index);
      if (idx > -1) {
        this.selectedList.splice(idx, 1);
      } else {
        this.selectedList.push(index);
      }
      await this.calculatePayInfo();
    },

    // 显示规则
    showRule() {
      this.$dialog.alert({
        title: '支付规则',
        message: '1. 请选择要使用的乐汇卡\n2. 卡内余额足够时，直接使用卡支付\n3. 卡内余额不足时，自动使用卡+微信组合支付\n4. 未选择卡时，使用微信支付'
      });
    },

    // 获取订单信息
    async fetchOrderInfo() {
      try {
        this.$toast.loading({ message: '加载中...', forbidClick: true, duration: 0 });

        const res = await getOrderInfo({
          order_no: this.orderNo,
          type: this.orderType
        });

        this.$toast.clear();

        if (res.code === 200 && res.data) {
          this.orderInfo = res.data;

          if (res.data.orderexpire > 0) {
            const now = Math.floor(Date.now() / 1000);
            this.countdown = res.data.orderexpire - now;  // 剩余秒数

            console.log('订单过期时间戳:', res.data.orderexpire);
            console.log('当前时间戳:', now);
            console.log('剩余秒数:', this.countdown);

            if (this.countdown > 0) {
              this.startCountdown();
            }
          }

          await this.fetchCardList();
        } else {
          this.$toast.fail(res.msg || '获取订单信息失败');
        }
      } catch (error) {
        this.$toast.clear();
        console.error('获取订单信息失败:', error);
        this.$toast.fail('获取订单信息失败');
      }
    },

    // 获取福利卡列表
    async fetchCardList() {
      try {
        const res = await getCardList({});

        if (res.code === 200 && res.data) {
          this.cardList = res.data || [];
          console.log('福利卡列表:', this.cardList);

          
          const validIndex = this.cardList.findIndex(card => parseFloat(card.price) > 0);
          if (validIndex > -1) {
             
            this.selectedList = [validIndex];
            console.log('✅ 默认选中第一张可用卡');
          } else {
            // 没有可用卡
            this.selectedList = [];
            console.log('⚠️ 没有可用福利卡（余额都为0）');
          }

          // 计算支付信息
          await this.calculatePayInfo();
        } else {
          // 获取卡列表失败
          this.cardList = [];
          this.selectedList = [];
          await this.calculatePayInfo();
        }
      } catch (error) {
        console.error('获取卡列表失败:', error);
        this.cardList = [];
        this.selectedList = [];
        await this.calculatePayInfo();
      }
    },

    async calculatePayInfo() {
      if (!this.orderInfo.id) return;

      try {
        const params = {
          id: this.orderInfo.id,
          type: this.orderType
        };

        // 只有选择了卡才传 fulika
        if (this.selectedCardIds.length > 0) {
          params.fulika = this.selectedCardIds.join(',');
        }

        console.log('计算支付参数:', params);

        const res = await calculatePayment(params);

        if (res.code === 200 && res.data) {
          this.payInfo = res.data;
          console.log(' 支付计算成功:', this.payInfo);
        } else {
          // 计算失败，默认全部微信支付
          this.payInfo = {
            dkprice: "0.00",
            wxprice: String(this.orderInfo.total_fee || "0.00"),
            ka_ids: []
          };
          console.log('  计算失败，默认微信支付:', this.payInfo);
        }
      } catch (error) {
        console.error('计算支付信息失败:', error);
        // 出错时，默认全部微信支付
        this.payInfo = {
          dkprice: "0.00",
          wxprice: String(this.orderInfo.total_fee || "0.00"),
          ka_ids: []
        };
      }
    },

    // 开始倒计时
    startCountdown() {
      if (this.timer) clearInterval(this.timer);

      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.$dialog.alert({
            title: '提示',
            message: '支付时间已到，请重新下单'
          }).then(() => {
            window.history.back();
          });
        }
      }, 1000);
    },




    // 支付按钮点击
    async handlePay() {
      if (this.isPaying) return;

      console.log('=== 开始支付 ===');
      console.log('payInfo:', this.payInfo);

      if (!this.payInfo) {
        await this.calculatePayInfo();
      }

      const dkPrice = parseFloat(this.payInfo?.dkprice || 0);
      const wxPrice = parseFloat(this.payInfo?.wxprice || 0);

      console.log('dkPrice:', dkPrice, 'wxPrice:', wxPrice);

      //   情况1：纯卡支付（dkPrice > 0, wxPrice = 0）
      if (dkPrice > 0 && wxPrice <= 0) {
        console.log('纯卡支付，弹出密码框');
        if (this.selectedList.length === 0) {
          this.$toast.fail('请选择福利卡');
          return;
        }
        this.password = "";
        this.showPasswordDialog = true;
        return;
      }

      //   情况2：组合支付（dkPrice > 0, wxPrice > 0）→ 直接微信支付，不弹密码框
      if (dkPrice > 0 && wxPrice > 0) {
        console.log('组合支付：直接调微信支付');
        await this.handleWechatPay();
        return;
      }

      //   情况3：纯微信支付（dkPrice = 0, wxPrice > 0）
      if (dkPrice <= 0 && wxPrice > 0) {
        console.log('纯微信支付');
        await this.handleWechatPay();
        return;
      }

      // 兜底
      await this.handleWechatPay();
    },

    // 确认卡支付
    async confirmCardPay() {
      if (this.password.length < 6) {
        this.$toast.fail('请输入6位支付密码');
        return;
      }

      this.isPaying = true;
      this.showPasswordDialog = false;

      const kaIds = this.payInfo?.ka_ids || this.selectedCardIds;

      console.log('=== 纯卡支付参数 ===');
      console.log('kaIds:', kaIds);
      console.log('pass:', this.password);

      try {
        this.$toast.loading({ message: '卡支付中...', forbidClick: true, duration: 0 });

        const cardRes = await payByCard({
          id: this.orderInfo.id,
          type: this.orderType,
          ka_ids: JSON.stringify(kaIds),
          pass: this.password
        });

        this.$toast.clear();
        this.password = "";

        if (cardRes.code === 200) {
          this.isPaying = false;
          this.$toast.success('支付成功');
          await this.callPaySuccess();
          setTimeout(() => {
            this.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
          }, 1500);
        } else {
          this.isPaying = false;
          this.$toast.fail(cardRes.msg || '卡支付失败');
        }
      } catch (error) {
        this.$toast.clear();
        this.isPaying = false;
        this.password = "";
        this.$toast.fail('卡支付失败');
      }
    },

    // 微信支付
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

        //   传卡ID（如果选了卡，后端自动抵扣卡内余额）
        const payData = {
          id: this.orderInfo.id,
          ka_ids: JSON.stringify(this.selectedCardIds.length > 0 ? this.selectedCardIds : []),
          type: this.orderType,
          openid: openid
        };

        const res = await payByWechat(payData);

        this.$toast.clear();

        console.log('微信支付接口返回:', res);

        if (res.code === 200 && res.data && res.data.jsApiParameters) {
          this.invokeWechatPay(res.data.jsApiParameters);
        } else {
          this.isPaying = false;
          this.$toast.fail(res.msg || '获取支付参数失败');
        }
      } catch (error) {
        this.$toast.clear();
        this.isPaying = false;
        console.error('微信支付失败:', error);
        this.$toast.fail('微信支付失败');
      }
    },

    // 调起微信支付
    invokeWechatPay(jsApiParameters, orderNo) {
      console.log('=== 调起微信支付 ===');
      console.log('原始参数:', JSON.stringify(jsApiParameters));

      const that = this;

      const payParams = {
        appId: jsApiParameters.appId,
        timeStamp: jsApiParameters.timestamp || jsApiParameters.timeStamp,
        timestamp: jsApiParameters.timestamp || jsApiParameters.timeStamp,
        nonceStr: jsApiParameters.nonceStr,
        package: jsApiParameters.package,
        signType: jsApiParameters.signType || 'MD5',
        paySign: jsApiParameters.paySign
      };

      //   优先使用 WeixinJSBridge（最稳定）
      if (typeof WeixinJSBridge !== 'undefined') {
        console.log('使用 WeixinJSBridge');
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            "appId": payParams.appId,
            "timeStamp": String(payParams.timeStamp),
            "nonceStr": payParams.nonceStr,
            "package": payParams.package,
            "signType": payParams.signType,
            "paySign": payParams.paySign
          },
          function (res) {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              console.log('  微信支付成功');
              that.$toast.success('支付成功');
              that.isPaying = false;
              that.callPaySuccess();
              setTimeout(() => {
                that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
              }, 1500);
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              console.error('  微信支付失败:', res);
              that.$toast.fail('支付失败');
              that.isPaying = false;
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              console.log('用户取消支付');
              that.isPaying = false;
            }
          }
        );
      }
      // 备选：使用 wx.chooseWXPay
      else if (typeof wx !== 'undefined' && wx.chooseWXPay) {
        console.log('使用 wx.chooseWXPay');
        wx.chooseWXPay({
          ...payParams,
          success: (res) => {
            console.log('  微信支付成功:', res);
            that.$toast.success('支付成功');
            that.isPaying = false;
            that.callPaySuccess();
            setTimeout(() => {
              that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
            }, 1500);
          },
          fail: (error) => {
            console.error('  微信支付失败:', error);
            that.$toast.fail('支付失败');
            that.isPaying = false;
          }
        });
      } else {
        console.error('  微信支付环境不可用');
        this.$toast.fail('微信支付环境不可用');
        this.isPaying = false;
      }
    },

    // 支付完成回调
    async callPaySuccess() {
      try {
        const res = await paySuccess({
          id: this.orderInfo.id,
          type: this.orderType
        });
        console.log('支付回调结果:', res);
      } catch (error) {
        console.error('支付回调失败:', error);
      }
    }
  },
  created() {
    // 获取路由参数
    this.orderNo = this.$route.query.orderNo || this.$route.query.order_no || '';
    this.orderType = this.$route.query.type || '2';

    if (this.orderNo) {
      this.fetchOrderInfo();
    } else {
      this.$toast.fail('缺少订单号');
    }
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>


<style scoped>
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

.pay-type-section {
  margin-top: 20px;
  padding: 0 16px;
}

.pay-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.pay-type-item:active {
  background: #f9f9f9;
}

.pay-type-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pay-type-icon {
  font-size: 20px;
}

.pay-info {
  margin: 20px 16px 0;
  padding: 16px;
  background: #FFF5F2;
  border-radius: 8px;
}

.pay-info-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
  color: #333;
}

/* 全局重置 */
.order-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
  color: #333;
  position: relative;
}

/* 右上角规则 */
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

.info-icon {
  font-style: normal;
  border: 1px solid #e6a23c;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* 订单信息区 */
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

/* 卡券支付区 */
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

/* 列表项 */
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

/* 【修改】改为复选框样式 (方块勾选) */
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
  border-radius: 4px;
  /* 方块圆角 */
  position: relative;
  box-sizing: border-box;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
}

.checkbox-box.active {
  background: #d32f2f;
  /* 选中后背景变红 */
  border-color: #d32f2f;
}

.check-mark {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

/* 底部按钮 */
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
</style>