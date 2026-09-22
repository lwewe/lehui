import setaxios from "@/utils/setaxios";

// 1. 获取鲜花平台配置
export function flowerGetConfig(data = {}) {
  return setaxios.post("/laipiao/flowerGetConfig", data);
}

// 2. 鲜花首页聚合
export function flowerHome(data = {}) {
  return setaxios.post("/laipiao/flowerHome", data);
}

// 3. 查询鲜花商品分类
export function flowerClassify(data = {}) {
  return setaxios.post("/laipiao/flowerClassify", data);
}

// 4. 查询鲜花商品列表
export function flowerProducts(data = {}) {
  return setaxios.post("/laipiao/flowerProducts", {
    cate_id: 0,
    product_name: "",
    page: 1,
    limit: 20,
    ...data
  });
}

// 5. 提交鲜花订单
export function flowerSaveOrder(data) {
  return setaxios.post("/laipiao/flowerSaveOrder", data);
}

// 6. 鲜花订单列表
export function flowerOrderList(data = {}) {
  return setaxios.post("/laipiao/flowerOrderList", {
    status: "",
    page: 1,
    limit: 10,
    ...data
  });
}

export function flowerOrderDetail(data) {
  return setaxios.post("/laipiao/flowerOrderDetail", data);
}
// 7. 取消鲜花订单
export function flowerCancelOrder(order_id) {
  return setaxios.post("/laipiao/flowerCancelOrder", { order_id });
}
export function flowerProductDetail(data) {
  return setaxios.post("/laipiao/flowerProductDetail", data);
}
// 8. 根据 product_id 查单条（用列表接口兜底）
export function flowerDetail(product_id) {
  return setaxios.post("/laipiao/flowerProducts", {
    product_name: "",
    page: 1,
    limit: 50
  }).then(res => {
    if (res.code === 200 && res.data && res.data.list) {
      const item = res.data.list.find(
        it => String(it.product_id) === String(product_id)
      );
      return {
        code: 200,
        msg: "获取成功",
        data: item || null
      };
    }
    return res;
  });
}