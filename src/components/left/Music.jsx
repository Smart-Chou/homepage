import { useEffect, useRef, useState } from 'preact/hooks';

export default function Music() {
  const containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    // MetingJS config from env
    const server = import.meta.env.PUBLIC_SONG_SERVER || 'netease';
    const type = import.meta.env.PUBLIC_SONG_TYPE || 'playlist';
    const id = import.meta.env.PUBLIC_SONG_ID || '7452421335';
    const api = import.meta.env.PUBLIC_SONG_API || 'https://api-meting.imsyy.top';

    // Create MetingJS element
    const metingEl = document.createElement('meting-js');
    metingEl.setAttribute('server', server);
    metingEl.setAttribute('type', type);
    metingEl.setAttribute('id', id);
    metingEl.setAttribute('api', api);
    metingEl.setAttribute('mini', 'true');
    metingEl.setAttribute('autoplay', 'false');
    metingEl.setAttribute('theme', '#6366f1');
    metingEl.setAttribute('loop', 'all');
    metingEl.setAttribute('order', 'list');
    metingEl.setAttribute('preload', 'auto');
    metingEl.setAttribute('list-max-height', '200px');
    container.appendChild(metingEl);

    // Load MetingJS and APlayer from CDN
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => {
          setHidden(true);
          reject(new Error(`Failed to load: ${src}`));
        };
        document.head.appendChild(script);
      });

    const loadStylesheet = (href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    Promise.resolve()
      .then(() => loadStylesheet('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'))
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js'))
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js'))
      .catch(() => setHidden(true));
  }, []);

  if (hidden) return null;

  return (
    <div class="item-card" style={{ padding: '12px' }}>
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
}
