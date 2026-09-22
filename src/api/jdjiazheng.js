import setaxios from "@/utils/setaxios";

// 获取京东家政免密登录URL（form-data格式，无参数）
export function getJdJiazhengLoginUrl(data) {
    return setaxios.post("/zhanfuma/jdjiazheng/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建京东家政订单/回调(外部调用，raw-json格式)
export function createJdJiazhengOrder(data) {
    return setaxios.post("/zhanfuma/jdjiazheng/createOrder", data);
}