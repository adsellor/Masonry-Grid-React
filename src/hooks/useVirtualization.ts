import { useState, useEffect, useRef, useCallback } from 'react';

interface VirtualizationOptions {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
}

export const useVirtualization = (options: VirtualizationOptions = {}) => {
	const [intersectingItems, setIntersectingItems] = useState<Set<string>>(new Set());
	const observerRef = useRef<IntersectionObserver | null>(null);
	const itemRefs = useRef<{ [key: string]: Element }>({});

	const createObserver = useCallback(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const id = entry.target.getAttribute('data-id');
				if (id) {
					setIntersectingItems((prev) => {
						const newSet = new Set(prev);
						if (entry.isIntersecting) {
							newSet.add(id);
						} else {
							newSet.delete(id);
						}
						return newSet;
					});
				}
			});
		}, options);

		// Re-observe all existing items
		Object.values(itemRefs.current).forEach((el) => {
			if (observerRef.current) {
				observerRef.current.observe(el);
			}
		});
	}, [options]);

	useEffect(() => {
		createObserver();
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [createObserver]);

	const observeItem = useCallback((id: string, element: Element | null) => {
		if (element) {
			itemRefs.current[id] = element;
			if (observerRef.current) {
				observerRef.current.observe(element);
			}
		}
	}, []);

	const unobserveItem = useCallback((id: string) => {
		if (itemRefs.current[id] && observerRef.current) {
			observerRef.current.unobserve(itemRefs.current[id]);
			delete itemRefs.current[id];
		}
	}, []);

	return { intersectingItems, observeItem, unobserveItem };
};
