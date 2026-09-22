import setaxios from "@/utils/setaxios";
import store from "@/store";

// 获取微信openid
// export function getopenid(data) {
//     return setaxios.post("/Login/getopenid", {
//         channel_no: store.state.channel_no,
//         ...data
//     });
// }
// 卡券微信支付
export function KaquanWxpay(data) {
    return setaxios.post("/Kaquan/wxpay", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 卡券支付完成后检测
export function KaquanPaySuccess(data) {
    return setaxios.post("/Kaquan/pay_success", {
        channel_no: store.state.channel_no,
        ...data
    });
}
//立即支付-计算卡是否够支付
export function toPay_date(data){
    return setaxios.post("/Kaquan/pay_date",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 福利卡支付
export function getflkpay(data){
    return setaxios.post("/Kaquan/flkpay",{
        channel_no: store.state.channel_no,
        ...data
    })
}