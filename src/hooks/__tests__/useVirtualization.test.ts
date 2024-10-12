import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useVirtualization } from '../useVirtualization';

class IntersectionObserverMock implements IntersectionObserver {
	readonly root: Element | Document | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray<number> = [];

	callback: IntersectionObserverCallback;
	elements: Set<Element> = new Set();

	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		if (options) {
			this.root = options.root || null;
			this.rootMargin = options.rootMargin || '0px';
			this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
		}
	}

	observe = vi.fn((element: Element): void => {
		this.elements.add(element);
	});

	unobserve = vi.fn((element: Element): void => {
		this.elements.delete(element);
	});

	disconnect = vi.fn((): void => {
		this.elements.clear();
	});

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}

	mockIntersection(entries: Partial<IntersectionObserverEntry>[]): void {
		const completeEntries: IntersectionObserverEntry[] = entries.map(entry => ({
			boundingClientRect: {} as DOMRectReadOnly,
			intersectionRatio: 0,
			intersectionRect: {} as DOMRectReadOnly,
			isIntersecting: false,
			rootBounds: null,
			target: document.createElement('div'),
			time: 0,
			...entry
		}));
		this.callback(completeEntries, this);
	}
}

describe('useVirtualization', () => {
	let mockIntersectionObserver: IntersectionObserverMock;

	beforeEach(() => {
		mockIntersectionObserver = new IntersectionObserverMock(() => { });
		vi.stubGlobal('IntersectionObserver', vi.fn((callback) => {
			mockIntersectionObserver.callback = callback;
			return mockIntersectionObserver;
		}));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it('should initialize with an empty set of visible items', () => {
		const { result } = renderHook(() => useVirtualization());
		expect(result.current.visibleItems.size).toBe(0);
	});

	it('should observe an item when observeItem is called', () => {
		const { result } = renderHook(() => useVirtualization());
		const element = document.createElement('div');
		element.setAttribute('data-id', '1');

		act(() => {
			result.current.observeItem('1', element);
		});

		expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(element);
	});

	it('should unobserve an item when unobserveItem is called', () => {
		const { result } = renderHook(() => useVirtualization());
		const element = document.createElement('div');
		element.setAttribute('data-id', '1');

		act(() => {
			result.current.observeItem('1', element);
			result.current.unobserveItem('1');
		});

		expect(mockIntersectionObserver.unobserve).toHaveBeenCalledWith(element);
	});

	it('should update visibleItems when an item intersects', async () => {
		const { result } = renderHook(() => useVirtualization());
		const element = document.createElement('div');
		element.setAttribute('data-id', '1');

		act(() => {
			result.current.observeItem('1', element);
		});

		act(() => {
			mockIntersectionObserver.mockIntersection([{ target: element, isIntersecting: true }]);
		});


		expect(result.current.visibleItems.has('1')).toBe(true);
	});

	it('should remove item from visibleItems when it stops intersecting', async () => {
		const { result } = renderHook(() => useVirtualization());
		const element = document.createElement('div');
		element.setAttribute('data-id', '1');

		act(() => {
			result.current.observeItem('1', element);
		});

		act(() => {
			mockIntersectionObserver.mockIntersection([{ target: element, isIntersecting: true }]);
		});

		expect(result.current.visibleItems.has('1')).toBe(true);

		act(() => {
			mockIntersectionObserver.mockIntersection([{ target: element, isIntersecting: false }]);
		});

		expect(result.current.visibleItems.has('1')).toBe(false);
	});

	it('should create a new observer with provided options', () => {
		const options = { rootMargin: '10px', threshold: 0.5 };
		renderHook(() => useVirtualization(options));

		expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options);
	});

	it('should disconnect the observer on unmount', () => {
		const { unmount } = renderHook(() => useVirtualization());

		unmount();

		expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
	});
});
