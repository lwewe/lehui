<template>
  <div class="conPage">
    <div class="add" @click="add">+ 新增观影人</div>
    <div class="listBox">
      <van-checkbox
          @click="checkOnce(item)"
          class="checkbox"
          :label-disabled="true"
          checked-color="#F26C92"
          v-model="item.isCheckout"
          v-for="(item, index) in cartList"
          :key="item.id"
          :name="item"
      >
        <div>
          <div class="username">{{ item.name }}</div>
          <div class="cardid">
            <span>身份证</span>
            <span class="cardidText">{{ item.num }}</span>
          </div>
          <div class="cardid">
            <span>手机号</span>
            <span class="cardidText">{{ item.phone }}</span>
          </div>
        </div>
        <div class="delBox">
          <div class="delImg">
            <img class="img" src="@/assets/yanchu/sc.png" alt="">
          </div>
          <div class="delText" @click.stop="deleteAdress(item.id)">删除</div>
        </div>
      </van-checkbox>
    </div>
    <div class="titleBox valueNumber">
      <div class="title">
        还需选择<span class="selected">{{result.length}}</span>/{{quantity}}位观影人
      </div>
      <div class="speBox btn" @click="comfire">确认</div>
    </div>
  </div>
</template>
<script>

import {delViewer, getViewerList} from "@/api/lehuiperform";

export default {
  name: "ChooseMoviegoers",
  data() {
    return {
      cartList: [],
      result:[],
      quantity:0
    }
  },
  methods: {
    getScaddressList() {
      this.cartList = []
      getViewerList().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          // console.log(res)
          res.data.list.forEach(item=>{
            this.cartList.push({
              ...item,
              isCheckout:false
            })
          })
          if(this.result.length>0){
            this.result.forEach(item=>{
              this.cartList.forEach(item2=>{
                if(item.id==item2.id){
                  item2.isCheckout = true
                }
              })
            })
          }
        }
      })
    },
    deleteAdress(id) {
      this.$dialog.confirm({
        message: '是否要删除该观影人？',
        confirmButtonColor: '#FE60A0'
      }).then(() => {
        delViewer({
          id
        }).then(res => {
          if (res.code == 200) {
            this.$toast(res.msg)
            this.getScaddressList()
          }else{
            this.$toast(res.msg)
          }
        })
      }).catch(() => {
      })
    },
    checkOnce(item) {
      item.isCheckout = !item.isCheckout
      this.result = this.cartList.filter(item => item.isCheckout == true)
    },
    comfire(){
      if(this.result.length!=this.quantity){
        if(this.quantity>this.result.length){
          this.$toast("您还需选择"+(Number(this.quantity)-this.result.length)+"位观影人")
        }else{
          this.$toast("您多选了"+(this.result.length-Number(this.quantity))+"位观影人")
        }
        return
      }
      sessionStorage.setItem("resultMoviegoer",JSON.stringify(this.result))
      this.$router.go(-1)
    },
    add(){
      this.$router.push("/addMoviegoers")
    }
  },
  created() {
    this.quantity = this.$route.query.quantity
    this.getScaddressList()
    if (sessionStorage.getItem("resultMoviegoer")) {
      this.result = JSON.parse(sessionStorage.getItem("resultMoviegoer"))
    }
  }
}
</script>
<style scoped lang="less">
.conPage {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

.add {
  text-align: end;
  color: #D55E81;
  font-size: 15px;
  font-weight: bold;
}

.listBox {
  margin-top: 5px;

  .checkbox {
    background-color: white;
    padding: 15px 12px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .username {
    font-weight: bold;
  }

  /deep/ .van-checkbox__label {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }

  .cardid {
    font-size: 15px;
    color: #6B6B6B;
    margin-top: 8px;
  }

  .cardidText {
    padding-left: 10px;
  }

  .delBox {
    display: flex;
    align-items: center;
    gap: 3px;

    .delImg {
      width: 15px;
    }

    .delText {
      color: #6C6C6C;
    }
  }
}

.valueNumber {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding: 7px 15px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 3000;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  color: #5F5F5F;

  .selected {
    color: #D25479;
  }

  .btn {
    color: white;
    background-image: linear-gradient(to right, #FF3981, #FF4EA2);
    width: 107px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 30px;
  }
}
</style>