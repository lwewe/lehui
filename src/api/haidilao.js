import setaxios from "@/utils/setaxios";

// 获取海底捞免密登录URL（form-data格式，无参数）
export function getHaidilaoLoginUrl(data) {
    return setaxios.post("/zhanfuma/haidilao/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建海底捞订单/回调(外部调用，raw-json格式)
export function createHaidilaoOrder(data) {
    return setaxios.post("/zhanfuma/haidilao/createOrder", data);
}