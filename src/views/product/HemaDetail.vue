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
      <!-- <div class="shopSubtitle" v-if="detail.brand_name">{{ detail.brand_name }}</div> -->
      <!-- <div class="shopSubtitle" v-if="detail.fuzzy_quantity">{{ detail.fuzzy_quantity }}</div> -->

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
    <!-- 收货信息弹窗 -->

    <!-- 商品详情：兼容 HTML 片段 和 URL 两种格式 -->
    <div class="shopDetail">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>

      <div v-if="detailImages.length" class="wcontent">
        <img v-for="(img, index) in detailImages" :key="index" :src="img" alt="" class="desc-img" />
      </div>

      <!-- 情况2：description 是 HTML 片段 -->
      <div v-else-if="detailHtml" class="wcontent" v-html="detailHtml"></div>

      <!-- 情况3：都没有 -->
      <div v-else class="no-content">暂无商品详情</div>
    </div>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-mini-btn @click="toCart" :icon="require('../../assets/tubiao/gc.png')" text="购物车" />
      <van-goods-action-mini-btn @click="toKefu" :icon="require('../../assets/tubiao/kfz.png')" text="客服" />
      <!-- <van-goods-action-big-btn class="toPay" style="width:100%;" primary text="立即购买" @click="open('c', 1)" /> -->
      <van-goods-action-big-btn class="goCart" v-if="homeFlg != 1" :class="{ goCart2: detail.stock == 0 }" text="加入购物车"
        @click="open('b', 1)" />
      <van-goods-action-big-btn class="toPay" :style="{  borderRadius: homeFlg == 1 ? '30px' : '',width:'100%'}" primary text="立即购买" @click="openSelect" />

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


          </div>

          <div v-if="errorMsg" class="global-error">{{ errorMsg }}</div>

          <!-- 提交 -->
          <div class="footer">
            <div class="button" v-if="status == 'c'">
              <div class="resetting complete" style="width:100%;" @click="submitOrder">确认下单</div>
            </div>


            <div class="button" v-if="status == 'b'">
              <div class="resetting" style="width: 100%;" @click="resetting">加入购物车</div>
            </div>

          </div>
        </div>
      </van-popup>
    </div>


    <!-- 地址选择弹窗 -->
    <van-popup v-model="showAddressPopup" position="bottom" round>
      <div class="address-popup-box">
        <div class="popup-header">
          <div class="title">选择收货地址</div>
          <van-icon name="cross" @click="showAddressPopup = false" />
        </div>

        <!-- 有地址时展示列表 -->
        <div class="address-list" v-if="hemaAddressList.length > 0">
          <div class="address-item" :class="{ active: currentAddressId === item.id, disabled: item.can_hema !== 1 }"
            v-for="item in hemaAddressList" :key="item.id" @click="selectAddress(item)">
            <div class="info">
              <div class="name">
                {{ item.name }} <span class="phone">{{ item.phone }}</span>
                <span class="tag" v-if="item.is_default == 1">默认</span>
              </div>
              <div class="addr">{{ item.province_name }} {{ item.city_name }} {{ item.county_name }} {{ item.town_name
              }} {{ item.addr }}</div>
              <div class="tips" v-if="item.can_hema !== 1">该地址暂不支持盒马配送</div>
            </div>
            <van-icon name="success" color="#EE0A24" v-if="currentAddressId === item.id" />
          </div>
        </div>

        <!-- 无地址时展示提示 -->
        <div class="no-address" v-else>
          <van-icon name="location-o" size="30" color="#ccc" />
          <p>您还没有配送地址</p>
        </div>

        <!-- 底部新增按钮 -->
        <div class="popup-footer">
          <div class="add-btn" @click="goToAddAddress">+ 新增收货地址</div>
        </div>
      </div>
    </van-popup>
    <!-- 区域选择弹窗 -->

  </div>
</template>

<script>
import { hemaProductsDetail, hemaCreateOrder, hemaAreasList } from "@/api/hemaapi";
import { addressList, cartAdd } from "@/api/lhjdtm";

export default {
  name: "HemaDetail",
  data() {
    return {
      loadedProductId: "",   //    
      homeFlg:this.$route.query.homeFlg,
      loadingflag: true,
      onIndex: 1,
      detail: {},
      errorMsg: "",
      selectList: [
        { id: 1, icon: require("../../assets/tubiao/gg.png"), text: "请选择规格", status: "c" },
        { id: 2, icon: require("../../assets/tubiao/dz.png"), text: "请填写收货信息", status: "address" },
        { id: 3, icon: require("../../assets/tubiao/gj.png"), text: "预计48小时发货" },
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

      localId: "",



      // 🚨 新增这三个
      showAddressPopup: false,
      hemaAddressList: [],
      currentAddressId: "",

    };
  },
  watch: {
    '$route.query.product_id'(newVal, oldVal) {
      if (this.$route.path !== '/HemaDetail') return;
      if (!newVal || newVal === oldVal) return;
      this.initFromRoute();
    }
  },
  computed: {
    detailImages() {
      const list = this.detail.description_images || [];
      return Array.isArray(list) ? list.filter(Boolean) : [];
    },

    imgs() {
      const list = this.detail.images || [];
      if (list.length) return list;
      return this.detail.picUrl ? [this.detail.picUrl] : [];
    },

    detailHtml() {
      const d = this.detail.description || "";
      if (!d) return "";
      const decoded = d
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
      if (decoded.includes("<img") || decoded.includes("<p")) {
        return decoded;
      }
      return "";
    },

  },
  methods: {
    async loadDefaultAddress() {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await addressList({});
        if (res.code === 200 && res.data) {
          this.hemaAddressList = res.data; // 🚨 存给弹窗用

          if (res.data.length > 0) {
            const def = res.data.find(i => i.is_default == 1 && i.can_hema == 1)
              || res.data.find(i => i.can_hema == 1)
              || res.data[0];

            if (def) {
              this.currentAddressId = def.id;
              this.consigneeName = def.name || "";
              this.consigneePhone = def.phone || "";
              this.addressDetail = def.addr || "";
              this.divisionCode = def.division_code || "";
              this.townDivisionCode = def.town_division_code || "";
              this.areaText = [def.province_name, def.city_name, def.county_name, def.town_name].filter(Boolean).join(" ");

              if (def.can_hema == 1) {
                this.selectList[1].text = `${def.name || ""} ${def.phone || ""}`.trim();
              } else {
                this.selectList[1].text = "该地址暂不支持盒马配送，请重新选择";
              }
            }
          }
        }
      } catch (e) {
        console.error("loadDefaultAddress 失败:", e);
      }
    },

    // 加入购物车
    resetting() {
      if (this.detail.skus && this.detail.skus.length > 0 && !this.modelId) {
        this.$toast("请选择规格");
        return;
      }

      let pid = this.detail.local_id || this.localId;
      if (!pid) {
        this.$toast("商品ID异常，无法加购");
        return;
      }

      let params = {
        product_id: Number(pid),
        quantity: Number(this.value),
        sku: "",
        spec_name: ""
      };

      if (this.modelId) {
        let selectedSku = (this.detail.skus || []).find(item => item.skuId === this.modelId);
        if (selectedSku) {
          params.sku = selectedSku.skuId || '';
          params.spec_name = selectedSku.title || selectedSku.skuSpecsCode || '';
        }
      }

      cartAdd(params).then(res => {
        if (res.code == 200) {
          // 🚨 核心改动：把刚才选的地址存到缓存里，给收银台用
          if (this.currentAddressId) {
            sessionStorage.setItem('hemaConfirmData', JSON.stringify({
              address_id: this.currentAddressId,
              consignee_name: this.consigneeName,
              consignee_phone: this.consigneePhone,
              address_detail: this.addressDetail,
              display_address: `${this.areaText} ${this.addressDetail}`.trim(),
              division_code: this.divisionCode,
              town_division_code: this.townDivisionCode || ""
            }));
          }
          this.$toast("加入购物车成功");
          this.showAll = false;
        } else {
          this.$toast(res.msg || '加入购物车失败');
        }
      }).catch(err => {
        this.$toast('网络异常，请稍后重试');
      });
    },
    // 1. 获取地址列表，控制弹窗还是跳转
    async fetchAddressList() {
      try {
        const res = await addressList({});
        if (res.code === 200) {
          this.hemaAddressList = res.data || [];
          if (this.hemaAddressList.length > 0) {
            this.showAddressPopup = true; // 有地址，弹窗
          } else {
            this.$toast("暂无地址，去新增一个吧");
            this.goToAddAddress(); // 没地址，跳转
          }
        }
      } catch (e) {
        this.$toast("获取地址失败");
      }
    },

    // 2. 选中某个地址
    // 2. 选中某个地址
    selectAddress(item) {
      if (item.can_hema !== 1) {
        this.$toast('该地址暂不支持盒马配送，请更换或新增地址');
        return;
      }

      this.currentAddressId = item.id;
      this.consigneeName = item.name;
      this.consigneePhone = item.phone;
      this.addressDetail = item.addr;
      this.divisionCode = item.division_code;
      this.townDivisionCode = item.town_division_code || "";

      // 🚨 完整拼装省市区
      this.areaText = [item.province_name, item.city_name, item.county_name, item.town_name].filter(Boolean).join(" ");
      this.selectList[1].text = `${item.name} ${item.phone}`.trim();

      this.showAddressPopup = false; // 关闭弹窗
    },

    // 3. 去新增地址页
    goToAddAddress() {
      this.showAddressPopup = false;
      this.$router.push({
        path: "/addAddresshm",
        query: {
          from: "hemaDetail",
          product_id: this.$route.query.product_id || this.$route.query.id || "",
          local_id: this.$route.query.local_id || ""
        }
      });
    },
    openSelect() {
      if (!localStorage.getItem("token")) {
        this.$router.push(this.isWeiXin() ? "/quickLogin" : "/login");
        return;
      }


      // 收货信息完整 → 打开下单弹窗
      this.selectId = 1;
      this.status = "c";
      this.showAll = true;
    },
    async getDetail(product_id) {
      console.trace('[getDetail] 被调用, product_id =', product_id)   // ← 加这一行
      try {
        const res = await hemaProductsDetail({ product_id });
        this.loadingflag = false;
        console.log('description 原始:', JSON.stringify(res.data.description).slice(0, 200));

        if (res.code === 200 && res.data) {
          console.log("盒马商品详情数据：", res.data); // 👈 加这行
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
    toCart() { this.$router.push("/shopCartHm") },
    open(status, id) {
      if (id == 3) return;
      if (!localStorage.getItem("token")) {
        this.$router.push(this.isWeiXin() ? "/quickLogin" : "/login");
        return;
      }

      // 点「请填写收货信息」→ 弹收货信息弹窗
      // if (status === "address") {
      //   this.showAddressPopup = true;
      //   return;
      // }

      // 🚨 修改了这里：点地址栏不再直接跳转，而是去调接口弹窗
      if (status === "address") {
        this.fetchAddressList();
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
        this.divisionCode = item.division_code;
        this.areaLevel = 4;
        await this.fetchAreas(item.division_code);
      } else if (this.areaLevel === 4) {
        this.townName = item.division_name;
        this.townDivisionCode = item.division_code;

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
      this.errorMsg = "";
      if (!this.modelId) {
        this.errorMsg = "请选择规格";
        return;
      }

      // 1. 组装展示和下单所有数据
      let pid = this.detail.local_id || this.localId;
      let selectedSku = (this.detail.skus || []).find(item => item.skuId === this.modelId) || {};

      const params = {
        address_id: this.currentAddressId,
        division_code: this.divisionCode,
        town_division_code: this.townDivisionCode || "",
        // 🚨 这里的 address_detail 拼满
        address_detail: `${this.areaText} ${this.addressDetail}`.trim(),
        consignee_name: this.consigneeName.trim(),
        consignee_phone: this.consigneePhone.trim(),
        remark: this.remark || "",
        skus: JSON.stringify([{
          product_id: pid,
          sku_id: this.modelId,
          quantity: Number(this.value),
          spec_name: selectedSku.title || ""
        }]),
        product_title: this.detail.title,
        product_img: this.detail.picUrl || '',
        sell_price: this.modelPrice || this.detail.price,
        quantity: Number(this.value),
        spec_name: selectedSku.title || ""
      };

      // 🚨 最核心的改动：前端为了保证兼容，直接在这个缓存里带一个专门展示的字段
      sessionStorage.setItem('hemaConfirmData', JSON.stringify({
        ...params,
        display_address: `${this.areaText} ${this.addressDetail}`.trim()
      }));

      this.showAll = false;
      this.$router.push({
        path: "/ConfirmOrderHema",
        query: { t: new Date().getTime() }
      });
    },
    initFromRoute() {
      console.trace('[initFromRoute] 被调用')   // ← 加这一行
      const productId = this.$route.query.product_id || this.$route.query.id;
      console.log('[HemaDetail] initFromRoute productId =', productId, 'query =', JSON.stringify(this.$route.query));

      // 关键：同一 productId 不重复请求
      if (productId && productId === this.loadedProductId) {
        console.log('[HemaDetail] 相同 productId，跳过重复请求');
        return;
      }

      this.loadedProductId = productId || "";

      this.localId = this.$route.query.local_id || "";
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
    this.loadDefaultAddress();
  }, activated() {
    // 从新增地址页返回时刷新（若详情页被 keep-alive 缓存）
    this.loadDefaultAddress();
  },
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

.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 80px;
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
    margin-bottom: 4px;
  }

  /deep/ p {
    margin: 0;
  }
}

.desc-iframe {
  width: 100%;
  height: 800px;
  border: 0;
  display: block;
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


.goCart {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-image: linear-gradient(to right, #FFAA73, #FF8330);
}

.toPay {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  // border-radius: 30px;
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
    max-height: 90vh;
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

.hcard .van-cell {
  padding: 10px 0px !important;
}

.global-error {
  color: #ED2F35;
  font-size: 13px;
  text-align: center;
  margin-top: 15px;
  padding: 0 15px;
}


.time-placeholder {
  color: #c8c9cc;
}

.addressCard {
  position: relative;
  background-color: white;
  padding: 20px 15px 25px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .addressCard-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
    text-align: center;
  }
}


/* 地址选择弹窗样式 */
.address-popup-box {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  background: #F7F8FA;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #fff;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
  }

  .address-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;

    .address-item {
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid transparent;

      &.active {
        border-color: #EE0A24;
      }

      &.disabled {
        opacity: 0.6;
      }

      .info {
        flex: 1;
        padding-right: 10px;

        .name {
          font-size: 15px;
          font-weight: bold;
          color: #333;

          .phone {
            font-size: 13px;
            color: #666;
            margin-left: 8px;
            font-weight: normal;
          }

          .tag {
            font-size: 10px;
            background: #EE0A24;
            color: #fff;
            padding: 2px 4px;
            border-radius: 4px;
            margin-left: 6px;
          }
        }

        .addr {
          font-size: 13px;
          color: #666;
          margin-top: 6px;
          line-height: 1.4;
        }

        .tips {
          font-size: 12px;
          color: #EE0A24;
          margin-top: 4px;
        }
      }
    }
  }

  .no-address {
    padding: 40px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
  }

  .popup-footer {
    padding: 12px 16px 24px;
    background: #fff;
    border-top: 1px solid #f5f5f5;

    .add-btn {
      background: #EE0A24;
      color: #fff;
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>