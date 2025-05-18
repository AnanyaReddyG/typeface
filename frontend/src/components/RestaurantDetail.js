import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';

export default function RestaurantDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(null);
  const fromPage = location.state?.fromPage || 0; 

  useEffect(() => {
    axios.get(`http://localhost:8080/restaurants/num/${id}`)
      .then(response => setRestaurant(response.data));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded shadow">
      <Link 
        to={`/restaurants?page=${fromPage}`} 
        className="mb-4 text-blue-600 hover:underline block"
      >
        &larr; Back to List
      </Link>
      <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
      <div className="mb-2"><strong>Location:</strong> {restaurant.location}</div>
      <div className="mb-2"><strong>Cuisines:</strong> {restaurant.cuisines}</div>
      <div className="mb-2"><strong>Rating:</strong> {restaurant.rating}</div>
    </div>
  );
}
