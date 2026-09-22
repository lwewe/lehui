import setaxios from "@/utils/setaxios";

// 获取山姆免密登录URL（form-data格式，无参数）
export function getShanmuLoginUrl(data) {
    return setaxios.post("/zhanfuma/shanmu/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 创建山姆订单/回调(外部调用，raw-json格式)
export function createShanmuOrder(data) {
    return setaxios.post("/zhanfuma/shanmu/createOrder", data);
}