import setaxios from "@/utils/setaxios";

// ============ 美团到店(美食团购)相关接口 ============

// 获取免密登录URL（form-data格式，无参数）
export function getTuangouLoginUrl() {
    return setaxios.post("/h5/tuangou/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}