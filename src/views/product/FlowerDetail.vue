<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <!-- 1. 顶部轮播图（详情图） -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
        <van-swipe-item class="bannerImg" v-for="(item, index) in imgs" :key="index">
          <img class="img" :src="item" alt="">
        </van-swipe-item>
      </van-swipe>
      <div class="bannerNum">{{ onIndex }}/{{ imgs.length }}</div>
    </div>

    <!-- 2. 商品信息 -->
    <div class="shopInfo">
      <div class="priceBox">
        <div class="price">
          <span>{{ changePrice1(detail.discount_price) }}</span>.{{ changePrice2(detail.discount_price) }}
        </div>
        <div class="label" v-if="detail.original_price && detail.original_price !== detail.discount_price">
          <span style="text-decoration: line-through; color:#999;">原价 ¥{{ detail.original_price }}</span>
        </div>
      </div>

      <div class="shopName">{{ detail.product_name }}</div>
      <div class="shopSubtitle" v-if="detail.product_classify_name">
        {{ detail.product_classify_name }}
      </div>

      <div class="selectBox">
        <!-- 数量选择 -->


        <!-- 收货地址选择 -->


        <!-- 配送说明 -->

      </div>
    </div>

    <!-- 3. 商品详情图 -->
    <div class="shopDetail">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-if="detailImages.length" class="wcontent">
        <img v-for="(img, i) in detailImages" :key="i" :src="img"
          style="width:100%; display:block; margin-bottom:4px;" />
      </div>
      <div v-else class="no-content">暂无商品详情</div>
    </div>

    <!-- 4. 底部按钮：只有立即购买 -->
    <div>
      <van-goods-action>
        <van-goods-action-mini-btn @click="toKefu" :icon="require('../../assets/tubiao/kfz.png')" text="客服" />
        <van-goods-action-big-btn class="toPay" style="width:100%;" primary text="立即购买-" @click="openSelect" />
      </van-goods-action>
    </div>

    <!-- 5. 规格/数量 弹窗 -->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="closePopup">
            <van-icon size="18px" name="cross" />
          </div>

          <!-- 5.1 数量选择 -->
          <div v-if="selectId == 1">
            <div class="shopBox">
              <div class="shopImg">
                <img style="border-radius: 5px;" class="img" :src="detail.product_image" alt="">
              </div>
              <div style="width: 65%;">
                <div class="modelName">{{ detail.product_name }}</div>
                <div class="price">
                  ￥<span>{{ changePrice1(detail.discount_price) }}</span>.{{ changePrice2(detail.discount_price) }}
                </div>
              </div>
            </div>

            <!-- 数量 -->
            <div class="number">
              <div class="title">数量</div>
              <div>
                <van-stepper v-model="value" :min="1" />
              </div>
            </div>

            <!-- 姓名 -->
            <div class="form-row">
              <div class="form-label">收货人</div>
              <van-field class="form-field" v-model="receiverName" placeholder="请输入收货人姓名" maxlength="20" />
            </div>

            <!-- 电话 -->
            <div class="form-row">
              <div class="form-label">联系电话</div>
              <van-field class="form-field" v-model="receiverPhone" type="tel" placeholder="请输入联系电话" maxlength="11" />
            </div>
            <div class="form-row">
              <div class="form-label">送达时间</div>
              <div class="form-field time-field" @click="openTimePicker">
                <span :class="{ 'time-placeholder': !arriveTimeText }">
                  {{ arriveTimeText || '请选择送达时间' }}
                </span>
                <van-icon name="arrow" class="time-arrow" />
              </div>
            </div>
            <!-- 贺卡 -->
            <div style="margin-top:15px;">
              <div class="title">贺卡信息（选填）</div>
              <van-field v-model="cardInfo" rows="2" autosize type="textarea" maxlength="50" placeholder="如：生日快乐"
                show-word-limit />
            </div>

            <!-- 备注 -->
            <div style="margin-top:15px;">
              <div class="title">买家备注（选填）</div>
              <van-field v-model="remark" rows="2" autosize type="textarea" maxlength="100" placeholder="如：请在工作日送达"
                show-word-limit />
            </div>

            <!-- 地图选点 -->
            <div style="margin-top:15px;">
              <div class="title">收货地址</div>
              <div class="map-pick" @click="openMapPicker">
                <van-icon name="location-o" />
                <span>{{ locationText || '点击地图选点（必填）' }}</span>
              </div>
            </div>

            <div style="margin-top:15px;">
              <div class="title">门牌楼号</div>
              <van-field v-model="addressDetail" placeholder="如：XX小区 3号楼 502" maxlength="50" />
            </div>



          </div>

          <!-- 5.2 地址选择 -->



          <!-- 5.3 底部按钮 -->
          <div class="footer">
            <div class="button" v-if="selectId == 1">
              <div class="resetting complete" style="width:100%;" @click="submitOrder">确认下单-</div>
            </div>
            <div class="button" v-if="selectId == 2">
              <div class="resetting complete" @click="addNewAddress"
                style="width: 100%;background-image: linear-gradient(to right,#F55655,#DB0605);">
                添加新地址
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <van-popup v-model="showTimePicker" position="bottom" round>
      <van-datetime-picker v-model="tempArriveTime" type="datetime" title="选择送达时间" :min-date="minDate"
        :max-date="maxDate" :min-hour="minHour" :formatter="timeFormatter" @confirm="confirmTime"
        @cancel="showTimePicker = false" />
    </van-popup>
  </div>
</template>


<script>


import { flowerProductDetail, flowerSaveOrder } from "@/api/flower";
import { addressSetDefault } from "@/api/lhjdtm";
export default {
  name: "FlowerDetail",
  data() {
    return {
      arriveTime: "",
      arriveTimeText: "",
      showTimePicker: false,
      tempArriveTime: new Date(),
      minDate: new Date(),
      maxDate: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      minHour: 0,

      receiverName: "",
      receiverPhone: "",
      cardInfo: "",
      remark: "",
      location: "",
      locationText: "",
      onIndex: 1,
      loadingflag: true,
      detail: {},
      value: 1,
      showAll: false,
      selectId: 1,
      chosenAddressId: "",
      addressText: "请选择配送地址",
      address_id: "",
      addList: [],
      isWeiXinFlag: false,
      pendingSubmit: false, addressDetail: ''
    };
  },
  computed: {
    // 轮播图：优先详情图，没有就用首图
    imgs() {
      const list = this.detail.detail_images || [];
      if (list.length) return list;
      return this.detail.product_image ? [this.detail.product_image] : [];
    },
    // 详情长图
    detailImages() {
      return this.detail.detail_images || [];
    }
  },
  watch: {
    '$route.query.product_id'(newId) {
      if (newId) {
        this.loadingflag = true
        this.getDetail(newId)
      }
    }
  },
  methods: {
    openTimePicker() {
  const min = new Date(Date.now() + 60 * 60 * 1000);
  const now = new Date();

  // 最小可选日期 = min 所在日期
  this.minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate());
  this.maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);

  // 若 min 和 now 同一天，限制最小小时
  if (
    min.getFullYear() === now.getFullYear() &&
    min.getMonth() === now.getMonth() &&
    min.getDate() === now.getDate()
  ) {
    this.minHour = min.getHours();
  } else {
    this.minHour = 0;
  }

  // 默认选中值直接给「最小合法时间」，用户一打开就是最早可选时间
  this.tempArriveTime = min;
  this.showTimePicker = true;
},

confirmTime(val) {
  const min = new Date(Date.now() + 60 * 60 * 1000);

  // 如果用户选的时间 < 当前+1h，自动纠正为 min，并提示
  if (val.getTime() < min.getTime()) {
    this.tempArriveTime = min;
    this.$toast(`送达时间不能早于 ${this.formatTime(min)}`);
    return; // 不关闭 picker，让用户看到已纠正
  }

  this.arriveTime = String(Math.floor(val.getTime() / 1000));
  this.arriveTimeText = this.formatTime(val);
  this.showTimePicker = false;
},

    formatTime(date) {
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      return `${m}月${d}日 ${hh}:${mm}`;
    },

    timeFormatter(type, val) {
      if (type === "year") return val + "年";
      if (type === "month") return val + "月";
      if (type === "day") return val + "日";
      if (type === "hour") return val + "时";
      if (type === "minute") return val + "分";
      return val;
    },
    closePopup() {
      this.showAll = false
      this.clearFlowerForm()
    },
    restoreFlowerForm() {
      const showAll = sessionStorage.getItem('flowerShowAll')
      if (showAll === '1') {
        this.showAll = true
        this.selectId = Number(sessionStorage.getItem('flowerSelectId') || 1)
      }
      const rn = sessionStorage.getItem('flowerReceiverName')
      if (rn) this.receiverName = rn
      const rp = sessionStorage.getItem('flowerReceiverPhone')
      if (rp) this.receiverPhone = rp
      const ci = sessionStorage.getItem('flowerCardInfo')
      if (ci) this.cardInfo = ci
      const rk = sessionStorage.getItem('flowerRemark')
      if (rk) this.remark = rk
      const ad = sessionStorage.getItem('flowerAddressDetail')
      if (ad) this.addressDetail = ad
    },

    clearFlowerForm() {
      sessionStorage.removeItem('flowerShowAll')
      sessionStorage.removeItem('flowerSelectId')
      sessionStorage.removeItem('flowerReceiverName')
      sessionStorage.removeItem('flowerReceiverPhone')
      sessionStorage.removeItem('flowerCardInfo')
      sessionStorage.removeItem('flowerRemark')
      sessionStorage.removeItem('flowerAddressDetail')
    },
    openMapPicker() {
      // 存弹窗状态和表单
      sessionStorage.setItem('flowerShowAll', '1')
      sessionStorage.setItem('flowerSelectId', String(this.selectId))
      sessionStorage.setItem('flowerReceiverName', this.receiverName || '')
      sessionStorage.setItem('flowerReceiverPhone', this.receiverPhone || '')
      sessionStorage.setItem('flowerCardInfo', this.cardInfo || '')
      sessionStorage.setItem('flowerRemark', this.remark || '')
      sessionStorage.setItem('flowerAddressDetail', this.addressDetail || '')
      sessionStorage.setItem("mapPickFrom", "flowerDetail");
      this.$router.push("/mapPicker");
    },

    getWxSign() {
      return new Promise((resolve, reject) => {
        // ✅ 用当前页 URL（首次进入时记录，避免 iOS SPA 签名问题）
        const purl = sessionStorage.getItem('flowerSignUrl') || window.location.href.split('#')[0];
        getWechat({ url: purl }).then(res => {
          if (res.code == 200 && res.data) {
            // ⚠️ 注意字段名
            resolve({
              debug: false,
              appId: res.data.appId,               // ✅ appId 不是 appid
              timestamp: "" + res.data.timestamp,  // ✅ timestamp 不是 time
              nonceStr: res.data.nonceStr,
              signature: res.data.signature,
              jsApiList: ['chooseLocation', 'getLocation', 'openLocation']
            });
          } else {
            reject(new Error(res.msg || '获取签名失败'));
          }
        }).catch(reject);
      });
    },
    async getDetail(product_id) {
      console.log('[getDetail] 入参:', product_id, typeof product_id);   // ⚠ 这行
      try {
        const res = await flowerProductDetail({ product_id });
        this.loadingflag = false;
        console.log('[getDetail] 返回:', res);
        if (res.code === 200 && res.data) {
          this.detail = res.data;
        } else {
          this.$toast("商品不存在");
          setTimeout(() => this.$router.go(-1), 800);
        }
      } catch (e) {
        console.error('[getDetail] 异常:', e);
        this.loadingflag = false;
        this.$toast("网络异常");   // ⚠ 你看到的弹窗
      }
    },
    changePrice1(price) {
      if (!price) return "0";
      return price.toString().includes(".")
        ? price.toString().split(".")[0]
        : price;
    },
    changePrice2(price) {
      if (!price) return "00";
      return price.toString().includes(".")
        ? Number(price).toFixed(2).toString().split(".")[1]
        : "00";
    },

    onChange(index) {
      this.onIndex = index + 1;
    },

    // 打开数量弹窗
    openSelect() {
      if (!localStorage.getItem("token")) {
        this.$router.push(this.isWeiXin() ? "/quickLogin" : "/login");
        return;
      }
      this.selectId = 1;
      this.showAll = true;
      // 存弹窗状态
      sessionStorage.setItem('flowerShowAll', '1')
      sessionStorage.setItem('flowerSelectId', '1')
    },

    // 打开地址弹窗
    openAddress() {
      if (!localStorage.getItem("token")) {
        this.$router.push(this.isWeiXin() ? "/quickLogin" : "/login");
        return;
      }
      this.selectId = 2;
      this.showAll = true;

    },

    isWeiXin() {
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },

    toKefu() {
      window.location.href = localStorage.getItem("kefu") || "";
    },

    editAddress(e) {
      this.$router.push({ path: "/addAddress", query: { id: e.id } });
    },

    changeDefault(e) {
      this.addressText = e.address;   // "张三 19910526028"
      this.address_id = e.id;
      this.chosenAddressId = e.id;
      addressSetDefault({ id: e.id }).then(res => {
        if (res.code == 200) {
          this.$toast(res.msg || "设置成功");
          this.showAll = false;

        }
      });
    },

    addNewAddress() {
      this.$router.push("/addAddress");
    },

    // 获取地址列表



    // 提交鲜花订单
    submitOrder() {
      // 1. 校验

      if (!this.receiverName.trim()) {
        this.$toast({
          message: '请输入收货人姓名',
          zIndex: 9999
        })
        return;
      }
      if (!/^1\d{10}$/.test(this.receiverPhone.trim())) {

        this.$toast({
          message: '请输入正确的手机号',
          zIndex: 9999
        })
        return;
      }
      if (!this.location) {

        this.$toast({
          message: '请先在地图上选点',
          zIndex: 9999
        })
        return;
      }
      if (!this.locationText) {

        this.$toast({
          message: '地图选点的地址为空，请重新选点',
          zIndex: 9999
        })
        return;
      }
      if (!this.addressDetail.trim()) {

        this.$toast({
          message: '请输入具体地址（小区/门牌/楼号',
          zIndex: 9999
        })
        return;
      }
      if (!this.arriveTime) {
        this.$toast({ message: '请选择送达时间', zIndex: 9999 });
        return;
      }
      const name = this.receiverName.trim();
      const phone = this.receiverPhone.trim();

      // 拼完整地址
      const fullAddress = this.addressDetail.trim()
        ? `${this.locationText} ${this.addressDetail.trim()}`
        : this.locationText;

      // delivery
      const delivery = JSON.stringify({
        name,
        phone,
        address: fullAddress
      });

      // 3. items：JSON 数组字符串
      const items = JSON.stringify([{
        product_id: String(this.detail.product_id),
        product_code: this.detail.product_code || "",
        name: this.detail.product_name,
        num: Number(this.value),
        url: this.detail.product_image || ""
      }]);

      // 4. arrive_time：秒级时间戳，当前时间 + 2 小时
      // const arriveTime = String(Math.floor(Date.now() / 1000) + 7200);

      // 5. location：必须是「经度,纬度」
      // ⚠️ mapPicker 返回的是什么格式？如果是「纬度,经度」，才需要反转
      let locationStr = this.location;
      if (locationStr && locationStr.includes(",")) {
        const [a, b] = locationStr.split(",").map(Number);
        // 如果第一个数绝对值 > 90，说明是经度，已经是「经度,纬度」
        // 如果第一个数绝对值 <= 90 且第二个数绝对值 > 90，说明是「纬度,经度」，要反转
        if (Math.abs(a) <= 90 && Math.abs(b) > 90) {
          locationStr = `${b},${a}`;
        } else {
          locationStr = `${a},${b}`;
        }
      }

      // 6. 拼参数
      const params = {
        delivery,
        items,
        arrive_time: this.arriveTime,
        remark: this.remark || "",
        card_info: this.cardInfo || "",
        location: locationStr
      };

      console.log('【submitOrder】params:', params);

      // 7. 提交订单
      flowerSaveOrder(params).then(res => {
        console.log('【submitOrder】res:', res);

        if (res.code == 200 && res.data) {
          sessionStorage.removeItem("flowerPickedLocation");
          this.clearFlowerForm()   // 加

          setTimeout(() => {
            this.$router.push({
              path: "/FlowerConfirmOrder",
              query: {
                order_id: res.data.order_id,
                order_no: res.data.order_no,
                item_name: this.detail.product_name,
                item_price: this.detail.discount_price,
                item_img: this.detail.product_image || "",
                uuid: phone,
                num: this.value,
                addr_name: name,
                addr_phone: phone,
                addr_text: fullAddress
              }
            });
          }, 500);
        } else {
          this.$toast(res.msg || "下单失败");
        }
      }).catch((err) => {
        console.error('【submitOrder】err:', err);
        this.$toast("网络异常，请稍后重试");
      });
    },
    restoreLocation() {
      const raw = sessionStorage.getItem("flowerLocation");
      if (!raw) return;
      try {
        const obj = JSON.parse(raw);
        if (obj && obj.location) {
          this.location = obj.location;
          this.locationText = obj.text || obj.location || "";
        } else {
          this.location = raw;
          this.locationText = raw;
        }
      } catch {
        this.location = raw;
        this.locationText = raw;
      }
      sessionStorage.removeItem("flowerLocation");
      // ✅ 缓存已选位置，刷新后也能恢复

    },
  },
  created() {
    this.restoreFlowerForm()   // 加

    const productId = this.$route.query.product_id || this.$route.query.id;
    if (productId) {
      this.getDetail(productId);

    } else {
      this.loadingflag = false;
      this.$toast("缺少商品ID");
    }
  },

  activated() {
    this.restoreFlowerForm()   // 加
    this.restoreLocation()
  },
  mounted() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.pageYOffset = 0;
    this.restoreLocation();   //   加
  },




};
</script>
<style scoped lang="less">
.map-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  color: #ED2F35;
  font-size: 14px;
}

.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 60px;
  box-sizing: border-box;
}

/deep/ .van-swipe__indicator {
  display: none;
}

.banner {
  position: relative;
}

.bannerNum {
  background-color: #CCCCCC;
  border-radius: 30px;
  color: white;
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 43px;
  text-align: center;
  padding: 2px 0px;
}

.shopInfo {
  background-color: white;
  margin-top: -5px;
  padding: 10px 15px 5px;

  .priceBox {
    display: flex;
    gap: 15px;

    .label {
      color: #dc5654;
      background-color: #FEEDE3;
      text-align: center;
      white-space: nowrap;
      padding: 1px 6px;
      font-weight: bold;
      display: flex;
      font-size: 14px;
      align-items: center;
    }

    .price {
      color: #CA4543;
      font-weight: bold;
    }

    .price span {
      font-size: 20px;
    }
  }

  .shopName {
    font-weight: bold;
    line-height: 22px;
    margin-top: 5px;
    font-size: 15px;
  }

  .shopSubtitle {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }

  .selectBox {
    margin-top: 5px;
  }

  .specifications {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px;
    border-bottom: 1px solid rgba(241, 241, 241, 0.43);

    .specificationsImg {
      width: 24px;
      height: 24px;
    }

    .leftBox {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 90%;
    }

    .specificationsText {
      font-size: 13px;
      margin-top: -1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .specificationsText2 {
      white-space: pre-wrap;
    }

    .iconBox {
      color: #D4D4D4;
      margin-top: 6px;
    }
  }
}

.shopDetail {
  background-color: white;
  padding: 10px;
  margin-top: 10px;

  .shopDetailTextBox {
    padding: 7px 0px 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .line {
      border: 1px solid #F7F7F7;
      width: 50px;
    }

    .shopDetailText {
      font-size: 12px;
      color: #C3C3C3;
    }
  }
}

.van-button--large {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
}

.van-goods-action {
  padding-right: 10px;
}

.van-goods-action-mini-btn__icon {
  width: 24px;
  height: 24px;
}

.goCart {
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-image: linear-gradient(to right, #FFAA73, #FF8330);
}

.toPay {
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background-image: linear-gradient(to right, #E71D1E, #FA0707);
}

.goCart2 {
  background-image: linear-gradient(to right, #fff0, #fff0);
  background-color: #cccccc;
  border: 1px solid #cccccc;
}

.toPay2 {
  background-image: linear-gradient(to right, #fff0, #fff0);
  background-color: #8d8d8d;
  border: 1px solid #8d8d8d;
}

.popupBox {
  .van-popup--bottom {
    background-color: #FFFFFF !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    max-height: 70vh;
  }

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .popup {
    padding: 15px;
  }

  .footer {
    margin: auto;
    margin-top: 25px;
    box-sizing: border-box;
    width: 98%;
  }

  .button {
    display: flex;
    align-items: center;
    border-radius: 30px;
    overflow: hidden;
  }

  .resetting {
    background-image: linear-gradient(to right, #FFAA73, #FF8330);
    color: white;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
  }

  .complete {
    background-image: linear-gradient(to right, #E71D1E, #FA0707);
  }

  .shopBox {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shopImg {
    width: 83px;
  }

  .price {
    color: #CA4543;
    font-weight: bold;
    font-size: 13px;
    margin-top: 5px;
  }

  .price span {
    font-size: 18px;
  }

  .title {
    font-size: 15px;
    color: #737373;
  }

  .titleBox {
    margin-top: 15px;
  }

  .speBox {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .spe {
    color: #6c6c6c;
    border: 1px solid #c2c2c2;
    background-color: #fafafaab;
    border-radius: 30px;
    text-align: center;
    padding: 3px 10px;
    font-size: 13px;
    font-weight: bold;
  }

  .spe1 {
    background-color: #FFF7F5;
    color: #D14A4C;
    border: 1px solid #D14A4C;
  }

  .number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .addressTitle {
    text-align: center;
    font-weight: bold;
  }

  .van-button--large {
    display: none;
  }

  .van-address-list {
    padding: 0;
  }

  .van-address-item__name {
    font-weight: bold;
    color: #1F1F1F;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    border-color: #ED2F35;
    background-color: #ED2F35;
  }

  .address {
    margin-top: 15px;
  }
}

/* ===== 京东/天猫 富文本终极适配 ===== */

.modelName {
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 15px;
}

.bannerImg {
  height: 356px !important;
}



/* ===== 京东/天猫 富文本终极适配 ===== */
/* ===== 京东/天猫 富文本终极适配 ===== */
.wcontent {
  width: 100%;
  overflow: hidden;
}

.wcontent /deep/ .ssd-module-wrap {
  width: 750px !important;
  transform-origin: top left !important;
  -webkit-transform: scale(0.5) !important;
  transform: scale(0.5) !important;
  height: auto !important;
  max-height: none !important;
}

/* 针对背景图模块 */
.wcontent /deep/ div {
  width: 100% !important;
  background-size: 100% 100% !important;
  box-sizing: border-box;
}

/* 针对真实 img */
.wcontent /deep/ img {
  width: 100% !important;
  height: auto !important;
  display: block;
}

.no-content {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 30px 0;
}

.form-row {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.form-label {
  width: 90px;
  font-size: 15px;
  color: #737373;
  flex-shrink: 0;
}

.form-field {
  flex: 1;
  padding: 0;
  background: transparent;

  /deep/ .van-cell {
    padding: 0;
    background: transparent;
  }

  /deep/ .van-field__control {
    font-size: 14px;
    color: #333;
  }
}

.time-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
  padding: 0;
}

.time-placeholder {
  color: #c8c9cc;
}

.time-arrow {
  color: #c8c9cc;
  font-size: 14px;
}
</style>