<template>
  <div class="page-container">
    <!-- 1. 顶部导航 -->
   
    <!-- 2. 顶部 Tab 切换 -->
    <div class="tabs-wrapper">
      <div
        class="tab-item"
        :class="{ active: currentTab === 'transaction' }"
        @click="switchTab('transaction')"
      >
        <span>交易记录</span>
        <div class="active-line" v-show="currentTab === 'transaction'"></div>
      </div>
      <div
        class="tab-item"
        :class="{ active: currentTab === 'recharge' }"
        @click="switchTab('recharge')"
      >
        <span>充值记录</span>
        <div class="active-line" v-show="currentTab === 'recharge'"></div>
      </div>
    </div>

    <!-- 3. 列表内容区 -->
    <div class="list-wrapper" ref="listWrapper">
      <!-- ====== 交易记录 ====== -->
      <template v-if="currentTab === 'transaction'">
        <!-- 情况A：有数据 -->
        <div class="list-item" v-for="(item, index) in transactionList" :key="index">
          <div class="info-left">
            <div class="type-name">{{ getConsumeType(item.flag) }}</div>
            <div class="time">{{ timestampToTime(item.add_time) }}</div>
          </div>
          <div class="amount-right">-{{ item.price }}</div>
        </div>

        <!-- 情况B：无数据 - 空状态 -->
        <div class="empty-state" v-if="transactionList.length === 0 && !isTransactionLoading">
          <div class="empty-img-box">
            <div class="icon-card-placeholder"></div>
          </div>
          <div class="empty-text">暂无交易记录</div>
        </div>
      </template>

      <!-- ====== 充值记录 ====== -->
      <template v-if="currentTab === 'recharge'">
        <div class="list-item" v-for="(item, index) in rechargeList" :key="index">
          <div class="info-left">
            <div class="type-name">{{ getRechargeType(item.flag) }}</div>
            <div class="time">{{ timestampToTime(item.add_time) }}</div>
          </div>
          <div class="amount-right">+{{ item.price }}</div>
        </div>

        <div class="empty-state" v-if="rechargeList.length === 0 && !isRechargeLoading">
          <div class="empty-img-box">
            <div class="icon-card-placeholder"></div>
          </div>
          <div class="empty-text">暂无充值记录</div>
        </div>
      </template>

      <!-- ================== 核心修改：手动的加载更多按钮 ================== -->
            <!-- ================== 手动点击加载更多按钮 ================== -->
      <div class="load-more-wrapper" v-if="!isTransactionLoading && !isRechargeLoading">
        
        <!-- 交易记录加载按钮 -->
        <!-- 核心修改点：增加 && hasMoreTransaction 判断 -->
        <div 
          v-if="currentTab === 'transaction' && transactionList.length > 0 && hasMoreTransaction"
          class="load-more-btn"
          @click="fetchTransactionData"
        >
          点击加载更多
        </div>
        <!-- 交易记录没有更多了（即使长度为0也会显示） -->
        <div 
          v-else-if="currentTab === 'transaction' && !hasMoreTransaction"
          class="load-more-btn disabled"
        >
          —— 没有更多了 ——
        </div>

        <!-- 充值记录加载按钮 -->
        <!-- 核心修改点：增加 && hasMoreRecharge 判断 -->
        <div 
          v-if="currentTab === 'recharge' && rechargeList.length > 0 && hasMoreRecharge"
          class="load-more-btn"
          @click="fetchRechargeData"
        >
          点击加载更多
        </div>
        <!-- 充值记录没有更多了 -->
        <div 
          v-else-if="currentTab === 'recharge' && !hasMoreRecharge"
          class="load-more-btn disabled"
        >
          —— 没有更多了 ——
        </div>
        
      </div>

      <!-- 正在加载时的状态 -->
      <div class="loading-tip" v-if="isTransactionLoading || isRechargeLoading">
        正在加载...
      </div>
    </div>
  </div>
</template>

<script>
import { CardConsume, CardRecharge } from "@/api/lhcard";

export default {
  name: "TransactionRecords",
  data() {
    return {
      currentTab: 'transaction',
      khid: '',
      
      // 交易记录相关
      transactionList: [],
      transactionPage: 1,
      isTransactionLoading: false,
      hasMoreTransaction: true,

      // 充值记录相关
      rechargeList: [],
      rechargePage: 1,
      isRechargeLoading: false,
      hasMoreRecharge: true,
    }
  },
  created() {
    // 从路由获取卡号ID
    this.khid = this.$route.query.khid;
    if (!this.khid) {
      this.$toast("缺少卡号ID参数");
      return;
    }
    this.loadData();
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
      if (tab === 'transaction') {
        this.transactionList = [];
        this.transactionPage = 1;
        this.hasMoreTransaction = true;
        this.fetchTransactionData();
      } else {
        this.rechargeList = [];
        this.rechargePage = 1;
        this.hasMoreRecharge = true;
        this.fetchRechargeData();
      }
    },
    loadData() {
      if (this.currentTab === 'transaction') {
        this.fetchTransactionData();
      } else {
        this.fetchRechargeData();
      }
    },
    async fetchTransactionData() {
      if (this.isTransactionLoading) return;
      this.isTransactionLoading = true;
      try {
        const res = await CardConsume({
          khid: this.khid,
          page: this.transactionPage,
          limit: 10
        });
        if (res.code === 200 && res.data && res.data.list) {
          const newData = res.data.list.data || [];
          if (newData.length > 0) {
            this.transactionList = [...this.transactionList, ...newData];
            this.transactionPage++;
          } else {
            this.hasMoreTransaction = false;
          }
        } else {
          this.hasMoreTransaction = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isTransactionLoading = false;
      }
    },
    async fetchRechargeData() {
      if (this.isRechargeLoading) return;
      this.isRechargeLoading = true;
      try {
        const res = await CardRecharge({
          khid: this.khid,
          page: this.rechargePage,
          limit: 10
        });
        if (res.code === 200 && res.data && res.data.list) {
          const newData = res.data.list.data || [];
          if (newData.length > 0) {
            this.rechargeList = [...this.rechargeList, ...newData];
            this.rechargePage++;
          } else {
            this.hasMoreRecharge = false;
          }
        } else {
          this.hasMoreRecharge = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isRechargeLoading = false;
      }
    },
    getConsumeType(flag) {
      if (flag == 1) return '消费';
      if (flag == 4) return '后台扣除';
      return '其他';
    },
    getRechargeType(flag) {
      if (flag == 2) return '微信充值';
      if (flag == 3) return '后台充值';
      return '其他充值';
    },
    timestampToTime(time) {
      if (!time) return '';
      const d = new Date(time * 1000);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped lang="less">
.page-container {
  min-height: 100vh;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #fff;
  .close-btn { font-size: 22px; color: #333; cursor: pointer; }
  .nav-title { font-size: 16px; font-weight: 500; color: #333; }
  .more-btn { font-size: 20px; color: #333; letter-spacing: 2px; cursor: pointer; }
}

.tabs-wrapper {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  flex-shrink: 0;
  .tab-item {
    position: relative;
    flex: 1;
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    &.active {
      color: #ff8c42;
      font-weight: 500;
      .active-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: #ff8c42;
        border-radius: 2px;
      }
    }
  }
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 30px 16px;
  -webkit-overflow-scrolling: touch;

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f8f8f8;
    &:last-child { border-bottom: none; }
    .info-left {
      display: flex;
      flex-direction: column;
      .type-name { font-size: 14px; color: #333; margin-bottom: 4px; }
      .time { font-size: 12px; color: #b3b3b3; }
    }
    .amount-right { font-size: 15px; color: #333; }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  flex: 1;
  margin-bottom: 60px;
  .empty-img-box {
    margin-bottom: 20px;
    width: 120px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-card-placeholder {
      width: 80%; height: 80%; background: #f5f6fa; border-radius: 8px; position: relative; box-shadow: 0 4px 8px rgba(0,0,0,0.02);
      &::after { content: ""; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; background: #ddd; border-radius: 50%; box-shadow: -8px 0 0 #d0d0d0; }
    }
  }
  .empty-text { font-size: 14px; color: #c0c0c0; }
}

/* ================= 手动点击加载更多 ================= */
 /* ================= 手动点击加载更多 ================= */
.load-more-wrapper {
  padding: 20px 0 10px 0;
  text-align: center;
}

.load-more-btn {
  display: inline-block;
  padding: 8px 24px;
  font-size: 13px;
  color: #ff8c42;
  border: 1px solid #ff8c42;
  border-radius: 20px;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s;
}

.load-more-btn:active {
  background: #ff8c42;
  color: #fff;
}

/* 新增：没有更多时的置灰样式 */
.load-more-btn.disabled {
  color: #ccc !important;
  border-color: #ddd !important;
  cursor: default !important;
  background: transparent !important;
}

.loading-tip {
  text-align: center;
  font-size: 13px;
  color: #999;
  padding: 20px 0 10px 0;
}
</style>