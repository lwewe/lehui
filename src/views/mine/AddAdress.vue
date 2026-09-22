<template>
  <div class="conPage">
    <!-- 地址填写表单 -->
    <div class="addressBox" v-if="!showAddressList">
      <div class="consignee">
        <div class="consigneeText">收货人</div>
        <div class="inpBox">
          <input class="inp" type="text" v-model="userName" placeholder="请输入收货人姓名">
        </div>
      </div>
      <div class="consignee consignee2">
        <div class="consigneeText">手机号码</div>
        <div class="inpBox">
          <input class="inp" type="number" v-model="phone" placeholder="请输入收货人手机号码">
        </div>
      </div>
      <div class="consignee consignee2" @click="openAddressSelector">
        <div class="consigneeText">所在地区</div>
        <div class="inpBox selectAddress" v-if="!allAddress">
          请选择地址
        </div>
        <div class="inpBox selectAddress2" v-else>
          {{ allAddress }}
        </div>
        <div>
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="consignee" style="align-items: flex-start">
        <div class="consigneeText">详细地址</div>
        <div class="inpBox" @click="getLocation">
          <textarea v-model="detailAddress" class="inp textarea" type="text" placeholder="小区、楼栋号、单元室等"
            :disabled="showAddress"></textarea>
          <!--    当前定位的弹窗-->
          <div class="popupBox2">
            <van-popup v-model="showAddress" position="top">
              <div class="popup">
                <div class="brandBox" style="margin: 0;">
                  <div>{{ address }}</div>
                </div>
                <div class="retractBox">
                  <div class="retract" @click="cancellation">取消</div>
                  <div class="retract retract2" @click="filling">填入</div>
                </div>
              </div>
            </van-popup>
          </div>
        </div>
      </div>
      <div class="consignee">
        <div class="consigneeText">地址标签</div>
        <div class="inpBox labelBox">
          <div class="label" :class="{ label1: selectId == item.id && item.checked }"
            @click="changeSelect(item.id, item.text)" v-for="item in labelList" :key="item.id">{{ item.text }}
          </div>
          <div class="label" v-if="!isAdd" @click="changeAdd">+</div>
          <div v-else>
            <div class="label determine" v-if="isExit" style="width: inherit;">
              <div class="comfireBox" style="width: inherit;"
                :style="'background-color:' + labelColor2 + ';color:' + Color" @click="changeWrite">{{ labelText }}
              </div>
              <div class="comfire" :style="'background-color:' + labelColor"
                style="width: inherit;border-left: 1px solid white" @click="exit">编辑
              </div>
            </div>
            <div class="label determine" v-else>
              <div class="comfireBox"><input maxlength="5" @input="changeLabel" v-model="labelText" class="comfireInp"
                  type="text" placeholder="请输入标签名称，最多5个字"></div>
              <div class="comfire" :style="'background-color:' + labelColor" @click="comfire">确定</div>
            </div>
          </div>
        </div>
      </div>
      <div class="consignee" style="justify-content: space-between;border: none">
        <div class="consigneeText" style="width: 60%;">
          <div>设为默认地址</div>
          <div class="info">每次下单会默认推荐使用该地址</div>
        </div>
        <div>
          <van-switch @change="changeSwitch" active-color="#DF5756" inactive-color="#FFFFFF" v-model="checked" />
        </div>
      </div>
    </div>

    <!-- 地址选择列表 -->
    <div class="address" v-else>
      <div class="addressHeader">
        <van-icon name="arrow-left" @click="backToForm" />
        <div class="title">请选择地址</div>
      </div>
      <div class="choose">
        <div class="chooseItem" @click="changeProvince" :class="{ active: province }">{{ province ? province : '请选择' }}
        </div>
        <div class="chooseItem" v-if="city" @click="changeCity" :class="{ active: city }">{{ city ? city : '请选择' }}
        </div>
        <div class="chooseItem" v-if="county" @click="changeCounty" :class="{ active: county }">{{ county ? county :
          '请选择'
        }}</div>
        <div class="chooseItem screen" v-if="twon" @click="changeTown" :class="{ active: twon }">{{ twon ? twon : '请选择'
        }}
        </div>
      </div>

      <!-- 地区列表 -->
      <div class="addressList">
        <div class="addrssItem" v-for="item in addressListData" :key="item.id"
          @click="chanegAddress(item.id, item.name, item.type)">
          <div :class="{ success: selectAddressId == item.id }">{{ item.name }}</div>
          <div class="success" v-if="selectAddressId == item.id">
            <van-icon name="success" />
          </div>
        </div>
      </div>
    </div>

    <!-- 保存地址按钮 -->
    <div class="addNewAddress" v-if="!showAddressList">
      <div class="btn" @click="addaddress">保存地址</div>
    </div>
  </div>
</template>

<script>

import { addressShow, addressDetail, addressAdd, addressEdit } from "@/api/lhjdtm";

export default {
  name: "AddAdress",
  data() {
    return {
      // 表单数据
      checked: false,
      labelText: "",
      labelColor: "",
      labelColor2: "",
      labelList: [
        {
          id: 1,
          text: "家",
          checked: false
        }, {
          id: 2,
          text: "公司",
          checked: false
        }, {
          id: 3,
          text: "学校",
          checked: false
        },
      ],
      selectId: 0,
      isAdd: false,
      isExit: false,
      Color: "",
      isChange: false,
      showAddress: false,
      address: "",
      detailAddress: "",
      isCancel: false,
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
      userName: "",
      phone: "",
      changeText: "",
      is_default: 0,
      id: "",
      change: null,
      listlength: null,

      // 地址选择相关
      showAddressList: false,
      selectAddressId: null,
      addressListData: [],
      province: "",
      city: "",
      county: "",
      twon: "",
      currentType: "province", // 当前选中的级别
    }
  },
  methods: {
    // 打开地址选择器
    openAddressSelector() {
      this.showAddressList = true
      // 重置选择状态
      this.selectAddressId = null
      // 加载省份列表
      this.getAddressListData(0, "province")
    },

    // 返回表单
    backToForm() {
      this.showAddressList = false;
    },

    // 重新选择省
    changeProvince() {
      this.province = ""
      this.city = ""
      this.county = ""
      this.twon = ""
      this.province_id = ""
      this.city_id = ""
      this.county_id = ""
      this.town_id = ""
      this.getAddressListData(0, "province")
    },

    // 点击已选城市
    changeCity() {
      this.county = ""
      this.twon = ""
      this.county_id = ""
      this.town_id = ""
      this.getAddressListData(this.city_id, "city")
    },

    // 点击已选区县
    changeCounty() {
      this.twon = ""
      this.town_id = ""
      this.getAddressListData(this.county_id, "county")
    },

    // 点击已选街道
    changeTown() {
      this.getAddressListData(this.town_id, "town")
    },

    // 选择下一级
    chanegAddress(id, name, type) {
      this.selectAddressId = id
      if (type == "province") {
        this.province = name
        this.province_id = id
        // 获取市
        this.getAddressListData(id, "city")
      } else if (type == "city") {
        this.city = name
        this.city_id = id
        // 获取区
        this.getAddressListData(id, "county")
      } else if (type == "county") {
        this.county = name
        this.county_id = id
        // 获取街道
        this.getAddressListData(id, "town")
      } else if (type == "town") {
        this.twon = name
        this.town_id = id
        this.completeAddressSelection()
      }
    },

    // 完成地址选择
    completeAddressSelection() {
      this.allAddress = this.province + " " + this.city + " " + this.county + " " + this.twon
      this.showAddressList = false
    },

    // 调取省市区联动接口（使用 addressShow）
    getAddressListData(id, type) {
  addressShow({ id }).then(res => {
    if (res.code == 200) {
      let dataList = res.data

      // 处理省份列表（按首字母分组的结构）
      if (type === 'province' && dataList && dataList.city) {
        let flatList = []
        // 遍历每个字母分组，合并成一个大数组
        Object.keys(dataList.city).forEach(letter => {
          flatList = flatList.concat(dataList.city[letter])
        })
        // 如果需要热门城市，也可以合并进去
        if (dataList.hot_city && dataList.hot_city.length) {
          flatList = dataList.hot_city.concat(flatList)
        }
        dataList = flatList
      }

      // 如果返回的是对象（非数组），尝试转换
      if (dataList && !Array.isArray(dataList)) {
        dataList = Object.keys(dataList).map(key => ({
          id: key,
          name: dataList[key]
        }))
      }

      if (dataList && dataList.length > 0) {
        this.addressListData = dataList.map(item => ({
          id: item.id,
          name: item.name || item.label || item,
          type: type
        }))
        this.currentType = type
      } else {
        this.completeAddressSelection()
      }
    }
  })
},

    // 添加/修改地址
    addaddress() {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (this.userName == "") {
        this.$toast("请填写您的收货人姓名");
        return
      }
      if (!reg_tel.test(this.phone)) {
        this.$toast("请正确填写您的手机号码");
        return
      }
      if (this.allAddress == "") {
        this.$toast("请选择您的所在地区");
        return
      }
      if (this.detailAddress == "") {
        this.$toast("请填写您的详细地址");
        return
      }

      // 组装接口参数
      let data = {
        name: this.userName,
        phone: this.phone,
        province_id: Number(this.province_id),
        city_id: Number(this.city_id),
        county_id: Number(this.county_id),
        town_id: Number(this.town_id || 0),
        addr: this.detailAddress,
        tag: this.labelText ? this.labelText : (this.changeText || ''),
        is_default: this.is_default
      }

      if (!this.id) {
        // 新增接口
        addressAdd(data).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || '添加成功')
            sessionStorage.setItem('addressListNeedRefresh', '1')   // ✅ 加这行
            setTimeout(() => {
              if (this.change == 0 && this.listlength == 0) {
                this.$router.go(-2)
              } else {
                this.$router.go(-1)
              }
            }, 1000)
          } else {
            this.$toast(res.msg || '添加失败')
          }
        })
      } else {
        addressEdit({
          ...data,
          id: Number(this.id)
        }).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg || '修改成功')
            sessionStorage.setItem('addressListNeedRefresh', '1')   // ✅ 加这行
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            this.$toast(res.msg || '修改失败')
          }
        })
      }
    },

    changeSwitch(e) {
      if (e) {
        this.is_default = 1
      } else {
        this.is_default = 0
      }
    },

    changeLabel() {
      if (this.labelText != "") {
        this.labelColor = "#DF5756"
      } else {
        this.labelColor = "#EAEAEA"
      }
    },

    changeSelect(id, text) {
      this.isChange = false
      if (!this.isChange && this.isExit) {
        this.labelColor = "#2D2D2D"
        this.labelColor2 = "#F6F6F6"
        this.Color = "#000000"
      }
      this.selectId = id
      this.changeText = text
      this.labelList.filter((item) => {
        if (item.id != id) {
          item.checked = false
        }
      })
      this.labelList.filter((item) => {
        if (item.id === id) {
          item.checked = !item.checked
        }
      })
    },

    changeAdd() {
      this.isAdd = true
      this.selectId = 0
    },

    comfire() {
      this.selectId = 0
      this.changeText = ""
      if (this.labelText == "") {
        return
      }
      this.isExit = true
      this.isChange = true
      if (this.isChange) {
        this.labelColor = "#3392FE"
        this.labelColor2 = "#3392FE"
        this.Color = "#fff"
      } else {
        this.labelColor = "#2D2D2D"
      }
    },

    changeWrite() {
      this.isChange = !this.isChange
      if (this.isChange) {
        this.labelColor = "#3392FE"
        this.labelColor2 = "#3392FE"
        this.Color = "#fff"
        this.selectId = 0
      } else {
        this.labelColor = "#2D2D2D"
        this.labelColor2 = "#F6F6F6"
        this.Color = "#000000"
      }
    },

    exit() {
      this.selectId = 0
      this.isExit = false
      this.labelColor = "#DF5756"
    },

    getLocation() {
      if (this.detailAddress || this.isCancel) {
        return
      }
      this.showAddress = true
    },

    cancellation() {
      this.showAddress = false
      this.isCancel = true
    },

    filling() {
      this.detailAddress = this.address
      this.isCancel = true
      this.showAddress = false
    },

    // 编辑的时候回显
    // 编辑的时候回显
    getshowscaddress(id) {
      addressDetail({ id }).then(res => {
        if (res.code == 200) {
          let address = res.data
          this.userName = address.name
          this.phone = address.phone
          this.province_id = address.province_id
          this.city_id = address.city_id
          this.county_id = address.county_id
          this.town_id = address.town_id
          this.detailAddress = address.addr
          this.is_default = address.is_default
          this.checked = address.is_default == 1 ? true : false

          // 回显标签
          if (address.tag) {
            // 检查是否是预设标签
            let presetTag = this.labelList.find(item => item.text == address.tag)
            if (presetTag) {
              this.selectId = presetTag.id
              this.changeText = address.tag
              this.labelList.forEach(item => {
                item.checked = (item.id == presetTag.id)
              })
            } else {
              // 自定义标签
              this.labelText = address.tag
              this.isAdd = true
              this.isExit = true
              this.labelColor = "#3392FE"
              this.labelColor2 = "#3392FE"
              this.Color = "#fff"
            }
          }

          // 回显地区名称
          this.getAddressNames()
        }
      })
    },
    // 根据ID获取地区名称
    async getAddressNames() {
      try {
        // 查询省名称
        let provinceData = await addressShow({ id: 0 })
        let province = provinceData.data.find(item => item.id == this.province_id)
        this.province = province ? province.name : ""

        // 查询市名称
        if (this.province_id) {
          let cityData = await addressShow({ id: this.province_id })
          let city = cityData.data.find(item => item.id == this.city_id)
          this.city = city ? city.name : ""
        }

        // 查询区名称
        if (this.city_id) {
          let countyData = await addressShow({ id: this.city_id })
          let county = countyData.data.find(item => item.id == this.county_id)
          this.county = county ? county.name : ""
        }

        // 查询街道名称
        if (this.county_id && this.town_id) {
          let townData = await addressShow({ id: this.county_id })
          let town = townData.data.find(item => item.id == this.town_id)
          this.twon = town ? town.name : ""
        }

        // 拼接完整地址
        this.allAddress = [this.province, this.city, this.county, this.twon]
          .filter(item => item)
          .join(" ")
      } catch (error) {
        console.error("获取地址名称失败", error)
      }
    }
  },
  created() {
    this.address = sessionStorage.getItem("streetNumber")
    this.id = this.$route.query.id
    this.change = this.$route.query.change
    this.listlength = this.$route.query.length
    if (this.$route.query.id) {
      document.title = "编辑地址"
      this.getshowscaddress(this.$route.query.id)
    } else {
      document.title = "新增地址"
    }
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  box-sizing: border-box;
}

.addressBox {
  background-color: white;
  padding: 10px;

  .consignee {
    display: flex;
    align-items: center;
    gap: 25px;
    padding: 13px 5px;
    border-bottom: 1px solid #F2F2F2;

    .consigneeText {
      font-weight: bold;
      width: 25%;
      white-space: nowrap;
    }
  }

  .consignee2 {
    padding: 16px 5px;
    cursor: pointer;
  }

  .inpBox {
    width: 75%;
    font-size: 15px;
    position: relative;

    .inp {
      width: 100%;
      height: 100%;
      border: none;
    }

    .textarea {
      height: 50px;
      background-color: white;
    }
  }

  .selectAddress {
    padding-left: 16px;
    color: #F36E72;
    white-space: nowrap;
  }

  .selectAddress2 {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 50%;
    overflow: hidden;
    color: #333;
  }

  .labelBox {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 75%;
    flex-wrap: wrap;

    .label {
      background-color: #F7F7F7;
      font-size: 14px;
      text-align: center;
      width: 53px;
      height: 23px;
      line-height: 23px;
      border-radius: 2px;
      cursor: pointer;
    }

    .label1 {
      background-color: #3392FE;
      color: white;
    }

    .determine {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: #fff0;
      border-radius: 30px;
      overflow: hidden;
      height: 30px;
      line-height: 30px;

      .comfireBox {
        width: 90%;
        background-color: #F6F6F6;
        height: 30px;
        padding: 0px 8px;
        font-size: 13px;

        .comfireInp {
          width: 100%;
          height: 100%;
          border: none;
          background-color: #fff0;
        }
      }

      .comfire {
        width: 20%;
        background-color: #EAEAEA;
        height: 100%;
        color: white;
        padding: 3px;
        cursor: pointer;
      }
    }
  }
}

.info {
  color: #A5A5A5;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
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
    cursor: pointer;
  }
}

// 地址选择样式
.address {
  padding: 10px;
  min-height: 100vh;
  background-color: white;
}

.addressHeader {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;

  .van-icon {
    position: absolute;
    left: 0;
    font-size: 20px;
    cursor: pointer;
  }

  .title {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }
}

.choose {
  padding: 5px 0px 10px;
  border-bottom: 1px solid #F6F6F6;
  display: flex;
  align-items: center;
  gap: 5px;

  .chooseItem {
    border-bottom: 2px solid #3392FE;
    padding: 15px 0px;
    color: #ADADAD;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 20%;
    text-align: center;
    cursor: pointer;
  }

  .screen {
    width: 40%;
  }

  .active {
    color: #333;
    font-weight: bold;
  }
}

.addressList {
  margin-top: 10px;
  font-size: 15px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  .addrssItem {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    cursor: pointer;
    padding: 5px 0;

    &:hover {
      background-color: #F7F7F7;
    }
  }

  .success {
    color: #3392FE;
  }
}

.popupBox2 {
  /deep/ .van-overlay {
    display: none;
  }

  /deep/ .van-popup--top {
    top: -17px;
    left: 43%;
    background-color: #fff0;
    transition: none;
    position: absolute;
    max-height: 223%;
  }

  .popup {
    padding: 30px 25px;
    background-image: url("../../assets/mine/xb.png");
    box-sizing: border-box;
    background-size: 100% 100%;
    position: relative;
  }

  .brandBox {
    font-size: 14px;
    color: #6c6b6b;
    line-height: 25px;
  }

  .retract {
    border: 1px solid #DF5756;
    color: #DF5756;
    width: 57px;
    font-size: 13px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    border-radius: 5px;
    cursor: pointer;
  }

  .retractBox {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
    justify-content: flex-end;
    position: relative;
    bottom: -12px;
  }

  .retract2 {
    background-color: #DF5756;
    color: #fff;
  }
}

/deep/ .van-switch {
  width: 50px;
}

/deep/ .van-switch--on .van-switch__node {
  transform: translateX(20px);
}
</style>