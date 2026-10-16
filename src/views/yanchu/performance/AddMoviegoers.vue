<template>
  <div class="conPage">
    <!--    <NProgress v-if="loadingflag"/>-->
    <div class="addressBox">
      <div class="consignee">
        <div class="consigneeText">姓名</div>
        <div class="inpBox">
          <input class="inp" type="text" v-model="userName" placeholder="请填写观影人真实姓名">
        </div>
      </div>
      <div class="consignee consignee2">
        <div class="consigneeText">证件类型</div>
        <div class="inpBox selectAddress">
          身份证
        </div>
         
      </div>
      <div class="consignee consignee2">
        <div class="consigneeText">证件号码</div>
        <div class="inpBox">
          <input class="inp" type="text" v-model="cardId" placeholder="请填写证件号码">
        </div>
      </div>
      <div class="consignee consignee2" style="justify-content: space-between;border: none">
        <div class="consigneeText">持票人手机号</div>
        <div class="inpBox">
          <input class="inp" type="number" v-model="phone" placeholder="请填写手机号">
        </div>
      </div>
    </div>
    <!--    保存地址-->
    <div class="addNewAddress">
      <div class="btn" @click="addaddress">保存</div>
    </div>
  </div>
</template>
<script>

import { addViewer, editViewer, showViewer} from "@/api/lehuiperform";

export default {
  data() {
    return {
      userName: "",
      phone: "",
      cardId: "",
      id: ""
    }
  },
  methods: {
    // 添加地址
    addaddress() {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (this.userName == "") {
        this.$toast("请填写您的观影人真实姓名");
        return
      }
      if (!_IDRe18.test(this.cardId)) {
        this.$toast("请正确填写您的身份证号");
        return
      }
      if (!reg_tel.test(this.phone)) {
        this.$toast("请正确填写您的手机号码");
        return
      }
      let data = {
        name: this.userName,	//是	string	姓名
        type: 1,	//是	num	1-身份证 传递1
        num: this.cardId,	//是	string	身份证
        phone: this.phone
      }
      if (!this.id) {
        addViewer(data).then(res => {
          // console.log(res)
          this.$toast(res.msg)
          if (res.code == 200) {
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          }
        })
      } else {
        editViewer({
          ...data,id:this.id
        }).then(res => {
          // console.log(res)
          this.$toast(res.msg)
          if (res.code == 200) {
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          }
        })
      }
    },
    getshow(id){
      showViewer({
        id
      }).then(res=>{
        // console.log(res)
        if(res.code == 200){
          let show = res.data.show
          this.userName = show.name
          this.cardId = show.num
          this.phone = show.phone
        }
      })
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.$route.query.id) {
      document.title = "编辑观影人"
      this.getshow(this.$route.query.id)
    } else {
      document.title = "新增观影人"
      this.loadingflag = false
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
  padding: 7px 10px;

  .consignee {
    display: flex;
    align-items: center;
    gap: 25px;
    padding: 13px 5px;
    border-bottom: 1px solid #F2F2F2;

    .consigneeText {
      //font-weight: bold;
      width: 25%;
      white-space: nowrap;
      color: 36D6D6D;
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
    color: #3A3A3A;
    white-space: nowrap;
    font-weight: bold;
  }

  .selectAddress2 {
    //padding-left: 16px;
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
    background-image: linear-gradient(to right, #FF3981, #FF50A4);
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