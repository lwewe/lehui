<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    商品信息-->
    <div class="addressBox">
      <div class="paytime" style="" v-if="countdown">支付剩余时间 {{ countdown }}</div>
      <div class="shopInfo">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img" :src="isId ? coupons.img : coupons.showPic" alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ isId ? coupons.title : coupons.projectName }}</div>
          <div class="can">{{ isId ? coupons.venuesname : coupons.venueName }}</div>
          <div class="can can2">{{ isId ? coupons.dateDesc : coupons.performName }}</div>
          <div class="all">
            <div class="price">{{ Number(coupons.price) + Number(isId ? coupons.servicefee : coupons.serviceFee) }}
              票面
            </div>
            <div class="number">
              ×{{ coupons.quantity }}
            </div>
          </div>
        </div>
      </div>
      <div class="totalBox">
        <div class="showStartTime tipsMax">
          <!-- ① 修改：第二个条件改为 isOneOrderOneCard，加括号，filter 内层改用 i -->
          <div class="tipsBox"
            v-for="item in (coupons.isOneTicketOneCard == 1 || coupons.isOneOrderOneCard == 1 ? serverList : serverList.filter(i => i.id != 2))"
            :key="item.id">
            <div class="tips"><img class="img" :src="item.icon" alt=""></div>
            <div>{{ item.title }}</div>
          </div>
        </div>
        <div class="cicle"></div>
        <div class="cicle cicle2"></div>
      </div>
    </div>
    <!--    观影人-->
    <div class="addressBox addressBox2" style="padding: 0px 10px;">
      <!--      v-if="coupons.isOneTicketOneCard==1"-->
      <div class="phoneBox phoneBox3" v-if="coupons.isOneTicketOneCard == 1">
        <div class="phoneTop" @click="toChooseMaster('/chooseMoviegoers')">
          <div class="phoneTitle">
            <div>实名观影人</div>
            <div class="Selected"> 已选{{
              resultMoviegoer.length
            }}/{{ coupons.priceType == 0 ? coupons.quantity : coupons.quantity * coupons.count }}位，入场携带对应证件
            </div>
          </div>
          <div class="with">
            <div style="padding-top:4px">
              <van-icon color="#848484" name="arrow" />
            </div>
          </div>
        </div>
        <div class="masterList">
          <div class="masterItem" v-for="item in resultMoviegoer" :key="item.id">
            <div>
              <div>{{ item.name }}</div>
              <div class="cardBox">
                <span>身份证</span>
                <span class="cardNum">{{ item.num }}</span>
              </div>
            </div>
            <div @click="delSected(item.id)">
              <van-icon size="19px" color="#949494" name="clear" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isId">
        <!-- ② 修改：v-if 改用 parseTakeTicketTypes -->
        <div class="phoneBox" v-if="parseTakeTicketTypes(coupons.takeTicketTypes).length >= 3">
          <div class="phoneTitle">
            <div>取票方式</div>
          </div>
          <div class="with with2" v-if="coupons.takeTicketTypes">
            <!--          取票方式,1-无纸化,2-快递票,3-自助换票,4-门店自取-->
            <!-- ③ 修改：v-for 改用 parseTakeTicketTypes -->
            <div class="ticket" v-for="item in parseTakeTicketTypes(coupons.takeTicketTypes).slice(0, 4)" :key="item"
              :class="{ ticket2: item == typesId }" @click="changeTypesId(item)">{{
                item == 1 ? '无纸质票' : item == 2 ? '快递纸质票' : item == 3 ? '自助取票' : item == 4 ? '门店自取' : ''
              }}
            </div>
          </div>
        </div>
      </div>
      <!--      快递-->
      <div v-if="typesId == 2 || isId">
        <div class="phoneBox" style="align-items: flex-start" v-if="!isId">
          <div class="phoneTitle" style="width: 80%;">
            <div class="address">
              <div>
                <van-icon color="#5C5C5C" name="location-o" />
              </div>
              <div v-if="address.id">{{ address.name }}</div>
              <div class="pNum" v-if="address.id">{{ address.phone }}</div>
              <div v-else>无收货地址</div>
            </div>
            <div class="Selected" v-if="address.id">{{ address.province_name }} {{ address.city_name }}
              {{ address.county_name }} {{ address.addr }}
            </div>
          </div>
          <div class="with" @click="toChooseMaster('/peraddressList')">

            <div class="switch" v-if="!address.id">添加</div>
            <div class="switch" v-else>更换</div>
            <div style="padding-top:4px">
              <van-icon color="#848484" name="arrow" />
            </div>
          </div>
        </div>
        <div class="phoneBox" :style="{ border: coupons.isOneTicketOneCard == 0 && typesId == 2 ? 'none' : '' }"
          v-if="Number(coupons.expressfee / 100) > 0 || expressFee">
          <div class="phoneTitle">
            <div>运费</div>
          </div>
          <div class="with with2" style="color: #CF6583;font-size: 14px">
            ￥{{ isId ? Number(coupons.expressfee / 100) : expressFee }}
          </div>
        </div>
      </div>

      <div>
        <div class="phoneBox" v-if="coupons.isOneTicketOneCard == 0 && typesId != 2">
          <div class="phoneTitle">
            <div>联系人</div>
          </div>
          <div class="with with2">
            <input class="inp" v-model="userName" type="text" placeholder="请输入姓名">
          </div>
        </div>
        <div class="phoneBox" v-if="coupons.isOneTicketOneCard == 0 && typesId != 2">
          <div class="phoneTitle">
            <div>手机号</div>
          </div>
          <div class="with with2">
            <input class="inp" v-model="phoneNum" type="text" placeholder="出票信息将发至该手机号">
          </div>
        </div>
        <div class="phoneBox phoneBox2" v-if="coupons.isOneOrderOneCard == 1">
          <div class="phoneTitle">
            <div>身份证号</div>
          </div>
          <div class="with with2">
            <input class="inp" v-model="cardId" type="text" placeholder="请输入身份证号">
          </div>
        </div>
      </div>
    </div>
    <!--    支付方式-->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付按钮-->
    <div class="footer">
      <div class="allNumber">共{{ coupons.quantity }}件</div>
      <div class="rightBox">
        <div>
          <div class="all" v-if="isId">合计:
            <span class="price">{{ changePrice1(Number(coupons.total)) }}</span>
            <span class="priceNum">.{{ changePrice2(Number(coupons.total)) }}</span>
          </div>
          <div class="all" v-else>合计:
            <span class="price">{{
              typesId == 2 ? changePrice1(Number(coupons.fullprice) + Number(expressFee)) :
                changePrice1(Number(coupons.fullprice))
            }}</span>
            <span class="priceNum">.{{
              typesId == 2 ? changePrice2(Number(coupons.fullprice) + Number(expressFee)) :
                changePrice2(Number(coupons.fullprice))
            }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>

<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";

// ④ 修改：删掉重复 import，合并成一次
import {
  dramaApi,
  PerformFlkpay,
  PerformIsPayDate,
  PerformIsPaySuccess,
  PerformOrderPaydate,
  PerformWxpay,
  getCardList,
  getPerOrderDetail,
  getUnpayOrder,        // ← 新增
  PerformUnlockSeat,    // ← 新增
} from "@/api/lehuiperform";

export default {
  components: { PayPassword, Payment },
  data() {
    return {
      cardList: [],
      orderList: [],
      addrShow: {},
      total: 0,
      result: [],
      checked: "",
      isShow: false,
      dataDetail: {},
      code: "",
      remark: "",
      dkprice: "",
      wxprice: "",
      ka_ids: [],
      pass: "",
      act: "",
      otherData: {},
      openid: "",
      loadingflag: true,
      isLoading: false,
      greeting: "",
      withChecked: false,
      HomeDelivery: true,
      type: "",
      valueNumber: "",
      brand: {},
      coupons: {},
      serverList: [
        {
          id: 1,
          icon: require("@/assets/yanchu/jinggao.png"),
          title: "不支持退",
        }, {
          id: 2,
          icon: require("@/assets/yanchu/dui.png"),
          title: "实名观影",
        },
      ],
      typesId: 0,
      phoneNum: "",
      userName: "",
      cardId: "",
      expressFee: 0,
      resultMoviegoer: [],
      address: {},
      StoreName: {},
      countdown: "",
      oid: "",
      isId: false
    }
  },
  methods: {
    // 取消锁座订单
    unlockSeat(oid) {
      if (!oid) return
      PerformUnlockSeat({ oid }).then(res => {
        if (res.code == 200) {
          this.$toast('订单已取消')
          this.getCard()
          // 不跳转
        } else {
          this.$toast(res.msg || '订单取消失败')
        }
      }).catch(() => {
        this.$toast('网络异常，请稍后再试')
      })
    },
    // 查用户有效期内未支付的订单
    checkUnpayOrder() {
      getUnpayOrder().then(res => {
        if (!(res.code == 200 && res.data && res.data.orderid)) return

        const oid = res.data.orderid



        this.$dialog.confirm({
          title: '提示',
          message: '您有一笔未支付的订单，是否继续支付？',
          confirmButtonText: '继续支付',
          cancelButtonText: '取消订单'
        }).then(() => {
          // 继续支付 → 跳未支付订单列表
          this.$router.replace({ path: '/orderInfo', query: { status: 'unpaid',refresh: Date.now()  } })
        }).catch(() => {
          // 取消订单 → 先取消订单，再返回上一页
          if (oid) {
            PerformUnlockSeat({ oid }).then(r => {
              if (r.code == 200) {
                this.$toast('订单已取消')
                this.getCard()
                setTimeout(() => {
                  this.$router.go(-1)
                }, 800)
              } else {
                this.$toast(r.msg || '订单取消失败')
              }
            }).catch(() => {
              this.$toast('网络异常，请稍后再试')
            })
          } else {
            this.$toast('请到订单列表取消订单')
            this.$router.go(-1)
          }
        })
      }).catch(err => {
        // getUnpayOrder 接口失败兜底
        console.warn('getUnpayOrder error:', err)
      })
    },
    parseTakeTicketTypes(val) {
      try {
        return val ? JSON.parse(val) : []
      } catch (e) {
        return []
      }
    },
    delSected(id) {
      this.resultMoviegoer = this.resultMoviegoer.filter(item => item.id != id)
      sessionStorage.setItem("resultMoviegoer", JSON.stringify(this.resultMoviegoer))
    },
    toChooseMaster(path) {
      let quantity = this.coupons.priceType == 0 ? this.coupons.quantity : this.coupons.quantity * this.coupons.count
      this.$router.push(path + "?quantity=" + quantity + "&id=" + this.coupons.projectId + "&selectAddress=1")
    },
    changeTypesId(id) {
      this.typesId = id
      sessionStorage.setItem("typesId", this.typesId)
    },
    timestampToTime(time) {
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
      return y + '-' + MM + '-' + d
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    onBridgeReady(params, order_no) {
      this.isLoading = false
      var that = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        "appId": params.appId,
        "timeStamp": params.timeStamp || params.timestamp,
        "nonceStr": params.nonceStr || params.noncestr,
        "package": params.package,
        "signType": params.signType,
        "paySign": params.paySign,
      },
        function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            that.$toast('支付成功！');
            PerformIsPaySuccess({
              order_no
            }).then(res => {
              that.getCard()
              if (res.code == 200) {
                setTimeout(() => {
                  that.$router.replace({ path: "/orderInfo", query: { refresh: Date.now()  } })
                }, 1000)
              }
            })
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            that.$toast('支付失败！');
          }
        });
    },
    input(e) {
      this.isShow = e
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    getdata() {
      this.otherData = {}
      var resArry = []
      this.resultMoviegoer.forEach(item => {
        resArry.push({
          realTicketOwnerName: item.name,
          realTicketOwnerIdCardNo: item.num,
        })
      })
      if (resArry.length > 0) {
        this.otherData.moviegoersInfo = JSON.stringify(resArry)
      }
      if (this.coupons.seatSelectType == 1) {
        this.otherData.type = 2
        this.otherData.zwtoken = this.coupons.priceId
        this.otherData.performId = this.coupons.performId
      } else {
        this.otherData.type = 1
        this.otherData.performPriceId = this.coupons.priceId
        this.otherData.count = this.coupons.quantity
      }
    },

    // ⑤ 修改：parseTakeTicketTypes + 去掉 res.status + Number 判断
    judgmentPayDate() {
      this.getdata();

      if (this.typesId === undefined || this.typesId === null || this.typesId === '') {
        this.$toast('取票方式错误');
        return;
      }

      let data = {
        fulika: this.result.join(","),
        buyerPhone: this.phoneNum,
        buyerName: this.userName,
        buyerCardNo: this.cardId,
        takeTicketTypeCode: this.typesId + "",
        takeTicketTypeOptional: this.parseTakeTicketTypes(this.coupons.takeTicketTypes).length > 2 ? '1' : '0',
        address_id: this.address.id || '',
        ...this.otherData
      }
      PerformIsPayDate(data).then(res => {
        if (res.code == 200 && res.data) {
          this.isLoading = true
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          this.code = res.data.code
          this.oid = res.data.orderid
          this.total = res.data.total

          if (Number(this.wxprice) != 0) {
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.shoptoWxpay()
          } else if (Number(this.dkprice) != 0) {
            this.isShow = true
            this.isLoading = false
          } else {
            this.isLoading = false
            this.$toast("无需支付")
          }
        } else if ((res.code == 400 || res.code == 201) && res.msg && res.msg.indexOf('待支付') > -1) {
          // 兼容 400 和 201 两种返回
          this.isLoading = false
          this.checkUnpayOrder()
        } else {
          this.$toast(res.msg || "下单失败")
          this.isLoading = false
        }
      })
    },

    // ⑥ 修改：同 ⑤
    judgmentPayDateIsId() {
      let data = {
        fulika: this.result.join(","),
        oid: this.$route.query.id
      }
      PerformOrderPaydate(data).then(res => {
        if (res.code == 200 && res.data) {
          this.isLoading = true
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          this.code = res.data.code
          this.oid = res.data.orderid
          this.total = res.data.total

          if (Number(this.wxprice) != 0) {
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.shoptoWxpay()
          } else if (Number(this.dkprice) != 0) {
            this.isShow = true
            this.isLoading = false
          } else {
            this.isLoading = false
            this.$toast("无需支付")
          }
        } else if ((res.code == 400 || res.code == 201) && res.msg && res.msg.indexOf('待支付') > -1) {
          this.isLoading = false
          this.checkUnpayOrder()
        }

        else {
          this.$toast(res.msg || "下单失败")
          this.isLoading = false
        }
      })
    },

    onInput(key) {
      this.pass = key
      if (this.pass.length == 6) {
        this.isShow = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },

    // ⑧ 修改：ka_ids 加 JSON.stringify
    flkpay(pass) {
      let data = {
        ka_ids: JSON.stringify(this.ka_ids),
        pass,
        code: this.code,
        oid: this.oid,
        total: this.total
      }
      PerformFlkpay(data).then(res => {
        this.isLoading = false
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getCard()
          setTimeout(() => {
            this.$router.replace({ path: "/orderInfo", query: { refresh: Date.now() } })
          }, 1000)
        }
      })
    },

    toPay() {
      if (this.isId) {
        this.judgmentPayDateIsId()
        return;
      }
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (this.coupons.quantity != this.resultMoviegoer.length && this.coupons.isOneTicketOneCard == 1) {
        this.$toast("请选择正确人数的观影人");
        return
      }
      // ⑩ 修改：改用 parseTakeTicketTypes
      if (!this.address.id && this.parseTakeTicketTypes(this.coupons.takeTicketTypes).includes(2)) {
        this.$toast("请选择收货地址");
        return
      }
      if (this.address.id && this.coupons.isOneTicketOneCard == 0) {
        this.userName = this.address.name
        this.phoneNum = this.address.phone
      }
      if (this.resultMoviegoer.length > 0 && this.coupons.isOneTicketOneCard == 1) {
        this.userName = this.resultMoviegoer[0].name
        this.phoneNum = this.resultMoviegoer[0].phone
        this.cardId = this.resultMoviegoer[0].num
      }
      if (this.userName == "") {
        this.$toast("请输入订票人姓名");
        return
      }
      if (!reg_tel.test(this.phoneNum)) {
        this.$toast("请正确填写您的手机号码");
        return
      }
      if (!_IDRe18.test(this.cardId) && this.coupons.isOneOrderOneCard == 1) {
        this.$toast("请正确填写您的身份证号");
        return
      }
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      this.judgmentPayDate()
    },

    // ⑦ 修改：ka_ids 加 JSON.stringify
    shoptoWxpay() {
      let data = {
        ka_ids: JSON.stringify(this.ka_ids),
        code: this.code,
        openid: this.openid,
        oid: this.oid,
        total: this.total
      }
      PerformWxpay(data).then(res => {
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },

    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(",") ? price.toString().includes(".") ? price.toString().split('.')[1] : "00" : price.toString().includes(".") ? price.toString().split('.')[1] : "00"
    },
    changeAdress() {
      this.$router.push("/address?change=0")
    },
    getCard() {
      getCardList().then(res => {
        if (res.code == 200) {
          this.cardList = res.data || []
          if (this.cardList.length !== 0 && this.result.length === 0) {
            this.result = [this.cardList[0].id]
          }
        }
      })
    },
    getExpressFee() {
      dramaApi("xuankua.drama.getExpressFee", {
        projectId: this.coupons.projectId,
        cityCode: sessionStorage.getItem("targetId"),
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          this.expressFee = Number(res.data).toFixed(2)
        }
      })
    },
    getDetail(id) {
      getPerOrderDetail({
        id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.coupons = res.data.order_show
        }
      })
    },
  },
  created() {

    this.getCard()
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.type = this.$route.query.type
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id)
      this.isId = true
    } else {
      this.isId = false
      this.loadingflag = false
      if (sessionStorage.getItem("data")) {
        this.coupons = JSON.parse(sessionStorage.getItem("data"))
      }

      // ⑨ 修改：parseTakeTicketTypes + String
      if (this.coupons.takeTicketTypes) {
        const types = this.parseTakeTicketTypes(this.coupons.takeTicketTypes);
        this.typesId = types.length > 0 ? String(types[0]) : '';
      } else {
        this.typesId = '';
      }
      console.log(this.coupons)
      this.serverList.push({
        id: 3,
        icon: require("@/assets/yanchu/dui.png"),
        title: this.coupons.issueEnterModesList.includes(2) ? '电子票入场' : '纸质票入场',
      })
      this.getExpressFee()
    }
    // ⑨ 修改：typesId 加 String
    if (sessionStorage.getItem("typesId")) {
      this.typesId = String(sessionStorage.getItem("typesId"))
    }
    if (sessionStorage.getItem("resultMoviegoer")) {
      this.resultMoviegoer = JSON.parse(sessionStorage.getItem("resultMoviegoer"))
    }
    if (sessionStorage.getItem("address")) {
      this.address = JSON.parse(sessionStorage.getItem("address"))
    }
    if (sessionStorage.getItem("StoreName")) {
      this.StoreName = JSON.parse(sessionStorage.getItem("StoreName"))
    }
  }
}
</script>


<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 66px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;
  position: relative;
}

.addressBox2 {
  margin-top: 10px;
}

.addressBox3 {
  padding: 0px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #FF3980, #FF4EA1);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .allNumber {
    font-size: 13px;
    color: #7a7979;
  }

  .all {
    font-weight: bold;
    font-size: 14px;

    .price {
      color: #C51045;
      font-size: 20px;
    }

    .priceNum {
      color: #C51045;
      font-size: 15px;
    }
  }
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


.shopInfo {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 85px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 15px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    /* 显示两行 */
  }

  .can {
    margin-top: 7px;
    font-size: 13px;
    color: #979797;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1;
    /* 显示两行 */
  }

  .can2 {
    font-size: 14px;
    color: #363636;
  }

  .all {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    color: #646464;
  }

  .price {
    //font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.loadingBox {
  width: 122px;
  position: fixed;
  top: calc(50% - 17px);
  left: calc(50% - 61px);
  background-color: rgba(50, 50, 51, .88);
  border-radius: 4px;
  height: 34px;
  line-height: 27px;
}

/deep/ .van-loading {
  color: white !important;
}

/deep/ .loadingText {
  color: #ffffff !important;
}


.noReapt {
  color: #D25D5B;
  border: 1px solid #D25D5B;
  display: inline-block;
  font-size: 10px;
  margin-top: 5px;
  border-radius: 2px;
  padding: 0px 5px 1px;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after,
.van-stepper__minus::before,
/deep/ .van-stepper__plus::after,
/deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.totalBox {
  border-top: 1px dotted #d5d5d5;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 5px;
  text-align: end;
  font-size: 14px;
  position: relative;

  .cicle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #F0F0F0;
    position: absolute;
    top: -6px;
    left: -16px;
  }

  .cicle2 {
    left: inherit;
    right: -16px;
  }
}

.priceIcon {
  color: #CB4342;
  font-size: 13px;
}

.price2 {
  color: #CB4342;
  font-size: 16px;
}

.priceNmber {
  color: #CB4342;
  font-size: 13px;
}

.tipsBox {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.tips {
  width: 12px;
  height: 12px;
}

.tipsMax {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.phoneBox {
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 12px 0px;
  position: relative;

  .phoneTitle {
    font-weight: bold;
    white-space: nowrap;
    font-size: 15px;
  }

  .with {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 30%;
    justify-content: flex-end;
  }

  .with2 {
    width: 100%;
    font-size: 12px;
  }

  .Selected {
    font-size: 12px;
    color: #848484;
    margin-top: 5px;
    font-weight: 500;
    padding-left: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }

  .ticket {
    color: #9C9C9C;
    border-radius: 7px;
    border: 1px solid #9C9C9C;
    height: 30px;
    line-height: 30px;
    padding: 0px 5px;
    white-space: nowrap;
  }

  .ticket2 {
    color: #CE315F;
    border: 1px solid #F1A6BC;
  }

  .inp {
    border: none;
    width: 60%;
    text-align: end;
  }
}

.phoneBox2 {
  border: none;
}

.phoneBox3 {
  display: block;
}

.phoneTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.masterList {
  padding: 0px 5px;

  .masterItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F6F6F6;
    padding: 8px 10px;
    margin-top: 10px;
    border-radius: 5px;

    .cardBox {
      margin-top: 5px;
      color: #797979;

      .cardNum {
        padding-left: 15px;
      }
    }
  }
}

.switch {
  padding-right: 3px;
  font-size: 12px;
  color: #CB5A7B;
}

.address {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pNum {
  font-weight: 500;
  color: #848484;
  font-size: 13px;
}

.paytime {
  position: absolute;
  font-size: 0.8em;
  color: red;
  background-color: #fff1d7;
  right: 0;
  padding-right: 3vw;
  border-top-right-radius: 10px;
  padding-left: 2vw;
  top: 0;
}
</style>