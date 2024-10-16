import { Photo } from "../types/photo";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchPhotos = async (page: number = 1, perPage: number = 20): Promise<Photo[]> => {
	try {
		const response = await fetch(`${BASE_URL}/curated?page=${page}&per_page=${perPage}`, {
			headers: {
				Authorization: API_KEY,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch photos');
		}

		const data = await response.json();
		return data.photos;
	} catch (error) {
		console.error('Error fetching photos:', error);
		return [];
	}
};

export const searchPhotos = async (query: string, page: number, perPage: number): Promise<Photo[]> => {
	try {
		const response = await fetch(`${BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`,

			{
				headers: {
					Authorization: API_KEY,
					'Content-Type': 'application/json',
				}
			},
		);
		if (!response.ok) {
			throw new Error('Failed to search photos');
		}
		const data = await response.json();
		return data.photos;
	} catch (error) {
		console.log('Error searching photos:', error)
		return []
	}
};

export const getPhotoById = async (id: string): Promise<Photo | null> => {
	try {
		const response = await fetch(`${BASE_URL}/photos/${id}`,
			{
				headers: {
					Authorization: API_KEY
				},
			}
		);
		if (!response.ok) {
			throw new Error('Failed to search photos');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.log('Error searching photos:', error)
		return null
	}
}
