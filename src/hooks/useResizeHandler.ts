import { useState, useEffect, useCallback } from 'react';

export const useResizeHandler = (ref: React.RefObject<HTMLElement>) => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	const updateSize = useCallback(() => {
		if (ref.current) {
			setSize({
				width: ref.current.offsetWidth,
				height: ref.current.offsetHeight
			});
		}
	}, [ref]);

	useEffect(() => {
		const debounce = (fn: () => void, ms: number) => {
			let timer: NodeJS.Timeout;
			return () => {
				clearTimeout(timer);
				timer = setTimeout(() => fn(), ms);
			};
		};

		const debouncedUpdateSize = debounce(updateSize, 250);

		window.addEventListener('resize', debouncedUpdateSize);
		updateSize();

		return () => window.removeEventListener('resize', debouncedUpdateSize);
	}, [updateSize]);

	return size;
};
