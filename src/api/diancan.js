import setaxios from "@/utils/setaxios";


// ============ 点餐相关接口 ============

// 点餐首页（获取跳转URL）
export function getDiancanIndex() {
    return setaxios.post("/diancan/index", {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 品牌首页（获取跳转URL）
// brandCode: sbk-星巴克，kfc-肯德基，mcd-麦当劳，lk-瑞幸，cot-库迪，
// pzh-必胜客，tas-塔斯汀，nx-奈雪，chagee-霸王茶姬，dicos-德克士，
// molly-茉莉奶白，guming-古茗
export function getDiancanBrand(data) {
    return setaxios.post("/diancan/brand", {
        brandCode: data.brandCode
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 订单结算信息
// orderCode      易点餐订单号
// customerCode   接入方用户唯一标识
// brandCode      品牌编码
// money          订单金额（单位：分）
// extend         扩展参数
// requestTime    公共参数requestTime（毫秒数时间戳）
// thirdsign      公共参数sign
export function getDiancanCheckout(data) {
    return setaxios.post("/diancan/checkout", {
        orderCode: data.orderCode,
        customerCode: data.customerCode,
        brandCode: data.brandCode,
        money: data.money,
        extend: data.extend,
        requestTime: data.requestTime,
        thirdsign: data.thirdsign
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 福利卡列表
export function getDiancanCardList(data) {
    return setaxios.post("/diancan/getcardlist", data || {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 链接跳转（根据 token 获取跳转地址）
// 对应 GET diancan/url/{token}
export function getDiancanUrl(token) {
    return setaxios.get(`/diancan/url/${token}`);
}



// ============ 点餐订单支付相关接口 ============

// 订单结算信息（点餐订单详情）
// orderCode      易点餐订单号
// customerCode   接入方用户唯一标识
// brandCode      品牌编码
// money          订单金额（单位：分）
// extend         扩展参数
// requestTime    公共参数requestTime（毫秒数时间戳）
// thirdsign      公共参数sign
export function getDiancanOrderDetail(data) {
    return setaxios.post("/diancan/checkout", {
        orderCode: data.orderCode,
        customerCode: data.customerCode,
        brandCode: data.brandCode,
        money: data.money,
        extend: data.extend,
        requestTime: data.requestTime,
        thirdsign: data.thirdsign
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 计算卡是否够支付
// orderCode   订单号
// fulika      福利卡id（多个用逗号拼接，选填）
// price       订单总价（字符串，如 "24.4"）
export function calculateDiancanPay(data) {
    return setaxios.post("/diancan/pay_date", {
        orderCode: data.orderCode,
        fulika: data.fulika,
        price: data.price
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 福利卡支付
// orderCode   订单编码
// ka_ids      福利卡id 多个JSON数组字符串，如 "[307009]"
// pass        支付密码
// price       订单总价
export function payDiancanByCard(data) {
    return setaxios.post("/diancan/flkpay", {
        orderCode: data.orderCode,
        ka_ids: data.ka_ids,
        pass: data.pass,
        price: data.price
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 微信支付
// orderCode   订单编码
// ka_ids      福利卡id json 数组字符串
// openid      微信openid
// price       金额
export function payDiancanByWechat(data) {
    return setaxios.post("/diancan/wxpay", {
        orderCode: data.orderCode,
        ka_ids: data.ka_ids,
        openid: data.openid,
        price: data.price
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}

// 支付完成回调
// order_no    订单号
export function payDiancanSuccess(data) {
    return setaxios.post("/diancan/pay_success", {
        order_no: data.order_no
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}



