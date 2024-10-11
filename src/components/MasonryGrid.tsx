import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Photo } from '../types/photo';
import { useResizeHandler } from '../hooks/useResizeHandler';
import { useVirtualization } from '../hooks/useVirtualization';
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
}

interface Position {
  top: number;
  left: number;
  height: number;
}

interface MasonryGridProps {
  photos: Photo[];
  columnWidth: number;
  gap: number;
}

interface Position {
  top: number;
  left: number;
  height: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ photos, columnWidth, gap }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeHandler(containerRef);
  const [positions, setPositions] = useState<Position[]>([]);

  const columnCount = Math.floor(containerWidth / (columnWidth + gap));
  const actualColumnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

  const { intersectingItems, observeItem, unobserveItem } = useVirtualization({
    rootMargin: '0px 0px 100px 0px',
    threshold: 0,
  });


  const calculatePositions = useCallback(() => {
    if (columnCount === 0) return;

    const newPositions: Position[] = [];
    const columnHeights = new Array(columnCount).fill(0);

    photos.forEach((photo, index) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const aspectRatio = photo.height / photo.width;
      const height = actualColumnWidth * aspectRatio;

      newPositions[index] = {
        left: shortestColumnIndex * (actualColumnWidth + gap),
        top: columnHeights[shortestColumnIndex],
        height,
      };

      columnHeights[shortestColumnIndex] += height + gap;
    });

    setPositions(newPositions);
  }, [photos, columnCount, actualColumnWidth, gap]);

  useEffect(() => {
    calculatePositions();
  }, [calculatePositions]);

  const gridHeight = useMemo(() => {
    return positions.length > 0
      ? Math.max(...positions.map(pos => pos.top + pos.height))
      : 0;
  }, [positions]);




  const renderPhoto = useCallback((photo: Photo, index: number) => {
    const position = positions[index];
    if (!position) return null;

    const isVisible = intersectingItems.has(index.toString());

    return (
      <div
        key={`${photo.id}-${index}`}
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
        {isVisible && (
          <Link to={`/photo/${photo.id}`} state={photo}>
            <PhotoCard
              src={photo.src.medium}
              alt={photo.alt}
              width={actualColumnWidth}
              height={position.height}
              onLoad={() => null}
            />
          </Link>
        )}
      </div>
    );
  }, [positions, actualColumnWidth, intersectingItems, observeItem]);

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
}
