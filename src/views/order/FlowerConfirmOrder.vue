<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 地址 -->
    <div class="addressBox">
      <div class="address">
        <div v-if="!addrShow" style="font-size: 14px">您还没有配送地址，去新建一个</div>
        <div class="leftBox" v-else>
          <div class="addressIcon"><img class="img" src="../../assets/tubiao/dd.png" alt=""></div>
          <div>
            <div><span class="userName">{{ addrShow.name }}</span><span class="phone">{{ addrShow.phone }}</span></div>
            <div class="addressDetail">{{ addrShow.addr }}</div>
          </div>
        </div>
        <!-- <div><van-icon color="#CBCBCB" name="arrow" /></div> -->
      </div>
    </div>

    <!-- 商品信息（按平台分组） -->
    <div class="addressBox addressBox2" v-for="(group, index) in groupedOrderList" :key="index">
      <!-- 平台头部 -->
      <div class="platform-header">
        <span class="platform-tag" :class="'platform-' + group.platform">
          {{ group.platform_name || getPlatformName(group.platform) }}
        </span>
      </div>

      <!-- 平台下的商品 -->
      <div class="shopInfo" v-for="item in group.items" :key="item.id">
        <div class="shopImg"><img style="border-radius: 5px;" class="img" :src="item.img" alt=""></div>
        <div class="nameBox">
          <div class="shopName">{{ item.title }}</div>
          <div class="can" v-if="item.spec_name">{{ item.spec_name }}</div>
          <div class="all">
            <!-- <div class="price">￥{{ item.product.sell_price }}</div> -->
            <div class="price"><span style="font-size: 10px;">￥</span>{{ Number(item.sell_price).toFixed(2) }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>


        </div>
      </div>
     
      <!-- 平台小计 -->
      <div class="platform-summary">
        <div class="orderInfo">
          <div class="shopPrice">
            <div class="shopPriceText">商品金额</div>
            <!-- <div class="price">￥{{ group.totalPrice }}</div> -->
            <div class="price"><span style="font-size: 10px;">￥</span>{{ Number(group.totalPrice).toFixed(2) }}</div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">运费</div>
            <div class="price"><span style="font-size: 10px;">￥</span>{{ Number(group.freight || 0).toFixed(2) }}</div>
          </div>
        </div>
        <div class="group-subtotal">
          共 {{ group.count }} 件，小计：<div class="price"><span style="font-size: 10px;">￥</span>{{
            Number(group.totalPrice).toFixed(2) }}</div>
        </div>
      </div>
    </div>
<div style="background-color: white;
    border-radius: 10px;
    margin-bottom: 10px;font-size: 14px;padding:16px;">
   送达时间：{{ timeArrive }}
</div>
    <!-- 支付方式 -->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>

    <!-- 支付按钮 -->
    <div class="footer">
      <div class="allNumber">共{{ totalCount }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">合计: <span class="price">{{ changePrice1(total) }}</span><span class="priceNum">.{{
            changePrice2(total) }}</span></div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>

<script>
import Payment from "@/components/Payment.vue";
import { wxPay } from "@/api/cart";
import { getPlatformName } from '@/utils/platform'
import { flowerOrderDetail } from "@/api/flower";
import PayPassword from "@/components/PayPassword.vue";
import { orderDetail, cardList, cartList, orderBuyNow, orderSubmit, payByCard, userInfo, orderSettle } from "@/api/lhjdtm";

export default {
  name: "ConfirmOrder",
  components: { Payment, PayPassword },
  data() {
    return {
      timeArrive: '',
      group_id: '',
      deliveryInfo: null,   // ✅ 新增
      orderDeliveryId: null,   // 新增
      isSet: false, // 是否已设置支付密码
      cardList: [], orderList: [], addrShow: {}, total: 0, result: [], checked: "",
      isShow: false, dataDetail: {}, order_id: "", pass: "", remark: "",
      openid: "", loadingflag: true, isLoading: false,
      groupedOrderList: [] // 按平台分组后的订单列表
    }
  },
  methods: {
    getPlatformName,
    // 按平台分组计算逻辑
    groupOrderList() {
      const groups = {};
      this.orderList.forEach(item => {
        const platform = Number(item.product.platform) || 0;
        if (!groups[platform]) {
          groups[platform] = { platform, items: [], totalPrice: 0, count: 0 };
        }
        groups[platform].items.push(item);
        groups[platform].totalPrice += Number(item.product.sell_price) * Number(item.quantity);
        groups[platform].count += Number(item.quantity);
      });
      this.groupedOrderList = Object.values(groups);
    },

    // 判断用户是否已设置支付密码
    checkPayPwd() {
      userInfo().then(res => {
        if (res.code == 200) {
          if (res.data && res.data.has_pay_pwd == 1) {
            this.isSet = true
          } else {
            this.isSet = false
          }
        }
      })
    },
    isWeiXin() { return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" },

    getResult(result, checked) {
      console.log("[ConfirmOrder] getResult:", JSON.stringify(result), checked)   // ⚠ 加
      this.result = result; this.checked = checked
    },




    getCheckout() {
      if (!this.order_id) {
        this.loadingflag = false;
        return;
      }
      flowerOrderDetail({ order_id: Number(this.order_id) }).then(res => {
        console.log('[FlowerConfirmOrder] detail =', JSON.stringify(res))
        if (res.code == 200 && res.data) {
          const d = res.data;
          this.groupedOrderList = [{
            platform: 5,
            platform_name: "鲜花",
            items: [{
              id: 0,
              title: d.product_name || d.title || this.$route.query.item_name || '',
              img: d.product_image || d.img || this.$route.query.item_img || '',
              sell_price: Number(d.sell_price || d.discount_price || this.$route.query.item_price) || 0,
              spec_name: '',
              quantity: Number(d.num || d.quantity || this.$route.query.num) || 1,
              product: {
                title: d.product_name || this.$route.query.item_name || '',
                img: d.product_image || this.$route.query.item_img || '',
                sell_price: Number(d.sell_price || this.$route.query.item_price) || 0,
                platform: 5
              }
            }],
            totalPrice: Number(d.pay_amount || d.total_price || this.total) || 0,
            goodsTotal: Number(d.pay_amount || d.total_price || this.total) || 0,
            freight: "0.00",
            count: Number(d.num || d.quantity || 1) || 1
          }];
          this.orderList = this.groupedOrderList.flatMap(g => g.items);
          this.total = Number(d.pay_amount || d.total_price || this.total) || 0;
          this.loadingflag = false;
          this.timeArrive = res.data.arrive_time_text
        } else {
          this.loadingflag = false;
          this.$toast(res.msg || "获取订单失败");
        }
      }).catch(() => {
        this.loadingflag = false;
        this.$toast("网络异常");
      });
    },

    toPay() {
      console.log("[ConfirmOrder] toPay 开始, isLoading =", this.isLoading)
      console.log("[ConfirmOrder] result =", JSON.stringify(this.result), "checked =", this.checked)
      if (this.isLoading) return;
      if (!this.addrShow || (!this.addrShow.name && !this.addrShow.addr)) {
        this.$toast("请先选择收货地址")
        return
      }


      if (this.result.length == 0 && !this.checked) {
        this.$toast("请选择福利卡支付")
        return
      }
      this.isLoading = true

      if (this.order_id) {
        userInfo().then(res => {
          if (res.code == 200) {
            if (res.data.has_pay_pwd == 1) {
              this.isSet = true
              this.doPay()
            } else {
              this.isSet = false
              this.$toast("请先设置支付密码")
              this.isLoading = false
              this.$router.push({ path: "/payPassword", query: { from: 'confirm' } })
            }
          } else {
            // ✅ 补这里
            this.isLoading = false
            this.$toast(res.msg || '获取用户信息失败')
          }
        }).catch(() => {
          // ✅ 补这里
          this.isLoading = false
          this.$toast('网络异常')
        })
        return
      }

      userInfo().then(res => {
        if (res.code == 200) {
          if (res.data.has_pay_pwd == 1) {
            this.isSet = true
            this.submitOrder()
          } else {
            this.isSet = false
            this.$toast("请先设置支付密码")
            this.isLoading = false
            sessionStorage.setItem('confirmOrderData', JSON.stringify(this.dataDetail))
            this.$router.push({ path: "/payPassword", query: { from: 'confirm' } })
          }
        } else {
          // ✅ 补这里
          this.isLoading = false
          this.$toast(res.msg || '获取用户信息失败')
        }
      }).catch(() => {
        // ✅ 补这里
        this.isLoading = false
        this.$toast('网络异常')
      })
    },
    submitOrder() {
      if (this.dataDetail.cartIds) {
        orderSubmit({
          address_id: this.addrShow.id,
          cartIds: this.dataDetail.cartIds,
          remark: this.remark
        }).then(res => {
          if (res.code == 200) {
            this.order_id = res.data.order_id
            this.group_id = res.data.group_id
            sessionStorage.removeItem('confirmOrderData')

            // ✅ 挂到 URL，刷新/支付失败后可恢复
            this.$router.replace({
              path: '/confirmOrder',
              query: {
                order_id: res.data.order_id,
                group_id: res.data.group_id || undefined,
                total_price: res.data.pay_amount
              }
            })

            this.doPay()
          } else { this.isLoading = false; this.$toast(res.msg || '下单失败') }
        })
      } else {
        orderBuyNow({
          product_id: Number(this.dataDetail.product_id),
          quantity: Number(this.dataDetail.quantity),
          address_id: this.addrShow.id,
          platform: Number(this.dataDetail.platform) || 1,
          sku: this.dataDetail.sku || "",
          spec_name: this.dataDetail.spec_name || ""
        }).then(res => {
          if (res.code == 200) {
            this.order_id = res.data.order_id
            sessionStorage.removeItem('confirmOrderData')

            this.$router.replace({
              path: '/confirmOrder',
              query: {
                order_id: res.data.order_id,
                total_price: res.data.pay_amount || this.total
              }
            })

            this.doPay()
          } else { this.isLoading = false; this.$toast(res.msg || '下单失败') }
        })
      }
    },
    payByWechat(kaIds) {
      const wxPayload = {
        openid: localStorage.getItem("openid")
      }
      if (this.group_id) {
        wxPayload.group_id = Number(this.group_id)
      } else if (this.order_id) {
        wxPayload.order_id = Number(this.order_id)
      } else {
        this.isLoading = false
        this.$toast('订单信息缺失')
        return
      }

      if (kaIds && kaIds.length > 0) {
        wxPayload.ka_ids = kaIds.join(',')
      }

      wxPay(wxPayload).then(res => {

        console.log('=== wxPay 返回 ===')
        console.log('请求参数:', JSON.stringify(wxPayload))
        console.log('完整返回:', JSON.stringify(res))
        console.log('jsApiParameters:', JSON.stringify(res.data && res.data.jsApiParameters))

        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        } else if (res.code == 4) {
          // 卡余额够，走福利卡密码支付
          this.isLoading = false
          this.isShow = true
        } else {
          this.isLoading = false
          this.$toast(res.msg || '支付失败')
        }
      }).catch(() => {
        this.isLoading = false
        this.$toast('网络异常')
      })
    },
    doPay() {
      // 没选卡 → 纯微信
      if (!this.result || this.result.length === 0) {
        if (!this.isWeiXin()) {
          this.$toast("请使用微信打开支付")

          this.isLoading = false
          return
        }
        this.payByWechat([])
        return
      }

      // 选了卡 → 判断余额
      const enough = this.selectedCardBalance >= Number(this.total)

      if (enough) {
        // 余额够 → 福利卡支付（输密码）
        if (!this.isSet) {
          this.$toast("请先设置支付密码")
          this.isLoading = false
          sessionStorage.setItem('confirmOrderData', JSON.stringify(this.dataDetail))
          this.$router.push({ path: "/payPassword", query: { from: 'confirm' } })
          return
        }
        this.isShow = false
        this.$nextTick(() => {
          this.isShow = true
          this.isLoading = false
        })
      } else {
        // 余额不够 → 卡 + 微信组合
        if (!this.isWeiXin()) {
          this.$toast("请使用微信打开支付")
          this.isLoading = false
          return
        }
        this.payByWechat(this.result)
      }
    },
    onBridgeReady(params, order_no) {
      this.isLoading = false

      // ✅ 新增：WeixinJSBridge 未就绪时先监听
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no)
          }, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no)
          })
          document.attachEvent('onWeixinJSBridgeReady', () => {
            this.invokeWxPay(params, order_no)
          })
        }
        return
      }

      this.invokeWxPay(params, order_no)
    },

    // ✅ 新增：真正调起支付的方法
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
          this.$toast('支付成功')
          setTimeout(() => this.$router.replace("/orderInfo"), 1000)
        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
          this.$toast('已取消支付')
        } else {
          this.$toast('支付失败')
        }
      })
    },
    onInput(key) {
      this.pass = key
      if (this.pass.length == 6) {
        this.isShow = false

        const payload = {
          card_num_ids: (this.result || []).join(','),
          pay_pass: this.pass
        }
        if (this.group_id) {
          payload.group_id = Number(this.group_id)
        } else {
          payload.order_id = Number(this.order_id)
        }

        payByCard(payload).then(res => {
          this.$toast(res.msg || '支付成功')
          if (res.code == 200) {


            setTimeout(() => { this.$router.replace("/orderInfo") }, 1000)
          } else {
            // this.isShow = true
            this.pass = ""

            this.$toast(res.msg)
          }
        }).catch(err => {


          this.$toast('支付失败，请重试')
          this.isShow = true
          this.pass = ""
        })
      }
    },
    input(e) {
      this.isShow = e
      this.isLoading = false
    },

    getCard() {
      cardList().then(res => {
        if (res.code == 200) {
          this.cardList = (res.data.data || []).filter(item => item.is_expired !== 1).map(item => ({
            id: item.id, balance: item.balance, disabled: item.disabled,
            title: item.card ? item.card.title : '', num: item.num,
            expire_time_text: item.expire_time_text || ''
          }))
          // let firstAvailable = this.cardList.find(card => card.disabled == 0 && Number(card.balance) > 0)
          // this.result = firstAvailable ? [firstAvailable.id] : []
          this.result = []   // ✅ 默认不选
        }
      })
    },
    changePrice1(price) {
      if (!price) return '0'
      return Number(price).toFixed(2).split('.')[0]
    },

    changePrice2(price) {
      if (!price) return '00'
      return Number(price).toFixed(2).split('.')[1]
    },

    getOrderDetail() {
      return orderDetail({ id: this.order_id }).then(res => {
        if (res.code == 200 && res.data) {
          const detail = res.data

          this.deliveryInfo = detail.delivery || null
          this.orderDeliveryId = detail.delivery ? detail.delivery.id : null

          // ✅ 列表入口：只渲染当前这一单，不用 group_orders
          this.groupedOrderList = [{
            platform: detail.platform,
            platform_name: detail.platform_name || this.getPlatformName(detail.platform),
            items: (detail.items && detail.items.length ? detail.items : [{
              id: 0,
              product_title: detail.product_title,
              product_img: detail.product_img,
              sell_price: detail.sell_price,
              spec_name: '',
              quantity: detail.quantity
            }]).map((it, idx) => ({
              id: it.id || idx,
              title: it.product_title,
              img: it.product_img,
              sell_price: it.sell_price,
              spec_name: it.spec_name || '',
              quantity: Number(it.quantity) || 1,
              product: {
                title: it.product_title,
                img: it.product_img,
                sell_price: it.sell_price,
                platform: detail.platform
              }
            })),
            totalPrice: detail.total_price,
            goodsTotal: detail.total_price,
            freight: detail.freight ?? '0.00',
            count: Number(detail.quantity) || 1
          }]

          this.orderList = this.groupedOrderList.flatMap(g => g.items)
          this.total = Number(detail.total_price) || 0

          this.loadingflag = false
        } else {
          this.loadingflag = false
          this.$toast(res.msg || '获取订单详情失败')
        }
      }).catch(() => {
        this.loadingflag = false
        this.$toast('网络异常')
      })
    },
  },
  created() {
    if (this.$route.query.order_id) {
      this.order_id = this.$route.query.order_id;
      this.total = Number(this.$route.query.item_price || 0);

      // ✅ 地址来自详情页传参，不调 addressList
      this.addrShow = {
        id: this.$route.query.address_id || '',           // 鲜花没有 address_id，可为空
        name: this.$route.query.addr_name || '',          // 详情页传的收货人
        phone: this.$route.query.addr_phone || '',        // 详情页传的电话
        addr: this.$route.query.addr_text || ''           // 详情页传的完整地址
      }

      this.getCard();
      this.checkPayPwd();
      this.getCheckout();   // 不再依赖 getAddress
      return;
    }
    this.$toast("缺少订单信息");
    setTimeout(() => this.$router.go(-1), 800);
  },
  computed: {
    totalCount() {
      return this.orderList.reduce((s, i) => s + Number(i.quantity), 0)
    },
    selectedCardBalance() {
      if (!this.result || this.result.length === 0) return 0
      return this.result.reduce((sum, id) => {
        const card = this.cardList.find(c => c.id === id)
        if (!card || card.disabled == 1) return sum
        return sum + Number(card.balance)
      }, 0)
    }
  }
}
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

.addressBox3 {
  padding: 0px;
}

/* 平台头部样式 */
.platform-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #F5F5F5;
  margin-bottom: 10px;
}

.platform-tag {
  font-size: 14px;
  // padding: 3px 10px;
  // border-radius: 4px;
  font-weight: 600;
}

/* 京东 - 红色 */
.platform-1 {
  // background-color: #FFF0F0;
  color: #342C2C;
  // border: 1px solid #FFC4C4;
}

/* 天猫 - 红色/粉色 */
.platform-2 {
  // background-color: #FFF0F0;
  color: #342C2C;
  // border: 1px solid #FFB3C1;
}

/* 京东京造 - 蓝色 */
.platform-3 {
  // background-color: #F0F6FF;
  color: #342C2C;
  // border: 1px solid #B3D4FF;
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
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

/* 平台小计区域样式 */
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
  text-align: right;
  font-size: 13px;
  margin-top: 10px;
  color: #333;

  .price {
    color: #C93F3D;
    font-weight: bold;
    font-size: 16px;
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