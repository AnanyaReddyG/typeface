import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Filters({ onFilter }) {
  const [options, setOptions] = useState({ countries: [], cuisines: [], spendRanges: [] });
  const [selected, setSelected] = useState({
    country: [],
    cuisine: [],
    spendRange: []
  });

  useEffect(() => {
    axios.get('http://localhost:8080/restaurants/filters')
      .then(res => setOptions(res.data));
  }, []);

  const handleCheckbox = (type, value) => {
    setSelected(prev => {
      const arr = prev[type];
      return {
        ...prev,
        [type]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value]
      };
    });
  };

  useEffect(() => {
    // Call onFilter whenever selected changes
    onFilter(selected);
    // eslint-disable-next-line
  }, [selected]);

  // Helper to render checkboxes
  const renderCheckboxes = (type, list) => (
    <div className="mb-2">
      <div className="font-semibold capitalize">{type}</div>
      {list.map(item => (
        <label key={item} className="block">
          <input
            type="checkbox"
            checked={selected[type].includes(item)}
            onChange={() => handleCheckbox(type, item)}
          />{' '}
          {item}
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-2">Filter Restaurants</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderCheckboxes('country', options.countries)}
        {renderCheckboxes('cuisine', options.cuisines)}
        {renderCheckboxes('spendRange', options.spendRanges)}
      </div>
    </div>
  );
}

export default Filters;
