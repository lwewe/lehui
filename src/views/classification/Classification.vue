<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <div class="info">
      <!-- 左侧分类导航 -->
      <div class="leftBox" ref="leftBox">
        <div class="noneselect" :class="{ seletBox: selectId == item.id }" v-for="item in classList" :key="item.id"
          @click="handleSelectCategory(item.id)">
          {{ item.title }}
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="rightBox" @scroll="handleScroll" ref="rightBox">
        <div class="rightItem" :id="'s' + item.id" v-for="(item, index) in classList" :key="item.id">
          <!-- 分类标题 -->
          <div class="rightTop">
            <div class="flex">
              <!-- <div class="line"></div> -->
              <div class="classTitle">{{ item.title }}</div>
            </div>

          </div>

          <!-- 子分类列表 -->
          <div class="rightCenter">
            <div class="centerItem" v-for="(child, childIndex) in getFilteredChildren(item)" :key="child.id"
              @click="toMore2(item.id, child.id, index, childIndex)">
              <div class="imgBox">
                <img class="img" :src="child.img || getDefaultImage(item.type)" alt="">
              </div>
              <div class="title">{{ child.title }}</div>
            </div>

            <!-- 空状态 -->
            <van-empty v-if="!getFilteredChildren(item).length" description="暂无子分类" image-size="50" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassifyList } from "@/api/classify";

export default {
  name: "Classification",

  data() {
    return {
      scrollLock: false,     // ✅ 滚动锁
      lockTimer: null,       // ✅ 解锁定时器
      scrollTimer: null,     // ✅ 滚动节流定时器       // ✅ 新增
      classList: [],
      selectId: null,
      loadingflag: true,

    }
  },

  methods: {
    // ========== 数据处理 ==========

    // 获取过滤后的子分类（根据节日模式）
    getFilteredChildren(item) {
      if (!item.children || item.children.length === 0) return [];

      const festivals = this.$store.state.festivals;

      // 非节日模式，直接返回
      if (festivals === 0) return item.children;

      // 节日模式1：过滤生活服务
      if (festivals === 1 && item.title === "生活服务") return [];

      // 节日模式2：特殊过滤规则
      if (festivals === 2) {
        const keywordMap = {
          '节日': ['粮油', '零食', '饮料', '牛奶', '水果', '调冲'],
          '乳饮': ['茶', '冲调'] // 排除项
        };

        if (item.title.includes('节日')) {
          return item.children.filter(child =>
            keywordMap['节日'].some(keyword => child.title.includes(keyword))
          );
        }

        if (item.title.includes('乳饮')) {
          return item.children.filter(child =>
            !keywordMap['乳饮'].some(keyword => child.title.includes(keyword))
          );
        }
      }

      return item.children;
    },

    // 获取默认图片
    getDefaultImage(type) {
      const images = {
        1: 'https://image.bjyxfl.com/upload/product/default-food.png',
        2: 'https://image.bjyxfl.com/upload/product/default-fruit.png',
        3: 'https://image.bjyxfl.com/upload/product/default-service.png'
      };
      return images[type] || images[1];
    },

    // ========== 交互处理 ==========

    // 选择左侧分类
    handleSelectCategory(id) {
      this.selectId = id;

      // ✅ 上锁，防止滚动监听覆盖 selectId
      this.scrollLock = true;
      clearTimeout(this.lockTimer);
      this.lockTimer = setTimeout(() => {
        this.scrollLock = false;
      }, 600);

      // ✅ 只滚右侧容器，不带动页面
      this.$nextTick(() => {
        const rightBox = this.$refs.rightBox;
        const target = document.getElementById('s' + id);
        if (rightBox && target) {
          const top = target.offsetTop - rightBox.offsetTop;
          rightBox.scrollTo({ top, behavior: 'smooth' });
        }
      });
    },

    // 右侧滚动监听
    handleScroll() {
      if (this.scrollLock) return;   // ✅ 锁住期间忽略

      if (this.scrollTimer) return;
      this.scrollTimer = setTimeout(() => {
        this.scrollTimer = null;
        this.updateActiveCategory();
      }, 100);
    },

    // 更新激活的分类
    updateActiveCategory() {
      const rightBox = this.$refs.rightBox;
      if (!rightBox) return;

      const rightItems = rightBox.querySelectorAll('.rightItem');
      const rightBoxTop = rightBox.getBoundingClientRect().top;

      let activeId = null;
      for (let i = 0; i < rightItems.length; i++) {
        const rect = rightItems[i].getBoundingClientRect();
        if (rect.top - rightBoxTop <= 10) {
          activeId = this.classList[i].id;
        } else {
          break;
        }
      }

      if (!activeId && rightItems.length) {
        activeId = this.classList[0].id;
      }

      if (activeId && this.selectId !== activeId) {
        this.selectId = activeId;
        this.scrollLeftToActive(activeId);
      }
    },

    // 左侧导航滚动到激活项
    scrollLeftToActive(id) {
      const index = this.classList.findIndex(item => item.id === id);
      if (index < 0) return;
      const leftBox = this.$refs.leftBox;
      if (!leftBox) return;

      if (index > 8) {
        leftBox.scrollTop = (index + 1) * 31;
      } else {
        leftBox.scrollTop = 0;
      }
    },

    // 锚点跳转
    changeHash(idname) {
      const element = document.querySelector(idname);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },

    // ========== 路由跳转 ==========

    // 跳转到更多商品
    toMore(id, index1) {
      this.navigateToProductList({ id, index1 });
    },

    // 跳转到子分类商品
    toMore2(id, id2, index1, index2) {
      console.log('大分类id:', id, '子分类id:', id2)

      this.navigateToProductList({ cate_id: Number(id2) });
    },

    // 统一跳转方法
    navigateToProductList(query) {
      sessionStorage.setItem('fromClassification', 'true');
      this.$router.push({
        path: "/productList",
        query: {
          ...query,
          t: Date.now() // 添加时间戳，确保路由变化
        }
      });
    },

    // ========== 数据请求 ==========

    // 获取分类列表
    async getClassify() {
      try {
        const res = await getClassifyList({ platform: 1 });

        if (res.code === 200) {
          this.classList = this.filterClassifyData(res.data);

          // 设置默认选中第一个分类
          if (this.classList.length > 0) {
            this.selectId = this.classList[0].id;
          }
        }
      } catch (error) {
        console.error('获取分类失败:', error);
        this.$toast.fail('获取分类失败');
      } finally {
        this.loadingflag = false;
      }
    },

    // 过滤分类数据（根据节日模式）
    filterClassifyData(data) {
      if (!data || !Array.isArray(data)) return [];

      const festivals = this.$store.state.festivals;

      if (festivals === 0) return data;

      if (festivals === 1) {
        // 节日模式1：过滤生活服务
        return data.filter(item => item.title !== "生活服务");
      }

      if (festivals === 2) {
        // 节日模式2：只显示特定分类
        const keywords = ['粮油', '零食', '饮料', '牛奶', '水果', '调冲', '节日'];
        return data.filter(item =>
          keywords.some(keyword => item.title.includes(keyword))
        );
      }

      return data;
    }
  },

  created() {
    this.getClassify();
  },

  beforeDestroy() {
    // 清理定时器
    clearTimeout(this.scrollTimer);
    clearTimeout(this.lockTimer);
  }
}
</script>

<style scoped lang="less">
.location {
  background-color: #ffffff;
  height: calc(100vh - 50px);
  padding: 10px 0px 0px 0px;
  box-sizing: border-box;
}

.flex {
  display: flex;
  align-items: center;
  gap: 5px;
}

.info {
  display: flex;
  height: 100%;
}

// ========== 左侧导航 ==========
.leftBox {
  background-color: #f2f3f5;
  color: #5C5C5C;
  font-size: 12px;

  margin-top: -22px;
  text-align: center;
  width: 25%;
  padding: 11px 0px 10px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.seletBox {
  background: url(../../assets/lh/bbg.png) no-repeat;
  background-size: cover;
  color: #e82525;
  font-weight: bold;

}

.noneselect {
  padding: 16px 3px;
  // width: 90%;
  margin: auto;

  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

// ========== 右侧内容 ==========
.rightBox {
  width: 75%;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  margin-top: -10px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.rightItem {
  background-color: white;
  border-radius: 15px;
  padding: 15px 10px 25px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.rightTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more {
  display: flex;
  gap: 3px;
  color: #909090;
  font-size: 12px;
  padding-top: 2px;
  cursor: pointer;
}

.icon {
  padding-top: 3px;
}

.line {
  padding: 8px 1px;
  background-color: #DF1B21;
  width: 5px;
  border-radius: 30px;
}

.classTitle {
  font-weight: bold;
  font-size: 13px;
  color: #000000;
}

// ========== 子分类网格 ==========
.rightCenter {
  display: flex;
  flex-wrap: wrap;
  margin-top: 25px;
  gap: 18px 0px;

  .centerItem {
    width: 33%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }

  .imgBox {
    width: 52px;
    height: 52px;
    margin: auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: #f5f5f5;

    .img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .title {
    font-size: 12px;
    text-align: center;
    color: #666666;
    padding-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// ========== 空状态优化 ==========
/deep/ .van-empty {
  width: 100%;
  padding: 20px 0;
}
</style>