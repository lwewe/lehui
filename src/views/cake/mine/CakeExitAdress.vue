<template>
  <div class="conPage">
    <NProgress v-if="loadingflag" />
    <div class="addressBox">
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
      <div class="consignee consignee2" @click="changeAddress = true">
        <div class="consigneeText" @click.stop="changeAddress = false">所在地区</div>
        <div class="inpBox selectAddress" v-if="!allAddress">请选择地址</div>
        <div class="inpBox selectAddress2" v-else>{{ allAddress }}</div>
        <div><van-icon name="arrow" /></div>
      </div>


      <div class="consignee" @click="goMapPicker">
        <div class="consigneeText">地图选点</div>
        <div class="inpBox selectAddress" v-if="!lat || !lng" :key="'empty'">点击在地图上选择位置</div>
        <!-- <div class="inpBox selectAddress2" v-else :key="lat + lng">{{ lng }}, {{ lat }}</div> -->

        <div class="inpBox selectAddress2" v-else
          style="color: #333; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
          {{ mapAddress }}
        </div>

        <div><van-icon name="arrow" /></div>
      </div>



      <div class="consignee" style="align-items: flex-start">
        <div class="consigneeText">详细地址</div>
        <div class="inpBox">
          <textarea v-model="detailAddress" class="inp textarea" placeholder="小区、楼栋号、单元室等"></textarea>
        </div>
      </div>

      <div class="consignee">
        <div class="consigneeText">地址标签</div>
        <div class="inpBox labelBox">
          <div class="label" :class="{ label1: selectId == item.id && item.checked }"
            @click="changeSelect(item.id, item.text)" v-for="item in labelList" :key="item.id">{{ item.text }}</div>
          <div class="label" v-if="!isAdd" @click="changeAdd">+</div>
          <div v-else>
            <div class="label determine" v-if="isExit" style="width: inherit;">
              <div class="comfireBox" style="width: inherit;"
                :style="'background-color:' + labelColor2 + ';color:' + Color" @click="changeWrite">{{ labelText }}
              </div>
              <div class="comfire" :style="'background-color:' + labelColor"
                style="width: inherit;border-left: 1px solid white" @click="exit">编辑</div>
            </div>
            <div class="label determine" v-else>
              <div class="comfireBox">
                <input maxlength="5" @input="changeLabel" v-model="labelText" class="comfireInp" type="text"
                  placeholder="请输入标签名称，最多5个字">
              </div>
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
    <!-- 保存地址 -->
    <div class="addNewAddress">
      <div class="btn" @click="addaddress">保存地址</div>
    </div>
    <!-- 选择省市区街道 -->
    <div class="popupBox3">
      <van-popup v-model="changeAddress" position="bottom">
        <div>
          <Address @getAddress="getAddress" @chanegTown="chanegTown"></Address>
          <div class="close" @click="changeAddress = false">
            <van-icon size="18px" name="cross" />
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Address from "@/components/Address.vue";
import { addAddress, editAddress, getAddressDetail } from "@/api/lehuicake";

export default {
  name: "AddAdress",
  components: { Address },
  data() {
    return {
      mapAddress: "",
      lat: "",
      lng: "",
      checked: false,
      labelText: "",
      labelColor: "",
      labelColor2: "",
      labelList: [
        { id: 1, text: "家", checked: false },
        { id: 2, text: "公司", checked: false },
        { id: 3, text: "学校", checked: false }
      ],
      selectId: 0,
      isAdd: false,
      isExit: false,
      Color: "",
      isChange: false,
      detailAddress: "",
      changeAddress: false,
      allAddress: "",
      cityId: "",
      cityName: "",
      areaId: "",
      areaName: "",
      userName: "",
      phone: "",
      changeText: "",
      tagText: "",
      is_default: 0,
      id: "",
      change: null,
      listlength: null,
      gid: "",
      loadingflag: true
    };
  },
  // 替换原来的 watch 和 methods 及生命周期
  watch: {
    '$route'(to, from) {
      // 页面路由一旦变化，重新拉取数据
      this.fetchMapData();
    }
  },
  methods: {
    // 核心方法：专门去读地图缓存
    fetchMapData() {
      const tempLat = sessionStorage.getItem("temp_map_lat");
      const tempLng = sessionStorage.getItem("temp_map_lng");

      if (tempLat && tempLng) {
        this.lat = tempLat;
        this.lng = tempLng;
        // 清理缓存
        sessionStorage.removeItem("temp_map_lat");
        sessionStorage.removeItem("temp_map_lng");
      }
    },

    addaddress() {
      const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!this.userName) { return this.$toast("请填写您的收货人姓名"); }
      if (!reg_tel.test(this.phone)) { return this.$toast("请正确填写您的手机号码"); }
      if (!this.allAddress || !this.cityName || !this.areaName) { return this.$toast("请选择您的所在地区"); }
      if (!this.detailAddress || this.detailAddress.trim().length < 2) { return this.$toast("请填写完整的详细地址"); }
      if (!this.lat || !this.lng) { return this.$toast("请在地图上选择位置"); }

      const data = {
        name: String(this.userName),
        phone: String(this.phone),
        city: String(this.cityName),
        area: String(this.areaName),
        addr: String(this.detailAddress.trim()),
        tag: String(this.tagText || "家"),
        is_default: String(this.is_default),
        lat: String(this.lat),
        lng: String(this.lng)
      };

      if (!this.id) {
        addAddress(data).then(res => {
          this.$toast(res.msg || (res.code == 200 ? "添加成功" : "添加失败"));
          if (res.code == 200) {
            setTimeout(() => {
              // ✅ 核心修改：不要用 go(-1)，直接指定跳转到列表页
              this.$router.replace({
                path: '/cakeAddressList',
                query: { change: 0 } // 带上 change=0 参数，通知列表页刷新
              });
            }, 1000); // 延迟 1 秒让用户看清提示
          }
        });
      } else {
        // 编辑地址成功后的跳转
        editAddress({ ...data, id: this.id, gid: this.gid }).then(res => {
          this.$toast(res.msg || (res.code == 200 ? "修改成功" : "修改失败"));
          if (res.code == 200) {
            setTimeout(() => {
              // ✅ 同样直接跳转
              this.$router.replace({
                path: '/cakeAddressList',
                query: { change: 0 }
              });
            }, 1000);
          }
        });
      }
    },

    changeSwitch(e) { this.is_default = e ? 1 : 0; },
    chanegTown(e) { this.changeAddress = e; },
    getAddress(e, ids) {
      this.allAddress = e;
      this.cityId = ids.city_id || "";
      this.cityName = ids.city_name || "";
      this.areaId = ids.county_id || "";
      this.areaName = ids.county_name || "";
    },
    changeLabel() { this.labelColor = this.labelText !== "" ? "#DF5756" : "#EAEAEA"; },
    changeSelect(id, text) {
      this.isChange = false;
      if (!this.isChange && this.isExit) {
        this.labelColor = "#2D2D2D";
        this.labelColor2 = "#F6F6F6";
        this.Color = "#000000";
      }
      this.selectId = id;
      this.changeText = text;
      this.labelList.forEach(item => {
        if (item.id != id) item.checked = false;
      });
      this.labelList.forEach(item => {
        if (item.id === id) item.checked = !item.checked;
      });
      const hit = this.labelList.find(i => i.id === id);
      this.tagText = hit && hit.checked ? hit.text : "";
    },
    changeAdd() {
      this.isAdd = true;
      this.selectId = 0;
      this.labelList.forEach(i => (i.checked = false));
      this.tagText = "";
    },
    comfire() {
      this.selectId = 0;
      this.changeText = "";
      if (this.labelText === "") return;
      this.isExit = true;
      this.isChange = true;
      this.labelColor = "#3392FE";
      this.labelColor2 = "#3392FE";
      this.Color = "#fff";
      this.tagText = this.labelText;
    },
    changeWrite() {
      this.isChange = !this.isChange;
      if (this.isChange) {
        this.labelColor = "#3392FE";
        this.labelColor2 = "#3392FE";
        this.Color = "#fff";
        this.selectId = 0;
        this.tagText = this.labelText;
      } else {
        this.labelColor = "#2D2D2D";
        this.labelColor2 = "#F6F6F6";
        this.Color = "#000000";
      }
    },
    goMapPicker() {
      sessionStorage.setItem("cakeAddressDraft", JSON.stringify({
        userName: this.userName, phone: this.phone, detailAddress: this.detailAddress,
        allAddress: this.allAddress, cityId: this.cityId, cityName: this.cityName,
        areaId: this.areaId, areaName: this.areaName, tagText: this.tagText,
        selectId: this.selectId, is_default: this.is_default, checked: this.checked,
        labelText: this.labelText, isAdd: this.isAdd, isExit: this.isExit,
        lat: this.lat, lng: this.lng, gid: this.gid,
        mapAddress: this.mapAddress
      }));
      this.$router.push("/MapPickercake");
    },
    exit() {
      this.selectId = 0;
      this.isExit = false;
      this.labelColor = "#DF5756";
    },
    getshowscaddress(id) {
      getAddressDetail(id).then(res => {
        if (res.code == 200) {
          const a = res.data.address;
          this.cityId = a.city_id;
          this.cityName = a.city;
          this.areaName = a.area;
          this.userName = a.name;
          this.gid = a.gid;
          this.phone = a.phone;
          this.detailAddress = a.addr;
          this.allAddress = `${a.city} ${a.area} `;
          if (a.tag) {
            const hit = this.labelList.find(i => i.text === a.tag);
            if (hit) {
              this.selectId = hit.id;
              hit.checked = true;
              this.tagText = a.tag;
            } else {
              this.labelText = a.tag;
              this.tagText = a.tag;
              this.isAdd = true;
              this.isExit = true;
              this.labelColor = "#3392FE";
              this.labelColor2 = "#3392FE";
              this.Color = "#fff";
            }
          }
          this.is_default = a.is_default;
          this.checked = a.is_default == 1;
        } else {
          this.$toast(res.msg || "获取地址失败");
        }
      }).catch(() => { }).finally(() => {
        this.loadingflag = false;
      });
    }
  },

  mounted() {
    // 1. 最先读 URL 上的经纬度
    const q = this.$route.query;
    if (q.lat && q.lng) {
      this.lat = q.lat;
      this.lng = q.lng;
      this.mapAddress = q.address || "已选择位置";
    }

    // 2. 回填草稿（注意：如果 URL 有经纬度，千万别用草稿里的空值覆盖）
    const draftStr = sessionStorage.getItem("cakeAddressDraft");
    if (draftStr) {
      try {
        const d = JSON.parse(draftStr);
        this.userName = d.userName || this.userName;
        this.phone = d.phone || this.phone;
        this.detailAddress = d.detailAddress || this.detailAddress;
        this.allAddress = d.allAddress || this.allAddress;
        this.cityId = d.cityId || this.cityId;
        this.cityName = d.cityName || this.cityName;
        this.areaId = d.areaId || this.areaId;
        this.areaName = d.areaName || this.areaName;
        this.tagText = d.tagText || this.tagText;
        this.selectId = d.selectId || this.selectId;
        this.is_default = d.is_default || this.is_default;
        this.checked = d.checked !== undefined ? !!d.checked : this.checked;
        this.labelText = d.labelText || this.labelText;
        this.isAdd = d.isAdd !== undefined ? !!d.isAdd : this.isAdd;
        this.isExit = d.isExit !== undefined ? !!d.isExit : this.isExit;
        this.gid = d.gid || this.gid;

        // ⚠️ 这里非常关键：只有 URL 里没经纬度时，才用草稿的
        if (!this.lat) this.lat = d.lat || "";
        if (!this.lng) this.lng = d.lng || "";
        if (!this.mapAddress) this.mapAddress = d.mapAddress || "";

      } catch (e) { }
      setTimeout(() => sessionStorage.removeItem("cakeAddressDraft"), 1000);
    }

    // 3. 兜底
    this.fetchMapData();
    this.checkTimer = setInterval(() => this.fetchMapData(), 500);

    // 4. 编辑回显/新增
    this.id = this.$route.query.id;
    this.change = this.$route.query.change;
    this.listlength = this.$route.query.length;
    if (this.id) {
      document.title = "编辑地址";
      this.getshowscaddress(this.id);
    } else {
      document.title = "新增地址";
      this.loadingflag = false;
    }
  },
  beforeDestroy() {
    // 离开页面时清理定时器，防止内存泄漏
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
  }

};
</script>

<style scoped lang="less">
/* 样式保持不变（原文件 style 全部保留即可） */
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
        padding: 0 8px;
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
  left: 0;
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

/deep/ .van-switch {
  width: 50px;
}

/deep/ .van-switch--on .van-switch__node {
  transform: translateX(20px);
}

.popupBox3 {
  /deep/ .van-popup--bottom {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 82vh;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>