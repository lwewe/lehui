<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 电子券商品信息 -->
    <div class="addressBox addressBox2" v-if="detail.coupon.title || detail.coupon.img">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="detail.coupon.img" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ detail.coupon.title }}</div>
          <div class="can" v-if="detail.validEnd">有效期至 {{ formatDate(detail.validEnd) }}</div>
          <div class="all">
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ money(detail.coupon.price) }}
            </div>
            <div class="number">×{{ detail.num }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡密信息 -->
    <div class="addressBox addressBox2" v-if="detail.cards.length"  >
      <div class="itemTitle">卡密信息</div>
      <div class="orderInfo">
        <div class="cardItem" v-for="(item, index) in detail.cards" :key="item.id || index">
          <div class="shopPrice" v-if="item.num">
            <div class="shopPriceText">卡号</div>
            <div class="price cardVal">
              {{ item.num }}
              <span class="copy-icon" @click="copyText(item.num)">复制</span>
            </div>
          </div>
          <div class="shopPrice" v-if="item.pass">
            <div class="shopPriceText">{{ isLink(item.pass) ? '链接' : '密码' }}</div>
            <div class="price cardVal">
              {{ item.pass }}
              <span class="copy-icon" @click="copyText(item.pass)">复制</span>
            </div>
          </div>
          <div class="linkRow" v-if="isLink(item.pass)">
            <span class="copy-icon" @click="openUrl(item.pass)">打开链接</span>
          </div>
          <div class="shopPrice" v-if="item.end_time">
            <div class="shopPriceText">有效期至</div>
            <div class="price">{{ formatDate(item.end_time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <div class="price">{{ detail.stateText }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_no)">{{ detail.order_no }} <span class="copy-icon">复制</span></div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ formatTime(detail.add_time) }}</div>
        </div>
        <div class="shopPrice" v-if="detail.payType">
          <div class="shopPriceText">支付方式</div>
          <div class="price">{{ detail.payType }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">商品金额</div>
          <div class="price"><span style="font-size: 10px;">￥</span>{{ money(detail.total_price) }}</div>
        </div>
        <div class="shopPrice" v-if=" money(detail.total_fee) > 0">
          <div class="shopPriceText">微信支付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ money(detail.total_fee) }}</div>
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
import { getCouponsOrder } from "@/api/lehuicake";

export default {
  name: "OrderDetaildzq",
  data() {
    return {
      loadingflag: true,
      detail: {
        coupon: {},
        cards: []
      }
    }
  },
  methods: {
    money(val) {
      const n = Number(val || 0)
      return isNaN(n) ? '0.00' : n.toFixed(2)
    },
    isLink(pass) {
      const str = String(pass || '')
      return str.startsWith('http://') || str.startsWith('https://')
    },
    openUrl(url) {
      if (url) window.location.href = url
    },
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
    formatDate(time) {
      if (!time) return ''
      let date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return `${y}-${MM}-${d}`
    },
    // 支付方式：fuli 为 [{id:'wx',price:'0.01'}] 形式的字符串
    getPayType(fuli) {
      if (!fuli) return ''
      let list = []
      try {
        list = typeof fuli === 'string' ? JSON.parse(fuli) : fuli
      } catch (e) {
        return ''
      }
      if (!Array.isArray(list) || !list.length) return ''
      const hasWx = list.some(i => String(i.id) === 'wx')
      const hasCard = list.some(i => String(i.id) !== 'wx')
      if (hasWx && hasCard) return '微信和福利卡'
      return hasWx ? '微信' : '福利卡'
    },
    getStateText(flag, state) {
      if (flag == 1) return '待支付'
      if (flag == 2) return '交易成功'
      if (flag == 3) return '已取消'
      if (state == 0) return '待使用'
      if (state == 1) return '交易成功'
      return '交易成功'
    },
    getDetail(id) {
      getCouponsOrder(id).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          const raw = res.data || {}
          const order = raw.order || {}
          const coupon = raw.coupons || {}
          const cards = Array.isArray(raw.xunika) ? raw.xunika : []
          const firstCard = cards[0] || {}

          this.detail = {
            order_no: order.order_no || '',
            add_time: order.add_time,
            num: Number(order.num || 1),
            total_price: order.zongji || coupon.price || 0,
            total_fee: order.total_fee,
            payType: this.getPayType(order.fuli),
            stateText: this.getStateText(order.flag, order.state),
            coupon: {
              title: coupon.title || '',
              img: coupon.img || '',
              price: coupon.price || 0,
              num: coupon.num || 0
            },
            cards: cards,
            validEnd: firstCard.end_time || 0
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
.copy-icon { font-size: 11px; color: #DA0200; border: 1px solid #DA0200; border-radius: 3px; padding: 0 3px; line-height: 14px; cursor: pointer; white-space: nowrap; }
.location { background-color: #F0F0F0; padding: 10px; min-height: 100vh; box-sizing: border-box; padding-bottom: 80px; }
.addressBox { padding: 13px 10px; background-color: white; border-radius: 10px; }
.addressBox2 { margin-top: 10px; padding: 13px 15px 15px; }
.itemTitle { font-weight: bold; font-size: 15px; }
.orderInfo .shopPrice { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; gap: 10px; }
.orderInfo .shopPriceText { color: #828282; font-size: 14px; white-space: nowrap; }
.orderInfo .price { font-size: 14px; font-weight: bold; word-break: break-all; text-align: right; }
.orderInfo .price1 { color: #C93F3D; }
.cardItem { border-bottom: 1px solid #F7F7F7; padding-bottom: 10px; }
.cardItem:last-child { border-bottom: none; padding-bottom: 0; }
.cardVal { display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }
.linkRow { display: flex; justify-content: flex-end; margin-top: 10px; }
.shopInfo { margin-top: 15px; display: flex; align-items: flex-start; gap: 10px; }
.shopInfo .shopImg { width: 77px; height: 77px; }
.shopInfo .nameBox { width: 73%; }
.shopInfo .shopName { font-size: 14px; font-weight: bold; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 2; }
.shopInfo .can { margin-top: 13px; font-size: 13px; color: #979797; }
.shopInfo .all { font-size: 13px; display: flex; align-items: center; justify-content: space-between; margin-top: 15px; }
.shopInfo .price { color: #C63532; font-weight: bold; font-size: 15px; }
.shopInfo .number { color: #989898; }
.service { background-color: white; color: #5b5a5a; font-size: 13px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin-top: 10px; }
.service .serviceBox { width: 18px; padding-top: 1px; }
</style>
