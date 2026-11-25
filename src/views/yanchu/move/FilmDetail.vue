<template>
  <div class="filmdetail">
    <ReturnBack :rcolor="'#000'" :bcolor="'rgb(255 255 255 / 84%)'"></ReturnBack>
    <NProgress v-if="loadingflag" />
    <div ref="topBox">
      <!--    顶部-->
      <div class="topBox" :style="'background-image: url(' + detailList.showPic + ')'">
        <div class="model"></div>
        <div class="topCenter">
          <div class="topImg">
            <img class="img" :src="detailList.showPic" alt="">
          </div>
          <div class="minPriceBox">
            <div class="projectName">{{ detailList.projectName }}</div>
            <div class="minPrice">￥<span>{{ detailList.minPrice }}</span> 起</div>
          </div>
        </div>
      </div>
      <!--    基本信息-->
      <div class="detailInfo">
        <div class="InfoItem">
          <div class="showStartTime" v-if="detailList.showStartTime && detailList.showEndTime">
            {{
              detailList.showStartTime.split(" ")[0]
            }}/{{ detailList.showEndTime.split(" ")[0].split("-").slice(1).join("-") }}
          </div>
        </div>
        <div class="InfoItem">
          <div style="width: 85%;">
            <div class="showStartTime venueName">{{ detailList.venueName }}</div>
            <div class="showStartTime venueAddress">{{ city }} {{ detailList.venueAddress }}</div>
          </div>
          <div>
            <div @click="navigateToMap">
              <div class="screen">
                <img class="img" src="@/assets/yanchu/luxian.png" alt="">
              </div>
              <div class="venueAddress screenText">路线</div>
            </div>
          </div>
        </div>
        <div class="InfoItem" style="border: none;padding: 12px 0px;" @click="open(1)">
          <div class="showStartTime tipsMax">
            <div class="tipsBox"
              v-for="item in seatSelectType == 1 ? serverList.slice(0, 5) : serverList.filter(item => item.title != '可选座').slice(0, 4)"
              :key="item.id">
              <div class="tips"><img class="img" :src="item.icon" alt=""></div>
              <div>{{ item.title }}</div>
            </div>
          </div>
          <div>
            <van-icon color="#A7A7A7" name="arrow" />
          </div>
        </div>
      </div>
    </div>
    <!--      详情-->
    <div class="detailContent" :id="'s' + 0">
      <div :class="{ tab: show }">
        <van-tabs @click="changeType" v-model="active" title-active-color="#3B3B3B" color="#F05B60" :line-width="15"
          :line-height="3">
          <van-tab title="详情"></van-tab>

          <van-tab title="推荐" v-if="shopList.length > 0"></van-tab>
        </van-tabs>
      </div>
      <div class="content" :style="{ paddingTop: show ? '60px' : '' }">
        <div v-html="detailList.showDetail"></div>
      </div>
    </div>

    <div class="downtimeBackBox" :id="'s' + 1" v-if="shopList.length > 0">
      <div class="downtimeBack">
        <div class="text">
          <img class="img" src="@/assets/yanchu/xicon1.png" alt="">
        </div>
        <div class="panicImg">
          为你推荐
        </div>
        <div class="text">
          <img class="img" src="@/assets/yanchu/xicon2.png" alt="">
        </div>
      </div>
    </div>
    <div class="listMax">
      <div class="listBox">
        <div class="listItem" v-for="item in shopList" :key="item.id">
          <ShopList :listItem="item" :flag="1" :detail="1"></ShopList>
        </div>

      </div>
    </div>

    <div class="goTop" @click.stop="goTop">
      <img class="img" src="@/assets/yanchu/db.png" alt="">
    </div>
    <!--    底部button-->
    <div class="button">
      <van-goods-action>
        <van-goods-action-mini-btn @click="toKefu" :icon="require('@/assets/fukaxq/kf.png')" text="客服" />
        <van-goods-action-mini-btn @click="changeCollect"
          :icon="isCollect ? require('@/assets/yanchu/yaol.png') : require('@/assets/yanchu/xiangyuao.png')" text="想看"
          class="minBtn" />
        <van-goods-action-big-btn class="toPay"
          :class="{ toPay2: btnText || (takeTicketTypeCode == 2 && calculateDaysDiff(detailList.showEndTime) <= 3) }"
          primary
          :text="btnText == 1 ? '暂未开售' : btnText == 2 ? '演出已结束' : (takeTicketTypeCode == 2 && calculateDaysDiff(detailList.showEndTime) <= 3) ? '演出即将开始,暂停售票' : '立即购票'"
          @click="open(2)" />
      </van-goods-action>
    </div>
    <!--    弹窗-->
    <div class="popupBox">
      <div class="projectName" v-if="selectId == 2 && showAll">{{ detailList.projectName }}</div>
      <van-popup v-model="showAll" position="bottom"
        :style="{ backgroundColor: selectId == 2 ? '#FAFAFA' : '', height: selectId == 2 ? '85vh' : '' }">
        <div class="popup" :style="{ paddingBottom: selectId == 2 ? '107px' : '' }">
          <div class="close" @click="showAll = false">
            <van-icon size="18px" name="cross" />
          </div>
          <!--          服务说明-->
          <div class="severBox" v-if="selectId == 1">
            <div class="severtitle">服务说明</div>
            <div class="severList">
              <div class="severItem"
                v-for="item in seatSelectType == 1 ? serverList : serverList.filter(item => item.title != '可选座')"
                :key="item.id">
                <div class="itemTop">
                  <div class="tips"><img class="img" :src="item.icon" alt=""></div>
                  <div>{{ item.title }}</div>
                </div>
                <div class="severInfo">{{ item.content }}</div>
              </div>
            </div>
          </div>
          <!--          场次-->
          <div class="sessionBox" v-if="selectId == 2">
            <div class="session">
              <div class="sessionTitle">场次</div>
              <div class="sessionList">
                <div class="sessionItem" @click="changeSessionId(item.performId, item)"
                  :class="{ sessionItem2: sessionId == item.performId }" v-for="item in sessionList" :key="item.id">
                  {{ item.performName }}
                </div>
              </div>
            </div>
            <div class="session2" v-if="seatSelectType != 1">
              <div class="sessionTitle">票档</div>
              <div class="sessionText" v-if="priceName">根据所选票面随机分配座位
                <span v-if="priceName.replace(/[0-9]/g, '')">({{ priceName.replace(/[0-9]/g, "") }})</span>
              </div>
              <div class="sessionList sessionList2">
                <div class="sessionItem sessionItem3" @click="changePriceIdId(item.priceId, item.count, index, item)"
                  :class="{ sessionItem2: priceId == item.priceId }" v-for="(item, index) in priceList" :key="item.id">
                  {{ Number(item.price) + Number(item.serviceFee) }}票面
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <div class="footer" v-if="selectId == 2 && showAll">
        <div class="titleBox valueNumber" style="border-bottom: 1px solid #F6F6F6;padding: 11px 15px;">
          <div class="title">数量</div>
          <div class="speBox">
            <van-stepper @change="changeNum" v-model="valueNumber" />
          </div>
        </div>
        <div class="titleBox valueNumber">
          <div class="title">
            <span class="price">￥{{ fullprice }}</span>
            <span class="selected">(已选{{ valueNumber }})</span>
          </div>
          <div class="speBox btn" @click="toPay">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'; // 引入的Swiper
import 'swiper/css/swiper.min.css'
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import BMap from "BMap"
//调用热映电影详情接口


import ShopList from "@/components/ShopListyanchu.vue";
import {
  addThinkSee, dramaApi, checkThinkSee,getUnpayOrder,PerformUnlockSeat} from "@/api/lehuiperform";

export default {
  components: { ShopList },
  data() {
    return {
      id: "",
      // 获取的该影片详情
      detailList: {},
      loadingflag: true,
      city: "",
      active: 0,
      show: false,
      shopList: [],
      targetId: "",
      showAll: false,
      serverList: [
        {
          id: 1,
          icon: require("@/assets/yanchu/jinggao.png"),
          title: "不支持退",
          content: "票品为有价证券，非普通商品，其背后承载的文化服务具有时效、特定性，如非活动变更、取消的原因外，不支持退换。购票时请务必仔细核对并谨慎下单"
        }, {
          id: 2,
          icon: require("@/assets/yanchu/dui.png"),
          title: "官方票",
          content: " 演出的票源由官方直供"
        }, {
          id: 3,
          icon: require("@/assets/yanchu/dui.png"),
          title: "可选座",
          content: "可先选座、后付款"
        }, {
          id: 4,
          icon: require("@/assets/yanchu/dui.png"),
          title: "现场取票",
          content: "可根据取票方式"
        }, {
          id: 5,
          icon: require("@/assets/yanchu/dui.png"),
          title: "一票一证",
          content: "本演出需实名制购票，一票一证。"
        }, {
          id: 6,
          icon: require("@/assets/yanchu/dui.png"),
          title: "客服开发票",
          content: " 需要开具发票的购票用户，请您在演出开始5日前，联系客服并提供开票信息，演出/活动结束后将统一由演出主办单位开具"
        },
      ],
      selectId: 1,
      valueNumber: 1,
      sessionList: [],
      sessionId: 0,
      priceList: [],
      priceId: 0,
      count: 1,
      fullprice: 0,
      indexNum: 0,
      sessionObj: {},
      priceObj: {},
      isCollect: false,
      type: "",
      btnText: "",
      seatSelectType: "",
      priceName: '',
      takeTicketTypeCode: "",
      isOneOrderOneCard: 0, //一单一证0_不是 1_是
      isOneTicketOneCard: 0, //一票一证0_不是 1_是
    }
  },
  methods: {
    changeCollect() {
      this.isCollect = !this.isCollect
      // if(this.isCollect){
      addThinkSee({
        ycid: this.detailList.projectId,	//是	string	演出项目ID
        img: this.detailList.showPic,	//是	string	演出图片
        type: this.type,	//是	string	演出类型
        title: this.detailList.projectName,//是	string	演出标题
        shijian: this.detailList.showStartTime.split(" ")[0].replace(/-/g, ".") + "-" + this.detailList.showEndTime.split(" ")[0].split("-").slice(1).join("."),	//是	string	演出时间 开始时间-结束时间
        address: this.city + " " + "|" + " " + this.detailList.venueName,	//是	string	地址
        price: this.detailList.minPrice,
      }).then(res => {
        // console.log(res)
      })
      // }
    },
    changeNum() {
      this.getFullPrice(this.indexNum)
    },
    getFullPrice(e) {

      this.fullprice = Number(((Number(this.priceList[e].price) + Number(this.priceList[e].serviceFee)) * this.valueNumber).toFixed(2))
    },
    toPay() {
      if (this.priceList.length == 0) {
        this.$toast("请选择其他场次")
        return;
      }

      // 先查有没有未支付订单
      getUnpayOrder().then(res => {
        const hasUnpay = (res.code == 200 && res.data && res.data.orderid) ||
          (res.code == 400 && res.msg && res.msg.indexOf('未支付') > -1)

        if (hasUnpay) {
          const oid = (res.data && res.data.orderid) || ''
          this.$dialog.confirm({
            title: '提示',
            message: '您有一笔未支付的订单，是否继续支付？',
            confirmButtonText: '继续支付',
            cancelButtonText: '取消订单'
          }).then(() => {
            // 继续支付 → 跳订单列表
            this.$router.push({ path: '/orderInfo', query: {   refresh: Date.now()} })
          }).catch(() => {
            // 取消订单 → 取消后继续购票
            this.unlockSeatAndGo(oid)
          })
        } else {
          // 没有未支付订单 → 正常购票
          this.goToPayment()
        }
      }).catch(err => {
        console.warn('getUnpayOrder error:', err)
        this.goToPayment()
      })

    },
    goToPayment() {
      sessionStorage.removeItem("typesId")
      sessionStorage.removeItem("address")
      sessionStorage.removeItem("resultMoviegoer")
      sessionStorage.removeItem("StoreName")
      let detail = this.detailList
      let sessionObj = this.sessionObj
      let priceObj = this.priceObj
      let data = {
        projectId: detail.projectId,
        projectName: detail.projectName,
        showPic: detail.showPic,
        venueAddress: detail.venueAddress,
        venueName: detail.venueName,
        performName: sessionObj.performName,
        isOneOrderOneCard: sessionObj.isOneOrderOneCard,
        isOneTicketOneCard: sessionObj.isOneTicketOneCard,
        issueTicketModesList: sessionObj.issueTicketModesList,
        issueEnterModesList: sessionObj.issueEnterModesList,
        takeTicketTypes: sessionObj.takeTicketTypes,
        price: priceObj.price,
        serviceFee: priceObj.serviceFee,
        quantity: this.valueNumber,
        priceType: priceObj.priceType,
        fullprice: this.fullprice,
        count: priceObj.count,
        id: detail.id,
        performId: this.sessionId,
        priceId: this.priceId,
        seatSelectType: this.seatSelectType
      }
      sessionStorage.setItem("data", JSON.stringify(data))
      if (this.seatSelectType == 1) {
        this.apiGetSeatToken()
        return
      }
      this.$router.push({ path: "/performPaymentPage" })
    },
    // 取消订单后再购票
    unlockSeatAndGo(oid) {
      if (!oid) {
        this.$toast('请到订单列表取消订单')
        this.$router.push({ path: '/orderInfo', query: {   refresh: Date.now() } })
        return
      }
      PerformUnlockSeat({ oid }).then(res => {
        if (res.code == 200) {
          this.$toast('订单已取消')
          this.goToPayment()
        } else {
          this.$toast(res.msg || '订单取消失败')
        }
      }).catch(() => {
        this.$toast('网络异常，请稍后再试')
      })
    },
    // 演出座位token信息
    apiGetSeatToken() {
      dramaApi("xuankua.drama.apiGetSeatToken", {
        projectId: this.id,
        performId: this.sessionId,
        callbackUrl: "http://yxfmm.bjyxfl.com/performance/#/paymentpage?1=1",
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
        }
      })
    },
    changeSessionId(performId, item) {
      this.sessionId = performId
      this.getDramaPerformPriceList()
      this.sessionObj = item
      this.seatSelectType = item.seatSelectType
      this.takeTicketTypeCode = item.takeTicketTypeCode
      this.isOneOrderOneCard = item.isOneOrderOneCard
      this.isOneTicketOneCard = item.isOneTicketOneCard
      this.serverList[4].title = item.isOneOrderOneCard == 1 ? '一单一证' : item.isOneTicketOneCard == 1 ? '一票一证' : ''
      this.serverList[4].content = item.isOneOrderOneCard == 1 ? '本演出需实名制购票，一单一证。' : item.isOneTicketOneCard == 1 ? '本演出需实名制购票，一票一证。' : ''
      if (item.takeTicketTypeName) {
        this.serverList[3].title = item.takeTicketTypeName
        this.serverList[3].content = item.takeTicketTypeCode == 1 ? '无纸质票,可凭借电子票入场' : item.takeTicketTypeCode == 2 ? '快递纸质票,可选择地址邮寄纸质票,演出结束前三天暂停售卖,避免演出开始还未收到快递票' : item.takeTicketTypeCode == 3 ? '自助取票' : item.takeTicketTypeCode == 4 ? '门店自取,可选择指定门店取票' : ''
      }
    },
    changePriceIdId(priceId, count, index, item) {
      this.priceId = priceId
      this.count = count
      this.indexNum = index
      this.getFullPrice(index)
      this.priceObj = item
      this.priceName = item.priceName
    },
    open(id) {
      if (id == 2 && this.btnText == 1) {
        this.$toast("暂未开售")
        return
      }
      if (id == 2 && this.btnText == 2) {
        this.$toast("演出已结束")
        return
      }
      if (id == 2 && this.takeTicketTypeCode == 2 && this.calculateDaysDiff(this.detailList.showEndTime) <= 3) {
        this.$toast("演出即将开始,暂停售票")
        return
      }
      this.selectId = id
      this.showAll = true
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    createMap() {
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        // 创建一个坐标点
        let point = new BMap.Point(longitude, latitude,);
        // 创建一个地理编码实例
        let geoc = new BMap.Geocoder();
        // 根据坐标点进行逆地理编码
        geoc.getLocation(point, (rs) => {
          let addComp = rs.address;
          let address = addComp
          // 对目的地进行地图可识别的编码（如特殊字符处理）
          let destination = _this.city + _this.detailList.venueAddress
          const encodedDestination = encodeURIComponent(destination);
          // 百度地图URL示例，需要替换API_KEY和SENSOR_BOOL
          const url = `https://api.map.baidu.com/direction?origin=${address}&destination=${encodedDestination}&mode=driving&region=${addComp.city}&output=html&src=yourSrc`;
          // 新窗口打开地图导航
          window.open(url, '_blank');
        });
        // console.log(city)
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    // 跳转地图
    navigateToMap() {

      let url
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
      var itemva = this.detailList
      if (this.isWeiXin()) {
        url = `http://api.map.baidu.com/marker?location=${itemva.latitude},${itemva.longitude}&title=${itemva.venueAddress}&content=${itemva.venueAddress}&output=html`
        if (url != '') {
          window.location.href = url
        }
      } else {
        this.createMap()
      }
    },
    // 距离现在有多少天
    calculateDaysDiff(date) {
      const targetDate = new Date(date);
      const currentDate = new Date();
      const timeDiff = targetDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
      return daysDiff
    },
    changeType(e) {
      document.querySelector('#s' + e).scrollIntoView(true);
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    // 返回顶部
    goTop() {
      var num = 0
      this.timer = setInterval(() => {
        num += 10
        document.documentElement.scrollTop -= num;
        if (document.documentElement.scrollTop <= 0) {
          clearInterval(this.timer)
        }
      }, 10)
    },
    //头部fixed定位
    showSearch() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > this.$refs.topBox.getBoundingClientRect().height) {   // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.show = true;
      } else {
        this.show = false;
      }
    },
    // 演出详情
    getDramaProjectDetail() {
      dramaApi("xuankua.drama.dramaProjectDetail", {
        projectId: this.id,
        ...this.$store.state.parameter
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detailList = res.data
          if (this.calculateDaysDiff(this.detailList.showEndTime) < 0) {
            this.btnText = 2
          }
          this.getCityName()
          this.getDramaProjectList()
          this.getDramaPerformList()
        }
      })
    },
    // 演出场次
    getDramaPerformList() {
      dramaApi("xuankua.drama.dramaPerformList", {
        projectId: this.detailList.projectId,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          this.sessionList = res.data
          if (this.sessionList.length == 0 && !this.btnText) {
            this.btnText = 1
          }
          if (this.sessionList.length > 0) {
            this.seatSelectType = this.sessionList[0].seatSelectType
            this.sessionId = this.sessionList[0].performId
            this.takeTicketTypeCode = this.sessionList[0].takeTicketTypeCode
            this.isOneOrderOneCard = this.sessionList[0].isOneOrderOneCard
            this.isOneTicketOneCard = this.sessionList[0].isOneTicketOneCard
            if (this.sessionList[0].isOneOrderOneCard == 0 && this.sessionList[0].isOneTicketOneCard == 0) {
              this.serverList = this.serverList.filter(item => item.id != 5)
            } else {
              this.serverList[4].title = this.sessionList[0].isOneOrderOneCard == 1 ? '一单一证' : this.sessionList[0].isOneTicketOneCard == 1 ? '一票一证' : ''
              this.serverList[4].content = this.sessionList[0].isOneOrderOneCard == 1 ? '本演出需实名制购票，一单一证。' : this.sessionList[0].isOneTicketOneCard == 1 ? '本演出需实名制购票，一票一证。' : ''
            }
            if (this.sessionList[0].takeTicketTypeName) {
              this.serverList[3].title = this.sessionList[0].takeTicketTypeName
              this.serverList[3].content = this.sessionList[0].takeTicketTypeCode == 1 ? '无纸质票,可凭借电子票入场' : this.sessionList[0].takeTicketTypeCode == 2 ? '快递纸质票,可选择地址邮寄纸质票,演出结束前三天暂停售卖,避免演出开始还未收到快递票' : this.sessionList[0].takeTicketTypeCode == 3 ? '自助取票' : this.sessionList[0].takeTicketTypeCode == 4 ? '门店自取,可选择指定门店取票' : ''
            } else {
              this.serverList = this.serverList.filter(item => item.id != 4)
            }
            this.sessionObj = this.sessionList[0]
            this.getDramaPerformPriceList()
          } else {
            this.serverList = this.serverList.filter(item => item.id != 4 || item.id != 5)
          }
        }
      })
    },
    // 演出场次价格
    getDramaPerformPriceList(performId) {
      dramaApi("xuankua.drama.dramaPerformPriceList", {
        performId: this.sessionId,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          this.priceList = res.data
          if (this.priceList.length > 0) {
            this.priceId = this.priceList[0].priceId
            this.count = this.priceList[0].count
            this.priceObj = this.priceList[0]
            this.priceName = this.priceList[0].priceName
            this.getFullPrice(0)
          }
        }
      })
    },
    // 演出列表
    getDramaProjectList() {
      dramaApi("xuankua.drama.dramaProjectList", {
        cityCode: this.targetId,
        pageNo: 1,
        pageSize: 30,
        cateId: this.detailList.cateId,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          this.shopList = res.data.records.filter(item => item.projectId != this.id)
        }
      })
    },
    // 查找地址位置
    getCityName() {
      // 创建一个坐标点
      let point = new BMap.Point(this.detailList.longitude, this.detailList.latitude);
      // 创建一个地理编码实例
      let geoc = new BMap.Geocoder();
      // 根据坐标点进行逆地理编码
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        this.city = addComp.city
      });
    },
    //   是否加入了想看
    isCheckthinksee() {
      checkThinkSee({
        ycid: this.id
      }).then(res => {
        if (res.code == 200) {
          this.isCollect = !!res.data.show
        }
      })
    },
  }
  ,
  created() {
    this.targetId = sessionStorage.getItem("targetId")
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getDramaProjectDetail()
    if (localStorage.getItem("token")) {
      this.isCheckthinksee()
    }
  }
  ,
  mounted() {
    window.addEventListener('scroll', this.showSearch);
  }
  ,
  beforeDestroy() {
    window.removeEventListener('scroll', this.showSearch, false);
  }
  ,
}
  ;
</script>

<style scoped lang="less">
.filmdetail {
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #F0F0F0;
  padding-bottom: 60px;
}

.img {
  display: block;
}

.topBox {
  background-size: cover;
  height: 192px;
  width: 100%;
  position: relative;
  display: flex;
  padding: 53px 10px 0px;
  box-sizing: border-box;

  .model {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #0000008a;
  }

  .topCenter {
    position: relative;
    z-index: 2;
    background-color: #a3a3a35c;
    border: 1px solid #9C9A99;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    gap: 15px;

    .topImg {
      width: 83px;
      border-radius: 5px;
      overflow: hidden;
      max-height: 112px;
    }

    .minPriceBox {
      width: 80%;
      color: white;

      .projectName {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        /* 显示两行 */
      }

      .minPrice {
        margin-top: 30px;
      }

      .minPrice span {
        font-size: 18px;
      }
    }
  }
}

.detailInfo {
  background-color: white;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  margin-top: -5px;
  position: relative;
  z-index: 6;
  padding: 0px 15px;

  .InfoItem {
    padding: 13px 0px;
    border-bottom: 1px solid #F4F4F4;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .showStartTime {
      font-size: 14px;
    }

    .venueName {}

    .venueAddress {
      color: #9E9E9E;
      font-size: 13px;
      margin-top: 1px;
    }

    .screen {
      width: 18px;
      margin: auto;
    }

    .screenText {
      text-align: center;
      margin-top: 3px;
      font-size: 12px;
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
    }
  }
}

.detailContent {
  margin-top: 8px;
  background-color: white;

  /deep/ .van-tabs__line {
    bottom: 20px;
    background-image: linear-gradient(to right, #FE7FC1, #FFACE1);
  }

  .tab {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 13;
  }

  .content {
    padding: 10px;
    display: block;
    word-break: break-all;
  }

  /deep/ p {
    margin: 0;
  }

  /deep/ img {
    width: 100% !important;
    height: auto !important;
    display: block !important;
  }
}

.noticeThat {
  background-color: white;
  margin-top: 8px;
  padding: 10px 20px;

  .noticeThatTop {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .allMore {
      color: #EA7E9C;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  .noctiveList {
    margin-top: 10px;

    .noctiveItem {
      background-color: #F7F8FA;
      border-radius: 10px;
      font-size: 13px;
      padding: 10px;
      width: 50%;
      margin-top: 5px;

      .time {
        color: #A6A7A9;
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }

}

.text {
  width: 17px;
}

.downtimeBack {
  display: flex;
  align-items: center;
  gap: 8px;
}

.downtimeBackBox {
  padding: 10px;
}

.listBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  //gap: 6px;
  width: 100%;
  align-items: flex-start;
  margin-top: -5px;
  padding: 0px 10px;
  box-sizing: border-box;
}

.listItem {
  width: 48.9%;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
}

.goTop {
  position: fixed;
  bottom: 123px;
  right: 5px;
  width: 40px;
}

.button {
  .van-button--large {
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
  }

  .van-goods-action {
    padding-right: 10px;
  }

  .van-goods-action-mini-btn__icon {
    width: 20px;
    height: 20px;
  }

  .minBtn {
    .van-goods-action-mini-btn__icon {
      width: 24px;
      height: 24px;
    }
  }

  .goCart {
    border-bottom-left-radius: 30px;
    border-top-left-radius: 30px;
    background-image: linear-gradient(to right, #FFAA43, #FEBA4B);
  }

  .toPay {
    border-radius: 30px;
    background-image: linear-gradient(to right, #FE488A, #FF50A3);
  }

  .goCart2 {
    background-image: linear-gradient(to right, #fff0, #fff0);
    background-color: #cccccc;
    border: 1px solid #cccccc;
  }

  .toPay2 {
    background-image: linear-gradient(to right, #fe488a57, #ff50a39c);
    background-color: transparent;
    border: 1px solid transparent;
  }
}

.popupBox {
  .projectName {
    position: absolute;
    top: 20px;
    left: 10px;
    z-index: 3000;
    color: white;
  }

  .van-popup--bottom {
    //background-color: #FFFFFF !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    min-height: 75vh;
    //height: 88vh;
  }

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .popup {
    padding: 15px;


    .severBox {
      .severtitle {
        text-align: center;
        font-weight: bold;
      }

      .severList {
        border: 1px solid #F6F6F6;
        border-radius: 10px;
        padding: 0px 15px;
        margin-top: 12px;
      }

      .severItem {
        padding: 14px 0px;
        border-bottom: 1px solid #F6F6F6;

        .itemTop {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 15px;
        }

        .severInfo {
          color: #848484;
          font-size: 12px;
          margin-top: 8px;
          line-height: 17px;
        }

        .tips {
          width: 14px;
          height: 14px;
        }
      }
    }

    .sessionBox {
      font-size: 14px;

      .sessionTitle {
        font-weight: bold;
      }

      .sessionText {
        font-size: 12px;
        margin-top: 6px;
        color: #898989;
      }

      .session {
        border-bottom: 1px solid #EFEFEF;
        padding-bottom: 15px;
      }

      .session2 {
        padding: 23px 0px;
      }

      .sessionList {
        margin-top: 13px;
      }

      .sessionList2 {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .sessionItem {
        color: #9D9D9D;
        background-color: #FFFFFF;
        border: 1px solid #DDDDDD;
        border-radius: 10px;
        min-width: 165px;
        height: 41px;
        line-height: 41px;
        text-align: center;
        font-size: 14px;
        margin-top: 8px;
        display: inline-block;
        padding: 0px 10px;
      }

      .sessionItem2 {
        color: #CA2253;
        border: 1px solid #CE325F;
      }

      .sessionItem3 {
        min-width: 85px;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 3000;
    background-color: white;
    width: 100%;

    .btn {
      color: white;
      background-image: linear-gradient(to right, #FF3981, #FF4EA2);
      width: 102px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 30px;
    }

    .price {
      color: #C91E50;
      font-size: 20px;
      font-weight: bold;
    }

    .selected {
      font-size: 12px;
      color: #888888;
      padding-left: 7px;
    }

    .valueNumber {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding: 7px 15px;
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
      background-color: #F26C92;
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

  }
}
</style>