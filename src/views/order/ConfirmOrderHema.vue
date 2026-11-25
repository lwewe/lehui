<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 地址（只读，从上一页带过来） -->
    <div class="addressBox" @click="changeAdress">
      <div class="address">
        <!--   -->
        <div v-if="!addrShow" style="font-size: 14px; color: #333; display: flex; align-items: center; gap: 5px;">
          <van-icon name="location-o" size="18" color="#999" />
          还没有配送地址，去新建一个
        </div>
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
        <div><van-icon color="#CBCBCB" name="arrow" /></div>
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
import { wxPay } from "@/api/cart";
import { cardList, userInfo, payByCard, orderDetail, addressList, orderSubmit, orderUpdateAddress, orderBuyNow } from "@/api/lhjdtm";
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
// import { hemaCreateOrder } from "@/api/hemaapi";

export default {
  name: "ConfirmOrderHema",
  components: { Payment, PayPassword },
  data() {
    return {
      loadingflag: true,
      isLoading: false,
      dataDetail: {}, //  
      order_id: "",
      order_no: "",
      total: 0,
      goodsTotal: 0,
      freight: 0,

      orderList: [],
      addrShow: null,

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
    initData() {
      const q = this.$route.query;

      this.getCard();
      this.checkPayPwd();

      // 🚨 1. 第一时间检查是不是从地址页切回来的
      const selectedId = sessionStorage.getItem('selectedAddressId');
      if (selectedId && q.order_id) {
        sessionStorage.removeItem('selectedAddressId'); // 立刻清除标记，防止死循环

        // 先把订单号等基础数据存入
        this.order_id = q.order_id;
        this.order_no = q.order_no || "";
        if (Number(q.total_price) > 0) this.total = Number(q.total_price);

        // 如果本地没有商品，先去缓存里兜个底
        if (!this.orderList || this.orderList.length === 0) {
          this.loadLocalData();
        }

        // 直接进入静默切换地址逻辑，绝不走后面的 getOrderDetail
        this.updateOrderAddressAndReload(Number(selectedId), q.order_id);
        return;
      }

      // 🚨 2. 正常初始化（首次进来）
      if (!this.orderList || this.orderList.length === 0) {
        this.loadLocalData();
      }

      if (q.order_id) {
        this.order_id = q.order_id;
        this.order_no = q.order_no || "";

        if (Number(q.total_price) > 0) {
          this.total = Number(q.total_price);
        }

        if (q.address_detail) {
          this.addrShow = {
            id: Number(q.address_id) || 0,
            name: q.consignee_name || "",
            phone: q.consignee_phone || "",
            addr: q.address_detail
          };
        }
        this.getOrderDetail();
        return;
      }

      this.fetchDefaultAddress(() => {
        this.loadingflag = false;
      });
    },
    // 获取默认地址（用于新订单）
    async fetchDefaultAddress(callback) {
      if (this.addrShow && this.addrShow.id) {
        if (callback) callback();
        return;
      }
      try {
        const res = await addressList({});
        if (res.code === 200 && res.data && res.data.length) {
          // 盒马要求找支持配送的地址
          const def = res.data.find(i => i.is_default == 1 && i.can_hema == 1) || res.data.find(i => i.can_hema == 1) || res.data[0];
          const fullAddr = [def.province_name, def.city_name, def.county_name, def.town_name, def.addr].filter(Boolean).join(' ');
          this.addrShow = { id: def.id, name: def.name, phone: def.phone, addr: fullAddr };
        }
      } catch (e) {
        console.error("获取地址失败", e);
      }
      if (callback) callback();
    },

    loadLocalData() {
      // 优先级 1：购物车过来的缓存
      const cartDataStr = sessionStorage.getItem('cartConfirmData');
      if (cartDataStr) {
        this.orderList = JSON.parse(cartDataStr);
        this.calcTotal();
        return;
      }
      // 优先级 2：详情页直接购买过来的缓存
      const hemaData = sessionStorage.getItem('hemaConfirmData');
      if (hemaData) {
        const detail = JSON.parse(hemaData);
        // 兼容 skus 结构
        let title = detail.product_title || '盒马商品';
        let price = detail.sell_price || 0;
        let spec_name = detail.spec_name || '';
        if (detail.skus) {
          try {
            const s = JSON.parse(detail.skus)[0];
            if (s) { spec_name = s.spec_name; }
          } catch (e) { }
        }

        this.orderList = [{
          id: 0,
          title: title,
          img: detail.product_img || '',
          sell_price: price,
          spec_name: spec_name,
          quantity: Number(detail.quantity) || 1
        }];
        this.calcTotal();
      }
    },
    // 切换地址后的静默重算

    async updateOrderAddressAndReload(newAddressId, orderId) {
      try {
        const res = await addressList({});
        if (res.code === 200) {
          const newDef = res.data.find(i => i.id === newAddressId);
          if (newDef) {
            const fullAddr = [newDef.province_name, newDef.city_name, newDef.county_name, newDef.town_name, newDef.addr].filter(Boolean).join(' ');
            this.addrShow = { id: newDef.id, name: newDef.name, phone: newDef.phone, addr: fullAddr };

            // 备份当前数据
            const backupOrderList = JSON.parse(JSON.stringify(this.orderList));
            const backupGoodsTotal = this.goodsTotal;
            const backupTotal = this.total;

            // 通知后端更新地址
            await orderUpdateAddress({ order_id: orderId, address_id: newAddressId });

            // 🚨 强制去拉取最新价格（但绝对不覆盖有效数据）
            this.getOrderDetail().then(() => {
              if (!this.orderList || this.orderList.length === 0 || Number(this.total) === 0) {
                console.warn("更新地址后接口返回异常，恢复本地备份");
                this.orderList = backupOrderList;
                this.goodsTotal = backupGoodsTotal;
                this.total = backupTotal;
              }
            });
          }
        }
      } catch (e) {
        this.$toast("获取新地址失败");
      } finally {
        this.loadingflag = false;
      }
    },

    // 购物车下单
    submitCartOrder(cartIds, addressId) {
      orderSubmit({
        address_id: addressId,
        cartIds: cartIds
      }).then(res => {
        this.loadingflag = false;
        if (res.code === 200 && res.data) {
          if (res.data.has_skipped === 1) {
            let skippedMsg = "部分商品无法配送：\n";
            (res.data.skipped || []).forEach(item => {
              skippedMsg += `${item.source_name || '盒马'}：${item.reason || '不在配送范围'}\n`;
            });
            this.$dialog.alert({ title: '提示', message: skippedMsg });
            if (!res.data.order_id) return;
          }

          if (res.data.order_id) {
            this.handleOrderSuccess(res.data);
          } else {
            this.$toast("生成订单失败，无可结算商品");
          }
        } else {
          this.$toast(res.msg || "生成订单失败");
        }
      }).catch(() => {
        this.loadingflag = false;
        this.$toast("网络异常");
      });
    },

    // 详情页直接购买下单
    // 详情页直接购买下单（对接最新的 orderBuyNow 接口）
    submitDirectOrder(params) {
      // 1. 兼容处理：从缓存/老结构里提取出最新的接口参数
      let realProductId = params.product_id;
      let realSkuId = params.sku || params.sku_id;

      // 如果是详情页通过 skus 字符串存过来的，需要解析出来
      if (params.skus && typeof params.skus === 'string') {
        try {
          const skuArr = JSON.parse(params.skus);
          if (skuArr && skuArr.length > 0) {
            realProductId = skuArr[0].product_id;
            realSkuId = skuArr[0].sku_id;
          }
        } catch (e) {
          console.error("解析 skus 失败", e);
        }
      }

      // 2. 组装新接口需要的参数
      const requestData = {
        product_id: Number(realProductId),
        quantity: Number(params.quantity) || 1,
        address_id: Number(params.address_id),
        platform: 4, // 🚨 盒马必须传 4
        sku: realSkuId ? String(realSkuId) : "", // 盒马必传，String格式
        spec_name: params.spec_name || "",
        remark: params.remark || ""
      };

      console.log("调用盒马下单接口 orderBuyNow 入参：", requestData);

      // 3. 发起真实请求
      orderBuyNow(requestData).then(res => {
        this.loadingflag = false;
        this.isLoading = false;
        if (res.code === 200 && res.data) {
          this.handleOrderSuccess(res.data);
        } else {
          // 🚨 这里会把后端的真实报错弹出来，比如“该地址不在盒马配送范围”
          this.$toast(res.msg || "生成订单失败");
        }
      }).catch((err) => {
        console.error("下单网络请求失败:", err);
        this.loadingflag = false;
        this.isLoading = false;
        this.$toast("网络异常，请稍后重试");
      });
    },
    // 统一处理订单生成成功
    handleOrderSuccess(data) {
      this.order_id = data.order_id;
      this.order_no = data.order_no || "";

      // 路由替换带上地址，防止刷新丢失
      this.$router.replace({
        path: '/ConfirmOrderHema',
        query: {
          order_id: this.order_id,
          order_no: this.order_no,
          total_price: data.total_price || 0,
          address_id: this.addrShow.id,
          consignee_name: this.addrShow.name,
          consignee_phone: this.addrShow.phone,
          address_detail: this.addrShow.addr
        }
      }).catch(() => { });

      // 清除本地缓存
      sessionStorage.removeItem('hemaConfirmData');
      sessionStorage.removeItem('cartConfirmData');

      this.getOrderDetail().then(() => {
        this.doPay();
      });
    },
    createOrderAndPay() {
      const q = this.$route.query;

      // 1. 购物车结算
      if (q.cartIds) {
        orderSubmit({ address_id: this.addrShow.id, cartIds: q.cartIds }).then(res => {
          this.isLoading = false;
          if (res.code === 200 && res.data && res.data.order_id) {
            this.handleOrderSuccess(res.data);
          } else {
            this.$toast(res.msg || "生成订单失败");
          }
        }).catch(() => {
          this.isLoading = false; this.$toast("网络异常");
        });
        return;
      }

      // 2. 详情页直接购买 (orderBuyNow)
      const cacheData = sessionStorage.getItem('hemaConfirmData');
      if (!cacheData) {
        this.isLoading = false;
        return this.$toast("商品信息已失效");
      }

      const detail = JSON.parse(cacheData);
      let realProductId = detail.product_id;
      let realSkuId = detail.sku || detail.sku_id;

      // 兼容从 skus 字符串里取数据
      if (detail.skus) {
        try {
          const skuArr = JSON.parse(detail.skus);
          if (skuArr && skuArr.length > 0) {
            realProductId = skuArr[0].product_id;
            realSkuId = skuArr[0].sku_id;
          }
        } catch (e) { }
      }

      orderBuyNow({
        product_id: Number(realProductId),
        quantity: Number(detail.quantity) || 1,
        address_id: Number(this.addrShow.id),
        platform: 4, // 盒马
        sku: realSkuId ? String(realSkuId) : "",
        spec_name: detail.spec_name || ""
      }).then(res => {
        this.isLoading = false;
        if (res.code === 200 && res.data) {
          this.handleOrderSuccess(res.data);
        } else {
          this.$toast(res.msg || "下单失败");
        }
      }).catch(() => {
        this.isLoading = false; this.$toast("网络异常");
      });
    },
    // 查订单详情
    getOrderDetail() {
      return orderDetail({ id: this.order_id }).then(res => {
        if (res.code == 200 && res.data) {
          const detail = res.data;

          const hasValidItems = detail.items && detail.items.length > 0;
          const hasValidProduct = detail.product_title && detail.product_title !== '盒马商品' && Number(detail.sell_price) > 0;

          // 如果接口返回假数据，并且本地已经有真商品了，直接 return 阻断！
          if (!hasValidItems && !hasValidProduct) {
            if (this.orderList && this.orderList.length > 0) {
              console.warn("拦截无效商品，保留原数据");
              return;
            }
          }

          // 更新列表
          if (hasValidItems) {
            this.orderList = detail.items.map((it, idx) => ({
              id: it.id || idx,
              title: it.product_title || it.title,
              img: it.product_img || it.img,
              sell_price: it.sell_price,
              spec_name: it.spec_name || '',
              quantity: Number(it.quantity) || 1
            }));
          } else if (hasValidProduct) {
            this.orderList = [{
              id: 0,
              title: detail.product_title,
              img: detail.product_img,
              sell_price: detail.sell_price,
              spec_name: '',
              quantity: detail.quantity
            }];
          }

          // 更新金额
          if (Number(detail.total_price) > 0) {
            this.goodsTotal = Number(detail.total_price);
            this.freight = Number(detail.freight) || 0;
            this.total = this.goodsTotal + this.freight;
          }
        }
      }).catch((err) => {
        console.error("获取详情失败", err);
      }).finally(() => {
        this.loadingflag = false;
      });
    },
    calcTotal() {
      this.goodsTotal = this.orderList.reduce((sum, item) => sum + (Number(item.sell_price) * Number(item.quantity)), 0);
      this.total = this.goodsTotal + Number(this.freight || 0);
    },
    toPay() {
      if (this.isLoading) return;

      // 🚨 核心校验：没有地址ID，直接拦截
      if (!this.addrShow || !this.addrShow.id) {
        this.$toast("请先选择收货地址");
        return;
      }

      if (this.result.length == 0 && !this.checked) {
        this.$toast("请选择福利卡支付");
        return;
      }

      this.isLoading = true;

      userInfo().then(res => {
        if (res.code == 200) {
          if (res.data.has_pay_pwd == 1) {
            this.isSet = true;
            // 有订单 ID 直接去支付；没订单 ID 就调接口生成订单再支付
            if (this.order_id) {
              this.doPay();
            } else {
              this.createOrderAndPay();
            }
          } else {
            this.isSet = false;
            this.isLoading = false;
            this.$toast("请先设置支付密码");
            this.$router.push({ path: "/payPassword", query: { from: 'confirmHema' } });
          }
        } else {
          this.isLoading = false;
          this.$toast(res.msg || '获取用户信息失败');
        }
      }).catch(() => {
        this.isLoading = false;
        this.$toast('网络异常');
      });
    },


    isWeiXin() { return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"; },
    getResult(result, checked) { this.result = result; this.checked = checked; },
    getCard() {
      cardList().then(res => {
        if (res.code == 200) {
          this.cardList = (res.data.data || []).filter(item => item.is_expired !== 1).map(item => ({
            id: item.id, balance: item.balance, disabled: item.disabled,
            title: item.card ? item.card.title : '', num: item.num, expire_time_text: item.expire_time_text || ''
          }));
          this.result = [];
        }
      });
    },
    checkPayPwd() {
      userInfo().then(res => {
        if (res.code == 200) { this.isSet = res.data && res.data.has_pay_pwd == 1; }
      });
    },
    doPay() {
      if (!this.result || this.result.length === 0) {
        if (!this.isWeiXin()) { this.$toast("请使用微信打开支付"); this.isLoading = false; return; }
        this.payByWechat([]);
        return;
      }
      const enough = this.selectedCardBalance >= Number(this.total);
      if (enough) {
        if (!this.isSet) {
          this.$toast("请先设置支付密码");
          this.isLoading = false;
          this.$router.push({ path: "/payPassword", query: { from: 'confirmHema' } });
          return;
        }
        this.isShow = true;
        this.isLoading = false;
        return;
      }
      if (!this.isWeiXin()) { this.$toast("请使用微信打开支付"); this.isLoading = false; return; }
      this.payByWechat(this.result);
    },
    payByWechat(kaIds) {
      const wxPayload = { order_id: Number(this.order_id), order_no: this.order_no, openid: localStorage.getItem("openid") };
      if (kaIds && kaIds.length > 0) { wxPayload.ka_ids = kaIds.join(','); }

      wxPay(wxPayload).then(res => {
        if (res.code == 200 && res.data && res.data.jsApiParameters) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no);
        } else if (res.code == 4) {
          this.isLoading = false; this.isShow = true;
        } else {
          this.isLoading = false; this.$toast(res.msg || "支付失败");
        }
      }).catch(() => { this.isLoading = false; this.$toast("网络异常"); });
    },
    onInput(key) {
      this.pass = key;
      if (this.pass.length == 6) {
        this.isShow = false;
        payByCard({ order_id: Number(this.order_id), card_num_ids: (this.result || []).join(','), pay_pass: this.pass }).then(res => {
          if (res.code == 200) {
            this.$toast('支付成功');
            // setTimeout(() => this.$router.replace("/orderInfo"), 1000);
            setTimeout(() => {
              this.$router.replace({
                path: '/orderInfo',
                query: { refresh: Date.now() }
              });
            }, 1000);

          } else {
            this.pass = ""; this.$toast(res.msg || '支付失败');
          }
        }).catch(() => { this.pass = ""; this.$toast('支付失败，请重试'); });
      }
    },
    input(e) { this.isShow = e; this.isLoading = false; },
    onBridgeReady(params, order_no) {
      this.isLoading = false;
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', () => { this.invokeWxPay(params, order_no); }, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', () => { this.invokeWxPay(params, order_no); });
        }
        return;
      }
      this.invokeWxPay(params, order_no);
    },
    changeAdress() {
      sessionStorage.setItem('confirmOrderData', JSON.stringify(this.$route.query));
      this.$router.push({ path: '/address', query: { change: 0, from: 'confirmHema' } }).catch(() => { });
    },
    invokeWxPay(params, order_no) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        appId: params.appId, timeStamp: params.timestamp || params.timeStamp, nonceStr: params.nonceStr,
        package: params.package, signType: params.signType, paySign: params.paySign
      }, res => {
        if (res.err_msg === "get_brand_wcpay_request:ok") {
          this.$toast('支付成功');
          // setTimeout(() => this.$router.replace("/orderInfo"), 1000);
          setTimeout(() => {
            this.$router.replace({
              path: '/orderInfo',
              query: { refresh: Date.now() }
            });
          }, 1000);

        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          this.$toast('已取消支付');
        } else {
          this.$toast('支付失败');
        }
      });
    },
    changePrice1(price) { if (!price) return '0'; return Number(price).toFixed(2).split('.')[0]; },
    changePrice2(price) { if (!price) return '00'; return Number(price).toFixed(2).split('.')[1]; }
  },
  created() {
    this.initData();
  },
  activated() {
    if (sessionStorage.getItem('selectedAddressId')) {
      this.initData();
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