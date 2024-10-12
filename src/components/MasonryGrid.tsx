import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Photo } from '../types/photo';
import { useResizeHandler } from '../hooks/useResizeHandler';
import { useVirtualization } from '../hooks/useVirtualization';
import { useMasonryLayout } from '../hooks/useMasonryLayout';
import { useEndReached } from '../hooks/useEndReached';
import { PhotoCard } from './PhotoCard';

const styles = stylex.create({
  grid: {
    position: 'relative',
    width: '100%',
  },
  item: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transition: 'transform 0.2s',
  },
});

interface MasonryGridProps {
  photos: Photo[];
  columnWidth: number;
  gap: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos,
  columnWidth,
  gap,
  onEndReached,
  endReachedThreshold = 200
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeHandler(containerRef);

  const { positions, calculatePositions, gridHeight, actualColumnWidth } = useMasonryLayout(
    photos,
    columnWidth,
    gap,
    containerWidth
  );

  useEndReached(onEndReached, endReachedThreshold);

  const { visibleItems, observeItem, unobserveItem } = useVirtualization({
    rootMargin: '0px 0px 100px 0px',
    threshold: 0,
  });

  useEffect(() => {
    calculatePositions();
  }, [calculatePositions]);

  const renderPhoto = useCallback((photo: Photo, index: number) => {
    const position = positions[index];
    if (!position) return null;

    const isVisible = visibleItems.has(index.toString());

    if (!isVisible) {
      return (
        <div
          key={`${photo.id}:${index}`}
          data-id={index.toString()}
          ref={(el) => {
            if (el) observeItem(index.toString(), el);
          }}
          {...stylex.props(styles.item)}
          style={{
            transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
            width: `${actualColumnWidth}px`,
            height: `${position.height}px`,
          }}
        />
      );
    }

    return (
      <div
        key={`${photo.id}:${index}`}
        data-id={index.toString()}
        ref={(el) => {
          if (el) observeItem(index.toString(), el);
        }}
        {...stylex.props(styles.item)}
        style={{
          transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
          width: `${actualColumnWidth}px`,
          height: `${position.height}px`,
        }}
      >
        <Link to={`/photo/${photo.id}`} state={photo}>
          <PhotoCard
            src={photo.src.medium}
            alt={photo.alt}
            width={actualColumnWidth}
            height={position.height}
            onLoad={() => null}
          />
        </Link>
      </div>
    );
  }, [positions, actualColumnWidth, visibleItems, observeItem]);

  const renderedItems = useMemo(() => {
    return photos.map((photo, index) => renderPhoto(photo, index));
  }, [photos, renderPhoto]);

  useEffect(() => {
    return () => {
      photos.forEach((_, index) => unobserveItem(index.toString()));
    };
  }, [photos, unobserveItem]);

  return (
    <div
      ref={containerRef}
      {...stylex.props(styles.grid)}
      style={{ height: `${gridHeight}px` }}
    >
      {renderedItems}
    </div>
  );
};
