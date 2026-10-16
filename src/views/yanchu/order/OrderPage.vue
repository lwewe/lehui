<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <!--        <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>-->
    <!--    头部-->
    <div class="topBack" :style="'background-image: url('+order.dramalogo+')'">
      <div class="model">
        <!--        N:待支付-->
        <!--        C:已取消-->
        <!--        P:已付款-->
        <!--        T:付款后，已通知主办方，等待处理-->
        <!--        D:等待发货（快递票等待发货，非快递票预售状态-等待发货)-->
        <!--        DE:已发货-->
        <!--        S:出票成功-->
        <!--        R:退款完成-->
        <span class="orderstatus" v-if="order.orderstatus=='N'">{{ timeDowm > 0 ? '待支付' : '订单已失效' }} <span
            v-if="timeDowm>0">|</span> <span style="font-size: 13px"
                                             v-if="timeDowm>0">支付剩余时间 {{ countdown }}</span></span>
        <span class="orderstatus" v-if="order.orderstatus=='C'">已取消</span> <span
          v-if="order.orderstatus=='C'">|</span> <span style="font-size: 13px"
                                                       v-if="order.orderstatus=='C'">交易已关闭</span>
        <span class="orderstatus" v-if="order.orderstatus=='P'">已付款</span>
        <span class="orderstatus" v-if="order.orderstatus=='T'">已通知主办方，等待处理</span>
        <span class="orderstatus" v-if="order.orderstatus=='D'">等待发货</span>
        <span class="orderstatus" v-if="order.orderstatus=='DE'">已发货</span>
        <span class="orderstatus" v-if="order.orderstatus=='S'">出票成功</span>
        <span class="orderstatus" v-if="order.orderstatus=='R'">退款完成</span>
        <span class="orderstatus" v-if="order.orderstatus=='E'">订单已失效</span>
        <!--        | <span style="font-size: 13px">交易已关闭</span>-->
      </div>
    </div>
    <!--    商品信息-->
    <div class="addressBox addressBox2 addressBox3">
      <div class="shopInfoBox">
        <div class="shopInfo" :class="{shopInfo2:!isexpress &&seatInfoList.length>0}">
          <!--                    {{key}}-->
          <div class="shopImg" v-if="isexpress || seatInfoList.length==0">
            <img style="border-radius: 5px;" class="img"
                 :src="order.dramalogo"
                 alt="">
          </div>
          <div class="nameBox">
            <div class="shopName">{{ order.projectName }}</div>
            <div class="can">{{ city }} | {{ order.venuesname }}</div>
            <div class="can" style="color:#4d4d4d;" v-if="!isexpress">共 {{ order.quantity }} 张</div>
          </div>
          <div class="shopImg" v-if="!isexpress && seatInfoList.length>0">
            <img style="border-radius: 5px;" class="img"
                 :src="order.dramalogo"
                 alt="">
          </div>
        </div>
        <div v-if="isexpress || seatInfoList.length==0">
          <div class="can">{{ order.dateDesc }}</div>
          <div class="all">
            <div class="price" v-if="order.price">{{ Number(order.price).toFixed(0) }}票面 ×{{ order.quantity }}</div>
            <div class="number">￥{{ Number(order.price) * Number(order.quantity) }}</div>
          </div>
        </div>
        <div v-else class="yesSeat">
          <div class="can" v-if="order.dateDesc">
            <div>{{ order.dateDesc.split(" ")[0] }}</div>
            <div class="timeWeek" style="white-space: nowrap">{{ order.dateDesc.split(" ")[1] }}</div>
          </div>
          <div class="can">
            <!--            <div class="price">二楼正厅</div>-->
            <div class="number timeWeek ">
              <div v-for="(item,index) in seatInfoList" :key="item.index">{{ item.fullSeatName }}<span class="line"
                                                                                                       v-if="(index+1)!=seatInfoList.length">|</span>
              </div>
            </div>
          </div>
        </div>
        <div class="qrBox" v-if="!isexpress&&seatInfoList.length>0">
          <div class="cicle"></div>
          <div class="cicle cicle2"></div>
          <div>二维码取票</div>
          <div class="qrcode">
            <canvas id="QRCode_header" class="img"></canvas>
          </div>
        </div>
      </div>
      <div v-if="isexpress">
        <div class="ticketBox">
          <div class="ticketImg">
            <img class="img" src="@/assets/mine/piao.png" alt="">
          </div>
          <div>{{ order.deliveryTypeName }}</div>
        </div>
        <div class="userNmae">{{ order.buyerName }} <span>{{ order.buyerPhone }}</span></div>
        <div class="can" v-if="isexpress">{{ orderShow.address }}</div>
      </div>
    </div>
    <!--    选票方式-->
    <div class="addressBox addressBox2" v-if="!isexpress">
      <div class="ticketBox" style="margin: 0;">
        <div class="ticketImg">
          <img class="img" src="@/assets/mine/piao.png" alt="">
        </div>
        <div>{{ order.deliveryTypeName }}</div>
      </div>
      <div class="userNmae">{{ order.buyerName }} <span>{{ order.buyerPhone }}</span></div>
    </div>
    <!--    观影人信息-->
    <!--    <div class="addressBox addressBox2">-->
    <!--      <div class="itemTitle">观影人信息</div>-->
    <!--      <div class="orderInfo">-->
    <!--        <div class="shopPriceText" style="color: #2D2D2D;margin-top: 10px;">旭</div>-->
    <!--        <div class="shopPrice" style="justify-content: flex-start;gap: 15px;margin-top: 5px">-->
    <!--          <div class="shopPriceText">身份证</div>-->
    <!--          <div class="shopPriceText">1301822200122541256</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    订单明细-->
    <div class="addressBox addressBox2">
      <div class="orderInfo">
        <div class="shopPrice" style="margin: 0;">
          <div class="shopPriceText">票款总额</div>
          <div class="price">￥{{ Number(order.price) * Number(order.quantity) }}</div>
        </div>
        <div class="shopPrice" v-if="order.expressfee>0&&isexpress">
          <div class="shopPriceText">快递费</div>
          <div class="price">￥{{ order.expressfee / 100 }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText" style="color:#323232;font-size: 15px">实付金额</div>
          <div class="price price1">￥{{ orderShow.total }}</div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <div class="addressBox addressBox2">
      <div class="orderInfo">
        <div class="shopPrice" style="margin: 0;">
          <div class="shopPriceText">订单号</div>
          <div class="shopPriceText">{{ orderShow.order_id }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="shopPriceText">{{ timestampToTime(orderShow.add_time) }}</div>
        </div>
        <div class="shopPrice" v-if="orderShow.fuli">
          <div class="shopPriceText">支付方式</div>
          <div class="shopPriceText"
               v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==JSON.parse(orderShow.fuli).length">
            微信
          </div>
          <div class="price"
               v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length>0&&JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length!=JSON.parse(orderShow.fuli).length">
            微信和福利卡
          </div>
          <div class="price" v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==0">福利卡</div>
        </div>
      </div>
    </div>
    <!--    快递信息-->
    <div class="addressBox addressBox2" v-if="(orderShow.expressName || orderShow.expressCode)&&isexpress">
      <div class="itemTitle">快递信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">快递</div>
          <div class="price">{{ orderShow.expressName }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">快递单号</div>
          <div class="price">{{ orderShow.expressCode }}</div>
        </div>
      </div>
    </div>
    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="@/assets/kf.png" alt="">
      </div>
    </div>
    <!--    footer-->
    <!--    <div class="button">-->
    <!--      <div class="cancel">删除订单</div>-->
    <!--&lt;!&ndash;      <div class="cancel">在线客服</div>&ndash;&gt;-->
    <!--      <div class="cancel toPay">再来一单</div>-->
    <!--      &lt;!&ndash;      <div class="cancel toPay xing">再来一单</div>&ndash;&gt;-->
    <!--    </div>-->
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import QRCode from "qrcode";
import {getPerOrderDetail} from "@/api/lehuiperform"; //引入生成二维码插件
export default {
  components: {Payment},
  data() {
    return {
      cardList: [],
      addrShow: {},
      order: {},
      orderShow: {},
      expressList: {},
      express: "",
      loadingflag: true,
      child: [],
      child_flag: "",
      isHeight: false,
      orderList: [],
      isSeat: false,
      isexpress: false,
      qrUrl: "555888888888888",
      city: "",
      timeDowm: 0,
      countdown: "",
      seatInfoList: []
    }
  },
  methods: {
    // 计算过期时间
    getadver() {
      let time = parseInt(new Date().getTime() / 1000) + '';
      this.timeDowm = Number(this.orderShow.expiretime) - time
      const countdownInterval = setInterval(() => {
        const minutes = Math.floor(this.timeDowm / 60);
        const seconds = this.timeDowm % 60;
        this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDowm--;
        if (this.timeDowm <= 0) {
          clearInterval(countdownInterval);
          // 倒计时结束后的操作

        }
      }, 1000);
    },
    // 获取二维码
    getQRCode() {
      let opts = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 0, //二维码留白边距
        width: 150, //宽
        height: 150, //高
        color: {
          dark: "#000000", //前景色
          light: "#fff", //背景色
        },
      }
      let msg = document.getElementById("QRCode_header");
      // 将获取到的数据(val)画到msg(canvas)上
      QRCode.toCanvas(msg, this.seatInfoList[0].qrCode, opts, function (error) {
        if (error) {
          // console.log("二维码加载失败", error);
          this.$toast("二维码加载失败");
        }
      })
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    getDetail(id) {
      this.child = []
      getPerOrderDetail({
        id
      }).then(res => {
        this.loadingflag = false
        // console.log(res)
        if (res.code == 200) {
          this.orderShow = res.data.order_show
          this.order = res.data.order
          this.isexpress = res.data.order.isexpress
          this.seatInfoList = res.data.order.seatInfoList || []
          this.getCityName(this.order.venueLng, this.order.venueLat)
          this.getadver()
          if (this.seatInfoList.length > 0) {
            setTimeout(() => {
              this.getQRCode()
            }, 200)
          }
        }
      })
    },
    // 查找地址位置
    getCityName(longitude, latitude) {
      // 创建一个坐标点
      let point = new BMap.Point(longitude, latitude);
      // 创建一个地理编码实例
      let geoc = new BMap.Geocoder();
      // 根据坐标点进行逆地理编码
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        this.city = addComp.city
        // console.log(this.city)
      });
    },
  },
  created() {

  },
  mounted() {
    this.getDetail(this.$route.query.id)
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 10px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;

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
  position: relative;
}


.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.textarea {
  background-color: #F6F6F6;
  height: 94px;
  border-radius: 3px;
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.textarea textarea {
  border: none;
  background-color: #fff0;
  font-size: 13px;
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
    color: #C7174A;
    font-size: 17px;
  }
}

.can {
  margin-top: 7px;
  font-size: 12px;
  color: #979797;
}

.shopInfoBox {
  border: 1px solid #EDEDED;
  border-radius: 10px;
  padding: 12px 15px;
  margin-top: 3px;

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
  }

  .price {
    //font-weight: bold;
    font-size: 14px;
  }

  .number {
    //color: #989898;
  }
}

.shopInfo {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid #EDEDED;

  .shopImg {
    width: 60px;
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
    -webkit-line-clamp: 2; /* 显示两行 */
  }
}

.shopInfo2 {
  justify-content: space-between;
  border: none;
}

.yesSeat {
  display: flex;
  gap: 43px;
  align-items: baseline;
}

.timeWeek {
  color: #464646;
  margin-top: 5px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.line {
  padding-left: 6px;
}

.qrBox {
  margin-top: 18px;
  padding: 20px 0px 15px;
  width: 100%;
  background-image: linear-gradient(to right, #F1F1F1 0%, #F1F1F1 50%, transparent 50%);
  background-size: 17px 2px;
  background-repeat: repeat-x;
  font-size: 15px;
  position: relative;

  .cicle {
    position: absolute;
    width: 18px;
    height: 18px;
    background-color: #FFFFFF;
    border-radius: 50px;
    border-right: 1px solid #dcdbdb;
    top: -8px;
    left: -27px;
  }

  .cicle2 {
    border-right: none;
    border-left: 1px solid #dcdbdb;
    top: -8px;
    left: inherit;
    right: -27px;
  }

  .qrcode {
    width: 150px;
    height: 150px;
    margin: auto;
    margin-top: 10px;
  }
}

//客服
.service {
  background-color: white;
  color: #828282;
  font-size: 13px;
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

.unfold {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  gap: 5px;
  margin-top: 10px;
  position: absolute;
  bottom: 6px;
  right: 6px;
}

.unfoldHeight {
  height: 110px;
  overflow: hidden;
}

//footer
.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  justify-content: flex-end;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 89px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .toPay {
    color: white;
    background-image: linear-gradient(to right, #F55756, #DC0807);
    border: 1px solid #ED3036;
  }

  .xing {
    background-color: #0E6941;
    border: 1px solid #0E6941;
  }
}

.topBack {
  background-image: url("@/assets/P-3.jpg");
  height: 88px;
  background-size: 100% auto;

  .model {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #000000c7;
    color: white;
    padding: 30px;
  }
}

.addressBox3 {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  margin-top: -15px;
}

.ticketBox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  margin-top: 14px;

  .ticketImg {
    width: 24px;
    height: 24px;
  }
}

.userNmae {
  font-size: 14px;
  margin-top: 5px;
}

.userNmae span {
  font-size: 12px;
}

.orderstatus {
  font-size: 18px;
}
</style>