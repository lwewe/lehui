<template>
  <div class="location">
    <div class="topBox">
      <div class="pTop" :style="{ justifyContent: $store.state.festivals == 2 ? 'flex-start' : '' }">
        <div class="icon" @click="returnBack">
          <van-icon size="23px" name="arrow-left" />
        </div>
        <div class="searchValue" v-if="$store.state.festivals != 2">
          <van-search background="#fff0" placeholder="搜索你喜欢的东西" @input="search" v-model="searchValue" />
        </div>
      </div>
    </div>


    <!-- 大分类（横向滚动） -->
    <div class="top-category-bar" v-if="topCategories.length > 0">
      <div class="category-scroll" ref="topCategoryScroll">
        <div class="cat-item" :class="{ active: activeTopId === 0 && activeSubId === 0 }" @click="changeTopCategory(0)">
          全部
        </div>
        <div class="cat-item" v-for="cat in topCategories" :key="cat.id" :class="{ active: activeTopId === cat.id }"
          @click="changeTopCategory(cat.id)">
          {{ cat.title }}
        </div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="centerBox">
      <div class="sort">
        <div class="comprehensive" @click="showSynthesis = !showSynthesis">
          <div>{{ currentSortText }}</div>
          <div class="down">
            <van-icon v-if="!showSynthesis" size="12px" name="arrow-down" />
            <van-icon v-else size="12px" name="arrow-up" />
          </div>
        </div>
        <div class="comprehensive" :style="{ color: priceActive ? '#CA4041' : '#464646' }" @click="changePrice">
          <div>价格</div>
          <div class="down">
            <img class="img" src="../../assets/tubiao/px.png" alt="">
          </div>
        </div>
        <div class="comprehensive" style="color: #464646" @click="showAll = true">
          <div>筛选</div>
          <div class="down">
            <img class="img" src="../../assets/tubiao/sx.png" alt="">
          </div>
        </div>
      </div>
      <!-- ✅ 小分类（横向滚动） -->
      <div class="sub-category-bar" v-if="subCategories.length > 0">
        <div class="sub-scroll">
          <div class="sub-item" :class="{ active: activeSubId === 0 }" @click="changeSubCategory(0)">
            全部
          </div>
          <div class="sub-item" v-for="sub in subCategories" :key="sub.id" :class="{ active: activeSubId === sub.id }"
            @click="changeSubCategory(sub.id)">
            {{ sub.title }}
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="listBox" @scroll="handleScroll" ref="listBox">
        <NewShopList :flag="flag" :shopList="shopList" v-show="shopList.length > 0"></NewShopList>

        <!-- 空状态 -->
        <div v-if="!isFetching && shopList.length === 0" class="empty-state">
          <img src="../../assets/empty.png" alt="暂无商品" v-if="false" />
          <div class="empty-icon"><img src="../../assets/lh/nop.png" style="width: 150px;padding-top: 200px;" alt="">
          </div>
          <p style="font-size: 14px;color: #666666;">暂无商品</p>
        </div>
        <!-- 加载中 -->
        <div v-if="isFetching" class="loading-more">
          <van-loading size="20px">加载中...</van-loading>
        </div>

        <!-- 没有更多 -->
        <div v-if="isScroll && shopList.length > 0" class="no-more">
          已经到底了~
        </div>
      </div>
    </div>

    <!-- 全部筛选弹窗 -->
    <div class="popupBox" v-if="showAll">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll = false">
            <van-icon size="18px" name="cross" />
          </div>
          <div class="title">全部筛选</div>

          <!-- 价格筛选 -->
          <div class="listItem">
            <div class="titleItem">价格筛选</div>
            <div class="priceBox">
              <div class="inpBox">
                <input class="inp" type="number" v-model="bottomPrice" placeholder="最低价">
              </div>
              <div>-</div>
              <div class="inpBox">
                <input class="inp" type="number" v-model="highestPrice" placeholder="最高价">
              </div>
            </div>
          </div>

          <!-- 平台筛选 -->
          <div class="listItem">
            <div class="titleItem">平台</div>
            <div class="brandBox">
              <div class="sortText" v-for="item in platformList" :key="item.id"
                :class="{ sortText1: platform == item.id }" @click="changePlatform(item.id)">
                {{ item.name }}
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="footer">
            <div class="resetting" @click="resetting">重置</div>
            <div class="resetting complete" @click="complete">完成</div>
          </div>
        </div>
      </van-popup>
    </div>

    <!-- 综合排序弹窗 -->
    <div class="popupBox1">
      <van-popup v-model="showSynthesis" position="top">
        <div class="popup">
          <div class="synthesisItem" v-for="item in synthesisList" :key="item.id" @click="changeSynthesis(item.id)">
            <div :class="{ addRegion: synthesisId == item.id }">{{ item.text }}</div>
            <div v-if="synthesisId == item.id">
              <van-icon color="#ED3137" name="success" size="16px" />
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NewShopList from "@/components/NewShopList.vue";
import { searchProduct, productList, categoryList } from "@/api/lhjdtm";

export default {
  name: "ProductList",
  components: { NewShopList },
  data() {
    return {

      // ✅ 新增：分类
      categoryList: [],       // 完整树
      topCategories: [],      // 大分类（一级）
      subCategories: [],      // 小分类（当前大分类的 children）
      activeTopId: 0,         // 当前大分类 id（0=全部）
      activeSubId: 0,         // 当前小分类 id（0=全部）
      cate_id: '',
      searchValue: "",
      bottomPrice: "",
      highestPrice: "",
      showAll: false,
      showSynthesis: false,
      platform: 0, jd_type: '',     // 新增
      platformList: [
        { id: 0, name: '全部' },
        { id: 1, name: '京东' },
        { id: 2, name: '天猫' },
        // { id: 3, name: '京造' },   // 预留无数据勿用
        { id: 4, name: '盒马' },
        { id: 5, name: '鲜花' },
        { id: 6, name: '途虎养车' },
        { id: 7, name: '供应商' },
      ],
      synthesisList: [
        { id: 1, text: "综合推荐" },
        { id: 2, text: "销量由高到低" },
        { id: 3, text: "新品优先" },
        { id: 4, text: "价格从低到高" },
        { id: 5, text: "价格从高到低" },
      ],
      synthesisId: 1, activeTopObj: null,   // 新增
      // 商品
      pageno: 1,
      shopList: [],
      flag: 1,
      // 控制变量
      isScroll: false,
      isFetching: false,
      cancelTokenSource: null,
      timer: null,
      total: 0,
    }
  },
  computed: {
    currentSortText() {
      const item = this.synthesisList.find(i => i.id === this.synthesisId);
      return item ? item.text : '综合';
    },
    priceActive() {
      return this.synthesisId === 4 || this.synthesisId === 5;
    }
  },
  methods: {
    scrollToActiveTop(retry = 0) {
      this.$nextTick(() => {
        const container = this.$refs.topCategoryScroll;   // 必须在回调里
        if (!container) {
          if (retry < 20) {
            setTimeout(() => this.scrollToActiveTop(retry + 1), 30);
          }
          return;
        }

        const activeEl = container.querySelector('.cat-item.active');
        if (!activeEl) {
          if (retry < 20) {
            setTimeout(() => this.scrollToActiveTop(retry + 1), 30);
          }
          return;
        }

        const containerWidth = container.offsetWidth;
        const elLeft = activeEl.offsetLeft;
        const elWidth = activeEl.offsetWidth;

        container.scrollTo({
          left: elLeft - containerWidth / 2 + elWidth / 2,
          behavior: 'smooth'
        });
      });
    },
    // 获取分类树
    async fetchCategory() {
      try {
        const params = { platform: this.platform }
        if (this.jd_type !== '' && this.jd_type !== null) {
          params.jd_type = this.jd_type
        }
        const res = await categoryList(params)
        if (res.code == 200) {
          this.categoryList = res.data || []
          this.topCategories = this.categoryList.filter(c => c.pid === 0).map(c => ({ id: c.id, title: c.title }))

          if (this.searchValue && this.searchValue.trim()) {
            this.activeTopId = 0
            this.activeSubId = 0
          } else if (this.cate_id) {
            this.locateCategoryById(this.cate_id)
          } else {
            this.activeTopId = 0
            this.activeSubId = 0
          }
          this.updateSubCategories()
          // 不在这里调 scrollToActiveTop
        }
      } catch (err) {
        console.error('获取分类失败:', err)
      }
    },

    // ✅ 新增：根据 cate_id 反查大/小分类
    locateCategoryById(cateId) {
      const id = Number(cateId)

      if (!id) {
        this.activeTopId = 0
        this.activeTopObj = null
        this.activeSubId = 0
        return
      }

      // 递归查找，返回 { item, top, parentId }
      const findInTree = (list, topObj = null, parentId = null) => {
        for (const item of list) {
          const currentTop = item.pid === 0 ? item : topObj;
          if (item.id === id) {
            return { item, top: currentTop, parentId };
          }
          if (item.children && item.children.length > 0) {
            const found = findInTree(item.children, currentTop, item.id);
            if (found) return found;
          }
        }
        return null;
      };

      const found = findInTree(this.categoryList);
      if (found) {
        this.activeTopId = found.top.id;
        this.activeTopObj = found.top;   // 直接存 top 对象

        if (found.item.pid === 0) {
          this.activeSubId = 0;
        } else if (found.parentId && found.parentId !== found.top.id) {
          this.activeSubId = found.parentId;
        } else {
          this.activeSubId = found.item.id;
        }
      } else if (this.topCategories.length > 0) {
        this.activeTopId = this.topCategories[0].id;
        this.activeTopObj = this.topCategories[0];
      }
    },

    // 根据当前大分类更新小分类
    updateSubCategories() {
      if (!this.activeTopObj) {
        this.subCategories = []
        return
      }
      this.subCategories = (this.activeTopObj.children || []).map(c => ({
        id: c.id,
        title: c.title
      }))
    },

    // 点击大分类
    changeTopCategory(id) {
      if (this.activeTopId === id) return
      this.activeTopId = id
      this.activeTopObj = id === 0 ? null : this.categoryList.find(c => c.id === id)   // 加上
      this.activeSubId = 0
      this.updateSubCategories()
      this.cate_id = id === 0 ? '' : id
      this.fetchData(true)
      this.scrollToActiveTop()
    },

    // 点击小分类
    changeSubCategory(id) {
      if (this.activeSubId === id) return
      this.activeSubId = id
      // 小分类切换后按小分类 id 请求
      this.cate_id = id === 0 ? this.activeTopId : id
      this.fetchData(true)
    },
    returnBack() {
      this.$router.go(-1);
    },

    // 统一请求入口
    fetchData(isReset = true) {
      if (this.isFetching) return;

      if (isReset) {
        this.shopList = [];
        this.pageno = 1;
        this.isScroll = false;
      }

      // 取消上一次请求
      if (this.cancelTokenSource) {
        this.cancelTokenSource.cancel("取消重复请求");
        this.cancelTokenSource = null;
      }

      this.cancelTokenSource = axios.CancelToken.source();
      this.isFetching = true;

      // 判断使用哪个接口
      const hasKeyword = this.searchValue && this.searchValue.trim();
      const apiMethod = hasKeyword ? searchProduct : productList;

      // 构建请求参数
      let params = {};

      if (hasKeyword) {
        params = {
          keyword: this.searchValue.trim(),
          page: this.pageno,
          limit: 10,
        };
        if (this.platform !== 0) {
          params.platform = this.platform;
        }
        if (this.jd_type !== '' && this.jd_type !== null) {
          params.jd_type = this.jd_type;
        }
      } else {
        params = {
          page: this.pageno,
          limit: 10,
          sort: this.getSortType(),
          order: this.getSortOrder(),
        };

        const finalCateId = this.cate_id || this.activeSubId || this.activeTopId;
        if (finalCateId) {
          params.cate_id = finalCateId;
        }
        if (this.platform !== 0) {
          params.platform = this.platform;
        }
        if (this.jd_type !== '' && this.jd_type !== null) {
          params.jd_type = this.jd_type;
        }
        if (this.bottomPrice) {
          params.min_price = this.bottomPrice;
        }
        if (this.highestPrice) {
          params.max_price = this.highestPrice;
        }
      }

      console.log('请求参数:', params, '使用接口:', hasKeyword ? 'searchProduct' : 'productList');

      // 执行请求
      apiMethod(params).then(res => {
        this.isFetching = false;

        console.log('=== 接口返回 ===');
        console.log('完整 res:', res);
        console.log('res.code:', res.code);
        console.log('res.data:', res.data);
        console.log('res.data.data:', res.data && res.data.data);

        if (res.code == 200) {
          const data = res.data || {};
          const list = data.data || [];
          this.total = data.total || 0;

          console.log('获取到商品数量:', list.length);

          // 处理空数据
          if (!list || list.length === 0) {
            if (isReset) {
              this.shopList = [];
            }
            this.isScroll = true;
            return;
          }

          // 正常数据处理
          if (isReset) {
            this.shopList = list;
          } else {
            // 去重
            const existingIds = new Set(this.shopList.map(item => item.id));
            list.forEach(item => {
              if (!existingIds.has(item.id)) {
                this.shopList.push(item);
              }
            });
          }

          console.log('当前商品列表:', this.shopList);

          // 判断是否还有更多
          if (this.shopList.length >= this.total || list.length < 10) {
            this.isScroll = true;
          }
        }
      }).catch(err => {
        this.isFetching = false;
        if (axios.isCancel(err)) return;
        console.error('请求失败:', err);
      });
    },

    // 获取排序类型
    getSortType() {
      switch (this.synthesisId) {
        case 1: return 'px';      // 综合
        case 2: return 'sales';   // 销量
        case 3: return 'new';     // 新品
        case 4: return 'price';   // 价格从低到高
        case 5: return 'price';   // 价格从高到低
        default: return 'px';
      }
    },

    // 获取排序方向
    getSortOrder() {
      switch (this.synthesisId) {
        case 2: return 'desc';    // 销量从高到低
        case 4: return 'asc';     // 价格从低到高
        case 5: return 'desc';    // 价格从高到低
        default: return 'desc';
      }
    },

    // 切换排序
    changeSynthesis(id) {
      if (this.synthesisId === id) return;
      this.synthesisId = id;
      this.showSynthesis = false;
      this.fetchData(true);
    },

    // 切换价格排序
    changePrice() {
      if (this.synthesisId == 4) {
        this.synthesisId = 5;  // 价格从高到低
      } else {
        this.synthesisId = 4;  // 价格从低到高
      }
      this.fetchData(true);
    },

    // 切换平台
    changePlatform(id) {
      this.platform = id;
      this.activeTopId = 0;
      this.activeTopObj = null;   // 加上
      this.activeSubId = 0;
      this.cate_id = '';
      this.fetchCategory();
      this.fetchData(true);
    },

    // 搜索
    search() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fetchData(true);
        this.timer = null;
      }, 600);
    },

    // 完成筛选
    complete() {
      this.fetchData(true);
      this.showAll = false;
    },

    // 重置筛选
    resetting() {
      this.platform = 0;
      this.bottomPrice = '';
      this.highestPrice = '';
      this.fetchData(true);
    },

    // 滚动加载
    handleScroll(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        this.onLoadMore();
      }
    },

    onLoadMore() {
      if (this.isFetching || this.isScroll) return;
      this.pageno++;
      this.fetchData(false);
    },
  },
  async created() {
    // keyword
    const kw = this.$route.query.keyword || '';
    this.searchValue = kw;

    // cate_id
    const cateId = this.$route.query.cate_id || this.$route.query.id || '';
    this.cate_id = cateId ? Number(cateId) : '';

    // platform
    const platform = this.$route.query.platform || '';
    if (platform !== '') {
      this.platform = Number(platform);
    }

    // jd_type
    const jdType = this.$route.query.jd_type || '';
    if (jdType !== '') {
      this.jd_type = Number(jdType);
    }

    await this.fetchCategory();
    this.fetchData(true);

    // 分类树拿到后，DOM 更新完，滚一次
    this.$nextTick(() => {
      this.scrollToActiveTop();
    });
  },

  watch: {
    '$route.query': {
      handler(newQuery, oldQuery) {
        const kw = newQuery.keyword || '';
        this.searchValue = kw;   // 有就赋值，没有就清空

        const raw = newQuery.cate_id || newQuery.id || '';
        const newId = raw ? Number(raw) : '';

        // platform
        const platform = newQuery.platform || '';
        if (platform !== '') {
          this.platform = Number(platform);
        }

        // jd_type
        const jdType = newQuery.jd_type || '';
        if (jdType !== '') {
          this.jd_type = Number(jdType);
        }

        // cate_id 相同、没有 keyword 时，不重复请求
        if (
          newId === this.cate_id &&
          oldQuery !== undefined &&
          !kw &&
          newQuery.cate_id === oldQuery.cate_id
        ) {
          return;
        }

        this.cate_id = newId;

        if (kw && !newId) {
          this.activeTopId = 0;
          this.activeSubId = 0;
          this.updateSubCategories();
        } else {
          this.locateCategoryById(newId);
        }

        this.fetchData(true);
        this.$nextTick(() => {
          this.scrollToActiveTop();
        });
      }
    }
  },
  activated() {
    this.$nextTick(() => {
      this.scrollToActiveTop();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollToActiveTop()
    })
  },
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 取消未完成的请求
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel("组件销毁");
      this.cancelTokenSource = null;
    }
  },
}
</script>

<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
}

.topBox {
  position: relative;
  z-index: 999;
}

.topBox .searchValue {
  width: 95%;
}

.topBox .van-search {
  padding-bottom: 6px;
  padding-top: 6px;
  padding-right: 5px;
}

.topBox .van-search .van-cell {
  background-color: transparent;
}

.topBox .van-search__content {
  background-color: #F6F6F6;
  border-radius: 30px;
}

.topBox .pTop {
  background-color: #ffffff;
  padding: 10px 8px 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
}

.topBox .pTop .icon {
  width: 5%;
  color: #717171;
  padding-top: 3px;
}

.centerBox .sort {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 8px 20px;
}

.centerBox .comprehensive {
  display: flex;
  align-items: center;
  font-size: 15px;
  gap: 3px;
  color: #CA4041;
  font-weight: bold;
  cursor: pointer;
}

.centerBox .down {
  padding-top: 3px;
  width: 12px;
}

.centerBox .down .img {
  width: 12px;
  height: 12px;
}

.centerBox .listBox {
  // display: flex;  
  // flex-wrap: wrap;
  display: block;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0px 10px 10px;
  gap: 8px 0px;
  height: calc(100vh - 120px);
  overflow: auto;
}

.centerBox .listBox .shopList {
  width: 49%;
}

/* 空状态 */
.empty-state {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}

/* 加载更多 */
.loading-more {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 没有更多 */
.no-more {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 12px;
}

/* 弹窗样式 */
.popupBox .van-popup--bottom {
  max-height: 90vh;
  background-color: #FFFFFF !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.popupBox .close {
  position: absolute;
  top: 13px;
  right: 13px;
}

.popupBox .popup {
  padding: 15px;
}

.popupBox .title {
  font-weight: bold;
  text-align: center;
  font-size: 17px;
}

.popupBox .titleItem {
  font-weight: bold;
  font-size: 15px;
}

.popupBox .listItem {
  margin-top: 20px;
}

.popupBox .priceBox {
  width: 90%;
  margin: 18px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.popupBox .priceBox .inpBox {
  background-color: #F6F6F6;
  border-radius: 30px;
  height: 35px;
  font-size: 13px;
  flex: 1;
}

.popupBox .priceBox .inpBox .inp {
  border: none;
  background-color: transparent;
  text-align: center;
  width: 100%;
  height: 100%;
}

.popupBox .footer {
  margin: auto;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 90%;
  border-radius: 30px;
  overflow: hidden;
  margin-top: 50px;
}

.popupBox .resetting {
  background-image: linear-gradient(to right, #FFAA73, #FF8330);
  color: white;
  padding: 10px;
  box-sizing: border-box;
  width: 50%;
  text-align: center;
  cursor: pointer;
}

.popupBox .complete {
  background-image: linear-gradient(to right, #E71D1E, #FA0707);
}

.brandBox {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18px;
  gap: 10px;
}

.brandBox .sortText {
  color: #646464;
  background-color: #F6F6F6;
  white-space: nowrap;
  padding: 5px 15px 6px;
  border-radius: 30px;
  font-size: 13px;
  min-width: 21%;
  text-align: center;
  cursor: pointer;
}

.brandBox .sortText1 {
  color: #CD3638;
  background-color: #FFE3E0;
}

/* 综合排序弹窗 */
.popupBox1 .van-popup--top {
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.popupBox1 .synthesisItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 12px;
  cursor: pointer;
}

.popupBox1 .addRegion {
  color: #D25053;
}

.listBox::-webkit-scrollbar {
  display: none;
}


/* ============ 大分类横向滚动 ============ */
.top-category-bar {
  background: #fff;
  padding: 1px 0 8px 0;
  overflow: hidden;
  border-bottom: 1px solid #f5f5f5;

  .category-scroll {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 10px;
    gap: 8px;

    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;

    .cat-item {
      flex-shrink: 0;
      padding: 6px 14px;
      font-size: 14px;
      color: #333;
      background: #f7f7f7;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #ED3137;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

/* ============ 小分类横向滚动 ============ */
.sub-category-bar {
  background: #fff;
  padding: 8px 0;
  overflow: hidden;

  .sub-scroll {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 10px;
    gap: 8px;

    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;

    .sub-item {
      flex-shrink: 0;
      padding: 5px 12px;
      font-size: 13px;
      color: #666;
      background: #f7f7f7;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #FFE3E0;
        color: #CD3638;
        font-weight: 600;
      }
    }
  }
}
</style>