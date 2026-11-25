<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 商品信息（品牌） -->
    <div class="addressBox addressBox2" v-if="detail.brandName || detail.brandImg">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo">
        <div class="shopImg">
          <img style="border-radius: 5px; width: 77px; height: 77px; object-fit: cover;" class="img"
            :src="detail.brandImg" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ detail.brandName }}</div>
          <div class="can" v-if="detail.shopName">门店：{{ detail.shopName }}</div>
          <div class="all">
            <div class="price">
              <span style="font-size: 10px;">￥</span>{{ money(detail.total_fee) }}
            </div>
            <div class="number">×1</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 门店信息 -->
    <div class="addressBox addressBox2" v-if="detail.shopName">
      <div class="itemTitle">门店信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">门店名称</div>
          <div class="price">{{ detail.shopName }}</div>
        </div>
        <div class="shopPrice" v-if="detail.shopAddress">
          <div class="shopPriceText">门店地址</div>
          <div class="price">{{ detail.shopAddress }}</div>
        </div>
        <div class="shopPrice" v-if="detail.shopPhone">
          <div class="shopPriceText">联系电话</div>
          <div class="price">{{ detail.shopPhone }}</div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <div class="price" style="color: #DA0200;">{{ detail.stateText }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_no)">
            {{ detail.order_no }} <span class="copy-icon">复制</span>
          </div>
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
          <div class="price"><span style="font-size: 10px;">￥</span>{{ money(detail.total_fee) }}</div>
        </div>
        <div class="shopPrice" v-if="money(detail.total_fee) > 0">
          <div class="shopPriceText">实付金额</div>
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
import { getOrderDetail } from "@/api/lehuicake";

export default {
  name: "OrderDetailhb",
  data() {
    return {
      loadingflag: true,
      detail: {
        brandName: '',
        brandImg: '',
        shopName: '',
        shopAddress: '',
        shopPhone: '',
        order_no: '',
        add_time: 0,
        price: 0,
        total_fee: 0,
        payType: '',
        stateText: ''
      }
    }
  },
  methods: {
    money(val) {
      const n = Number(val || 0)
      return isNaN(n) ? '0.00' : n.toFixed(2)
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
    // 支付方式：fuli 为 [{id:'wx',price:'0.01'}] 形式的字符串/数组
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
    // 烘焙状态：优先 orderstatus，兜底 status
    getStateText(orderstatus, status) {
      const map = {
        '0': '待付款',
        '2': '支付成功',
        '4': '部分退款',
        '5': '已取消'
      };
      if (map[String(orderstatus)]) return map[String(orderstatus)];
      if (status === 1) return '支付成功';
      return '未知状态';
    },
    getDetail(id) {
      getOrderDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          const d = res.data || {}
          const brand = d.brandInfo || {}
          const shop = d.shopInfo || {}

          this.detail = {
            brandName: d.brandName || brand.brandName || '烘焙订单',
            brandImg: brand.logoThumbUrl || brand.logoUrl || '',
            shopName: shop.name || d.shopName || '',
            shopAddress: shop.address || '',
            shopPhone: shop.phone || '',
            order_no: d.order_no || '',
            add_time: d.add_time,
            price: Number(d.price ?? d.total_fee ?? 0),
            total_fee: Number(d.total_fee ?? d.price ?? 0),
            payType: this.getPayType(d.fuli),
            stateText: this.getStateText(d.orderstatus, d.status)
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
.orderInfo .price { font-size: 14px; font-weight: bold; word-break: break-all; text-align: left; }
.orderInfo .price1 { color: #C93F3D; }
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
