<template>
  <div class="tuhu-zone-page">
    <!-- 1. 顶部 Banner -->
    <div class="top-banner-area">
      <div style="padding: 10px;">
        <img class="banner-img" :src="bannerImg" alt="途虎养车Banner" />
      </div>
    </div>

    <!-- 2. 入口提示（来自 tuhuGetConfig.notice） -->
    <div class="notice-bar" v-if="entryConfig.notice">
      <span class="notice-icon">!</span>
      <span class="notice-text">{{ entryConfig.notice }}</span>
    </div>

    <!-- 3. Tab 切换：品牌直充 / 电子卡券 -->
    <div class="tab-container">
      <div class="tab-item" :class="{ active: activeTab === 0 }" @click="switchTab(0)">
        品牌直充
        <span class="tab-count" v-if="directCount">{{ directCount }}</span>
      </div>
      <div class="tab-item" :class="{ active: activeTab === 1 }" @click="switchTab(1)">
        电子卡券
        <span class="tab-count" v-if="cardCount">{{ cardCount }}</span>
      </div>
    </div>

    <!-- 4. 搜索栏（可选） -->
    <div class="search-bar">
      <input class="search-input" v-model="keyword" placeholder="搜索途虎商品" @confirm="fetchProducts" />
      <span class="search-btn" @click="fetchProducts">搜索</span>
    </div>

    <!-- 5. 加载骨架 -->
    <div class="skeleton-grid" v-if="loading">
      <div class="skeleton-item" v-for="n in 4" :key="n">
        <div class="skeleton-img"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <!-- 6. 商品列表 -->
    <template v-else>
      <!-- 直充提示条（仅直充 Tab） -->
      <div class="direct-tip" v-if="activeTab === 0 && tuhuList.length">
        <span>💡 点击充值按钮输入充值账号即可充值</span>
      </div>

      <div class="goods-grid">
        <div class="goods-item" v-for="(item, index) in tuhuList" :key="index" @click="handleItemClick(item)">
          <!-- 商品图（无图时用占位） -->
          <!-- 面值块（无图时展示金额） -->
          <div class="goods-img-wrap">
            <div class="face-block">
              <!-- <div class="face-symbol">¥</div> -->
              <div class="face-value">{{ item.item_type_text }}</div>
            </div>
            <!-- 停售遮罩 -->
            <div class="sold-out-mask" v-if="item.status !== 1">停售</div>
          </div>

          <div class="goods-info">
            <div class="goods-name">{{ item.title }}</div>

            <!-- 类型标签 -->
            <div class="tag-row">
              <span class="type-tag" :class="item.item_type === 0 ? 'direct' : 'card'">
                {{ item.item_type === 0 ? '品牌直充' : '电子卡券' }}
              </span>
              <span class="face-tag" v-if="item.face">
                {{ item.face }}
              </span>
            </div>

            <!-- 价格 -->
            <div class="goods-bottom">
              <div class="price-box">
                <span class="symbol">¥</span>
                <span class="price">{{ item.price }}</span>
              </div>
              <div class="add-btn" :class="{ disabled: item.status !== 1 }" @click.stop="handleItemClick(item)">
                {{ item.item_type === 0 ? '充值' : '购买' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-tip" v-if="!tuhuList.length">
        <div class="empty-icon">🛒</div>
        <div class="empty-text">暂无途虎商品</div>
      </div>
    </template>

    <div class="bottom-safe"></div>

    <!-- 7. 下单弹窗 -->
    <div class="order-modal" v-if="showOrderModal" @click.self="closeOrderModal">
      <div class="order-modal-content">
        <div class="modal-title">
          {{ currentItem.item_type === 0 ? '确认充值' : '确认购买' }}
        </div>

        <!-- 商品信息 -->


        <!-- 充值账号 -->
        <div class="modal-field">
          <div class="field-label">
            充值账号
            <span class="required">*</span>
          </div>
          <input class="field-input" v-model="orderUuid" placeholder="请输入充值账号/手机号" />
        </div>

        <!-- 数量（卡券可选，直充固定1） -->


        <!-- 金额汇总 -->
        <div class="modal-summary">
          <span class="summary-label">应付金额</span>
          <span class="summary-price">¥{{ totalPrice }}</span>
        </div>

        <!-- 手续费提示 -->
        <div class="fee-tip" v-if="entryConfig.fee_rate">
          收取 {{ entryConfig.fee_rate }}% 手续费
        </div>
        <div class="sysm">
          <div class="sysm-title">使用说明</div>
          <div class="sysm-content" v-if="hasContent" v-html="entryConfig.content"></div>

          <!-- 接口没有 content，用默认文案 -->
          <div class="sysm-content" v-else>
           💡 请您一定核对充值账号， 充值后不可退。
          </div>

        </div>
        <!-- 按钮 -->
        <div class="modal-btns">
          <button class="btn cancel" @click="closeOrderModal">取消</button>
          <button class="btn confirm" :disabled="submitting" @click="submitOrder">
            {{ submitting ? '提交中...' : '确认下单' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  tuhuGetConfig,
  tuhuProducts,
  tuhuCreateOrder
} from "@/api/tuhu";

import { getIndexList } from "@/api/lhcard";
export default {
  name: "TuHuZone",
  data() {
    return {
      // Banner 与图片兜底
      bannerImg: "",
      defaultBanner:
        "",
      defaultGoodsImg:
        "",

      // Tab
      activeTab: 0,
      keyword: "",

      // 列表
      allList: [],   // 全量（用于 tab 过滤与计数）
      tuhuList: [],  // 当前 Tab 展示
      loading: false,

      // 下单弹窗
      showOrderModal: false,
      currentItem: {},
      orderUuid: "",
      qty: 1,
      submitting: false,

      // 入口配置
      entryConfig: {
        is_open: true,
        fee_rate: "2",
        notice: "",
        login_url: ""
      }
    };
  },

  computed: {
    // 直充数量
    directCount() {
      return this.allList.filter(i => i.item_type === 0).length;
    },
    // 卡券数量
    cardCount() {
      return this.allList.filter(i => i.item_type === 1).length;
    },
    // 总价
    totalPrice() {
      const price = Number(this.currentItem.price || 0);
      return (price * this.qty).toFixed(2);
    }
  },

  methods: {
      getIndex() {
      return getIndexList().then(res => {
        if (res.code == 200) {
         
         const  imgs =   res.data.tubiao.filter(item => item.id == 15)
         console.log('imgs')
         console.log(imgs)
         this.bannerImg =  imgs[0].banner
        }
      })
    },
    // ========== 获取入口配置 ==========
    async fetchConfig() {
      try {
        const res = await tuhuGetConfig();
        if (res.code === 200 && res.data) {
          this.entryConfig = res.data;
          if (res.data.is_open === false) {
            this.$toast && this.$toast("途虎货盘未开通");
            this.$router.replace("/");
          }
        }
      } catch (err) {
        console.error("tuhuGetConfig 失败:", err);
      }
    },

    // ========== 获取商品列表 ==========
    async fetchProducts() {
      console.log("[TuHuZone] fetchProducts 开始");
      this.loading = true;
      try {
        const res = await tuhuProducts({
          product_name: this.keyword,
          page: 1,
          page_size: 50
        });
        console.log("[TuHuZone] tuhuProducts 返回:", JSON.stringify(res));
        if (res.code === 200) {
          const list = (res.data.list || []).map(item => ({
            id: item.item_id,
            title: item.item_name,
            item_type_text: item.item_type_text,
            img: item.img || "",
            price: item.price,
            face: item.item_face,
            item_val: item.item_val,
            item_type: item.item_type,
            status: item.status,
            status_text: item.status_text,
            content: item.content || ""
          }));
          this.allList = list;
          this.applyFilter();
        }
      } catch (err) {
        console.error("[TuHuZone] tuhuProducts 失败:", err);
      } finally {
        this.loading = false;
      }
    },

    // ========== 按 Tab 过滤 ==========
    applyFilter() {
      const type = this.activeTab === 0 ? 0 : 1;
      this.tuhuList = this.allList.filter(i => i.item_type === type);
    },

    // ========== Tab 切换 ==========
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.applyFilter();
    },

    // ========== 点击商品 ==========
    handleItemClick(item) {
      if (item.status !== 1) {
        this.$toast && this.$toast("该商品已停售");
        return;
      }
      // 直充 & 卡券：统一弹出下单弹窗
      this.currentItem = item;
      this.orderUuid = this.orderUuid || "";
      this.qty = 1;
      this.showOrderModal = true;
    },

    // ========== 图片加载失败兜底 ==========
    handleImgError(e) {
      e.target.src = this.defaultGoodsImg;
    },

    // ========== 数量增减 ==========
    increaseQty() {
      if (this.qty >= 99) return;
      this.qty++;
    },
    decreaseQty() {
      if (this.qty <= 1) return;
      this.qty--;
    },

    // ========== 关闭下单弹窗 ==========
    closeOrderModal() {
      if (this.submitting) return;
      this.showOrderModal = false;
      this.currentItem = {};
      this.orderUuid = "";
      this.qty = 1;
    },

    // ========== 提交订单 ==========
    async submitOrder() {
      if (!this.orderUuid) {
        this.$toast && this.$toast("请输入充值账号");
        return;
      }
      // 简单手机号校验（按需调整）
      if (!/^1[3-9]\d{9}$/.test(this.orderUuid) && this.currentItem.item_type === 0) {
        // 直充账号可能不是手机号，这里仅做提示不强制拦截
      }

      this.submitting = true;
      try {
        const res = await tuhuCreateOrder({
          item_id: this.currentItem.id,
          uuid: this.orderUuid,
          amount: 1
        });
        if (res.code === 200) {
          const orderId = res.data.order_id;
          this.showOrderModal = false;
          // 跳转支付页
          this.$router.push({
            path: "/TuHuConfirmOrder",
            query: {
              order_id: orderId, item_name: this.currentItem.title,
              item_face: this.currentItem.face,
              item_price: this.currentItem.price,
              uuid: this.orderUuid
            }
          });
        } else {
          this.$toast && this.$toast(res.msg || "下单失败");
        }
      } catch (err) {
        console.error("tuhuCreateOrder 失败:", err);
        this.$toast && this.$toast("下单失败，请稍后重试");
      } finally {
        this.submitting = false;
      }
    }
  },

  mounted() {
    this.fetchConfig();
    this.getIndex()
    this.fetchProducts();
  }
};
</script>

<style scoped lang="less">
.tuhu-zone-page {
  background: #f7f7f7;
  min-height: 100vh;
}

/* ================= 1. Banner ================= */
.top-banner-area {
  width: 100%;

  .banner-img {
    width: 100%;
    // height: 180px;
    object-fit: cover;
    border-radius: 10px;
    background: #f0f0f0;
    // margin-bottom: 10px;
  }
}

/* ================= 2. 入口提示 ================= */
.notice-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 16px 10px;
  padding: 8px 12px;
  background: #fff7e6;
  border-radius: 8px;
  border-left: 3px solid #ff9500;

  .notice-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ff9500;
    color: #fff;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .notice-text {
    font-size: 12px;
    color: #b36b00;
    line-height: 1.4;
  }
}

/* ================= 3. Tab 切换 ================= */
.tab-container {
  display: flex;
  background: #fff;
  margin: 0 10px 10px;
  border-radius: 0px;
  // padding: 4px;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
    border-radius:0px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &.active {
      background: #ed2e33;
      color: #fff;
      font-weight: 600;
    }

    .tab-count {
      display: inline-block;
      margin-left: 4px;
      font-size: 10px;
      background: rgba(255, 255, 255, 0.3);
      padding: 0 5px;
      border-radius: 8px;
      line-height: 16px;
    }
  }
}

/* ================= 4. 搜索栏 ================= */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 10px 10px;
  padding: 8px 10px;
  background: #fff;
  border-radius: 4px;

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;

    &::placeholder {
      color: #bbb;
    }
  }

  .search-btn {
    font-size: 13px;
    color: #ed2e33;
    font-weight: 500;
    cursor: pointer;
  }
}

/* ================= 5. 直充提示 ================= */
.direct-tip {
  margin: 0 10px 10px;
  font-size: 12px;
  color: #666;
  background: #f0f7ff;
  padding: 8px 10px;
  border-radius: 8px;
}

/* ================= 6. 商品网格 ================= */
.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 10px 60px 10px;

  .goods-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    cursor: pointer;

    .goods-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
      overflow: hidden;

      .goods-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .sold-out-mask {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .goods-info {
      padding: 10px;
    }

    .goods-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.4;
      -webkit-box-orient: vertical;
      // min-height: 39px;
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 8px;
    }

    .type-tag {
      display: inline-block;
      width: max-content;
      border-radius: 2px;
      font-size: 10px;
      line-height: 14px;
      padding: 1px 4px;

      &.direct {
        background-color: #ed2e33;
        color: #fff;
      }

      &.card {
        background-color: #ff9500;
        color: #fff;
      }
    }

    .face-tag {
      display: inline-block;
      font-size: 10px;
      line-height: 14px;
      padding: 1px 4px;
      border-radius: 2px;
      background: #f5f5f5;
      color: #999;
    }

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      color: #d32f2f;

      .symbol {
        font-size: 12px;
        font-weight: bold;
      }

      .price {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .add-btn {
      min-width: 44px;
      height: 24px;
      padding: 0 10px;
      background: #ed2e33;
      color: #fff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;

      &.disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
}

/* ================= 7. 骨架屏 ================= */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;

  .skeleton-item {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    padding-bottom: 10px;

    .skeleton-img {
      width: 100%;
      aspect-ratio: 1/1;
      background: #f0f0f0;
    }

    .skeleton-line {
      height: 12px;
      background: #f0f0f0;
      margin: 10px 10px 0;
      border-radius: 4px;

      &.short {
        width: 50%;
      }
    }
  }
}

/* ================= 8. 空状态 ================= */
.empty-tip {
  text-align: center;
  padding: 60px 0;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
  }
}

.bottom-safe {
  height: 20px;
}

/* ================= 9. 下单弹窗 ================= */
.order-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .order-modal-content {
    background: #fff;
    border-radius: 16px;
    width: 86%;
    max-width: 360px;
    padding: 20px;

    .modal-title {
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 16px;
      color: #333;
    }

    .modal-product {
      display: flex;
      gap: 10px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 10px;
      margin-bottom: 16px;

      .modal-product-img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
        background: #f0f0f0;
        flex-shrink: 0;
      }

      .modal-product-info {
        flex: 1;
        min-width: 0;

        .modal-product-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          -webkit-box-orient: vertical;
        }

        .modal-product-face {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .modal-product-price {
          font-size: 16px;
          font-weight: bold;
          color: #d32f2f;
        }
      }
    }

    .modal-field {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      .field-label {
        width: 90px;
        font-size: 14px;
        color: #666;
        flex-shrink: 0;

        .required {
          color: #ed2e33;
          margin-left: 2px;
        }
      }

      .field-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;
        text-align: right;
        background: transparent;

        &::placeholder {
          color: #bbb;
        }
      }

      .qty-control {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #fff;
          color: #333;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;

          &:active {
            background: #f5f5f5;
          }
        }

        .qty-num {
          min-width: 24px;
          text-align: center;
          font-size: 14px;
          color: #333;
        }
      }
    }

    .modal-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0 6px;

      .summary-label {
        font-size: 14px;
        color: #666;
      }

      .summary-price {
        font-size: 20px;
        font-weight: bold;
        color: #d32f2f;
      }
    }

    .fee-tip {
      font-size: 12px;
      color: #ff9500;
      text-align: right;
      margin-bottom: 4px;
    }

    .modal-btns {
      display: flex;
      gap: 10px;
      margin-top: 16px;

      .btn {
        flex: 1;
        padding: 12px 0;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        cursor: pointer;

        &.cancel {
          background: #f5f5f5;
          color: #666;
        }

        &.confirm {
          background: #ed2e33;
          color: #fff;

          &:disabled {
            background: #f5a5a8;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

/* ================= 面值块 ================= */
.goods-img-wrap {
  .face-block {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #d32f2f;

    .face-symbol {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .face-value {
      font-size: 22px;
      font-weight: bold;
      line-height: 1;
    }
  }
}

/* 弹窗里的小面值块 */
.face-block-small {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d32f2f;
  flex-shrink: 0;

  .face-symbol {
    font-size: 12px;
    font-weight: bold;
  }

  .face-value {
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
  }
}

.sysm {
  margin-top: 12px;
  padding: 10px 12px;
  background: #f9f9f9;
  border-radius: 8px;

  .sysm-title {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .sysm-content {
    font-size: 12px;
    color: #666;
    line-height: 1.6;

    /* ⚠ 穿透 v-html 渲染出来的标签 */
    /deep/ img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 8px 0;
      border-radius: 6px;
    }

    /deep/ p {
      margin: 4px 0;
    }

    /deep/ br {
      line-height: 1.6;
    }

    /deep/ strong {
      color: #333;
    }
  }
}
</style>