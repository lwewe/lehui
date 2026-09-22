import setaxios from "@/utils/setaxios";

// 获取酒店免密登录URL（form-data格式，无参数）
export function getJiudianLoginUrl(data) {
    return setaxios.post("/zhanfuma/jiudian/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建酒店订单/回调(外部调用，raw-json格式)
export function createJiudianOrder(data) {
    return setaxios.post("/zhanfuma/jiudian/createOrder", data);
}