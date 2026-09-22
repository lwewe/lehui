<template>
  <div class="conPage">
    <!--  头部-->
    <div class="topBox">
      <div class="leftBox">
        <div class="avatar">
          <van-uploader :after-read="onRead" accept="image/*" :max-count="1" :preview-image="false"
            :show-upload="false">
            <img class="img" :src="userInfo.img && userInfo.img.trim() ? userInfo.img : defaultAvatar" alt="">
          </van-uploader>
        </div>
        <div>
          <div class="phone">{{ userInfo.phone }}</div>
          <!-- <div class="vipBack">悦享会员</div> -->
        </div>
      </div>
      <!-- <div class="settingBox">
        <div class="setting" @click="toStting('/setting')">
          <img class="img" src="@/assets/mine/sz.png" alt="">
        </div>
        <div class="setting" @click="scanQRCode">
          <img class="img" src="@/assets/mine/sys.png" alt="">
        </div>
      </div> -->
    </div>

    <div class="centerBox">
      <div class="coupons1">
        <!-- <div class="couponsTitle" @click="scanQRCode">扫码绑定
          <img class="img" src="http://yxfmm.bjyxfl.com/imgs/add/sys.png" alt="" style="width: 20px;margin-left: 6px;">
        </div> -->
        <div class="couponsBox" style="justify-content: space-between;">
          <div class="welfareBox" style="width: 44%;" @click="toFreea()">
            <div>
              <div class="welfareCard" style="white-space: nowrap">福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-if="total != 0">{{
                total }}张福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-else>暂无福利卡</div>
            </div>
            <div class="welfare" style="width: 39px;">
              <img class="img" src="http://yxfmm.bjyxfl.com/imgs/add/flk.png" alt="">
            </div>
          </div>
          <div class="lines"></div>
          <a @click="toOrder(4)">
            <div class="welfareBox">
              <div>
                <div class="welfareCard">在线客服</div>
                <div class="none">全年无休(9:00-21:00)</div>
              </div>
              <div class="welfare">
                <img class="img" src="http://yxfmm.bjyxfl.com/imgs/add/kf.png" alt="">
              </div>
            </div>
          </a>

        </div>
      </div>

      <!--      我的订单-->
      <div class="coupons orderMax" style="margin-top: 10px;border-radius: 8px">
        <div class="myOrder">
          <div class="couponsTitle">我的订单</div>
          <div class="allOrder" @click="allOrder">
            <div>全部</div>
            <div class="arrow">
              <van-icon size="12px" name="arrow" />
            </div>
          </div>
        </div>
        <!--        状态-->
        <div class="obligationMax">
          <div class="obligationBox" v-for="item in orderIcon" :key="item.id" @click="toOrder(item.id)">
            <div class="obligationImg">
              <img class="img" :src="item.icon" alt="">
              <div class="point" v-if="item.type && item.id == 1"></div>
              <div class="num" v-if="item.type && item.id == 2">{{ item.type }}</div>
            </div>
            <div class="obligationText">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <!--  功能-->
      <div class="coupons orderMax" style="margin-top: 10px;border-radius: 8px">
        <div class="obligationMax" style="padding: 0px 10px 0px 10px ;">
          <div class="obligationBox" v-for="item in mineFun" :key="item.id" @click="toFun(item.id, item.path)">
            <div class="obligationImg" style="width: 24px;height: 24px;">
              <img class="img" :src="item.icon" alt="">
            </div>
            <div class="obligationText" style="white-space: nowrap;">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="padding: 0 10px 100px 10px;">
        <div class="recommend-header">
          <div class="line-left"></div>
          <div class="content">
            <div class="icon-circle">
              <div class="box-shape"></div>
            </div>
            <span class="title">你可能想买</span>
          </div>
          <div class="line-right"></div>
        </div>


        <!-- 1 -->

        <div class="listMax">
          <div class="waterfall-container">
            <!-- 左列 -->
            <div class="waterfall-column">


              <div v-for="(item, index) in leftList" :key="item.id || index" class="shop-item">
                <div class="product-card" @click="toDetail(item.id)">
                  <div class="product-img-box">
                    <img :src="item.img" alt="" class="product-img" v-if="item.img">
                    <div class="img-placeholder" v-else>暂无图片</div>
                  </div>
                  <div class="product-info">
                    <div class="product-title">{{ item.title }}</div>
                    <!-- 左列 -->
                    <span class="platform-tag" :class="getPlatformClass(item.platform)"
                      v-if="getPlatformName(item.platform)">
                      {{ getPlatformName(item.platform,item.jd_type) }}
                    </span>
                    <div class="product-price-row">
                      <span class="sell-price">{{ item.sell_price }}</span>
                      <span class="market-price" v-if="item.market_price"><span
                          style="font-size: 10px; font-weight: bold;">￥</span>{{ item.market_price }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <!-- 右列 -->
            <div class="waterfall-column">
              <div v-for="(item, index) in rightList" :key="item.id || index" class="shop-item">
                <div class="product-card" @click="toDetail(item.id)">
                  <div class="product-img-box">
                    <img :src="item.img" alt="" class="product-img" v-if="item.img">
                    <div class="img-placeholder" v-else>暂无图片</div>
                  </div>
                  <div class="product-info">
                    <div class="product-title">{{ item.title }}</div>
                    <span class="platform-tag" :class="getPlatformClass(item.platform)"
                      v-if="getPlatformName(item.platform)">
                      {{ getPlatformName(item.platform) }}
                    </span>
                    <div class="product-price-row">
                      <span class="sell-price">{{ item.sell_price }}</span>
                      <span class="market-price" v-if="item.market_price"><span
                          style="font-size: 10px; font-weight: bold;">￥</span>{{ item.market_price }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <loading style="margin-top: 2px" v-if="isLoading"></loading>
        </div>
        <!-- 1 -->
      </div>
    </div>

  </div>
</template>

<script>
import NewShopList from "@/components/NewShopList.vue";
import NavigationTab from "@/components/NavigationTab.vue";

import wx from "weixin-js-sdk";
import { bindingcard, qrcodeBinging } from "@/api/cart";

import { getPlatformName} from '@/utils/platform'


import { userInfo, cardList, productList, editInfo } from "@/api/lhjdtm";
export default {
  name: "PersonCenter",
  components: { NavigationTab, NewShopList },
  data() {
    return {
      leftList: [],       // 新增
      rightList: [],      // 新增
      isLoading: false,   // 新增
      isTab: false,       // 新增
      isScroll: false,    // 新增
      total: '',
      defaultAvatar: 'http://lh.bjyxfl.com/images/tx.png', // 默认头像地址
      shopSwiper: [],
      shopList: [],
      pageno: 1,
      orderIcon: [
        {
          id: 1,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/dfk.png',
          text: "待付款"
        },
        {
          id: 2,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/dsy.png',
          text: "待收货"
        },
        {
          id: 3,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/dpj.png',
          text: "已完成"
        },
        {
          id: 4,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/sh.png',
          text: "退款售后"
        },
      ],
      mineFun: [
        {
          id: 1,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/map.png',
          text: "地址管理",
          path: "/address"
        },
        {
          id: 2,
          icon: 'http://yxfmm.bjyxfl.com/imgs/add/zfmm.png',
          text: "支付密码"
        },
        {
          id: 3,
          icon: "http://yxfmm.bjyxfl.com/imgs/add/zn.png",
          text: "使用指南",
          path: "/userGuide"
        },
        {
          id: 4,
          icon: "http://yxfmm.bjyxfl.com/imgs/add/yj.png",
          text: "意见反馈"
        },
        {
          id: 5,
          icon: "http://yxfmm.bjyxfl.com/imgs/add/tc.png",
          text: "退出登录"
        },
      ],
      userInfo: {},
      token: "",
      kefu: "",
      info: {}
    }
  },
  methods: {
    // 获取平台名称（兼容数字和字符串）
    getPlatformName,

    // 获取平台对应的 CSS 类名（用于设置不同颜色）
    getPlatformClass(platform) {
      const name = this.getPlatformName(platform);
      if (name === '天猫') return 'tmall';
      if (name === '京东京造') return 'jingzao';
      return 'jingd'; // 默认京东（红色）
    },
    // 跳转到商品详情
    toDetail(id) {
      if (id) {
        this.$router.push({
          path: "/productDetail",
          query: { id }
        })
      }
    },
    // 分割商品列表到左右两列
    splitShopList(list) {
      this.leftList = []
      this.rightList = []

      if (!Array.isArray(list) || list.length === 0) return

      list.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftList.push(item)
        } else {
          this.rightList.push(item)
        }
      })
    },
    goDetail(id) {
      this.$router.push({ path: "/productDetail", query: { id } })
    },
    getCard() {
      cardList().then(res => {
        if (res.code == 200) {
          this.total = res.data.total;
        }
      })
    },
    // 获取商品列表（适配最新 /jdtmshop/productList 接口）
    getGoodPick(pageno = this.pageno) {
      console.log('getGoodPick 开始，页码:', pageno)

      if (this.isTab) {
        this.shopList = []
      }
      this.isLoading = true

      // 调用新接口：/jdtmshop/productList
      return productList({
        platform: 1,          // 默认取京东平台
        page: pageno,         // 页码（注意：不能用 pageno，要用 page）
        limit: 10,            // 每页条数
        sort: 'px',           // 默认排序
        order: 'desc'
      }).then(res => {
        console.log('productList 完整返回:', res)

        this.isLoading = false
        setTimeout(() => {
          this.loadingflag = false
        }, 500)

        if (res.code == 200) {
          let productData = []

          // 新接口返回结构：res.data.data
          if (res.data && res.data.data && Array.isArray(res.data.data)) {
            productData = res.data.data
          }
          // 兼容多种数据结构（老接口）
          else if (res.data && Array.isArray(res.data)) {
            productData = res.data
          } else if (res.data && res.data.product_list && Array.isArray(res.data.product_list)) {
            productData = res.data.product_list
          } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
            productData = res.data.list
          }

          console.log('解析后的商品数据:', productData)

          if (productData.length === 0) {
            console.log('商品数据为空')
            this.isScroll = true
            return
          }

          // 如果是第一页，清空数据
          if (pageno === 1) {
            this.shopList = []
          }

          // 添加数据
          productData.forEach(item => {
            this.shopList.push(item)
          })

          // 分割数据到左右两列
          this.splitShopList(this.shopList)

          console.log('shopList 最终长度:', this.shopList.length)

          this.isTab = false
        } else {
          console.error('接口返回错误:', res)
        }
      }).catch(error => {
        console.error('获取商品列表失败:', error)
        this.isLoading = false
      })
    },
    scanQRCode() {
      let _that = this;
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
            if (res.checkResult.scanQRCode === true) {
              wx.scanQRCode({ // 微信扫一扫接口
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  let url = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                  let token = localStorage.getItem("token")
                  qrcodeBinging({
                    token,
                    content: url
                  }).then(res => {
                    if (res.code == 200) {
                      setTimeout(() => {
                        _that.$router.go(-1)
                        _that.$toast(res.data)
                      }, 1000)
                    } else {
                      _that.$toast(res.msg)
                    }
                  })
                }
              })
            } else {
              _that.$toast("抱歉，当前客户端版本不支持扫一扫");
            }
          },
          fail: function (res) { // 检测getNetworkType该功能失败时处理
            _that.$toast('fail' + res)
          }
        });
      });
      //错误信息
      wx.error(function (res) {
        _that.$toast("出错了：" + res.errMsg);
      });
    },
    getSign() {
      // this.$toast({message:purl,duration:0})
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appid, // 必填，公众号的唯一标识
        timestamp: "" + this.info.time, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['scanQRCode', 'checkJsApi']
      }
      wx.config(configData);
      wx.ready(function (res) {

      });
      wx.error(function (res) {
      });
    },
    getbindingcard() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      bindingcard({
        url: purl
      }).then(res => {
        this.info = res.data
        this.getSign()
      })
    },
    // 上传头像
    // 上传头像
    onRead(file) {
      console.log('上传的文件:', file); // 调试用

      // 1. 检查文件类型
      if (!file.file.type.startsWith('image/')) {
        this.$toast('请选择图片文件');
        return;
      }

      // 2. 检查文件大小
      if (file.file.size > 5 * 1024 * 1024) {
        this.$toast('图片大小不能超过5MB');
        return;
      }

      // 3. 创建 FileReader 读取图片
      var reader = new FileReader();
      reader.onload = (e) => {
        // 读取完成，拿到 base64 图片地址
        let imgBase64 = e.target.result;

        // 4. 调用 editInfo 更新头像（直接传 img 地址）
        editInfo({
          img: imgBase64
        }).then(res => {
          this.$toast.success("修改头像成功");
          // 5. 更新页面显示
          this.userInfo.img = imgBase64;
          this.getUserInfo(); // 刷新用户信息
        }).catch(err => {
          this.$toast.fail("修改头像失败");
        });
      };
      reader.readAsDataURL(file.file);
    }, toOrder(id) {
      if (id == 4) {
        window.location.href = this.kefu
      } else {
        const statusMap = {
          1: '-1',   // 待付款
          2: '2',    // 待收货
          3: '7',    // 已完成
        }
        const status = statusMap[id] || 'all'
        // this.$router.push({ path: "/orderInfo", query: { tabIndex: id } })
        this.$router.push({
          path: "/orderInfo",
          query: { status }
        })
      }

    },
    allOrder() {
      this.$router.push({
        path: "/orderInfo",
        query: { status: "all" }
      })
      // this.$router.push({ path: "/orderInfo", query: { tabIndex: 0 } })
    },
    //   去福利卡
    toFreea() {
      this.$router.push({ path: "/AddCard" })

      // if (this.$store.state.film == 1) {
      //   window.location.href = this.$store.state.base + "/securitycards?token=" + localStorage.getItem("token")
      // } else {
      //   window.location.href = this.$store.state.freea + localStorage.getItem("token")+"&cityName="+sessionStorage.getItem("cityName")+"&isFirst="+sessionStorage.getItem("isFirst")
      // }
    },
    //   去支付密码
    toFun(id, path) {
      if (id == 2) {
        this.$router.push({
          path: "/payPassword",
        });
      } else if (id == 4) {
        this.$router.push({
          path: "/FeedBack",
        });
      } else if (id == 5) {
        this.$dialog.confirm({
          title: '退出',
          message: '是否退出登录？',
          confirmButtonColor: 'red'
        }).then(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("uid")
          this.$store.commit("settoken", "")
          this.$toast("退出登录成功")
          this.$router.options.routes.forEach(item => {
            if (item.meta) {
              if (item.meta.keep) {
                item.meta.keepAlive = false
              }
            }
          })
          setTimeout(() => {
            this.$router.replace({ path: "/index" })
          }, 1000)
        }).catch(() => {
        })
      }
      else {
        this.$router.push(path)
      }
    },
    toStting(path) {
      this.$router.push(path)
    },
    getUserInfo() {
      userInfo().then(res => {
        if (res.code == 200) {
          this.userInfo = res.data
        }
      })
    },
  },
  created() {
    this.token = localStorage.getItem("token")
    this.getUserInfo()
    this.kefu = localStorage.getItem("kefu")
     
    
     console.log('this.kefu' )
     console.log(this.kefu )
     
    this.getGoodPick();
    this.getCard();
  }
}
</script>

<style scoped lang="less">
// 11
/* ============ 瀑布流列表样式（补全） ============ */
.waterfall-container {
  display: flex;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.waterfall-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bannerBox {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;

  .van-swipe {
    border-radius: 10px;
  }

  .bannerImg {
    width: 100%;

    .img {
      width: 100%;
      display: block;
    }
  }
}

.shop-item {
  width: 100%;
}

.product-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.product-img-box {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 14px;
  }
}

.product-info {
  padding: 10px;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.product-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price-row {
  margin-top: 2px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.sell-price {
  color: #ed2e33;
  font-size: 16px;
  font-weight: bold;

  &::before {
    content: '￥';
    font-size: 10px;
  }
}

.market-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-sales {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.listMax {
  padding: 0px;
  padding-bottom: 10px;
}

// 11
.conPage {
  background-color: #F0F0F0;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
}

.topBox {
  background-image: url("@/assets/mine/back.png");
  // background: linear-gradient(to bottom ,#FFEDED,#FFF9FB,#F0F0F0);
  width: 100%;
  height: 156px;
  background-size: cover;
  box-sizing: border-box;
  padding: 30px 10px 0px 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }

  .vipBack {
    background-image: url("@/assets/mine/hy.png");
    width: 79px;
    height: 34px;
    background-size: cover;
    box-sizing: border-box;
    color: white;
    font-size: 10px;
    line-height: 34px;
    padding-left: 30px;
    white-space: nowrap;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 10px;

    .phone {
      font-weight: bold;
      margin-top: 5px;
      padding-left: 7px;
    }
  }

  .settingBox {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;

    .setting {
      width: 24px;
    }
  }
}

.centerBox {
  padding: 0px 10px;
  margin-top: -40px;

  //我的卡券
  .coupons1 {
    background-color: white;
    border-radius: 8px;
    margin-top: 8px;
    padding: 14px;

    .couponsTitle {
      display: flex;
      align-items: center;
      font-weight: bold;
      color: #383838;
    }

    .welfare {
      min-width: 43px;
      width: 43px;
    }

    .welfareBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      //width: 42%;
      padding: 4px 10px 0px 0;
      gap: 5px;
    }

    .welfareBox:last-child {
      display: flex;
      align-items: center;
      justify-content: space-between;
      //width: 42%;
      padding: 4px 0px 0px 10px;
      gap: 5px;
    }

    .none {
      font-size: 12px;
      color: #696969;
      margin-top: 5px;
    }

    .welfareCard {
      font-weight: bold;
      font-size: 15px;
      color: #343434;
      white-space: nowrap;
    }

    .couponsBox {
      display: flex;
      align-items: center;
      // padding-top: 8px;
      //justify-content: space-between;
    }

    .lines {
      width: 1px;
      background-color: #f3f3f3;
      height: 45px;
    }
  }

  //
  .freeaBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: url("@/assets/mine/hb.png");
    width: 100%;
    height: 60px;
    background-size: cover;
    box-sizing: border-box;
    padding: 7px 23px 0px;

    .vipIcon {
      width: 32px;
    }

    .leftBox {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      color: #80582B;
      font-weight: bold;
    }

    .iconBox {
      color: #80582B;
    }

    .freeaText {
      margin-top: -5px;
    }
  }

  .coupons {
    background-color: white;
    padding: 15px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  //我的订单
  .orderMax {
    .couponsTitle {
      font-weight: bold;
      color: #383838;
      font-size: 15px;
    }

    .myOrder {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .allOrder {
      color: #9D9D9D;
      display: flex;
      align-items: center;
      font-size: 13px;
    }

    .arrow {
      height: 11px;
      padding-left: 3px;
    }

    .obligationBox {
      text-align: center;
    }

    .obligationImg {
      width: 28px;
      height: 28px;
      margin: auto;
      position: relative;
    }

    .obligationText {
      margin-top: 3px;
      font-size: 13px;
      font-weight: bold;
    }

    .point {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #ED3036;
      border-radius: 50%;
      top: 0px;
      right: 0px;
    }

    .num {
      position: absolute;
      min-width: 13px;
      height: 10px;
      border-radius: 50%;
      top: -10px;
      left: 17px;
      border: 1px solid #ed3036;
      color: #ed3036;
      font-size: 10px;
      padding: 1px 1px 3px;
    }
  }

  .obligationMax {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 0px;
  }
}

/* 新增：你可能想买 标题样式 */
.recommend-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 10px 0;
  padding: 0 10px;

  .content {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 12px;
    flex-shrink: 0;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.5px;
    }
  }

  /* 带渐变的左右横线 */
  .line-left,
  .line-right {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #ff8c42);
  }

  .line-right {
    background: linear-gradient(to right, #ff8c42, transparent);
  }

  /* 渐变圆球图标 */
  .icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff4b2b, #ff8c42);
    display: flex;
    align-items: center;
    justify-content: center;

    /* 用纯CSS绘制中间的白色盒子 */
    .box-shape {
      width: 16px;
      height: 11px;
      background-color: #ffffff;
      border-radius: 3px;
      position: relative;
    }

    /* 盒子下方带白色开口的小细节（模拟插画轮廓） */
    .box-shape::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: #ffffff;
    }
  }
}

/* 注意 */


/* 平台标签样式（新增） */
.platform-tag {
  display: inline-block;
  background-color: #DD0A09;
  color: #ffffff;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  padding: 1px 4px;
  margin-top: 4px;
  margin-bottom: 4px;
  /* 给标签和价格之间留点空隙 */
}

/* 针对不同平台的标签颜色（根据 getPlatformClass 返回的类名） */
.platform-tag.tmall {
  background-color: #FF0036;
}

.platform-tag.jingzao {
  background-color: #0086F6;
}
</style>