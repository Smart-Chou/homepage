// Toast 消息系统（替代 Element Plus ElMessage）

/**
 * 显示 Toast 消息
 * @param {Object|string} options - 消息配置或消息文本
 * @param {string} options.message - 消息内容
 * @param {number} options.duration - 显示时长(ms)，默认 3000
 * @param {boolean} options.grouping - 是否合并同类消息
 * @param {string} options.type - 消息类型
 */
function showMessage(options) {
  if (typeof options === "string") {
    options = { message: options };
  }
  const { message, duration = 3000, grouping = false } = options;

  // 如果开启了 grouping，移除已有的消息
  if (grouping) {
    const existing = document.querySelectorAll(".toast-message");
    existing.forEach((el) => el.remove());
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 24px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 25px;
    color: #efefef;
    font-size: 14px;
    font-family: "HarmonyOS_Regular", sans-serif;
    z-index: 99999;
    white-space: nowrap;
    pointer-events: none;
    animation: toast-in 0.3s ease-out;
  `;
  document.body.appendChild(toast);

  // 自动移除
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Toast 动画
const toastStyle = document.createElement("style");
toastStyle.textContent = `
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(toastStyle);

// 挂载到全局
window.showToast = showMessage;

export { showMessage };
