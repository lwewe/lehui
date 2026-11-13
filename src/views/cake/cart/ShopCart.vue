 <template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <!-- 头部 -->
    <div class="topBox">
      <div class="leftBox cartText">
        <div class="nowrap">2购物车<span style="font-size: 14px">({{ cartList.length }})</span></div>
        <!-- <div class="leftBox address">
          <div class="iconBox"><van-icon name="location-o"/></div>
          <div>{{ address }}</div>
        </div> -->
      </div>
      <div class="manage nowrap" @click="manage" v-if="cartList.length>0">{{ !isDelete ? "管理" : "完成" }}</div>
    </div>

    <!-- 无商品 -->
    <div class="noneShop" v-if="cartList.length==0 && isShow">
      <div>
        <div class="noneImg"><img class="img" src="@/assets/tubiao/gn.png" alt=""></div>
        <div class="noneText">您的购物车是空的，快去逛逛吧</div>
        <div class="Strolling" @click="toStrolling">去逛逛</div>
      </div>
    </div>

    <!-- 有商品 -->
    <div class="haveShop" v-else>
      <van-checkbox
          @click="checkOnce(item)"
          class="checkbox"
          :label-disabled="true"
          checked-color="#FA6174"
          v-model="item.isCheckout"
          v-for="(item, index) in cartList"
          :key="item.id"
          :name="item"
          :disabled="isDisabled(item)"
      >
        <div class="shopBox">
          <div class="shopImg" @click.stop="toDetail2(item.product_id)">
            <img class="img" style="border-radius: 5px;" :src="item.product.image_path" alt="">
          </div>
          <div class="rightBox">
            <div class="shopName" v-if="item.product">{{ item.product.title }}</div>
            <div class="bottle" v-if="item.xinghao">{{ item.xinghao.name }}</div>
            <div class="bottle" v-if="isDisabled(item)">该商品不支持购买</div>
            <div class="priceBox" v-if="item.xinghao">
              <div class="price">￥{{ formatPrice(item.xinghao.price) }}</div>
              <div>
                <van-stepper @change="(val) => changeNumber(item.id, val)" v-model="item.quantity" :min="1"/>
              </div>
            </div>
          </div>
        </div>
      </van-checkbox>
    </div>

    <!-- 去结算 -->
    <div class="footer">
      <div class="allNumber">
        <van-checkbox :disabled="cartList.length==0" @click="selectAll" checked-color="#FA6174" v-model="allChecked">
          全选
        </van-checkbox>
      </div>
      <div class="rightBox">
        <div v-if="!isDelete">
          <div class="all">合计:
            <span class="price">{{ formatPrice(fullPrice) }}</span>
          </div>
        </div>
        <div class="toPay" :class="{toPay1: result.length==0}" @click="comfireCart">
          {{ !isDelete ? '去结算' : "移除商品" }}
          <span v-if="result.length>0">({{ result.length }})</span>
        </div>
      </div>
    </div>
    <NavigationTab :active="2"></NavigationTab>
  </div>
</template>

<script>
import NavigationTab from "@/components/NavigationTab.vue";
// 引入你接口文档里的最新方法
import { getCart, editCart, delCart, checkoutByCart } from "@/api/lehuicake";

export default {
  name: "ShopCart",
  components: {NavigationTab},
  data() {
    return {
      cartList: [],
      result: [],
      allChecked: false,
      isDelete: false,
      fullPrice: 0,
      loadingflag: true,
      address: "",
      isShow: true,
      cid: "", // 城市ID
    }
  },
  methods: {
    toDetail2(id) {
      // 跳转商品详情
      this.$router.push({path: "/CakeproductDetail", query: {id, cid: this.cid}})
    },

    // 判断商品是否不可购买 (status=0 或 can_buy=0)
    isDisabled(item) {
      if (this.isDelete) return false; // 管理模式不限制勾选
      if (!item.product || !item.xinghao) return true;
      return item.product.status != 1 || item.product.can_buy != 1 || item.xinghao.can_buy != 1;
    },

    // 格式化价格，保留两位小数
    formatPrice(price) {
      if (!price) return "0.00";
      return Number(price).toFixed(2);
    },

    // 结算或删除
    comfireCart() {
      if (this.result.length == 0) return;
      
      const cartIds = this.result.map(item => item.id).join(",");

      // 管理模式 -> 删除
      if (this.isDelete) {
        this.$dialog.confirm({
          message: '是否删除这' + this.result.length + "个商品",
          confirmButtonColor: 'red'
        }).then(() => {
          this.isShow = false;
          delCart(cartIds).then(res => {
            if (res.code == 200) {
              this.$toast("删除成功");
              this.getCartList();
              this.manage(); // 退出管理状态
            } else {
              this.$toast(res.msg || "删除失败");
            }
          });
        }).catch(() => {});
        return;
      }

      // 正常结算 -> 跳转确认订单，带上 cartIds 和 cid
      this.$router.push({
        path: "/CakeconfirmOrder",
        query: { 
          cartIds: cartIds, 
          act: 1, 
          cid: this.cid 
        }
      });
    },

    // 修改数量
    changeNumber(id, num) {
      if (num <= 0) return;
      editCart(id, num).then(res => {
        if (res.code == 200) {
          this.getFullPrice();
        }
      });
    },

    // 计算选中总价
    getFullPrice() {
      this.fullPrice = 0;
      this.result = this.cartList.filter(item => item.isCheckout === true);
      this.result.forEach(item => {
        if (item.xinghao && item.xinghao.price) {
          this.fullPrice += Number(item.xinghao.price) * Number(item.quantity);
        }
      });
    },

    // 全选
    selectAll() {
      if (this.cartList.length == 0) return;
      this.allChecked = !this.allChecked;
      
      this.cartList.forEach(item => {
        if (!this.isDisabled(item)) {
          item.isCheckout = this.allChecked;
        }
      });
      this.getFullPrice();
    },

    // 单选
    checkOnce(item) {
      if (this.isDisabled(item)) return;
      item.isCheckout = !item.isCheckout;
      
      const availableItems = this.cartList.filter(item2 => !this.isDisabled(item2));
      this.allChecked = availableItems.every(item2 => item2.isCheckout === true);
      this.getFullPrice();
    },

    // 管理模式
    manage() {
      this.isDelete = !this.isDelete;
      this.cartList.forEach(item => { item.isCheckout = false; });
      this.allChecked = false;
      this.result = [];
      this.fullPrice = 0;
    },

    // 去逛逛
    toStrolling() {
      this.$router.replace('/CakeView');
    },

    // 获取购物车列表 (使用 cake/cart 接口)
    getCartList() {
      this.cid = sessionStorage.getItem("cityId");
      if (!this.cid) {
        this.$toast("请先选择城市");
        this.$router.replace('/CakeView');
        return;
      }
      
      this.cartList = [];
      this.loadingflag = true;
      
      getCart(this.cid).then(res => {
        this.loadingflag = false;
        this.isShow = true;
        if (res.code == 200 && res.data.cart_list) {
          // 给每个商品添加 isCheckout 字段
          this.cartList = res.data.cart_list.map(item => ({
            ...item,
            isCheckout: false
          }));
        }
      }).catch(() => {
        this.loadingflag = false;
      });
    }
  },
  created() {
    this.address = sessionStorage.getItem("streetNumber") || "请选择收货地址";
    this.getCartList();
  }
}
</script>

 
<style scoped lang="less">
.location {
  padding: 10px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
  background-color: #F7F7F7;
  padding-bottom: 120px;
}
 
.leftBox {
  display: flex;
  align-items: center;
}

.topBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  .cartText {
    gap: 20px;
  }

  .address {
    gap: 5px;
    font-size: 12px;
    color: #A2A2A2;
  }

  .iconBox {
    padding-top: 4px;
  }

  .manage {
    font-size: 14px;
  }
}

.noneShop {
  margin-top: 83px;

  .noneImg {
    width: 174px;
    margin: auto;
  }

  .noneText {
    text-align: center;
    color: #a6a5a5;
    font-size: 13px;
    margin-top: -40px;
  }

  .Strolling {
    background-color: #FA6174;
    border-radius: 5px;
    color: white;
    width: 116px;
    height: 33px;
    text-align: center;
    line-height: 33px;
    margin: auto;
    font-size: 13px;
    margin-top: 10px;
  }
}

.nowrap {
  white-space: nowrap;
}

.haveShop {
  .checkbox {
    background-color: white;
    margin-top: 10px;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .shopImg {
    width: 72px;
  }

  .shopBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .rightBox {
    width: 70%;
  }

  .shopName {
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

  }

  /deep/ .van-checkbox__label {
    width: 93%;
  }

  .bottle {
    color: #ABABAB;
    font-size: 12px;
    margin-top: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    margin-top: 20px;

    .price {
      color: #C63533;
      font-weight: bold;
    }
  }

  /deep/ .van-stepper__minus, .van-stepper__plus {
    width: 22px;
    height: 22px;
  }

  /deep/ .van-stepper__plus {
    width: 22px;
    height: 22px;
  }

  /deep/ .van-stepper__input {
    width: 28px;
    height: 24px;
    background-color: transparent;
    font-weight: bold;
    font-size: 16px;
  }
}

/deep/ .van-checkbox__icon .van-icon {
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
}

.footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1800;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #fa6174d6, #ff435a);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .toPay1 {
    background-image: linear-gradient(to right, #f55c6f78, #fa61749c);
  }

  .allNumber {
    font-size: 15px;
    color: #7a7979;
    font-weight: bold;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.noneList {
  position: relative;

  .model {
    position: absolute;
    border-radius: 10px;
    z-index: 999;
    height: 100%;
    width: 100%;
    background-color: #b9b9b95c;
    display: flex;
    align-items: center;
    justify-content: center;

    .modelText {
      background-color: #cccccc;
      color: #727272;
      border-radius: 50%;
      height: 75px;
      width: 75px;
      line-height: 75px;
      text-align: center;
      font-size: 12px;
      padding: 10px;
    }
  }
}
</style>