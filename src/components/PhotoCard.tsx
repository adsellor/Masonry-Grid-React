import React, { useState, useEffect, useRef } from 'react';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    transition: 'opacity 0.3s ease-in-out',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
});

interface PhotoCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  onLoad: () => void;
  priority?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ src, alt, width, height, onLoad, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      onLoad();
    };

    if (priority) {
      img.fetchPriority = 'high';
    }
  }, [src, onLoad, priority]);

  return (
    <div {...stylex.props(styles.container)} style={{ width, height }}>
      {!isLoaded && <div {...stylex.props(styles.placeholder)} />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        {...stylex.props(styles.image)}
        style={{ opacity: isLoaded ? 1 : 0 }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};
