import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ onResults, onEmptySearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) {
      // If search is empty, fetch all restaurants
      if (onEmptySearch) {
        onEmptySearch();
      }
      return;
    }

    try {
      const res = await axios.get('http://localhost:8080/restaurants/search', {
        params: { name: searchTerm }
      });
      onResults(res.data);
    } catch (err) {
      onResults([]);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurant names..."
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
