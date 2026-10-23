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
              <div class="classTitle">{{ item.title }}</div>
            </div>
            <div class="more" @click="toMore(item.id, index)">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </div>

          <!-- 子分类列表 -->
          <div class="rightCenter">
            <div class="centerItem" v-for="(child, childIndex) in getFilteredChildren(item)" :key="child.id"
              @click="toMore2(item.id, child.id, index, childIndex)">
              <div class="imgBox">
                <img class="img" v-lazy="child.img" alt="" />
              </div>
              <div class="title">{{ child.title }}</div>
            </div>
          </div>
        </div>

        <!-- 底部加载状态 -->
        <div class="load-more" v-if="isLoadingMore">
          <van-loading size="24px" vertical>加载中...</van-loading>
        </div>
        <div class="load-more" v-else-if="!hasMore && classList.length > 0">
          <span>没有更多了</span>
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
      scrollLock: false,     // 滚动锁
      lockTimer: null,       // 解锁定时器
      rafId: null,           // 滚动优化
      
      classList: [],         // 分类数据
      selectId: null,
      loadingflag: true,     // 首屏加载遮罩
      
      // ===== 分页相关 =====
      page: 1,
      limit: 100,             // 每次只返回 10 条
      total: 0,
      isLoadingMore: false,  // 是否正在加载更多
      hasMore: true,         // 是否还有下一页
    }
  },

  methods: {
    // ========== 数据处理 ==========

    getFilteredChildren(item) {
      if (!item.children || item.children.length === 0) return [];

      const festivals = this.$store.state.festivals;
      if (festivals === 0) return item.children;

      if (festivals === 1 && item.title === "生活服务") return [];

      if (festivals === 2) {
        const keywordMap = {
          '节日': ['粮油', '零食', '饮料', '牛奶', '水果', '调冲'],
          '乳饮': ['茶', '调冲']
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

    // ========== 交互处理 ==========

    handleSelectCategory(id) {
      this.selectId = id;
      this.scrollLock = true;
      clearTimeout(this.lockTimer);
      this.lockTimer = setTimeout(() => {
        this.scrollLock = false;
      }, 600);

      this.$nextTick(() => {
        const rightBox = this.$refs.rightBox;
        const target = document.getElementById('s' + id);
        if (rightBox && target) {
          const top = target.offsetTop - rightBox.offsetTop;
          rightBox.scrollTo({ top, behavior: 'smooth' });
        }
      });
    },

    handleScroll() {
      if (this.scrollLock) return;

      // 1. 处理左侧联动高亮
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.updateActiveCategory();
          this.rafId = null;
        });
      }

      // 2. 处理触底加载更多
      const rightBox = this.$refs.rightBox;
      if (rightBox) {
        const { scrollTop, scrollHeight, clientHeight } = rightBox;
        // 距底部不足 50px 时触发
        if (scrollHeight - scrollTop - clientHeight < 50) {
          this.loadMore();
        }
      }
    },

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

    // ========== 路由跳转 ==========
    toMore(id, index1) {
      this.navigateToProductList({ id, index1 });
    },

    toMore2(id, id2, index1, index2) {
      this.navigateToProductList({ cate_id: Number(id2) });
    },

    navigateToProductList(query) {
      sessionStorage.setItem('fromClassification', 'true');
      this.$router.push({
        path: "/productList",
        query: { ...query, t: Date.now() }
      });
    },

    // ========== 数据请求 ==========

    // 获取分类列表
    async getClassify(isLoadMore = false) {
      // 如果是加载更多，且已经没有了，或者正在加载中，直接 return
      if (isLoadMore && (!this.hasMore || this.isLoadingMore)) return;

      if (isLoadMore) {
        this.isLoadingMore = true;
      }

      try {
        const res = await getClassifyList({
          page: this.page,
          limit: this.limit, // 🚨 每次只请求 20 条
          pid: 0,
          with_children: 1
        });

        if (res.code === 200 || res.code === 0) {
          const rawList = res?.data?.data || res?.data || [];
          this.total = res?.data?.total || 0;
          const newList = this.filterClassifyData(rawList);

          if (isLoadMore) {
            this.classList = this.classList.concat(newList); // 追加
          } else {
            this.classList = newList; // 首次覆盖
            if (this.classList.length > 0) {
              this.selectId = this.classList[0].id;
            }
          }

          // 判断是否还有下一页
          this.hasMore = this.classList.length < this.total;
        } else {
          this.$toast.fail(res.msg || '获取分类失败');
        }
      } catch (error) {
        console.error('获取分类失败:', error);
        this.$toast.fail('获取分类失败');
      } finally {
        this.loadingflag = false;
        this.isLoadingMore = false;
      }
    },

    // 加载更多
    loadMore() {
      if (!this.hasMore || this.isLoadingMore) return;
      this.page++;
      this.getClassify(true);
    },

    // 字段映射 + 节日过滤
    filterClassifyData(data) {
      if (!data || !Array.isArray(data)) return [];

      let list = data
        .filter(item => item.pid === 0 || item.level === 1)
        .map(item => ({
          id: item.id,
          title: item.name || '',
          children: (item.children || []).map(child => ({
            id: child.id,
            title: child.name || '',
            img: child.tbimg || child.img || 'https://image.bjyxfl.com/upload/product/default-food.png'
          }))
        }))
        .filter(item => item.children.length > 0); // 过滤空一级

      const festivals = this.$store.state.festivals;
      if (festivals === 0) return list;
      if (festivals === 1) return list.filter(item => item.title !== '生活服务');
      if (festivals === 2) {
        const keywords = ['粮油', '零食', '饮料', '牛奶', '水果', '调冲', '节日'];
        return list.filter(item => keywords.some(k => item.title.includes(k)));
      }
      return list;
    },
  },

  created() {
    this.getClassify(false);
  },

  beforeDestroy() {
    clearTimeout(this.lockTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
</script>

<style scoped lang="less">
/* 样式保持你上一份的不变，只需在底部加个 load-more 的样式 */
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

.leftBox {
  background-color: #f2f3f5;
  color: #5C5C5C;
  font-size: 13px;
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
  background: #ffffff;
  color: #e82525;
  font-weight: bold;
  border-left: 3px solid #e82525;
}

.noneselect {
  padding: 16px 3px;
  margin: auto;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

.rightBox {
  width: 75%;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  margin-top: -10px;
  background-color: #f7f8fa;

  &::-webkit-scrollbar {
    display: none;
  }
}

.rightItem {
  background-color: white;
  border-radius: 15px;
  padding: 15px 10px 25px;
  margin: 10px 10px 10px 0;
}

.rightTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #909090;
  font-size: 12px;
  cursor: pointer;
}

.classTitle {
  font-weight: bold;
  font-size: 14px;
  color: #000000;
}

.rightCenter {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 18px 0px;

  .centerItem {
    width: 33.33%;
    cursor: pointer;
  }

  .imgBox {
    width: 60px;
    height: 60px;
    margin: auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .title {
    font-size: 12px;
    text-align: center;
    color: #333333;
    padding-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 底部加载状态 */
.load-more {
  text-align: center;
  padding: 15px 0 30px;
  font-size: 12px;
  color: #999;
}
</style>