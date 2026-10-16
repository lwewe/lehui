<template>
  <div class="conPage">
    <div>
      <img class="img" src="@/assets/yanchu/banner3.png" alt="">
    </div>
    <div class="calendar">
      <div class="dateList">
        <div class="dateItem" @click="changeDate(item.dateTime)" :class="{ dateItem2: dateId == item.dateTime }"
          v-for="item in dateList" :key="item.date">
          <div class="week">{{ item.week }}</div>
          <div class="date">{{ item.date }}</div>
        </div>
      </div>
      <div @click="openRange">
        <div class="calIcon">
          <img class="img" src="@/assets/yanchu/rl.png" alt="">
        </div>
        <div class="calText"> 日历</div>
        <div class="down">
          <van-icon name="arrow-down" />
        </div>
      </div>
    </div>
    <div class="centerBox">
      <!--      列表-->
      <div>
        <div v-for="(item, index) in shopList" :key="item.id">
          <NewProductList :listItem="item" :index="index" :board="2"></NewProductList>
        </div>
      </div>
    </div>
    <!--    日期-->
    <div>

      <calendar :defaultDate="defaultDate" :isCricle="false" comeOutColor="#FFF5F6" themeColor="#D6465E"
        :show="showRange" type="range" @confirm="backRangeCalendar" @cancel="showRange = false"></calendar>
    </div>
  </div>
</template>

<script>
import { dramaApi } from "@/api/lehuiperform";
import NewProductList from "@/components/NewProductListyanchu.vue";
import moment from "moment";
import 'moment/locale/zh-cn';
import calendar from 'vue-simple-mobile-calendar';

export default {
  name: "PerformanceCalendar",
  components: { NewProductList, calendar },
  data() {
    return {
      pageno: 1,
      isScroll: false,
      shopList: [],
      showRange: false,
      dateList: [],
      dateId: "",
      defaultDate: [],
      selectTime: [
        {
          id: 1,
          text: '全部时间'
        },
        {
          id: 2,
          text: '一周内'
        },
        {
          id: 3,
          text: '一月内'
        },
        {
          id: 4,
          text: '本周末'
        },
      ],
      selectId: 1,
      isShow: false
    }
  },
  methods: {
    openRange() {
      this.showRange = true
      setTimeout(() => {
        this.isShow = true
      }, 450)
    },
    changeSelectId(id) {
      this.selectId = id
      let today = moment(new Date()).add(1, "days").format("yyyy/MM/DD")
      let seven = moment(new Date()).add(7, "days").format("yyyy/MM/DD")
      if (id == 2) {
        this.defaultDate = [today, seven]
        // console.log(this.defaultDate)
        this.showRange = false
        // this.showRange = true
      }
    },
    changeDate(date) {
      this.shopList = []
      this.pageno = 1
      this.isScroll = false
      this.dateId = date
      this.getDramaProjectList('', '', date)
    },
    // 日期区间
    backRangeCalendar(item) {
      this.shopList = []
      this.pageno = 1
      this.isScroll = false
      // console.log(item)
      this.dateId = ""
      this.defaultDate = [item.startTime, item.endTime]
      this.showRange = false
      this.getDramaProjectList(item.startTime, item.endTime)
    },
    // 获取演出列表
    getDramaProjectList(startTime, endTime, date = this.dateId) {
      dramaApi("xuankua.drama.dramaProjectList", {
        cityCode: sessionStorage.getItem("targetId"),
        pageNo: this.pageno,
        pageSize: 10,
        ...this.$store.state.parameter
      }).then(res => {
        if (res.code == 200) {
          const records = (res.data && res.data.records) || []
          if (records.length == 0) {
            this.isScroll = true
            return
          }
          records.forEach(item => this.shopList.push(item))
          if (date) {
            const datetimestamp = +Number(new Date(date))
            this.shopList = this.shopList.filter(item => {
              let start = +Number(new Date(item.showStartTime.split(" ")[0]))
              return start == datetimestamp
            })
          }
          if (startTime, endTime) {
            const startTimetimestamp = +Number(new Date(startTime))
            const endTimetimestamp = +Number(new Date(endTime))
            this.shopList = this.shopList.filter(item => {
              let start = +Number(new Date(item.showStartTime.split(" ")[0]))
              return start >= startTimetimestamp && start <= endTimetimestamp
            })
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
    // 周几
    getdataTime(date) {
      let wk = new Date(date).getDay()
      // console.log(wk)
      let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let week = weeks[wk]
      return week
    },
    getDateList() {
      let dateList = []
      for (var i = 0; i <= 4; i++) {
        dateList.push(moment(new Date()).add(i, "days").format("yyyy-MM-DD"))
      }
      dateList.forEach(item => {
        this.dateList.push({
          date: item.split("-").slice(1).join("."),
          dateTime: item,
          week: this.getdataTime(item)
        })
      })
      // console.log(this.dateList, "11111")
      if (this.dateList.length > 0) {
        this.dateId = this.dateList[0].dateTime
        this.getDramaProjectList('', '', this.dateId)
      }
    }
  },
  created() {
    this.getDateList()
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
  min-height: 100vh;
  background-color: #F0F0F0;
}

.calendar {
  position: relative;
  z-index: 9;
  margin-top: -22px;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  background-color: white;
  padding: 10px 20px 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .dateList {
    display: flex;
    align-items: center;
    background-image: linear-gradient(to right, #FFF5F6, #FFF5F6, rgba(255, 249, 249, 0.66));
    width: 100%;
    border-radius: 8px;
    justify-content: space-between;
    padding-right: 20px;
    overflow: hidden;

    .date {
      font-size: 14px;
      text-align: center;
      margin-top: 5px;
    }

    .week {
      font-size: 10px;
      text-align: center;
      color: #ACA5A5;
    }

    .dateItem {
      padding: 10px;
      width: 60px;
    }

    .dateItem2 {
      background-color: #FFDEE1;
      border-radius: 8px;
    }
  }

  .calIcon {
    width: 24px;
    margin: auto;
  }

  .calText {
    text-align: center;
    font-size: 12px;
    color: #474646;
  }

  .down {
    text-align: center;
    font-size: 12px;
  }
}

.centerBox {
  padding: 0px 10px 15px;
}

/deep/ .calendar-btn {
  background-color: transparent;
}

/deep/ .calendar-btn .confirm-btn {
  background-color: transparent !important;
  background-image: linear-gradient(to right, #FD82D9, #FE5E9C) !important;
}

/deep/ .calendar-item .calendar-background {
  display: none;
}

/deep/ .calendar-item .calendar-checked {
  color: #D64860 !important;
  background-color: #FFDDE0;
  height: 100%;
  line-height: revert !important;
}

/deep/ .calendar-num .calendar-date {
  overflow: hidden;
  background-color: transparent !important;
}

/deep/ .calendar-item .calendar-checked span {
  color: #D64860 !important;
}

/deep/ .calendar-item .calendar-checked span {
  color: #D64860 !important;
}

/deep/ .calendar-item .calendar-checked .check-text {
  display: none;
}

.selectTime {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  top: 20%;
  z-index: 999999;
  background-color: white;
  width: 100%;
  height: 54px;
  padding: 0px 22px;
  box-sizing: border-box;
  justify-content: space-around;
  gap: 15px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding-top: 8px;

  .selectTimeItem {
    background-color: #F6F6F6;
    border-radius: 30px;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    padding: 0px 5px;
  }

  .selectTimeItem2 {
    background-color: #FDE9EB;
    color: #D23853;
  }
}
</style>