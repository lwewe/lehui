// 京东天猫商城
import setaxios from "@/utils/setaxios";
import store from "@/store";

// ============ 首页相关 ============
// 首页推荐与活动位数据获取接口
export function home(data) {
    return setaxios.post("/jdtmshop/home", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}


export function getCityList(data) {
    return setaxios.post("/jdtmshop/addressShow", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function hotCity(data) {
    return setaxios.post("/jdtmshop/hotCity", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}



// ============ 商品相关 ============
// 商品分类(树形)
export function categoryList(data) {
    return setaxios.post("/jdtmshop/categoryList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 商品列表
export function productList(data) {
    return setaxios.post("/jdtmshop/productList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function productLists(data) {
    return setaxios.post("/jdtmshop/productList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function productbrands(data) {
    return setaxios.post("/jdtmshop/productList/Product/list", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

// 物流

export function shipLogistics(data) {
    return setaxios.post("/jdtmshop/shipLogistics", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

export function shipTrace(data) {
    return setaxios.post("/jdtmshop/shipTrace", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

export function channelDetail(data) {
    return setaxios.post("/jdtmshop/channelDetail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function channelChildrenDetaill(data) {
    return setaxios.post("/jdtmshop/channelChildrenDetaill", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function ProductBrandList(data) {
    return setaxios.post("/jdtmshop/brandList/Product/brandList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 
 export function ChannelDetail(data) {
    return setaxios.post("/jdtmshop/channelDetail/Channel/detail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

export function channelList(data) {
    return setaxios.post("/jdtmshop/channelList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 商品搜索
export function searchProduct(data) {
    return setaxios.post("/jdtmshop/search", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 商品详情
export function productDetail(data) {
    return setaxios.post("/jdtmshop/productDetail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 品牌列表
export function brandList(data) {
    return setaxios.post("/jdtmshop/brandList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// ============ 购物车相关 ============
// 购物车列表
export function cartList(data) {
    return setaxios.post("/jdtmshop/cartList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 添加购物车
export function cartAdd(data) {
    return setaxios.post("/jdtmshop/cartAdd", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 更新购物车商品数量
export function cartUpdateQuantity(data) {
    return setaxios.post("/jdtmshop/cartUpdateQuantity", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 购物车勾选
export function cartCheck(data) {
    return setaxios.post("/jdtmshop/cartCheck", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 删除购物车商品
export function cartDelete(data) {
    return setaxios.post("/jdtmshop/cartDelete", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 清空已勾选的购物车商品
export function cartClearChecked(data) {
    return setaxios.post("/jdtmshop/cartClearChecked", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 购物车数量
export function cartCount(data) {
    return setaxios.post("/jdtmshop/cartCount", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// ============ 地址相关 ============
// ============ 地址相关 ============
// 地址列表（获取用户已保存的地址列表）
export function addressList(data) {
    return setaxios.post("/jdtmshop/addressList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 地址详情
export function addressDetail(data) {
    return setaxios.post("/jdtmshop/addressDetail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 添加地址
export function addressAdd(data) {
    return setaxios.post("/jdtmshop/addressAdd", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 编辑地址
export function addressEdit(data) {
    return setaxios.post("/jdtmshop/addressEdit", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 删除地址
export function addressDelete(data) {
    return setaxios.post("/jdtmshop/addressDelete", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 设置默认地址
export function addressSetDefault(data) {
    return setaxios.post("/jdtmshop/addressSetDefault", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 省市区联动（id 为父级ID，0返回省份列表）
export function addressShow(data) {
    return setaxios.post("/jdtmshop/addressShow", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

export function cardList(data) {
    return setaxios.post("/jdtmshop/cardList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 福利卡支付
export function payByCard(data) {
  return setaxios.post("/jdtmshop/payByCard", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}


// ============ 订单相关 ============
// 提交订单
export function orderSubmit(data) {
    return setaxios.post("/jdtmshop/orderSubmit", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 立即购买
export function orderBuyNow(data) {
    return setaxios.post("/jdtmshop/orderBuyNow", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 订单列表
export function orderList(data) {
    return setaxios.post("/jdtmshop/orderList", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 订单详情
export function orderDetail(data) {
    return setaxios.post("/jdtmshop/orderDetail", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function orderSettle(data) {
    return setaxios.post("/jdtmshop/orderSettle", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 取消订单
export function orderCancel(data) {
    return setaxios.post("/jdtmshop/orderCancel", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 订单状态数量
export function orderStatusCount(data) {
    return setaxios.post("/jdtmshop/orderStatusCount", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}

// 确认收货
export function orderConfirm(data) {
    return setaxios.post("/jdtmshop/orderConfirm", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
export function editInfo(data) {
    return setaxios.post("/jdtmshop/editInfo", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
 

// 设置/修改支付密码
export function setPayPwd(data) {
  return setaxios.post("/jdtmshop/setPayPwd", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}

// 获取用户信息（判断是否已设支付密码）
export function userInfo(data) {
  return setaxios.post("/jdtmshop/userInfo", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}
export function feedbackClass(data) {
  return setaxios.post("/jdtmshop/feedbackClass", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}

export function feedback(data) {
  return setaxios.post("/jdtmshop/feedback", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}

export function onlineBrand(data) {
  return setaxios.post("/index/onlineBrand", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}


export function logout(data) {
  return setaxios.post("/jdtmshop/logout", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}
//物流
export function shipInfo(data) {
  return setaxios.post("/jdtmshop/shipInfo", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}
export function homeInd(data) {
  return setaxios.post("/jdtmshop/home", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}
export function zoneList(data) {
  return setaxios.post("/jdtmshop/zoneList", {
    channel_no: store.state.channel_no,
    token: localStorage.getItem("token"),
    ...data
  });
}