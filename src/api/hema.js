import setaxios from "@/utils/setaxios";

// 获取盒马免密登录URL（form-data格式，无参数）
export function getHemaLoginUrl(data) {
  return setaxios.post("/zhanfuma/hema/login", {
    // 无参数
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  });
}

// 创建盒马订单/回调（外部调用，raw-json格式）
export function createHemaOrder(data) {
  return setaxios.post("/zhanfuma/hema/createOrder", data);
}