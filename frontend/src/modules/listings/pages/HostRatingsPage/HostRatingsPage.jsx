import React, { useState, useEffect } from "react";
import "./HostRatingsPage.css";

const HostRatingsPage = () => {
  // este contiene alojamiento y ratings
  const [accommodations, setAccommodations] = useState([]);
  // Sirve para controlar errores y carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  useEffect(() => {
    const fetchHostRatings = async () => {
      try {
        setLoading(true);
        // No se bien como conectarel endpoint con el backend :c
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load ratings");
        setLoading(false);
      }
    };
    fetchHostRatings();
  }, []);

  // Mostrar la carga mientras se está obteniendo datos, no se si ponerle un timeout
  if (loading) return <div className="p-8">Loading ratings...</div>;
  
  // Si hay un error entonces mostrarlo
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="host-ratings-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Ratings</h1>
          <p className="text-gray-600">
            View ratings and reviews from guests who stayed at your properties
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*A la izquierda estan los alojamientos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {accommodations.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No properties yet
                  </div>
                ) : (
                  accommodations.map((accommodation) => (
                    <button
                      key={accommodation.id}
                      onClick={() => setSelectedAccommodation(accommodation)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedAccommodation?.id === accommodation.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : ""
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {accommodation.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {/* Promedio de calificación, verificar simbolo */}
                        ⭐ {accommodation.averageRating?.toFixed(1) || "N/A"} ({accommodation.ratingCount || 0})
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* En la columna derecha el detalle de calificaciones */}
          <div className="lg:col-span-2">
            {selectedAccommodation ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedAccommodation.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-bold text-yellow-500">
                        {selectedAccommodation.averageRating?.toFixed(1) || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {selectedAccommodation.ratingCount || 0} reviews
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de ratings */}
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {selectedAccommodation.ratings && selectedAccommodation.ratings.length > 0 ? (
                    selectedAccommodation.ratings.map((rating) => (
                      <div key={rating.id} className="p-4 hover:bg-gray-50 transition-colors">
                        {/* Muestra el encabezado que le hallan puesto al rating */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {rating.guestName || "Anonymous Guest"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {/* Fecha del rating */}
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {/* Muestra las estrellas, si el logo se ve mal editarlo por una imagen o algo */}
                          <div className="text-lg">
                            {"⭐".repeat(rating.rating)}
                          </div>
                        </div>
                        {/* Pa mostrar comentarios de la reseña */}
                        {rating.comment && (
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {rating.comment}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No reviews yet for this property
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  Select a property to view its ratings and reviews
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostRatingsPage;
