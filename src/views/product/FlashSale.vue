<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <!--    头部-->
    <div class="topBox">
      <div class="topBack">
        <img class="img" src="../../assets/xianshi/back.png" alt="">
      </div>
      <div class="top">
        <div class="quit" @click="returnBack">
          <van-icon name="arrow-left"/>
        </div>
        <div class="present">
          <img class="img" src="../../assets/xianshi/xs.png" alt="">
        </div>
<!--        <div class="downtime">-->
<!--          <div class="time">00</div>-->
<!--          <div>:</div>-->
<!--          <div class="time">{{countdown.split(":")[0]}}</div>-->
<!--          <div>:</div>-->
<!--          <div class="time">{{countdown.split(":")[1]}}</div>-->
<!--        </div>-->
      </div>
      <!--      今日超低商品-->
      <div class="todayBox">
        <div class="topFlex">
          <div class="ultralow">
            <img class="img" src="../../assets/xianshi/cd.png" alt="">
          </div>
          <div>今日超低</div>
        </div>
        <div class="ultralowList">
          <div class="ultralowItem" @click="toDetail(item.id)"  v-for="(item,index) in ultralowList" :key="item.id">
            <div class="imgBox">
              <img class="img" style="border-radius: 3px" :src="item.thumbnailimage" alt="">
            </div>
            <div class="hotText">
              {{ index == 0 ? '疯抢中' : index == 1 ? '省心价' : index == 2 ? '热卖中' : index == 3 ? '限时直降' : '' }}
            </div>
            <div class="priceBox">￥<span class="price">{{ changePrice1(item.price) }}</span>
              <span class="priceNum">.{{ changePrice2(item.price) }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <!--  商品列表-->
    <div class="shopList">
      <div class="shopItem" @click="toDetail(item.id)" v-for="(item,index) in productList" :key="item.id" :style="{marginTop:index==0?'':'10px'}">
        <div class="shopImg">
          <img class="img" style="border-radius: 8px"
               :src="item.thumbnailimage" alt="">
        </div>
        <div class="rightBox">
          <div class="textBox">
            <span class="label" v-if="item.pinpai">{{ item.pinpai.name }}</span>
            <span class="shopName">{{ item.name }}</span>
          </div>
          <div class="robBox">
            ￥<span class="price">{{ changePrice1(item.price) }}</span>
            <span class="priceNum">.{{ changePrice2(item.price) }}</span>
            <span class="delPrice">￥{{ (Number(item.qianggou_price) + Number(item.price)).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getfourSaleList, getSaleList} from "@/api";

export default {
  name: "FlashSale",
  data() {
    return {
      ultralowList: [],
      price: 74.00,
      pageno: 1,
      productList: [],
      isScroll: false,
      timeDowm:1800,
      countdown:"",
      loadingflag:true
    }
  },
  methods: {
    // getadver() {
    //   let time = parseInt(new Date().getTime() / 1000) + '';
    //   // this.timeDowm = Number(this.orderDetail.expiretime) - time
    //   const countdownInterval = setInterval(() => {
    //     const minutes = Math.floor(this.timeDowm / 60);
    //     const seconds = this.timeDowm % 60;
    //     this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    //     this.timeDowm--;
    //     if (this.timeDowm <= 0) {
    //       clearInterval(countdownInterval);
    //       // 倒计时结束后的操作
    //       this.timeDowm = 1800
    //       this.getadver()
    //     }
    //     localStorage.setItem("timeDowm", this.timeDowm)
    //   }, 1000);
    // },
    toDetail(id) {
      
        this.$router.push({path:"/productDetail",query:{id}})
      
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    returnBack() {
      this.$router.go(-1)
    },
    // 上方四个
    getfourSale() {
      getfourSaleList().then(res => {
        if (res.code == 200) {
          this.ultralowList = res.data.product_list
        }
      })
    },
    // 下方列表
    getSale(pageno = this.pageno) {
      getSaleList({
        pageno,
        pagesize: 10
      }).then(res => {
        setTimeout(()=>{
          this.loadingflag = false
        },1000)
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.product_list.forEach(item => {
            this.productList.push(item)
          })
        }
      })
    },
//滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        this.pageno++
        this.getSale()
      }
    }
  },
  created() {
    this.getfourSale()
    this.getSale()
    // if(localStorage.getItem("timeDowm")){
    //   this.timeDowm = localStorage.getItem("timeDowm")
    //   this.getadver()
    // }else{
    //   this.getadver()
    // }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>

<style scoped lang="less">
.conPage {
  background-color: #F0F0F0;
  min-height: 100vh;
}

.topBox {
  background-image: linear-gradient(to bottom, #F82D2B, #F5605C);
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 15px 15px 20px;

  .topBack {
    width: 130%;
    position: absolute;
    top: -149px;
    left: -34px;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 10px;

    .quit {
      color: white;
      font-size: 18px;
    }

    .downtime {
      display: flex;
      align-items: center;
      font-size: 12px;
      gap: 3px;
      color: #FAA39D;
      margin-top: -5px;
    }

    .time {
      color: #F16367;
      background-color: white;
      border-radius: 3px;
      padding: 2px;
      width: 15px;
      height: 14px;
      line-height: 14px;
      text-align: center;
    }

    .panicImg {
      width: 67px;
    }

    .present {
      width: 110px;
    }
  }

  .todayBox {
    background-color: #FFE9E9;
    border-radius: 8px;
    position: relative;
    margin-top: 11px;

    .ultralow {
      width: 26px;
    }

    .topFlex {
      display: flex;
      font-weight: bold;
      gap: 5px;
      padding: 5px 5px;
      color: #191616;
    }

    .ultralowList {
      background-color: white;
      padding: 8px 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ultralowItem {
      width: 33%;
    }

    .imgBox {
      width: 64%;
      margin: auto;
    }

    .priceBox {
      font-weight: bold;
      font-size: 12px;
      color: #EC3037;
      text-align: center;
      margin-top: 5px;

      .price {
        font-size: 15px;
      }

      .priceNum {
        font-size: 12px;
      }
    }

    .hotText {
      background-color: #FFF8FC;
      border: 1px solid #FBE7F0;
      color: #F0585E;
      border-radius: 30px;
      text-align: center;
      font-size: 12px;
      width: 70%;
      margin: auto;
      margin-top: -5px;
      position: relative;
      z-index: 2;
      padding: 2px 0px;
    }
  }
}

.shopList {
  background-color: #F0F0F0;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: -10px;
  position: relative;

  .shopItem {
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    gap: 10px;

    .shopImg {
      //width: 117px;
      width: 35%;
    }

    .robBox {
      background-image: url("../../assets/xianshi/qg.png");
      width: 100%;
      height: 33%;
      background-size: 100% 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding-left: 10px;
      color: #ED3137;
      font-weight: bold;
      font-size: 13px;
    }

    .rightBox {
      width: 65%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .price {
      font-size: 20px;
    }

    .priceNum {
      font-size: 15px;
    }

    .delPrice {
      font-size: 10px;
      color: #D6CBCB;
      text-decoration: line-through;
      padding-left: 6px;
    }

    .label {
      background-color: #EC2C32;
      color: white;
      font-size: 12px;
      padding: 2px 3px;
      border-radius: 2px;
    }

    .shopName {
      padding-left: 10px;
      font-size: 15px;
      font-weight: bold;
      color: #3F3F3F;
      line-height: 23px;
    }
  }
}

.textBox {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2; /* 显示两行 */
}
</style>