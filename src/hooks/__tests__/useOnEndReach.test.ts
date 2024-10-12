import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useEndReached } from '../useEndReached';

describe('useEndReached', () => {
	let originalAddEventListener: typeof window.addEventListener;
	let originalRemoveEventListener: typeof window.removeEventListener;

	beforeEach(() => {
		originalAddEventListener = window.addEventListener;
		originalRemoveEventListener = window.removeEventListener;
		window.addEventListener = vi.fn();
		window.removeEventListener = vi.fn();

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 0,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});
	});

	afterEach(() => {
		window.addEventListener = originalAddEventListener;
		window.removeEventListener = originalRemoveEventListener;
		vi.clearAllMocks();
	});

	it('should add scroll event listener on mount', () => {
		renderHook(() => useEndReached(() => { }, 100));
		expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
	});

	it('should remove scroll event listener on unmount', () => {
		const { unmount } = renderHook(() => useEndReached(() => { }, 100));
		unmount();
		expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
	});

	it('should call onEndReached when scrolled to threshold', () => {
		const onEndReached = vi.fn();
		renderHook(() => useEndReached(onEndReached, 100));

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 900,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});

		const scrollHandler = (window.addEventListener as jest.Mock).mock.calls[0][1];
		scrollHandler();

		expect(onEndReached).toHaveBeenCalledTimes(1);

		scrollHandler();
		expect(onEndReached).toHaveBeenCalledTimes(1);

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 800,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});
		scrollHandler();

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 900,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});
		scrollHandler();
		expect(onEndReached).toHaveBeenCalledTimes(2);
	});

	it('should not call onEndReached when it is undefined', () => {
		renderHook(() => useEndReached(undefined, 100));

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 900,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});

		const scrollHandler = (window.addEventListener as jest.Mock).mock.calls[0][1];
		scrollHandler();

		expect(() => scrollHandler()).not.toThrow();
	});

	it('should respect the endReachedThreshold', () => {
		const onEndReached = vi.fn();
		renderHook(() => useEndReached(onEndReached, 200));

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 200,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});

		const scrollHandler = (window.addEventListener as jest.Mock).mock.calls[0][1];
		scrollHandler();

		expect(onEndReached).not.toHaveBeenCalled();

		Object.defineProperty(document, 'documentElement', {
			writable: true,
			value: {
				scrollTop: 801,
				clientHeight: 1000,
				scrollHeight: 2000
			}
		});
		scrollHandler();

		expect(onEndReached).toHaveBeenCalledTimes(1);
	});
});
