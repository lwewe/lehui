import setaxios from "@/utils/setaxios";

// 获取锅圈免密登录URL（form-data格式，无参数）
export function getGuoquanLoginUrl(data) {
    return setaxios.post("/zhanfuma/guoquan/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建锅圈订单(外部调用，raw-json格式)
export function createGuoquanOrder(data) {
    return setaxios.post("/zhanfuma/guoquan/createOrder", data);
}