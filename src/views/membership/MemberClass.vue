<template>
  <div class="memberindex">
    <!-- <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack> -->
    <NProgress v-if="loadingflag" />
    <!-- <div class="topIndex">

    </div> -->
    <div class="memberBox" style="padding-top: 10px;">
      <!-- {{ applist }} -->
      <!--        会员列表-->
      <div class="category-container">
        <div class="category-list" ref="categoryList">
          <div v-for="(item, index) in applist" :key="item.id" class="category-item"
            :class="{ active: activeCategoryId === item.id }" @click="handleCategoryClick(item.id, index)">
            {{ item.title }}
            <span></span>
          </div>
        </div>
      </div>

      <!-- <MemberList :applist="applist" :change="2" @changeSelectId="changeSelectId"></MemberList> -->
    </div>
    <!--    列表-->
    <div v-if="flgs">
      <div class="noneTxt">
        暂无数据
      </div>
    </div>
    <div>
      <List :Kaquanlist="qitalist"></List>

    </div>
  </div>
</template>

<script>
import List from "@/components/List.vue";
import { getKaquan, getKaquanlist, getclassify } from "@/api/member";
import MemberList from "@/components/MemberList.vue";

export default {
  components: { MemberList, List },
  data() {
    return {
      activeCategoryId: null,  // 新增：当前激活的分类ID
      banner: [],
      flgs: false,
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
    // 处理分类点击
    handleCategoryClick(id, index) {
      console.log(id)
      console.log(index)
      // 设置当前激活的分类
      this.activeCategoryId = id;

      // 调用原有的方法加载数据
      this.changeSelectId(id);

      // 如果点击的是后面的项目，滚动到可见区域
      if (index > 4) {
        setTimeout(() => {
          const listElement = this.$refs.categoryList;
          if (listElement) {
            listElement.scrollLeft = 80 * (index - 2);
          }
        }, 100);
      }


    },
    changeSelectId(id) {
      this.qitalist = []
      this.golist(id)
    },
    golist(fid) {
      getclassify({
        fid,
        pageno: this.pageno,
        pagesize: this.pagesize
      }).then(res => {
        this.loadingflag = false
        // console.log(res.data);
        this.qitalist = res.data || [];

        if (res.data == '') {
          this.flgs = true;
        } else {
          this.flgs = false;
        }

         // 确保滚动执行，无论数据是否为空
    this.$nextTick(() => {
      this.scrollToActiveTab();
    });
      })
    },
    scrollToActiveTab() {
      if (!this.activeCategoryId || !this.$refs.categoryList) {
        
        return;
      }

      // 找到激活的tab索引
      const index = this.applist.findIndex(item => item.id == this.activeCategoryId);
      if (index === -1) {
        console.log('找不到对应的tab');
        return;
      }

      console.log('滚动到索引:', index);
      const listElement = this.$refs.categoryList;

      // 使用更可靠的滚动方法
      setTimeout(() => {
        // 方法1：使用scrollIntoView（最简单）
        const activeElement = listElement.querySelector('.category-item.active');
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }

        // 方法2：或者使用scrollLeft计算
        // const itemWidth = 100; // 每个tab的预估宽度
        // listElement.scrollLeft = itemWidth * Math.max(0, index - 1);
      }, 100);
    },
    getKaquanList() {
      getKaquan({}).then(res => {
        this.applist = res.data.classify;
        // 设置默认选中项
        if (this.applist.length > 0) {

          const routeId = this.$route.query.id;
          if (routeId) {
            this.activeCategoryId = routeId;
          } else {
            this.activeCategoryId = this.applist[0].id;
          }
          this.golist(this.activeCategoryId);

          // 关键：延迟执行滚动
          this.$nextTick(() => {
            this.scrollToActiveTab();
          });


        }

      })
    },
    gomusicmember() {
      this.$router.push({ path: "/musicmember" })
    },
    goreadmember() {
      this.$router.push({ path: "/readmember" })
    }
  },
  created() {
    this.getKaquanList()
    // this.golist(this.$route.query.id)


    const routeId = this.$route.query.id;


    this.activeCategoryId = parseInt(routeId);



  },

};
</script>
<style scoped lang="less">
.category-container {
  width: 100%;

  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.category-list {
  display: flex;
  color: #ffffff;
  white-space: nowrap;
  /* 防止换行 */
  min-width: min-content;
  /* 确保内容不被压缩 */
}

.category-item {
  padding-right: 16px;
  margin-right: 10px;

  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  /* 防止项目被压缩 */

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    span {
      position: absolute;
      bottom: -10px;
      left: 20%;
      background: linear-gradient(to right, #dd3f6a, #dc495c);
      width: 30px;
      height: 6px;
      border-radius: 60px;
    }

    // background-color: rgba(255, 255, 255, 0.3);
  }

  &.active {

    color: #ffffff;
    font-weight: bold;

    span {
      position: absolute;
      bottom: -10px;
      left: 20%;
      background: linear-gradient(to right, #dd3f6a, #dc495c);
      width: 30px;
      height: 6px;
      border-radius: 60px;
    }
  }
}

.memberindex {
  background-color: #180044;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.topIndex {
  padding: 49px 10px 0px;
}

.memberBox {
  // background-color: white;
  padding: 3px 0px 3px 12px;
}

.noneTxt {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  padding-top: 100px;
}
</style>