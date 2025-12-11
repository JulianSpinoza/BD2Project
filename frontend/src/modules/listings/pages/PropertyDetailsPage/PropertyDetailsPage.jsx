import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../../components/BookingWidget/BookingWidget.jsx";

/**
 * PropertyDetailsPage
 * Airbnb-style property details view with:
 * - Hero image grid (1 large left + 4 small right)
 * - Property info and amenities
 * - Sticky booking widget placeholder
 */
const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock property data - replace with API call later
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProperty = {
        id: parseInt(id) || 1,
        title: "Beautiful Colonial House in Cartagena",
        location: "Cartagena, Bolívar",
        price: 250000,
        rating: 4.9,
        reviews: 128,
        host: {
          name: "María López",
          avatar: "M",
          isSuperhost: true,
        },
        description:
          "Experience the charm of colonial Cartagena in this beautifully restored house. Located in the historic walled city, this property features high ceilings, traditional architecture, and modern amenities. Perfect for couples or small families wanting to explore Colombia's Caribbean coast.",
        images: [
          "https://images.unsplash.com/photo-1520932057f7-6fb3009d1fea?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517214712202-14719c45a6e0?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1537090151319-8658a29e5e73?w=400&h=300&fit=crop",
        ],
        amenities: [
          { icon: "🛏️", name: "2 Bedrooms" },
          { icon: "🚿", name: "2 Bathrooms" },
          { icon: "🍳", name: "Full Kitchen" },
          { icon: "📺", name: "Smart TV" },
          { icon: "🌐", name: "WiFi" },
          { icon: "❄️", name: "Air Conditioning" },
          { icon: "🧺", name: "Washer" },
          { icon: "🅿️", name: "Free Parking" },
        ],
        highlights: [
          "Entire home hosted by a Superhost",
          "Self check-in with smart lock",
          "Free cancellation before 7 days",
          "English and Spanish spoken",
        ],
      };
      setProperty(mockProperty);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image Grid */}
      <div className="w-full bg-gray-200 relative">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 aspect-video lg:aspect-auto lg:h-96">
            {/* Main image (left, large) */}
            <div className="lg:col-span-2 lg:row-span-2 rounded-lg overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* 4 smaller images (right) */}
            {property.images.slice(1, 5).map((image, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden hidden lg:block">
                <img
                  src={image}
                  alt={`${property.title} ${idx + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Image count on mobile */}
          <div className="lg:hidden mt-2 text-sm text-gray-600">
            📷 {property.images.length} photos
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Property Info */}
          <div className="lg:col-span-2">
            {/* Header: Title & Location */}
            <div className="mb-6 pb-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>📍 {property.location}</span>
                <span className="flex items-center gap-1">
                  ⭐ {property.rating} · {property.reviews} reviews
                </span>
              </div>
            </div>

            {/* Host Info */}
            <div className="mb-6 pb-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {property.host.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Hosted by {property.host.name}
                  </p>
                  {property.host.isSuperhost && (
                    <p className="text-xs text-gray-600">🏆 Superhost</p>
                  )}
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Contact Host
              </button>
            </div>

            {/* Highlights */}
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About this property
              </h2>
              <ul className="space-y-3">
                {property.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="text-lg">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="text-gray-700 font-medium">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section (placeholder) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews ({property.reviews})
              </h2>
              <p className="text-gray-600">
                Review section coming soon - {property.reviews} guests loved
                this property
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              propertyId={property.id}
              pricePerNight={property.price}
              rating={property.rating}
              reviews={property.reviews}
              onReservationSuccess={(reservation) => {
                console.log("✓ Reservation successful:", reservation);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
