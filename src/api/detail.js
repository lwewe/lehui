
import setaxios from "@/utils/setaxios";
import store from "@/store";
//商品详细页
export function getProductDetail(data) {
    return setaxios.post("Product/show", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 选择地址检查限制
export function selscaddress(data) {
    return setaxios.post("Product/selscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data,
    },{noLogin:false});
}
// 添加购物车
export function addCart(data) {
    return setaxios.post("Shop/add_cart", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 卡/充值商品详情页
export function cartDetailed(data) {
    return setaxios.post("Product/detailed", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}