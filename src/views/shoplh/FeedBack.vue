<template>
  <div class="bg">

    <div class="sflex">
      <img :src="topImg" class="topImg" alt="">
      <div class="topbg">
        <a :href="kefu">
          <span class="top1">对于交易相关的问题，如需咨询， 请联系在线客服</span>
          <span class="top2"> 商品、订单、物流、支付、使用方法等方面的问题请联系客服，如客服不能及时回复，请耐心等待。</span>
          <span class="topkf">联系客服</span>

        </a>
      </div>
    </div>

    <div class="pd15">
      <div class="bgfff">



        <div class="dflex" v-for="items in dataList.slice(0, 5)" :key="items.id" @click="detail(items.id)">
          <img :src="items.img" alt="" class="lfimg">
          <div class="flex1">

            <div>
              <span class="t1">{{ items.title }}</span>
              <span class="t2">{{ items.content }}</span>
            </div>

            <div class="rt"><img :src="rt" alt=""></div>
          </div>

        </div>



      </div>


      <div class="bgfff mt10">
        <div class="dflex" v-for="item in dataList.slice(5, 9)" :key="item.id" @click="detail(item.id)">
          <img :src="item.img" alt="" class="lfimg">
          <div class="flex1">
            <div>

              <span class="t1">{{ item.title }}</span>
              <span class="t2">{{ item.content }}</span>
            </div>
            <div class="rt"><img :src="rt" alt=""></div>
          </div>

        </div>


      </div>




    </div>

  </div>
</template>

<script>
 
import { feedbackClass } from "@/api/lhjdtm";
//引入
 
// import { getLogo } from "@/api/locality/login"
 
// moment.locale('zh-cn');
export default {
  data() {
    return {
      timestamp: null, token: '', dataList: '',
      kefu: "",
      topImg: require("../../assets/yj/top.png"),
      src1: require("../../assets/yj/1.png"),
      src2: require("../../assets/yj/2.png"),
      src3: require("../../assets/yj/3.png"),
      src4: require("../../assets/yj/4.png"),
      src5: require("../../assets/yj/5.png"),
      src6: require("../../assets/yj/6.png"),
      src7: require("../../assets/yj/7.png"),
      src8: require("../../assets/yj/8.png"),
      rt: require("../../assets/yj/r.png"),
    }
  },

  mounted() {
    this.getFilm()
  },
  created() {
    this.token = localStorage.getItem("token")
    // this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    
    // this.getLoginInfo()
  },

  methods: {
    getFilm() {
      feedbackClass({
        token: this.token,
      }).then(res => {
        console.log(res)
        this.dataList = res.data;

      })
    },
    detail(id) {
      this.$router.push({ path: "/FeedBackdetails", query: { id } })
    },
    buyticket(item) {
      this.$router.push({
        path: "/multiplex",
        query: { movieId: item.movieId, movieCode: item.movieCode, moveName: item.name }
      })
    },
    getLoginInfo() {
      getLogo().then(res => {
        if (res.code == 200) {
          this.kefu = res.data.zxkf
        }
      })
    },
  },
};
</script>

<style scoped lang="less">
.topbg a {
  color: #000;
}

.topbg a:hover {
  color: #000;
}

.flex1 {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topkf {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 9px;
  color: #D56665;
  border: 1px solid #D56665;
  border-radius: 50px;
  padding: 2px 4px;
}

.topbg {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  position: relative;
}

.top1 {
  font-weight: 500;
  display: inline-block;
  line-height: 1.3;
}

.top2 {
  font-size: 11px;
  color: #666666;
  line-height: 14px !important;
}

.topImg {
  width: 120px;
  margin-right: 10px;
}

.mt10 {
  margin-top: 10px;
}

.bg {
  padding-bottom: 50px;
  background-color: #FFE9E4;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.pd15 {
  padding: 15px;
}

.bgfff {
  background-color: #ffffff;
  border-radius: 10px;
}

.sflex {
  padding: 15px 15px 0 15px;
  display: flex;
  font-size: 14px;
}

.dflex {
  font-size: 14px;
  padding: 14px 15px;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;

  .t2,
  .t1 {
    display: block;
  }

  .t1 {
    font-weight: 500;
  }

  .t2 {
    color: #666666;
  }
}

.lfimg {
  width: 40px;
  margin-right: 10px;
}

.rt {
  img {
    width: 8px;
    padding-left: 20px;
  }

}
</style>