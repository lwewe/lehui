// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";

//首页  轮播图
export function getIndexList() {
    return setaxios.post("/index/index", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
    });
}

export function onlineBrand() {
    return setaxios.post("/index/onlineBrand", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
    });
}

//卡
export function CardNucard(data) {
    return setaxios.post("/card/nucard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}


export function CardLists(data) {
    return setaxios.post("/card/lists", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

export function Delcard(data) {
    return setaxios.post("/card/delcard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function CheckmerGecards(data) {
    return setaxios.post("/card/checkmergecards", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

export function MerGecards(data) {
    return setaxios.post("/card/mergecards", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function CardShow(data) {
    return setaxios.post("/card/show", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function CardConsume(data) {
    return setaxios.post("/card/consume", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function CardRecharge(data) {
    return setaxios.post("/card/recharge", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function CardChongzhi(data) {
    return setaxios.post("/card/chongzhi", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

export function cxpay_success(data) {
    return setaxios.post("card/cxpay_success", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
export function czwxpay(data) {
    return setaxios.post("card/czwxpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
export function getLogo(data) {
    return setaxios.post("/login/index", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

 
export function single(data) {
    return setaxios.post("/login/privacy", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}




export function AddBinding(data) {
    return setaxios.post("/card/addbinding", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 获取微信签名配置
export function bindingcard(data) {
    return setaxios.post("/card/bindingcard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 扫码后的绑定操作
export function qrcodeBinging(data) {
    return setaxios.post("/card/qrcodeBinding", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

export function scanbinding(data) {
    return setaxios.post("/card/scanbinding", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

export function getWechat(data) {
    return setaxios.post("/login/getWechat", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}