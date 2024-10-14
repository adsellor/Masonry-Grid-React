import React, { useRef, useMemo } from 'react';
import stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Photo } from '../types/photo';
import { useEndReached } from '../hooks/useEndReached';
import { PhotoCard } from './PhotoCard';
import { useVirtualization, VirtualizedItem } from '../hooks/useVirtualization';


const styles = stylex.create({
  grid: {
    position: 'relative',
    width: '100%',
  },
  item: {
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'transform 0.2s',
  },
  columnCount: {
    '@media (max-width: 640px)': {
      '--columns': '2',
    },
    '@media (min-width: 641px) and (max-width: 1024px)': {
      '--columns': '4',
    },
    '@media (min-width: 1025px)': {
      '--columns': '5',
    },
  },
});

interface MasonryGridProps {
  photos: Photo[];
  gap: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = React.memo(
  ({ photos, gap, onEndReached, endReachedThreshold = 200 }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEndReached(onEndReached, endReachedThreshold);

    const { visibleItems, totalHeight } = useVirtualization(
      photos,
      containerRef,
      gap
    );

    const renderedItems = useMemo(
      () =>
        visibleItems.map((item) => (
          <MemoizedMasonryItem key={item.data.uid} item={item} />
        )),
      [visibleItems]
    );

    return (
      <div
        ref={containerRef}
        {...stylex.props(styles.grid, styles.columnCount)}
        style={{ height: `${totalHeight}px` }}
      >
        {renderedItems}
      </div>
    );
  }
);

interface MasonryItemProps<T> {
  item: VirtualizedItem<T>;
}

const MasonryItem = <T extends Photo>({
  item,
}: MasonryItemProps<T>) => {
  const { data, left, top, width, height } = item;
  return (
    <div
      {...stylex.props(styles.item)}
      style={{
        transform: `translate3d(${left}px, ${top}px, 0)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Link to={`/photo/${data.id}`} state={data}>
        <PhotoCard
          src={data.src.large}
          alt={data.alt}
          aspectRatio={data.width / data.height}
        />
      </Link>
    </div>
  );
}

const MemoizedMasonryItem = React.memo(MasonryItem);
