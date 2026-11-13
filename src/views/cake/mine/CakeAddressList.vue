<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <van-radio-group v-model="radio" class="radio-group">
      <div class="addressBox" v-for="item in addressList" :key="item.id"   @click="selectAndBack(item)">
        
        <div class="addressItem">
          <div class="addressIcon">
            <img class="img" src="@/assets/mine/dzh.png" alt="">
          </div>
          <div class="nameInfo">
            <div>{{ item.name }}</div>
            <div class="addressDetail">
              {{ item.province ? item.province : "" }}
              {{ item.city ? item.city : "" }}
              {{ item.area ? item.area : "" }}
              {{ item.addr }}
            </div>
            <div class="phone">
              <div>{{ item.phone }}</div>
              <div class="label" v-if="item.tag">{{ item.tag }}</div>
            </div>
          </div>
        </div>
        <div class="bottomBox">
          <div class="radio">
            <van-radio
              checked-color="#ED3036"
              :name="item.id"
                @click.stop="selectAndBack(item)"
            >默认地址</van-radio>
          </div>
          <div class="rightBox">
            <div class="deleteBox" @click.stop="deleteAdress(item.gid)">
              <div class="delete">
                <img class="img" src="@/assets/mine/sc.png" alt="">
              </div>
              <div>删除</div>
            </div>
            <div class="deleteBox" @click="exitAdress(item.id)">
              <div class="delete">
                <img class="img" src="@/assets/mine/xg.png" alt="">
              </div>
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
    </van-radio-group>
    <!--    添加新地址-->
    <div class="addNewAddress">
      <div class="btn" @click="toAddAddress">添加新地址</div>
    </div>
  </div>
</template>

<script>
import {
  getAddressList,
  setDefaultAddress,
  delAddress
} from "@/api/lehuicake";

export default {
  name: "AddressManagement",
  data() {
    return {
      radio: "",
      addressList: [],
      change: null,
      loadingflag: true
    }
  },
  methods: {
           selectAndBack(item) {
      this.radio = item.id
      
      if (this.change == 0) {
        // ✅ 1. 先存好给结算页用的数据
        sessionStorage.setItem("selected_address_id", item.id)
        sessionStorage.setItem("selected_address_obj", JSON.stringify(item))
        
        // ✅ 2. 调用接口把它设为默认地址
        setDefaultAddress(item.id).then(res => {
          if (res.code == 200) {
            // 接口成功，跳回上一页
            this.$router.go(-1)
          } else {
            this.$toast(res.msg || "设置失败")
          }
        }).catch(() => {
          // 就算接口报错也放行，防止卡死
          this.$router.go(-1)
        })
      } else {
        // 个人中心进来的逻辑（保持你原来的不变）
        this.changeDefault(item.id)
      }
    },
    toAddAddress() {
      if (this.change == 0) {
        this.$router.push({
          path: "/cakeExitAdress",
          query: { change: this.change, length: this.addressList.length }
        })
      } else {
        this.$router.push("/cakeExitAdress")
      }
    },

       getScaddressList() {
      this.loadingflag = true
      getAddressList()
        .then(res => {
          if (res.code == 200) {
            let list = []
            // 兼容三种情况：直接数组、address_list、list
            if (Array.isArray(res.data)) {
              list = res.data
            } else if (res.data && res.data.address_list) {
              list = res.data.address_list
            } else if (res.data && res.data.list) {
              list = res.data.list
            }
            
            this.addressList = list
            
            // 自动选中默认地址
            const def = this.addressList.find(item => item.is_default == 1 || item.is_default == '1')
            this.radio = def ? def.id : (this.addressList.length > 0 ? this.addressList[0].id : "")
          } else {
            this.$toast(res.msg || "获取失败")
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loadingflag = false
        })
    },

    // 修改默认地址
     changeDefault(id) {
      // 如果不是从结算页跳来的（change != 0），才需要去调设置默认地址的接口
      if (this.change != 0) {
        if (this.radio === id) return 
        const old = this.radio
        this.radio = id
        setDefaultAddress(id)
          .then(res => {
            if (res.code == 200) {
              this.$toast(res.msg || "设置成功")
              this.getScaddressList()
            } else {
              this.radio = old
              this.$toast(res.msg || "设置失败")
            }
          })
          .catch(() => {
            this.radio = old
          })
      }
    },

    // 删除地址（传 gid）
    deleteAdress(gid) {
      this.$dialog.confirm({
        message: '是否要删除该地址？',
        confirmButtonColor: 'red'
      }).then(() => {
        delAddress(gid).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || "删除成功")
            this.radio = "" // 清空选中，避免删除默认地址后残留
            this.getScaddressList()
          } else {
            this.$toast(res.msg || "删除失败")
          }
        })
      }).catch(() => {})
    },

    // 编辑地址
    exitAdress(id) {
      this.$router.push({
        path: "/cakeExitAdress",
        query: { id, change: this.change }
      })
    }
  },
  watch: {
    // ✅ 监听路由变化（从编辑页返回、或从结算页跳过来时，强制刷新列表）
    '$route'(to, from) {
      if (to.path === '/cakeAddressList') {
        this.getScaddressList()
      }
    }
  },
  created() {
    this.getScaddressList()
    this.change = this.$route.query.change
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
  }

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #6E6E6E;
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
    padding-bottom: 10px;

    .addressDetail {
      color: #707070;
      font-size: 15px;
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
        background-color: #238DED;
        color: white;
        padding: 0px 10px;
        font-size: 12px;
      }
    }
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

  .btn {
    background-image: linear-gradient(to right, #F28F8E, #DC4F4E);
    color: white;
    border-radius: 30px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    font-size: 17px;
  }
}
</style>