<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <!--    top-->
    <div class="topBack">
      <div class="shopTop">
        <div class="leftBox">
          <div class="shopIcon" v-if="pf == 'mdl' || pf == 'kfc' || pf == 'bsk' || pf == 'tas'">
            <img class="img" src="../../assets/order/h1.png" alt="">
          </div>
          <div class="shopIcon" v-if="pf == 'xbk' || pf == 'nx'">
            <img class="img" src="../../assets/order/lv2.png" alt="">
          </div>
          <div class="shopName">{{ orderShow.storeName }}</div>
          <div style="padding-top: 6px;margin-left: -2px">
            <van-icon name="arrow" />
          </div>
        </div>
        <!-- <div class="leftBox" v-if="orderShow.packFlag != 2">
          <div class="collectIcon" v-if="collectFlag==0" @click="changeCollect">
            <img class="img" src="../../assets/order/sch.png" alt="">
          </div>
          <div class="collectIcon" v-else @click="changeCollect">
            <img class="img" src="../../assets/order/scx.png" alt="">
          </div>
          <div class="collect">{{ collectFlag == 0 ? '收藏' : '已收藏' }}</div>
        </div> -->
      </div>
      <!--      订单-->
      <div style="padding-bottom: 30px">

        <div class="shopCenter" v-if="types == 3" v-for="(item, index) in orderShow.products" :key="index">
          <div class="shopImg">
            <img class="img" style="border-radius: 5px;" :src="item.goodsImage" alt="">
          </div>
          <div class="shopInfo">
            <div class="shopTitle">{{
              item.goodsName
            }}
            </div>
            <div class="filmName startTime">
              <!-- {{
                item.listname || item.goodlistname || item.listname || item.config
              }} -->
            </div>
            <!--            <div class="dishes">-->
            <!--              <div v-for="(item2,index2) in item.items" :key="index2">{{ item2.number }} × {{ item2.name }}</div>-->
            <!--            </div>-->
            <div class="priceBox">
              <div>
                {{
                  item.quantity
                }}份
              </div>
              <div class="price">￥<span>{{ (item.salesPrice / 100).toFixed(2) }}</span></div>
            </div>
          </div>
        </div>
        <div class="shopCenter" v-if="types != 3" v-for="(item, index) in orderShow.goods" :key="index">
          <div class="shopImg">
            <img class="img" style="border-radius: 5px;"
              :src="item.goodImg || item.itemImage || item.itemImage || item.imageUrl" alt="">
          </div>
          <div class="shopInfo">
            <div class="shopTitle">{{
              item.goodName || item.itemName || item.itemName || item.nameCn
            }}
            </div>
            <div class="filmName startTime">
              {{
                item.listname || item.goodlistname || item.listname || item.config
              }}
            </div>
            <!--            <div class="dishes">-->
            <!--              <div v-for="(item2,index2) in item.items" :key="index2">{{ item2.number }} × {{ item2.name }}</div>-->
            <!--            </div>-->
            <div class="priceBox">
              <div>
                {{
                  item.num || item.count || item.quantity
                }}份
              </div>
              <div class="price">￥<span>{{ item.sumprice || item.oPrice }}</span></div>
            </div>
          </div>
        </div>



      </div>
      <div class="line">
        <div class="fullLeft"></div>
        <div class="fullLeft fullRight"></div>
      </div>
      <!--      合计-->
      <div class="full">
        合计
        <span>￥</span>
        <span class="fullMoney">{{ orderShow.zongji }}</span>
      </div>
    </div>
    <!--    v-if="orderShow.takeCode"-->
    <!-- <div class="orderCenter deliveryCode" v-if="order.takeCode">
    
      <div class="oederInfoText" style="padding: 0px;border: none;white-space: nowrap">取餐码</div>
      <div style="margin-right: -5px">
        <span style="padding-right: 5px" v-for="item in order.takeCode" :key="item">{{ item }}</span>
      </div>
    </div> -->

    <!-- 取餐信息区域 - 同时显示取餐码和二维码 -->
    <div class="orderCenter deliveryCode" v-if="(order.takeCode || order.codes) || qrCodes" style="display: block;">
      <!-- 取餐码文本部分 -->
      <div v-if="order.takeCode || order.codes" class="code-section">
        <div class="oederInfoText" style="padding: 0px;border: none;white-space: nowrap">取餐码</div>
        <div class="code-value">
          <span v-for="item in order.takeCode" :key="item" class="code-item">{{ item }}</span>
          <span v-if="order.codes && !order.takeCode">{{ order.codes }}</span>
        </div>
      </div>

      <!-- 二维码部分 -->
      <div v-if="qrCodes" class="qrcode-section">

        <div class="qrcode-wrapper">
          <!-- 单个二维码展示 -->
          <div class="qrcode" v-if="qrCodeType === 'single'">
            <canvas id="QRCode_header" class="img"></canvas>
          </div>
          <!-- 多个二维码展示 -->
          <div class="qrcode-multiple" v-if="qrCodes && qrCodes.includes(' ')">
            <div v-for="(code, idx) in qrCodes.split(' ')" :key="idx" class="qrcode-item">
              <canvas :id="'QRCode_header_' + idx" class="img"></canvas>

            </div>
          </div>
        </div>
      </div>
    </div>



    <!--  -->

    <!-- houjia -->


    <!-- 单个二维码展示 -->
    <!-- 修改后 - 添加条件判断，只在有二维码数据时显示 -->
    <!-- <div class="orderCenter deliveryCode" v-if="qrCodes">
      
     
      <div class="qrcode" v-if="qrCodeType === 'single'">
        <canvas id="QRCode_header" class="img"></canvas>
      </div>

      
      <div class="qrcode-multiple" v-if="qrCodeType === 'multiple'">
        <div v-for="(code, idx) in qrCodeList" :key="idx" class="qrcode-item">
          <canvas :id="'QRCode_header_' + idx" class="img"></canvas>
           
        </div>
      </div>
    </div> -->

    <!-- houjia -->
    <!--  -->
    <!-- <div class="orderCenter deliveryCode" v-else-if="order.codes">
      <div class="oederInfoText" style="padding: 0px;border: none">取餐码</div>
      <div style="margin-right: -5px">
         
        {{ order.codes }}
      </div>
    </div> -->
    <div class="orderCenter deliveryCode" v-if="order.delivery">
      <div class="oederInfoText" style="padding: 0px;border: none">配送状态</div>
      <div>
        <div @click="see">査看</div>
      </div>
    </div>
    <!--    center-->
    <div class="orderCenter">
      <div class="oederInfoText">订单信息</div>
      <div>
        <div class="status" v-for="item in orderInfo" :key="item.id" :style="{ border: item.id == 7 ? 'none' : '' }">
          <div class="statusText">{{ item.text }}</div>
          <div class="copyBox">
            <div class="address">{{ item.content }}</div>
            <!--            <div class="copy" v-if="item.id==5" @click="copyText">-->
            <!--              <img class="img" src="../../assets/order/cp.png" alt="">-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>

    <!--    footer-->
    <div class="button">
      <!--      <div class="cancel">取消订单</div>-->
      <div class="cancel" @click="toKefu">在线客服</div>
      <div class="cancel toPay" @click="toPay" v-if="orderShow.status == 0 && orderShow.packFlag != 2">去支付</div>
      <!--      <div class="cancel toPay xing">再来一单</div>-->
    </div>
  </div>
</template>
<script>
// getOderlist


// import clipboard from 'clipboard'
import { addcollect, getCateringdetail, getOderdetail, getOderdetails } from "@/api/mine";
import QRCode from "qrcode";
export default {
  name: "OrderDetail",
  data() {
    return {
      qrCodes: "",        // 存储二维码字符串
      qrCodeType: "single", // 标识二维码类型：single-单个 multiple-多个
      orderInfo: [
        {
          id: 1,
          text: "订单状态",
          content: ""
        },
        {
          id: 2,
          text: "取餐门店",
          content: ""
        },
        {
          id: 3,
          text: "取餐位置",
          content: ""
        },
        {
          id: 4,
          text: "就餐方式",
          content: ""
        },
        {
          id: 5,
          text: "订单号",
          content: ""
        },
        {
          id: 6,
          text: "下单时间",
          content: ""
        },
        {
          id: 7,
          text: "联系方式",
          content: ""
        },

      ],
      isCollect: false,
      orderShow: {},
      order: {},
      loadingflag: true,
      pf: '',
      storeId: "",
      collectFlag: "",
      type: "",
      types: ''
    }
  },
  computed: {
    qrCodeList() {
      if (this.qrCodes && this.qrCodes.includes(' ')) {
        return this.qrCodes.split(' ').filter(item => item.trim());
      }
      return [];
    }
  },
  // 在 data 后面添加 watch
  watch: {
    qrCodes: {
      handler(newVal) {
        if (newVal && newVal.includes(' ')) {
          this.qrCodeType = 'multiple';
        } else {
          this.qrCodeType = 'single';
        }
        console.log('二维码类型:', this.qrCodeType);
      },
      immediate: true
    }
  },
  methods: {



    // 修改后 - 使用箭头函数
    getQRCode() {
      let opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.3,
        margin: 0,
        width: 150,
        height: 150,
        color: {
          dark: "#000000",
          light: "#fff",
        },
      }

      // 判断是单个还是多个二维码
      if (this.qrCodeType === 'single') {
        let canvas = document.getElementById("QRCode_header");
        if (canvas && this.qrCodes) {
          // ✅ 使用箭头函数保持 this 指向
          QRCode.toCanvas(canvas, this.qrCodes, opts, (error) => {
            if (error) {
              console.log("二维码加载失败", error);
              this.$toast("二维码加载失败");
            } else {
              console.log("单个二维码生成成功");
            }
          });
        } else {
          console.log('canvas元素不存在或二维码数据为空');
        }
      } else if (this.qrCodeType === 'multiple') {
        // 多个二维码 - 遍历生成
        this.qrCodeList.forEach((code, index) => {
          let canvas = document.getElementById("QRCode_header_" + index);
          if (canvas && code) {
            // ✅ 使用箭头函数
            QRCode.toCanvas(canvas, code, opts, (error) => {
              if (error) {
                console.log(`二维码${index + 1}加载失败`, error);
              } else {
                console.log(`二维码${index + 1}生成成功`);
              }
            });
          }
        });
      }
    },
    toPay() {
      //     num1: this.num1,
      //     num2: this.num2,
      //     type: this.type,
      //     shopName: this.$route.query.shopName,
      //     orderid: res.data.orderid
      let num1 = 0
      let num2 = 0
      if (this.orderShow.pf == 'mdl') {
        num1 = 1
        num2 = 1
      } else if (this.orderShow.pf == 'kfc') {
        num1 = 2
        num2 = 1
      } else if (this.orderShow.pf == 'bsk') {
        num1 = 3
        num2 = 1
      } else if (this.orderShow.pf == 'xbk') {
        num1 = 4
        num2 = 2
      } else if (this.orderShow.pf == 'nx') {
        num1 = 5
        num2 = 2
      } else if (this.orderShow.pf == 'rxkf') {
        num1 = 6
        num2 = 2
      } else if (this.orderShow.pf == 'kd') {
        num1 = 7
        num2 = 1
      } else if (this.orderShow.pf == 'tas') {
        num1 = 8
        num2 = 1
      }
      window.location.href = this.$store.state.cakeUrl + "/checkstand?orderid=" + this.orderShow.id + "&type=" + this.orderShow.pf + "&shopName=" + this.orderShow.storeName + "&num1=" + num1 + "&num2=" + num2 + "&shop=" + 1
    },
    see() {
      if (this.order.courierLocationH5) {
        window.location.href = this.order.courierLocationH5
      }
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    getorderdetails(id, type) {
      getOderdetails({
        token: localStorage.getItem("token"),
        type,
        id
      }).then(res => {
        // console.log(res);
        this.loadingflag = false
        if (res.code == 200) {
          this.orderShow = res.data.order_show;
          this.types = res.data.order_show.type;
          this.order = res.data.order
          this.collectFlag = res.data.collect_flag
          // 订单状态：0、待付款 1、已付款待出餐 2、出餐中 3、出餐成功 4、确认收货（含部分退款）5、出餐失败退款 10 订单关闭
          this.orderInfo[0].content = this.orderShow.statusstr
          // this.order.status == 0 ? "待付款" : this.order.status == 1 ? "已付款待出餐" : this.order.status == 2 ? "出餐中" : this.order.status == 3 ? "出餐成功" : this.order.status == 4 ? "确认收货（含部分退款）" : this.order.status == 5 ? "出餐失败退款" : this.order.status == 10 ? "订单关闭" : ''
          this.orderInfo[1].content = this.order.storeName || this.order.shopName
          this.orderInfo[2].content = this.orderShow.storeAddress;
          // 取餐方式 0-堂食 1-打包 2-外送
          this.orderInfo[3].content = this.orderShow.packFlag == 0 ? "店内用餐" : this.orderShow.packFlag == 1 ? "打包" : this.orderShow.packFlag == 2 ? " " : ""
          this.orderInfo[4].content = this.orderShow.orderid
          if (this.order.paymentTime) {

            //  this.orderInfo[5].content = this.timestampToTime(this.order.createdtime)
            // } else {
            this.orderInfo[5].content = this.order.paymentTime;
          }
          this.orderInfo[6].content = this.orderShow.phone

        }
      })
    },
    getorderdetail(id, type) {
      getOderdetail({
        token: localStorage.getItem("token"),
        type,
        id
      }).then(res => {
        // console.log(res);
        this.loadingflag = false
        if (res.code == 200) {
          this.orderShow = res.data.order_show
          this.order = res.data.order
          this.collectFlag = res.data.collect_flag
          // 订单状态：0、待付款 1、已付款待出餐 2、出餐中 3、出餐成功 4、确认收货（含部分退款）5、出餐失败退款 10 订单关闭
          this.orderInfo[0].content = this.orderShow.statusstr
          // this.order.status == 0 ? "待付款" : this.order.status == 1 ? "已付款待出餐" : this.order.status == 2 ? "出餐中" : this.order.status == 3 ? "出餐成功" : this.order.status == 4 ? "确认收货（含部分退款）" : this.order.status == 5 ? "出餐失败退款" : this.order.status == 10 ? "订单关闭" : ''
          this.orderInfo[1].content = this.order.storeName || this.order.shopName
          this.orderInfo[2].content = this.order.storeAddress || this.order.address
          // 取餐方式 0-堂食 1-打包 2-外送
          this.orderInfo[3].content = this.orderShow.packFlag == 0 ? "店内用餐" : this.orderShow.packFlag == 1 ? "打包" : this.orderShow.packFlag == 2 ? "外送" : ""
          this.orderInfo[4].content = this.orderShow.orderid
          if (this.order.createdtime) {

            this.orderInfo[5].content = this.timestampToTime(this.order.createdtime)
          } else {
            this.orderInfo[5].content = this.order.createTime.split("T").join(" ")
          }
          this.orderInfo[6].content = this.orderShow.phone;



          //  houjia
          // 接口返回

          if (this.order.qrCodes) {
            this.qrCodes = this.order.qrCodes;

          }
          // 如果有取餐码
          else if (this.orderShow.takeCode && this.orderShow.takeCode.length > 0) {
            if (this.orderShow.takeCode.length === 1) {
              this.qrCodes = this.orderShow.takeCode[0];
            } else {
              this.qrCodes = this.orderShow.takeCode.join(' ');
            }
          }
          // 如果有 codes 字段

          // 等待DOM更新后生成二维码
          this.$nextTick(() => {
            this.getQRCode();
          });

          //houjia




        }
      })
    },


    getCateringdetail(id, type) {
      getCateringdetail({
        token: localStorage.getItem("token"),
        type,
        id
      }).then(res => {
        // console.log(res);
        this.loadingflag = false
        if (res.code == 200) {
          this.orderShow = res.data.order_show
          this.order = res.data.order
          this.collectFlag = res.data.collect_flag
          // 订单状态：0、待付款 1、已付款待出餐 2、出餐中 3、出餐成功 4、确认收货（含部分退款）5、出餐失败退款 10 订单关闭
          this.orderInfo[0].content = this.orderShow.statusstr
          // this.order.status == 0 ? "待付款" : this.order.status == 1 ? "已付款待出餐" : this.order.status == 2 ? "出餐中" : this.order.status == 3 ? "出餐成功" : this.order.status == 4 ? "确认收货（含部分退款）" : this.order.status == 5 ? "出餐失败退款" : this.order.status == 10 ? "订单关闭" : ''
          this.orderInfo[1].content = this.order.storeName || this.order.shopName
          this.orderInfo[2].content = this.order.storeAddress || this.order.address
          // 取餐方式 0-堂食 1-打包 2-外送
          this.orderInfo[3].content = this.orderShow.packFlag == 0 ? "店内用餐" : this.orderShow.packFlag == 1 ? "打包" : this.orderShow.packFlag == 2 ? "外送" : ""
          this.orderInfo[4].content = this.orderShow.orderid
          if (this.order.createdtime) {

            this.orderInfo[5].content = this.timestampToTime(this.order.createdtime)
          } else {
            this.orderInfo[5].content = this.order.createTime.split("T").join(" ")
          }
          this.orderInfo[6].content = this.orderShow.phone

        }
      })
    },
    changeCollect() {
      // this.isCollect = !this.isCollect
      addcollect({
        type: this.pf,
        storeCode: this.storeId
      }).then(res => {
        // console.log(res)
        this.getorderdetail(this.$route.query.id, this.$route.query.pf)
      })
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
    copyText() {
      //   let text = this.orderInfo[4].content;
      //   clipboard.writeText(text);
      //   alert('已复制到剪贴板！');
    }
  },
  created() {
    this.pf = this.$route.query.pf
    this.storeId = this.$route.query.storeId
    this.type = this.$route.query.type
    if (this.type == 1) {
      this.getCateringdetail(this.$route.query.id, this.$route.query.pf)
    } else if (this.type == 2) {
      this.getorderdetail(this.$route.query.id, this.$route.query.pf)
    } else if (this.type == 3) {
      this.getorderdetails(this.$route.query.id, this.$route.query.pf)
    }

  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 12px;
  padding-bottom: 78px;
}

.topBack {
  background-color: white;
  border-radius: 8px;
  padding: 15px;

  .shopTop {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .leftBox {
      display: flex;
      align-items: center;
      gap: 5px;

      .shopName {
        font-size: 15px;
        font-weight: bold;
      }

      .shopIcon {
        width: 20px;
        padding-top: 2px;
      }
    }

    .collectIcon {
      width: 16px;
      padding-top: 1px;
    }

    .collect {
      font-size: 14px;
    }
  }

  .shopCenter {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;

    .shopImg {
      width: 75px;
    }

    .shopInfo {
      width: calc(100% - 85px);
    }

    .shopTitle {
      //font-weight: bold;
    }

    .dishes {
      font-size: 10px;
      color: #8E8E8E;
      margin-top: 10px;
    }

    .dishes div {
      margin-top: 4px;
    }

    .priceBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      //font-weight: bold;
      font-size: 15px;
      margin-top: 15px;

      .price {
        font-size: 10px;
      }

      .price span {
        font-size: 18px;
      }
    }
  }

  .line {
    position: relative;
    border-top: 2px dotted #EEEEEE;
    width: 90%;
    margin: auto;
  }

  .full {
    text-align: end;
    padding: 20px 0px 0px;
    font-size: 14px;
    font-weight: bold;

    .fullMoney {
      font-size: 20px;
    }
  }

  .fullLeft {
    width: 20px;
    height: 20px;
    background-color: #F0F0F0;
    position: absolute;
    top: -10px;
    left: calc(-24px - 6%);
    border-radius: 50%;
  }

  .fullRight {
    position: absolute;
    top: -10px;
    right: calc(-24px - 6%);
    left: inherit;
  }
}

.orderCenter {
  background-color: white;
  border-radius: 8px;
  padding: 20px 15px 5px;
  margin-top: 10px;

  .oederInfoText {
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom: 1px solid #F6F6F6;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 17px 0px;
    border-bottom: 1px solid #F6F6F6;
    font-size: 15px;

    .statusText {
      color: #747474;
      white-space: nowrap;
    }

    .address {}

    .copy {
      width: 14px;
    }

    .copyBox {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}

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
  padding: 18px 15px;
  justify-content: flex-end;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 85px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }

  .toPay {
    color: white;
    background-color: #ED3036;
    border: 1px solid #ED3036;
  }

  .xing {
    background-color: #0E6941;
    border: 1px solid #0E6941;
  }
}

.deliveryCode {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  gap: 15px;
}

.filmName {
  font-size: 14px;
  //font-weight: bold;
  margin-top: 3px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  /* 显示两行 */
}

.startTime {
  font-size: 12px;
  color: #818080;
}



//xinzneg
.code-section,
.qrcode-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px;

}

.code-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.code-item {
  margin-right: 5px;
}

.qrcode-wrapper {
  display: flex;
  margin: 10px auto;
  justify-content: center;
}

.qrcode-item {
  margin: 10px auto;
}

/* 如果需要垂直布局 */
</style>