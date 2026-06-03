import { useState, useEffect } from 'preact/hooks';

const WEATHER_CACHE_KEY = 'homepage_weather';
const CACHE_DURATION = 30 * 60 * 1000; // 30 min

function getCachedWeather() {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) return null;
    return data.payload;
  } catch {
    return null;
  }
}

function setCachedWeather(payload) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      payload,
    }));
  } catch { /* localStorage unavailable */ }
}

function formatDate(date) {
  const d = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 星期${d[date.getDay()]}`;
}

// wttr.in weather code → emoji mapping
const weatherEmoji = {
  113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️',
  143: '🌫️', 176: '🌦️', 179: '🌨️', 182: '🌨️',
  185: '🌨️', 200: '⛈️', 227: '🌬️', 230: '🌬️',
  248: '🌫️', 260: '🌫️', 263: '🌧️', 266: '🌧️',
  281: '🌧️', 284: '🌧️', 293: '🌧️', 296: '🌧️',
  299: '🌧️', 302: '🌧️', 305: '🌧️', 308: '🌧️',
  311: '🌧️', 314: '🌧️', 317: '🌧️', 320: '🌨️',
  323: '🌨️', 326: '🌨️', 329: '❄️', 332: '❄️',
  335: '❄️', 338: '❄️', 350: '🌧️', 353: '🌧️',
  356: '🌧️', 359: '🌧️', 362: '🌧️', 365: '🌧️',
  368: '🌨️', 371: '❄️', 374: '🌧️', 377: '🌧️',
  386: '⛈️', 389: '⛈️', 392: '⛈️', 395: '❄️',
};

export default function WeatherTime() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(() => getCachedWeather());
  const [weatherError, setWeatherError] = useState(false);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather fetch
  useEffect(() => {
    if (weather) return; // use cached

    const city = import.meta.env.PUBLIC_WEATHER_CITY || 'Shenzhen';
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather unavailable');
        return res.json();
      })
      .then((data) => {
        const current = data.current_condition?.[0];
        if (!current) throw new Error('No data');
        const w = {
          temp: current.temp_C,
          desc: current.weatherDesc?.[0]?.value || '',
          code: parseInt(current.weatherCode, 10),
          city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
        };
        setWeather(w);
        setCachedWeather(w);
      })
      .catch(() => setWeatherError(true));
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const emoji = weather ? (weatherEmoji[weather.code] || '🌤️') : '';

  return (
    <div class="item-card" style={{ padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: '28px', fontWeight: 300, color: '#fff', fontFamily: 'monospace' }}>
        {h}:{m}:{s}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--item_left_text_color)', marginTop: '4px' }}>
        {formatDate(time)}
      </div>
      {weather ? (
        <div style={{ marginTop: '8px' }}>
          <span style={{ fontSize: '22px' }}>{emoji}</span>
          <span style={{ fontSize: '18px', color: '#fff', marginLeft: '6px' }}>{weather.temp}°C</span>
          <div style={{ fontSize: '11px', color: 'var(--item_left_text_color)', marginTop: '2px' }}>
            {weather.city} · {weather.desc}
          </div>
        </div>
      ) : weatherError ? (
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--item_left_text_color)' }}>
          天气不可用
        </div>
      ) : (
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--item_left_text_color)' }}>
          加载中...
        </div>
      )}
    </div>
  );
}
