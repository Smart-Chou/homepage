// 全局状态管理
const STORAGE_KEY = "homepage-data";

// 从 localStorage 读取持久化配置
function loadPersistent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// 创建全局状态对象
window.__STATE__ = {
  // 壁纸加载状态
  imgLoadStatus: false,
  // 当前窗口宽度
  innerWidth: window.innerWidth,
  // 壁纸种类
  coverType: loadPersistent().coverType || "0",
  // 建站日期显示
  siteStartShow: loadPersistent().siteStartShow || false,
  // 壁纸展示状态
  backgroundShow: false,
  // 盒子开启状态
  boxOpenState: false,
  // 移动端开启状态
  mobileOpenState: false,
  // 移动端功能区开启状态
  mobileFuncState: false,
  // 设置页面开启状态
  setOpenState: false,
  // 底栏模糊
  footerBlur: loadPersistent().footerBlur !== undefined ? loadPersistent().footerBlur : true,
};

// 持久化配置项
window.saveState = function (key, value) {
  window.__STATE__[key] = value;
  const data = loadPersistent();
  data[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// 跨组件事件通信
window.notify = function (eventName, detail) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

// 设置页面宽度
window.setInnerWidth = function (value) {
  window.__STATE__.innerWidth = value;
  if (value >= 720) {
    window.__STATE__.mobileOpenState = false;
    window.__STATE__.mobileFuncState = false;
  }
};

export {};
