import { useState, useEffect } from 'react';
import { fetchPhotos, searchPhotos } from '../utils/api';
import { Photo } from '../types/photo';

export const useImageApi = (initialQuery: string = '') => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState(initialQuery);

	useEffect(() => {
		const loadPhotos = async () => {
			setLoading(true);
			try {
				const newPhotos = query
					? await searchPhotos(query, page, 80)
					: await fetchPhotos(page, 80);
				setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
			} catch (err) {
				setError(err instanceof Error ? err : new Error('An error occurred'));
			} finally {
				setLoading(false);
			}
		};

		loadPhotos();
	}, [query, page]);


	console.log(photos)
	const loadMore = () => setPage((prevPage) => prevPage + 1);

	return { photos, loading, error, loadMore, setQuery };
};
