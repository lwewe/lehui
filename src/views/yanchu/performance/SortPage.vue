<template>
  <div class="conPage">
    <div class="topPage">

      <div class="searchBox">
        <div>
          <!--      地址-->
          <City :type="1"></City>
        </div>
        <div class="searchValue">
          <van-search @input="searchProject" background="#fff0" placeholder="找演出" v-model="searchValue" />
        </div>
      </div>

      <div class="boxMax" ref="centerScroll">
        <div class="classifyNameBox" :style="'width:' + sortList.length * 60.8 + 'px;'">
          <div class="classifyNameItem" v-for="(item, index) in sortList" :key="item.id"
            @click="changeTab(item.classifyCode, index)">
            <div class="classifyName" :class="{ classifyName2: index == active }">
              {{ item.classifyName }}
            </div>
            <div class="activeIndex" v-if="index == active">
              <img class="img" src="@/assets/yanchu/class.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    筛选-->
    <div class="sort">

      <div class="comprehensive" :class="{ comprehensive2: !showAll }" @click="showAll = true">
        <div>筛选</div>
        <div class="down">
          <van-icon v-if="!showAll" size="12px" name="arrow-down" />
          <van-icon v-else size="12px" name="arrow-up" />
        </div>
      </div>
    </div>
    <!--    center-->
    <div class="centerBox">
      <!--      列表-->
      <div>
        <div v-for="item in shopList" :key="item.id">
          <NewProductList :listItem="item"></NewProductList>
        </div>
      </div>
    </div>
    <!--    综合-->
    <div class="popupBox1">
      <van-popup v-model="showSynthesis" position="top">
        <div class="popup">
          <van-radio-group v-model="synthesisId">
            <div class="synthesisItem" v-for="item in synthesisList" :key="item.id"
              @click="changeSynthesis(item.id, item.text)">
              <div :class="{ addRegion: synthesisId == item.id }">{{ item.text }}</div>
              <div>
                <van-radio checked-color="#F26C92" :name="item.id"></van-radio>
              </div>
            </div>
          </van-radio-group>
        </div>
      </van-popup>
      <van-popup v-model="showAll" position="top">
        <div class="popup popup2">
          <div class="priceTitle">价格</div>
          <div class="sortPrice">
            <div class="priceItem" :class="{ priceItem2: sortPriceId == item.id }" v-for="item in sortPrice" :key="item.id"
              @click="changeSortPrice(item.id, item.text)">
              <div>{{ item.text }}</div>
            </div>
          </div>
          <div class="buttone">
            <div class="retting" @click="retting">重置</div>
            <div class=" retting comfire" @click="comfire">确定</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import City from "@/components/Cityyanchu.vue";
import { dramaApi } from "@/api/lehuiperform";
import NewProductList from "@/components/NewProductListyanchu.vue";

export default {
  name: "SortPage",
  components: { NewProductList, City },
  data() {
    return {
      searchValue: "",
      sortList: [],
      active: 0,
      pageno: 1,
      isScroll: false,
      shopList: [],
      cateId: 0,
      //筛选
      showSynthesis: false,
      showAll: false,
      synthesisList: [
        {
          id: '1',
          text: "默认排序"
        },
        {
          id: '2',
          text: "热销排序"
        },
        {
          id: '3',
          text: "距离排序"
        },
      ],
      synthesisId: '1',
      synthesisName: "默认排序",
      sortPrice: [
        {
          id: 1,
          text: "100以内"
        },
        {
          id: 2,
          text: "100~300"
        },
        {
          id: 3,
          text: "300~500"
        },
        {
          id: 4,
          text: "500以上"
        },
      ],
      sortPriceId: 0,
      //筛选end
      timer: null,
    }
  },
  methods: {
    searchProject() {
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.getDramaProjectList()
        this.timer = undefined;
      }, 1000);
    },
    retting() {
      this.showAll = false
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      this.sortPriceId = 0
      this.getDramaProjectList()
    },
    comfire() {
      this.showAll = false
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      this.getDramaProjectList(this.sortPriceId)
    },
    changeSynthesis(id, text) {
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      this.synthesisId = id
      this.synthesisName = text
      this.showSynthesis = false
    },
    changeSortPrice(id, text) {
      this.sortPriceId = id
    },
    changeTab(classifyCode, index) {
      this.pageno = 1
      this.shopList = []
      this.isScroll = false
      this.active = index
      this.$router.replace({ path: "/performSortPage", query: { id: this.active } })
      this.cateId = classifyCode
      this.getDramaProjectList()
      if (this.$refs.centerScroll) {
        if (this.sortList.length > 10 && index >= 9) {
          this.$refs.centerScroll.scrollLeft = 40 * (index + 1)
          if (index >= 15) {
            this.$refs.centerScroll.scrollLeft = 45 * (index + 1)
          }
          return
        }
        if ((Number(this.active) + 1) > 4) {
          this.$refs.centerScroll.scrollLeft = 30 * (Number(this.active) + 1)
        } else {
          this.$refs.centerScroll.scrollLeft = 0
        }
      }
    },
    // 获取分类
    getDramaClassify() {
      this.sortList = [{ classifyCode: "", classifyName: "全部", id: 0 }]
      dramaApi("xuankua.drama.dramaClassifyList", {
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200 && Array.isArray(res.data)) {
          res.data.forEach(item => {
            this.sortList.push(item)
          })
          if (this.sortList.length > 0) {
            this.cateId = this.sortList[this.active].classifyCode
            this.getDramaProjectList()
          }
        }
      })
    },
    // 获取演出列表
    getDramaProjectList() {
      dramaApi("xuankua.drama.dramaProjectList", {
        cityCode: sessionStorage.getItem("targetId"),
        cateId: this.cateId,
        pageNo: this.pageno,
        pageSize: 10,
        projectName: this.searchValue,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          const records = (res.data && res.data.records) || []
          if (records.length == 0) {
            this.isScroll = true
            return
          }
          records.forEach(item => {
            this.shopList.push(item)
          })
          if (this.sortPriceId == 1) {
            this.shopList = this.shopList.filter(item => item.minPrice < 100)
          } else if (this.sortPriceId == 2) {
            this.shopList = this.shopList.filter(item => item.minPrice >= 100 && item.minPrice < 300)
          } else if (this.sortPriceId == 3) {
            this.shopList = this.shopList.filter(item => item.minPrice >= 300 && item.minPrice < 500)
          } else if (this.sortPriceId == 4) {
            this.shopList = this.shopList.filter(item => item.minPrice > 500)
          }
        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getDramaProjectList()
      }
    },
  },
  created() {
    this.active = this.$route.query.id
    this.getDramaClassify()
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.centerScroll) {
        if (this.sortList.length > 10 && Number(this.active) >= 9) {
          this.$refs.centerScroll.scrollLeft = 40 * (Number(this.active) + 1)
          if (Number(this.active) >= 15) {
            this.$refs.centerScroll.scrollLeft = 45 * (Number(this.active) + 1)
          }
          return
        }
        if ((Number(this.active) + 1) > 4) {
          this.$refs.centerScroll.scrollLeft = 30 * (Number(this.active) + 1)
        } else {
          this.$refs.centerScroll.scrollLeft = 0
        }
      }
    }, 300)
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

.topPage {
  background-color: white;

  .searchBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 0px 0px 20px;
    //background-color: white;
  }


  .searchValue {
    width: 80%;
  }

  .van-search {
    padding-bottom: 6px;
    padding-top: 6px;
  }

  .van-search .van-cell {
    background-color: transparent;
  }

  .van-search__content {
    background-color: #F6F6F6;
    border-radius: 30px;
  }

  /deep/ .van-field__control {
    color: #92716D;
  }
}

.centerBox {
  padding: 0px 10px 10px;
}

.classifyName {
  text-align: center;
  color: #9E9E9E;
  font-size: 14px;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.classifyName2 {
  font-weight: bold;
  color: #050505;
  font-size: 16px;
}

.activeIndex {
  width: 29px;
  margin: auto;
  margin-top: -10px;
}

.boxMax {
  width: 100%;
  overflow: scroll;
  padding: 9px 15px;
  box-sizing: border-box;
}

.classifyNameBox {
  display: flex;
  align-items: center;
  gap: 15px;

  .classifyNameItem {
    width: 100%;
  }
}

.boxMax::-webkit-scrollbar {
  display: none
}

.sort {
  display: flex;
  margin-top: 12px;
  padding: 0px 18px 0px;
  gap: 54px;

  .comprehensive {
    display: flex;
    align-items: center;
    font-size: 15px;
    gap: 3px;
    color: #CD6784;
    font-weight: bold;
  }

  .comprehensive2 {
    color: #464646
  }

  .down {
    padding-top: 3px;
    width: 12px;
  }
}

/deep/ .van-overlay {
  position: absolute;
}

/deep/ .van-popup--top {
  width: 101%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: none;
  position: absolute;
}

.popupBox1 {
  /deep/ .van-overlay {
    top: 135px;
  }

  /deep/ .van-popup--top {
    top: 135px;
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 15px;
    font-size: 13px;

    /deep/ .van-radio__icon .van-icon {
      width: 17px;
      height: 17px;
      line-height: 17px;
      font-size: 12px;
    }
  }

  .addRegion {
    color: #CD6784;
  }

  .priceTitle {
    font-size: 14px;
  }

  .popup2 {
    padding: 15px;

    .sortPrice {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .priceItem {
      background-color: #F6F6F6;
      border-radius: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      font-size: 13px;
      width: 74px;
      margin-top: 10px;
    }

    .priceItem2 {
      background-color: rgba(205, 103, 132, 0.09);
      color: #CD6784;
    }

    .buttone {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 40px;

      .retting {
        border-radius: 30px;
        width: 90px;
        height: 36px;
        border: 1px solid #CFCFCF;
        text-align: center;
        line-height: 36px;
        color: #6D6D6D;
      }

      .comfire {
        border: none;
        background-image: linear-gradient(to right, #FD82D9, #FE5F9E);
        color: white;
      }
    }
  }
}
</style>