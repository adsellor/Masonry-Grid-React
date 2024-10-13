import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useVirtualization } from '../useVirtualization';

describe('useVirtualization', () => {
	let containerRef: React.RefObject<HTMLDivElement>;
	let containerElement: HTMLDivElement;

	beforeEach(() => {
		vi.useFakeTimers();
		containerElement = document.createElement('div');
		containerRef = { current: containerElement };

		vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
			const style: Partial<CSSStyleDeclaration> = {
				getPropertyValue: (prop: string) => {
					if (prop === '--columns') {
						return '4';
					}
					return '';
				},
			};
			return style as CSSStyleDeclaration;
		});

		Object.defineProperty(window, 'innerHeight', { writable: true, value: 600 });
		Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });

		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
			return setTimeout(cb, 0);
		});
		vi.stubGlobal('cancelAnimationFrame', (id: number) => {
			clearTimeout(id);
		});

		containerElement.getBoundingClientRect = () => ({
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			width: containerElement.offsetWidth,
			height: 0,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('should initialize with empty visibleItems and totalHeight when no items are provided', () => {
		const { result } = renderHook(() => useVirtualization([], containerRef, 0));
		expect(result.current.visibleItems).toEqual([]);
		expect(result.current.totalHeight).toBe(0);
	});

	it('should calculate positions and totalHeight correctly', () => {
		const items = [
			{ id: 1, width: 200, height: 100 },
			{ id: 2, width: 200, height: 100 },
			{ id: 3, width: 200, height: 100 },
			{ id: 4, width: 200, height: 100 },
		];

		Object.defineProperty(containerElement, 'offsetWidth', {
			value: 800,
			configurable: true,
		});

		const { result } = renderHook(() => useVirtualization(items, containerRef, 10));

		act(() => {
			vi.runAllTimers();
		});

		expect(result.current.totalHeight).toBeCloseTo(96.25);

		expect(result.current.visibleItems.length).toBe(4);

		const positions = result.current.visibleItems.map((item) => ({
			id: item.id,
			left: item.left,
			top: item.top,
			width: item.width,
			height: item.height,
		}));

		expect(positions).toEqual([
			{
				id: 1,
				left: 0,
				top: 0,
				width: 192.5,
				height: 96.25,
			},
			{
				id: 2,
				left: 202.5,
				top: 0,
				width: 192.5,
				height: 96.25,
			},
			{
				id: 3,
				left: 405,
				top: 0,
				width: 192.5,
				height: 96.25,
			},
			{
				id: 4,
				left: 607.5,
				top: 0,
				width: 192.5,
				height: 96.25,
			},
		]);
	});

	it('should update visibleItems when scroll position changes', () => {
		const items = Array.from({ length: 100 }, (_, i) => ({
			id: i + 1,
			width: 200,
			height: 100,
		}));

		Object.defineProperty(containerElement, 'offsetWidth', {
			value: 800,
			configurable: true,
		});

		const { result } = renderHook(() => useVirtualization(items, containerRef, 10));

		act(() => {
			vi.runAllTimers();
		});

		act(() => {
			window.scrollY = 1000;
			window.dispatchEvent(new Event('scroll'));
			vi.runAllTimers();
		});

		const newVisibleItems = result.current.visibleItems.map((item) => item.id);

		expect(newVisibleItems.length).toBeGreaterThan(0);
	});

	it('should handle window resize events', () => {
		const items = [
			{ id: 1, width: 200, height: 100 },
			{ id: 2, width: 200, height: 100 },
			{ id: 3, width: 200, height: 100 },
			{ id: 4, width: 200, height: 100 },
		];

		Object.defineProperty(containerElement, 'offsetWidth', {
			value: 800,
			configurable: true,
		});

		const { result } = renderHook(() => useVirtualization(items, containerRef, 10));

		act(() => {
			vi.runAllTimers();
		});

		const initialTotalHeight = result.current.totalHeight;

		act(() => {
			Object.defineProperty(containerElement, 'offsetWidth', {
				value: 400,
				configurable: true,
			});
			window.dispatchEvent(new Event('resize'));
			vi.runAllTimers();
		});

		expect(result.current.totalHeight).not.toEqual(initialTotalHeight);
	});
});
