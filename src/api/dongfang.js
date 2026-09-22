import setaxios from "@/utils/setaxios";

// 获取东方甄选免密登录URL（form-data格式，无参数）
export function getDongfangLoginUrl(data) {
    return setaxios.post("/zhanfuma/dongfang/login", {
        // 无参数
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}