import setaxios from "@/utils/setaxios";

// ============ 美团小象超市相关接口 ============

// 获取免密登录URL（form-data格式，无参数）
export function getXiaoxiangLoginUrl() {
    return setaxios.post("/h5/xiaoxiang/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}