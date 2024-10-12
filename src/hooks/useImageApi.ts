import { useState, useEffect, useCallback, useDeferredValue } from 'react';
import { fetchPhotos, searchPhotos } from '../utils/api';
import { Photo } from '../types/photo';
import { debounce } from '../utils/debounce';
import { useSearchParams } from 'react-router-dom';

export const useImageApi = (initialQuery: string = '') => {
	const [photos, setPhotos] = useState<Photo[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useSearchParams(initialQuery);
	const [hasMore, setHasMore] = useState(true);
	const deferredQuery = useDeferredValue(query.get('search'))

	const loadPhotos = useCallback(async (currentPage: number, currentQuery: string) => {
		setLoading(true);
		try {
			const newPhotos = currentQuery
				? await searchPhotos(currentQuery, currentPage, 20)
				: await fetchPhotos(currentPage, 20);

			setPhotos(prevPhotos => currentPage === 1 ? newPhotos : [...prevPhotos, ...newPhotos]);
			setHasMore(newPhotos.length === 20);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('An error occurred'));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		setPage(1);
		loadPhotos(1, deferredQuery ?? '');
	}, [deferredQuery, loadPhotos]);

	const loadMore = useCallback(() => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			loadPhotos(nextPage, deferredQuery ?? '');
		}
	}, [loading, hasMore, page, deferredQuery, loadPhotos]);

	const setSearchQuery = debounce((newQuery: string) => {
		if (newQuery.trim() === "") {
			setQuery(prev => {
				prev.delete('search')
				return new URLSearchParams()
			})
		} else {
			setQuery({ "search": newQuery });
		}
		setPhotos([]);
		setPage(1);
		setHasMore(true);
	}, 300);

	return {
		photos,
		loading,
		error,
		loadMore,
		setSearchQuery,
		hasMore,
		searchQuery: query.get('search')
	};
};
