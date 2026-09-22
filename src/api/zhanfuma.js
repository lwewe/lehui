// src/api/zhanfuma.js
import setaxios from "@/utils/setaxios";
import store from "@/store";

// ✅ 获取订单信息（zhanfuma/order）
export function getZhanfumaOrderInfo(data) {
    return setaxios.post("/zhanfuma/order", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 福利卡列表
export function getZhanfumaCardList(data) {
    return setaxios.post("/zhanfuma/getcardlist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 计算支付金额
export function calculateZhanfumaPayment(data) {
    return setaxios.post("/zhanfuma/pay_date", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 卡支付
export function payZhanfumaByCard(data) {
    return setaxios.post("/zhanfuma/flkpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 微信支付
export function payZhanfumaByWechat(data) {
    return setaxios.post("/zhanfuma/wxpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 支付完成回调
export function zhanfumaPaySuccess(data) {
    return setaxios.post("/zhanfuma/pay_success", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}