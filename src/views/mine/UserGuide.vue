<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <div class="funlist">
      <div v-for="item in funList" :key="item.id">
        <a @click="changeHash('#s'+item.id)">
          <div class="imgBox">
            <img class="img" :src="item.img" alt="">
          </div>
          <div class="text">{{ item.text }}</div>
        </a>
      </div>
    </div>
    <div>
      <!--    商城-->
      <div :id="'s'+item.id" v-for="(item,index) in contentList" v-if="item.content" :key="item.title">
        <div class="titleBox">
          <div class="number">{{ index + 1 }}.</div>
          <div>{{ item.title }}</div>
        </div>
        <div class="contentBox">
          <div class="content" v-html="item.content"></div>
        </div>
      </div>
    </div>
<!--    列表-->
    <div class="ListBox">
      <div class="list" v-if="!isShow"  @click="getPop()">
        <img class="img" src="../../assets/mine/shiyong/lb.png" alt="">
      </div>
      <div class="list" v-else  @click="closePop()">
        <img class="img" src="../../assets/mine/shiyong/cu.png" alt="">
      </div>
      <div class="sortList" :class="isShow ? 'show' : 'hidden'">
        <div v-for="item in sortList" :key="item.id">
          <a @click="changeHash('#s'+item.id)">
            <div class="imgBox">
              <img class="img" :src="item.img" alt="">
            </div>
            <div class="text">{{ item.text }}</div>
          </a>
        </div>
      </div>
    </div>
<!--    返回顶部-->
      <div class="goTop" @click.stop="goTop">
        <img class="img" src="../../assets/mine/shiyong/db.png" alt="">
      </div>
  </div>
</template>
<script>
import {getGuide} from "@/api/mine";

export default {
  name: "UserGuide",
  data() {
    return {
      funList: [
        {
          id: 1,
          img: require("../../assets/mine/shiyong/scc.png"),
          text: "商城选购",
        },
        {
          id: 2,
          img: require("../../assets/mine/shiyong/dyy.png"),
          text: "电影选购",
        },
        {
          id: 3,
          img: require("../../assets/mine/shiyong/dgg.png"),
          text: "蛋糕选购",
        },
        {
          id: 4,
          img: require("../../assets/mine/shiyong/tss.png"),
          text: "图书选购",
        },
      ],
      tushu: {},
      shangcheng: {},
      dianying: {},
      dangao: {},
      contentList: [],
      timer:null,
      isShow:false,
      sortList:[
        {
          id: 1,
          img: require("../../assets/mine/shiyong/sc.png"),
          text: "商城",
        },
        {
          id: 2,
          img: require("../../assets/mine/shiyong/dy.png"),
          text: "电影",
        },
        {
          id: 3,
          img: require("../../assets/mine/shiyong/dg.png"),
          text: "蛋糕",
        },
        {
          id: 4,
          img: require("../../assets/mine/shiyong/ts.png"),
          text: "图书",
        },
      ],
      isTop:false,
      loadingflag:true
    }
  },
  methods: {
    getPop() {
      this.isShow = true
    },
    closePop() {
      this.isShow = false
    },
    // 返回顶部
    goTop(){
      var num = 0
      this.timer = setInterval(()=>{
        num+=10
        document.documentElement.scrollTop -= num;
        if(document.documentElement.scrollTop<=0){
          clearInterval(this.timer)
        }
      },10)
    },
    //锚点跳转
    changeHash(idname) {
      if(document.querySelector(idname)){
        document.querySelector(idname).scrollIntoView(true);
      }
    },
    getGuideInfo() {
      getGuide().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.tushu = res.data.tushu
          this.shangcheng = res.data.shangcheng
          this.dianying = res.data.dianying
          this.dangao = res.data.dangao
          this.tushu.id = 4
          this.shangcheng.id = 1
          this.dianying.id = 2
          this.dangao.id = 3
          this.contentList.push(
              this.shangcheng,
              this.dianying,
              this.dangao,
              this.tushu,
          )
        }
      })
    }
  },
  created() {
    this.getGuideInfo()
  }
}
</script>
<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #FFE7C6;
}

.funlist {
  padding: 25px 20px 20px;
  display: flex;
  justify-content: space-around;

  .imgBox {
    width: 50px;
    margin: auto;
  }

  .text {
    font-size: 14px;
    margin-top: 1px;
  }
}

.titleBox {
  display: flex;
  align-items: center;
  background-image: linear-gradient(to right, #EE9037, rgba(252, 216, 173, 0));
  color: #FDFAF8;
  padding: 6px 10px 7px;

  .number {
    transform: rotate(-10deg);
    font-size: 26px;
    color: #F4B376;
  }
}

.contentBox {
  padding: 0px 15px 15px;

  .content {
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;

    /deep/ p {
      margin: 0;
    }

    /deep/ img {
      width: 100%;
      display: block;
    }
  }
}
.goTop{
  position: fixed;
  bottom: 10px;
  right: 5px;
  width: 40px;
}
.ListBox{
  position: fixed;
  bottom: 138px;
  right: 5px;
  .list{
    width: 40px;
    position: relative;
    z-index: 8;
  }
}
.show {
  transform: translateX(0);
}

.hidden {
  transform: translateX(110%);
}
.sortList{
  display: flex;
  background-color: rgba(0, 0, 0, 0.52);
  padding: 2px;
  padding-right: 22px;
  padding-left: 8px;
  box-sizing: border-box;
  width: 262px;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  color: white;
  position: absolute;
  right: 20px;
  top: 0;
  height: 40px;
  transition: all 0.3s;
  .imgBox {
    width: 18px;
    margin: auto;
  }

  .text {
    font-size: 12px;
    margin-top: -1px;
  }
}
</style>