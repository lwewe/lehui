// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";

export function getUserInfo(data) {
    return setaxios.post("/Member/index", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 修改头像
export function changeAvatar(data) {
    return setaxios.post("/Member/uploadimg", data,{
        header: {
            'Content-Type': 'multipart/form-data',
        }
    });
}
// 结算- 福利卡列表
export function getCardList(data) {
    return setaxios.post("Shop/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 福利卡列表-悦享卡
export function getEnjoyCardList(data) {
    return setaxios.post("Product/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}


// 获取logo
export function getLogo() {
    return setaxios.post("/login/index", {
        channel_no:store.state.channel_no,
    });
}
// 设置
export function getSetting() {
    return setaxios.post("Personal/setting", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
    });
}
// 使用指南
export function getGuide() {
    return setaxios.post("Personal/guide", {
        channel_no:store.state.channel_no,
        // token:localStorage.getItem("token"),
    });
}
// 订单列表
export function getOrderList(data) {
    return setaxios.post("Personal/scorder", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 商城订单详细页
export function getOrderDetail(data) {
    return setaxios.post("Personal/scshow", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

// 订单详细页
// Catering/order
export function getOderdetail(data){
    return setaxios.post("Diancan/show",{
        channel_no:store.state.channel_no,
        ...data
    })
}

export function getOderdetails(data){
    return setaxios.post("WyDiancan/show",{
        channel_no:store.state.channel_no,
        ...data
    })
}
// Catering/order
export function getCateringdetail(data){
    return setaxios.post("Catering/show",{
        channel_no:store.state.channel_no,
        ...data
    })
}
// 收藏/取消收藏店铺
export function addcollect(data) {
    return setaxios.post("Diancan/addcollect", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
//小程序定位
export function getLocations(data) {
    return setaxios.post("Film/getLocation", {
        channel_no: store.state.channel_no,
        ...data
    });
}
