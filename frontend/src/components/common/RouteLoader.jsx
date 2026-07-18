import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Spinner } from './Common';

export function TopBarLoader() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setLoading(true);
      prevPath.current = pathname;
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg, #F4742B, #F5A94C, #F4742B)',
          animation: 'loadingBar 1s ease-in-out infinite',
          width: '40%',
        }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-obsidian">
      <img src="/zaa-logo.png" alt="Zeno Africa Adventures" className="h-14 w-auto mb-6 opacity-80 animate-pulse" />
      <Spinner size={36} />
      <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: '#7A6148', fontFamily: 'Montserrat' }}>
        Loading your adventure...
      </p>
    </div>
  );
}
