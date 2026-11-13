<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 收货地址（仅普通订单展示，途虎没有） -->
    <div class="addressBox" v-if="thimg != 1 && detail.delivery">
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
              {{ detail.delivery.province_name }}{{ detail.delivery.city_name }}{{ detail.delivery.county_name }}{{ detail.delivery.addr }} {{ detail.delivery.detail }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品信息（通用） -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="(item, index) in detail.items" :key="index">
        <div class="shopImg" >
          <span v-if="thimg == 1" style=" border-radius: 10px; font-size: 12px;text-align: center; background: #f3f3f3;display: inline-block;width: 100%;height: 80px;line-height: 80px;">{{ item.product_title }}</span>
          <img v-else style="border-radius: 5px;" class="img" :src="item.product_img" alt="">
          
        </div>

        <div class="nameBox">
          <div class="shopName">{{ item.product_title }}</div>
          <div class="can" v-if="item.spec_name">{{ item.spec_name }}</div>
          
          <!-- 途虎专属：充值账号 -->
          <div class="can" v-if="thimg == 1 && item.uuid">充值账号：{{ item.uuid }}</div>

          <div class="all">
            <div class="price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快递信息（仅普通订单展示） -->
    <div class="addressBox addressBox2" v-if="thimg != 1 && detail.express_company">
      <div class="itemTitle">快递信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">快递公司</div>
          <div class="price">{{ detail.express_company }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">快递单号</div>
          <div class="price" @click="copyText(detail.express_no)">{{ detail.express_no }} <span class="copy-icon">复制</span></div>
        </div>
      </div>
    </div>

    <!-- 订单信息（通用） -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        
        <!-- 通用：订单号 -->
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_no)">{{ detail.order_no }} <span class="copy-icon">复制</span></div>
        </div>

        

       

        <!-- 通用：下单时间 -->
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ formatTime(detail.add_time) }}</div>
        </div>

        <!-- 普通订单专属：商品金额、快递费 -->
        <template v-if="thimg != 1">
          <div class="shopPrice">
            <div class="shopPriceText">商品金额</div>
            <div class="price"><span style="font-size: 10px;">￥</span>{{ detail.total_price }}</div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">快递费</div>
            <div class="price"><span style="font-size: 10px;">￥</span>{{ detail.freight }}</div>
          </div>
        </template>

        <!-- 通用：实付金额 -->
        <div class="shopPrice">
          <div class="shopPriceText">实付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ detail.total_fee }}</div>
        </div>

        <!-- 途虎专属：退款状态与时间 -->
        <div class="shopPrice" v-if="thimg == 1 && detail.refund_status_text">
          <div class="shopPriceText">退款状态</div>
          <div class="price" style="color: #DA0200;">{{ detail.refund_status_text }}</div>
        </div>
        <div class="shopPrice" v-if="thimg == 1 && detail.refund_time_text">
          <div class="shopPriceText">退款时间</div>
          <div class="price">{{ detail.refund_time_text }}</div>
        </div>

      </div>
    </div>

    <!-- 卡券信息（通用） -->
    <div class="addressBox addressBox2" v-if="detail.card_info && detail.card_info.length > 0">
      <div class="itemTitle">卡券信息</div>
      <div class="orderInfo">
        <div class="shopPrice" v-for="(info, index) in detail.card_info" :key="index">
          <div class="shopPriceText">{{ info.label }}</div>
          <div class="price">{{ info.value }}</div>
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
import { orderDetail, orderCancel, tuhuOrderDetail } from "@/api/lhjdtm";

export default {
  name: "OrderDetail",
  data() {
    return {
      thimg: 0, // 0: 普通订单, 1: 途虎订单
      loadingflag: true,
      detail: {
        items: [],
        delivery: {},
        card_info: []
      }
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
    cancelOrder() {
      this.$dialog.confirm({
        title: '取消订单',
        message: '确定要取消该订单吗？',
        confirmButtonColor: 'red'
      }).then(() => {
        orderCancel({ id: this.detail.id }).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || '订单已取消')
            this.getDetail(this.detail.id)
          } else {
            this.$toast(res.msg || '取消失败')
          }
        })
      }).catch(() => {})
    },
    goPay() {
      this.$router.push({ path: "/payOrder", query: { id: this.detail.id } })
    },
    // 获取普通订单详情
    getDetail(id) {
      orderDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data
        } else {
          this.$toast(res.msg || '获取订单详情失败')
        }
      }).catch(() => {
        this.loadingflag = false
        this.$toast('网络异常')
      })
    },
    // 获取途虎订单详情
    tuhuOrderDetails(params) {
      tuhuOrderDetail(params).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data
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
    const orderId = this.$route.query.order_id;

    if (id) {
      // 普通订单
      this.thimg = 0; 
      this.getDetail(id);
    } else if (orderId) {
      // 途虎订单
      this.thimg = 1; 
      this.tuhuOrderDetails({ order_id: orderId });
    } else {
      this.loadingflag = false;
      this.$toast('缺少订单参数');
    }
  }
}
</script>

<style scoped lang="less">
.copy-text { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
.copy-icon { font-size: 11px; color: #DA0200; border: 1px solid #DA0200; border-radius: 3px; padding: 0 3px; line-height: 14px; }
.location { background-color: #F0F0F0; padding: 10px; min-height: 100vh; box-sizing: border-box; padding-bottom: 80px; }
.addressBox { padding: 13px 10px; background-color: white; border-radius: 10px; }
.addressBox .address { display: flex; align-items: center; justify-content: space-between; }
.addressBox .addressIcon { width: 20px; }
.addressBox .phone { padding-left: 10px; font-size: 12px; color: #797979; }
.addressBox .addressDetail { font-size: 13px; font-weight: bold; margin-top: 3px; }
.addressBox .userName { font-size: 15px; font-weight: bold; }
.addressBox .leftBox { display: flex; align-items: center; gap: 5px; }
.addressBox2 { margin-top: 10px; padding: 13px 15px 15px; }
.itemTitle { font-weight: bold; font-size: 15px; }
.orderInfo .shopPrice { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.orderInfo .shopPriceText { color: #828282; font-size: 14px; }
.orderInfo .price { font-size: 14px; font-weight: bold; }
.orderInfo .price1 { color: #C93F3D; }
.shopInfo { margin-top: 15px; display: flex; align-items: flex-start; gap: 10px; }
.shopInfo .shopImg { width: 77px; }
.shopInfo .nameBox { width: 73%; }
.shopInfo .shopName { font-size: 14px; font-weight: bold; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 2; }
.shopInfo .can { margin-top: 13px; font-size: 13px; color: #979797; }
.shopInfo .all { font-size: 13px; display: flex; align-items: center; justify-content: space-between; margin-top: 15px; }
.shopInfo .price { color: #C63532; font-weight: bold; font-size: 15px; }
.shopInfo .number { color: #989898; }
.service { background-color: white; color: #5b5a5a; font-size: 13px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin-top: 10px; }
.service .serviceBox { width: 18px; padding-top: 1px; }
</style>