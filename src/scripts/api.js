// API 调用

// 获取一言数据
export async function getHitokoto() {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
}
