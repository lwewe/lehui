<template>
  <div class="orderfood">
    <NProgress v-if="loadingflag" />

    <!-- 电子券列表区域 -->
    <div class="rightwrap">
      <!-- 品牌列表 (长条卡片) -->
      <div class="couponList" v-if="brandList.length > 0">
        <div
          class="couponItem"
          v-for="item in brandList"
          :key="item.id"
          @click="toBrandDetail(item)"
        >
          <div class="couponCard">
            <!-- 左侧信息区 -->
            <div class="leftBg">
              <span class="couponName">{{ item.title }}电子券</span>
              <div class="btnExchange">点击兑换</div>
            </div>
            <!-- 右侧品牌Logo区 (动态取接口的 yanse 背景色) -->
            <div
              class="rightBrand"
              :style="{ backgroundColor: item.yanse || '#F0F0F0' }"
            >
              <img class="brandImg" :src="item.img" alt="" />
            </div>
          </div>
        </div>

        <!-- 加载中 / 没有更多 -->
        <div class="loadMore" v-if="loadingMore">加载中...</div>
        <div class="loadMore" v-else-if="!hasMore">没有更多了</div>
      </div>

      <!-- 空状态 -->
      <div
        v-else-if="!loadingflag"
        style="text-align: center; color: #999; padding: 20px;"
      >
        暂无品牌数据
      </div>
    </div>
  </div>
</template>

<script>
import { getCouponsBrand } from "@/api/lehuicake";

export default {
  data() {
    return {
      loadingflag: true, // 首屏 loading
      loadingMore: false, // 上拉加载 loading
      brandList: [], // 品牌列表数据
      cid: "2", // 城市 ID
      page: 1, // 当前页
      limit: 10, // 每页条数
      total: 0, // 总条数
      hasMore: true, // 是否还有下一页
    };
  },
  methods: {
     toBrandDetail(item) {
      this.$router.push({path: "/brandCouPon", query: {id: item.id}})
    },
    // 获取品牌列表
    getBrandList(isLoadMore = false) {
      if (isLoadMore) {
        if (this.loadingMore || !this.hasMore) return;
        this.loadingMore = true;
      } else {
        this.loadingflag = true;
        this.page = 1;
        this.hasMore = true;
      }

      getCouponsBrand({
        cid: this.cid,
        page: this.page,
        limit: this.limit,
      })
        .then((res) => {
          const resData = res.data?.data || res.data;

          if (res.code === 200 || resData) {
            const brandList = resData.brand_list || {};
            const list = brandList.data || [];

            // 追加或覆盖
            this.brandList = isLoadMore
              ? this.brandList.concat(list)
              : list;

            this.total = brandList.total || 0;
            this.hasMore = this.page < (brandList.last_page || 1);
          } else {
            this.$toast(res.msg || "获取数据失败");
          }
        })
        .catch((err) => {
          console.error("接口请求异常:", err);
          this.$toast("网络请求失败");
        })
        .finally(() => {
          this.loadingflag = false;
          this.loadingMore = false;
        });
    },

    // 上拉加载更多
    onLoadMore() {
      if (!this.hasMore || this.loadingMore) return;
      this.page += 1;
      this.getBrandList(true);
    },

     
  },
  created() {
    this.getBrandList();
  },
  mounted() {
    // 滚动到底部自动加载更多（也可换成 van-list 的 @load）
    window.addEventListener("scroll", () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        this.onLoadMore();
      }
    });
  },
  beforeDestroy() {
    // 若用匿名函数需手动移除，建议改成具名函数，这里仅作提醒
  },
};
</script>

<style scoped lang="less">
.orderfood {
  min-height: 100vh;
  background: #f0f0f0;
  padding-top: 10px;
  box-sizing: border-box;
}

/* ================= 电子券全新样式（截图还原版） ================= */
.couponList {
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 12px; /* 卡片间距 */

  .couponItem {
    width: 100%;
    box-sizing: border-box;

    .couponCard {
      display: flex;
      height: 95px;
      border-radius: 10px;
      // background-color: #fff;
      // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      overflow: hidden;

      /* 左侧信息区 */
      .leftBg {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 106px;
        border-radius: 14px;
        /* 浅粉色背景 */
        background: url('../../../assets/daincan/bj.png');
        background-size: cover;
        //  linear-gradient(to right, #fff6f6, #ffffff);

        .couponName {
          font-size: 15px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .btnExchange {
          background-color: #f34343; /* 红色按钮 */
          color: #fff;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 15px;
          width: max-content;
        }
      }

      /* 右侧Logo区 */
      .rightBrand {
        width: 85px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: 14px;

        .brandImg {
          width: 60px;
          height: 60px;
          object-fit: contain; /* 保证Logo不拉伸 */
        }
      }
    }
  }

  .loadMore {
    text-align: center;
    color: #999;
    font-size: 12px;
    padding: 8px 0;
  }
}
</style>