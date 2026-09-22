<template>
  <div class="order-page">
    <!-- 右上角规则 -->
    <div class="header-rule" @click="showRule">
      <span>支付规则</span>
    </div>

    <!-- 订单信息区 -->
    <div class="order-info">
      <div class="countdown" v-if="countdown > 0">
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

        <div v-if="cardList.length === 0" class="no-card">
          暂无可用福利卡
        </div>
      </div>

      <!-- 支付金额信息 -->
      <div class="pay-info" v-if="payInfo">
        <div class="pay-info-title">支付明细</div>
        <div class="pay-info-row">
          <span>订单金额：</span>
          <span>￥{{ orderInfo.total_fee || '0.00' }}</span>
        </div>
        <div class="pay-info-row" v-if="payInfo.dkprice && payInfo.dkprice != 0">
          <span>卡支付金额：</span>
          <span style="color: #d32f2f;">￥{{ payInfo.dkprice }}</span>
        </div>
        <div class="pay-info-row" v-if="allowWechat && payInfo.wxprice && payInfo.wxprice != 0">
          <span>微信支付金额：</span>
          <span style="color: #07c160;">￥{{ payInfo.wxprice }}</span>
        </div>
      </div>


      <!-- 支付方式提示 -->
      <div class="pay-method-tip" v-if="payInfo">
        <!-- 组合支付：仅当允许微信 -->
        <div v-if="allowWechat && payInfo.wxprice && payInfo.wxprice != 0 && payInfo.dkprice && payInfo.dkprice != 0"
          style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/wxpay.png"
              style="width: 20px;height: 20px;    margin-right: 4px;" alt=""> 将使用 </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 ￥{{ payInfo.dkprice }}</span>
          <span> + </span>
          <span style="color: #07c160; font-weight: bold;">微信支付 ￥{{ payInfo.wxprice }}</span>
        </div>

        <!-- 纯卡 -->
        <div v-else-if="payInfo.dkprice && payInfo.dkprice != 0" style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/czf.png"
              style="width: 20px;height: 20px;    margin-right: 4px;" alt=""> 将使用 </span>
          <span style="color: #d32f2f; font-weight: bold;">福利卡支付 ￥{{ payInfo.dkprice }}</span>
        </div>

        <!-- 纯微信：仅当允许微信 -->
        <div v-else-if="allowWechat && payInfo.wxprice && payInfo.wxprice != 0"
          style="display: flex;align-items: center;">
          <span style="display: flex;align-items: center;"><img src="../../assets/lh/wxpay.png"
              style="width: 20px;height: 20px;    margin-right: 4px;" alt=""> 将使用 </span>
          <span style="color: #07c160; font-weight: bold;">微信支付 ￥{{ payInfo.wxprice }}</span>
        </div>

        <!-- 只能卡支付但没金额时的兜底 -->
        <div v-else-if="cardOnly" style="color: #EB6A73;">
          请选择福利卡支付
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
import {
  getZhanfumaOrderInfo,
  getZhanfumaCardList,
  calculateZhanfumaPayment,
  payZhanfumaByCard,
  payZhanfumaByWechat,
  zhanfumaPaySuccess
} from "@/api/zhanfuma";
// 只有物美（2）不能微信，其他都允许
const PAY_CAPABILITY = {
  '2': { card: true, wechat: false, cardOnly: true },   // 物美：只能卡
  default: { card: true, wechat: true, cardOnly: false } // 其他全部允许微信
};
export default {
  name: "ZhanfumaOrderInfo",
  components: {
    PayPassword
  },
  data() {
    return {
      orderNo: "",
      orderType: "1", // 1-锅圈
      countdown: 0,
      timer: null,
      selectedList: [],
      cardList: [],
      orderInfo: {},
      payInfo: null,
      showPasswordDialog: false,
      password: "",
      isPaying: false
    };
  },
  computed: {
    // 当前订单的支付能力
    payCapability() {
      return PAY_CAPABILITY[this.orderType] || PAY_CAPABILITY.default;
    },
    // 是否允许微信支付
    allowWechat() {
      return this.payCapability.wechat;
    },
    // 是否只能福利卡支付
    cardOnly() {
      return this.payCapability.cardOnly;
    },

    selectedCardIds() {
      return this.selectedList.map(idx => this.cardList[idx].id);
    },

    payButtonText() {
      if (this.isPaying) return '支付中...';
      if (this.payInfo) {
        const dkPrice = parseFloat(this.payInfo.dkprice || 0);
        const wxPrice = parseFloat(this.payInfo.wxprice || 0);

        // 只能卡支付：按钮只显示卡金额
        if (this.cardOnly) {
          return dkPrice > 0
            ? `福利卡支付 ￥${dkPrice}`
            : `确认支付 ￥${this.orderInfo.total_fee || '0.00'}`;
        }

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
    openPasswordDialog() {
      this.password = "";
      this.showPasswordDialog = false;
      setTimeout(() => {
        this.showPasswordDialog = true;
      }, 50);
    },
    onPasswordInput(password) {
      this.password = password;
      if (password.length === 6) {
        this.confirmCardPay();
      }
    },
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
    isSelected(index) {
      return this.selectedList.includes(index);
    },
    async toggleCard(index) {
      const idx = this.selectedList.indexOf(index);
      if (idx > -1) {
        this.selectedList.splice(idx, 1);
      } else {
        this.selectedList.push(index);
      }
      await this.calculatePayInfo();
    },
    showRule() {
      const msg = this.cardOnly
        ? '1. 请选择要使用的乐汇卡\n2. 本商户仅支持福利卡支付\n3. 卡内余额需足够支付订单全额'
        : '1. 请选择要使用的乐汇卡\n2. 卡内余额足够时，直接使用卡支付\n3. 卡内余额不足时，自动使用卡+微信组合支付\n4. 未选择卡时，使用微信支付';
      this.$dialog.alert({
        title: '支付规则',
        message: msg
      });
    },
    async fetchOrderInfo() {
      console.log('=== 查询订单 ===');
      console.log('order_no:', this.orderNo);
      console.log('type:', this.orderType);

      try {
        this.$toast.loading({ message: '加载中...', forbidClick: true, duration: 0 });

        const res = await getZhanfumaOrderInfo({
          order_no: this.orderNo,
          type: this.orderType
        });

        this.$toast.clear();

        console.log('订单查询完整返回:', JSON.stringify(res));
        console.log('code:', res.code);
        console.log('msg:', res.msg);
        console.log('data:', res.data);

        if (res.code === 200 && res.data) {
          this.orderInfo = res.data;
          console.log('  订单信息:', this.orderInfo);
          console.log('  本地订单ID:', this.orderInfo.id);
        } else {
          console.log('  订单不存在，使用URL参数');
          this.orderInfo = {
            order_no: this.orderNo,
            total_fee: this.$route.query.payAmount || '0.00'
          };
        }

        await this.fetchCardList();
      } catch (error) {
        this.$toast.clear();
        console.error('订单查询异常:', error);
        this.orderInfo = {
          order_no: this.orderNo,
          total_fee: this.$route.query.payAmount || '0.00'
        };
        await this.fetchCardList();
      }
    },
    async fetchCardList() {
      try {
        const res = await getZhanfumaCardList({});
        if (res.code === 200 && res.data) {
          this.cardList = res.data || [];
          console.log('福利卡列表:', this.cardList);

          let validIndex = -1;
          if (this.cardOnly) {
            // 只能卡支付：默认选余额最大的一张
            let maxPrice = 0;
            this.cardList.forEach((card, i) => {
              const p = parseFloat(card.price) || 0;
              if (p > maxPrice) {
                maxPrice = p;
                validIndex = i;
              }
            });
          } else {
            validIndex = this.cardList.findIndex(card => parseFloat(card.price) > 0);
          }
          if (validIndex > -1) {
            this.selectedList = [validIndex];
          } else {
            this.selectedList = [];
          }
          await this.calculatePayInfo();
        } else {
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
      if (!this.orderInfo.id) {
        this.payInfo = {
          dkprice: 0,
          wxprice: this.allowWechat
            ? (parseFloat(this.orderInfo.total_fee) || 0)
            : 0
        };
        return;
      }

      try {
        const params = {
          id: String(this.orderInfo.id),
          type: String(this.orderType)
        };

        if (this.selectedCardIds.length > 0) {
          params.fulika = this.selectedCardIds.join(',');
        }

        const res = await calculateZhanfumaPayment(params);

        if (res.code === 200 && res.data) {
          const data = res.data;
          // 不允许微信时，只忽略微信金额，不篡改原始数据
          this.payInfo = {
            ...data,
            wxprice: this.allowWechat ? (data.wxprice || 0) : 0
          };
        } else {
          this.payInfo = {
            dkprice: 0,
            wxprice: this.allowWechat
              ? (parseFloat(this.orderInfo.total_fee) || 0)
              : 0
          };
        }
      } catch (error) {
        this.payInfo = {
          dkprice: 0,
          wxprice: this.allowWechat
            ? (parseFloat(this.orderInfo.total_fee) || 0)
            : 0
        };
      }
    },
    async handlePay() {
      if (this.isPaying) return;
      if (!this.payInfo) {
        await this.calculatePayInfo();
      }

      const dkPrice = parseFloat(this.payInfo?.dkprice || 0);
      const wxPrice = parseFloat(this.payInfo?.wxprice || 0);

      // ★ 只能卡支付：必须选卡，且必须有可抵扣金额
      if (this.cardOnly) {
        if (this.selectedList.length === 0) {
          this.$toast.fail('请选择福利卡');
          return;
        }
        if (dkPrice <= 0) {
          this.$toast.fail('福利卡无可支付金额');
          return;
        }
        // 余额是否足够，交给 payZhanfumaByCard 后端返回

        this.openPasswordDialog();   // ← 改这里
        return;
      }

      // 纯卡支付
      if (dkPrice > 0 && wxPrice <= 0) {
        if (this.selectedList.length === 0) {
          this.$toast.fail('请选择福利卡');
          return;
        }
        this.openPasswordDialog();
        return;
      }

      // 组合支付或纯微信支付 → 直接微信支付
      if (wxPrice > 0) {
        await this.handleWechatPay();
        return;
      }

      this.$toast.fail('请选择支付方式');
    },

    async confirmCardPay() {
      if (this.password.length < 6) {
        this.$toast.fail('请输入6位支付密码');
        return;
      }
      this.isPaying = true;
      // this.showPasswordDialog = false;   // ★ 删掉这行

      const kaIds = this.payInfo?.ka_ids || this.selectedCardIds;
      try {
        this.$toast.loading({ message: '卡支付中...', forbidClick: true, duration: 0 });
        const res = await payZhanfumaByCard({
          id: String(this.orderInfo.id),
          type: this.orderType,
          ka_ids: JSON.stringify(kaIds),
          pass: this.password
        });
        this.$toast.clear();
        this.password = "";
        if (res.code === 200) {
          this.isPaying = false;
          this.$toast.success('支付成功');
          await this.callPaySuccess();
          setTimeout(() => {
            this.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
          }, 1500);
        } else {
          this.isPaying = false;
          this.$toast.fail(res.msg || '卡支付失败');
          // 密码错误，可以重弹
          if ((res.msg || '').includes('密码')) {
            this.openPasswordDialog();
          }
        }
      } catch (error) {
        this.$toast.clear();
        this.isPaying = false;
        this.password = "";
        this.$toast.fail('卡支付失败');
      }
    },
    async handleWechatPay() {
      if (!this.allowWechat) {
        this.$toast.fail('当前商户不支持微信支付');
        return;
      }
      try {
        this.$toast.loading({ message: '正在调起微信支付...', forbidClick: true, duration: 0 });
        const openid = localStorage.getItem('openid');
        if (!openid) {
          this.$toast.clear();
          this.$toast.fail('未获取到openid');
          this.isPaying = false;
          return;
        }
        const res = await payZhanfumaByWechat({
          id: String(this.orderInfo.id),
          ka_ids: JSON.stringify(this.selectedCardIds.length > 0 ? this.selectedCardIds : []),
          type: this.orderType,
          openid: openid
        });
        this.$toast.clear();
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

    invokeWechatPay(jsApiParameters) {
      console.log('=== 调起微信支付 ===');
      console.log('参数:', JSON.stringify(jsApiParameters));
      const that = this;
      const payParams = {
        appId: jsApiParameters.appId,
        timeStamp: jsApiParameters.timestamp || jsApiParameters.timeStamp,
        nonceStr: jsApiParameters.nonceStr,
        package: jsApiParameters.package,
        signType: jsApiParameters.signType || 'MD5',
        paySign: jsApiParameters.paySign
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
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            console.log('  微信支付成功');
            that.isPaying = false;
            that.$toast.success('支付成功');
            that.callPaySuccess();
            setTimeout(() => {
              that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } });
            }, 1500);
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            console.error('  支付失败:', res);
            that.isPaying = false;
            that.$toast.fail('支付失败');
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            that.isPaying = false;
          }
        });
      } else {
        this.$toast.fail('微信支付环境不可用');
        this.isPaying = false;
      }
    },
    async callPaySuccess() {
      try {
        const res = await zhanfumaPaySuccess({
          id: String(this.orderInfo.id),
          type: this.orderType
        });
        console.log('支付回调结果:', res);
      } catch (error) {
        console.error('支付回调失败:', error);
      }
    }
  },
  created() {
    console.log('=== 收银台路由参数 ===');
    console.log('完整query:', this.$route.query);

    this.orderNo = this.$route.query.orderId || '';

    const interfaceTypeCode = this.$route.query.interfaceTypeCode || '';
    const typeMap = {



      'gq_pay_interface': '1',           // 锅圈
      'yx_wumei_pay_interface': '2',     // 物美
      'drf_scan_interface': '3',         // 大润发
      'yh_qrcode_interface': '4',        // 永辉
      'union_hdl_interface': '5',        // 海底捞
      'union_sam_interface': '6',        // 山姆
      'union_gas_interface': '7',        // 中石化中石油
      'mdl_interface': '8',              // 麦德龙
      'wcs_interface': '9',              // 屈臣氏      ← 原 '10'，改 '9'
      'hm_zfm_interface': '10',          // 盒马展付码  ← 原 '14'，改 '10'
      'lxh_interface': '11',             // 泸溪河      ← 原 '9'，改 '11'
      'mxc_interface': '12',             // 名创优品    ← 原 '11'，改 '12'
      'wyj_interface': '13',             // 无印良品    ← 原 '12'，改 '13'
      'zfb_interface': '14',             // 支付宝      ← 原 '13'，改 '14'
      'housing_jd_interface': '20',      // JD上门家政
      'hotel_interface': '21',           // 特惠酒店
      'bestway_hotel_interface': '21',   // 特惠酒店（bestway）  ← 新增
      'taxi_interface': '22',            // 特惠打车
    };
    this.orderType = typeMap[interfaceTypeCode] || '1';

    //   先查询订单获取本地ID
    if (this.orderNo) {
      this.fetchOrderInfo();  //   调用 fetchOrderInfo
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
  cursor: pointer;
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
  margin-top: 10px;
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

/* 复选框样式 */
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
</style>