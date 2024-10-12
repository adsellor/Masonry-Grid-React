import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useMasonryLayout } from '../useMasonryLayout';
import { Photo } from '../../types/photo';

describe('useMasonryLayout', () => {
	const mockPhotos: Partial<Photo>[] = [
		{ id: '1', width: 100, height: 100, url: 'url1' },
		{ id: '2', width: 100, height: 200, url: 'url2' },
		{ id: '3', width: 100, height: 150, url: 'url3' },
		{ id: '4', width: 100, height: 120, url: 'url4' },
	];

	const columnWidth = 200;
	const gap = 10;
	const containerWidth = 1000;

	it('should calculate correct number of columns', () => {
		const { result } = renderHook(() => useMasonryLayout(mockPhotos as Photo[], columnWidth, gap, containerWidth));
		expect(result.current.actualColumnWidth).toBeCloseTo(242.5);
	});

	it('should calculate positions correctly', () => {
		const { result } = renderHook(() => useMasonryLayout(mockPhotos as Photo[], columnWidth, gap, containerWidth));
		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.positions).toHaveLength(mockPhotos.length);
		expect(result.current.positions[0]).toEqual({
			left: 0,
			top: 0,
			height: 242.5,
		});
		expect(result.current.positions[1]).toEqual({
			left: 252.5,
			top: 0,
			height: 485,
		});
		expect(result.current.positions[2]).toEqual({
			left: 505,
			top: 0,
			height: 363.75,
		});
		expect(result.current.positions[3]).toEqual({
			left: 757.5,
			top: 0,
			height: 291,
		});
	});

	it('should recalculate positions when photos change', () => {
		const { result, rerender } = renderHook(
			({ photos }) => useMasonryLayout(photos as Photo[], columnWidth, gap, containerWidth),
			{ initialProps: { photos: mockPhotos } }
		);

		act(() => {
			result.current.calculatePositions();
		});

		const initialPositions = result.current.positions;

		const newPhotos = [...mockPhotos, { id: '5', width: 100, height: 180, url: 'url5' }];
		rerender({ photos: newPhotos });

		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.positions).toHaveLength(newPhotos.length);
		expect(result.current.positions).not.toEqual(initialPositions);
	});

	it('should calculate grid height correctly', () => {
		const { result } = renderHook(() => useMasonryLayout(mockPhotos as Photo[], columnWidth, gap, containerWidth));
		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.gridHeight).toBe(485);
	});

	it('should handle empty photo array', () => {
		const { result } = renderHook(() => useMasonryLayout([], columnWidth, gap, containerWidth));
		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.positions).toEqual([]);
		expect(result.current.gridHeight).toBe(0);
	});

	it('should handle zero container width', () => {
		const { result } = renderHook(() => useMasonryLayout(mockPhotos as Photo[], columnWidth, gap, 0));
		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.positions).toEqual([]);
		expect(result.current.gridHeight).toBe(0);
	});

	it('should recalculate when container width changes', () => {
		const { result, rerender } = renderHook(
			({ containerWidth }) => useMasonryLayout(mockPhotos as Photo[], columnWidth, gap, containerWidth),
			{ initialProps: { containerWidth: 1000 } }
		);

		act(() => {
			result.current.calculatePositions();
		});

		const initialPositions = result.current.positions;

		rerender({ containerWidth: 800 });

		act(() => {
			result.current.calculatePositions();
		});

		expect(result.current.positions).not.toEqual(initialPositions);
		expect(result.current.actualColumnWidth).toBeCloseTo(260);
	});
});
