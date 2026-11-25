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
      <!-- 顶部快递信息：支持多包裹 -->
      <div class="express-card">
        <div class="express-header">
          <div class="express-name">
            <span>
              {{ expressList.length > 1 ? `共${expressList.length}个包裹` : (expressCompany || '暂无快递公司') }}
            </span>
            <span v-if="thirdPartyStatus" class="express-status-tip">{{ thirdPartyStatus }}</span>
          </div>
        </div>

        <div class="express-list" v-if="expressList.length">
          <div class="express-item" v-for="(exp, idx) in expressList" :key="idx"
            :class="{ active: activeExpressNo  === exp.express_no }">
            <div class="express-item-left">
              <span class="express-item-company">{{ exp.express_company || '快递' }}</span>
              <span class="express-item-no" @click="copyLogisticsNo(exp.express_no)">{{ exp.express_no }}</span>
            </div>
            <!-- 多个包裹才显示"查看物流"，单包裹时下方轨迹就是唯一的，无需切换 -->
            <span v-if="expressList.length > 1" class="view-logistics-btn" @click.stop="selectPackage(exp)">
              查看物流
            </span>
          </div>
        </div>



        <div class="express-no empty" v-else>暂无快递单号</div>
      </div>

      <!-- 收货地址 -->
      <div class="address-card">
        <div class="address-icon">收</div>
        <div class="address-content">
          <div class="address-title">收货地址:{{ deliveryInfo.detail || address.addr || '暂无地址' }}</div>
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
      allTraces: [],         // 所有原始轨迹
      currentExpressNo: "",  // 当前查看的包裹单号；空=默认第一个
      expressList: [],
      thirdPartyStatus: ""
    };
  },
  computed: {
    activeExpressNo() {
    return this.currentExpressNo || (this.expressList[0] && this.expressList[0].express_no) || '';
  },
    // 单包裹显示全部；多包裹按选中包裹过滤（默认第一个）
    logisticsList() {
      const multi = this.expressList.length > 1;
      const target = this.currentExpressNo || (this.expressList[0] && this.expressList[0].express_no);
      let traces = this.allTraces;
      if (multi && target) {
        const pkgIndex = this.expressList.findIndex(e => e.express_no === target) + 1;
        traces = this.allTraces.filter(t =>
          t.express_no === target || Number(t.package_index) === pkgIndex
        );
      }
      return traces.map(item => ({
        context: item.content || item.context || item.status || "",
        time: this.formatTime(item.time || item.datetime || item.add_time)
      }));
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.address = JSON.parse(this.$route.query.address || '{}');
    this.loadAll();
  },
  methods: {
    async loadAll() {
      this.loadingflag = true;
      try {
        await Promise.all([this.getShipLogistics(), this.getShipTrace()]);
      } finally {
        this.loadingflag = false;
      }
    },
    parseExpressList(data) {
      let list = [];
      let raw = data.express_list;
      if (raw) {
        if (typeof raw === 'string') {
          try { raw = JSON.parse(raw); } catch (e) { raw = null; }
        }
        if (Array.isArray(raw)) list = raw.filter(i => i && i.express_no);
      }
      if (list.length === 0 && data.express_no) {
        list = [{ express_company: data.express_company || '', express_no: data.express_no }];
      }
      const seen = {};
      return list.filter(i => {
        const key = `${i.express_company || ''}__${i.express_no}`;
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    },
    async getShipLogistics() {
      try {
        const res = await shipLogistics({ id: this.$route.query.id });
        const data = res.data || {};
        this.logisticsNo = data.express_no || "";
        this.expressCompany = data.express_company || "";
        this.thirdPartyStatus = data.third_party_status || "";
        this.expressList = this.parseExpressList(data);
        if (data.delivery) this.deliveryInfo = data.delivery;
      } catch (e) {
        console.error("shipLogistics 失败:", e);
      }
    },
    // 切换查看的包裹
    selectPackage(exp) {
      this.currentExpressNo = exp.express_no;
    },
    async getShipTrace() {
      try {
        const res = await shipTrace({ id: this.$route.query.id });
        const data = res.data || {};
        let traces = [];
        if (Array.isArray(data.traces) && data.traces.length) {
          traces = data.traces;
        } else if (Array.isArray(data.items) && data.items.length) {
          traces = data.items;
        } else if (Array.isArray(data.express_list)) {
          data.express_list.forEach(exp => {
            if (Array.isArray(exp.traces)) {
              exp.traces.forEach(t => {
                traces.push({ ...t, express_company: exp.express_company, express_no: exp.express_no });
              });
            }
          });
        }
        this.allTraces = traces;   // 只存原始轨迹，过滤交给 computed
        if (data.express_no) this.logisticsNo = data.express_no;
        if (data.express_company) this.expressCompany = data.express_company;
        if (data.third_party_status) this.thirdPartyStatus = data.third_party_status;
        if (data.delivery) this.deliveryInfo = data.delivery;
        if (data.express_list) this.expressList = this.parseExpressList(data);
      } catch (e) {
        console.error("shipTrace 失败:", e);
        this.allTraces = [];
      }
    },
    formatTime(str) {
      if (!str) return "";
      let d;
      if (typeof str === 'number') {
        d = new Date(str < 1e12 ? str * 1000 : str);
      } else if (/^\d+$/.test(String(str))) {
        const n = Number(str);
        d = new Date(n < 1e12 ? n * 1000 : n);
      } else {
        d = new Date(String(str).replace(/-/g, '/'));
      }
      if (isNaN(d.getTime())) return String(str);
      const pad = n => (n < 10 ? "0" + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
    copyLogisticsNo(no) {
      const text = no || this.logisticsNo;
      if (!text) { this.$toast("暂无快递单号"); return; }
      const input = document.createElement("textarea");
      input.value = text;
      input.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
      document.body.appendChild(input);
      input.select();
      try { document.execCommand("copy"); this.$toast("复制成功"); }
      catch (e) { this.$toast("复制失败，请长按手动复制"); }
      document.body.removeChild(input);
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
    gap: 6px;
    font-weight: bold;
    font-size: 16px;

    .express-status-tip {
      font-size: 12px;
      font-weight: normal;
      color: #999;
    }
  }

  .express-list {
    margin-top: 12px;

    .express-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-top: 1px solid #f0f0f0;

      &:first-child {
        border-top: none;
      }

     

      .express-item-left {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        min-width: 0;

        .express-item-company {
          color: #333;
          white-space: nowrap;
        }

        .express-item-no {
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
      }

      .view-logistics-btn {
        color: #666666;
        font-size: 12px;
        cursor: pointer;
        flex-shrink: 0;
        padding: 2px 10px;
        border: 1px solid #d1d1d1;
        border-radius: 14px;
      }


       &.active {
       .view-logistics-btn {
        color: #DC4F4E;
        
        border: 1px solid #DC4F4E;
       
      }

      }
    }
  }

  .express-no {
    font-size: 13px;
    color: #666;

    &.empty {
      margin-top: 10px;
      color: #bbb;
      cursor: default;
    }
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

/* 物流轨迹 */
.logistics-timeline {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;

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
</style>