import setaxios from "@/utils/setaxios";

// ============ 聚合商超相关接口 ============

// 获取免密登录URL（form-data格式，无参数）
// 注意：返回的是 data.jdUrl，不是 data.h5Url
export function getJuheShangchaoLoginUrl() {
    return setaxios.post("/h5/juheshangchao/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}