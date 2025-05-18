// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useSearchParams } from 'react-router-dom';
// import SearchBar from './SearchBar';

// const PAGE_SIZE = 10;

// export default function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [searchActive, setSearchActive] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currentPage = parseInt(searchParams.get('page')) || 0; // Get page from URL

//   useEffect(() => {
//     if (!searchActive) {
//       axios.get('http://localhost:8080/restaurants')
//         .then(res => {
//           // If paginated, use res.data.content
//           setRestaurants(res.data.content || res.data);
//         });
//     }
//   }, [searchActive]);

//   const handleSearchResults = (results) => {
//     setRestaurants(results);
//     setSearchActive(true);
//   };

//   // Handler to reset to all restaurants
//   const handleReset = () => {
//     setSearchActive(false);
//   };

//   useEffect(() => {
//     axios.get(`http://localhost:8080/restaurants?page=${currentPage}&size=${PAGE_SIZE}`)
//       .then(response => {
//         setRestaurants(response.data.content);
//         setPageCount(response.data.totalPages);
//       });
//   }, [currentPage]);

//   const goToPage = (page) => {
//     setSearchParams({ page: page.toString() }); // Update URL on page change
//   };

//   // return (
//   //   <div className="max-w-4xl mx-auto p-4">
//   //     <div className="flex justify-between items-center mb-4">
//   //       <h1 className="text-2xl font-bold">Restaurants</h1>
//   //       <Link 
//   //         to="/restaurants/nearby" 
//   //         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//   //       >
//   //         Find Restaurants Near Me
//   //       </Link>
//   //     </div>
//   //     {/* <h1 className="text-2xl font-bold mb-4">Restaurants</h1> */}
//   //     <div className="grid gap-4">
//   //       {restaurants.map(restaurant => (
//   //         <div key={restaurant.id} className="border p-4 rounded-lg shadow-sm">
//   //           <h2 className="text-xl font-semibold">{restaurant.name}</h2>
//   //           <p className="text-gray-600">{restaurant.location}</p>
//   //           <Link
//   //             to={`/restaurants/${restaurant.id}`}
//   //             state={{ fromPage: currentPage }} // Pass current page to detail
//   //             className="text-blue-600 hover:underline mt-2 inline-block"
//   //           >
//   //             View Details →
//   //           </Link>
//   //         </div>
//   //       ))}
//   //     </div>
//   //     <div className="flex justify-center mt-6 space-x-2">
//   //       <button
//   //         disabled={currentPage === 0}
//   //         onClick={() => goToPage(currentPage - 1)}
//   //         className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//   //       >
//   //         Previous
//   //       </button>
//   //       <span className="px-3 py-1">{currentPage + 1} / {pageCount}</span>
//   //       <button
//   //         disabled={currentPage + 1 >= pageCount}
//   //         onClick={() => goToPage(currentPage + 1)}
//   //         className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//   //       >
//   //         Next
//   //       </button>
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Restaurants</h1>
//         <Link
//           to="/restaurants/nearby"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Find Restaurants Near Me
//         </Link>
//       </div>
  
//       {/* Add the SearchBar here */}
//       <SearchBar onResults={handleSearchResults} />
//       {searchActive && (
//         <button
//           onClick={handleReset}
//           className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Show All Restaurants
//         </button>
//       )}
  
//       <div className="grid gap-4">
//         {restaurants.map(restaurant => (
//           <div key={restaurant.id} className="border p-4 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold">{restaurant.name}</h2>
//             <p className="text-gray-600">{restaurant.location}</p>
//             <Link
//               to={`/restaurants/${restaurant.id}`}
//               state={{ fromPage: currentPage }}
//               className="text-blue-600 hover:underline mt-2 inline-block"
//             >
//               View Details →
//             </Link>
//           </div>
//         ))}
//       </div>
  
//       {restaurants.length === 0 && (
//         <div className="mt-4 text-center text-gray-500">No restaurants to display.</div>
//       )}
  
//       {/* Hide pagination when search is active */}
//       {!searchActive && (
//         <div className="flex justify-center mt-6 space-x-2">
//           <button
//             disabled={currentPage === 0}
//             onClick={() => goToPage(currentPage - 1)}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="px-3 py-1">{currentPage + 1} / {pageCount}</span>
//           <button
//             disabled={currentPage + 1 >= pageCount}
//             onClick={() => goToPage(currentPage + 1)}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
  
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import SearchBar from './SearchBar';

// function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(1);
//   const [searchActive, setSearchActive] = useState(false);

//   // Fetch paginated restaurants (default view)
//   const fetchRestaurants = async (page = 0) => {
//     try {
//       const res = await axios.get('http://localhost:8080/restaurants', {
//         params: { page, size: 10 }
//       });
//       const data = res.data;
//       setRestaurants(data.content || data);
//       setPageCount(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (err) {
//       setRestaurants([]);
//     }
//   };

//   // Initial load and page changes
//   useEffect(() => {
//     if (!searchActive) {
//       fetchRestaurants(currentPage);
//     }
//     // eslint-disable-next-line
//   }, [currentPage, searchActive]);

//   // Handle search results
//   const handleSearchResults = (results) => {
//     setRestaurants(results);
//     setSearchActive(true);
//   };

//   // Handle empty search: show all restaurants
//   const handleEmptySearch = () => {
//     setSearchActive(false);
//     fetchRestaurants(0); // Reset to first page
//   };

//   // Reset to show all restaurants
//   const handleReset = () => {
//     setSearchActive(false);
//     fetchRestaurants(0);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Restaurants</h1>
//         <Link
//           to="/restaurants/nearby"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//         >
//           Find Restaurants Near Me
//         </Link>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <SearchBar onResults={handleSearchResults} onEmptySearch={handleEmptySearch} />
//         {searchActive && (
//           <button
//             onClick={handleReset}
//             className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
//           >
//             Show All Restaurants
//           </button>
//         )}
//       </div>

//       {/* Restaurant Grid */}
//       <div className="grid gap-4">
//         {restaurants.map(restaurant => (
//           <div key={restaurant.id} className="border p-4 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold">{restaurant.name}</h2>
//             <p className="text-gray-600">{restaurant.location}</p>
//             <Link
//               to={`/restaurants/${restaurant.id}`}
//               state={{ fromPage: currentPage }}
//               className="text-blue-600 hover:underline mt-2 inline-block"
//             >
//               View Details →
//             </Link>
//           </div>
//         ))}
//       </div>


//       {/* Empty State */}
//       {restaurants.length === 0 && (
//         <div className="mt-8 text-center text-gray-500">
//           No restaurants found.
//         </div>
//       )}

//       {/* Pagination (only show when not searching) */}
//       {!searchActive && (
//         <div className="flex justify-center mt-6 space-x-2">
//           <button
//             disabled={currentPage === 0}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2">
//             Page {currentPage + 1} of {pageCount}
//           </span>
//           <button
//             disabled={currentPage + 1 >= pageCount}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RestaurantList;


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

  // Handle search results
  const handleSearchResults = (results) => {
    setRestaurants(results);
    setSearchActive(true);
  };

  // Handle filter results
  // const applyFilters = (selected) => {
  //   const params = {};
  //   Object.keys(selected).forEach(key => {
  //     if (selected[key]) params[key] = selected[key];
  //   });
  
  //   axios.get('http://localhost:8080/restaurants/filter', { params })
  //     .then(res => {
  //       setRestaurants(res.data);
  //       setSearchActive(true);
  //     });
  // };
  
  const applyFilters = (selected) => {
    setFilters(selected); // Save filters for pagination
    const params = { page: 0, size: PAGE_SIZE }; // Always start at page 0 when filters change
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

  // const applyFilters = (selected) => {
  //   setFilters(selected);
  //   const params = { page: 0, size: 10 };
  //   Object.keys(selected).forEach(key => {
  //     // For cuisines, send each as a repeated param
  //     if (Array.isArray(selected[key]) && selected[key].length > 0) {
  //       params[key] = selected[key];
  //     } else if (selected[key]) {
  //       params[key] = selected[key];
  //     }
  //   });
  
  //   axios.get('http://localhost:8080/restaurants/filter', { params })
  //     .then(res => {
  //       setRestaurants(res.data.content || res.data);
  //       setPageCount(res.data.totalPages || 1);
  //       setPageCount(0);
  //       setSearchActive(true);
  //     });
  // };
  
  // Reset to show all restaurants
  const handleReset = () => {
    setSearchActive(false);
    setSearchParams({ page: '0' });
  };

  // Pagination handler
  const goToPage = (page) => {
    if (searchActive) {
      // Paginate filtered results
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

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar onResults={handleSearchResults} onEmptySearch={handleReset} />
        <div className="flex justify-between items-center mb-4">
  {/* <h1 className="text-2xl font-bold">Restaurants</h1> */}
  <div className="flex gap-2">
    <FiltersDropdown onFilter={applyFilters} />
    {/* <Link
      to="/restaurants/nearby"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Find Restaurants Near Me
    </Link> */}
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
