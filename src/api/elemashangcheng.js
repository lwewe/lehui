import setaxios from "@/utils/setaxios";

// ============ 饿了么(开票版)相关接口 ============

// 获取免密登录URL（form-data格式，经纬度可选）
export function getElemaLoginUrlshangcheng(data) {
    return setaxios.post("/h5/elema/login", {
        longitude: data?.longitude || '',
        latitude: data?.latitude || ''
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}