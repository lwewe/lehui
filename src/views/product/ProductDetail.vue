<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
        <van-swipe-item class="bannerImg" v-for="(item, index) in detail.imgs.length > 0 ? detail.imgs : [detail.img]"
          :key="index">
          <img class="img" :src="item" alt="">
        </van-swipe-item>
      </van-swipe>
      <div class="bannerNum">{{ onIndex }}/{{ detail.imgs ? detail.imgs.length : 0 }}</div>
    </div>

    <div class="shopInfo">
      <div class="priceBox">
        <div class="price">
          <span>{{ changePrice1(detail.sell_price) }}</span>.{{ changePrice2(detail.sell_price) }}
        </div>
        <div class="label" v-if="detail.cate_name">{{ detail.cate_name }}</div>
        <!-- <div class="label"  v-if="getPlatformName(detail.platform)"> {{ getPlatformName(detail.platform) }}</div> -->
      </div>

      <div class="shopName">{{ detail.title }}</div>
      <div class="shopSubtitle" v-if="detail.subtitle">{{ detail.subtitle }}</div>

      <div class="selectBox">
        <div class="specifications" :style="{ border: item.id == 3 ? 'none' : '' }" v-for="item in selectList"
          :key="item.id" @click="open(item.status, item.id)">
          <div class="leftBox">
            <div class="specificationsImg">
              <img class="img" :src="item.icon" alt="">
            </div>
            <div class="specificationsText" :class="{ specificationsText2: item.id == 3 }"
              :style="{ width: item.id == 1 ? '67%' : '' }">{{ item.text }}</div>
          </div>
          <div class="iconBox" v-if="item.id != 3">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <div class="shopDetail">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-if="detail.content" class="wcontent" v-html="detail.content"></div>
      <div v-else class="no-content">暂无商品详情</div>
    </div>

    <!--    底部button-->
    <div>
      <van-goods-action>
        <van-goods-action-mini-btn @click="toCart" :icon="require('../../assets/tubiao/gc.png')" text="购物车" />
        <van-goods-action-mini-btn @click="toKefu" :icon="require('../../assets/tubiao/kfz.png')" text="客服" />
        <van-goods-action-big-btn class="goCart" :class="{ goCart2: detail.stock == 0 }" text="加入购物车"
          @click="open('b', 1)" />
        <van-goods-action-big-btn class="toPay" :class="{ toPay2: detail.stock == 0 }" primary text="立即购买"
          @click="open('c', 1)" />
      </van-goods-action>
    </div>

    <!--    规格弹窗-->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll = false">
            <van-icon size="18px" name="cross" />
          </div>
          <div v-if="selectId == 1">
            <div class="shopBox">
              <div class="shopImg">
                <img style="border-radius: 5px;" class="img" :src="detail.img" alt="">
              </div>
              <div style="width: 65%;">
                <div class="modelName"> {{ modelName ? modelName : detail.title }}</div>
                <div class="price" v-if="modelPrice">￥<span>{{ changePrice1(modelPrice) }}</span>.{{
                  changePrice2(modelPrice) }}</div>
              </div>
            </div>

            <div v-if="detail.specs && detail.specs.length > 0">
              <div class="titleBox">
                <div class="title">规格</div>
                <div class="speBox">
                  <div class="spe" :class="{ spe1: item.id == modelId }" @click="changemodelId('规格', item)"
                    v-for="item in detail.specs" :key="item.id">{{ item.spec_name }}
                  </div>
                </div>
              </div>
            </div>

            <div class="number">
              <div class="title">数量</div>
              <div>
                <van-stepper v-model="value" :min="1" />
              </div>
            </div>
          </div>

          <div v-if="selectId == 2">
            <div class="addressTitle">{{ addList.length > 0 ? '选择收货地址' : '暂无地址请添加收货地址' }}</div>
            <div class="address">
              <van-address-list v-model="chosenAddressId" @edit="editAddress" @select="changeDefault" :list="addList" />
            </div>
          </div>

          <div class="footer">
            <div class="button" v-if="status == 'a'">
              <div class="resetting" @click="resetting">加入购物车</div>
              <div class="resetting complete" @click="toConfirmOrder">立即订购</div>
            </div>
            <div class="button" v-if="status == 'b'">
              <div class="resetting" style="width: 100%;" @click="resetting">加入购物车</div>
            </div>
            <div class="button" v-if="status == 'c'">
              <div class="resetting complete" style="width: 100%;" @click="toConfirmOrder">立即订购</div>
            </div>
            <div class="button" v-if="status == 'd'">
              <div class="resetting complete" @click="addNewAddress"
                style="width: 100%;background-image: linear-gradient(to right,#F55655,#DB0605);">添加新地址
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { productDetail, cartAdd, orderBuyNow, addressList, addressSetDefault } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'
export default {
  name: "ProductDetail",
  data() {
    return {
      onIndex: 1,
      selectList: [
        { id: 1, icon: require("../../assets/tubiao/gg.png"), text: "请选择规格", status: "a" },
        { id: 2, icon: require("../../assets/tubiao/dz.png"), text: "请选择配送地址", status: "d" },
        { id: 3, icon: require("../../assets/tubiao/gj.png"), text: "预计48小时发货" }
      ],
      showAll: false,
      value: 1,
      status: null,
      selectId: 2,
      chosenAddressId: '',
      addList: [],
      detail: { img: '', imgs: [], sell_price: '0', specs: [] },
      modelId: "",
      modelName: "",
      modelPrice: "",
      address_id: "",
      loadingflag: true
    }
  },
  methods: {
     getPlatformName,
    toCart() { this.$router.push("/shopCart") },
    toKefu() { window.location.href = localStorage.getItem("kefu") },

    changeDefault(e) {
      this.selectList[1].text = e.name + e.tel
      this.address_id = e.id
      this.chosenAddressId = e.id

      // 使用新接口
      addressSetDefault({ id: e.id }).then(res => {
        if (res.code == 200) {
          this.$toast(res.msg || '设置成功')
          this.showAll = false
          this.getAddressList()
        }
      })
    },

    // 加入购物车（按最新接口调整：POST /jdtmshop/cartAdd）
    resetting() {
      // 1. 判断是否必须选规格
      if (this.detail.specs && this.detail.specs.length > 0 && !this.modelId) {
        this.$toast("请选择规格");
        return;
      }

      // 2. 组装参数
      let params = {
        product_id: Number(this.detail.id),     // 商品ID
        quantity: Number(this.value),           // 数量
        sku: "",                                // 默认空字符串
        spec_name: ""                           // 默认空字符串
      };

      // 3. 如果选了规格，把选中的规格 SKU 和名称带入
      if (this.modelId) {
        let selectedSpec = this.detail.specs.find(item => item.id === this.modelId);
        if (selectedSpec) {
          params.sku = selectedSpec.sku || '';
          params.spec_name = selectedSpec.spec_name || selectedSpec.xinghao || '';
        }
      }

      // 4. 调用正确的接口
      cartAdd(params).then(res => {
        if (res.data) {
          this.$toast(res.data)
        }
        if (res.code == 200) {
          this.$toast("加入购物车成功");
          this.showAll = false;
        } else {
          this.$toast(res.msg || '加入购物车失败');
        }
      }).catch(err => {
        this.$toast('网络异常，请稍后重试')
      })
    },

    editAddress(e) { this.$router.push({ path: "/addAddress", query: { id: e.id } }) },

    changemodelId(type, item) {
      this.modelId = item.id
      this.modelName = item.spec_name || item.xinghao || ''
      this.modelPrice = item.price || this.detail.sell_price
      this.selectList[0].text = this.modelName
    },
    changePrice1(price) {
      if (!price) return '0'
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      if (!price) return '00'
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },

    onChange(index) { this.onIndex = index + 1 },

    open(status, id) {
      if (id == 3) return
      if (id == 2 && !localStorage.getItem("token")) {
        if (this.isWeiXin()) { this.$router.push("/quickLogin") }
        else { this.$router.push("/login") }
        return;
      }
      this.selectId = id
      if (this.detail.stock == 0) { this.$toast("该商品不可售"); return }
      this.showAll = true
      this.status = status
    },

    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger"
    },

    // 立即购买（对接新接口 /jdtmshop/orderBuyNow）
    toConfirmOrder() {
      // 1. 判断是否必须选规格
      if (this.detail.specs && this.detail.specs.length > 0 && !this.modelId) {
        this.$toast("请选择规格");
        return;
      }

      // 2. 必须有地址ID
      if (!this.address_id) {
        this.$toast("请先选择收货地址");
        return;
      }

      // 3. 组装参数
      let params = {
        product_id: Number(this.detail.id),     // 商品ID
        quantity: Number(this.value),           // 数量
        address_id: this.address_id,            // 地址ID
        platform: this.detail.platform || 1,    // 平台
        sku: "",                                // SKU
        spec_name: "",                          // 规格名称
        remark: ""                              // 备注
      };

      // 4. 如果有选中规格，把 SKU 和 规格名称填入
      if (this.modelId) {
        let selectedSpec = this.detail.specs.find(item => item.id === this.modelId);
        if (selectedSpec) {
          params.sku = selectedSpec.sku || '';
          params.spec_name = selectedSpec.spec_name || selectedSpec.xinghao || '';
        }
      }

      orderBuyNow(params).then(res => {
        if (res.code == 200) {
          if (res.data && res.data.order_id) {
            this.$toast("下单成功，正在跳转支付...")

            // 保存商品信息到 sessionStorage
            sessionStorage.setItem('orderProductInfo', JSON.stringify({
              product_title: this.detail.title,
              product_img: this.detail.img || '',
              sell_price: this.modelPrice || this.detail.sell_price,
              spec_name: params.spec_name || '',
              quantity: params.quantity,
               platform: this.detail.platform || 1 
            }))

            setTimeout(() => {
              this.$router.push({
                path: "/confirmOrder",
                query: {
                  order_id: res.data.order_id,
                  order_no: res.data.order_no,
                  total_price: res.data.total_price || this.modelPrice * this.value
                }
              })
            }, 500)
          }
        }
      })
    },

    addNewAddress() { this.$router.push("/addAddress") },

    getDetail(id) {
      productDetail({ id }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          if (!res.data) {
            this.$toast(res.msg || '商品不存在')
            setTimeout(() => { this.$router.go(-1) }, 800)
            return
          }

          // 渲染详情数据
          this.detail = res.data

          // 设置默认规格
          if (this.detail.specs && this.detail.specs.length > 0) {
            this.modelId = this.detail.specs[0].id
            this.modelName = this.detail.specs[0].spec_name || this.detail.specs[0].xinghao
            this.modelPrice = this.detail.specs[0].price || this.detail.sell_price
            this.selectList[0].text = this.modelName
          } else {
            this.modelName = this.detail.title
            this.modelPrice = this.detail.sell_price
            this.selectList[0].text = this.detail.title
          }

          // 单独获取地址列表（使用独立接口）
          this.getAddressList()

        } else {
          localStorage.removeItem("token")
          this.getDetail(this.$route.query.id)
        }
      })
    }, getAddressList() {
      addressList().then(res => {
        if (res.code == 200) {
          this.addList = []
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              let fullAddr = [item.province_name, item.city_name, item.county_name, item.town_name, item.addr]
                .filter(part => part)
                .join(' ')

              this.addList.push({
                id: item.id,
                name: fullAddr,
                tel: item.phone,
                address: item.name + " " + item.phone,
                is_default: item.is_default
              })
            })

            // 设置默认地址
            let defaultAddress = this.addList.find(item => item.is_default == 1) || this.addList[0]
            this.chosenAddressId = defaultAddress.id
            this.address_id = defaultAddress.id
            this.selectList[1].text = defaultAddress.name + defaultAddress.tel
          } else {
            this.selectList[1].text = "请选择配送地址"
            this.address_id = ""
          }
        }
      })
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id)
      if (localStorage.getItem("token")) {
        this.getAddressList()
      }
    } else {
      this.loadingflag = false
      this.$toast('缺少商品ID')
    }
  },
  mounted() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.pageYOffset = 0
  }
}
</script>

<style scoped lang="less">
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
  // white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
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
</style>