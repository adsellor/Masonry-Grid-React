import { useEffect, useRef } from 'react';

export const useEndReached = (
	onEndReached: (() => void) | undefined,
	endReachedThreshold: number
) => {
	const endReachedRef = useRef(false);

	useEffect(() => {
		const handleScroll = () => {
			if (!onEndReached) return;

			const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
			const bottomOffset = scrollHeight - (scrollTop + clientHeight);

			if (bottomOffset <= endReachedThreshold && !endReachedRef.current) {
				endReachedRef.current = true;
				onEndReached();
			} else if (bottomOffset > endReachedThreshold) {
				endReachedRef.current = false;
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [onEndReached, endReachedThreshold]);
};
