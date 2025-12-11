import React, { useState, useEffect } from "react";
import ReservationCard from "../../components/ReservationCard/ReservationCard.jsx";
import CancelReservationModal from "../../components/CancelReservationModal/CancelReservationModal.jsx";
import { useAuthContext } from "../../../users/contexts/AuthContext.jsx";
import { BOOKINGS_ENDPOINTS } from "../../../../services/api/endpoints.js";

const HostReservationsDashboard = () => {
  const { axiosInstance } = useAuthContext();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, upcoming, past, cancelled
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar reservas desde el API
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (!axiosInstance) {
          setError("No hay instancia de axios configurada");
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get(BOOKINGS_ENDPOINTS.HOST_RESERVATIONS);
        console.log("Reservas obtenidas:", response.data);
        
        // Mapear respuesta del backend al formato esperado por el componente
        const formattedReservations = response.data.map((booking) => ({
          id: booking.bookingid,
          property: {
            id: booking.listing_id,
            title: booking.listing_title,
            location: booking.listing_location,
            image: booking.listing_image,
          },
          guest: {
            id: booking.guest,
            name: booking.guest_name,
            email: booking.guest_email,
            avatar: booking.guest_avatar,
          },
          start_date: booking.check_in_date,
          end_date: booking.check_out_date,
          status: booking.status,
          total_price: booking.total_price,
          created_at: booking.created_at,
        }));

        setReservations(formattedReservations);
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        if (err.response?.status === 401) {
          setError("Debes estar autenticado para ver tus reservas");
        } else {
          setError("Error al cargar las reservas");
        }
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [axiosInstance]);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = reservations;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    const today = new Date();
    if (activeFilter === "upcoming") {
      filtered = filtered.filter(
        (res) =>
          new Date(res.start_date) > today && res.status === "confirmed"
      );
    } else if (activeFilter === "past") {
      filtered = filtered.filter(
        (res) =>
          new Date(res.end_date) < today && res.status !== "cancelled"
      );
    } else if (activeFilter === "cancelled") {
      filtered = filtered.filter((res) => res.status === "cancelled");
    }

    setFilteredReservations(filtered);
  }, [searchTerm, activeFilter, reservations]);

  // Manejar cancelación
  const handleCancelReservation = async (reservationId) => {
    setIsCancelling(true);
    try {
      // Actualizar optimistamente en la UI
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "cancelled" } : res
        )
      );
      
      setIsCancelModalOpen(false);
      setSuccessMessage("Reserva cancelada correctamente");

      // Llamar al API para cancelar la reserva
      try {
        await axiosInstance.patch(BOOKINGS_ENDPOINTS.CANCEL(reservationId), {
          status: "cancelled"
        });
      } catch (apiError) {
        console.error("Error al cancelar en el backend:", apiError);
        // Revertir cambio optimista en caso de error del API
        setReservations((prev) =>
          prev.map((res) =>
            res.id === reservationId 
              ? { ...res, status: "confirmed" } 
              : res
          )
        );
        setError("Error al cancelar la reserva. Intenta de nuevo.");
        setSuccessMessage("");
        return;
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error al cancelar la reserva");
      console.error(err);
      // Revertir cambio optimista en caso de error
      const updatedReservations = reservations.map((res) =>
        res.id === reservationId ? { ...res, status: "confirmed" } : res
      );
      setReservations(updatedReservations);
    } finally {
      setIsCancelling(false);
    }
  };

  // Abrir modal de confirmación
  const handleOpenCancelModal = (reservationId) => {
    setSelectedReservationId(reservationId);
    setIsCancelModalOpen(true);
  };

  const selectedReservation = reservations.find(
    (res) => res.id === selectedReservationId
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reservas hechas a mis alojamientos
          </h1>
          <p className="text-gray-600">
            Gestiona todas las reservas de tus propiedades
          </p>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Buscador y Filtros */}
        <div className="mb-6 space-y-4">
          {/* Buscador */}
          <div className="relative">
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por propiedad o nombre de huésped..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todas", icon: "📋" },
              { key: "upcoming", label: "Próximas", icon: "📅" },
              { key: "past", label: "Pasadas", icon: "✅" },
              { key: "cancelled", label: "Canceladas", icon: "❌" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter.key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de reservas */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {/* Contador */}
            <p className="text-sm text-gray-600 mb-4">
              {filteredReservations.length}{" "}
              {filteredReservations.length === 1 ? "reserva" : "reservas"}
            </p>

            {/* Tarjetas de reserva */}
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                showGuestInfo={true}
                isHost={true}
                onCancel={handleOpenCancelModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No hay reservas
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No hay reservas que coincidan con tu búsqueda"
                : "Todavía no tienes reservas en este período"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmación de cancelación */}
      <CancelReservationModal
        isOpen={isCancelModalOpen}
        reservationId={selectedReservationId}
        propertyTitle={selectedReservation?.property?.title || ""}
        onConfirm={handleCancelReservation}
        onCancel={() => setIsCancelModalOpen(false)}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default HostReservationsDashboard;
