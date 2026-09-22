import setaxios from "@/utils/setaxios";

// 获取永辉免密登录URL（form-data格式，无参数）

export function getYonghuiLoginUrl(data) {
    return setaxios.post("/h5/yonghuicaishi/login", {
         
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

 
 
// 创建永辉订单(外部调用)
export function createYonghuiOrder(data) {
    return setaxios.post("/h5/yonghuicaishi/createOrder", data)
        
}