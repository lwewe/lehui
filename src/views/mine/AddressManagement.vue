<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <van-radio-group v-model="radio" class="radio-group">
      <div class="addressBox" v-for="item in addressList" :key="item.id" @click="selectAddress(item.id)">
        <div class="addressItem">
          <div class="nameInfo">
            <div>{{ item.name }}</div>
            <div class="addressDetail">
              {{ item.province_name }} {{ item.city_name }} {{ item.county_name }} {{ item.town_name }} {{ item.addr }}
            </div>
            <div class="phone">
              <div>{{ item.phone }}</div>
              <div class="label" v-if="item.tag">{{ item.tag }}</div>
            </div>
          </div>
        </div>
        <div class="bottomBox">
          <div class="radio">
            <van-radio checked-color="#ED3036" :name="item.id" style="font-size: 12px;"
              @click.stop="changeDefault(item.id)">-默认地址</van-radio>
          </div>
          <div class="rightBox">
            <div class="deleteBox" @click.stop="deleteAdress(item.id)">
              <div>删除</div>
            </div>
            <div class="deleteBox" @click.stop="exitAdress(item.id)">
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
    </van-radio-group>

    <!-- 空状态 -->
    <div class="emptyBox" v-if="addressList.length == 0">
      <img src="../../assets/mine/empty.png" alt="">
      <div>暂无地址，请添加</div>
    </div>

    <!-- 添加新地址 -->
    <div class="addNewAddress">
      <div class="btn" @click="toAddAddress">添加新地址</div>
    </div>
  </div>
</template>

<script>
import { addressList, addressDelete, addressSetDefault } from "@/api/lhjdtm";

export default {
  name: "AddressManagement",
  data() {
    return {
      radio: "",
      addressList: [],
      change: null
    }
  },
  methods: {// ✅ 选中地址回传
    selectAddress(id) {
      if (this.change == 0) {
        sessionStorage.setItem('selectedAddressId', id)
        this.$router.back()
      }
    },
    toAddAddress() {
      if (this.change == 0) {
        this.$router.push({
          path: "/addAddress",
          query: {
            change: this.change,
            length: this.addressList.length
          }
        })
      } else {
        this.$router.push("/addAddress")
      }
    },

    // 获取地址列表
    getAddressList() {
      addressList().then(res => {
        if (res.code == 200) {
          this.addressList = res.data || []

          // 设置默认地址
          if (this.addressList.length > 0) {
            let defaultAddress = this.addressList.find(item => item.is_default == 1)
            if (defaultAddress) {
              this.radio = defaultAddress.id
            } else {
              // 如果没有默认地址，默认选中第一个
              this.radio = this.addressList[0].id
            }
          }
        }
      })
    },

    // 修改默认地址
    changeDefault(id) {
      this.radio = id

      addressSetDefault({ id }).then(res => {
        if (res.code == 200) {
          this.$toast(res.msg || '设置成功')
          this.getAddressList()

          if (this.change == 0) {
            sessionStorage.setItem('selectedAddressId', id)   // ✅ 加这行
            this.$router.go(-1)

          }
        } else {
          this.$toast(res.msg || '设置失败')
        }
      })
    },
    // 删除地址
    deleteAdress(id) {
      this.$dialog.confirm({
        message: '是否要删除该地址？',
        confirmButtonColor: 'red'
      }).then(() => {
        addressDelete({
          ids: String(id)
        }).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || '删除成功')
            this.getAddressList()
          } else {
            this.$toast(res.msg || '删除失败')
          }
        })
      }).catch(() => {
        // 取消删除
      })
    },

    // 编辑地址
    exitAdress(id) {
      this.$router.push({
        path: "/addAddress",
        query: { id }
      })
    }
  },

  created() {
    this.change = this.$route.query.change

    // ✅ 从新增/编辑页回来，清掉标记（列表本来就会重新拉）
    if (sessionStorage.getItem('addressListNeedRefresh')) {
      sessionStorage.removeItem('addressListNeedRefresh')
    }
    this.getAddressList()
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;
  background-color: #F0F0F0;
  padding-bottom: 75px;
}

.radio-group {
  margin-top: -10px;
}

.addressBox {
  background-color: white;
  padding: 15px 10px;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .addressItem {
    display: flex;
    align-items: center;
    gap: 5px;

    .addressIcon {
      width: 17px;
    }
  }

  .delete {
    width: 14px;
    padding-top: 3px;
  }

  .deleteBox {
    display: flex;
    align-items: center;
    gap: 3px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #6E6E6E;
    font-size: 14px;
  }

  .bottomBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #F0F0F0;
    padding-top: 10px;
  }

  .radio {
    font-weight: bold;
    font-size: 15px;
  }

  /deep/ .van-radio__icon .van-icon {
    width: 18px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
  }

  .nameInfo {
    width: 93%;
    font-size: 14px;
    padding-bottom: 10px;

    .addressDetail {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      margin-top: 8px;
      line-height: 22px;
    }

    .phone {
      color: #707070;
      font-size: 13px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 10px;

      .label {
        background-color: #fb8888;
        color: white;
        padding: 0px 4px;
        font-size: 10px;
        border-radius: 3px;
      }
    }
  }
}

.emptyBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
  font-size: 15px;

  img {
    width: 120px;
    margin-bottom: 20px;
  }
}

.addNewAddress {
  background-color: white;
  position: fixed;
  width: 100%;
  left: 0px;
  bottom: 0;
  box-sizing: border-box;
  padding: 13px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  .btn {
    background-image: linear-gradient(to right, #F28F8E, #DC4F4E);
    color: white;
    border-radius: 30px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    font-size: 17px;
    cursor: pointer;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>