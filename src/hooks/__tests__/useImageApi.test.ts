import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useImageApi } from '../useImageApi';
import { fetchPhotos, searchPhotos } from '../../utils/api';
import { useSearchParams } from 'react-router-dom';

vi.mock('../../utils/api');
vi.mock('react-router-dom');

describe('useImageApi', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		(fetchPhotos as Mock).mockResolvedValue([]);
		(searchPhotos as Mock).mockResolvedValue([]);
		(useSearchParams as Mock).mockReturnValue([new URLSearchParams(), vi.fn()]);
	});

	it('should initialize with empty photos', () => {
		const { result } = renderHook(() => useImageApi());
		expect(result.current.photos).toEqual([]);
	});

	it('should set loading state while fetching photos', async () => {
		const { result, waitForNextUpdate } = renderHook(() => useImageApi());
		expect(result.current.loading).toBe(true);
		await waitForNextUpdate();
		expect(result.current.loading).toBe(false);
	});

	it('should fetch photos on initial render', async () => {
		const { waitForNextUpdate } = renderHook(() => useImageApi());
		await waitForNextUpdate();
		expect(fetchPhotos).toHaveBeenCalledWith(1, 20);
	});

	it('should handle errors when fetching photos', async () => {
		const error = new Error('API error');
		(fetchPhotos as Mock).mockRejectedValue(error);
		const { result, waitForNextUpdate } = renderHook(() => useImageApi());
		await waitForNextUpdate();
		expect(result.current.error).toEqual(error);
	});

	it('should update hasMore based on the number of photos returned', async () => {
		(fetchPhotos as Mock).mockResolvedValueOnce(Array(20).fill({}));
		const { result, waitForNextUpdate } = renderHook(() => useImageApi());
		await waitForNextUpdate();
		expect(result.current.hasMore).toBe(true);

		(fetchPhotos as Mock).mockResolvedValueOnce(Array(10).fill({}));
		act(() => {
			result.current.loadMore();
		});
		await waitForNextUpdate();
		expect(result.current.hasMore).toBe(false);
	});


	it('should clear search params when empty query is set', async () => {
		vi.useFakeTimers();
		const setSearchParams = vi.fn();
		(useSearchParams as Mock).mockReturnValue([new URLSearchParams(), setSearchParams]);
		const { result } = renderHook(() => useImageApi());
		act(() => {
			result.current.setSearchQuery('');
		});
		await vi.runAllTimersAsync();
		expect(setSearchParams).toHaveBeenCalledWith(new URLSearchParams());
	});
});
