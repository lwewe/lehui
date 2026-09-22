import setaxios from "@/utils/setaxios";

// 1. 获取途虎入口配置
export function tuhuGetConfig(data = {}) {
  return setaxios.post("/laipiao/tuhuGetConfig", data);
}

// 2. 途虎商品列表
export function tuhuProducts(data = {}) {
  return setaxios.post("/laipiao/tuhuProducts", {
    product_name: "",
    page: 1,
    page_size: 20,
    ...data
  });
}

// 3. 途虎下单（本地落单待支付）
export function tuhuCreateOrder(data) {
  return setaxios.post("/laipiao/tuhuCreateOrder", {
    item_id: data.item_id,
    uuid: data.uuid,
    amount: 1
  });
}

// 4. 途虎订单列表
export function tuhuOrderList(data = {}) {
  return setaxios.post("/laipiao/tuhuOrderList", {
    state: "",
    page: 1,
    limit: 10,
    ...data
  });
}

// 5. 途虎订单详情
export function tuhuOrderDetail(order_id) {
  return setaxios.post("/laipiao/tuhuOrderDetail", { order_id });
}

// 6. 途虎支付预计算
export function tuhuPrePay(data = {}) {
  return setaxios.post("/laipiao/tuhuPrePay", data);
}

// 7. 途虎福利卡支付（纯卡，需支付密码）
export function tuhuPayByCard(data) {
  return setaxios.post("/laipiao/tuhuPayByCard", {
    order_id: data.order_id,
    pay_pass: data.pay_pass,
    card_num_ids: data.card_num_ids || ""
  });
}

// 8. 途虎微信支付（先扣卡 + 差额微信）
export function tuhuWxPay(data) {
  return setaxios.post("/laipiao/tuhuWxPay", {
    order_id: data.order_id,
    openid: data.openid,
    use_card: data.use_card !== undefined ? data.use_card : 1,
    card_num_ids: data.card_num_ids || ""
  });
}