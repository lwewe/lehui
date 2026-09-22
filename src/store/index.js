import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {getLogo} from "@/api/lhcard";
moment.locale('zh-cn');
Vue.use(Vuex)

// 用来存储数据
const state = {
    appkey: "f2385fa1170d818d",
    privatekey: "71e1e4a283292c1f25ba15993a7b8f30",
    timestamp:moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
     
    // baseUrl:"http://image.bjyxfl.com/",
    // baseUrl2:"https://gw.alicdn.com/tfscom/",
    // imgUrl:"https://image.bjyxfl.com/upload/product/",
    token:"",
    uid:"",
    targetId:"",
    cityName:"",
    channel_no:"12358",
    // freea: "http://yxfmm.bjyxfl.com/film/#/securitycards?change=1&token=",
    // base: "http://yxfmm.bjyxfl.com/film/#",
    // cakeUrl:"http://yxfmm.bjyxfl.com/cake/#",
    // scenicUrl:"http://yxfmm.bjyxfl.com/scenic/#",
     
    // bookUrl:"http://yxfmm.bjyxfl.com/book/#",
    // perUrl:"http://yxfmm.bjyxfl.com/performance/#",
     
    kefu:"",
    film:"",
   
    festivals:0
     
}
// 响应组件中的事件
const actions = {
    // 命名可以直接后边加Action
    getUserInfoAction({commit, state}, params) {
        getLogo().then(res => {
            // console.log(res,"kefu")
            if (res.code == 200) {
                commit("changekefu",res.data.zskf)
                localStorage.setItem("kefu",res.data.zskf)
            }
        })
    }

}
// 操作数据
const mutations = {
    settoken(state, token) {
        state.token = token;
    },
    setuid(state, uid){
        state.uid = uid;
    },
    changeTargetId(state, uid){
        state.targetId = uid;
    },
    // changeCityName(state, uid){
    //     state.cityName = uid;
    // },
    changeCityName(state, cityName){
    // 确保存储的是字符串
    if (typeof cityName === 'object' && cityName !== null) {
        state.cityName = cityName.name || '';
    } else if (typeof cityName === 'string') {
        state.cityName = cityName;
    } else {
        state.cityName = '';
    }
    
    // 同时更新 sessionStorage
    sessionStorage.setItem("cityName", state.cityName);
},
    changekefu(state, uid){
        state.kefu = uid;
    },
    changeFilm(state, uid){
        state.film = uid;
    },
}
// 用来将state数据进行加工
const getters = {}
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})
