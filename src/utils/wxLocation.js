import wx from 'weixin-js-sdk'
import BMap from 'BMap'
import { getLocations } from '@/api/mine'

export function getWxLocation() {
  return new Promise((resolve, reject) => {
    // 不是微信环境，直接 reject，让调用方走降级
    const ua = window.navigator.userAgent.toLowerCase()
    if (!ua.match(/MicroMessenger/i)) {
      reject(new Error('not wechat'))
      return
    }

    // iOS 用 scanUrl，安卓用当前 URL（这段是从 City.vue 抄的，别改）
    const purl = /(Android)/i.test(navigator.userAgent)
      ? location.href.split('#')[0]
      : window.localStorage.getItem('scanUrl')

    getLocations({ url: purl }).then(res => {
      if (res.code !== 200) {
        reject(new Error('get sign fail'))
        return
      }
      const info = res.data

      wx.config({
        debug: false,
        appId: info.appid,
        timestamp: '' + info.time,
        nonceStr: info.nonceStr,
        signature: info.signature,
        jsApiList: ['getLocation']
      })

      wx.ready(() => {
        wx.getLocation({
          type: 'wgs84',
          success: (loc) => {
            // 逆地理编码拿城市名，顺便把经纬度一起 resolve
            const point = new BMap.Point(loc.longitude, loc.latitude)
            const geoc = new BMap.Geocoder()
            geoc.getLocation(point, (rs) => {
              const city = rs && rs.addressComponents ? rs.addressComponents.city : ''
              resolve({
                latitude: loc.latitude,
                longitude: loc.longitude,
                city: city
              })
            })
          },
          fail: (err) => reject(err)
        })
      })

      wx.error((err) => reject(err))
    }).catch(reject)
  })
}