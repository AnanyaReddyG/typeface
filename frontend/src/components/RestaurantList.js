import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import Filters from './Filters';
import FiltersDropdown from './FiltersDropdown';


const PAGE_SIZE = 10;

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const currentPage = parseInt(searchParams.get('page')) || 0;

  // Fetch paginated restaurants
  useEffect(() => {
    if (!searchActive) {
      axios.get(`http://localhost:8080/restaurants?page=${currentPage}&size=${PAGE_SIZE}`)
        .then(response => {
          setRestaurants(response.data.content);
          setPageCount(response.data.totalPages);
        });
    }
  }, [currentPage, searchActive]);

  const handleSearchResults = (results) => {
    setRestaurants(results);
    setSearchActive(true);
  };
  
  const applyFilters = (selected) => {
    setFilters(selected); 
    const params = { page: 0, size: PAGE_SIZE }; 
    Object.keys(selected).forEach(key => {
      if (selected[key]) params[key] = selected[key];
    });
  
    axios.get('http://localhost:8080/restaurants/filter', { params })
      .then(res => {
        setRestaurants(res.data.content || res.data);
        setPageCount(res.data.totalPages || 1);
        setPageCount(0);
        setSearchActive(true);
      });
  };
  
  const handleReset = () => {
    setSearchActive(false);
    setSearchParams({ page: '0' });
  };

  const goToPage = (page) => {
    if (searchActive) {
      const params = { ...filters, page, size: PAGE_SIZE };
      axios.get('http://localhost:8080/restaurants/filter', { params })
        .then(res => {
          setRestaurants(res.data.content || res.data);
          setPageCount(res.data.totalPages || 1);
          setPageCount(page);
        });
    } else {
      setSearchParams({ page: page.toString() });
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Link
          to="/restaurants/nearby"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Find Restaurants Near Me
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar onResults={handleSearchResults} onEmptySearch={handleReset} />
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <FiltersDropdown onFilter={applyFilters} />
          </div>
        </div>

        {searchActive && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Show All Restaurants
          </button>
        )}
      </div>

      {/* Restaurant Grid */}
      <div className="grid gap-4">
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.location}</p>
            <p className="text-sm text-gray-500 mt-1">
              Cuisines: {restaurant.cuisinels?.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Average Spend: {restaurant.averageSpend}
            </p>
            <Link
              to={`/restaurants/${restaurant.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {restaurants.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          No restaurants found.
        </div>
      )}

      {/* Pagination */}
      {!searchActive && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 0}
            onClick={() => goToPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            disabled={currentPage + 1 >= pageCount}
            onClick={() => goToPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
