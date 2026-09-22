import setaxios from "@/utils/setaxios";

// 获取中石油免密登录URL（form-data格式，无参数）
export function getZhongshihuaLoginUrl(data) {
    return setaxios.post("/zhanfuma/zhongshihua/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建中石油订单/回调(外部调用，raw-json格式)
export function createZhongshihuaOrder(data) {
    return setaxios.post("/zhanfuma/zhongshihua/createOrder", data);
}