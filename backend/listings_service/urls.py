from django.urls import path
from .views import CancelReservationView, ListingDetailView, ListingListView, hostListingsView, HostReservationsView, CreateBookingView, UserReservationsView
from .views import PublishProperty
from .views import HostRatingsView

urlpatterns = [
    path('listings/', ListingListView.as_view(), name='listing-list'),
    path('publish-listing/', PublishProperty.as_view(), name='publish-property'),
    path('host-ratings/', HostRatingsView.as_view(), name='host-ratings'),
    path('hostreservations/', hostListingsView.as_view(), name='host-listings'),
    path('host-reservations/', HostReservationsView.as_view(), name='host-reservations'),
    path('bookings/', CreateBookingView.as_view(), name='create-booking'),
    path('user-reservations/', UserReservationsView.as_view(), name='user-reservations'),
    path('listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
    path('reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),
]