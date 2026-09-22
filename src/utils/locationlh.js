// src/utils/location.js
import BMap from "BMap";
import wx from "weixin-js-sdk";
import { getLocations } from "@/api/mine";

/**
 * 判断是否在微信浏览器中
 */
export function isWeiXin() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == "micromessenger";
}

/**
 * 获取用户当前位置（统一入口）
 * 优先级：微信定位 > 百度地图定位 > 默认坐标
 */
export function getUserLocation() {
  return new Promise(async (resolve) => {
    console.log('开始获取用户位置...');
    
    // 1. 尝试微信定位
    if (isWeiXin()) {
      console.log('检测到微信环境，尝试微信定位');
      try {
        const wxLocation = await getWechatLocation();
        if (wxLocation) {
          console.log('微信定位成功:', wxLocation);
          resolve(wxLocation);
          return;
        }
      } catch (error) {
        console.warn('微信定位失败，尝试百度定位:', error);
      }
    }
    
    // 2. 尝试百度地图定位
    console.log('尝试百度地图定位');
    try {
      const baiduLocation = await getBaiduLocation();
      if (baiduLocation) {
        console.log('百度定位成功:', baiduLocation);
        resolve(baiduLocation);
        return;
      }
    } catch (error) {
      console.warn('百度定位失败:', error);
    }
    
    // 3. 使用默认坐标（北京）
    console.log('使用默认坐标');
    resolve({
      latitude: "39.923125",
      longitude: "116.382997",
      city: "北京市",
      address: "北京市中心",
      source: 'default'
    });
  });
}

/**
 * 获取微信定位
 */
function getWechatLocation() {
  return new Promise((resolve, reject) => {
    // 先获取微信签名
    getWechatSign().then((configData) => {
      wx.config(configData);
      
      wx.ready(() => {
        wx.getLocation({
          type: 'wgs84', // 使用wgs84坐标
          success: (res) => {
            console.log('微信定位成功:', res);
            
            // 使用百度地图逆地理编码获取城市信息
            getAddressByBaidu(res.longitude, res.latitude).then((addressInfo) => {
              resolve({
                latitude: res.latitude.toString(),
                longitude: res.longitude.toString(),
                city: addressInfo.city || '',
                address: addressInfo.address || '',
                source: 'wechat',
                rawData: res
              });
            }).catch(() => {
              resolve({
                latitude: res.latitude.toString(),
                longitude: res.longitude.toString(),
                city: '',
                address: '',
                source: 'wechat',
                rawData: res
              });
            });
          },
          fail: (error) => {
            console.error('微信定位失败:', error);
            reject(new Error('微信定位失败'));
          },
          cancel: () => {
            console.warn('用户取消微信定位');
            reject(new Error('用户取消微信定位'));
          }
        });
      });
      
      wx.error((error) => {
        console.error('微信SDK配置失败:', error);
        reject(new Error('微信SDK配置失败'));
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 获取微信签名
 */
function getWechatSign() {
  return new Promise((resolve, reject) => {
    const purl = /(Android)/i.test(navigator.userAgent) 
      ? location.href.split('#')[0] 
      : window.localStorage.getItem('scanUrl');
    
    getLocations({
      url: purl
    }).then(res => {
      if (res.code == 200) {
        const configData = {
          debug: false,
          appId: res.data.appid,
          timestamp: "" + res.data.time,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ['getLocation', 'openLocation', 'chooseLocation']
        };
        resolve(configData);
      } else {
        reject(new Error('获取微信签名失败'));
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 获取百度地图定位
 */
function getBaiduLocation() {
  return new Promise((resolve, reject) => {
    if (typeof BMap === 'undefined') {
      reject(new Error('百度地图API未加载'));
      return;
    }
    
    const geolocation = new BMap.Geolocation();
    
    const timeout = setTimeout(() => {
      reject(new Error('百度定位超时'));
    }, 10000);
    
    geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        
        if (position && position.point) {
          console.log('百度定位成功:', position);
          
          // 使用百度地图逆地理编码获取城市信息
          const gc = new BMap.Geocoder();
          gc.getLocation(position.point, (rs) => {
            const addComp = rs.addressComponents || {};
            const address = (addComp.street || '') + (addComp.streetNumber || '');
            
            resolve({
              latitude: position.latitude.toString(),
              longitude: position.longitude.toString(),
              city: addComp.city || '',
              address: address,
              province: addComp.province || '',
              district: addComp.district || '',
              source: 'baidu',
              rawData: position
            });
          });
        } else {
          reject(new Error('百度定位返回数据异常'));
        }
      },
      (error) => {
        clearTimeout(timeout);
        console.error('百度定位失败:', error);
        reject(new Error('百度定位失败'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}

/**
 * 使用百度地图逆地理编码获取地址
 */
export function getAddressByBaidu(longitude, latitude) {
  return new Promise((resolve, reject) => {
    if (typeof BMap === 'undefined') {
      reject(new Error('百度地图API未加载'));
      return;
    }
    
    const point = new BMap.Point(longitude, latitude);
    const geocoder = new BMap.Geocoder();
    
    geocoder.getLocation(point, (rs) => {
      if (rs) {
        const addComp = rs.addressComponents || {};
        const address = (addComp.street || '') + (addComp.streetNumber || '');
        
        resolve({
          address: rs.address || address,
          city: addComp.city || '',
          province: addComp.province || '',
          district: addComp.district || '',
          street: addComp.street || '',
          streetNumber: addComp.streetNumber || ''
        });
      } else {
        reject(new Error('获取地址失败'));
      }
    });
  });
}

/**
 * 保存定位信息到 sessionStorage
 */
export function saveLocationToStorage(location) {
  if (location.longitude) {
    sessionStorage.setItem("longitude", location.longitude);
  }
  if (location.latitude) {
    sessionStorage.setItem("latitude", location.latitude);
  }
  if (location.city) {
    sessionStorage.setItem("cityName", location.city);
  }
  if (location.address) {
    sessionStorage.setItem("streetNumber", location.address);
  }
}

/**
 * 从 sessionStorage 获取定位信息
 */
export function getLocationFromStorage() {
  return {
    longitude: sessionStorage.getItem("longitude") || "",
    latitude: sessionStorage.getItem("latitude") || "",
    city: sessionStorage.getItem("cityName") || "",
    address: sessionStorage.getItem("streetNumber") || ""
  };
}