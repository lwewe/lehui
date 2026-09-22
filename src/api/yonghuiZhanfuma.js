import setaxios from "@/utils/setaxios";

// 获取永辉展码付免密URL（form-data格式，无参数）
export function getYonghuiZhanfumaLoginUrl(data) {
    return setaxios.post("/zhanfuma/yonghui/login", {
        // 无参数，传空对象
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建永辉展码付订单(外部调用，raw-json格式)
export function createYonghuiZhanfumaOrder(data) {
    return setaxios.post("/zhanfuma/yonghui/createOrder", data);
}