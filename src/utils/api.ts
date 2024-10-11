import { Photo } from "../types/photo";

const API_KEY = 'jxoPSHJP4xo8cPI7fwd5uu5ZOajruXi6w4YGFtl0lz1QsBXUpWyjWFvz';
const BASE_URL = 'https://api.pexels.com/v1';


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
		const response = await fetch(`${BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`);
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

