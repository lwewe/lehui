<template>
  <div class="order-page">
    <!-- 顶部导航 Tab -->
    <div class="tabs-header">
      <div v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === tab.value }"
        @click="switchTab(tab.value)">
        {{ tab.label }}
        <span class="active-line" v-if="currentTab === tab.value"></span>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-content">
      <!-- 加载中 -->
      <div v-if="loading && orderList.length === 0" class="state-box">加载中...</div>

      <!-- 有订单 -->
      <div v-else-if="orderList.length > 0" class="order-list">
        <div class="order-card" v-for="(item, index) in orderList" :key="item.id" @click="goDetail(item.id)">

          <!-- 头部：订单号和状态 -->
          <div class="card-header">
            <div class="order-no">
              <span class="platform-tag">
                <!-- {{ getPlatformName(item.platform) }} -->
                {{ getPlatformName(item.platform, item.jd_type || item.items?.[0]?.jd_type) }}

              </span>
              <!-- 订单号：{{ item.order_no }}  
              <span class="copy-btn" @click="copyOrderNo(item.order_no)"> 复制</span> -->
            </div>
            <div class="status" :class="getStatusClass(item.status)">
              {{ item.status_name }}
            </div>
          </div>

          <!-- 主体：商品信息 -->
          <!-- 主体：商品信息 -->
          <div class="card-body">
            <div class="product-item" v-for="(goods, gIndex) in normalizeItems(item)" :key="gIndex">
              <div class="product-img" :style="{ backgroundImage: `url(${goods.product_img})` }"></div>
              <div class="product-detail">
                <div class="title">{{ goods.product_title }}</div>
                <div class="specs1" v-if="goods.spec_name"><span class="specs">{{ goods.spec_name }}</span></div>
                <div class="price-line">
                  <span class="unit-price"><span style="font-size: 10px;">￥</span>{{ goods.sell_price }}</span>
                  <span class="count">x{{ goods.quantity }}</span>
                </div>
              </div>
            </div>


          </div>
          <!-- 底部：金额和操作按钮 -->
          <div class="card-footer">
            <div class="total-price">
              总计：<span class="price-num">{{ item.total_price }}</span>
              <span class="unit">元</span>
            </div>

            <!-- 动态按钮区域 (根据接口文档的状态值) -->
            <div class="action-buttons">

              <!-- -1: 待支付 -->
              <template v-if="item.status === -1">
                <button class="btn" @click="handleAction('cancelOrder', item, $event)">取消订单</button>
                <button class="btn-red" @click="handleAction('payOrder', item, $event)">立即支付</button>
              </template>


              <!-- 2: 待收货 -->
              <template v-else-if="item.status === 2">
                <button class="btn" @click="handleAction('viewLogistics', item, $event)">查看物流</button>
                <button class="btn-red" @click="handleAction('confirmReceive', item, $event)">确认收货</button>
              </template>

              <!-- 7: 已核销 / used: 已核销 (等同于已完成) -->
              <template v-else-if="item.status === 7 || item.status === 'used'">
                <button class="btn" @click="handleAction('viewDetail', item, $event)">查看详情</button>
              </template>

              <!-- 9: 已取消 -->
              <template v-else-if="item.status === 9">
                <button class="btn">已取消</button>

              </template>

              <!-- useable: 待使用 -->
              <template v-else-if="item.status === 'useable'">
                <button class="btn-red" @click="handleAction('useNow', item, $event)">立即使用</button>
              </template>

            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon-box">
          <img src="http://lh.bjyxfl.com/images/no-order.png" alt="" style='width: 160px;margin: auto;height: 160px;'>
        </div>
        <div class="empty-text">暂无相关订单</div>
      </div>
    </div>

    <!-- 分页/加载更多提示 -->
    <div v-if="!loading && orderList.length > 0" class="load-more" @click="loadMore">
      {{ hasMore ? '点击加载更多' : '没有更多了' }}
    </div>

    <!-- 复制成功提示 -->
    <transition name="fade">
      <div v-if="toastVisible" class="toast-message">{{ toastText }}</div>
    </transition>
  </div>
</template>

<script>
// 1. 引入你项目规范中的接口
import { orderList, orderCancel } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "OrderList",
  data() {
    return {
      // 状态 Tab 映射
      tabs: [
        { label: "全部", value: "all" },
        { label: "待支付", value: "-1" },
        // { label: "待发货", value: "1" },
        { label: "待收货", value: "2" },
        { label: "待使用", value: "useable" },
        { label: "已完成", value: "7" },
        // { label: "已取消", value: "9" }
      ],
      currentTab: "all",

      // 列表数据
      orderList: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: false,

      // Toast
      toastVisible: false,
      toastText: "",
      toastTimer: null
    };
  },
  computed: {
    hasMore() {
      // 如果 total 为 0，使用 orderList.length 判断
      if (this.total > 0) {
        return this.orderList.length < this.total;
      }
      // 如果后端没返回 total，根据最后一批数据量判断
      return this.orderList.length >= this.limit;
    }
  },
  mounted() {

    // ✅ 从路由读取初始 Tab（兼容 status 和 tabIndex）
    const routeStatus = this.$route.query.status
    const routeTabIndex = this.$route.query.tabIndex

    if (routeStatus !== undefined && routeStatus !== '') {
      const validValues = this.tabs.map(t => String(t.value))
      if (validValues.includes(String(routeStatus))) {
        this.currentTab = String(routeStatus)
      }
    } else if (routeTabIndex !== undefined && routeTabIndex !== '') {
      const map = { '0': 'all', '1': '-1', '2': '2', '3': '7' }
      const mapped = map[String(routeTabIndex)]
      if (mapped !== undefined) {
        this.currentTab = mapped
      }
    }

    this.fetchOrderList()

    // this.fetchOrderList();
  },
  methods: {
    normalizeItems(item) {
  // 1. 有 items 数组，直接用
  if (Array.isArray(item.items) && item.items.length) {
    return item.items;
  }

  // 2. 有 product 对象（盒马、途虎）
  if (item.product && typeof item.product === 'object') {
    return [{
      product_title: item.product.title || item.product_title || '',
      product_img: item.product.img || item.product_img || '',
      sell_price: item.product.sell_price || item.sell_price || '',
      quantity: item.quantity || 1,
      spec_name: ''
    }];
  }

  // 3. product 为 null（鲜花），用根级字段
  return [{
    product_title: item.product_title || '',
    product_img: item.product_img || '',
    sell_price: item.sell_price || '',
    quantity: item.quantity || 1,
    spec_name: ''
  }];
},
    getPlatformName,
    // 订单卡片整体点击，跳转详情页
    goDetail(id) {
      this.$router.push({ path: '/orderDetail', query: { id } })
    },

    // 按钮点击事件处理
    // 按钮点击事件处理（根据不同操作分别处理）
    handleAction(action, item, event) {
      // 阻止冒泡（防止触发卡片点击）
      if (event && event.stopPropagation) event.stopPropagation()

      if (action === 'payOrder') {
        const platform = Number(item.platform);
        const path = platform === 4 ? '/ConfirmOrderHema' : '/confirmOrder';

        const q = {
          order_id: item.id,
          total_price: item.total_price,
          order_no: item.order_no
        };

        // 盒马订单，把地址也带上
        if (platform === 4) {
          let delivery = {};
          try {
            delivery = typeof item.delivery === 'string' ? JSON.parse(item.delivery) : (item.delivery || {});
          } catch (e) { }

          q.consignee_name = delivery.name || '';
          q.consignee_phone = delivery.phone || '';
          q.address_detail = delivery.detail || '';
          q.division_code = delivery.divisionCode || '';
          q.town_division_code = delivery.townDivisionCode || '';
        }

        this.$router.push({ path, query: q });
      }
      else if (action === 'cancelOrder') {
        // 待支付 - 取消订单（调用取消接口）
        this.$dialog.confirm({
          title: '取消订单',
          message: '确定要取消该订单吗？',
          confirmButtonColor: 'red'
        }).then(() => {
          orderCancel({ id: item.id }).then(res => {
            if (res.code == 200) {
              this.$toast(res.msg || '订单已取消')
              // 取消成功后重新刷新列表
              this.fetchOrderList()
            } else {
              this.$toast(res.msg || '取消失败')
            }
          })
        }).catch(() => { })
      }
      else if (action === 'viewLogistics') {
        // 待收货 - 查看物流
        this.$router.push({ path: '/shipInfo', query: { id: item.id, address: item.delivery } })
      }
      else {
        // 其他所有情况（查看详情、确认收货、提醒发货、再次购买、在线咨询等）
        // 统一跳转订单详情页
        this.$router.push({ path: '/orderDetail', query: { id: item.id } })
      }
    },
    // 切换 Tab
    switchTab(value) {
      this.currentTab = value;
      this.page = 1;
      this.orderList = [];
      this.fetchOrderList();
    },

    // 获取订单列表 (对接文档接口)
    async fetchOrderList() {
      if (this.page === 1 && this.orderList.length === 0) {
        this.loading = true;
      }

      try {
        const res = await orderList({
          status: this.currentTab,
          page: this.page,
          limit: this.limit
        });

        if (res.code === 200) {
          // 根据接口文档，data 可能直接是数组
          let list = [];
          let total = 0;

          if (Array.isArray(res.data)) {
            // 如果 data 直接是数组
            list = res.data;
            total = res.data.length;
          } else if (res.data && Array.isArray(res.data.list)) {
            // 如果 data 是对象，包含 list
            list = res.data.list;
            total = res.data.total || res.data.list.length;
          } else if (res.data && Array.isArray(res.data.data)) {
            // 如果 data.data 是数组
            list = res.data.data;
            total = res.data.total || res.data.data.length;
          } else {
            list = [];
            total = 0;
          }

          // 如果列表为空，显示空状态
          if (this.page === 1) {
            this.orderList = list;
          } else {
            this.orderList = [...this.orderList, ...list];
          }
          this.total = total;

          // 如果加载的列表为空，提示没有更多
          if (list.length === 0 && this.page > 1) {
            this.showToast('没有更多了');
            this.page--;
          }
        } else {
          this.showToast(res.msg || '获取订单失败');
        }
      } catch (error) {
        console.error('获取订单失败', error);
        this.showToast('网络异常，请稍后重试');
      } finally {
        this.loading = false;
      }
    },

    // 加载更多
    loadMore() {
      if (!this.hasMore || this.loading) return;
      this.page++;
      console.log('加载第', this.page, '页')
      this.fetchOrderList();
    },

    // 根据状态返回颜色
    getStatusClass(status) {
      if (status === 7 || status === 'used' || status === 9) return "status-gray";
      if (status === -1 || status === 'useable' || status === 1 || status === 2) return "status-red";
      return "";
    },

    // 按钮点击事件处理


    // 复制订单号
    async copyOrderNo(orderNo) {
      try {
        await navigator.clipboard.writeText(orderNo);
        this.showToast("复制成功");
      } catch (err) {
        // 降级方案
        const textArea = document.createElement("textarea");
        textArea.value = orderNo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showToast("复制成功");
      }
    },

    showToast(msg) {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastText = msg;
      this.toastVisible = true;
      this.toastTimer = setTimeout(() => {
        this.toastVisible = false;
      }, 2000);
    }
  },
  beforeDestroy() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
};
</script>

<style scoped>
.platform-tag {
  width: fit-content;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;

}

/* 样式部分保持不变 */
.order-page {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.tabs-header {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 12px 0 5px 0;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  /* 防止 Tab 过多溢出 */
  white-space: nowrap;
}

.tab-item {
  position: relative;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 0 12px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-item.active {
  color: #333;
  font-weight: 600;
}

.active-line {
  position: absolute;
  bottom: 0;
  width: 22px;
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(to right, #ff4d4f, #ff7a45);
}

.order-content {
  padding: 12px 16px;
}

.order-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.order-no {
  display: flex;
  align-items: center;
}

.copy-btn {
  font-size: 12px;
  color: #666;
  margin-left: 6px;
  cursor: pointer;
}

.status {
  font-weight: 500;
}

.status-gray {
  color: #999;
}

.status-red {
  color: #ff4d4f;
}










.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
}

.total-price {
  font-size: 13px;
  color: #333;
}

.price-num {
  font-size: 16px;
  font-weight: 600;
  margin: 0 2px;
}

.unit {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  outline: none;
  background-color: #fff;
}

.btn:active {
  background-color: #f5f5f5;
}

.btn-red {
  border: none;
  background: linear-gradient(90deg, #FF7675 0%, #DA0200 100%);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 12px;
  color: #ffffff;
  cursor: pointer;
  outline: none;
}

.btn-red:active {
  opacity: 0.8;
}

.state-box {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.empty-icon-box {
  font-size: 60px;
  color: #ccc;
}

.empty-text {

  font-size: 14px;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 13px;
  cursor: pointer;
}

.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


/*  */
.card-body {
  padding-bottom: 12px;
  border-bottom: 1px solid #f9f9f9;
}

.product-item {
  display: flex;
  padding: 8px 0;
}

.product-item+.product-item {
  border-top: 1px dashed #f0f0f0;
}

.product-img {
  width: 70px;
  height: 70px;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
}

.product-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.specs {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  background: #f7f7f7;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.unit-price {
  font-size: 13px;
  color: #333;
}

.count {
  font-size: 12px;
  color: #999;
}

/*  */
</style>