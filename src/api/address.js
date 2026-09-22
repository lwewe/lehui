import setaxios from "@/utils/setaxios";
import store from "@/store";

//省
export function getScprovince() {
    return setaxios.post("/Personal/scprovince", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token")
    });
}
// 市
export function getSccity(data) {
    return setaxios.post("/Personal/sccity", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 县/区
export function getSccounty(data) {
    return setaxios.post("/Personal/sccounty", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 镇/街道
export function getSctown(data) {
    return setaxios.post("/Personal/sctown", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 地址列表
export function getScaddress(data) {
    return setaxios.post("Personal/scaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 添加地址
export function addscaddress(data) {
    return setaxios.post("Personal/addscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 查看收货地址
export function showscaddress(data) {
    return setaxios.post("Personal/showscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 修改地址
export function editscaddress(data) {
    return setaxios.post("Personal/editscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 删除收货地址
export function delscaddress(data) {
    return setaxios.post("Personal/delscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 设置默认收货地址
export function mrscaddress(data) {
    return setaxios.post("Personal/mrscaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}