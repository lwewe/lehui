import setaxios from "@/utils/setaxios";

// ============ 美团外卖相关接口 ============

// 获取免密登录URL（form-data格式，无参数）
export function getMeituanLoginUrl() {
    return setaxios.post("/h5/meituan/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}