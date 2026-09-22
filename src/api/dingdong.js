
import setaxios from "@/utils/setaxios";


// ============ 叮咚买菜相关接口 ============

// 获取免密登录URL（使用form-data格式，不需要channel_no和token）
export function getDingdongLoginUrl(data) {
    return setaxios.post("/h5/dingdong/login", {
        latitude: data.latitude,
        longitude: data.longitude,
        // 注意：这个接口可能不需要 channel_no 和 token
        // 如果需要可以添加
        // api_channel_no: store.state.channel_no
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建订单(外部调用)
export function createDingdongOrder(data) {
    return setaxios.post("/h5/dingdong/createOrder", data);
}

// 支付状态查询(外部调用)
export function queryDingdongPayStatus(data) {
    return setaxios.post("/h5/dingdong/queryPayStatus", {
        orderNo: data.orderNo,
        tradeNo: data.tradeNo
    });
}

// 订单退款通知(外部调用)
export function dingdongRefundNotify(data) {
    return setaxios.post("/h5/dingdong/refundNotify", {
        refundOrderNo: data.refundOrderNo,
        orderNo: data.orderNo,
        tradeNo: data.tradeNo,
        refundAmount: data.refundAmount,
        tradeTime: data.tradeTime
    });
}

// 退款状态查询
export function queryDingdongRefundStatus(data) {
    return setaxios.post("/h5/dingdong/queryRefundStatus", data);
}