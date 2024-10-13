# Simple Masonry Layout 

[View Live Demo](https://masonry-grid-react-jogyuegb5-adsellors-projects.vercel.app/)

## Project Overview

Masonry layotu created with Vite+React+TS. 

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/adsellor/Masonry-Grid-React
   cd masonry-grid-react
   ```

2. Install dependencies:
   ```
   bun install # or any other package manager
   ```

3. Run the development server:
   ```
   bun dev # npm run dev, yarn dev, pnpm dev
   ```

4. Create `.env.local` file and add `VITE_BASE_URL` and `VITE_API_KEY` variables.

5. Open `http://localhost:5173` in your browser to view the application.

## Features

1. **Virtualized Masonry Grid Layout**
   - Responsive design that adapts to different screen sizes
   - Grid virtualization

2. **Photo Details View**
   - Displays selected photo in larger size
   - Shows additional information (title, description, photographer's name)
   - Includes a back button to return to the grid

3. **Performance Optimizations**
   - Virtualization for efficient rendering of large image sets
   - Optimized asset loading
   - Efficient state management

4. **Image Search**
   - Dynamic image search based on keywords
   - Debounced network request for search

## Implementation Details

### Virtualized Masonry Grid

The masonry grid is implemented using a custom virtualization technique to ensure smooth performance with large datasets. Key aspects include:

- Calculation of visible items based on scroll position using IntersectionObserver
- Dynamic rendering of only visible images
- Efficient update of item positions on resize events

### Photo Details View

The detailed view for photos is implemented as a separate route, allowing for deep linking and proper browser history management. It includes:

- High-resolution image display
- Metadata presentation (title, description, photographer, avg color)

### Performance Considerations

To ensure optimal performance, the following techniques are employed:

- Image lazy loading and progressive loading for faster initial render
- Memoization of expensive calculations using useMemo and useCallback
- Debouncing of resize and scroll event handlers
- Code splitting and lazy loading of components

### Styling with StyleX

StyleX is used for high-performance styling:

- Atomic CSS generation for optimal performance
- Type-safe styling with TypeScript integration
- Dynamic styles based on props and state

## Testing

There are test for business logic covered in hooks
To run the tests:

```
bun run test
```


