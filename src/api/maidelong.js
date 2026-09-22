import setaxios from "@/utils/setaxios";

// ==================== 麦德龙 ====================

// 获取麦德龙免密登录URL（form-data格式，无参数）
export function getMaidelongLoginUrl(data) {
    return setaxios.post("/zhanfuma/maidelong/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建麦德龙订单/订单回调/消费回调/消费冲正回调(外部调用，raw-json格式)
export function createMaidelongOrder(data) {
    return setaxios.post("/zhanfuma/maidelong/createOrder", data);
}