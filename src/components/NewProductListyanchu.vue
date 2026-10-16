<template>
  <div class="comPage" :class="{comPage2:board==1&&index==0,comPage3:board==1}" :style="{paddingLeft:change==0?'10px':''}"
       @click="toDetail">
    <div class="ranking" v-if="board==1"  :style="{backgroundImage:index==0?'linear-gradient(to right, #FE5566, #FE489D)':index==1?'linear-gradient(to right, #FC7F3F, #FD5467)':index==2?'linear-gradient(to right, #FFD304, #FBB304)':''}">
      NO.{{ index + 1 }}
    </div>
    <div class="flexBox leftBox">
      <div class="imgBox" :class="{imgBox2:change==1}" :style="{width:change==0?'30%':''}">
        <div class="imgText">{{ listItem.subClassifyName }}</div>
        <img class="img" style="object-fit: cover" :src="listItem.showPic" alt="">
      </div>
      <div class="rightBox">
        <div class="wantSeeBox">
          <div class="shopName">{{ listItem.projectName }}</div>
          <div class="wantSee" v-if="see==1" @click.stop="wanSee">
            <img class="img" style="object-fit: inherit" src="../assets/yanchu/yaol.png" alt="">
          </div>
        </div>
        <div>
          <div class="time" style="font-size: 12px" v-if="listItem.showStartTime&&listItem.showEndTime"> {{
              listItem.showStartTime.split(" ")[0].replace(/-/g, ".")
            }}-{{ listItem.showEndTime.split(" ")[0].split("-").slice(1).join(".") }}
          </div>
          <div class="time" style="font-size: 12px" v-else>{{listItem.shijian}}</div>
        </div>
        <div>
          <div class="time" v-if="see==1">{{ listItem.address}}</div>
          <div class="time" v-else>{{ listItem.cityName }} | {{ listItem.venueName }}</div>
        </div>
        <div class="leftBox atOnce" :class="{atOnce3:board==2}">
          <div class="priceBox" :class="{atOnce2:board==1||board==2,priceBox2:board==2}"><div class="priceIcon">￥</div><div
              class="price">{{ listItem.minPrice }}</div>起
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NewProductList",
  props: {
    change: [String, Number],
    index: [String, Number],
    board: [String, Number],
    see: [String, Number],
    listItem: [Array, Object, String, Number],
  },
  data() {
    return {}
  },
  methods: {
    toDetail() {
      this.$router.push({path:"/performDetail",query:{id:this.listItem.projectId,type:this.listItem.subClassifyName}})
    },
    wanSee(){
      this.$emit("changeSee",this.listItem)
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
  },
  created() {

  }
}
</script>

<style scoped lang="less">
.comPage {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  position: relative;
}

.comPage2 {
  border-radius: 0px;
  margin-top: 0px;
  padding-top: 22px !important;
}
.comPage3 {
  padding: 15px 23px;
  border-radius: 0px;
}

.flexBox {
  gap: 10px;
}

.leftBox {
  display: flex;
  align-items: center;
}

.imgBox {
  width: 24%;
  //width: 80px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  position: relative;
}

.imgText {
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 3px;
  right: 4px;
  font-size: 10px;
  max-width: 60px;
  height: 14px;
  overflow: hidden;
  background-color: #191521cc;
  color: white;
  border-radius: 3px;
  text-align: center;
  line-height: 14px;
  padding: 1px;
  box-sizing: border-box;
}

.imgBox2 {
  box-shadow: 0px 0px 3px 3px #CEE1E4;
}

.rightBox {
  width: 73%;
}

.right {
  width: 13px;
  padding-top: 4px;
}

.shopName {
  font-size: 15px;
  font-weight: bold;
  //color: #585858;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2; /* 显示两行 */
}

.atOnce {
  justify-content: space-between;
  width: 100%;
}

.atOnce2 {
  justify-content: flex-start !important;
}
.atOnce3 {
  justify-content: flex-end !important;
}

.priceBox {
  font-size: 10px;
  margin-top: 10px;
  color: #ACACAC;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  .price {
    color: #C74F72;
    font-size: 15px;
  }

  .priceIcon {
    color: #C74F72;
  }
}

.atOnceBox {
  background-color: #098FA1;
  font-size: 14px;
  text-align: center;
  color: #E6F4F5;
  padding: 1px 5px 2px;
  gap: 2px;
  border-radius: 4px;
}

.label {
  color: #4CADBA;
  font-size: 10px;
  border-radius: 3px;
  display: inline-block;
  max-width: 90%;
  text-align: center;
  padding: 0px 2px;
  border: 1px solid #4CADBA;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 3px;
}

.ranking {
  background-image: linear-gradient(to right, #8F9EBA, #7584A3);
  width: 64px;
  height: 24px;
  color: white;
  line-height: 24px;
  text-align: center;
  border-radius: 30px;
  border-bottom-left-radius: 0px;
  margin-bottom: 8px;
  font-size: 14px;

  .rankingBox {
    width: 23px;
    height: 33px;
  }
}

.time {
  font-size: 13px;
  color: #A0A0A0;
  margin-top: 10px;
}
.priceBox2{
  background-size: 100% 100%;
  width: 112px;
  height: 28px;
  box-sizing: border-box;
  line-height: 28px;
  background-image: url("../assets/yanchu/qiang2.png");
  color: white;
  padding-left: 6px;
  .price {
    color: white;
  }

  .priceIcon {
    color: white;
  }
}
.wantSeeBox{
  display: flex;
  justify-content: space-between;
}
.wantSee{
  min-width: 24px;
  max-width: 24px;
  min-height: 24px;
  max-height: 24px;
}
</style>