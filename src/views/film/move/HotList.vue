<template>
  <div class="hotlist" style="background-color: #f0f0f0;">
    <ReturnBack :rcolor="'#000'" :bcolor="'#fff0'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="title" style="display: flex;background-color: #fff;margin-bottom: 10px">
        <div style="color: red;font-weight: 600;width: 100%;display: flex;justify-content: center;align-items: center;margin: 9px 0;">
          <img style="width: 4vw;justify-self: center;margin-right: 1vw;" src="@/assets/number/logo.png" alt="">
          <span>热映榜单</span>
        </div>
    </div>
    <div class="filmboxMax">
      <div class="filmbox" v-for="(item,index) in hotfilmList" :key="index" @click="filmdetail(item.movieCode)">
        <div class="filmleft">
          <div class="posterUrl">
            <img class="img" :src="item.posterUrl" alt="" style="">
            <div class="score">评分 {{ item.score }}</div>
            <img class="logonum" v-if="index<10" :src="require('@/assets/number/'+(index+1)+'.png')" alt="">
          </div>
          <div class="nameBox">
            <div class="elips1 itemName">{{ item.name }}</div>
            <div class="starBox" v-if="item.star">
              <div class="font1">主演:</div>
              <div class="font2 elips1">{{ item.star.split(" ").join("/") }}</div>
            </div>
            <div class="starBox" v-if="item.director">
              <div class="font1">导演:</div>
              <div class="font2 elips1">{{ item.director }}</div>
            </div>
            <div class="starBox categoryBox ">
              <div v-if="item.category" class="category elips1">{{ item.category.split("|").join("/") }}</div>
              <div v-if="item.version" class="category elips1">{{ item.version }}</div>
            </div>
          </div>
        </div>
        <div class="filmright">
          <div class="pap"  @click.stop="buyticket(item)">购 票</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
//调用热映电影列表
import {getFilmList} from "@/api/lehuifilm";
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getHitFilmList} from "@/api/lehuifilm";
moment.locale('zh-cn');
export default {
  data() {
    return {
        hotfilmList:[],
        cityid:null,
        loadingflag:true
    }
  },

  mounted() {
  },
  created() {
    this.cityid = Number(sessionStorage.getItem("targetId2"))
    this.getFilm()
  },

  methods: {
    getFilm() {
      getHitFilmList({
        cityId: this.cityid,
        pageSize: 99999999
      }).then(res => {
        // console.log(res)
        this.loadingflag = false
        if (res.code == 0) {
          this.hotfilmList = res.data.movies
        }
      })
    },
    filmdetail(id){
      this.$router.push({path: "/filmdetail", query: {id}})
    },
    buyticket(item) {
      this.$router.push({
        path: "/multiplex",
        query: {movieId: item.movieId,movieCode:item.movieCode,moveName:item.name}
      })
    },
    },
};
</script>

<style scoped lang="less">
/deep/.ReturnBack {
  top: 5px !important;
}
.filmboxMax {
  padding: 0px 11px 11px;
  margin-top: 2px;
}

.filmbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-radius: 6px;
  background-color: white;
  padding: 15px 12px;

  .filmleft {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 71%;


    .score {
      position: absolute;
      left: 0;
      bottom: 0px;
      z-index: 100;
      color: #fff;
      background-image: linear-gradient(to bottom, #00000012, #000000);
      font-size: 12px;
      width: 100%;
      padding: 5px 9px 5px;
      box-sizing: border-box;
    }

    .logonum {
      position: absolute;
      top: 0px;
      left: 5px;
      width: 18px;
    }
    .posterUrl {
      min-width: 90px;
      width: 90px;
      overflow: hidden;
      border-radius: 7px;
      position: relative;
      img {
        display: flex;
      }
    }

    .nameBox {
      width: calc(100% - 84px);
      font-size: 13px;

      .itemName {
        font-size: 18px;
      }

      .starBox {
        display: flex;
        align-items: center;
        white-space: nowrap;
        gap: 2px;
        margin-top: 5px;
      }

      .font1 {
        color: #A2A2A2;
      }

      .categoryBox {
        gap: 6px;
        margin-top: 11px;

        .category {
          color: #A7A7A7;
          border-radius: 1px;
          border: 1px solid;
          font-size: 10px;
          height: 18px;
          line-height: 18px;
          padding: 0px 6px;
          max-width: 112px;
        }
      }

    }
  }

  .filmright {
    padding-top: 3px;

    .itemscore {
      font-size: 12px;
      color: #756B59;
      text-align: end;

      span {
        color: #E48642;
        font-size: 15px;
      }
    }

    .pap {
      background-image: linear-gradient(to bottom, #FE7300, #F72524);
      font-size: 12px;
      color: #fff;
      border-radius: 30px;
      width: 63px;
      height: 27px;
      margin-top: 17px;
      text-align: center;
      line-height: 27px;
    }
  }
}
.elips1 {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  //width: 100% !important;
}

</style>