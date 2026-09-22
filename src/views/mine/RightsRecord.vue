<template>
  <div class="page-container">
    <!-- 1. 顶部导航 -->
     

    <!-- 2. 黑金卡展示 -->
    <div class="card-container" v-if="cardInfo">
      <div class="black-card">
        <div class="card-bg-pattern"></div>
        <div class="card-top">
          <div class="card-title-group">
            <div class="card-name">乐汇卡</div>
            <div class="card-number">{{ cardInfo.cardNum.num }}</div>
          </div>
          <div class="use-btn" @click="toIndex()">
            立即使用 
            <!-- <span class="arrow">›</span> -->
          </div>
        </div>
        <div class="card-bottom">
          <div class="info-item">
            <div class="label">余额（点）</div>
            <div class="value">{{ cardInfo.cardNum.price }}</div>
          </div>
          <div class="info-item">
            <div class="label">有效期</div>
            <div class="value">{{ timestampToTime(cardInfo.card.end_time) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-else class="loading-state">
      <Loading />
    </div>

    <!-- 3. 中间操作按钮 -->
    <div class="action-row">
      <div class="action-item" @click="handleRecharge">
        <i class="icon-recharge"></i> 我要充值
      </div>
      <div class="divider"></div>
      <div class="action-item" @click="handleDelete">
        <i class="icon-delete"></i> 删除卡券
      </div>
    </div>

    <!-- 4. 交易记录列表 -->
    <div class="transaction-section">
      <div class="section-header">
        <span class="title">交易记录</span>
        <div class="more-link" @click="goAllRecords">
          全部 <span class="arrow">›</span>
        </div>
      </div>

      <div class="list-wrapper">
        <!-- 有数据时渲染列表 -->
        <div class="list-item" v-for="(item, index) in consumeList" :key="index">
          <div class="info-left">
            <div class="type-name">{{ item.flag === 1 ? '消费' : '扣减' }}</div>
            <div class="time">{{ timestampToTime(item.add_time) }}</div>
          </div>
          <div class="amount-right">-{{ item.price }}</div>
        </div>

        <!-- 无数据空状态 -->
        <div class="empty-state" v-if="consumeList.length === 0">
          <div class="empty-img-box">
            <div class="icon-card-placeholder"></div>
          </div>
          <div class="empty-text">暂无交易记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CardShow, CardConsume, CardRecharge,Delcard } from "@/api/lhcard";
import Loading from "@/components/loding.vue";

export default {
  name: "RightsDetail",
  components: { Loading },
  data() {
    return {
      cardInfo: null,
      consumeList: [], // 消费记录列表
      rechargeList: [], // 充值记录列表
      currentKhid: '', // 当前卡片ID
    }
  },
  created() {
    // 从路由参数获取 khid

    const khid = this.$route.query.cardid;   // 这里拿到 289696
    
 
    if (khid) {
      this.fetchCardData();
      this.fetchConsumeList();
      this.fetchRechargeList();
    } else {
      this.$toast("缺少卡号ID");
    }
  },
  methods: {
    // 获取卡片详情 (已修正路径)
    async fetchCardData() {
      try {
        const res = await CardShow({ khid: this.$route.query.cardid });
        if (res.code === 200 && res.data) {
          this.cardInfo = {
            cardNum: res.data.card_num,
            card: res.data.card
          };
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 获取消费记录
    async fetchConsumeList() {
      try {
        const res = await CardConsume({ khid:   this.$route.query.cardid , page: 1, limit: 10 });
        if (res.code === 200 && res.data && res.data.list) {
          this.consumeList = res.data.list.data;
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 获取充值记录 (补全)
    async fetchRechargeList() {
      try {
        const res = await CardRecharge({ khid:this.$route.query.cardid , page: 1, limit: 10 });
        if (res.code === 200 && res.data && res.data.list) {
          this.rechargeList = res.data.list.data;
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 时间戳转日期
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
    },
    toIndex(){
      this.$router.push({
        path: "/index",
         
      });
    },
    handleRecharge() {
      this.$router.push({
        path: "/Package",
        query: { khid: this.$route.query.cardid}
      });
    },
        // 删除卡券
    async handleDelete() {
      // 1. 检查卡片数据是否加载完成
      if (!this.cardInfo || !this.cardInfo.cardNum) {
        this.$toast("卡片数据加载中，请稍后");
        return;
      }

      // 2. 获取要删除的卡号ID (对应接口的 kid 参数)
      const kid = this.cardInfo.cardNum.id;

      // 3. 弹窗二次确认 (防止误删)
      this.$dialog.confirm({
        title: '确认删除',
        message: `确定要永久删除卡号 ${this.cardInfo.cardNum.num} 吗？\n删除后数据将无法恢复！`,
        confirmButtonColor: '#ed3036'
      }).then(async () => {
        try {
          this.$toast.loading({ message: '正在删除...', forbidClick: true });
          
          // 4. 调用删除接口
          const res = await Delcard({ kid: kid });
          
          this.$toast.clear();
          
          if (res.code === 200) {
            this.$toast.success("删除成功");
            // 5. 删除成功后，返回上一页（福利卡列表页会自动刷新）
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$toast.fail(res.msg || "删除失败");
          }
        } catch (error) {
          this.$toast.clear();
          console.error("删除异常:", error);
          this.$toast.fail("网络异常，请稍后重试");
        }
      }).catch(() => {
        // 用户点击取消，什么都不做
        console.log("用户取消了删除操作");
      });
    },
    goAllRecords() {
      this.$router.push({
        path: "/RightsRecorddetails",
        query: { khid: this.$route.query.cardid}
      });
    }
  }
}
</script>
<style scoped>
/* 样式与您之前保持一致即可，无需修改 */
.page-container {
  min-height: 100vh;
  background-color: #fff;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: #fff;
}

.nav-bar .close-btn {
  font-size: 22px;
  color: #333;
  cursor: pointer;
}

.nav-bar .nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.nav-bar .more-btn {
  font-size: 20px;
  color: #333;
  letter-spacing: 2px;
  cursor: pointer;
}

.card-container {
  padding: 10px 10px 0 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

 /*  */
/* ================= 卡片容器 ================= */
.black-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 120px;
  background: url(../../assets/lhbg.png) no-repeat;
  background-size: cover; /* 让背景图完全覆盖卡片 */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  color: #333; /* 修改文字颜色为深色（因为背景图是浅粉色） */
}

/* 卡片内部依然保留原来的水印装饰 */
.black-card .card-bg-pattern {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 20px solid rgba(255, 255, 255, 0.03);
  pointer-events: none;
}

.black-card .card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
}

.black-card .card-top .card-title-group .card-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 4px;
  color: #333;
}

.black-card .card-top .card-title-group .card-number {
  font-size: 12px;
  color: #666; /* 修改为灰蓝色调 */
  margin-top: 18px;
}

.black-card .card-top .use-btn {
  background: #eab978;
  color: #1c1c1e;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
      position: relative;
    top: 19px;
}

.black-card .card-top .use-btn .arrow {
  margin-left: 4px;
  font-size: 16px;
  line-height: 1;
}

.black-card .card-bottom {
  display: flex;
  align-items: flex-end;
  z-index: 2;
}

.black-card .card-bottom .info-item {
  margin-right: 40px;
}

.black-card .card-bottom .info-item .label {
  font-size: 12px;
  color: #666; /* 修改为深灰色 */
  margin-bottom: 2px;
}

.black-card .card-bottom .info-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #333; /* 修改为深色 */
}
 /*  */
.action-row {
  display: flex;
  align-items: center;
  padding: 0 16px 16px 16px;
}

.action-row .action-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.action-row .action-item i {
  font-style: normal;
  margin-right: 6px;
  font-size: 16px;
  color: #333;
}

.action-row .divider {
  width: 1px;
  height: 16px;
  background: #e0e0e0;
}

.transaction-section {
  padding: 0 16px 40px 16px;
}

.transaction-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.transaction-section .section-header .title {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.transaction-section .section-header .more-link {
  font-size: 13px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.transaction-section .section-header .more-link .arrow {
  margin-left: 4px;
  font-size: 14px;
}

.transaction-section .list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f8f8f8;
}

.transaction-section .list-item:last-child {
  border-bottom: none;
}

.transaction-section .list-item .info-left {
  display: flex;
  flex-direction: column;
}

.transaction-section .list-item .info-left .type-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.transaction-section .list-item .info-left .time {
  font-size: 12px;
  color: #b3b3b3;
}

.transaction-section .list-item .amount-right {
  font-size: 15px;
  color: #333;
  font-weight: 400;
}

.transaction-section .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.transaction-section .empty-state .empty-img-box {
  margin-bottom: 20px;
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-section .empty-state .empty-img-box .icon-card-placeholder {
  width: 80%;
  height: 80%;
  background: #f5f6fa;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.02);
}

.transaction-section .empty-state .empty-img-box .icon-card-placeholder::after {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #ddd;
  border-radius: 50%;
  box-shadow: -8px 0 0 #d0d0d0;
}

.transaction-section .empty-state .empty-text {
  font-size: 14px;
  color: #c0c0c0;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
</style>