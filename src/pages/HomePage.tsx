import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { MasonryGrid } from '../components/MasonryGrid';
import { useImageApi } from '../hooks/useImageApi';
import { SearchBar } from '../components/SearchBar';

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
});

const HomePage: React.FC = () => {
  const { photos, setSearchQuery, searchQuery } = useImageApi();

  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.title)}>Photo Gallery</h1>
      <SearchBar onSearch={setSearchQuery} initialValue={searchQuery ?? ""} />
      <MasonryGrid photos={photos} columnWidth={270} gap={6} />
    </div>
  );
};

export default HomePage;
