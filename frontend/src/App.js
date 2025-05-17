// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import RestaurantList from './components/RestaurantList';
// import RestaurantDetail from './components/RestaurantDetail';
// import NearbyRestaurants from './components/NearbyRestaurants';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/restaurants" />} />
//         <Route path="/restaurants" element={<RestaurantList />} />
//         <Route path="/restaurants/:id" element={<RestaurantDetail />} />
//         <Route path="/restaurants/nearby" element={<NearbyRestaurants />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import NearbyRestaurants from './components/NearbyRestaurants';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/restaurants" />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/nearby" element={<NearbyRestaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
