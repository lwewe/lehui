import setaxios from "@/utils/setaxios";

// 获取饿了么免密登录URL（form-data格式，无参数）
export function getElemaLoginUrl(data) {
    return setaxios.post("/h5/elema/login", {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建饿了么订单(外部调用)
export function createElemaOrder(data) {
    return setaxios.post("/h5/elema/createOrder", data)
}