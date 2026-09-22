// src/utils/platform.js

export const PLATFORM = {
  JD: 1,        // 京东系（京东/自营/京造用 jd_type 细分）
  TMALL: 2,     // 天猫
  JINGZAO: 3,   // 京造（预留，无数据勿用）
  HEMA: 4,      // 盒马
  FLOWER: 5,    // 鲜花
  TUHU: 12,      // 途虎
  SUPPLIER: 7   // 供应商
};

export const JD_TYPE = {
  NORMAL: 1,    // 京东
  SELF: 2,      // 京东自营
  JINGZAO: 3    // 京东京造
};

const PLATFORM_NAME_MAP = {
  [PLATFORM.JD]: '京东',
  [PLATFORM.TMALL]: '天猫',
  [PLATFORM.JINGZAO]: '京造',       // ⚠️ 预留字段，一般无数据
  [PLATFORM.HEMA]: '盒马',
  [PLATFORM.FLOWER]: '鲜花',
  [PLATFORM.TUHU]: '途虎养车',
  [PLATFORM.SUPPLIER]: '供应商'
};

const JD_TYPE_NAME_MAP = {
  [JD_TYPE.NORMAL]: '京东',
  [JD_TYPE.SELF]: '京东自营',
  [JD_TYPE.JINGZAO]: '京东京造'
};

/**
 * 根据平台标识获取平台名称
 * @param {number|string} platform
 * @param {number|string} [jdType] - 京东子类型（platform=1 时生效）
 * @returns {string}
 */
export function getPlatformName(platform, jdType) {
  const p = Number(platform);

  // 京东系：按 jd_type 细分
  if (p === PLATFORM.JD) {
    const t = Number(jdType);
    return JD_TYPE_NAME_MAP[t] || '京东';
  }

  return PLATFORM_NAME_MAP[p] || '';
}