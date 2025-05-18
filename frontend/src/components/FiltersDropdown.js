import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FiltersDropdown({ onFilter }) {
  const [showFilters, setShowFilters] = useState(false);
  const [options, setOptions] = useState({
    countries: [],
    cuisines: [],
    spendRanges: []
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    country: false,
    cuisine: false,
    spendRange: false
  });
  const [selected, setSelected] = useState({
    country: '',
    cuisine: '',
    spendRange: ''
  });

  useEffect(() => {
    axios.get('http://localhost:8080/restaurants/filters')
      .then(res => setOptions(res.data));
  }, []);

  const handleDropdown = (type) => {
    setDropdownOpen(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSelect = (type, value) => {
    const updated = { ...selected, [type]: value };
    setSelected(updated);
    setDropdownOpen({ country: false, cuisine: false, spendRange: false });
    onFilter(updated);
  };

  const handleClear = () => {
    setSelected({ country: '', cuisine: '', spendRange: '' });
    onFilter({ country: '', cuisine: '', spendRange: '' });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowFilters(v => !v)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
      >
        Filters
      </button>
      {showFilters && (
        <div className="absolute z-10 bg-white border rounded shadow-lg mt-2 p-4 min-w-[220px]">
          {/* Country Dropdown */}
          <div className="mb-2">
            <button
              type="button"
              className="w-full text-left px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => handleDropdown('country')}
            >
              Country {selected.country && `: ${selected.country}`}
            </button>
            {dropdownOpen.country && (
              <div className="border rounded mt-1 bg-white shadow">
                {options.countries.map(c => (
                  <div
                    key={c}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelect('country', c)}
                  >
                    {c}
                  </div>
                ))}
                <div
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect('country', '')}
                >
                  (Any)
                </div>
              </div>
            )}
          </div>
          {/* Cuisine Dropdown */}
          <div className="mb-2">
            <button
              type="button"
              className="w-full text-left px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => handleDropdown('cuisine')}
            >
              Cuisine {selected.cuisine && `: ${selected.cuisine}`}
            </button>
            {dropdownOpen.cuisine && (
              <div className="border rounded mt-1 bg-white shadow">
                {options.cuisines.map(c => (
                  <div
                    key={c}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelect('cuisine', c)}
                  >
                    {c}
                  </div>
                ))}
                <div
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect('cuisine', '')}
                >
                  (Any)
                </div>
              </div>
            )}
          </div>
          {/* Spend Range Dropdown */}
          <div className="mb-2">
            <button
              type="button"
              className="w-full text-left px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => handleDropdown('spendRange')}
            >
              Avg Spend {selected.spendRange && `: ${selected.spendRange}`}
            </button>
            {dropdownOpen.spendRange && (
              <div className="border rounded mt-1 bg-white shadow">
                {options.spendRanges.map(s => (
                  <div
                    key={s}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelect('spendRange', s)}
                  >
                    {s}
                  </div>
                ))}
                <div
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect('spendRange', '')}
                >
                  (Any)
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleClear}
            className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 w-full"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}