// src/router/detailRouter.js

// ============ 平台常量 ============
export const PLATFORM = {
  JD: 1,
  TMALL: 2,
  JINGZAO: 3,
  HEMA: 4,
  FLOWER: 5,
  SUPPLIER: 7,
  TUHU: 12,
  MOVIE: 20,
  FLIGHT: 21,
};

// ============ 每个平台的处理器 ============
const detailHandlers = {
  // 京东系
  [PLATFORM.JD]: (item) => ({
    type: 'router',
    path: '/productDetail',
    query: { id: item.id, platform: item.platform, jd_type: item.jd_type },
  }),

  // 天猫
  [PLATFORM.TMALL]: (item) => ({
    type: 'router',
    path: '/productDetail',
    query: { id: item.id, platform: item.platform },
  }),

  // 京造
  [PLATFORM.JINGZAO]: (item) => ({
    type: 'router',
    path: '/productDetail',
    query: { id: item.id, platform: item.platform },
  }),

  // 盒马 → 用 product_id
  [PLATFORM.HEMA]: (item) => ({
    type: 'router',
    path: '/HemaDetail',
    query: {
      id: item.product_id || item.id,
      platform: item.platform,
      hema_type: item.hema_type,
    },
  }),

  // 鲜花 → 用 product_id
  [PLATFORM.FLOWER]: (item) => ({
    type: 'router',
    path: '/FlowerDetail',
    query: {
      id: item.product_id || item.id,
      platform: item.platform,
    },
  }),

  // 供应商
  [PLATFORM.SUPPLIER]: (item) => ({
    type: 'router',
    path: '/productDetail',
    query: { id: item.id, platform: item.platform },
  }),

  // 途虎：暂无详情页
  // [PLATFORM.TUHU]: (item) => ({ ... }),
};

// ============ 兜底 ============
const fallbackHandler = (item) => ({
  type: 'router',
  path: '/productDetail',
  query: { id: item.id || item.product_id, platform: item.platform },
});

// ============ 统一跳转入口 ============
export async function dispatchDetail(router, item, options = {}) {
  if (!item || (!item.id && !item.product_id)) {
    console.warn('[goDetail] 缺少 id 或 product_id', item);
    return;
  }

  const platform = Number(item.platform || item.source || 0);
  const handler = detailHandlers[platform] || fallbackHandler;

  let result;
  try {
    result = await handler(item, options);
  } catch (e) {
    console.error('[goDetail] handler 执行失败', e);
    return;
  }

  if (!result) return;

  if (result.query && options.extraQuery) {
    result.query = { ...result.query, ...options.extraQuery };
  }

  switch (result.type) {
    case 'router':
      router.push({ path: result.path, query: result.query });
      break;
    case 'replace':
      router.replace({ path: result.path, query: result.query });
      break;
    case 'url':
      window.location.href = result.url;
      break;
    case 'async':
      if (typeof result.handler === 'function') {
        const inner = await result.handler(options.api);
        if (inner) {
          await dispatchDetail(router, { ...item, ...inner }, options);
        }
      }
      break;
    default:
      console.warn('[goDetail] 未知 type', result.type);
  }
}

export function registerPlatform(platform, handler) {
  detailHandlers[Number(platform)] = handler;
}