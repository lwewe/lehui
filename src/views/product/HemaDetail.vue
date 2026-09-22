<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <!-- 轮播图 -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
        <van-swipe-item class="bannerImg" v-for="(item, index) in imgs" :key="index">
          <img class="img" :src="item" alt="">
        </van-swipe-item>
      </van-swipe>
      <div class="bannerNum">{{ onIndex }}/{{ imgs.length }}</div>
    </div>

    <!-- 商品信息 -->
    <div class="shopInfo">
      <div class="priceBox">
        <div class="price">
          <span>{{ changePrice1(detail.price) }}</span>.{{ changePrice2(detail.price) }}
        </div>
        <div class="label" v-if="detail.market_price && detail.market_price !== detail.price">
          <span style="text-decoration: line-through; color:#999;">原价 ¥{{ detail.market_price }}</span>
        </div>
      </div>

      <div class="shopName">{{ detail.title }}</div>
      <div class="shopSubtitle" v-if="detail.brand_name">{{ detail.brand_name }}</div>
      <div class="shopSubtitle" v-if="detail.fuzzy_quantity">{{ detail.fuzzy_quantity }}</div>

      <div class="selectBox">
        <div class="specifications" v-for="item in selectList" :key="item.id" @click="open(item.status, item.id)">
          <div class="leftBox">
            <div class="specificationsImg">
              <img class="img" :src="item.icon" alt="">
            </div>
            <div class="specificationsText" :style="{ width: item.id == 1 ? '67%' : '' }">{{ item.text }}</div>
          </div>
          <div class="iconBox" v-if="item.id != 3">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="shopDetail">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-if="detailImages.length" class="wcontent">
        <img v-for="(img, i) in detailImages" :key="i" :src="img" style="width:100%;display:block;margin-bottom:4px;" />
      </div>
      <div v-else class="no-content">暂无商品详情</div>
    </div>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-mini-btn @click="toKefu" :icon="require('../../assets/tubiao/kfz.png')" text="客服" />
      <van-goods-action-big-btn class="toPay" style="width:100%;" primary text="立即购买" @click="open('c', 1)" />
    </van-goods-action>

    <!-- 弹窗 -->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll = false">
            <van-icon size="18px" name="cross" />
          </div>

          <div v-if="selectId == 1">
            <!-- 规格 + 数量 -->
            <div class="shopBox">
              <div class="shopImg">
                <img style="border-radius: 5px;" class="img" :src="detail.picUrl" alt="">
              </div>
              <div style="width: 65%;">
                <div class="modelName">{{ modelName || detail.title }}</div>
                <div class="price" v-if="modelPrice">￥<span>{{ changePrice1(modelPrice) }}</span>.{{
                  changePrice2(modelPrice) }}</div>
              </div>
            </div>

            <div v-if="detail.skus && detail.skus.length > 0">
              <div class="titleBox">
                <div class="title">规格</div>
                <div class="speBox">
                  <div class="spe" :class="{ spe1: item.skuId == modelId }" v-for="item in detail.skus"
                    :key="item.skuId" @click="changemodelId(item)">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </div>

            <div class="number">
              <div class="title">数量</div>
              <van-stepper v-model="value" :min="1" />
            </div>

            <!-- 收货人 -->
            <div class="form-row">
              <div class="form-label">收货人</div>
              <van-field class="form-field" v-model="consigneeName" placeholder="请输入收货人姓名" maxlength="20" />
            </div>

            <!-- 电话 -->
            <div class="form-row">
              <div class="form-label">联系电话</div>
              <van-field class="form-field" v-model="consigneePhone" type="tel" placeholder="请输入联系电话" maxlength="11" />
            </div>

            <!-- 备注 -->
            <div style="margin-top:15px;">
              <div class="title">备注（选填）</div>
              <van-field v-model="remark" rows="2" autosize type="textarea" maxlength="100" placeholder="如：请放门口"
                show-word-limit />
            </div>

            <!-- 收货区域（逐级选择） -->
            <div style="margin-top:15px;">
              <div class="title">收货区域</div>
              <div class="area-pick" @click="openAreaPicker">
                <van-icon name="location-o" />
                <span>{{ areaText || '点击选择省/市/区/街道（必填）' }}</span>
              </div>
            </div>

            <!-- 详细地址 -->
            <div style="margin-top:15px;">
              <div class="title">详细地址</div>
              <van-field v-model="addressDetail" placeholder="如：光谷大道1号" maxlength="50" />
            </div>
          </div>

          <!-- 提交 -->
          <div class="footer">
            <div class="button" v-if="status == 'c'">
              <div class="resetting complete" style="width:100%;" @click="submitOrder">确认下单</div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>

    <!-- 区域选择弹窗 -->
    <van-popup v-model="showArea" position="bottom">
      <div class="area-popup">
        <div class="area-title">
          <span>
            {{ areaLevel === 1 ? '选择省' :
              areaLevel === 2 ? '选择市' :
                areaLevel === 3 ? '选择区' : '选择街道' }}
          </span>
          <van-icon name="cross" @click="showArea = false" />
        </div>
        <div class="area-list">
          <div class="area-item" v-for="item in areaList" :key="item.division_code" @click="pickArea(item)">
            {{ item.division_name }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { hemaProductsDetail, hemaCreateOrder, hemaAreasList } from "@/api/hemaapi";

export default {
  name: "HemaDetail",
  data() {
    return {
      loadingflag: true,
      onIndex: 1,
      detail: {},

      selectList: [
        { id: 1, icon: require("../../assets/tubiao/gg.png"), text: "请选择规格", status: "c" },
        { id: 3, icon: require("../../assets/tubiao/gj.png"), text: "预计48小时发货" }
      ],

      showAll: false,
      value: 1,
      status: null,
      selectId: 1,

      modelId: "",
      modelName: "",
      modelPrice: "",

      consigneeName: "",
      consigneePhone: "",
      remark: "",

      // 区域选择
      showArea: false,
      areaLevel: 1,
      areaList: [],
      areaText: "",
      divisionCode: "",
      townDivisionCode: "",
      provinceName: "",
      cityName: "",
      countyName: "",
      townName: "",

      addressDetail: "",

      localId: ""
    };
  },
 watch: {
  '$route'(to, from) {
    if (to.path !== '/HemaDetail') return;

    const newProductId = to.query.product_id || to.query.id;
    const oldProductId = from.query.product_id || from.query.id;
    const newLocalId = to.query.local_id;
    const oldLocalId = from.query.local_id;

    // product_id 或 local_id 任一变化就重拉
    if (newProductId !== oldProductId || newLocalId !== oldLocalId) {
      this.initFromRoute();
    }
  }
},
  computed: {
    imgs() {
      const list = this.detail.images || [];
      if (list.length) return list;
      return this.detail.picUrl ? [this.detail.picUrl] : [];
    },
    detailImages() {
      if (!this.detail.description) return [];
      return [`https:${this.detail.description}`];
    }
  },
  methods: {
    async getDetail(product_id) {
      try {
        const res = await hemaProductsDetail({ product_id });
        this.loadingflag = false;
        if (res.code === 200 && res.data) {
          this.detail = res.data;
          this.localId = res.data.local_id;

          if (this.detail.skus && this.detail.skus.length > 0) {
            this.modelId = this.detail.skus[0].skuId;
            this.modelName = this.detail.skus[0].title;
            this.modelPrice = this.detail.skus[0].price;
            this.selectList[0].text = this.modelName;
          } else {
            this.modelName = this.detail.title;
            this.modelPrice = this.detail.price;
            this.selectList[0].text = this.detail.title;
          }
        } else {
          this.$toast("商品不存在");
          setTimeout(() => this.$router.go(-1), 800);
        }
      } catch (e) {
        console.error('[getDetail] 异常:', e);
        this.loadingflag = false;
        this.$toast("网络异常");
      }
    },

    changemodelId(item) {
      this.modelId = item.skuId;
      this.modelName = item.title;
      this.modelPrice = item.price;
      this.selectList[0].text = item.title;
    },

    changePrice1(price) {
      if (!price) return "0";
      return price.toString().includes(".") ? price.toString().split(".")[0] : price;
    },
    changePrice2(price) {
      if (!price) return "00";
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split(".")[1] : "00";
    },

    onChange(index) { this.onIndex = index + 1 },

    open(status, id) {
      if (id == 3) return;
      if (!localStorage.getItem("token")) {
        this.$router.push(this.isWeiXin() ? "/quickLogin" : "/login");
        return;
      }
      this.selectId = id;
      this.showAll = true;
      this.status = status;
    },

    isWeiXin() {
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },

    toKefu() {
      window.location.href = localStorage.getItem("kefu") || "";
    },

    // ============ 区域选择 ============
    openAreaPicker() {
      this.areaLevel = 1;
      this.fetchAreas("1");
      this.showArea = true;
    },

    async fetchAreas(parent_code) {
      try {
        const res = await hemaAreasList({ parent_code });
        if (res.code === 200 && res.data) {
          this.areaList = res.data;
        }
      } catch (err) {
        console.error("hemaAreasList 失败:", err);
      }
    },

    async pickArea(item) {
      if (this.areaLevel === 1) {
        this.provinceName = item.division_name;
        this.areaLevel = 2;
        await this.fetchAreas(item.division_code);
      } else if (this.areaLevel === 2) {
        this.cityName = item.division_name;
        this.areaLevel = 3;
        await this.fetchAreas(item.division_code);
      } else if (this.areaLevel === 3) {
        this.countyName = item.division_name;
        this.divisionCode = item.division_code;   // 区县编码
        this.areaLevel = 4;
        await this.fetchAreas(item.division_code);
      } else if (this.areaLevel === 4) {
        this.townName = item.division_name;
        this.townDivisionCode = item.division_code; // 街道编码

        this.areaText = [this.provinceName, this.cityName, this.countyName, this.townName]
          .filter(Boolean).join(" ");
        this.showArea = false;
      }
    },

    buildSkus() {
      const sku = (this.detail.skus || []).find(s => s.skuId === this.modelId) || {};
      return JSON.stringify([{
        product_id: this.localId,
        sku_id: this.modelId,
        quantity: Number(this.value),
        spec_name: sku.title || ""
      }]);
    },

    async submitOrder() {
      if (!this.consigneeName.trim()) {
        this.$toast({ message: '请输入收货人', zIndex: 9999 });
        return;
      }

      if (!/^1\d{10}$/.test(this.consigneePhone.trim())) {
        this.$toast({ message: '请输入正确的手机号', zIndex: 9999 });
        return;
      }

      if (!this.divisionCode) {
        this.$toast({ message: '请选择收货区域', zIndex: 9999 });
        return;
      }

      if (!this.addressDetail.trim()) {
        this.$toast({ message: '请输入详细地址', zIndex: 9999 });
        return;
      }

      if (!this.modelId) {
        this.$toast({ message: '请选择规格', zIndex: 9999 });
        return;
      }


      const params = {
        division_code: this.divisionCode,
        town_division_code: this.townDivisionCode || "",
        address_detail: `${this.areaText} ${this.addressDetail}`.trim(),
        consignee_name: this.consigneeName.trim(),
        consignee_phone: this.consigneePhone.trim(),
        remark: this.remark || "",
        skus: this.buildSkus()
      };

      console.log("【hemaCreateOrder】params:", params);

      hemaCreateOrder(params).then(res => {
        if (res.code === 200 && res.data) {
          this.$toast("下单成功，正在跳转支付...");
          this.showAll = false;
          setTimeout(() => {
            this.$router.push({
              path: "/ConfirmOrderHema",
              query: {
                order_id: res.data.order_id,
                order_no: res.data.order_no || "",
                total_price: res.data.pay_amount || 0,
                // 地址带过去，下一页只读展示
                consignee_name: this.consigneeName.trim(),
                consignee_phone: this.consigneePhone.trim(),
                address_detail: `${this.areaText} ${this.addressDetail}`.trim(),
                division_code: this.divisionCode,
                town_division_code: this.townDivisionCode || ""
              }
            });
          }, 500);
        } else {
          this.$toast(res.msg || "下单失败");
        }
      }).catch(() => {
        this.$toast("网络异常，请稍后重试");
      });
    },
    initFromRoute() {
      const productId = this.$route.query.product_id || this.$route.query.id;
        console.log('[HemaDetail] initFromRoute productId =', productId, 'query =', JSON.stringify(this.$route.query));
      this.localId = this.$route.query.local_id || "";

      // 重置一下详情，避免旧数据闪一下
      this.detail = {};
      this.selectList[0].text = "请选择规格";
      this.modelId = "";
      this.modelName = "";
      this.modelPrice = "";

      if (productId) {
        this.loadingflag = true;
        this.getDetail(productId);
      } else {
        this.loadingflag = false;
        this.$toast("缺少商品ID");
      }
    }
  },
  created() {
    this.initFromRoute();

  }
};
</script>



<style scoped lang="less">
.area-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  color: #ED2F35;
  font-size: 14px;
}

.area-popup {
  max-height: 60vh;
  display: flex;
  flex-direction: column;

  .area-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
  }

  .area-list {
    flex: 1;
    overflow-y: auto;
  }

  .area-item {
    padding: 12px 15px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;

    &:active {
      background: #f5f5f5;
    }
  }
}

.area-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  color: #ED2F35;
  font-size: 14px;
}

.area-popup {
  max-height: 60vh;
  display: flex;
  flex-direction: column;

  .area-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
  }

  .area-list {
    flex: 1;
    overflow-y: auto;
  }

  .area-item {
    padding: 12px 15px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;

    &:active {
      background: #f5f5f5;
    }
  }
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

/* ================= 1. 轮播图 ================= */
.banner {
  position: relative;
}

.bannerImg {
  height: 356px !important;
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

/* ================= 2. 商品信息 ================= */
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

    .iconBox {
      color: #D4D4D4;
      margin-top: 6px;
    }
  }
}

/* ================= 3. 商品详情 ================= */
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

.wcontent {
  width: 100%;
  overflow: hidden;

  /deep/ img {
    width: 100% !important;
    height: auto !important;
    display: block;
  }
}

.no-content {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 30px 0;
}

/* ================= 4. 底部按钮 ================= */
.van-goods-action {
  padding-right: 10px;
}

.van-goods-action-mini-btn__icon {
  width: 24px;
  height: 24px;
}

.toPay {
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background-image: linear-gradient(to right, #E71D1E, #FA0707);
}

/* ================= 5. 弹窗 ================= */
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

  .modelName {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
  }
}

/* ================= 6. 收货信息 ================= */
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

.map-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  color: #ED2F35;
  font-size: 14px;
}
</style>