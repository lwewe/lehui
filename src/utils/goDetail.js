// src/utils/goDetail.js
import { dispatchDetail, registerPlatform } from '@/router/detailRouter';

export function goDetail(item, options) {
  return dispatchDetail(this.$router, item, options);
}

export { registerPlatform };