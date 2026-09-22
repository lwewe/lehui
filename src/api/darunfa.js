import setaxios from "@/utils/setaxios";

// 获取大润发免密登录URL（form-data格式，无参数）
export function getDarunfaLoginUrl(data) {
    return setaxios.post("/zhanfuma/darunfa/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}