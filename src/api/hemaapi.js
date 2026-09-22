import setaxios from "@/utils/setaxios";

// 盒马入口配置
export function hemaGetConfig(data = {}) {
  return setaxios.post("/laipiao/hemaGetConfig", data);
}

// 盒马类目
export function hemaCategoriesList(data = {}) {
  return setaxios.post("/laipiao/hemaCategoriesList", {
    parent_id: "",
    page: 1,
    limit: 50,
    ...data
  });
}

// 盒马商品列表
export function hemaProductsList(data = {}) {
  return setaxios.post("/laipiao/hemaProductsList", {
    keyword: "",
    page: 1,
    limit: 20,
    ...data
  });
}

// 盒马商品详情
export function hemaProductsDetail(data = {}) {
  return setaxios.post("/laipiao/hemaProductsDetail", {
    product_id: "",
    ...data
  });
}

// 盒马行政区域（逐级获取：1 → 省 → 市 → 区 → 街道）
export function hemaAreasList(data = {}) {
  return setaxios.post("/laipiao/hemaAreasList", {
    parent_code: "1",
    ...data
  });
}

// 盒马下单（本地落单待支付）
export function hemaCreateOrder(data = {}) {
  return setaxios.post("/laipiao/hemaCreateOrder", {
    division_code: "",
    town_division_code: "",
    address_detail: "",
    consignee_name: "",
    consignee_phone: "",
    remark: "",
    skus: "[]",
    ...data
  });
}