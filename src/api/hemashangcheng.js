import setaxios from "@/utils/setaxios";

// ============ 盒马相关接口 ============

// 获取免密登录URL（使用form-data格式，无参数）
export function getHemaLoginUrlshangcheng(data) {
    return setaxios.post("/h5/hema/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 用户余额查询(外部调用，raw-json格式)
export function queryHemaPoint(data) {
    return setaxios.post("/h5/hema/queryPoint", {
        userId: data.userId
    });
}