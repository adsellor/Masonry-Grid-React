import { useState, useCallback, useMemo } from 'react';
import { Photo } from '../types/photo';

interface Position {
	top: number;
	left: number;
	height: number;
}

export const useMasonryLayout = (
	photos: Photo[],
	columnWidth: number,
	gap: number,
	containerWidth: number
) => {
	const [positions, setPositions] = useState<Position[]>([]);

	const columnCount = Math.floor(containerWidth / (columnWidth + gap));
	const actualColumnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

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

	const gridHeight = useMemo(() => {
		return positions.length > 0
			? Math.max(...positions.map(pos => pos.top + pos.height))
			: 0;
	}, [positions]);

	return {
		positions,
		calculatePositions,
		gridHeight,
		actualColumnWidth,
	};
};
