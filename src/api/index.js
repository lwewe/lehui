import setaxios from "@/utils/setaxios";
import store from "@/store";


// 首页-城市列表
export function getCityList() {
    return setaxios.post("/Index/city", {
        channel_no:store.state.channel_no
    });
}
// 首页-城市搜索
export function searchCityList(data) {
    return setaxios.post("/Index/searchcity", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-限时抢购
export function flashSaleList() {
    return setaxios.post("Index/goods", {
        channel_no:store.state.channel_no,
    });
}
// 首页-精选好物
export function getGoodPickList(data) {
    return setaxios.post("Index/jxgoods", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-热门推荐-分类
export function getHotList(data) {
    return setaxios.post("Index/categorygoods", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-限时抢购（4条）
export function getfourSaleList(data) {
    return setaxios.post("Index/flash_sale_low", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-限时抢购
export function getSaleList(data) {
    return setaxios.post("Index/flash_sale", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-热销商品-分类
export function getHotProductClass(data) {
    return setaxios.post("Index/hot_product_class", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-热销商品-产品
export function getHotProductList(data) {
    return setaxios.post("Index/hot_product", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-新品专区
export function getNewProductList(data) {
    return setaxios.post("Index/new_product", {
        channel_no:store.state.channel_no,
        ...data
    });
}
//首页-甄选品牌 品牌列表
export function getNewBrindList(data) {
    return setaxios.post("Index/zxpp", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页-甄选品牌-产品
export function getNewBrindProductList(data) {
    return setaxios.post("Index/zxpp_product", {
        channel_no:store.state.channel_no,
        ...data
    });
}

export function getBrandPickt(data) {
    return setaxios.post("index/brand_pick", {
        channel_no:store.state.channel_no,
        ...data
    });
}

// 精选 -轮播图分类
export function getDetailBannerList(data) {
    return setaxios.post("Index/banner", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 精选 -轮播图分类-产品
export function getTpProductList(data) {
    return setaxios.post("index/tp_product", {
        channel_no:store.state.channel_no,
        ...data
    });
}