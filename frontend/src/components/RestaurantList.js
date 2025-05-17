import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const PAGE_SIZE = 10;

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 0; // Get page from URL

  useEffect(() => {
    axios.get(`http://localhost:8080/restaurants?page=${currentPage}&size=${PAGE_SIZE}`)
      .then(response => {
        setRestaurants(response.data.content);
        setPageCount(response.data.totalPages);
      });
  }, [currentPage]);

  const goToPage = (page) => {
    setSearchParams({ page: page.toString() }); // Update URL on page change
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Link 
          to="/restaurants/nearby" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Find Restaurants Near Me
        </Link>
      </div>
      {/* <h1 className="text-2xl font-bold mb-4">Restaurants</h1> */}
      <div className="grid gap-4">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.location}</p>
            <Link
              to={`/restaurants/${restaurant.id}`}
              state={{ fromPage: currentPage }} // Pass current page to detail
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={currentPage === 0}
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">{currentPage + 1} / {pageCount}</span>
        <button
          disabled={currentPage + 1 >= pageCount}
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
