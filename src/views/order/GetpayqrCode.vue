<template>
  <div class="pay-code-page">
    <NProgress v-if="loading" />

    <!-- 顶部门店卡片 -->
    <div class="store-card">
      <div class="store-header">
        <div class="store-logo">
          <img :src="brandLogo || require('@/assets/newico/tp.png')" alt="" />
        </div>
        <div class="store-info">
          <div class="row"><span style="color: #9F9D9D;">品牌名称：</span>{{ brandName }}</div>
          <div class="row"><span style="color: #9F9D9D;">门店地址：</span>{{ shopName }}</div>
        </div>
      </div>
      <div class="store-current">
        <div class="current-title">当前门店可用</div>
        <div class="current-address">
          <div class="address-left">
            <span class="title">{{ shopName }}</span>
            <div class="desc"><van-icon name="location-o" /> {{ address }}</div>
          </div>
          <div class="distance" v-if="distance">距离直线约<br> {{
            Number(distance) >= 1000
              ? (Number(distance) / 1000).toFixed(2) + 'km'
              : Number(distance).toFixed(0) + 'm'
          }}</div>
        </div>
      </div>
    </div>

    <!-- 提示条 -->
    <div class="notice-bar">
      <van-icon name="volume-o" color="#F99E9B" />
      <span v-if="brandName == '泸溪河' || brandName == '85度c'">请告知门店使用【HX福利/第三方渠道】扫码收款</span>
      <span v-else>请告知门店使用【悦享福利/第三方渠道】扫码收款</span>
    </div>

    <!-- 付款码核心展示区 -->
    <div class="pay-code-card">
      <div class="card-title">
        <span>
          <van-icon name="replay" class="icon-refresh" @click="getCode" /> 付款码
        </span>

        <span>可用金额：{{ balances }}</span>
      </div>

      <div v-if="payCode" class="code-container">



        <!-- 轻触可查看数字的提示 -->
        <div class="tip-text" @click="showNumberCode">
          <van-icon name="hand-up" /> 轻触可查看数字
        </div>

        <!-- 二维码区域（纯本地 Canvas 绘制，不会出现灰块） -->
        <div class="qrcode-box" @click="showNumberCode">
          <canvas id="qrCanvas" width="160" height="160" style="display: block;"></canvas>
        </div>

        <!-- 底部倒计时 -->
        <div class="countdown">剩余有效时间：{{ countdown }} 秒</div>
      </div>

      <div class="empty-box" v-else-if="!loading">
        正在获取付款码...
      </div>
    </div>

    <!-- 🚨 新增：底部消费记录卡片（完全还原截图） -->
    <div class="history-card">
      <div class="history-header">
        <div class="title">
          <van-icon name="balance-o" style="font-size: 18px;" /> 消费记录
        </div>
        <div class="more" @click="moreOrder()">查看更多 <van-icon name="arrow" /></div>
      </div>
      <div class="order-list" v-if="orderList.length > 0">
        <div class="order-item" v-for="(item, index) in orderList" :key="item.id">
          <div class="item-left">
            <div class="shop-name">{{ item.brandName }} </div>
            <!-- <div><span style="color: #666666;font-size: 12px;">{{ item.shopName }}</span></div> -->
            <div class="order-time">{{ formatTime(item.add_time) }}</div>
          </div>
          <div class="item-right">
            <div class="price"><span style="font-size: 12px;">¥</span>{{ item.total_fee }}</div>
            <div class="status" :class="'status-' + item.orderstatus">
              {{ getOrderStatusText(item.orderstatus) }}
            </div>
          </div>
        </div>
        <!-- 如果有更多数据，可以在这里加个加载更多或者查看更多 -->
      </div>

      <!-- 无数据时展示空状态 -->
      <div class="empty-history" v-else>
        <img src="https://b.yzcdn.cn/vant/empty-image-default.png" alt="" />
        <p>没有消费记录</p>
      </div>
    </div>

  </div>
</template>

 <script>
  import { getQrcode, getOrderList } from '@/api/lehuicake'
import QRCode from 'qrcode';
export default {
  data() {
    return {
      balances: '',
      orderList: [],
      loading: true,
      isFetchingCode: false, // 防止重复请求的锁
      brandId: '',
      brandIds: '',
      shopId: '',
      brandName: '未命名品牌',
      shopName: '未命名门店',
      brandLogo: '',
      address: '',
      distance: '',
      validEndTime: 0, // 记录接口返回的真实过期时间

      payCode: '',
      validSeconds: 120,
      countdown: 120,
      timer: null,

      barcodeBars: []
    }
  },
  created() {
    const query = this.$route.query;
    this.brandId = query.brandId || '';
    this.brandIds = query.brandIds || '';
    this.shopId = query.shopId || '';
    this.brandName = query.brandName || '未命名品牌';
    this.shopName = query.shopName || '未命名门店';
    this.address = query.address || '暂无地址';
    this.distance = query.distance || '';
    this.brandLogo = query.brandLogo || '';

    this.getCode();
    this.getOrderList();
  },
  
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    moreOrder() {
      this.$router.push({ path: "/GetpayqrCodeorder", query: { brandId: this.brandIds } })
    },
    getOrderList() {
      const params = {
        pageno: 1,
        pagesize: 10,
        brand_id: this.brandIds 
      };
      getOrderList(params).then(res => {
        if (res.code == 200) {
          this.orderList = res.data.data || [];
        } else {
          this.orderList = [];
        }
      }).catch(err => {
        console.error('获取订单列表失败', err);
        this.orderList = [];
      });
    },

    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(Number(timeStr) * 1000);
      const Y = date.getFullYear();
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
      const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      return `${Y}-${M}-${D} ${h}:${m}`;
    },

    getOrderStatusText(status) {
      const statusMap = {
        '0': '待付款',
        '2': '支付成功',
        '4': '部分退款',
        '5': '已取消'
      };
      return statusMap[status] || '未知状态';
    },

        getCode() {
      if (!this.brandId || !this.shopId) {
        this.$toast('缺少门店信息');
        this.loading = false;
        return;
      }

      // 防止疯狂点击刷新
      if (this.isFetchingCode) return;
      this.isFetchingCode = true;
      this.loading = true;

      getQrcode({
        brandId: this.brandIds,
        shopId: this.brandId
      }).then(res => {
        this.loading = false;
        this.isFetchingCode = false;
        
        if (res.code == 200 && res.data) {
          const rawCode = res.data.code;

          // 🚨 核心逻辑：如果是对象，直接 JSON.stringify 整个塞进去；如果是字符串，直接塞
          if (typeof rawCode === 'object' && rawCode !== null) {
            this.payCode = JSON.stringify(rawCode);
          } else {
            this.payCode = String(rawCode);
          }

          // 处理有效期，兼容没有 validSeconds 的情况
          this.validSeconds = Number(res.data.validSeconds) || 240;
          // 🚨 记录接口的结束时间，用来做精准倒计时
          this.validEndTime = res.data.validEndTime ? Number(res.data.validEndTime) : 0;
          this.balances = res.data.balance;

          this.generateBarcode(this.payCode);
          this.startCountdown();

          // 渲染本地二维码
          this.$nextTick(() => {
            this.drawCanvasQRCode(this.payCode);
          });

        } else {
          this.$toast(res.msg || '获取付款码失败');
        }
      }).catch(() => {
        this.loading = false;
        this.isFetchingCode = false;
        this.$toast('网络异常，请重试');
      });
    },

    showNumberCode() {
      if (!this.payCode) return;
      // 显示时也原样展示
      this.$dialog.alert({
        title: '付款数字码',
        message: `<div style="font-size: 16px; font-weight: bold; color: #333; letter-spacing: 1px; text-align: left; padding: 10px 0; word-break: break-all;">${this.payCode}</div>`,
        confirmButtonText: '我知道了',
        confirmButtonColor: '#F99E9B'
      });
    },

    generateBarcode(code) {
      let bars = [];
      for (let i = 0; i < code.length; i++) {
        let num = parseInt(code[i]);
        bars.push(num % 3 + 1);
        bars.push(num % 2 + 1);
        bars.push(num % 4 + 1);
      }
      this.barcodeBars = bars;
    },

    drawCanvasQRCode(code) {
      const canvas = document.getElementById('qrCanvas');
      if (!canvas) return;
      
      // 每次生成前清空画布
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      QRCode.toCanvas(canvas, code, {
        width: 160,
        margin: 1, 
        color: {
          dark: '#000000',  
          light: '#ffffff'  
        }
      }, function (error) {
        if (error) {
          console.error('二维码生成失败:', error);
        }
      });
    },

       startCountdown() {
      if (this.timer) clearInterval(this.timer);

      // 🚨 优先使用接口返回的 validEndTime (毫秒级时间戳)
      // 如果接口没给，才用当前时间 + validSeconds 兜底
      const endTime = this.validEndTime > 0 
        ? this.validEndTime 
        : (Date.now() + this.validSeconds * 1000);

      // 先初始化一下显示
      this.countdown = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      this.timer = setInterval(() => {
        const now = Date.now();
        // 计算剩余的秒数
        this.countdown = Math.max(0, Math.floor((endTime - now) / 1000));

        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.getCode(); // 倒计时结束，自动刷新
        }
      }, 1000);
    },
  }
}
</script>
<style>
.address-left .van-icon {
  color: #EB6A73;
  position: relative;
  top: 2px;
  font-weight: bold;
}
</style>
<style scoped lang="less">
.pay-code-page {
  min-height: 100vh;
  background-color: #F99E9B;
  padding: 12px;
  box-sizing: border-box;
}

/* 顶部门店卡片 */
.store-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;

  .store-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 12px;

    .store-logo {
      width: 60px;
      height: 60px;
      background: #F5F5F5;
      border-radius: 8px;
      margin-right: 15px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 80%;
        height: 80%;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .store-info {
      .row {
        font-size: 14px;
        color: #333;
        margin-bottom: 6px;
      }
    }
  }

  .store-current {
    margin-top: 12px;

    .current-title {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }

    .current-address {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .address-left {
        .title {
          font-size: 15px;
          font-weight: bold;
          color: #333;
        }

        .desc {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
      }

      .distance {
        font-size: 12px;
        color: #EB6A73;
        text-align: center;
        width: 80px;
      }
    }
  }
}

/* 提示条 */
.notice-bar {
  background: #ffffff;
  color: #EB6A73;
  font-size: 13px;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

/* 付款码卡片 */
.pay-code-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  // min-height: 480px;

  .card-title {
    // align-self: flex-start;
    font-size: 15px;
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    justify-content: space-between;
    width: 100%;

    .icon-refresh {
      font-size: 18px;
      color: #F99E9B;
      cursor: pointer;
      transition: transform 0.3s;

      &:active {
        transform: rotate(180deg);
      }
    }
  }

  .code-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .barcode-box {
    width: 90%;
    height: 70px;
    background: #F8F8F8;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;

    .bar {
      height: 50px;
      background-color: #333;
      margin: 0 1px;
    }

    .bar:nth-child(even) {
      background-color: transparent;
    }
  }

  .tip-text {
    font-size: 12px;
    color: #F99E9B;
    margin: 15px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .qrcode-box {
    width: 180px;
    height: 180px;
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    border: 1px solid #eee;
    cursor: pointer;
  }

  .countdown {
    font-size: 14px;
    color: #F99E9B;
    background: #FFF1F1;
    display: inline-block;
    padding: 4px 15px;
    border-radius: 20px;
  }

  .empty-box {
    color: #999;
    font-size: 14px;
    margin-top: 40px;
  }
}

/* 🚨 新增：消费记录卡片样式 */
.history-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 12px;

    .title {
      font-size: 15px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .more {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .empty-history {
    text-align: center;
    padding: 40px 0 20px 0;

    img {
      width: 120px;
      opacity: 0.8;
    }

    p {
      font-size: 13px;
      color: #999;
      margin-top: 15px;
    }
  }
}


/* 订单列表样式 */
.order-list {
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-left {
      .shop-name {
        font-size: 14px;
        color: #000000;
        margin-bottom: 4px;

      }

      .order-time {
        font-size: 12px;
        color: #999;
      }
    }

    .item-right {
      text-align: right;

      .price {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
      }

      .status {
        font-size: 12px;

        &.status-0 {
          color: #FF9800;
        }

        /* 待付款 */
        &.status-2 {
          color: #4CAF50;
        }

        /* 支付成功 */
        &.status-4 {
          color: #E91E63;
        }

        /* 部分退款 */
        &.status-5 {
          color: #999;
        }

        /* 已取消 */
      }
    }
  }
}
</style>