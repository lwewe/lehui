import setaxios from "@/utils/setaxios";

// 获取打车免密登录URL（form-data格式，无参数）
export function getDacheLoginUrl(data) {
  return setaxios.post("/zhanfuma/dache/login", {
    // 无参数
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  });
}

// 创建打车订单/回调（外部调用，raw-json格式）
export function createDacheOrder(data) {
  return setaxios.post("/zhanfuma/dache/createOrder", data);
}