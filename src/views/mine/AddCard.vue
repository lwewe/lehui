<template>
  <div class="securitycards">
    <!-- 顶部返回 -->
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(0,0,0,0.3)'" v-if="!change"></ReturnBack>

    <!-- Tab 切换：只用 v-model 改变 active 变量 -->
    <van-tabs :line-width="20" v-model="active" color="#ed3036">
      <van-tab title="可使用"></van-tab>
      <van-tab title="不可用"></van-tab>
      <van-tab title="卡合并"></van-tab>
    </van-tabs>

    <div class="main-wrapper">
      
      <!-- 卡合并提示区 -->
      <div v-if="active == 2" class="merge-notice">
        <div class="notice-icon">!</div>
        <div class="notice-text">温馨提示：只适用于同类卡进行合并，合并后有效期为最长有效期，余额为相加总金额。</div>
      </div>

      <!-- 标题栏 -->
      <div v-if="active == 2" class="section-title">卡片管理</div>

      <!-- 列表区域 -->
      <div class="card-list-container">
        <div v-if="active == 0" class="bind-new-card-btn" @click="gobindingCard">
          <span class="plus-icon">+</span> 绑定新卡
        </div>
        <Loading v-if="isloading" />

        <!-- 卡片渲染 -->
        <div class="card-item-wrap" v-for="(item, index) in list" :key="index">
          
          <!-- 合并模式：右上角选择按钮 -->
          <div v-if="active == 2" class="select-btn" :class="{ selected: item.isCheckout }" @click="toggleCard(item)">
            {{ item.isCheckout ? '已选择' : '选择' }}
          </div>

          <!-- 卡片主体 -->
          <div class="card-main" :class="{ 'card-disabled': active == 1 || (item.disabled && active != 0) }" @click="gocardinfo(item)">
            <div class="card-left">
              <div class="card-name">
                乐汇卡
                <span v-if="active == 1" class="status-tag">已失效</span>
              </div>
              <div class="card-number">{{ item.num }}</div>
              <div class="card-info-row">
                <div class="info-col">
                  <span class="info-label">余额(点)</span>
                  <span class="info-val">{{ item.price }}</span>
                </div>
                <div class="info-col">
                  <span class="info-label">有效期</span>
                  <span class="info-val">{{ timestampToTime(item.end_time) }}</span>
                </div>
              </div>
            </div>
            <div class="card-right">
              <button class="use-btn" :class="{ 'btn-disabled': active == 1 }" @click.stop="go(item.pid)" :disabled="active == 1">
                {{ active == 1 ? '已失效' : '立即使用' }}
              </button>
              <div class="rights-link" @click.stop="RightsRecord(item)">
                <span>查看权益</span>
                <span class="arrow-icon">›</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据提示 -->
        <div v-if="list.length === 0 && !isloading" class="empty-tip">
          暂无{{ active == 0 ? '可用' : active == 1 ? '不可用' : '' }}卡片
        </div>
      </div>
    </div>

    <!-- 底部合并按钮 (仅卡合并模式显示) -->
    <div class="merge-footer" v-if="active == 2 && list.length > 0">
      <div class="merge-btn" :class="{ 'can-merge': selectedCount > 1 }" @click="mergecards">
        合并 <span v-if="selectedCount > 0">({{ selectedCount }})</span>
      </div>
    </div>

    <NProgress v-if="loadingflag" />
  </div>
</template>

<script>
import { CardLists, CardNucard, CheckmerGecards, MerGecards } from "@/api/lhcard";
import Loading from "@/components/loding.vue";

export default {
  name: "SecurityCards",
  components: { Loading },
  data() {
    return {
      active: 0, // 0: 可使用, 1: 不可用, 2: 卡合并
      list: [], // 卡片列表
      loadingflag: false,
      isloading: false,
      change: "",
      npid: 1, // 固定为乐汇卡的 pid
      pidsList: [],
    };
  },
  computed: {
    selectedCount() {
      return this.list.filter(item => item.isCheckout).length;
    }
  },
  // 监听 active 的变化，自动刷新数据，而不是通过点击事件去跳转路由
  watch: {
    active(newVal) {
      this.list = [];
      this.fetchData();
    }
  },
  created() {
    this.loadingflag = true;
    this.change = this.$route.query.change || sessionStorage.getItem("change");
    const activeQuery = this.$route.query.active;
    if (activeQuery != undefined) {
      this.active = parseInt(activeQuery);
    }
    this.fetchData();
  },
  methods: {
     gobindingCard() {
      this.$router.push({ path: "/BindingCard" });
    },
    // 获取数据
    async fetchData() {
      this.isloading = true;
      try {
        if (this.active == 0) {
          const res = await CardLists({ flag: 1 });
          if (res.data?.card_list?.length) {
            this.processCardData(res.data.card_list, false);
          }
        } else if (this.active == 1) {
          const res = await CardNucard({});
          if (res.data?.card_list?.length) {
            this.processCardData(res.data.card_list, true);
          }
        } else if (this.active == 2) {
          const [res1, res2] = await Promise.all([
            CardLists({ flag: 1 }),
            CardNucard({})
          ]);
          if (res1.data?.card_list?.length) {
            this.processCardData(res1.data.card_list, false);
          }
          if (res2.data?.card_list?.length) {
            this.processCardData(res2.data.card_list, true);
          }
        }
      } catch (e) {
        console.error("数据加载异常:", e);
        this.$toast("数据加载异常，请稍后重试");
      } finally {
        this.loadingflag = false;
        this.isloading = false;
      }
    },
    // 处理数据
    processCardData(card_list, isDisabled = false) {
      card_list.forEach(item => {
        this.list.push({
          ...item,
          isCheckout: false,
          disabled: isDisabled
        });
      });
    },
    // 点击进入详情
    gocardinfo(item) {
      this.$router.push({
        path: "/RightsRecord",
        query: { id: item.pid, cardid: item.id, cardName: "乐汇卡" }
      });
    },
    // 权益查看
    RightsRecord(item) {
      console.log("查看权益:", item);
    },
    // 合并模式：勾选/取消卡片
    toggleCard(item) {
      item.isCheckout = !item.isCheckout;
      if (item.isCheckout) {
        this.pidsList.push(item.pid);
        // 判定只可合并同类卡
        if (this.pidsList.length > 1 && !this.pidsList.every(pid => pid === this.pidsList[0])) {
          this.pidsList.pop();
          this.$toast({ message: "只可合并同一类型的卡", className: "type-error-toast" });
          item.isCheckout = false;
          return;
        }
        this.npid = item.pid;
      } else {
        const idx = this.pidsList.indexOf(item.pid);
        if (idx > -1) this.pidsList.splice(idx, 1);
      }
    },
    // 执行合并
        // 执行合并
    async mergecards() {
      try {
        if (this.selectedCount < 2) {
          this.$toast("请选择至少两张卡进行合并");
          return;
        }
        const ids = this.list.filter(i => i.isCheckout).map(i => i.id).join(",");
        const res = await CheckmerGecards({ fulika: ids, pid: this.npid });
        if (res.code == 200 && res.data) {
          
          // 1. 先计算合并后的总金额
          // const totalAmount = Number(res.data.del_ka_price) + Number(res.data.hb_ka_price);
const totalAmount = (Number(res.data.del_ka_price) + Number(res.data.hb_ka_price)).toFixed(2);
          // 2. 简单明了的原生纯文本弹窗提示
          this.$dialog.confirm({
            message: `即将删除 ${res.data.del_ka_str}, 金额合并到 ${res.data.hb_ka_str}, 合并之后的金额为 ${totalAmount}`,
            confirmButtonColor: '#ed3036'
          }).then(async () => {
            const mergeRes = await MerGecards({ fulika: ids, pid: this.npid, code: res.data.code });
            this.$toast(mergeRes.msg);
            if (mergeRes.code == 200) {
              this.list = [];
              this.fetchData(); // 刷新列表
              this.pidsList = [];
            }
          }).catch(() => {});
        } else {
          this.$toast(res.msg);
        }
      } catch (e) {
        console.error("合并过程出现异常:", e);
        this.$toast("合并操作异常，请重试");
      }
    },
    // 跳转绑卡
    gobindingCard() {
      this.$router.push({ path: "/bindingCard" });
    },
    // 时间戳转日期
    timestampToTime(time) {
      if (!time) return '';
      const d = new Date(time * 1000);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    // 跳转使用
    go(pid) {
      this.$router.push({ path: "/index" });
      // window.location.href = this.$store.state.shopUrl + "/index?token=" + localStorage.getItem("token") + "&full=0";
    }
  }
};
</script>

<style scoped>
.securitycards {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.securitycards ::v-deep .van-tabs__line {
  background-color: #ed3036;
}
.securitycards ::v-deep .van-tab--active {
  font-weight: bold;
  font-size: 15px;
}

.main-wrapper {
  padding: 10px 16px;
}

/* ================= 合并提示区 ================= */
.merge-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8f0;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #ffe0b2;
}
.notice-icon {
  width: 18px;
  height: 18px;
  background: #ed3036;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}
.notice-text {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* ================= 标题栏 ================= */
.section-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 10px 0 14px 0;
}

/* ================= 卡片通用布局 ================= */
.card-item-wrap {
  position: relative;
  margin-bottom: 14px;
}

/* 合并按钮 */
.select-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fca5a5;
  color: #fff;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 10;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.select-btn.selected {
  background: #dc2626;
}

/* 卡片主体 */
.card-main {
  display: flex;
  border-radius: 12px;
  padding: 16px;
  height: 130px;
  background:url(../../assets/lhbg.png) no-repeat; 
  background-size: cover;
  /* 统一粉色乐汇卡 */
  color: #333;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  cursor: pointer;
}
.card-main::after {
  content: '';
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  pointer-events: none;
}

/* 不可用卡片的半透明和禁用态 */
.card-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-tag {
  font-size: 11px;
  background: rgba(0,0,0,0.08);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
  color: #666;
}

.card-left { flex: 2; display: flex; flex-direction: column; justify-content: space-between; z-index: 2; }
.card-name { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
.card-number { font-size: 12px; opacity: 0.7; margin-top: 2px; }
.card-info-row { display: flex; gap: 20px; margin-top: 10px; }
.info-col { display: flex; flex-direction: column; }
.info-label { font-size: 10px; opacity: 0.7; }
.info-val { font-size: 15px; font-weight: bold; margin-top: 2px; }

.card-right { flex: 1; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; z-index: 2; }
.use-btn {
  background: #eab978;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #1c1c1e;;
  cursor: pointer;
  position: relative;
    top: 19px;
}
.btn-disabled {
  background: #e0e0e0 !important;
  color: #999 !important;
  cursor: not-allowed;
}
.use-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.rights-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  opacity: 0.7;
  cursor: pointer;
}

/* ================= 空状态 ================= */
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}

/* ================= 底部合并按钮 ================= */
.merge-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 0;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  display: flex;
  justify-content: center;
  z-index: 99;
}
.merge-btn {
  background: #fca5a5;
  color: #fff;
  padding: 10px 40px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.merge-btn.can-merge {
  background: #dc2626;
}

/* Toast 样式 */
.type-error-toast {
  background: #222 !important;
  color: #fff !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  padding: 12px 20px !important;
}

/* ================= 绑定新卡按钮 ================= */
.bind-new-card-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 30px;
  border: 1.5px solid #ed3036;
  background: #ffffff;
  color: #ed3036;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.bind-new-card-btn .plus-icon {
  font-size: 22px;
  line-height: 1;
}

/*  */

</style>