import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { MasonryGrid } from '../components/MasonryGrid';
import { useImageApi } from '../hooks/useImageApi';
import { SearchBar } from '../components/SearchBar';
import Loading from '../components/Loading';

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
  const { photos, setSearchQuery, searchQuery, loadMore, loading } = useImageApi();

  if (loading && !photos.length) {
    return <Loading size='large' />
  }

  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.title)}>Photo Gallery</h1>
      <SearchBar onSearch={setSearchQuery} initialValue={searchQuery ?? ""} />
      <MasonryGrid onEndReached={loadMore} photos={photos} columnWidth={200} gap={6} />
    </div>
  );
};

export default HomePage;
