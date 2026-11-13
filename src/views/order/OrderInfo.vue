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
        <div class="order-card" v-for="(item, index) in orderList" :key="item.id || index" @click="goDetail(item)">

          <!-- 头部：订单号和状态 -->
          <div class="card-header">
            <div class="order-no">
              <!-- 如果是真·跨平台组合单，显示“组合”，否则显示单个平台 -->
              <span class="platform-tag" v-if="item.isGroup">组合</span>
              <span class="platform-tag" v-else>
                {{ formatPlatformTag(item.platform, item.jd_type || item.items?.[0]?.jd_type) }}
              </span>
            </div>
            <!-- <div class="status" :class="getStatusClass(item.status)">
             -- {{ item.status_name }}
            </div> -->
          </div>

          <!-- 主体：商品信息 -->
          <div class="card-body">

            <!-- A. 合并订单的渲染方式（天猫、京东、供应商混合平铺） -->
            <!-- A. 合并订单的渲染方式（天猫、京东、供应商混合平铺） -->
            <template v-if="item.isGroup">
              <div class="group-block" v-for="(sub, sIndex) in item.groupList" :key="sIndex">
                <div class="product-item" v-for="(goods, gIndex) in getSubItems(sub)" :key="gIndex"
                  @click.stop="goDetail(sub)">
                  <div class="product-img" :style="{ backgroundImage: `url(${goods.img})` }"></div>
                  <div class="product-detail">
                    <div class="title">
                      <!-- 只有合并单才在每个子单的第一个商品前显示所属平台标识 -->
                      <span v-if="gIndex === 0" class="mini-platform-tag">
                        {{ formatPlatformTag(sub.platform, sub.jd_type) }}
                      </span>
                      {{ goods.title }}
                    </div>
                    <div class="specs1" v-if="goods.spec_name"><span class="specs">{{ goods.spec_name }}</span></div>
                    <div class="price-line">
                      <span class="unit-price"><span style="font-size: 10px;">￥</span>{{ goods.sell_price }}</span>
                      <span class="count">x{{ goods.quantity }}</span>
                    </div>


                    <div class="express-action">
                      <div class="status" :class="getStatusClass(sub.status)">
                        {{ sub.status_name }}
                      </div>
                      <!-- <span class="express-text">{{ goods.express_company || '快递' }} <span v-if="goods.express_no">({{
            goods.express_no }})</span></span> -->
                      <span v-if="goods.express_no" @click.stop="goLogistics(goods.order_id, goods.delivery)"
                        class="logistics-btn">查看物流</span>
                    </div>

                  </div>
                </div>
              </div>
            </template>

            <!-- B. 普通单条订单（即便是纯京东买多个商品也是走这里） -->
            <template v-else>
              <div class="product-item" v-for="(goods, gIndex) in getSubItems(item)" :key="gIndex">
                <div class="product-img" :style="{ backgroundImage: `url(${goods.img})` }"></div>
                <div class="product-detail">
                  <div class="title">{{ goods.title }}</div>
                  <div class="specs1" v-if="goods.spec_name"><span class="specs">{{ goods.spec_name }}</span></div>
                  <div class="price-line">
                    <span class="unit-price"><span style="font-size: 10px;">￥</span>{{ goods.sell_price }}</span>
                    <span class="count">x{{ goods.quantity }}</span>
                  </div>


                  <!-- <div class="express-action" v-if="item.status === 2 || item.status === 7 || goods.express_no"
                    @click.stop="goLogistics(goods.order_id, goods.delivery)">
                    <span class="express-text">{{ goods.express_company || '快递' }} <span v-if="goods.express_no">({{
                      goods.express_no }})</span></span>
                    <span class="logistics-btn">——=查看物流 ></span>
                  </div> -->


                </div>
              </div>
            </template>

          </div>

          <!-- 底部：金额和操作按钮 -->
          <div class="card-footer">
            <div class="total-price">
              <!-- 如果是组合单，用组合累加金额；否则用单条订单原有的总金额 -->
              总计：<span class="price-num">{{ item.isGroup ? item.totalGroupPrice : (item.total_price || item.pay_amount
                || 0)
              }}</span>
              <span class="unit">元</span>
            </div>

            <!-- 动态按钮区域 -->
                       <!-- 动态按钮区域 -->
            <div class="action-buttons">
              <!-- 【1. 组合单专属判断逻辑】 -->
              <template v-if="item.isGroup">
                <!-- 只要组内有“待支付”的，就显示取消和支付 -->
                <template v-if="item.groupList.some(sub => sub.status === -1)">
                  <button class="btn" @click.stop="handleAction('cancelOrder', item, $event)">取消订单</button>
                  <button class="btn-red" @click.stop="handleAction('payOrder', item, $event)">立即支付</button>
                </template>
                <!-- 如果组内都是待发货/待收货 -->
                <template v-else-if="item.groupList.some(sub => sub.status === 1 || sub.status === 2)">
                  <button class="btn-cl6" @click.stop="handleAction('confirmReceive', item, $event)">申请售后</button>
                </template>
                <!-- 其他状态 -->
                <template v-else>
                  <button class="btn" @click.stop="handleAction('viewDetail', item, $event)">查看详情</button>
                </template>
              </template>

              <!-- 【2. 普通单原有逻辑 (保持原样)】 -->
              <template v-else-if="item.can_pay !== undefined || item.can_cancel !== undefined">
                <button v-if="item.can_cancel === 1" class="btn"
                  @click.stop="handleAction('cancelOrder', item, $event)">取消订单</button>
                <button v-if="item.can_pay === 1" class="btn-red"
                  @click.stop="handleAction('payOrder', item, $event)">立即支付</button>
              </template>
              <template v-else>
                <template v-if="item.status === -1">
                  <button class="btn" @click.stop="handleAction('cancelOrder', item, $event)">取消订单</button>
                  <button class="btn-red" @click.stop="handleAction('payOrder', item, $event)">立即支付</button>
                </template>
                <template v-else-if="item.status === 1">
                  <button class="btn-cl6" @click.stop="handleAction('confirmReceive', item, $event)">申请售后</button>
                </template>
                <template v-else-if="item.status === 2">
                  <button v-if="!item.isGroup" class="btn"
                    @click.stop="handleAction('viewLogistics', item, $event)">查看物流</button>
                  <button class="btn-cl6" @click.stop="handleAction('confirmReceive', item, $event)">申请售后</button>
                </template>
                <template v-else-if="item.status === 7 || item.status === 'used'">
                  <button class="btn" @click.stop="handleAction('viewDetail', item, $event)">查看详情</button>
                </template>
                <template v-else-if="item.status === 9">
                  <button class="btn">已取消</button>
                </template>
                <template v-else-if="item.status === 'useable'">
                  <button class="btn-red" @click.stop="handleAction('useNow', item, $event)">立即使用</button>
                </template>
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
import { orderList, orderCancel } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'

export default {
  name: "OrderList",
  data() {
    return {
      tabs: [
        { label: "全部", value: "all" },
        { label: "待支付", value: "-1" },
        { label: "待收货", value: "2" },
        { label: "已完成", value: "7" },
      ],
      currentTab: "all",
      orderList: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      toastVisible: false,
      toastText: "",
      toastTimer: null
    };
  },
  computed: {
    hasMore() {
      if (this.total > 0) {
        return this.orderList.length < this.total;
      }
      return this.orderList.length >= this.limit;
    }
  },
  mounted() {
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
  },
  methods: {
    goLogistics(orderId, delivery) {
      if (!orderId) {
        this.$toast('暂无物流信息');
        return;
      }
      this.$router.push({
        path: '/shipInfo',
        query: { id: orderId, address: delivery }
      });
    },
    formatPlatformTag(platform, jdType) {
      const p = Number(platform);
      if (p === 1) return '京东';
      if (p === 2) return '天猫';
      if (p === 4) return '盒马';
      if (p === 5) return '鲜花';
      if (p === 12) return '途虎';
      return this.getPlatformName(platform, jdType);
    },

    // 提取所有商品数据
    getSubItems(order) {
      if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        return order.items.map(goods => ({
          img: goods.img || order.product_img || '',
          title: goods.title || order.product_title || '',
          spec_name: goods.spec_name || '',
          sell_price: goods.sell_price ?? order.sell_price ?? '',
          quantity: goods.quantity ?? order.quantity ?? 1,

          order_id: order.id || order.order_id,

          express_company: goods.express_company || order.express_company || '',
          express_no: goods.express_no || order.express_no || '',
          delivery: goods.delivery || order.delivery || null

        }));
      }
      if (order.product) {
        return [{
          img: order.product.img || order.product_img || '',
          title: order.product.title || order.product_title || '',
          spec_name: '',
          sell_price: order.product.sell_price ?? order.sell_price ?? '',
          quantity: order.quantity ?? 1
        }];
      }
      return [{
        img: order.product_img || '',
        title: order.product_title || '',
        spec_name: '',
        sell_price: order.sell_price ?? '',
        quantity: order.quantity ?? 1
      }];
    },

    getPlatformName,

    goDetail(item) {
      if (item.biz === 'tuhu' || Number(item.platform) === 12) {
        this.$router.push({ path: '/orderDetail', query: { order_id: item.order_id } });
        return;
      }
      // 组合单点击跳转第一个商品或主订单
      if (item.isGroup) {
        this.$router.push({ path: '/orderDetail', query: { id: item.groupList[0].id } });
        return;
      }
      this.$router.push({ path: '/orderDetail', query: { id: item.id } });
    },

    handleAction(action, item, event) {
      if (event && event.stopPropagation) event.stopPropagation()

      const isGroup = item.isGroup;
      const targetGroupId = isGroup ? (item.group_id || item.groupList[0].group_id) : null;
      const targetId = item.id;

      if (action === 'payOrder') {
        // 1. 组合单去支付，传 group_id
        if (isGroup) {
          this.$router.push({
            path: '/confirmOrder',
            query: {
              group_id: targetGroupId,
              total_price: item.totalGroupPrice
            }
          });
          return;
        }

        // 2. 普通单去支付
        const platform = Number(item.platform);
        if (platform === 12 || item.biz === 'tuhu') {
          const goods = this.getSubItems(item)[0] || {};
          this.$router.push({
            path: '/TuHuConfirmOrder',
            query: {
              order_id: item.id,
              order_no: item.order_no,
              item_name: goods.title || '',
              item_price: goods.sell_price || item.pay_amount || 0,
              item_face: item.pay_amount || '',
              uuid: item.recharge_uuid || item.uuid || ''
            }
          });
          return;
        }


        if (platform === 4) {
          this.$router.push({
            path: '/confirmOrderhm',
            query: {
              order_id: item.id,
              total_price: item.total_price ?? item.pay_amount ?? 0,
              order_no: item.order_no
            }
          });
          return; // ✅ 关键：盒马跳完立即返回，避免穿透到普通单
        }
        if (platform === 5) {
          this.$router.push({
            path: '/FlowerConfirmOrder',
            query: {
              order_id: item.id,
              total_price: item.total_price ?? item.pay_amount ?? 0,
              order_no: item.order_no
            }
          });
          return; // ✅ 关键：鲜花同理
        }

        // 普通单（京东/天猫/供应商/其他）
        this.$router.push({
          path: '/confirmOrder',
          query: {
            order_id: item.id,
            total_price: item.total_price,
            order_no: item.order_no
          }
        });
        // if (platform === 4) { return; } // 盒马原逻辑
        // if (platform === 5) { return; } // 鲜花原逻辑

        // this.$router.push({
        //   path: '/confirmOrder',
        //   query: {
        //     order_id: item.id,
        //     total_price: item.total_price,
        //     order_no: item.order_no
        //   }
        // });
      }

      else if (action === 'cancelOrder') {
        this.$dialog.confirm({
          title: '取消订单',
          message: '确定要取消该订单吗？',
          confirmButtonColor: 'red'
        }).then(() => {
          // ✅ 组合单传 group_id，普通单传 id
          const cancelParams = isGroup ? { group_id: targetGroupId } : { id: targetId };

          orderCancel(cancelParams).then(res => {
            if (res.code == 200) {
              this.$toast(res.msg || '订单已取消')
              this.fetchOrderList()
            } else {
              this.$toast(res.msg || '取消失败')
            }
          })
        }).catch(() => { })
      }

      else if (action === 'confirmReceive') {
        window.location.href = localStorage.getItem("kefu")
      }
      else if (action === 'viewLogistics') {
        this.$router.push({ path: '/shipInfo', query: { id: item.id, address: item.delivery } })
      }
      else {
        if (item.biz === 'tuhu' || Number(item.platform) === 12) {
          this.$toast('途虎订单暂不支持查看详情');
          return;
        }
        this.$router.push({ path: '/orderDetail', query: { id: item.id } })
      }
    },

    switchTab(value) {
      this.currentTab = value;
      this.page = 1;
      this.orderList = [];
      this.fetchOrderList();
    },

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
          let list = [];
          let total = 0;
          const payload = res.data;

          if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
            if (Array.isArray(payload.data)) list = payload.data;
            else if (Array.isArray(payload.list)) list = payload.list;
            total = Number(payload.total) || 0;
          } else if (Array.isArray(payload)) {
            list = payload;
            total = payload.length;
          }

          // 【核心聚合逻辑升级版】
          const mergedList = [];
          const groupMap = {};

          list.forEach(item => {
            const gid = item.group_id;

            if (gid && String(gid) !== "0") {
              if (!groupMap[gid]) {
                groupMap[gid] = {
                  ...item,
                  groupList: [item],
                  totalGroupPrice: Number(item.pay_amount || item.total_price || 0)
                };
                mergedList.push(groupMap[gid]);
              } else {
                groupMap[gid].groupList.push(item);
                groupMap[gid].totalGroupPrice += Number(item.pay_amount || item.total_price || 0);
              }
            } else {
              mergedList.push(item);
            }
          });

          // 检查每个合并的组是否真的是跨平台组合

          mergedList.forEach(item => {
            if (item.groupList && item.groupList.length > 1) {
              // 只要 groupList 里有多条订单，统一视为组合单（不管是同平台还是跨平台）
              item.isGroup = true;
              item.totalGroupPrice = Number(item.totalGroupPrice.toFixed(2));
            } else {
              // 只有一条订单，或者没有 group_id 的，保持普通单
              item.isGroup = false;
            }
          });



          if (this.page === 1) {
            this.orderList = mergedList;
          } else {
            const existingIds = new Set(this.orderList.map(item => item.id));
            const newItems = mergedList.filter(item => !existingIds.has(item.id));
            this.orderList = [...this.orderList, ...newItems];
          }

          this.total = total;

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

    loadMore() {
      if (!this.hasMore || this.loading) return;
      this.page++;
      this.fetchOrderList();
    },

    getStatusClass(status) {
      if (status === 7 || status === 'used' || status === 9) return "status-gray";
      if (status === -1 || status === 'useable' || status === 1 || status === 2) return "status-red";
      return "";
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

.mini-platform-tag {
  display: inline-block;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  line-height: 14px;
  padding: 1px 4px;
  margin-right: 6px;
  font-weight: 400;
  vertical-align: middle;
}

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

.status {
  font-weight: 500;
}

.status-gray {
  color: #999;
}

.status-red {
  color: #b5691a;
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

.btn-cl6 {
  border: none;
  background: #e3e1e1;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 12px;
  color: #717070;
  cursor: pointer;
  outline: none;
}

.btn-cl6:active {
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

.card-body {
  padding-bottom: 12px;
  border-bottom: 1px solid #f9f9f9;
}

.group-block {
  display: flex;
  flex-direction: column;
}

.group-block+.group-block {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
}

.product-item {
  display: flex;
  padding: 8px 0;
}

.product-item+.product-item {
  margin-top: 4px;
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


.express-action {
  display: flex;
  justify-content: space-between;
  /* align-items: center;*/
  margin-top: 8px;
  text-align: right;
  padding: 0;
  /* background-color: #f8f8f8; */
  /* border-radius: 4px; */
  font-size: 12px;
}

.express-text {
  color: #666;
}

.logistics-btn {
  color: #11141a;
  font-weight: 500;
}
</style>