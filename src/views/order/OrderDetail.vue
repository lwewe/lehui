<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>

    <!-- 地址 -->
    <div class="addressBox" v-if="detail.delivery">
      <div class="address">
        <div class="leftBox">
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ detail.delivery.name }}</span>
              <span class="phone">{{ detail.delivery.phone }}</span>
            </div>

            <div class="addressDetail">{{ detail.delivery.addr || detail.delivery.detail }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单状态 -->
    <!-- <div class="addressBox addressBox2 status-box" :class="getStatusClass(detail.status)">
      <div class="status-text">{{ detail.status_name }}</div>
      <div class="status-desc">{{ getStatusDesc(detail.status) }}</div>
    </div> -->

    <!-- 商品信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="(item, index) in detail.items" :key="index">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="item.product_img" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.product_title }}</div>
          <div class="can" v-if="item.spec_name">{{ item.spec_name }}</div>
          <div class="all">
            <div class="price"><span style="font-size: 10px;">￥</span>{{ item.sell_price }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快递信息 -->
    <div class="addressBox addressBox2" v-if="detail.express_company">
      <div class="itemTitle">快递信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">快递公司</div>
          <div class="price">{{ detail.express_company }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText" >快递单号</div>
          <div class="price" @click="copyText(detail.express_no)">{{ detail.express_no }} <span class="copy-icon">复制</span></div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price" @click="copyText(detail.order_no)">{{ detail.order_no }} <span class="copy-icon">复制</span>
          </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ formatTime(detail.add_time) }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">商品金额</div>
          <div class="price"><span style="font-size: 10px;">￥</span>{{ detail.total_price }}</div>
        </div>


        <div class="shopPrice">
          <div class="shopPriceText">快递费</div>
          <div class="price"><span style="font-size: 10px;">￥</span>{{ detail.freight }}</div>
        </div>

        <div class="shopPrice">
          <div class="shopPriceText">实付金额</div>
          <div class="price price1"><span style="font-size: 10px;">￥</span>{{ detail.total_fee }}</div>
        </div>
      </div>
    </div>

    <!-- 卡券信息（如电影票等） -->
    <div class="addressBox addressBox2" v-if="detail.card_info && detail.card_info.length > 0">
      <div class="itemTitle">卡券信息</div>
      <div class="orderInfo">
        <div class="shopPrice" v-for="(info, index) in detail.card_info" :key="index">
          <div class="shopPriceText">{{ info.label }}</div>
          <div class="price">{{ info.value }}</div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏（仅待支付时显示） -->
    <!-- <div class="footer" v-if="detail.status == -1">
      <button class="btn" @click="cancelOrder">取消订单</button>
      <button class="btn-red" @click="goPay">立即支付</button>
    </div> -->

    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="../../assets/kf.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { orderDetail, orderCancel } from "@/api/lhjdtm";

export default {
  name: "OrderDetail",
  data() {
    return {
      loadingflag: true,
      detail: {
        items: [],
        delivery: {},
        card_info: []
      }
    }
  },
  methods: {
    copyText(text) {
      if (!text) return;

      const showTip = (msg) => {
        if (this.$toast) {
          this.$toast(msg);
        } else {
          alert(msg);
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(String(text))
          .then(() => showTip('复制成功'))
          .catch(() => this.fallbackCopy(String(text)));
      } else {
        this.fallbackCopy(String(text));
      }
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },

    // 格式化时间
    formatTime(time) {
      if (!time) return ''
      let date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return `${y}-${MM}-${d} ${h}:${m}`
    },

    // 状态颜色
    getStatusClass(status) {
      if (status === 7 || status === 'used') return 'status-green'
      if (status === 9) return 'status-gray'
      return 'status-red'
    },

    // 状态描述
    getStatusDesc(status) {
      const descMap = {
        '-1': '请尽快完成支付',
        '1': '商家正在备货中',
        '2': '商品正在配送中',
        '7': '订单已完成',
        '9': '订单已取消'
      }
      return descMap[status] || ''
    },

    // 取消订单
    // 取消订单
    cancelOrder() {
      this.$dialog.confirm({
        title: '取消订单',
        message: '确定要取消该订单吗？',
        confirmButtonColor: 'red'
      }).then(() => {
        // 调用取消订单接口
        orderCancel({ id: this.detail.id }).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || '订单已取消')
            // 重新获取详情，刷新状态
            this.getDetail(this.detail.id)
          } else {
            this.$toast(res.msg || '取消失败')
          }
        })
      }).catch(() => {
        // 用户点击了取消按钮，什么都不做
      })
    },

    // 去支付
    goPay() {
      this.$router.push({ path: "/payOrder", query: { id: this.detail.id } })
    },
    // 获取订单详情
    getDetail(id) {
      orderDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data
        } else {
          this.$toast(res.msg || '获取订单详情失败')
        }
      })
    }
  },
  created() {
    let id = this.$route.query.id
    if (id) {
      this.getDetail(id)
    }
  }
}
</script>

<style scoped lang="less">
.copy-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.copy-icon {
  font-size: 11px;
  color: #DA0200;
  border: 1px solid #DA0200;
  border-radius: 3px;
  padding: 0 3px;
  line-height: 14px;
}

.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px;
}

.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .addressIcon {
    width: 20px;
  }

  .phone {
    padding-left: 10px;
    font-size: 12px;
    color: #797979;
  }

  .addressDetail {
    font-size: 13px;
    font-weight: bold;
    margin-top: 3px;
  }

  .userName {
    font-size: 15px;
    font-weight: bold;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.status-box {
  background: linear-gradient(135deg, #FF7675, #DA0200);
  color: #fff;

  .status-text {
    font-size: 20px;
    font-weight: bold;
  }

  .status-desc {
    font-size: 13px;
    margin-top: 5px;
    opacity: 0.9;
  }
}

.status-green {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.status-gray {
  background: #999;
}

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
  }

  .price {
    font-size: 14px;
    font-weight: bold;
  }

  .price1 {
    color: #C93F3D;
  }
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 77px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }

  .can {
    margin-top: 13px;
    font-size: 13px;
    color: #979797;
  }

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .price {
    color: #C63532;
    font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  padding: 10px 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  z-index: 999;

  .btn {
    background: transparent;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
  }

  .btn-red {
    border: none;
    background: linear-gradient(90deg, #FF7675, #DA0200);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }
}

.service {
  background-color: white;
  color: #5b5a5a;
  font-size: 13px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-top: 10px;

  .serviceBox {
    width: 18px;
    padding-top: 1px;
  }
}
</style>