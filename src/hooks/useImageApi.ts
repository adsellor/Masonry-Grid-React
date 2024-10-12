import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import { fetchPhotos, searchPhotos } from '../utils/api';
import { useSearchParams } from 'react-router-dom';
import { pageAtom, photosAtom } from '../store/atoms';
import { debounce } from '../utils/debounce';

const PHOTOS_PER_PAGE = 20;
const DEBOUNCE_DELAY = 500;


export const useImageApi = () => {
	const [photos, setPhotos] = useAtom(photosAtom);
	const [page, setPage] = useAtom(pageAtom);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [hasMore, setHasMore] = useState(true);

	const query = useMemo(() => searchParams.get('search') || '', [searchParams]);

	const loadPhotos = useCallback(async (currentPage: number, currentQuery?: string) => {
		setLoading(true);
		setError(null);
		try {
			const newPhotos = currentQuery
				? await searchPhotos(currentQuery, currentPage, PHOTOS_PER_PAGE)
				: await fetchPhotos(currentPage, PHOTOS_PER_PAGE);

			setPhotos(prevPhotos =>
				currentPage === 1 ? newPhotos : [...prevPhotos, ...newPhotos]
			);

			setHasMore(newPhotos.length === PHOTOS_PER_PAGE);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('An error occurred while fetching photos'));
		} finally {
			setLoading(false);
		}
	}, [setPhotos]);

	useEffect(() => {
		if (!photos.length) {
			setPage(1);
			setPhotos([]);
			loadPhotos(1, query);
		}
	}, [query, loadPhotos, setPage, setPhotos, photos.length]);

	const loadMore = useCallback(() => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			loadPhotos(nextPage, query);
		}
	}, [loading, hasMore, page, query, loadPhotos, setPage]);

	const setSearchQuery = debounce((newQuery: string) => {
		if (newQuery.trim() === "") {
			setSearchParams(new URLSearchParams());
		} else {
			setSearchParams({ search: newQuery });
		}
		setPhotos([]);
		setPage(1);
		setHasMore(true);
	}, DEBOUNCE_DELAY);

	return {
		photos,
		loading,
		error,
		loadMore,
		setSearchQuery,
		hasMore,
		searchQuery: query
	};
};
