import { useState, RefObject, useCallback, useRef, useLayoutEffect } from 'react';

export interface VirtualizedItem<T> {
	id: number | string;
	data: T;
	left: number;
	top: number;
	width: number;
	height: number;
}

interface UseVirtualizedResult<T> {
	visibleItems: VirtualizedItem<T>[];
	totalHeight: number;
}

export const useVirtualization = <
	T extends { id: number | string; width: number; height: number }
>(
	items: T[],
	containerRef: RefObject<HTMLDivElement>,
	gap: number
): UseVirtualizedResult<T> => {
	const [visibleItems, setVisibleItems] = useState<VirtualizedItem<T>[]>([]);
	const [totalHeight, setTotalHeight] = useState(0);

	const positionedItemsRef = useRef<VirtualizedItem<T>[]>([]);
	const scrollRafRef = useRef<number | null>(null);

	const handleScroll = useCallback(() => {
		if (scrollRafRef.current !== null) {
			cancelAnimationFrame(scrollRafRef.current);
		}
		scrollRafRef.current = requestAnimationFrame(() => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const buffer = 200;

			const isContainerScrollable = container.scrollHeight > container.clientHeight;
			const scrollTop = isContainerScrollable ? container.scrollTop : window.scrollY;
			const viewportHeight = isContainerScrollable ? container.clientHeight : window.innerHeight;

			const containerRect = container.getBoundingClientRect();
			const containerTop = isContainerScrollable ? 0 : scrollTop + containerRect.top;

			const newVisibleItems = positionedItemsRef.current.filter((item) => {
				const itemTop = containerTop + item.top;
				const itemBottom = itemTop + item.height;

				return (
					itemBottom >= scrollTop - buffer &&
					itemTop <= scrollTop + viewportHeight + buffer
				);
			});

			setVisibleItems(newVisibleItems);

			scrollRafRef.current = null;
		});
	}, [containerRef]);

	const updateLayout = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const containerWidth = container.offsetWidth;
		const columnCount =
			parseInt(getComputedStyle(container).getPropertyValue('--columns')) || 1;
		const calculatedColumnWidth =
			(containerWidth - (columnCount - 1) * gap) / columnCount;

		const columnHeights = new Array(columnCount).fill(0);

		const newPositionedItems = items.map((item, index) => {
			const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

			const aspectRatio = item.width / item.height;
			const itemHeight = calculatedColumnWidth / aspectRatio;

			const left = shortestColumnIndex * (calculatedColumnWidth + gap);
			const top = columnHeights[shortestColumnIndex];

			columnHeights[shortestColumnIndex] += itemHeight + gap;

			return {
				id: item.id != null ? item.id : index,
				data: item,
				left,
				top,
				width: calculatedColumnWidth,
				height: itemHeight,
			};
		});

		const newTotalHeight = Math.max(...columnHeights) - gap;
		if (totalHeight !== newTotalHeight) {
			setTotalHeight(newTotalHeight);
		}

		positionedItemsRef.current = newPositionedItems;

		handleScroll();
	}, [items, containerRef, gap, totalHeight, handleScroll]);

	useLayoutEffect(() => {
		updateLayout();

		if (containerRef.current) {
			containerRef.current.addEventListener('scroll', handleScroll);
		}
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', updateLayout);

		const targetContainer = containerRef.current;
		return () => {
			if (targetContainer) {
				targetContainer.removeEventListener('scroll', handleScroll);
			}
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateLayout);
			if (scrollRafRef.current !== null) {
				cancelAnimationFrame(scrollRafRef.current);
			}
		};
	}, [updateLayout, handleScroll, containerRef]);

	return { visibleItems, totalHeight };
};
