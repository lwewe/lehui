<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 收货地址 -->
    <div class="addressBox" v-if="detail.delivery && detail.delivery.name">
      <div class="address">
        <div class="leftBox">
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ detail.delivery.name }}</span>
              <span class="phone">{{ detail.delivery.phone }}</span>
            </div>
            <div class="addressDetail">
              {{ detail.delivery.province_name }}{{ detail.delivery.city_name }}{{ detail.delivery.county_name }}{{
                detail.delivery.addr }}{{ detail.delivery.detail }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="(item, index) in detail.items" :key="index">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="item.product_img" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.product_title }}</div>
          <div class="can" v-if="item.spec_name">{{ item.spec_name }}</div>
          <div class="all">
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ item.sell_price }}
            </div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配送信息（蛋糕专属） -->
    <div class="addressBox addressBox2" v-if="detail.ship_date || detail.ship_time_text || detail.buyer_msg">
      <div class="itemTitle">配送信息</div>
      <div class="orderInfo">
        <div class="shopPrice" v-if="detail.ship_date || detail.ship_time_text">
          <div class="shopPriceText">配送时间</div>
          <div class="price">{{ detail.ship_date }} {{ detail.ship_time_text }}</div>
        </div>
        <div class="shopPrice" v-if="detail.buyer_msg">
          <div class="shopPriceText">备注</div>
          <div class="price" style="max-width:70%;text-align:right;">{{ detail.buyer_msg }}</div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_no)">{{ detail.order_no }} <span class="copy-icon">复制</span>
          </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ formatTime(detail.add_time) }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">商品金额</div>
          <div class="price"><span style="font-size: 10px;">￥</span>{{ detail.total_price }}</div>
        </div>
        <!-- 福利卡支付 -->
        <div class="shopPrice" v-if="detail.fuli_pay > 0">
          <div class="shopPriceText">福利卡支付</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ detail.fuli_pay }}</div>
        </div>

        <!-- 微信支付 -->
        <div class="shopPrice" v-if="detail.total_fee > 0">
          <div class="shopPriceText">微信支付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ detail.total_fee }}</div>
        </div>
      </div>
    </div>

    <!-- 底部客服 -->
    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="../../assets/kf.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { getCakeOrder } from "@/api/lehuicake";

export default {
  name: "OrderDetaildg",
  data() {
    return {
      loadingflag: true,
      detail: {
        items: [],
        delivery: {}
      },
      fuli_pay: 0,      // 福利卡支付金额
      total_fee: 0      // 微信支付金额

    }
  },
  methods: {
    copyText(text) {
      if (!text) return;
      const str = String(text).trim();
      if (!str) return;
      const showTip = (msg) => this.$toast ? this.$toast(msg) : alert(msg);
      const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
      const el = document.createElement(isIOS ? 'div' : 'textarea');
      if (isIOS) {
        el.contentEditable = 'true';
        el.textContent = str;
      } else {
        el.value = str;
        el.setAttribute('readonly', '');
      }
      el.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;overflow:hidden;';
      document.body.appendChild(el);
      if (isIOS) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        el.select();
        el.setSelectionRange(0, str.length);
      }
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { }
      document.body.removeChild(el);
      window.getSelection()?.removeAllRanges?.();
      if (ok) {
        showTip('复制成功');
      } else if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => showTip('复制成功')).catch(() => showTip('复制失败，请长按手动复制'));
      } else {
        showTip('复制失败，请长按手动复制');
      }
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    formatTime(time) {
      if (!time) return ''
      let date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return `${y}-${MM}-${d} ${h}:${m}`
    },
    getDetail(id) {
  getCakeOrder(id).then(res => {
    this.loadingflag = false
    if (res.code == 200) {
      const raw = res.data || {}
      const order = raw.order || {}
      const orderinfo = raw.orderinfo || {}

      // 解析支付构成：fuli 里 id === 'wx' 是微信，其它是福利卡
      const parsePay = (val) => {
        let arr = []
        try { arr = typeof val === 'string' ? JSON.parse(val) : val } catch (e) { arr = [] }
        if (!Array.isArray(arr)) return { fuli: 0, wechat: 0 }
        let fuli = 0, wechat = 0
        arr.forEach(f => {
          const p = Number(f.price || 0)
          if (String(f.id) === 'wx') wechat += p
          else fuli += p
        })
        return { fuli: Number(fuli.toFixed(2)), wechat: Number(wechat.toFixed(2)) }
      }
      const pay = parsePay(order.fuli)
      const wechatPay = Number(order.total_fee || 0) || pay.wechat

      // detail 可能是数组（旧）也可能是对象（新，含地址和 product）
      const detailRaw = raw.detail
      const detailObj = Array.isArray(detailRaw) ? {} : (detailRaw || {})
      const addr = orderinfo.address || detailObj || {}

      // 商品统一成数组
      let productArr = []
      if (Array.isArray(detailRaw)) {
        productArr = detailRaw
      } else if (detailRaw && Array.isArray(detailRaw.product)) {
        // 新结构：product 里是 product_name / spec_name / price / image_path / quantity
        productArr = detailRaw.product.map(p => ({
          product: { image_path: p.image_path, title: p.product_name },
          xinghao: { name: p.spec_name, price: p.price },
          quantity: p.quantity
        }))
      }
      if (productArr.length === 0 && Array.isArray(orderinfo.product)) {
        productArr = orderinfo.product
      }

      const first = productArr[0] || {}
      // 配送信息：旧结构在商品项上，新结构在 detail 对象上
      const shipInfo = Array.isArray(detailRaw) ? first : detailObj

      const buildSpec = (p) => {
        const xinghaoName = p.xinghao && p.xinghao.name ? `规格：${p.xinghao.name}` : ''
        return [xinghaoName, p.spec_name || '', p.taste_name || ''].filter(Boolean).join(' | ')
      }

      const shipDate = (shipInfo.ship_date && shipInfo.ship_date !== '0000-00-00')
        ? shipInfo.ship_date
        : ''

      this.detail = {
        order_no: order.order_no || orderinfo.order_no || '',
        add_time: order.add_time || orderinfo.add_time,
        total_price: order.zongji || 0,
        total_fee: wechatPay,        // 微信支付
        fuli_pay: pay.fuli,          // 福利卡支付
        delivery: {
          name: addr.name || '',
          phone: addr.phone || '',
          province_name: addr.province || '',
          city_name: addr.city || '',
          county_name: addr.area || '',
          addr: addr.addr || '',
          detail: addr.street || ''
        },
        items: productArr.map(p => {
          const product = p.product || {}
          return {
            product_img: product.image_path || p.image_path || '',
            product_title: product.title || p.product_name || '',
            spec_name: buildSpec(p),
            sell_price: Number((p.xinghao && p.xinghao.price) || p.price || 0),
            quantity: Number(p.quantity || 1)
          }
        }),
        ship_date: shipDate,
        ship_time_text: shipInfo.ship_time_text || '',
        buyer_msg: shipInfo.buyer_msg || ''
      }
    } else {
      this.$toast(res.msg || '获取订单详情失败')
    }
  }).catch(() => {
    this.loadingflag = false
    this.$toast('网络异常')
  })
}
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.getDetail(id);
    } else {
      this.loadingflag = false;
      this.$toast('缺少订单参数');
    }
  }
}
</script>

<style scoped lang="less">
.copy-icon {
  font-size: 11px;
  color: #DA0200;
  border: 1px solid #DA0200;
  border-radius: 3px;
  padding: 0 3px;
  line-height: 14px;
}

.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px;
}

.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;
}

.addressBox .address {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.addressBox .addressIcon {
  width: 20px;
}

.addressBox .phone {
  padding-left: 10px;
  font-size: 12px;
  color: #797979;
}

.addressBox .addressDetail {
  font-size: 13px;
  font-weight: bold;
  margin-top: 3px;
}

.addressBox .userName {
  font-size: 15px;
  font-weight: bold;
}

.addressBox .leftBox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.orderInfo .shopPrice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.orderInfo .shopPriceText {
  color: #828282;
  font-size: 14px;
}

.orderInfo .price {
  font-size: 14px;
  font-weight: bold;
}

.orderInfo .price1 {
  color: #C93F3D;
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.shopInfo .shopImg {
  width: 77px;
}

.shopInfo .nameBox {
  width: 73%;
}

.shopInfo .shopName {
  font-size: 14px;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}

.shopInfo .can {
  margin-top: 13px;
  font-size: 13px;
  color: #979797;
}

.shopInfo .all {
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.shopInfo .price {
  color: #C63532;
  font-weight: bold;
  font-size: 15px;
}

.shopInfo .number {
  color: #989898;
}

.service {
  background-color: white;
  color: #5b5a5a;
  font-size: 13px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-top: 10px;
}

.service .serviceBox {
  width: 18px;
  padding-top: 1px;
}
</style>