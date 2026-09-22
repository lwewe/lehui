import setaxios from "@/utils/setaxios";

// 获取物美展码付免密URL（form-data格式，无参数）
export function getWumeiLoginUrl(data) {
    return setaxios.post("/zhanfuma/wumei/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 查询用户信息(外部调用，raw-json格式)
export function queryWumeiUrl(data) {
    return setaxios.post("/zhanfuma/wumei/queryUrl", data);
}

// 创建订单/订单回调(外部调用，raw-json格式)
export function createWumeiOrder(data) {
    return setaxios.post("/zhanfuma/wumei/createOrder", data);
}