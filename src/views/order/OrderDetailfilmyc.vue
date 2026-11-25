<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 票务信息 -->
    <div class="addressBox addressBox2" v-if="detail.order_show">
      <div class="itemTitle">{{ isFilm ? '电影信息' : '演出信息' }}</div>

      <div class="shopInfo" style="margin-top: 15px;">
        <div class="shopImg">
          <img style="border-radius: 5px; width: 77px; height: 105px; object-fit: cover;"
            :src="isFilm ? detail.order_show.movielogo : detail.order_show.img" alt="">
        </div>
        <div class="nameBox">
          <!-- 标题 -->
          <div class="shopName">{{ isFilm ? detail.order_show.moviename : detail.order_show.title }}</div>

          <!-- 场馆 / 影院 -->
          <div class="can" v-if="isFilm">
            {{ detail.order_show.cinemaname }} | {{ detail.order_show.roomname }}
          </div>
          <div class="can" v-if="!isFilm">
            场馆：{{ detail.order_show.venuesname }}
          </div>

          <!-- 场馆地址（新增） -->
          <div class="can" v-if="!isFilm && detail.order_show.venuesaddress">
            地址：{{ detail.order_show.venuesaddress }}
          </div>

          <!-- 电影场次 & 座位 & 版本 -->
          <div class="can" v-if="isFilm">
            场次：{{ detail.order_show.playtime }} ({{ detail.order_show.edition }})
          </div>
          <div class="can" v-if="isFilm && detail.order_show.seats">
            座位：{{ detail.order_show.seats }}
          </div>

          <!-- 演出场次 & 票档 & 数量 -->
          <div class="can" v-if="!isFilm">
            场次：{{ detail.order_show.dateDesc }}
          </div>
          <div class="can" v-if="!isFilm && detail.order_show.priceDesc">
            <!-- 处理返回的 "1|1.00元（票档1)" 格式，只取后半部分 -->
            票档：{{ detail.order_show.priceDesc.split('|')[1] || detail.order_show.priceDesc }}
          </div>
          <div class="can" v-if="!isFilm">
            数量：{{ detail.order_show.quantity }} 张
          </div>

        </div>
      </div>
    </div>

    <!-- 电影取票码 + 二维码（出票成功才有） -->
    <div class="addressBox addressBox2" v-if="ticketCodes.length > 0">
      <div class="itemTitle">取票码</div>
      <div class="code-box" @click="copyText(codeText)">
        <!-- <span class="code-text">
          <span class="code-val" v-for="(code, idx) in ticketCodes" :key="idx">{{ code.value }}</span>
        </span> -->
        <!-- <span class="copy-icon">复制</span> -->
      </div>
      <div class="qr-wrap" v-for="(qr, index) in qrDataUrls" :key="index">
        <img :src="qr" class="qr-img" alt="取票二维码" />
        <div class="qr-tip">请到影院取票机 / 柜台扫码取票</div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2" v-if="detail.order_show">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_show.order_id)">
            {{ detail.order_show.order_id }} <span class="copy-icon">复制</span>
          </div>
        </div>

        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <!-- 优先取 order.addtime 字符串，如果没有则用时间戳 formatTime -->
          <div class="price">{{ (detail.order && detail.order.addtime) || formatTime(detail.order_show.add_time) }}
          </div>
        </div>

        <div class="shopPrice">
          <div class="shopPriceText">手机号</div>
          <div class="price">{{ isFilm ? detail.order_show.mobile : detail.order_show.buyerPhone }}</div>
        </div>

        <!-- 订单状态（新增，使用 getStatusName 转换字母状态） -->
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <div class="price" :style="{ color: getStatusName(detail.order_show.orderstatus).color }">
            {{ getStatusName(detail.order_show.orderstatus).text }}
          </div>
        </div>
<!-- 新增：快递信息，有值才显示 -->
<div class="shopPrice" v-if="detail.order_show.expressName || detail.order_show.expressCode">
  <div class="shopPriceText">快递公司</div>
  <div class="price">{{ detail.order_show.expressName || detail.order.expressName }}</div>
</div>
<div class="shopPrice" v-if="detail.order_show.expressCode || detail.order.expressCode">
  <div class="shopPriceText">快递单号</div>
  <div class="price" @click="copyText(detail.order_show.expressCode || detail.order.expressCode)">
    {{ detail.order_show.expressCode || detail.order.expressCode }} 
    <span class="copy-icon">复制</span>
  </div>
</div>
        <div class="shopPrice">
          <div class="shopPriceText">支付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>
            <!-- 电影取 showamount；演出取 total(总价)，没有则取 price -->
            {{ isFilm ? detail.order_show.showamount : (detail.order_show.total || detail.order_show.price) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 电影取票须知（专属） -->
    <div class="addressBox addressBox2" v-if="isFilm && detail.single">
      <div class="itemTitle">{{ detail.single.title }}</div>
      <div class="notice-content" v-html="detail.single.content"></div>
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
// ⚠️ 请根据你实际的 API 路径修改这里的引入
import { getOrderDetail } from "@/api/lehuifilm";
import { getPerOrderDetail } from "@/api/lehuiperform";
import QRCode from 'qrcode';

export default {
  name: "OrderDetaildy",
  data() {
    return {
      isFilm: false,
      loadingflag: true,
      detail: {},
      ticketCodes: [],
      qrDataUrl: '',
      qrDataUrls: [],
    }
  },
  computed: {
    // 多个取票码用 | 拼接展示（如 8652026|84811）
    codeText() {
      return this.ticketCodes.map(c => c.value).join('|');
    }
  },
  methods: {
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
    // 新增：状态映射方法
    getStatusName(status) {
      const map = {
        'N': { text: '待支付', color: '#DA0200' },
        '0': { text: '待支付', color: '#DA0200' },
        'C': { text: '已取消', color: '#999' },
        '2': { text: '已取消', color: '#999' },
        'E': { text: '订单超时', color: '#999' },
        '8': { text: '订单超时', color: '#999' },
        'P': { text: '已付款', color: '#C93F3D' },
        '1': { text: '已付款', color: '#C93F3D' },
        'T': { text: '处理中', color: '#C93F3D' },
        '11': { text: '正在出票', color: '#C93F3D' },
        'S': { text: '出票成功', color: '#999' },
        '4': { text: '出票成功', color: '#999' },
        'R': { text: '退款完成', color: '#999' },
        '7': { text: '退款完成', color: '#999' },
        'F': { text: '出票失败', color: '#DA0200' }
      };
      return map[status] || { text: status || '未知', color: '#333' };
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
      } else {
        showTip('复制失败，请长按手动复制');
      }
    },
    parseTicketCodes() {
      const os = (this.detail && this.detail.order_show) || {};
      const od = (this.detail && this.detail.order) || {};

      // 1. 优先处理演出逻辑 (seatInfoList)
      if (!this.isFilm && os.seatInfoList) {
        let seatList = os.seatInfoList;
        if (typeof seatList === 'string') {
          try { seatList = JSON.parse(seatList); } catch (e) { seatList = []; }
        }
        if (Array.isArray(seatList)) {
          return seatList.map(item => ({
            name: '取票码',
            value: item.exchangeCode || item.qrCode || ''
          })).filter(i => i.value !== '');
        }
      }

      // 2. 原电影逻辑保持不动
      let raw = os.ticketcodelist || os.ticketcodeList || od.ticketcodeList || os.ticketcode || '';
      if (!raw) return [];
      let list = raw;
      if (typeof list === 'string') {
        try { list = JSON.parse(list); } catch (e) { list = [{ name: '取票码', value: String(raw) }]; }
      }
      if (!Array.isArray(list)) return [];
      const flat = [];
      list.forEach(item => {
        if (Array.isArray(item)) item.forEach(c => flat.push(c));
        else flat.push(item);
      });
      return flat.map(i => ({ name: i.name || '取票码', value: String(i.value || '') })).filter(i => i.value !== '');
    },
    buildQr() {
      this.qrDataUrls = []; // 每次先清空
      if (!this.ticketCodes.length) return;

      const os = (this.detail && this.detail.order_show) || {};
      let qrContents = [];

      // 演出：提取所有 qrCode
      if (!this.isFilm && os.seatInfoList) {
        let seatList = os.seatInfoList;
        if (typeof seatList === 'string') {
          try { seatList = JSON.parse(seatList); } catch (e) { seatList = []; }
        }
        if (Array.isArray(seatList)) {
          qrContents = seatList.map(item => item.qrCode).filter(Boolean);
        }
      } else {
        // 电影：用取票码拼接
        qrContents = [this.ticketCodes.map(c => c.value).join('|')];
      }

      qrContents.forEach(text => {
        QRCode.toDataURL(text, { width: 200, margin: 1 })
          .then(url => { this.qrDataUrls.push(url); })
          .catch(err => console.error(err));
      });
    },
    fetchFilmDetail(id) {
      getOrderDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data;
          this.ticketCodes = this.parseTicketCodes();
          this.buildQr();
        } else {
          this.$toast(res.msg || '获取电影详情失败')
        }
      }).catch(() => {
        this.loadingflag = false
        this.$toast('网络异常')
      })
    },
    fetchPerformDetail(id) {
      getPerOrderDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          

          this.detail = res.data;

          this.ticketCodes = this.parseTicketCodes();
          this.buildQr();
        } else {
          this.$toast(res.msg || '获取演出详情失败')
        }
      }).catch(() => {
        this.loadingflag = false
        this.$toast('网络异常')
      })
    }
  },
  created() {
    const id = this.$route.query.id;
    const platform = Number(this.$route.query.platform);

    if (platform === 17) {
      this.isFilm = true;
      this.fetchFilmDetail(id);
    } else if (platform === 18) {
      this.isFilm = false;
      this.fetchPerformDetail(id);
    } else {
      this.loadingflag = false;
      this.$toast('缺少订单类型');
    }
  }
}
</script>

<style scoped lang="less">
/* 完全复用你原来的基础样式，保证 UI 一致 */
.copy-icon {
  font-size: 11px;
  color: #DA0200;
  border: 1px solid #DA0200;
  border-radius: 3px;
  padding: 0 3px;
  line-height: 14px;
  margin-left: 5px;
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

/* 取票须知富文本样式 */
.notice-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-top: 10px;
}

.notice-content p {
  margin-bottom: 5px;
}

/* 取票码 + 二维码 */
.code-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  cursor: pointer;
}

.code-text {
  font-weight: bold;
  color: #DA0200;
  font-size: 16px;
  letter-spacing: 2px;
  word-break: break-all;
}

.qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
}

.qr-img {
  width: 200px;
  height: 200px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
}

.qr-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>