<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#34495B'" :bcolor="'rgb(255 255 255 / 41%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
   
    <div>
      <img class="img" :src="brand.banner" alt="">
    </div>
    <!--    介绍-->
    <div class="info">
      <div class="infoBox">
        <div class="againstBox">
          <div class="vector">
            <img class="img" src="@/assets/dangao/Vector.png" alt="">
          </div>
          <div class="price" v-if="coupons.price">
            <span>{{ changePrice1(coupons.price) }}</span>.{{ changePrice2(coupons.price) }}
          </div>
        </div>
        <div class="shopName">{{ coupons.title }}</div>
      </div>
      <!-- <div class="validity">有效期 至{{ timestampToTime(coupons.end_time) }}</div> -->
    </div>
    <!--    商品详情-->
    <div>
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-html="brand.content" class="brandcontent">

      </div>
    </div>
    <!--    兑换须知-->
    <div v-if="coupons.content">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">兑换须知</div>
        <div class="line"></div>
      </div>
      <div v-html="coupons.content" class="couponsContent">
      </div>
    </div>
    <div class="footer">
      <div class="kefuBox" @click="toKefu">
        <div class="kefu">
          <img class="img" src="@/assets/tubiao/kfz.png" alt="">
        </div>
        <div>客服</div>
      </div>
      <div class="btn" @click="toCouPonComfireOrder" :class="{btn2:isBuy!=0}">{{
          isBuy == 1 ? '正在补货中...' : isBuy == 2 ? '您今日购卡次数已上限' : isBuy == 3 ? '您今日总购卡次数已上限' : '立即兑换'
        }}
      </div>
    </div>
  </div>
</template>
 <script>
// 1. 引入正确的商品详情接口
import { getCouponsDetail } from "@/api/lehuicake";

export default {
  name: "CouPonDetail",
  data() {
    return {
      bannerList: [],
      brand: {}, // 品牌信息
      coupons: {}, // 电子券信息
      loadingflag: true,
      isBuy: "", // 0-可售 1-没可用电子券 2-超了每日可购买数量 3-超了总限购
      cid: "2", // 城市ID
      signal: 0, // 保留原有逻辑，用于判断是否显示补货客服
    };
  },
  methods: {
    toKefu() {
      window.location.href = localStorage.getItem("kefu");
    },
    
    // 价格处理
    changePrice1(price) {
      if (!price) return "0";
      return price.toString().includes(".") ? price.toString().split(".")[0] : price;
    },
    changePrice2(price) {
      if (!price) return "00";
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split(".")[1] : "00";
    },

    // 点击立即兑换
    toCouPonComfireOrder() {
      if (this.isBuy == 1) {
        // 显示正在补货中，先判断特定品牌的提示
        if (
          this.signal == 1 &&
          (this.brand.id == 13 || this.brand.id == 18 || this.brand.id == 73 || this.brand.id == 74 || this.brand.id == 75)
        ) {
          this.$dialog
            .confirm({
              title: "提示",
              message: "遇到电子券补充中需联系客服",
              confirmButtonColor: "red",
            })
            .then(() => {
              this.toKefu();
            })
            .catch(() => {});
        } else {
          this.$toast("卡已售罄");
        }
        return;
      }
      if (this.isBuy == 2) {
        this.$toast("您今日购卡次数已上限");
        return;
      }
      if (this.isBuy == 3) {
        this.$toast("您今日总购卡次数已上限");
        return;
      }
      // 可售状态，跳转确认订单页
      this.$router.push({ path: "/CakeCouPonConfirmOrder", query: { id: this.coupons.id, cid: this.cid } });
    },

    // 获取商品详情
    getCouPonShopDetail(id) {
      this.loadingflag = true;
      
      // 取当前城市ID（如果路由带了cid，优先用路由的）
      if (this.$route.query.cid) {
        this.cid = this.$route.query.cid;
      }

      // 2. 调用正确的接口，传 cid 和 id
      getCouponsDetail({
        cid: this.cid,
        id: id,
      })
        .then((res) => {
          this.loadingflag = false;
          
          // 兼容拦截器解析层级
          const resData = res.data?.data || res.data;

          if (res.code == 200) {
            this.brand = resData.brand || {};
            this.coupons = resData.coupons || {};
            this.isBuy = resData.buy;
          } else {
            this.$toast(res.msg || "获取商品详情失败");
          }
        })
        .catch((err) => {
          this.loadingflag = false;
          console.error("商品详情请求报错:", err);
          this.$toast("网络请求异常");
        });
    },
  },
  created() {
    // 3. 接收路由传过来的电子券 id（兼容 query.id 或 query.brand_id）
    const couponId = this.$route.query.id;
    
    if (couponId) {
      this.getCouPonShopDetail(couponId);
    } else {
      this.loadingflag = false;
      this.$toast("缺少电子券ID");
    }
  },
};
</script>
<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  padding-bottom: 65px;
}

.bannerImg {
  //height: 315px !important;
}

.info {
  background-color: white;
  padding: 15px;
}

.againstBox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding-left: 10px;

  .vector {
    width: 15px;
  }

  .price {
    color: #CA4240;

  }

  .price span {
    font-size: 18px;

  }
}

.shopName {
  margin-top: 5px;
}

.infoBox {
  border-bottom: 1px solid #F9F9F9;
  padding-bottom: 11px;
}

.validity {
  padding: 12px 8px 7px;
  font-size: 14px;
}

.shopDetailTextBox {
  padding: 24px 0px 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .line {
    border: 1px solid #E3E3E3;
    width: 50px;
  }

  .shopDetailText {
    font-size: 12px;
    color: #7B7B7B;
  }
}

.footer {
  position: fixed;
  width: 100%;
  background-color: #fff;
  left: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  box-sizing: border-box;

  .kefuBox {
    width: 20%;
    text-align: center;
  }

  .kefu {
    width: 25px;
    margin: auto;
  }

  .btn {
    width: 80%;
    color: white;
    height: 40px;
    line-height: 40px;
    background-image: linear-gradient(to right, #F57372, #DD0E0C);
    text-align: center;
    border-radius: 30px;
  }

  .btn2 {
    background-image: linear-gradient(to right, #f573728a, #dd0e0c75);
  }
}

.brandcontent {
  /deep/ img {
    width: 100%;
  }
}

.couponsContent {
  background-color: white;
  padding: 10px 10px 10px 25px;
  font-size: 14px;

  /deep/ img {
    width: 100%;
  }

  /deep/ p {
    margin: 10px 0px;
    font-size: 14px !important;
  }

  /deep/ p span {
    font-size: 14px !important;
  }
}
</style>
