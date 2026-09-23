<template>
  <div class="comPage leftBox" :style="{paddingLeft:change==0?'10px':''}" @click="toDetail">
    <div class="imgBox" :class="{imgBox2:change==1}" :style="{width:change==0?'30%':''}">
      <img class="img" :src="listItem.thumbnailimage" alt="">
    </div>
    <div class="rightBox">
      <div>
        <div class="shopName">{{ listItem.name }}</div>
        <div class="label" v-if="change==1&&listItem.pinpai">{{ listItem.pinpai.name }}</div>
      </div>
      <div class="leftBox atOnce">
        <div class="priceBox">￥<span class="price">{{
            changePrice1(listItem.price)
          }}</span>.{{ changePrice2(listItem.price) }}
        </div>
        <div class="leftBox atOnceBox" v-if="change==1">
          <div>马上拥有</div>
          <div class="right">
            <img class="img" src="../assets/hotshop/right.png" alt="">
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
    listItem: [Array, Object,String, Number],
  },
  data() {
    return {}
  },
  methods: {
    toDetail() {
        this.$goDetail(item);
      
      // this.$router.push({path:"/productDetail",query:{id:this.listItem.id}})
       
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
  padding: 5px;
  gap: 10px;
  margin-top: 10px;
}

.leftBox {
  display: flex;
  align-items: center;
}

.imgBox {
  width: 35%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}

.imgBox2 {
  // box-shadow: 0px 0px 3px 3px #CEE1E4;
}

.rightBox {
  width: 60%;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
}

.right {
  width: 13px;
  padding-top: 4px;
}

.shopName {
  font-size: 15px;
  font-weight: bold;
  color: #585858;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2; /* 显示两行 */
}

.atOnce {
  justify-content: space-between;
  width: 100%;
}

.priceBox {
  color: #CA403E;
  font-size: 14px;

  .price {
    font-size: 17px;
  }
}

.atOnceBox {
  background-color: #3C80CD;
  font-size: 14px;
  text-align: center;
  color: #E6F4F5;
  padding: 1px 5px 2px;
  gap: 2px;
  border-radius: 4px;
}

.label {
  color: #3C80CD;
  font-size: 10px;
  border-radius: 3px;
  display: inline-block;
  max-width: 90%;
  text-align: center;
  padding: 0px 2px;
  border: 1px solid #3C80CD;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 3px;
}
</style>