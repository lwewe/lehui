<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <NProgress v-if="loadingflag" />

    <!-- 顶部 Banner -->
    <div class="backBox" v-if="search != 1">
      <img class="img" :src="banner" alt="" />
    </div>

    <!-- 搜索框 -->
    <div class="searchWrap">
      <van-search @input="searchInput" background="transparent" :placeholder="search != 1 ? '搜索你喜欢的品牌' : '搜索你喜欢的商品'"
        v-model="searchValue" shape="round" style="padding: 0;" />
    </div>

    <!-- 品牌区 -->
    <loading style="margin: 10px 0px 20px" v-if="isLoading && sortList.length == 0 && search != 1" />
    <div class="filmBox" v-if="sortList.length > 0 && search != 1">
      <!-- 大类别弹窗 -->
      <div class="popupBox3" v-if="bigcategory">
        <van-popup v-model="bigcategory" position="top">
          <div class="popup">
            <div class="sortTop sortCenter">
              <div class="sortItem" v-for="item in sortList" :key="item.id"
                @click="changeBrand(item.brand_id); bigcategory = false;">
                <div class="iconImg">
                  <img class="img" :src="item.image_path" alt="" />
                </div>
                <div class="sortText">88{{ item.name }}</div>
              </div>
            </div>
            <div>
              <div class="retract" @click="bigcategory = false">
                <div>收起</div>
                <div style="padding-top: 3px"><van-icon name="arrow-up" /></div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>

      <div class="allBox" @click="bigcategory = true">
        <div>全部</div>
        <div class="allIcon"><van-icon name="apps-o" size="16" /></div>
      </div>

     
     <div class="swiper-container">
  <div class="swiper-wrapper" @click="onBrandWrapClick">
    <div
      class="swiper-slide"
      v-for="(item, index) in sortList"
      :key="item.id"
      :data-brand-id="item.brand_id"
      :style="{ backgroundImage: gradientOf(index) }"
      :class="{ 'active-brand': String(currentBrandId) === String(item.brand_id) }"
    >
      <div class="bannerBox">
        <div class="bannerImg">
          <img class="img" :src="item.album_image_path || item.image_path" alt="" draggable="false" />
        </div>
      </div>
      <div class="sortText">{{ item.name }}</div>
    </div>
  </div>
</div>


    </div>

    <!-- 排序 -->
    <!-- 排序 -->
    <div class="sortBar">
      <!-- 综合 -->
      <div class="sortItem-wrap">
        <div class="sortItem" @click="showSynthesis = !showSynthesis">
          <div :class="{ active: showSynthesis }">综合</div>
          <van-icon :name="showSynthesis ? 'arrow-up' : 'arrow-down'" size="12px" />
        </div>

        <!-- 综合的下拉弹窗（用绝对定位放在按钮下面） -->
        <div class="custom-dropdown" v-show="showSynthesis">
          <div class="synthesisItem" v-for="item in synthesisList" :key="item.id" @click="changeSynthesis(item.id)">
            <div :class="{ addRegion: synthesisId == item.id }">{{ item.text }}</div>
            <!-- <div v-if="synthesisId == item.id">
              <van-icon color="#ED3137" name="success" size="16px" />
            </div> -->
          </div>
        </div>
      </div>

      <!-- 价格 -->
      <div class="sortItem" @click="changePrice">
        <div :class="{ active: type === 4 || type === 5 }">价格</div>
        <div class="down">
          <van-icon :name="type === 5 ? 'arrow-up' : 'arrow-down'" size="12px" />
        </div>
      </div>

      <!-- 筛选 -->
      <div class="sortItem" @click="showAll = true">
        <div>筛选</div>
        <van-icon name="filter-o" size="12px" />
      </div>
    </div>

    <!-- 商品列表 (纯手写双列，不依赖组件) -->
    <div class="listWrap">
      <div class="product-grid" v-if="productList.length > 0">
        <div class="product-card" v-for="item in productList" :key="item.id" @click="toProductDetail(item)">

          <!-- 顶部图片 -->
          <div class="card-img-box">
            <img :src="item.image_path" alt="" />
          </div>

          <!-- 底部信息 -->
          <div class="card-info">
            <div class="title">{{ item.title }}</div>
            <div class="brand">{{ item.brand_name }}</div>

            <div class="bottom-bar">
              <div class="price">
                <span>¥</span>{{ item.price }}
              </div>
              <!-- 右侧加号按钮 -->
              <div class="add-btn" @click.stop="addCart(item)">
                <van-icon name="plus" size="12" color="#fff" />
              </div>
            </div>

            <!-- 标签 -->
            <div class="tags" v-if="item.label_name">
              <span class="tag-item">{{ item.label_name.split(',')[0] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载与无数据状态 -->
      <loading style="margin: 20px 0px" v-if="listLoading" />
      <div class="noMore" v-if="!listLoading && isScroll && productList.length > 0">— 到底了 —</div>
      <div class="noMore" v-if="!listLoading && productList.length === 0">暂无相关商品</div>
    </div>

    <!-- 全部筛选弹窗 -->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom" round>
        <div class="popup">
          <div class="close" @click="showAll = false"><van-icon size="18px" name="cross" /></div>
          <div class="title">全部筛选</div>
          <div class="listItem">
            <div class="titleItem">价格筛选</div>
            <div class="priceBox">
              <div class="inpBox">
                <input class="inp" type="number" v-model="minprice" placeholder="最低价" />
              </div>
              <div class="line">-</div>
              <div class="inpBox">
                <input class="inp" type="number" v-model="maxprice" placeholder="最高价" />
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="resetting" @click="resetting">重置</div>
            <div class="resetting complete" @click="complete">完成</div>
          </div>
        </div>
      </van-popup>
    </div>

    <!-- 返回顶部 -->
    <div class="goTop" @click.stop="goTop">
      <img class="img" src="@/assets/dangao/db.png" alt="" />
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
// 已经移除了 import ShopList，改为纯原生渲染
import { getCakeBrand, getCakeBirthday as getCakeBirthdayApi } from "@/api/lehuicake";

export default {
  name: "BirthdayCake",
  // 移除 components 里的 ShopList
  data() {
    return {
      cid: "",
      searchValue: "",
      swiper: null,
      sortList: [],

      showSynthesis: false,
      showAll: false,
      bigcategory: false,
      synthesisList: [
        { id: 1, text: "综合推荐" },
        { id: 2, text: "销量由高到低" },
        { id: 3, text: "新品优先" },
      ],
      synthesisId: 1,

      banner: require('@/assets/dangao/dangaoback.png'),
      debounceTimer: null,
      isLoading: false,
      listLoading: false,
      loadingflag: true,
      search: "",

      page: 1,
      limit: 10,
      lastPage: 1,
      isScroll: false,
      productList: [],
      minprice: "",
      maxprice: "",
      type: 1,
      currentBrandId: "",
    };
  },
  methods: {
     onBrandWrapClick(e) {
  let el = e.target;
  while (el && !el.classList.contains('swiper-slide')) {
    if (el === e.currentTarget) return;
    el = el.parentElement;
  }
  if (!el) return;
  const brandId = el.dataset.brandId;
  if (!brandId) return;
  this.changeBrand(brandId);
},

changeBrand(brandId) {
  const idStr = brandId ? String(brandId) : "";
  this.currentBrandId = this.currentBrandId === idStr ? "" : idStr;

  // 先请求，保证点击有反馈
  this.getCakeBirthday(true);

  // 再同步 URL，容错
  try {
    const query = { ...this.$route.query };
    if (this.currentBrandId) query.brand_id = this.currentBrandId;
    else delete query.brand_id;
    this.$router.replace({ query }).catch(() => {});
  } catch (e) {}
},
    gradientOf(index) {
      const n = (index + 1) % 4;
      if (n === 1) return "linear-gradient(to bottom,#E45FB9,#F1608A,#FB6768)";
      if (n === 2) return "linear-gradient(to bottom,#F8E59B,#FAC67D,#FD9C59)";
      if (n === 3) return "linear-gradient(to bottom,#A9D8E6,#73A5EC,#5582F2)";
      return "linear-gradient(to bottom,#FFD5B3,#F793BA,#F05CC3)";
    },

    getCakeBirthday(reset = false) {
      if (this.listLoading && !reset) return;
      if (!this.cid) {
        this.loadingflag = false;
        this.listLoading = false;
        return;
      }

      if (reset) {
        this.productList = [];
        this.page = 1;
        this.lastPage = 1;
        this.isScroll = false;
      }

      this.listLoading = true;
      const params = {
        cid: this.cid,
        type: this.type,
        page: this.page,
        limit: this.limit,
        minprice: this.minprice || undefined,
        maxprice: this.maxprice || undefined,
        keyword: this.searchValue || undefined,
        brand_id: this.currentBrandId || undefined,
      };

      getCakeBirthdayApi(params)
        .then((res) => {
          this.loadingflag = false;
          this.listLoading = false;
          if (res.code === 200) {
            const list = res.data.data || [];
            this.lastPage = res.data.last_page || 1;
            if (list.length === 0) {
              this.isScroll = true;
              return;
            }
            this.productList = this.productList.concat(list);
            if (res.data.current_page >= this.lastPage) {
              this.isScroll = true;
            }
          }
        })
        .catch(() => {
          this.loadingflag = false;
          this.listLoading = false;
        });
    },

    changePrice() {
      this.type = this.type !== 4 ? 4 : 5;
      this.getCakeBirthday(true);
    },

    getBrind(keyword = "") {
      if (!this.cid) return;
      this.isLoading = true;
      getCakeBrand({
        cid: this.cid,
        flag: 1,
        page: 1,
        limit: 99999,
        keyword,
      })
        .then((res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.sortList = res.data.data || [];
            this.$nextTick(() => {
              setTimeout(() => {
                this.getSwiper();

                // ✅ 从首页带了 brand_id，滚动到对应品牌
                if (this.currentBrandId) {
                  const idx = this.sortList.findIndex(
                    // (item) => String(item.brand_id) === this.currentBrandId
                    (item) => String(item.brand_id) === String(this.currentBrandId)
                  );
                  if (idx > -1 && this.swiper) {
                    this.swiper.slideTo(idx, 300);
                  }
                }
              }, 300);
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },

    toBrandDetail(brandId) {

      this.$router.push({ path: "/brandDetail", query: { brand_id: brandId, cid: this.cid } });
    },

    // 点击商品跳转
    toProductDetail(item) {
      this.$router.push({ path: "/CakeproductDetail", query: { id: item.id, cid: this.cid } });
    },

    // 点击加号加购物车 (仅做提示，具体逻辑需接入购物车接口)
    addCart(item) {
      if (this.$toast) {
        this.$toast("加入购物车成功");
      }
      // 这里可以调加购物车接口，例如:
      // addCart({ product_id: item.id, ... })
    },

    searchInput() {
      this.sortList = [];
      this.isScroll = false;
      this.page = 1;
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        if (String(this.search) === "1") {
          this.getCakeBirthday(true);
        } else {
          this.getBrind(this.searchValue);
        }
        this.debounceTimer = null;
      }, 800);
    },

    changeSynthesis(id) {
      this.synthesisId = id;
      this.type = id;
      this.showSynthesis = false;
      this.getCakeBirthday(true);
    },

    resetting() {
      this.minprice = "";
      this.maxprice = "";
    },

    complete() {
      this.showAll = false;
      this.getCakeBirthday(true);
    },

    getSwiper() {
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
      this.swiper = new Swiper(".swiper-container", {
        observer: true,
        observeParents: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        preventClicks: false, // ✅ 允许触发点击事件
        preventClicksPropagation: false, // ✅ 允许事件冒泡
      });
    },

    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      if (scrollHeight - (scrollTop + clientHeight) <= 100) {
        this.onMost();
      }
    },

    onMost() {
      if (this.isScroll || this.listLoading) return;
      if (this.page >= this.lastPage) {
        this.isScroll = true;
        return;
      }
      this.page++;
      this.getCakeBirthday();
    },

    goTop() {
      let num = 0;
      const timer = setInterval(() => {
        num += 10;
        document.documentElement.scrollTop -= num;
        if (document.documentElement.scrollTop <= 0) clearInterval(timer);
      }, 10);
    },

    restoreScroll() {
      const scrollY = sessionStorage.getItem("scrollPosition");
      if (scrollY) {
        this.$nextTick(() => {
          window.scrollTo(0, parseInt(scrollY));
        });
      }
    },
  },
  created() {
    this.search = this.$route.query.search || "";

    this.cid =
      this.$route.query.cid ||
      localStorage.getItem("cid") ||
      (this.$store && this.$store.state && this.$store.state.city && this.$store.state.city.cid) ||
      "";

    // ✅ 从路由读取 brand_id，统一转字符串
    this.currentBrandId = this.$route.query.brand_id
      ? String(this.$route.query.brand_id)
      : "";

    if (String(this.search) === "1") document.title = "搜索";

    if (!this.cid) {
      this.loadingflag = false;
      this.listLoading = false;
      if (this.$toast) this.$toast("请先选择城市");
      return;
    }
    this.getCakeBirthday(true);
  },
  mounted() {
    if (!this.cid) return;
    this.getBrind();
    window.addEventListener("scroll", this.handleScroll);
    this.restoreScroll();
  },
  activated() {
    this.restoreScroll();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.swiper) this.swiper.destroy(true, true);
  },
};
</script>

<style scoped lang="less">
/* 整体页面背景 */
.conPage {
  min-height: 100vh;
  background: linear-gradient(180deg, #FCEDC2 0%, #F6C6D0 40%, #F6C6D0 100%);
  padding-bottom: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.backBox {
  position: relative;
  z-index: 200000;
  width: 100%;

  img {
    width: 100%;
    display: block;
  }
}

/* 搜索框透明化 */
.searchWrap {


  background-color: #ffffff;
  // margin: -20px 10px 0;
  position: relative;
  padding: 10px;
  z-index: 200000;

  /deep/ .van-search__content {
    background-color: #eaeaea;
    border-radius: 30px;
    // box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
}

/* -------- 品牌滑动区 -------- */
.filmBox {
  padding: 0 10px;
  background-color: #ffffff;
  position: relative;
  // padding: 10px;

  z-index: 10;
  /* ✅ 提高层级，防止被下方的排序栏遮挡 */
  // margin-bottom: 5px; /* ✅ 给下面留点空隙 */
}

.swiper-container {

  padding-right: 40px;
  /* ✅ 关键：允许上下溢出，避免放大后被切掉 */
  overflow: visible !important;
  /* ✅ 增加一点上下内边距，给放大的卡片留出空间 */
  padding-top: 8px;
  padding-bottom: 8px;
  /* 把原本可能定死的高度去掉，让它自适应 */
  height: auto;
}

.swiper-wrapper {
  display: flex;
}

.swiper-slide {
  width: 70px !important;
  text-align: center;
  border-radius: 10px;
  padding: 4px;
  transition: all 200ms;
  flex-shrink: 0;
  opacity: 0.6;
  /* 未选中的稍微变暗一点 */

  /* ✅ 新增：选中状态的样式 */
  &.active-brand {
    opacity: 1;
    transform: scale(1.05);
    /* 放大一点 */
    // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }
}

.bannerBox {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bannerImg {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.bannerBox, .bannerImg, .bannerImg img {
  pointer-events: none;
}
.sortText {
  color: white;
  width: 100%;
  font-size: 11px;
  height: 18px;
  line-height: 18px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧“全部”悬浮 */
.allBox {
  font-size: 12px;
  color: #4d4c4c;
  text-align: center;
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  height: 90px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: -4px 0 8px rgba(255, 255, 255, 0.9);
  z-index: 9;
  border-radius: 8px 0 0 8px;

  .allIcon {
    margin-top: 4px;
  }
}

/* -------- 排序 Bar -------- */
/* 排序 Bar */
.sortBar {
  display: flex;
  justify-content: space-around;
  // margin: 15px 10px;
  background: #ffffff;
  // border-radius: 20px;
  padding: 8px 0;
  position: relative;
  z-index: 1;
  /* 保证排序条在商品之上 */

  .sortItem-wrap {
    position: relative;
    /* 综合按钮的定位参照点 */
  }

  .sortItem {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #333;
    font-weight: 500;

    .active {
      color: #CA4041;
      font-weight: bold;
    }
  }
}

/* 自定义下拉菜单 (替代之前的 popupBox1) */
.custom-dropdown {
  position: absolute;
  top: 26px;
  /* 往下偏移，刚好在“综合”下面 */
  left: -30px;
  /* 向左微调居中 */
  background: #fff;
  border-radius: 0 0 8px 8px;
  // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 120px;
  z-index: 999;
  padding: 5px 0;

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 15px;
    font-size: 14px;
    color: #333;

    &:active {
      background-color: #f5f5f5;
    }
  }

  .addRegion {
    color: #ED3137;
    font-weight: bold;
  }
}

/* -------- 商品列表 (纯手写) -------- */
.listWrap {
  padding: 0 10px;
  margin-top: 10px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* 强制两列 */
  gap: 10px;
}

.product-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  .card-img-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f8f8;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card-info {
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .brand {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .price {
        color: #E03C3C;
        font-size: 16px;
        font-weight: bold;

        span {
          font-size: 11px;
          margin-right: 1px;
        }
      }

      .add-btn {
        width: 22px;
        height: 22px;
        background: linear-gradient(to right, #FF8E6D, #F54E4E);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .tags {
      margin-top: 4px;
      display: flex;
      gap: 4px;

      .tag-item {
        font-size: 10px;
        color: #CA4041;
        background: #FFF0F0;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  }
}

/* -------- 全部筛选弹窗修正 -------- */
.popupBox {
  /deep/ .van-popup--bottom {
    border-radius: 16px 16px 0 0 !important;
    overflow: hidden;
  }

  .popup {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .title {
    font-weight: bold;
    text-align: center;
    font-size: 17px;
    color: #333;
    margin-bottom: 24px;
  }

  .titleItem {
    font-weight: bold;
    font-size: 15px;
    color: #333;
  }

  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;

    .inpBox {
      flex: 1;
      background-color: #F6F6F6;
      border-radius: 20px;
      height: 40px;
      display: flex;
      align-items: center;

      .inp {
        border: none;
        background-color: transparent;
        text-align: center;
        width: 100%;
        font-size: 14px;
        outline: none;
      }
    }

    .line {
      margin: 0 15px;
      color: #ccc;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    gap: 15px;

    .resetting {
      flex: 1;
      background-image: linear-gradient(to right, #FFB37E, #FF8C3B);
      color: white;
      padding: 12px 0;
      border-radius: 25px;
      text-align: center;
      font-size: 15px;
      font-weight: bold;
    }

    .complete {
      background-image: linear-gradient(to right, #FF6666, #EE2222);
    }
  }
}

/* 大类别弹窗（全部品牌） */
.popupBox3 {
  /deep/ .van-popup--top {
    border-radius: 0 0 12px 12px;
    max-height: 50vh;
    position: absolute;
  }

  .popup {

    padding: 15px 20px;
  }

  .sortCenter {
    display: flex;
    flex-wrap: wrap;
    gap: 15px 0;
    max-height: 40vh;
    overflow-y: auto;
  }

  .sortItem {
    width: 20%;
    text-align: center;
  }

  .iconImg {
    width: 50px;
    height: 50px;
    margin: auto;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eee;
  }

  .sortText {
    color: #333;
    font-size: 12px;
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .retract {
    text-align: center;
    font-size: 13px;
    color: #999;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
}

/* 综合排序下拉框 */
.popupBox1 {
  position: absolute;
  top: 100%;
  /* 贴在“综合”文字的正下方 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  /* 去掉原来的遮挡层，让背景透明 */
  /deep/ .van-overlay {
    display: none !important;
  }

  /deep/ .van-popup--top {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    border-bottom: 1px solid #f5f5f5;
  }

  .synthesisItem:last-child {
    border-bottom: none;
  }

  .addRegion {
    color: #ED3137;
    font-weight: bold;
  }
}

/* 其它小元素 */
.noMore {
  text-align: center;
  color: #b3b3b3;
  font-size: 12px;
  padding: 20px 0;
}

.goTop {
  position: fixed;
  bottom: 80px;
  right: 15px;
  width: 40px;
  z-index: 99;

  img {
    width: 100%;
  }
}
</style>