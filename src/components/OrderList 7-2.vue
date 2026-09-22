<template>
  <div class="pageMax">
    <!--      str.startsWith(startStr)-->
    <div v-for="item in prouctList" :key="item.id">
      <div>
        <!-- add景区 -->
        <div class="listItem" v-if="item.ord_bs == 9" @click="toScenicOrder(item.id)">
          <div class="reserve"><span class="circles"></span>预定日期：<span class="clr_2">{{ timestampToTime(item.add_time)
              }}</span></div>
          <div class="flex_box">
            <div class="flex_top">
              <div class="flex-bet"><img :src="hsjd" class="img" alt=""><span>景区门票</span></div>
              <div class="stutas">{{ item.third_party_status }}</div>
            </div>

            <div class="flex_center">
              <div>
                <div class="cl0">{{ item.name }}</div>
                <div class="mt10">{{ item.piaotype }} </div>
                <div class="fs12"><span>{{ item.passenger_data.length }}</span>张 <span class="ml18">{{ item.rq }}
                  </span>{{ item.resource_data[0].useDate }}（出游） </div>
              </div>
              <div class="prices"><span class="fs10">￥</span>{{ item.total_price }}</div>
            </div>
          </div>

        </div>


        <!-- add景区 -->
        <!--          电影-->
        <div class="listItem" v-if="item.ord_bs == 1" @click="tomoveOrder(item.id)">
          <div class="orderNo">
            <div class="orderNum">订单号: <span>{{ item.order_id }}</span></div>
            <!--    订单状态-->
            <div v-if="item.type == 1">
              <!--            "orderstatus": "N", //N：待支付-->
              <!--            //C：已取消-->
              <!--            //E：订单有效期过后，没有收到付款通知-->
              <!--            //P：已付款-->
              <!--            //T：通知处理中-->
              <!--            //S：出票成功-->
              <!--            //F：出票失败，等待退款-->
              <!--            //R：退款完成-->
              <div class="time" v-if="item.orderstatus == 'N'">待付款</div>
              <div class="otherType" v-if="item.orderstatus == 'C'">已取消</div>
              <div class="otherType" v-if="item.orderstatus == 'E'">订单已过期</div>
              <!--                        <div class="otherType" v-if="item.orderstatus=='N'">已完成</div>-->
              <div class="otherType" v-if="item.orderstatus == 'S'">已出票</div>
              <div class="otherType" v-if="item.orderstatus == 'P'">已付款</div>
              <div class="otherType" v-if="item.orderstatus == 'T'">通知处理中</div>
              <div class="otherType" v-if="item.orderstatus == 'F'">出票失败，等待退款</div>
              <div class="otherType" v-if="item.orderstatus == 'R'">退款完成</div>
            </div>
            <div v-else>
              <div class="time" v-if="item.orderstatus == 0">待付款</div>
              <div class="otherType" v-if="item.orderstatus == 1">待出票</div>
              <div class="otherType" v-if="item.orderstatus == 2">已取消</div>
              <div class="otherType" v-if="item.orderstatus == 4">出票成功</div>
              <div class="otherType" v-if="item.orderstatus == 7">出票失败(退款)</div>
              <div class="otherType" v-if="item.orderstatus == '8'">超时未付(取消)</div>
              <div class="otherType" v-if="item.orderstatus == '11'">正在出票</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox">
            <div class="film">
              <div class="filmImg">
                <img class="img" :src="item.movielogo" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{ item.moviename }}</div>
                <div class="startTime" style="margin-top: 5px">{{ item.playtime }}</div>
                <div class="startTime textBox">{{ item.cinemaname }}</div>
                <div class="seat textBox" v-if="item.seats">
                  <span v-for="item2 in item.seats.split(',')">{{ item2 }}</span>
                </div>
              </div>
            </div>
            <!--            <div class="btnBox" @click="gopay(item.id)">-->
            <!--              <van-button class="btnno" type="danger" v-if="item.orderstatus=='N'">去支付</van-button>-->
            <!--            </div>-->
          </div>
          <!--      价格-->
          <div class="priceBox">
            <div>共{{ item.quantity }}张</div>
            <div>
              总计: <span class="priceNum">{{ item.showamount }}</span><span class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>

        <!--    卡券-->
        <div class="listItem" v-if="item.ord_bs == 2" @click="tocardOrder(item.id)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
            <!--    订单状态-->
            <div>
              <!--          <div class="time">支付剩余时间 10:25</div>-->
              <!--                    <div class="otherType">已取消</div>-->
              <div class="otherType">交易成功</div>
              <!--                    <div class="otherType">待使用</div>-->
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox" v-if="item.kaquan">
            <div class="film">
              <div class="filmImg cardImg">
                <img class="img" :src="item.kaquan.img" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{ item.kaquan.title }}</div>
                <div class="startTime textBox" style="margin-top: 0px">{{ item.kaquan.gueige }}</div>
              </div>
            </div>
          </div>
          <!--      价格-->
          <div class="priceBox" style="margin-top: -1px">
            <div>共1件商品</div>
            <div>
              总计: <span class="priceNum">{{ item.total_fee }}</span><span class="first">元</span>
            </div>
          </div>
          <div class="button">
            <div class="cancel">查看详情</div>
            <!--          <div class="cancel toPay">去支付</div>-->
          </div>
        </div>
        <!--    商品-->
        <div class="listItem" @click="toShopOrder(item.id)" v-if="item.ord_bs == 3">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
            <!--    订单状态-->
            <div v-if="item.state">
              <!--              1-待收货  2-已完成  3-已取消-->
              <div class="otherType" v-if="item.state == 0">待发货</div>
              <div class="otherType" v-if="item.state == 1">待收货</div>
              <div class="otherType" v-if="item.state == 2">已完成</div>
              <div class="otherType" v-if="item.state == 3">已取消</div>
            </div>
            <div v-else>
              <div class="otherType" v-if="item.status == 'waiting_audit' || orderShow.status == 'waiting_shipment'">待发货
              </div>
              <div class="otherType" v-if="item.status == 'waiting_confirmed'">待收货</div>
              <div class="otherType" v-if="item.status == 'completed'">已完成</div>
              <div class="otherType" v-if="item.status == 'canceld'">已取消</div>
            </div>
          </div>
          <!--      影片 v-if="item.child_flag==0&&item.content"-->
          <div class="filmBox" style="width: 100%;" v-for="(key, value) in item.content" :key="key.id">
            <div class="film" style="width: 100%;">
              <div class="filmImg cardImg2">
                <img class="img"
                  :src="(key.product.thumbnailimage.startsWith('https') || key.product.thumbnailimage.startsWith('http')) ? key.product.thumbnailimage : $store.state.imgUrl + key.product.thumbnailimage"
                  alt="">
              </div>
              <div class="rightBox" style="width: 72%;">
                <div class="filmName">{{ key.product.name }}</div>
                <div class="startTime textBox" style="margin-top: 0px" v-if="key.xinghao.xinghao">
                  {{ key.xinghao.xinghao }}
                </div>
                <!--                <div class="startTime textBox" style="margin-top: 0px" v-else>-->
                <!--                  {{ key.xinghao }}-->
                <!--                </div>-->
              </div>
            </div>
          </div>

          <!--      价格-->
          <div class="priceBox" style="margin-top: 0px">
            <div v-if="item.content">共{{ item.content.length }}件商品</div>
            <div v-if="item.child">共{{ item.child.length }}件商品</div>
            <div>
              总计: <span class="priceNum">{{ item.price }}</span><span class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>
        <!--      肯德基-->
        <!--    点餐-->
        <div class="listItem" v-if="item.ord_bs == 4" @click="toorderOrder(item.id, item.pf, item.storeId, item.type)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.orderid }}</div>
            <!--    订单状态-->
            <div>

              <div class="otherType">{{ item.statusstr }}</div>
              <!--                    <div class="otherType">待使用</div>-->
            </div>
          </div>
          <!--     影片-->
          <div class="filmBox" v-if="item.type == 3" v-for="item2 in JSON.parse(item.products)" :key="item2.id">
            <!--                        {{item2}}-->
            <div class="film">
              <div class="filmImg">
                <img class="img" :src="item2.goodsImage" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{
                  item2.goodsName
                }}
                </div>
                <!-- <div class="startTime textBox" style="margin-top: 0px">
                  {{
                    item2.listname || item2.goodlistname || item2.listname || item2.config
                  }}
                </div> -->
              </div>
            </div>
          </div>
          <div class="filmBox" v-if="item.type != 3" v-for="item2 in JSON.parse(item.goods)" :key="item2.id">
            <!--                        {{item2}}-->
            <div class="film">
              <div class="filmImg">
                <img class="img" :src="item2.goodImg || item2.itemImage || item2.imageUrl || item2.itemImage" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{
                  item2.goodName || item2.itemName || item2.nameCn || item2.itemName
                }}
                </div>
                <div class="startTime textBox" style="margin-top: 0px">
                  {{
                    item2.listname || item2.goodlistname || item2.listname || item2.config
                  }}
                </div>
              </div>
            </div>
          </div>



          <!--      价格-->
          <div class="priceBox" style="margin-top: -1px">
            <div>共{{ JSON.parse(item.goods).length }}**件商品</div>
            <div>
              总计: <span class="priceNum">{{ item.zongji }}</span><span class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>
        <!--        蛋糕-->
        <div v-if="item.order">
          <div class="listItem" v-if="(item.order.ord_bs ? item.order.ord_bs == 5 : true) && item.order.flag == 3">
            <div v-for="item2 in item.order_list" :key="item2.id" @click="toDetail(item2.id)">
              <div class="orderNo">
                <div class="orderNum orderTime">订单号:{{ item2.order_no }}</div>
                <!--    订单状态-->
                <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
                <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
                <div v-if="item2.flag == 3">
                  <div class="otherType" v-if="item2.detail.status == 3">已取消</div>
                  <div class="otherType" v-if="item2.detail.status == 2">已完成</div>
                  <div class="otherType" v-if="item2.detail.status == 1">已确认</div>
                  <div class="otherType" v-if="item2.detail.status == 0">待确认</div>
                </div>
                <div v-if="item2.flag == 4">
                  <div class="otherType" v-if="item2.state == 4">已取消</div>
                  <div class="otherType" v-if="item2.state == 3">已完成</div>
                  <div class="otherType" v-if="item2.state == 2">已发货</div>
                  <div class="otherType" v-if="item2.state == 1">已确认</div>
                  <div class="otherType" v-if="item2.state == 0">待确认</div>
                </div>
              </div>
              <!--      影片-->
              <div class="filmBox" v-for="(item3, index3) in item2.flag == 4 ? item2.content : item2.detail.product"
                :key="index3" style="margin-bottom: 5px">
                <div class="film">
                  <div class="filmImg">
                    <img class="img" :src="item2.flag == 4 ? item3.product.image_path : item3.image_path" alt="">
                  </div>
                  <div class="rightBox">
                    <div class="filmName">{{ item2.flag == 4 ? item3.product.title : item3.product_name }}</div>
                    <div class="startTime textBox" style="margin-top: 0px">{{
                      item2.flag == 4 ? item3.xinghao.name : item3.spec_name }}</div>
                  </div>
                </div>
              </div>


            </div>
            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共{{ item.allNum }}件商品</div>
              <div>
                总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{
                  item.order.zongji ? item.order.zongji : (item.allPrice).toFixed(2)
                }}</span><span class="first">元</span>
              </div>
            </div>
            <!--          <div class="button">-->
            <!--            <div class="cancel">删除订单</div>-->
            <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
            <!--          </div>-->
          </div>
          <!--      电子券-->
          <div class="listItem" @click="toCouponDetail(item.order.id)"
            v-if="(item.order.ord_bs ? item.order.ord_bs == 5 : true) && item.order.flag == 2">
            <div class="orderNo">
              <div class="orderNum orderTime">订单号:{{ item.order.order_no }}</div>
              <!--    订单状态-->
              <div>
                <!--          <div class="time">支付剩余时间 10:25</div>-->
                <!--                    <div class="otherType">已取消</div>-->
                <div class="otherType">已完成</div>
                <!--                    <div class="otherType">待使用</div>-->
              </div>
            </div>
            <!--      影片-->
            <div class="filmBox" v-if="item.coupons">
              <div class="film">
                <div class="filmImg cardImg">
                  <img class="img" style="height: auto;" :src="item.coupons.img" alt="">
                </div>
                <div class="rightBox">
                  <div class="filmName">{{ item.coupons.title }}</div>
                  <!-- 电子订单
                   <div class="startTime textBox" style="margin-top: 0px">
                    有效期：至{{ timestampToTime2(item.coupons.end_time) }}
                  </div> -->
                </div>
              </div>
            </div>
            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共1件商品</div>
              <div>
                总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{ Number(item.order.zongji).toFixed(2)
                }}</span><span class="first">元</span>
              </div>
            </div>
            <div class="button">
              <div class="cancel">查看详情</div>
              <!--          <div class="cancel toPay">去支付</div>-->
            </div>
          </div>
        </div>
        <div v-else>
          <div class="listItem2" v-if="item.ord_bs == 5 && item.flag == 3" @click="toDetail(item.id)">
            <div class="orderNo">
              <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
              <!--    订单状态-->
              <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
              <div v-if="item.flag == 3">
                <div class="otherType" v-if="item.detail.status == 3">已取消</div>
                <div class="otherType" v-if="item.detail.status == 2">已完成</div>
                <div class="otherType" v-if="item.detail.status == 1">已确认</div>
                <div class="otherType" v-if="item.detail.status == 0">待确认</div>
              </div>
              <div v-if="item.flag == 4">
                <div class="otherType" v-if="item.state == 4">已取消</div>
                <div class="otherType" v-if="item.state == 3">已完成</div>
                <div class="otherType" v-if="item.state == 2">已发货</div>
                <div class="otherType" v-if="item.state == 1">已确认</div>
                <div class="otherType" v-if="item.state == 0">待确认</div>
              </div>
            </div>
            <!--      影片-->
            <div class="filmBox" v-for="(item3, index3) in item.flag == 4 ? item.content : item.detail.product"
              :key="index3" style="margin-bottom: 5px">
              <div class="film">
                <div class="filmImg">
                  <img class="img" :src="item.flag == 4 ? item3.product.image_path : item3.image_path" alt="">
                </div>
                <div class="rightBox">
                  <div class="filmName">{{ item.flag == 4 ? item3.product.title : item3.product_name }}</div>
                  <div class="startTime textBox" style="margin-top: 0px">{{
                    item.flag == 4 ? item3.xinghao.name : item3.spec_name }}</div>
                </div>
              </div>
            </div>

            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共{{ item.detail.product.length }}件商品</div>
              <div>
                总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{ item.flag == 4 ? item.order.zongji :
                  item.detail.final_amount
                  }}</span><span class="first">元</span>
              </div>
            </div>
            <!--          <div class="button">-->
            <!--            <div class="cancel">删除订单</div>-->
            <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
            <!--          </div>-->
          </div>
        </div>
        <!--        图书-->
        <div class="listItem" v-if="item.ord_bs == 6" @click="toBookOrder(item.id)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.ordersn }}</div>
            <!--    订单状态-->
            <div>
              <div class="otherType" v-if="item.state == 0">待发货</div>
              <div class="otherType" v-if="item.state == 1">待发货</div>
              <div class="otherType" v-if="item.state == 2">已发货</div>
              <div class="otherType" v-if="item.state == 3">处理中</div>
              <div class="otherType" v-if="item.state == 4">已取消</div>
              <div class="otherType" v-if="item.state == 5">己完成</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox" v-for="item2 in item.info_list" :key="item.id">
            <div class="film">
              <div class="filmImg cardImg">
                <img class="img" :src="item2.img" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{ item2.name }}</div>
                <!--              <div class="startTime textBox" style="margin-top: 0px">6英寸</div>-->
              </div>
            </div>
          </div>
          <!--      价格-->
          <div class="priceBox">
            <div>共{{ item.info_list.length }}件商品</div>
            <div>
              总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{ item.havepay }}</span><span
                class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">查看详情</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>
        <div class="listItem" v-if="item.ord_bs == 7" @click="toPerOrder(item.id)">
          <div class="orderNo">
            <div class="orderNum">订单号: <span>{{ item.order_id }}</span></div>
            <!--    订单状态-->
            <div>
              <div class="otherType" v-if="item.orderstatus == 'N'">待支付</div>
              <div class="otherType" v-if="item.orderstatus == 'C'">已取消</div>
              <div class="otherType" v-if="item.orderstatus == 'P'">已付款</div>
              <div class="otherType" v-if="item.orderstatus == 'T'">已通知主办方，等待处理</div>
              <div class="otherType" v-if="item.orderstatus == 'D'">等待发货</div>
              <div class="otherType" v-if="item.orderstatus == 'DE'">已发货</div>
              <div class="otherType" v-if="item.orderstatus == 'S'">出票成功</div>
              <div class="otherType" v-if="item.orderstatus == 'R'">退款完成</div>
              <div class="otherType" v-if="item.orderstatus == 'E'">订单已过期</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox">
            <div class="film" style="width: 100%;">
              <div class="filmImg">
                <img class="img" :src="item.img" alt="">
              </div>
              <div class="rightBox" style="width: 70%;display: block">
                <div class="filmName">{{ item.title }}</div>
                <div class="startTime" style="margin-top: 7px">{{ item.dateDesc }}</div>
                <div class="startTime textBox" style="margin-top: 7px">{{ item.venuesname }}</div>
                <div class="topayBox">
                  <div class="seat textBox" style="margin-top: 20px;">
                    <span style="color: #CA5678">￥</span><span style="color: #CA5678;font-size: 15px">{{ item.total
                    }}</span>
                    <span> / 共{{ item.quantity }}张</span>
                  </div>
                  <div class="btnBox" v-if="item.orderstatus == 'N'">
                    <van-button class="btnno2" type="danger" @click.stop="toPay(item.id)">去支付</van-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        直充-->
        <div class="listItem" v-if="item.ord_bs == 8" @click="toChargeDetail(item.id)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
            <!--    订单状态-->
            <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
            <div>
              <div class="otherType" v-if="item.state == 1">已失败</div>
              <div class="otherType" v-if="item.state == 2">已完成</div>
              <div class="otherType" v-if="item.state == 3">已取消</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox" style="margin-bottom: 5px" v-if="item.product">
            <div class="film">
              <div class="filmImg">
                <img class="img" :src="item.brand.img" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{ item.product.title }}</div>
                <div class="startTime textBox" style="margin-top: 0px">{{ item.product.name }}</div>
              </div>
            </div>
          </div>

          <!--      价格-->
          <div class="priceBox" style="margin-top: 3px">
            <div>共{{ item.number }}个</div>
            <div>
              总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{ item.total_fee }}</span><span
                class="first">元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderList",
  props: {
    orderList: [Object, Array],
  },
  data() {
    return {
      hsjd: require('@/assets/menpiao/hsjd.png'),
      prouctList: this.orderList,
    }
  },
  methods: {
    toPay(id) {
      sessionStorage.removeItem("typesId")
      sessionStorage.removeItem("address")
      sessionStorage.removeItem("resultMoviegoer")
      sessionStorage.removeItem("StoreName")
      window.location.href = this.$store.state.perUrl + "/paymentpage?id=" + id
    },
    toPerOrder(id) {
      window.location.href = this.$store.state.perUrl + "/orderpage?id=" + id
    },
    toBookOrder(id) {
      window.location.href = this.$store.state.bookUrl + "/cakeOrderDetail?id=" + id
    },
    toScenicOrder(id) {
      window.location.href = this.$store.state.scenicUrl + "/orderpage?id=" + id
    },
    toDetail(id) {
      window.location.href = this.$store.state.cakeUrl + "/cakeOrderDetail?id=" + id
    },
    toCouponDetail(id) {
      window.location.href = this.$store.state.cakeUrl + "/couPonOrderDetail?id=" + id
    },
    toChargeDetail(id) {
      window.location.href = this.$store.state.cakeUrl + "/directChargeOrder?id=" + id
    },
    gopay(id) {
      //   this.$router.push({path: "/paymentpage", query: {order: id, change: 0}})
    },
    tomoveOrder(id) {
      //   this.$router.push({path: "/orderpage", query: {id}})
      //
      window.location.href = this.$store.state.base + "/orderpage?id=" + id + "&token=" + localStorage.getItem("token")
    },
    tocardOrder(id) {
      window.location.href = this.$store.state.base + "/cardorderinfo?id=" + id + "&token=" + localStorage.getItem("token")
    },
    toorderOrder(id, pf, storeId, type) {
      this.$router.push({ path: "/orderOrderDetail", query: { id, pf, storeId, type } })
    },

    toShopOrder(id) {
      this.$router.push({ path: "/orderDetail", query: { id } })
    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    timestampToTime2(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d
    },
    change() {
      this.prouctList.forEach((item, index) => {
        item.allPrice = 0
        item.allNum = 0
        if (item.order) {
          if ((item.order.ord_bs ? item.order.ord_bs == 5 : true) && item.order.flag == 3) {
            if (item.order_list) {
              item.order_list.forEach((item2, index2) => {
                if (item.order.id == item2.order_id && item2.dg_final_amount) {
                  item.allPrice += Number(item2.dg_final_amount)
                  item.allNum += item2.detail.number
                }

              })
            }
          }
          if (item.order_list) {
            item.order_list.forEach((item2, index2) => {
              item2.content.forEach(item3 => {
                if (item.order.id == item2.order_id && item2.flag == 4) {
                  item.allPrice += (Number(item3.xinghao.price) * Number(item3.quantity))
                  item.allNum += Number(item3.quantity)
                }
              })
            })
          }
        }
      })
    }
  },
  created() {
    this.change()
  },
  watch: {
    orderList(item1, item2) {
      // item1为新值，item2为旧值
      this.prouctList = item1
      this.change()
    },
    prouctList(val) {
      if (this.orderList !== val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped lang="less">
.pageMax {
  padding: 0px 10px 15px;
}

.listItem {
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 15px 18px 10px;
  // jingqu

  .reserve {
    font-size: 12px;

    .circles {
      background-color: #eae7e8;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
    }

    .clr_2 {
      color: #222222;
    }

    background-color: #ffffff;
    // margin-top: 10px;
    // padding:4px 10px;
    display: inline-block;
    // border-radius: 60px;
    color: #555555;

  }

  .flex_box {
    background-color: #ffffff;
    border-top: 1px solid #f1f1f1;
    margin-top: 8px;
    padding-top: 8px;
    // padding: 10px;
    // margin-top: 10px;
    // border-radius: 10px;

    // .stutas{
    //   font-size: 14px;
    // }
    .flex_top {
      font-size: 12px;
      color: #222222;
      display: flex;
      justify-content: space-between;

      .img {
        width: 16px;
        height: 12px;
        margin-right: 4px;
      }

      .flex-bet {
        display: flex;
        align-items: center;
      }
    }

    .flex_center {
      .cl0 {
        color: #000;
      }

      margin-top: 10px;
      color: #575757;

      .fs12 {
        font-size: 12px;
      }

      .ml18 {
        margin-left: 10px;
      }

      display: flex;
      font-size: 14px;
      justify-content: space-between;

      .mt10 {
        margin-top: 6px;
        font-size: 12px;
      }

      .prices {
        color: #f44;
        font-weight: 500;

        .fs10 {
          font-size: 10px;
        }
      }
    }
  }

  //jignqu
  //订单号
  .orderNo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .orderNum {
      font-size: 12px;
      color: #878787;
      font-weight: bold;
    }

    .time {
      font-size: 13px;
      font-weight: bold;
      color: #EE3F45;
      white-space: nowrap;
    }

    .otherType {
      font-size: 14px;
      font-weight: bold;
      color: #B6B6B6;
    }
  }

  //  影片
  .filmBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .film {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 78%;

      .filmImg {
        width: 73px;
        border-radius: 3px;
        overflow: hidden;
      }

      .rightBox {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 65%;
      }

      .filmName {
        font-size: 14px;
        font-weight: bold;
        margin-top: -10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
        /* 显示两行 */
      }

      .startTime {
        font-size: 12px;
        color: #818080;
      }

      .seat {
        //display: flex;
        //align-items: center;
        //gap: 4px;
        font-size: 12px;
        color: #818080;
        white-space: nowrap;
        margin-left: -4px;
      }

      .seat span {
        padding-left: 4px;
      }
    }

    .btnBox {
      min-width: 56px;
    }

    .btnno {
      background-color: #ED3036 !important;
      border-radius: 30px !important;
      width: 100%;
      height: 28px !important;
      line-height: 27px !important;
      margin-top: 10px;
      font-size: 12px;
      white-space: nowrap;
      padding: 0;
    }
  }

  //  价格
  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #818080;
    margin-top: 8px;

    .priceNum {
      color: #EF4E53;
      font-weight: bold;
      font-size: 17px;
    }

    .first {
      color: #EF4E53;
      font-weight: bold;
    }
  }
}

//卡券
.orderTime {
  color: #767676 !important;
}

.payNum {
  color: #979797;
  font-size: 14px;
}

.cardImg {
  width: 48px !important;
}

.cardImg2 {
  width: 65px !important;
}

.priceBottom {
  border-top: 1px solid #F3F3F3;
  padding-top: 6px !important;
}

.textBox {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #F6F6F6;
  padding-top: 8px;
  margin-top: 5px;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 70px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
  }

  .toPay {
    color: white;
    background-color: #ED3036;
    border: 1px solid #ED3036;
  }
}

.topayBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btnBox {
  min-width: 56px;
}

.btnno2 {
  color: white;
  background-color: transparent !important;
  border: 1px solid transparent !important;
  background-image: linear-gradient(to right, #FD80D6, #FE609F);
  border-radius: 30px !important;
  width: 100%;
  height: 28px !important;
  line-height: 27px !important;
  font-size: 12px;
  white-space: nowrap;
  padding: 0px 6px;
  box-sizing: content-box;
}
</style>