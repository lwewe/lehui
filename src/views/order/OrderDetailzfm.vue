<template>
  <div class="location">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 状态卡片 -->
    <div class="status-card">
      <div class="status-title">{{ detail.type_name || '展付码订单' }}</div>
      <div class="status-desc">{{ orderStatusText }}</div>
    </div>

    <!-- 门店 / 商品信息 -->
    <div class="card">
      <div class="card-title">{{ hasStore ? '门店信息' : '商品信息' }}</div>
      <div class="card-row">
        <div class="row-label">{{ hasStore ? '门店名称' : '商品名称' }}</div>
        <div class="row-value">{{ storeName }}</div>
      </div>
      <div class="card-row" v-if="subName">
        <div class="row-label">{{ isHotel ? '房型' : '规格' }}</div>
        <div class="row-value">{{ subName }}</div>
      </div>
    </div>

    <!-- 支付信息（核心） -->
    <div class="card">
      <div class="card-title">支付信息</div>
      <div class="card-row">
        <div class="row-label">支付状态</div>
        <div class="row-value" :class="{ unpaid: !detail.pay_time }">
          {{ detail.status_name || '-' }}
        </div>
      </div>

      <div class="card-row">
        <div class="row-label">支付金额</div>
        <div class="row-value price"><span class="fs10">￥</span>{{ detail.total_fee }}</div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="card">
      <div class="card-title">订单信息</div>
      <div class="card-row">
        <div class="row-label">订单号</div>
        <div class="row-value copy-text" @click="copyText(detail.order_no)">
          {{ detail.order_no }} <span class="copy-icon">复制</span>
        </div>
      </div>
      <!-- <div class="card-row" v-if="detail.third_order_no">
        <div class="row-label">第三方单号</div>
        <div class="row-value copy-text" @click="copyText(detail.third_order_no)">
          {{ detail.third_order_no }} <span class="copy-icon">复制</span>
        </div>
      </div> -->
      <div class="card-row">
        <div class="row-label">下单时间</div>
        <div class="row-value">
          {{ detail.add_time_text || formatTime(detail.add_time) }}
        </div>
      </div>
      <div class="card-row">
        <div class="row-label">订单状态</div>
        <div class="row-value">{{ detail.orderstatus_name || '-' }}</div>
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
export default {
  name: "OrderDetailZfm",
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    // other / cTransportList 后端可能返回字符串或对象，统一解析
    other() {
      return this.parseData(this.detail.other)
    },
    transportList() {
      const list = this.parseData(this.detail.cTransportList)
      return Array.isArray(list) ? list : []
    },
    isHotel() {
      return Number(this.detail.type) === 21
    },
    isCar() {
      return Number(this.detail.type) === 22
    },
    hasStore() {
      return !!(this.other.hotelName || this.transportList.length)
    },
    // 门店名：酒店取 hotelName，打车取 carSourceName，东方甄选取商品名
    storeName() {
      if (this.other.hotelName) return this.other.hotelName
      if (this.transportList.length && this.transportList[0].carSourceName) {
        return this.transportList[0].carSourceName
      }
      const items = this.other.items
      if (Array.isArray(items) && items.length) return items[0].name || ''
      return this.detail.platform_name || '展付码'
    },
    subName() {
      if (this.isHotel && this.other.roomTypeName) return this.other.roomTypeName
      const items = this.other.items
      if (Array.isArray(items) && items.length && items[0].specName) {
        return items[0].specName
      }
      return ''
    },
    payTimeText() {
      return this.formatTime(this.detail.pay_time) || '未支付'
    },
    orderStatusText() {
      return this.detail.orderstatus_name || this.detail.status_name || ''
    }
  },
  methods: {
    parseData(val) {
      if (!val) return {}
      if (typeof val === 'object') return val
      try {
        return JSON.parse(val)
      } catch (e) {
        return {}
      }
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(Number(time) * 1000)
      const y = date.getFullYear()
      const MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return `${y}-${MM}-${d} ${h}:${m}`
    },
    copyText(text) {
      if (!text) return
      const str = String(text).trim()
      if (!str) return
      const showTip = (msg) => this.$toast ? this.$toast(msg) : alert(msg)
      const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent)
      const el = document.createElement(isIOS ? 'div' : 'textarea')
      if (isIOS) {
        el.contentEditable = 'true'
        el.textContent = str
      } else {
        el.value = str
        el.setAttribute('readonly', '')
      }
      el.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;overflow:hidden;'
      document.body.appendChild(el)
      if (isIOS) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      } else {
        el.select()
        el.setSelectionRange(0, str.length)
      }
      let ok = false
      try { ok = document.execCommand('copy') } catch (e) { }
      document.body.removeChild(el)
      window.getSelection()?.removeAllRanges?.()
      if (ok) {
        showTip('复制成功')
      } else if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => showTip('复制成功')).catch(() => showTip('复制失败，请长按手动复制'))
      } else {
        showTip('复制失败，请长按手动复制')
      }
    },
    // 跳转客服
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    }
  },
  created() {
    // 列表跳转时传的是整条订单数据，这里兼容对象 / JSON 字符串两种形式
    const raw = this.$route.query.order_id
    if (!raw) {
      this.$toast && this.$toast('缺少订单参数')
      return
    }
    if (typeof raw === 'object') {
      this.detail = raw
    } else {
      try {
        this.detail = JSON.parse(raw)
      } catch (e) {
        this.$toast && this.$toast('订单数据解析失败')
      }
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
  margin-left: 6px;
  white-space: nowrap;
}
.copy-text { cursor: pointer; user-select: none; word-break: break-all; }
.fs10 { font-size: 10px; }
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
}
.status-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 15px;
  text-align: center;
}
.status-title { font-size: 17px; font-weight: bold; color: #333; }
.status-desc { font-size: 13px; color: #999; margin-top: 6px; }
.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 13px 15px 15px;
  margin-top: 10px;
}
.card-title { font-weight: bold; font-size: 15px; margin-bottom: 4px; }
.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  font-size: 14px;
}
.row-label { color: #828282; flex-shrink: 0; }
.row-value { color: #333; text-align: right; word-break: break-all; }
.row-value.price { color: #C93F3D; font-weight: bold; font-size: 16px; }
.row-value.refund { color: #52c41a; font-weight: bold; }
.row-value.unpaid { color: #DA0200; }

/* 底部客服 */
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
.service .serviceBox { width: 18px; padding-top: 1px; }
</style>
