<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <div class="topBox">
      <div class="leftBox cartText">
        <div class="nowrap">购物车<span style="font-size: 14px">({{ cartList.length }})</span></div>
      </div>
      <div class="manage nowrap" @click="manage">{{ !isDelete ? "管理" : "完成" }}</div>
    </div>

    <div class="noneShop" v-if="cartList.length == 0">
      <div class="noneImg"><img class="img" src="../../assets/tubiao/gn.png" alt=""></div>
      <div class="noneText">您的购物车是空的，快去逛逛吧</div>
      <div class="Strolling" @click="toStrolling">去逛逛</div>
    </div>

    <div class="haveShop" v-else>
      <!-- 外层循环：按平台分组 -->

      <div class="platform-group" v-for="group in groupedCartList" :key="group.platform">
        <!-- 平台头部（单个平台） -->
        <div class="platform-header">
          <van-checkbox :value="group.allChecked" @click="checkGroup(group)" checked-color="#EC3036"
            :label-disabled="true" style="display: flex;">
            <span class="platform-tag" :class="'platform-' + group.platform">
              <!-- {{ group.source_name || getPlatformName(group.platform, group.jd_type) }} -->
              {{ Number(group.platform) === 1 ? '京东' : getPlatformName(group.platform, group.jd_type) }}
            </span>
          </van-checkbox>
        </div>

        <!-- 内层循环：该平台下的商品 -->
        <div class="group-items">

          <van-checkbox @click="checkOnce(item)" class="checkbox" :label-disabled="true" checked-color="#EC3036"
            :value="item.isCheckout" v-for="(item, index) in group.items" :key="item.id">
            <div class="shopBox" @click.stop="toDetail2(item)">
              <div class="shopImg">
                <img class="img" style="border-radius: 5px;" :src="item.product.img" alt="">
              </div>
              <div class="rightBox">
                <div class="shopName">{{ item.product.title }}</div>
                <div class="bottle" v-if="item.spec_name">{{ item.spec_name }}</div>
                <div class="priceBox">
                  <div class="price">
                    <span style="font-size: 10px;">￥</span>{{ changePrice1(item.product.sell_price) }}.<span
                      style="font-size: 15px">{{ changePrice2(item.product.sell_price) }}</span>
                  </div>
                  <div @click.stop>
                    <van-stepper @change="changeQuantity(item)" v-model="item.quantity" :min="1" />
                  </div>
                </div>


                <div class="freight-line" v-if="getFreightFee(item) > 0">
                  运费：￥{{ getFreightFee(item).toFixed(2) }}
                </div>
                <div class="freight-line free" v-else-if="item.product.freight_type === 0">
                  <!-- 免运费 -->
                </div>

              </div>
            </div>
          </van-checkbox>
        </div>


        <div class="group-freight" v-if="getGroupFreight(group) > 0">
          <span class="freight-label">运费</span>
          <span class="freight-value">￥{{ getGroupFreight(group).toFixed(2) }}</span>
        </div>


      </div>
    </div>

    <div class="footer">
      <div class="allNumber">

        <van-checkbox @click="selectAll" checked-color="#EC3036" :value="allChecked">全选</van-checkbox>
      </div>
      <div class="rightBox">

        <div class="all">
          合计: <span class="price">{{ changePrice1(fullPrice) }}</span><span class="priceNum">.{{
            changePrice2(fullPrice) }}</span>
          <div class="freight-tip" v-if="getTotalFreight() > 0">
            (另需运费 <span style="font-size: 10px;">￥</span>{{ getTotalFreight().toFixed(2) }})
          </div>
        </div>


        <div class="toPay" :class="{ toPay1: result.length == 0 }" @click="comfireCart">
          {{ !isDelete ? '去结算' : "移除商品" }}
          <span v-if="result.length > 0">({{ result.length }})</span>
        </div>
      </div>
    </div>
    <NavigationTab :active="2"></NavigationTab>
  </div>
</template>

<script>
import NavigationTab from "@/components/NavigationTab.vue";
import { cartList, cartCheck, cartUpdateQuantity, cartDelete } from "@/api/lhjdtm";
import { getPlatformName } from '@/utils/platform'

export default {
  name: "ShopCart",
  components: { NavigationTab },
  data() {
    return {
      cartList: [],
      result: [],
      allChecked: false,
      isDelete: false,
      fullPrice: 0,
      isLoading: false,
      loadingflag: true,
      groupedCartList: [] // 分组后的数据
    }
  },
  methods: {
    getPlatformName,
    toDetail2(item) { 
      this.$goDetail(item);
      // this.$router.push({ path: "/productDetail", query: { id } }) 
    
    },

    // 分组逻辑
    groupCartList() {
      const groups = {};
      this.cartList.forEach(item => {
        const platform = Number(item.product.platform);
        const jdType = Number(item.product.jd_type || 0);
        const key = platform === 1 ? `jd_${jdType}` : `p_${platform}`;

        if (!groups[key]) {
          groups[key] = {
            key: key,
            platform: platform,
            jd_type: jdType,
            source_name: item.source_name || '',
            items: [],
            allChecked: false
          };
        }
        groups[key].items.push(item);
      });
      this.groupedCartList = Object.values(groups);
      this.updateGroupCheckedState();
    },

    // 更新每个分组的全选状态
    updateGroupCheckedState() {
      this.groupedCartList.forEach(group => {
        group.allChecked = group.items.every(item => item.isCheckout);
      });
    },

    // 单个平台的全选/取消全选
    checkGroup(group) {
      const newState = !group.allChecked;
      group.allChecked = newState;
      let ids = [];
      group.items.forEach(item => {
        item.isCheckout = newState;
        ids.push(item.id);
      });
      cartCheck({ ids: ids.join(","), checked: newState ? 1 : 0 }).then(res => {
        if (res.code != 200) this.$toast('同步失败');
      });
      this.getFullPrice();
      this.allChecked = this.result.length == this.cartList.length && this.cartList.length > 0;
      this.updateGroupCheckedState();
    },

    comfireCart() {
      if (this.result.length == 0) return
      let cartIds = []
      this.result.forEach(item => { cartIds.push(item.id) })

      if (this.isDelete) {
        this.$dialog.confirm({ message: '是否删除这' + this.result.length + "个商品", confirmButtonColor: 'red' })
          .then(() => {
            cartDelete({ ids: cartIds.join(",") }).then(res => {
              this.$toast(res.msg || '删除成功')
              if (res.code == 200) { this.getCart(); this.manage(); this.fullPrice = 0 }
            })
          }).catch(() => { })
        return;
      }

      this.isLoading = true

      let unCheckedIds = this.cartList
        .filter(item => !item.isCheckout)
        .map(item => item.id)

      const doCheck = () => {
        const idsStr = cartIds.join(",")
        cartCheck({ ids: idsStr, checked: 1 }).then(res => {
          this.isLoading = false
          if (res.code == 200) {
            this.$router.push({
              path: "/confirmOrder",
              query: {
                data: JSON.stringify({ cartIds: idsStr }),
                cartIds: idsStr   // ✅ 顶层再带一份
              }
            })
          } else {
            this.$toast(res.msg || '同步选中状态失败')
          }
        })
      }

      if (unCheckedIds.length > 0) {
        cartCheck({ ids: unCheckedIds.join(","), checked: 0 }).then(res => {
          if (res.code == 200) doCheck()
          else { this.isLoading = false; this.$toast('同步失败') }
        })
      } else {
        doCheck()
      }



    },

    changeQuantity(item) {
      cartUpdateQuantity({ id: item.id, quantity: item.quantity }).then(res => {
        if (res.code == 200) this.getFullPrice()
      })
    },

    changePrice1(price) { if (!price) return '0'; return price.toString().includes(".") ? price.toString().split('.')[0] : price },
    changePrice2(price) { if (!price) return '00'; return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00" },
    // 单商品运费
    getFreightFee(item) {
      if (Number(item.product?.freight_type) === 0) return 0
      return Number(item.product?.freight_fee || 0)
    },

    // 该平台运费合计（只算选中的）
    getGroupFreight(group) {
      return group.items
        .filter(i => i.isCheckout)
        .reduce((sum, i) => sum + this.getFreightFee(i), 0)
    },

    // 全部运费合计（只算选中的）
    getTotalFreight() {
      return this.cartList
        .filter(i => i.isCheckout)
        .reduce((sum, i) => sum + this.getFreightFee(i), 0)
    },
    getFullPrice() {
      this.fullPrice = 0
      this.result = this.cartList.filter(item => item.isCheckout == true)
      this.result.forEach(item => { this.fullPrice += Number(item.product.sell_price) * Number(item.quantity) })
      this.updateGroupCheckedState();
    },


    selectAll() {
      this.allChecked = !this.allChecked
      let ids = []
      if (this.allChecked) { this.cartList.forEach(item => { item.isCheckout = true; ids.push(item.id) }) }
      else { this.cartList.forEach(item => { item.isCheckout = false; ids.push(item.id) }) }
      cartCheck({ ids: ids.join(","), checked: this.allChecked ? 1 : 0 }).then(res => { if (res.code != 200) this.$toast('同步失败') })
      this.getFullPrice()
    },

    checkOnce(item) {
      const target = this.cartList.find(c => c.id === item.id)
      if (!target) return

      target.isCheckout = !target.isCheckout

      cartCheck({ ids: target.id, checked: target.isCheckout ? 1 : 0 }).then(res => {
        if (res.code != 200) this.$toast('同步失败')
      })

      this.result = this.cartList.filter(c => c.isCheckout == true)
      this.allChecked = this.result.length == this.cartList.length && this.cartList.length > 0
      this.getFullPrice()
    },
    manage() {
      this.isDelete = !this.isDelete
      let ids = this.cartList.map(item => item.id)
      this.cartList.forEach(item => { item.isCheckout = false })
      this.allChecked = false
      this.result = []
      this.fullPrice = 0
      this.updateGroupCheckedState()

      if (ids.length > 0) {
        cartCheck({ ids: ids.join(","), checked: 0 })
      }
    },

    toStrolling() { this.$router.replace('/index') },

    getCart() {
      cartList().then(res => {
        this.loadingflag = false
        if (res.code == 200 && res.data.list) {
          this.cartList = res.data.list.map(item => ({
            ...item,
            isCheckout: item.checked == 1 ? true : false
          }))

          // 优先用后端 groups
          if (res.data.groups && res.data.groups.length > 0) {
            this.groupedCartList = res.data.groups.map(g => ({
              platform: g.platform,
              jd_type: g.jd_type || 0,
              source_name: g.source_name || '',
              // ✅ 按 id 从 cartList 里拿同一对象，保证引用一致
              items: (g.items || [])
                .map(git => this.cartList.find(c => c.id === git.id))
                .filter(Boolean),
              allChecked: false
            }))
            this.updateGroupCheckedState()
          }
          else {
            this.groupCartList()
          }

          this.getFullPrice()
        }
      })
    }
  },
  created() { this.getCart() }
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
  margin-bottom: 10px;

  .cartText {
    gap: 20px;
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
    background-color: #E84040;
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

/* 平台分组容器 */
.platform-group {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 平台头部 */
.platform-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #F5F5F5;
}

.platform-tag {
  //  padding: 1px 4px;
  //  border-radius: 2px;
  line-height: 1.4;
  font-size: 14px;
  font-weight: 600;
  margin-left: 0px;
}

/* 京东 - 红色 */
.platform-1 {
  // background-color: rgb(221, 10, 9);
  color: #342C2C;
  // border: 1px solid #FFC4C4;
}

/* 天猫 - 红色/粉色 */
.platform-2 {
  //  background-color: rgb(221, 10, 9);
  color: #342C2C;
  // border: 1px solid #FFB3C1;
}

/* 京东京造 - 蓝色 */
.platform-3 {
  // background-color: rgb(221, 10, 9);
  color: #342C2C;
  // border: 1px solid #B3D4FF;
}

/* 组内商品列表 */
.group-items {
  padding-top: 5px;
}

.haveShop {
  .checkbox {
    background-color: transparent;
    margin-top: 0;
    padding: 12px 0;
    border-bottom: 1px solid #F5F5F5;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;

    &:last-child {
      border-bottom: none;
    }
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
      color: #ed2e33;
      font-weight: bold;
    }
  }

  /deep/ .van-stepper__minus,
  .van-stepper__plus {
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

/* 平台头部里的checkbox样式微调 */
.platform-header /deep/ .van-checkbox__label {
  display: flex;
  align-items: center;
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
    background-image: linear-gradient(to right, #F65958, #DD0A09);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .toPay1 {
    background-image: linear-gradient(to right, #FBBCBB, #F19D9C);
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

/* 单商品运费 */
.freight-line {
  font-size: 12px;
  color: #ff6b00;
  margin-top: 4px;

  &.free {
    color: #52c41a;
  }
}

/* 平台运费小计 */
.group-freight {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 8px 0 4px;
  border-top: 1px dashed #f0f0f0;
  margin-top: 4px;

  .freight-label {
    font-size: 13px;
    color: #666;
  }

  .freight-value {
    font-size: 14px;
    font-weight: 600;
    color: #ff6b00;
  }
}

/* 底部含运费 */
.freight-tip {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  font-weight: normal;
}
</style>