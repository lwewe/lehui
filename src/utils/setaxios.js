import axios from "axios";
import router from "@/router";
import toast from "vant/lib/toast";
import store from "@/store";
import CryptoJS from 'crypto-js'

const instance = axios.create({
   // baseURL: "/api/v1",
    baseURL: "https://scapi.bjyxfl.com/api/v1",
    headers: {
       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});

// 辅助函数：获取 10 位时间戳
function getTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}

// 辅助函数：生成签名
function generateSign(params) {
    const api_channel_no = params.api_channel_no || store.state.channel_no || "12358";
    const timestamp = params.timestamp || getTimestamp();
    const secretKey = "8687684cae5dad3eb9abc4df686f7313"; 

    const signStr = "api_channel_no" + api_channel_no + "timestamp" + timestamp + secretKey;
    const sha1Result = CryptoJS.SHA1(signStr).toString();
    const sign = CryptoJS.MD5(sha1Result).toString();
    return sign;
}

// 核心请求处理函数
function baseRequest(options) {
    const method = (options.method || 'get').toLowerCase();
    const headers = options.headers || {};
    const token = localStorage.getItem("token") || store.state.token;
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }
    options.headers = headers;

    if (method === 'post') {
        let data = options.data || {};
        if (data instanceof URLSearchParams) {
            const obj = {};
            data.forEach((value, key) => { obj[key] = value; });
            data = obj;
        }

        data.api_channel_no = data.api_channel_no || store.state.channel_no || "12358";
        data.timestamp = data.timestamp || getTimestamp();
        data.sign = data.sign || generateSign(data);

        const finalParams = new URLSearchParams();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                finalParams.append(key, data[key]);
            }
        }
        options.data = finalParams;
    }

    return instance(options).then(res => {
        const data = res.data || {};
        
        if (res.status !== 200) {
            return Promise.resolve({ msg: "请求失败", res, data, code: res.data.code });
        }

        // ✅ 成功
        if (res.status === 200 && res.data.code == 200) {
            return Promise.resolve({
                msg: res.data.msg || "操作成功",
                data: data.data,
                code: res.data.code,
                status: data.status || 200
            });
        } 
        
        // ✅ 新增：拦截 401 未经授权 (Token 失效)
        else if (res.data.code == 401) {
            // 1. 清除失效的 Token
            localStorage.removeItem("token");
            localStorage.removeItem("uid");
            store.commit("settoken", ""); // 如果 store 里也有，顺便清空

            // 2. 如果当前不在登录页，则跳转登录 (防止死循环)
            if (window.location.pathname !== '/login' && window.location.pathname !== '/quickLogin') {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    router.replace("/quickLogin");
                } else {
                    router.replace("/login");
                }
            }
            // 3. 阻止后续代码继续执行，并抛出中断
            return Promise.reject({ msg: res.data.msg || "登录已失效，请重新登录", code: 401 });
        }

        // ✅ 兼容旧版：-1 登录失效
        else if (res.data.code == "-1") {
            if(options.url=="Product/show"){
                return Promise.resolve({ msg: res.data.msg, res, data, code: res.data.code });
            }
            toast(res.data.msg || "请先登录");
            localStorage.removeItem("token");
            localStorage.removeItem("uid");
            store.commit("settoken", "");

            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                router.replace("/quickLogin");
                return true;
            } else {
                router.replace("/login");
                return false;
            }
        } 
        
        // ✅ 其他错误
        else {
            return Promise.resolve({ msg: res.data.msg, res, data, code: res.data.code });
        }
    });
}

const request = ["post", "put", "patch"].reduce((request, method) => {
    request[method] = (url, data = {}, options = {}) => {
        return baseRequest(Object.assign({ url, data, method }, options));
    };
    return request;
}, {});

["get", "delete", "head"].forEach(method => {
    request[method] = (url, params = {}, options = {}) => {
        return baseRequest(Object.assign({ url, params, method }, options));
    };
});

export default request;