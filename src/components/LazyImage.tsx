import React from 'react';

const LazyImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt = '', className = '', style }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      });
      io.observe(node);
      return () => io.disconnect();
    }

    // Fallback: load immediately
    setVisible(true);
  }, []);

  React.useEffect(() => {
    if (visible) setLoadedSrc(src);
  }, [visible, src]);

  return (
    <div ref={ref} className={className} style={style}>
      {loadedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={loadedSrc} alt={alt} className={className} style={style} />
      ) : (
        <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}></div>
      )}
    </div>
  );
};

export default LazyImage;
