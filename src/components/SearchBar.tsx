import React, { useState } from 'react';
import stylex from '@stylexjs/stylex';
import { X } from 'lucide-react';

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '400px',
    margin: '0 auto 20px',
    zIndex: 20,
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '10px 40px 10px 15px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    outline: 'none',
    transition: 'border-color 0.3s',
    ':focus': {
      borderColor: '#007bff',
    },
  },
  icon: {
    position: 'absolute',
    right: '15px',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
});

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue }) => {
  const [query, setQuery] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div {...stylex.props(styles.container)}>
      <input
        type="text"
        placeholder="Search photos..."
        value={query}
        onChange={handleChange}
        {...stylex.props(styles.input)}
        aria-label="Search photos"
      />
      {query && (
        <button
          onClick={handleClear}
          {...stylex.props(styles.icon)}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
