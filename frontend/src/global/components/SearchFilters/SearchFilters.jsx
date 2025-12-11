import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * SearchFilters
 * Sticky filter bar with location input and price range
 * Props:
 * - onFiltersChange(filters) -> callback when filters change
 */
const SearchFilters = ({ onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update URL params and call parent callback when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);

    // Update URL
    navigate(`?${params.toString()}`, { replace: true });

    // Call parent callback
    if (onFiltersChange) {
      onFiltersChange({
        location,
        min_price: minPrice ? Number(minPrice) : null,
        max_price: maxPrice ? Number(maxPrice) : null,
      });
    }
  }, [location, minPrice, maxPrice, navigate, onFiltersChange]);

  const handleReset = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    navigate("?", { replace: true });
  };

  const hasFilters = location || minPrice || maxPrice;

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Main filters row */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Location filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Price filter toggle button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {showAdvanced ? "Hide Filters" : "Price & More"}
            </button>

            {/* Reset button */}
            {hasFilters && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced filters (price range) */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-t pt-3">
              {/* Min Price */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Min Price (COP)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max Price (COP)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          )}

          {/* Active filters display */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 text-xs">
              {location && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  📍 {location}
                </span>
              )}
              {minPrice && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  💵 Min: ${minPrice}
                </span>
              )}
              {maxPrice && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  💵 Max: ${maxPrice}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
