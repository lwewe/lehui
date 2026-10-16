<template>
  <div class="logistics-page">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- ★ 加载中提示 -->
    <div class="loading-tip" v-if="loadingflag">
      <van-loading size="20" vertical>加载中...</van-loading>
    </div>

    <!-- ★ 内容区域：加载完成后才显示 -->
    <template v-else>
      <!-- 顶部快递信息 -->
      <div class="express-card">
        <div class="express-header">
          <div class="express-name">
            <span>{{ expressCompany || '暂无快递公司' }}</span>
          </div>

          <div class="express-no" v-if="logisticsNo" @click="copyLogisticsNo">
            {{ logisticsNo }}
            <span class="copy-btn" @click.stop="copyLogisticsNo">复制</span>
          </div>
          <div class="express-no empty" v-else>暂无快递单号</div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="address-card">
        <div class="address-icon">收</div>
        <div class="address-content">
          <div class="address-title">收货地址:{{ deliveryInfo.detail || address.addr || '暂无地址' }} </div>
          <div class="address-detail">
            {{ deliveryInfo.name || address.name || '' }}
            {{ deliveryInfo.phone || address.phone || '' }}
          </div>
        </div>
      </div>

      <!-- 物流轨迹 -->
      <div class="logistics-timeline">
        <template v-if="logisticsList.length">
          <div class="timeline-item" v-for="(item, index) in logisticsList" :key="index"
            :class="{ 'is-first': index === 0 }">
            <div class="timeline-line">
              <div class="timeline-dot" :class="{ active: index === 0 }"></div>
              <div class="timeline-bar" v-if="index !== logisticsList.length - 1"></div>
            </div>

            <div class="timeline-content">
              <div class="content-text">{{ item.context }}</div>
              <div class="content-time">{{ item.time }}</div>
            </div>
          </div>
        </template>

        <div class="timeline-empty" v-else>
          <van-icon name="logistics" size="40" color="#ddd" />
          <p>暂无物流信息</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { shipLogistics, shipTrace } from "@/api/lhjdtm";

export default {
  name: "ShippingDetail",
  data() {
    return {
      address: {},
      expressCompany: "",
      deliveryInfo: {},
      loadingflag: true,
      logisticsNo: "",
      logisticsList: []
    };
  },
  mounted() {
      window.scrollTo(0, 0); 
    this.address = JSON.parse(this.$route.query.address || '{}');
    this.loadAll();
  },
  methods: {
    // ★ 统一管理加载状态
    async loadAll() {
      this.loadingflag = true;
      try {
        await Promise.all([
          this.getShipLogistics(),
          this.getShipTrace()
        ]);
      } finally {
        this.loadingflag = false;
      }
    },

    async getShipLogistics() {
      try {
        const res = await shipLogistics({ id: this.$route.query.id });
        const data = res.data || {};
        this.logisticsNo = data.express_no || "";
        this.expressCompany = data.express_company || "";
        if (data.delivery) this.deliveryInfo = data.delivery;
      } catch (e) {
        console.error("shipLogistics 失败:", e);
      }
    },

    async getShipTrace() {
      try {
        const res = await shipTrace({ id: this.$route.query.id });
        const data = res.data || {};
        const traces = data.traces || data.items || [];
        this.logisticsList = traces.map(item => ({
          context: item.content || item.context || "",
          time: this.formatTime(item.time)
        }));
        if (data.express_no) this.logisticsNo = data.express_no;
        if (data.express_company) this.expressCompany = data.express_company;
        if (data.delivery) this.deliveryInfo = data.delivery;
      } catch (e) {
        console.error("shipTrace 失败:", e);
        this.logisticsList = [];
      }
    },

    // ★ 时间格式化：2026-09-22T12:23:06.000+08:00 → 2026-09-22 12:23
    formatTime(str) {
      if (!str) return "";
      const d = new Date(str);
      if (isNaN(d.getTime())) return str;
      const pad = n => (n < 10 ? "0" + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },

    copyLogisticsNo() {
      if (!this.logisticsNo) {
        this.$toast("暂无快递单号");
        return;
      }
      const input = document.createElement("textarea");
      input.value = this.logisticsNo;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$toast("复制成功");
    },

    remindShip() {
      this.$toast("已催单，请耐心等待");
    }
  }
};
</script>

<style scoped lang="less">
.logistics-page {
  background-color: #F7F7F8;
  min-height: 100vh;
  padding: 10px;
  padding-bottom: 80px;
  box-sizing: border-box;
}

/* ★ 加载中提示 */
.loading-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  color: #999;
  font-size: 13px;
}

/* 顶部快递信息 */
.express-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;

  .express-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .express-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    font-size: 16px;

    .express-icon {
      width: 24px;
      height: 24px;
      background: #E10602;
      color: #fff;
      border-radius: 4px;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
    }
  }

  .express-no {
    font-size: 13px;
    color: #666;

    &.empty {
      color: #bbb;
      cursor: default;
    }

    .copy-btn {
      color: #409eff;
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .remind-btn {
    position: absolute;
    bottom: 15px;
    right: 15px;
    border: 1px solid #DC4F4E;
    color: #DC4F4E;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
  }
}

/* 收货地址 */
.address-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .address-icon {
    width: 34px;
    margin-top: 2px;
    height: 34px;
    border-radius: 50px;
    background-color: #f3eded;
    text-align: center;
    line-height: 34px;
    flex-shrink: 0;
  }

  .address-content {
    .address-title {
      font-weight: bold;
      font-size: 15px;
    }

    .address-detail {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
    }
  }
}

/* 预计送达 */
.delivery-predict {
  background: #FFF4E5;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #FF8000;
}

/* 物流轨迹 */
.logistics-timeline {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;

  .timeline-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    position: relative;

    .timeline-line {
      width: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 12px;
      position: relative;

      .timeline-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ddd;
        flex-shrink: 0;
        margin-top: 3px;

        &.active {
          width: 14px;
          height: 14px;
          background-color: #DC4F4E;
          box-shadow: 0 0 0 3px rgba(220, 79, 78, 0.2);
        }
      }

      .timeline-bar {
        position: absolute;
        top: 20px;
        width: 2px;
        height: 100%;
        background-color: #ddd;
      }
    }

    .timeline-content {
      flex: 1;
      padding-bottom: 25px;

      .content-text {
        font-size: 14px;
        color: #333;
        line-height: 1.5;
      }

      .content-time {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }

    &.is-first {
      .content-text {
        color: #DC4F4E;
        font-weight: bold;
      }
    }
  }

  .timeline-empty {
    padding: 30px 0;
    text-align: center;
    color: #999;
    font-size: 13px;

    p {
      margin: 10px 0 0;
    }
  }
}

/* 底部提示 */
.bottom-tip {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>