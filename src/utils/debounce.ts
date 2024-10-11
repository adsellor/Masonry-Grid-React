type AnyFunction = (...args: unknown[]) => unknown;

export function debounce<T extends AnyFunction>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>): void => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
