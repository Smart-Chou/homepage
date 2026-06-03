import { useState, useEffect } from 'preact/hooks';

const FALLBACK = '人生は一期一会';

export default function Hitokoto() {
  const [text, setText] = useState(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const api = import.meta.env.PUBLIC_HITOKOTO_API || 'https://v1.hitokoto.cn';
    fetch(api)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        setText(data.hitokoto);
        setSource(data.from || '');
      })
      .catch(() => {
        setError(true);
        setText(FALLBACK);
      });
  }, []);

  return (
    <div class="item-card" style={{ padding: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: '#eee', lineHeight: 1.6, fontStyle: 'italic' }}>
        「{text || '...'}」
      </div>
      <div style={{ fontSize: '10px', color: 'var(--item_left_text_color)', marginTop: '6px' }}>
        {error ? '' : source ? `—— ${source}` : '—— Hitokoto'}
      </div>
    </div>
  );
}
