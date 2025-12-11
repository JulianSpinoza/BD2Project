import "./ListingsPage.css";
import ListingCard from "../../components/ListingCard/ListingCard";
import SearchFilters from "../../../../global/components/SearchFilters/SearchFilters.jsx";
import { useListingsContext } from "../../contexts/ListingsContext.jsx";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ListingsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filteredListings, setFilteredListings] = useState([]);

  const { 
    listings, 
    loading,
    error 
  } = useListingsContext();

  // Apply filters from URL params
  useEffect(() => {
    if (!listings || listings.length === 0) {
      setFilteredListings([]);
      return;
    }

    const location = searchParams.get("location") || "";
    const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : null;
    const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : null;

    const filtered = listings.filter((listing) => {
      // Filter by location (title or location field)
      if (location) {
        const matchLocation = 
          (listing.title && listing.title.toLowerCase().includes(location.toLowerCase())) ||
          (listing.location && listing.location.toLowerCase().includes(location.toLowerCase()));
        if (!matchLocation) return false;
      }

      // Filter by min price
      if (minPrice && listing.price < minPrice) return false;

      // Filter by max price
      if (maxPrice && listing.price > maxPrice) return false;

      return true;
    });

    setFilteredListings(filtered);
  }, [listings, searchParams]);

  const handleListingClick = (listing) => {
    navigate(`/listings/${listing.accomodationid || listing.id}`);
  };

  const handleFiltersChange = (filters) => {
    // URL is updated by SearchFilters component
    console.log("Filters applied:", filters);
  };

  return (
    <main className="home-hero">
      <div className="w-full">
        {/* Search Filters Bar */}
        <SearchFilters onFiltersChange={handleFiltersChange} />
        
        {/* Main Content */}
        <div className="home-main py-8">
          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-12">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          {/* NO RESULTS */}
          {!loading && !error && filteredListings.length === 0 && listings.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No properties found matching your filters.
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available.</p>
            </div>
          )}
          
          {/* Listings Grid */}
          {!loading && !error && filteredListings.length > 0 && (
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <div
                  key={listing.accomodationid || listing.id}
                  onClick={() => handleListingClick(listing)}
                  className="cursor-pointer"
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
