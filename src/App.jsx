import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getHealth, predict } from './services/api.js';
import Header from './components/Header.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import GradcamInspector from './components/GradcamInspector.jsx';
import SessionQueue from './components/SessionQueue.jsx';
import GuideAndDisclaimer from './components/GuideAndDisclaimer.jsx';

export default function App() {
  const root = useRef(null);
  const [health, setHealth] = useState({ state: 'checking' });
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // anim start
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-enter]', { opacity: 0, y: 24, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'all' });
    }, root);
    return () => ctx.revert();
  }, []);

  // health check
  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const h = await getHealth();
        if (alive) setHealth({ state: h.model_loaded ? 'ready' : 'no-model' });
      } catch {
        if (alive) setHealth({ state: 'down' });
      }
    };
    check();
    const t = setInterval(check, 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const analyze = useCallback(async (file) => {
    setLoading(true); setError('');
    try {
      const result = await predict(file);
      const item = { id: crypto.randomUUID(), name: file.name, previewUrl: URL.createObjectURL(file), result, time: new Date() };
      setItems((prev) => [item, ...prev]);
      setActiveId(item.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const active = items.find((i) => i.id === activeId) || null;

  return (
    <div ref={root} className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <div data-enter><Header health={health} /></div>
        <div className="space-y-5 lg:space-y-0 lg:grid lg:gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-5">
          <div data-enter><UploadPanel onAnalyze={analyze} loading={loading} error={error} setError={setError} disabled={health.state === 'down'} /></div>
          <div data-enter><SessionQueue items={items} activeId={activeId} onSelect={setActiveId} /></div>
        </div>
        <div className="space-y-5">
          <div data-enter><ResultPanel item={active} /></div>
          <div data-enter><GradcamInspector item={active} /></div>
        </div>
      </div>
      <div data-enter><GuideAndDisclaimer disclaimer={active?.result?.disclaimer} /></div>
    </div>
  );
}
