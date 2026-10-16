<template>
  <div class="memberindex">
    <!-- <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack> -->
    <NProgress v-if="loadingflag"/>
    <div class="topIndex">
      <div class="banner" style="display: none;">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="red" style="border-radius: 10px;">
          <van-swipe-item v-for="(item,index) in banner" :key="index" style="border-radius: 10px;">
            <img :id="item.id" :src=" item.img" alt=""
                 style="border-radius: 10px;width: 100%;height: 100%;">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="list1">
        <div @click="gomemberClass()" class="imgbox">
          <img class="img" :src="img1" :id="yuedu.id" alt="">
        </div>
        <div @click="gomusicmember()" class="imgbox">
          <img class="img" :src="img2" :id="yinyue.id" alt="">
        </div>

        <div @click="goreadmember()" class="imgbox">
          <img class="img" :src="img3" :id="yuedu.id" alt="">
        </div>
        <div @click="gonetmember()" class="imgbox">
          <img class="img" :src="img4" :id="yinyue.id" alt="">
        </div>



      </div>
      <!--  tab切换-->
      <div class="tabList">
        <!-- <div class="titleBox">
          <div class="leftImg">
            <img class="img" src="../../assets/member/zz.png" alt="">
          </div>
          <div>视频会员</div>
          <div class="leftImg">
            <img class="img" src="../../assets/member/yy.png" alt="">
          </div>
        </div> -->
        <!--        会员列表-->
        <div>
          <MemberList :applist="applist" :change="1"></MemberList>
        </div>
      </div>
    </div>
    <!--    列表-->
    <div>
      <List :Kaquanlist="qitalist"></List>
    </div>
  </div>
</template>

<script>
import List from "@/components/List.vue";
import {getKaquan, getKaquanlist, getclassify} from "@/api/member";
import MemberList from "@/components/MemberList.vue";

export default {
  components: {MemberList, List},
  data() {
    return {
      img1:require('@/assets/member/1.png'),
      img2:require('@/assets/member/2.png'),
      img3:require('@/assets/member/3.png'),
      img4:require('@/assets/member/4.png'),
      banner: [],
      yinyue: [],
      yuedu: [],
      applist: [],
      Kaquanlist1: [],
      pageno: 1,
      pagesize: 100,
      ishow: false,
      qitalist: [],
      id: 0,
      loadingflag: true
    };
  },
  methods: {
    getKaquanList() {
      getKaquan({}).then(res => {
        this.loadingflag = false
        // console.log(res.data.yinyue);
        this.applist = res.data.classify
        this.banner = res.data.lbt.lbt
        // this.banner.push(res.data.lbt.lbt[0])
        // console.log(this.banner);
        this.yuedu = res.data.yuedu
        this.yinyue = res.data.yinyue
      })
    },
    getAllKaquanlist() {
      getKaquanlist({
        pageno: this.pageno + "",
        pagesize: this.pagesize + ""
      }).then(res => {
        if (res.code == 200) {
          this.qitalist = res.data
          this.loadingflag = false
          this.ishow = true
        }
        // console.log(this.Kaquanlist1);
      })
    },
    gomemberClass() {
      this.$router.push({path: "/memberClass?id=2"})
    },
    gomusicmember() {
      this.$router.push({path: "/musicmember"})
    },
    goreadmember() {
      this.$router.push({path: "/readmember"})
    },gonetmember() {
      this.$router.push({path: "/netmember"})
    }
  },
  created() {
    this.getKaquanList()
    this.getAllKaquanlist()
  },

};
</script>
<style scoped lang="less">
.memberindex {
  background-color: #f7f7f7;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.list1 {
  display: flex;
  border-radius: 10px;
  // background-image: linear-gradient(to bottom, #D2FFF5, #F9FEFD);
  margin-top: 5px;
  gap: 10px;
  padding: 0px;
}

.topIndex {
  background: linear-gradient(to bottom,#ff6997,#fbe7e8,#f7f7f7);
  position: relative;
  padding: 10px 10px 0px;
}

.tabList {
  // background-image: url("../../assets/member/bg.png");
  background-color: #ffffff;border-radius: 8px;
  background-size: 100% 100%;
  width: 100%;
  height: 134px;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;

  .titleBox {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;

    .leftImg {
      width: 17px;
    }
  }
}
.imgbox{
  width: 25%;
  img{
    width: 100%;
    // height: 107px;
  }
}
</style>