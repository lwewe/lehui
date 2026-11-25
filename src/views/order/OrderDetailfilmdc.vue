 <template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 门店信息 -->
    <div class="addressBox addressBox2" v-if="info.storeName">
      <div class="itemTitle">门店信息</div>
      <div class="store-info" style="margin-top: 12px;">
        <div class="store-name" style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">
          {{ info.storeName }}
        </div>
        <div class="store-address" style="font-size: 13px; color: #666;">
          地址：{{ info.storeAddress }}
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="addressBox addressBox2" v-if="goodsList.length > 0">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="(goodsItem, index) in goodsList" :key="index" style="margin-top: 15px;">
        <div class="shopImg">
          <img style="border-radius: 5px; width: 77px; height: 77px; object-fit: cover;"
               :src="goodsItem.productImage" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ goodsItem.productName }}</div>
          <div class="can" v-if="goodsItem.memo">
            规格：{{ goodsItem.memo }}
          </div>
          <div class="all" style="margin-top: 15px;">
            <div class="price"><span style="font-size: 10px;">￥</span>{{ goodsItem.amount }}</div>
            <div class="number">×{{ goodsItem.num }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2" v-if="info.orderCode">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(info.orderCode)">
            {{ info.orderCode }} <span class="copy-icon">复制</span>
          </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ info.createTime }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">手机号</div>
          <div class="price">{{ info.phone }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <div class="price" style="color: #DA0200; font-weight: bold;">
            {{ statusName }}
          </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">支付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ info.totalAmount }}</div>
        </div>
      </div>
    </div>
<!-- 支付信息 -->
<div class="addressBox addressBox2" v-if="paymentList.length > 0">
  <div class="itemTitle">支付信息</div>
  <div v-for="(item, i) in paymentList" :key="i"
       style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
    <div style="color: #828282; font-size: 14px;">{{ item.payName }}</div>
    <div style="font-size: 14px; font-weight: bold;">￥{{ item.price }}</div>
  </div>
</div>

    <!-- 取餐码：takeInfos 数组优先，takeInfo / takeCode 兜底，都没有则不显示 -->
    <div class="addressBox addressBox2" v-if="takeCodes.length > 0">
      <div class="itemTitle">取餐码</div>
      <div v-for="(item, i) in takeCodes" :key="i"
           style="text-align: center; padding: 12px 0;"
           :style="i === takeCodes.length - 1 ? '' : 'border-bottom:1px dashed #eee;'">
        <div style="font-size: 24px; color: #DA0200; font-weight: bold;">{{ item.takeInfo }}</div>
        <div v-if="item.orderStatusDesc" style="font-size: 13px; color: #666; margin-top: 6px;">
          出餐进度：{{ item.orderStatusDesc }}
        </div>
        <div v-if="item.lockerCode" style="font-size: 13px; color: #666; margin-top: 4px;">
          取餐柜：{{ item.lockerCode }}
        </div>
        <div v-if="item.orderPhone" style="font-size: 13px; color: #666; margin-top: 4px;">
          手机尾号：{{ item.orderPhone }}
        </div>
        <img v-if="item.qrData" :src="item.qrData" alt="取餐二维码"
             style="width: 140px; height: 140px; margin-top: 10px;" />
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
 import { dcorderDiancan } from "@/api/lehuicake";

export default {
  name: "OrderDetaildc",
  data() {
    return {
      loadingflag: true,
      order: {},   // data.order  旧业务表
      detailData: {} // data.detail 三方接口
    };
  },
  computed: {
    paymentList() {
  let raw = this.order.fuli || this.order.fuli_list || this.detailData.fuli;
  if (!raw) return [];
  let arr = raw;
  if (typeof raw === 'string') {
    try { arr = JSON.parse(raw); } catch (e) { return []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr.map(item => ({
    ...item,
    payName: this.getPayName(item.id != null ? item.id : item.pid)
  }));
},

    // 合并：三方 detail 优先，缺失回退 order
    info() {
      const d = this.detailData || {};
      const o = this.order || {};
      return {
        storeName: d.storeName || o.storeName,
        storeAddress: d.storeAddress || o.storeAddress,
        orderCode: d.orderCode || o.order_no,
        createTime: d.createTime || this.formatTime(o.add_time),
        phone: d.phone || o.phone,
        status: d.status != null ? d.status : o.status,
        totalAmount: d.totalAmount != null ? d.totalAmount : o.zongji
      };
    },
    goodsList() {
      return (this.detailData && this.detailData.detail && this.detailData.detail.length)
        ? this.detailData.detail
        : (this.order.goods || []);
    },
    statusName() {
      const statusMap = {
        1: '待支付', 2: '出餐中', 3: '出餐成功', 4: '出餐失败',
        5: '配送中', 6: '配送完成', 7: '未支付取消'
      };
      return statusMap[this.info.status] || '未知状态';
    },
    // 取餐码归一化：优先 takeInfos 数组，其次 takeInfo 字符串，最后 takeCode / takeInfoList
    takeCodes() {
      const d = this.detailData || {};
      const o = this.order || {};
      if (Array.isArray(d.takeInfos) && d.takeInfos.length) {
        return d.takeInfos.filter(it => it && it.takeInfo);
      }
      if (d.takeInfo) {
        // 可能是 "A,B" 逗号分隔
        return String(d.takeInfo).split(',').filter(Boolean).map(t => ({ takeInfo: t }));
      }
      if (Array.isArray(o.takeInfoList) && o.takeInfoList.length) {
        return o.takeInfoList.filter(it => it && it.takeInfo);
      }
      if (o.takeCode) {
        return String(o.takeCode).split(',').filter(Boolean).map(t => ({ takeInfo: t }));
      }
      return [];
    }
  },
  methods: {
    getPayName(id) {
  const map = {
    wx: '微信支付', wxpay: '微信支付', weixin: '微信支付', 1: '乐汇卡', 
  };
  return map[id] || '福利卡支付';
},

    toKefu() {
      window.location.href = localStorage.getItem("kefu");
    },
    copyText(text) {
      // 保持你原来的实现即可
    },
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time * 1000);
      const p = n => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
    },
    getOrderDetail(id) {
      this.loadingflag = true;
      dcorderDiancan({ id }).then(res => {
        this.loadingflag = false;
        if (res && (res.code === 200 || res.ok) && res.data) {
          this.order = res.data.order || {};
          this.detailData = res.data.detail || {};
        } else {
          this.$toast((res && res.msg) || '获取订单详情失败');
        }
      }).catch(err => {
        this.loadingflag = false;
        console.error(err);
        this.$toast('网络异常');
      });
    }
  },
  created() {
    const orderId = this.$route.query.id || this.$route.query.orderData;
    if (orderId) {
      this.getOrderDetail(orderId);
    } else {
      this.loadingflag = false;
      this.$toast('缺少订单参数');
    }
  }
};
</script>

<style scoped lang="less">
/* 完全复用你原来的基础样式，保证 UI 一致 */
.copy-icon { font-size: 11px; color: #DA0200; border: 1px solid #DA0200; border-radius: 3px; padding: 0 3px; line-height: 14px; margin-left: 5px; }
.location { background-color: #F0F0F0; padding: 10px; min-height: 100vh; box-sizing: border-box; padding-bottom: 80px; }
.addressBox { padding: 13px 10px; background-color: white; border-radius: 10px; }
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
.shopInfo .all { display: flex; align-items: center; justify-content: space-between; }
.shopInfo .price { color: #C63532; font-weight: bold; font-size: 15px; }
.shopInfo .number { color: #989898; font-size: 13px; }
.service { background-color: white; color: #5b5a5a; font-size: 13px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; margin-top: 10px; }
.service .serviceBox { width: 18px; padding-top: 1px; }
</style>