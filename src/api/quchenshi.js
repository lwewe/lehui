import setaxios from "@/utils/setaxios";

 export function getQuchenshiLoginUrl(data) {
    return setaxios.post("/zhanfuma/quchenshi/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建屈臣氏订单/订单回调(外部调用，raw-json格式)
export function createQuchenshiOrder(data) {
    return setaxios.post("/zhanfuma/quchenshi/createOrder", data);
}