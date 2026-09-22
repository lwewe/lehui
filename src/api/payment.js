// src/api/payment.js
import setaxios from "@/utils/setaxios";
import store from "@/store";

// 订单结算信息
export function getOrderInfo(data) {
    return setaxios.post("/h5/order", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 订单详情
export function getOrderDetail(data) {
    return setaxios.post("/h5/order_detail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 福利卡列表
export function getCardList(data) {
    return setaxios.post("/h5/getcardlist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 计算卡是否够支付
export function calculatePayment(data) {
    return setaxios.post("/h5/pay_date", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 卡支付
export function payByCard(data) {
    return setaxios.post("/h5/flkpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 微信支付
export function payByWechat(data) {
    return setaxios.post("/h5/wxpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 支付完成回调
export function paySuccess(data) {
    return setaxios.post("/h5/pay_success", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}