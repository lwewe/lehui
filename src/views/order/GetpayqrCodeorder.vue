<template>
  <div class="order-list-page">
    <!-- 顶部导航 (如果你用了 Vant 的 NavBar) -->
    

    <!-- 列表区域 -->
    <div class="list-container">
      <div class="list-item" v-for="(item, index) in orderList" :key="item.id || index">
        <div class="item-left">
          <!-- 如果有品牌名就显示品牌名，没有就显示默认文案 -->
          <div class="title">
            {{ item.brandName ? `${item.brandName}（${item.shopName}）` : '' }}
          </div>
          <div class="time">{{ formatTime(item.add_time) }}</div>
        </div>
                 <div class="item-right">
          <!-- 根据订单状态判断正负号：5代表取消退款，则显示正数；否则显示负数扣款 -->
          <div class="price">
            {{ item.orderstatus == '5' ? '' : '' }}{{ item.total_fee }}
          </div>
          <!-- 🚨 新增：状态文字 -->
          <div class="status" :class="'status-' + item.orderstatus">
            {{ getOrderStatusText(item.orderstatus) }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
       <div class="empty-history" v-if="orderList.length < 1">
         <img src="https://b.yzcdn.cn/vant/empty-image-default.png" alt="" />
        <p>您还没有消费记录</p>
       </div>
    </div>
  </div>
</template>

<script>
 import { getOrderDetail,getOrderList } from '@/api/lehuicake'

export default {
  name: 'OrderList',
  data() {
    return {
      orderList: [],
      loading: false,
      pageno: 1,
      isScroll: false,
      isFetching: false,
      brandId: ''
    }
  },
  created() {
    // 如果有传品牌 ID，接收一下
    this.brandId = this.$route.query.brandId || '';
    this.getOrderList();
  },
  methods: {    // 转换订单状态文字
    getOrderStatusText(status) {
      const statusMap = {
        '0': '待付款',
        '2': '支付成功',
        '4': '部分退款',
        '5': '已取消'
      };
      return statusMap[status] || '未知状态';
    },
    onClickLeft() {
      this.$router.back();
    },
    getOrderList() {
     
      
     
     
      if (this.isFetching || this.isScroll) return;
      this.isFetching = true;
      this.loading = true;

      const params = {
        pageno: this.pageno,
        pagesize: 20,
        brand_id: this.brandId
        
      };

      getOrderList(params).then(res => {
        this.loading = false;
        if (res.code == 200 ) {
          const list =  res.data.data || [];
          if (list.length < 20) {
            this.isScroll = true;
          }
          if (this.pageno === 1) {
            this.orderList = list;
          } else {
            this.orderList = this.orderList.concat(list);
          }
        }
      }).catch(() => {
        this.loading = false;
      }).finally(() => {
        this.isFetching = false;
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
      const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
  },
  // 添加触底加载更多
  mounted() {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 50) {
        if (!this.isFetching && !this.isScroll) {
          this.pageno++;
          this.getOrderList();
        }
      }
    });
  }
}
</script>

<style scoped lang="less">
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
.order-list-page {
  min-height: 100vh;
  background-color: #fff;
}

.list-container {
  padding: 0 16px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  // &:last-child {
  //   border-bottom: none;
  // }

  .item-left {
    flex: 1;

    .title {
      font-size: 13px;
      color: #333;
      margin-bottom: 6px;
    }

    .time {
      font-size: 12px;
      color: #ccc;
    }
  }

  .item-right {
    .price {
      font-size: 16px;
      color: #333;
    }
  }
}

  .item-right {
    text-align: right; /* 让右边的内容靠右对齐 */

    .price {
      font-size: 15px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px; /* 给下面的状态留点空隙 */
    }

    .status {
      font-size: 12px;
      
      &.status-0 { color: #FF9800; } /* 待付款 (橙色) */
      &.status-2 { color: #52C41A; } /* 支付成功 (绿色) */
      &.status-4 { color: #F5222D; } /* 部分退款 (红色) */
      &.status-5 { color: #999; }    /* 已取消 (灰色) */
    }
  }
</style>