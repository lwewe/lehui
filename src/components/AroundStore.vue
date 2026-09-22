<template>
  <div class="aroundstore">
    <div class="searchbox" style="display: flex;height: 50px;align-items: center;">
        <p class="left">
            <span class="city" @click="gocitylist()">石家庄市</span>
            <van-icon name="arrow-down" />
        </p>
        <div class="right" style="position: relative;">
            <input class="search" type="text" placeholder="搜索门店" style="">
            <van-icon name="search" size="1.2em" class="searchicon" style=""/>
        </div>
    </div>
    <van-tabs v-model:active="active">
        <van-tab title="附近餐厅">
            <ul class="listbox">
                <li class="list" v-for="(item,index) in aroundlist" :key="index">
                    <p class="top">
                        <span class="title">{{ item.name }}</span>
                        <button v-if="num1==1" @click="diancan()" class="btn" style="color: #ae6841;border: 2px solid #ae6841;">去点餐</button>
                        <button v-if="num1==4" class="btn" style="color: #3a8c68;border: 2px solid #3a8c68;">去点餐</button>
                    </p>
                    <div class="bottom">
                        <p class="bottombox" style="display: flex;">
                            <van-icon name="location-o" style="margin-right: 2px;" />
                            <span class="address" style="font-size: 13px;">{{ item.address }}</span>
                        </p>
                        <span>{{ item.distance }}km</span>
                    </div>
                </li>
            </ul>
        </van-tab>
        <van-tab title="我的收藏">我的收藏</van-tab>
    </van-tabs>

   
  </div>
</template>

<script>
export default {
    name:"AroundStore",
  data() {
    return {
      active:0,
      num1:0,
      show:true,
      aroundlist:[
        {
            id:"1",
            name:"麦当劳石家庄休门街大洋百货餐厅",
            address:"桥东区中山路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家庄休门街高浮雕高浮雕大洋百货餐厅",
            address:"桥东区中山韩国和风格路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家恢复鬼画符庄休门街大洋百货餐厅",
            address:"桥东区中山路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家庄休门街大洋百货餐厅",
            address:"桥东区中山房贷首付路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家庄休门街大洋百货餐厅",
            address:"桥东区中山路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家庄休门街大洋百货餐厅",
            address:"桥东区中山路158号滨江商务大厦一部分",
            distance:"0.31"
        },
        {
            id:"1",
            name:"麦当劳石家庄休门街大洋百货餐厅",
            address:"桥东区中山路158号滨江商务大厦一部分",
            distance:"0.31"
        },]
    };
  },

  mounted() {
    this.num1=this.$route.query.num1
  },

  methods: {
    gocitylist(){
        this.$router.push("/citylist")
    },
    diancan(){
        // 出现弹窗
    }
  },
};
</script>

<style scoped>
.aroundstore{
    /* position: absolute; */
}
.searchbox{
    display: flex;
    margin-bottom: 10px;
}
.search{
    padding-left: 40px;
    width: 95%;
    border-radius: 50px;
    border: none;
    background-color: #fff;
    display: inline-block;
    height: 35px;
    font-size: 15px;
}
.searchicon{
    position: absolute;
    left: 12px;
    top: 10px;
}
.left{
    display: flex;
    align-items: center;
    margin-left: 10px;
}
.right{
    margin-left: 10px;
    width: 63%;
}
.city{
    font-size: 15px;
}
.listbox{
    padding: 10px;
}
.list{
    background: #fff;
    margin-bottom: 10px;
    width: 100%;
    border-radius: 10px;
}

.list .top .title{
    /* background: red; */
    width: 70%;
    font-size: 14px;
}
.list .top{
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 7px;
    border-bottom: 1px solid #ccc;
    padding-top: 10px;
}
.list .bottom{
    margin-left: 10px;
    margin-right: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #999;
    height: 8px;
    padding-bottom: 20px;
}
.list .bottombox{
    width: 70%;
}
.list .btn{
    background-color: #fff;
    
    border-radius: 50px;
    
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
}
>>> .van-tab--active{
    font-weight: 800;
    color: #000;
}
>>> .van-tabs__line{
    /* text-align: center; */
    width: 30px !important;
    margin-left: 8%;
}
>>> .van-tab{
    font-weight: 800;
}
>>> .van-tabs__nav{
    background-color: transparent;
}
</style>