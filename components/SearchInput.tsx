
import React from 'react';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ query, setQuery, onSearch, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ej: 'Breaking Bad', 'Juego de Tronos'..."
        className="w-full px-4 py-3 text-lg text-gray-800 bg-white border-2 border-r-0 border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 transition-colors"
        disabled={isLoading}
      />
      <button
        onClick={onSearch}
        disabled={isLoading || !query}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
