from users_service.serializers import UserRegisterSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg

from .models import Municipality, Listing, Rating, Booking
from .serializers import ListingSerializer, RatingSerializer, PublishListingSerializer, BookingSerializer
from django.shortcuts import get_object_or_404


class hostListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        #nos trae las propiedades del usuario host autenticado
        if not self.request.user or not self.request.user.is_authenticated:
            return Listing.objects.none()
        return Listing.objects.filter(user=self.request.user)
    

class ListingListView(generics.ListAPIView):
    
    serializer_class = ListingSerializer

    # select_related to INNER JOIN the user model
    #queryset = Listing.objects.select_related('user').all()

    def get_queryset(self):
        qs = Listing.objects.all()
        nameMunicipality = self.request.query_params.get('municipality', None)
        
        if nameMunicipality is not None:

            m = Municipality.objects.get(name=nameMunicipality)
            
            try:
                qs = qs.filter(
                    municipality=m.municipalityid
                )
            except ValueError:
                # Left to insert some log
                print('Error!!!!')
                return qs.none()

        return qs


class ListingDetailView(generics.RetrieveAPIView):
    """Detalle de un listing por pk (accomodationid)."""
    serializer_class = ListingSerializer
    lookup_field = 'pk'
    queryset = Listing.objects.all()

class HostRatingsView(generics.ListAPIView):
    #Vista para obtener todos los ratings de las propiedades del host que está ctualmente
    serializer_class = RatingSerializer
    
    def get_queryset(self):
        #nos trae los ratings del usuario host autenticado
        if not self.request.user or not self.request.user.is_authenticated:
            return Rating.objects.none()
        
        host_listings = Listing.objects.filter(user=self.request.user)
        return Rating.objects.filter(listing__in=host_listings).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        # if not request.user or not request.user.is_authenticated:
        #     print("Usuario no autenticado")
        #     return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # Obtener todas las propiedades del host
        print("Usuario autenticado:", request.user)
        host_listings = Listing.objects.filter(owner=request.user)
        
        ratings_data = []
        for listing in host_listings:
            listing_ratings = Rating.objects.filter(listing=listing)
            avg_rating = listing_ratings.aggregate(Avg('rating'))['rating__avg']
            
            ratings_data.append({
                'listing_id': listing.accomodationid,
                'listing_title': listing.title,
                'average_rating': avg_rating if avg_rating else 0,
                'rating_count': listing_ratings.count(),
                'ratings': RatingSerializer(listing_ratings, many=True).data
            })
        
        return Response(ratings_data)
    
class PublishProperty(APIView):
    def post(self, request):
        # Pasr municipality de name a id
        print(f"Datos recibidos: {request.data}")
        print(f"Usuario recibido: {request.user}")
        property = request.data
        try:
            city = Municipality.objects.get(name=property.pop('city'))
        except Municipality.DoesNotExist:
            print("Error: Municipality could not be found")
        except Municipality.MultipleObjectsReturned:
            print("Error: Multiple municipalities found")
        else:
            print(f"Id ciudad:{city}")
            serializer = PublishListingSerializer(data=property)
            serializeruser = UserRegisterSerializer(data=request.user)
            if serializer.is_valid():

                serializer.save(owner=request.user,municipality=city)
                serializeruser.update_host_status(is_host=True, user=request.user)
                return Response(
                    {
                        "message": "Property created successfully.",
                    },
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HostReservationsView(generics.ListAPIView):
    """
    Vista para obtener todas las reservas de las propiedades del host autenticado.
    Sin usar rest_framework.permissions, validación manual en el método list().
    """
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        """Filtrar reservas por propiedades del host autenticado"""
        if not self.request.user or not self.request.user.is_authenticated:
            return Booking.objects.none()
        
        # Obtener todas las propiedades del host
        host_listings = Listing.objects.filter(owner=self.request.user)
        # Retornar reservas de esas propiedades
        return Booking.objects.filter(listing__in=host_listings).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Override del método list para validación manual de autenticación"""
        # Validación manual sin usar rest_framework.permissions
        if not request.user or not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida. Por favor, inicia sesión.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return super().list(request, *args, **kwargs)


class CreateBookingView(APIView):
    """Crear una nueva reserva (booking) por el usuario autenticado.
    Validación manual de autenticación sin usar rest_framework.permissions.
    """
    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Autenticación requerida.'}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data

        # Aceptar 'property_id' o 'listing' en el payload
        listing_id = data.get('property_id') or data.get('listing')
        if not listing_id:
            return Response({'error': 'Missing property_id/listing'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener el listing
        listing = get_object_or_404(Listing, pk=listing_id)

        # Extraer campos mínimos
        try:
            check_in = data.get('start_date') or data.get('check_in_date')
            check_out = data.get('end_date') or data.get('check_out_date')
            guests = int(data.get('guests') or data.get('number_of_guests') or 1)
            total_price = data.get('total_price')
        except (ValueError, TypeError):
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(
            listing=listing,
            guest=request.user,
            check_in_date=check_in,
            check_out_date=check_out,
            number_of_guests=guests,
            total_price=total_price,
            status=data.get('status', 'confirmed')
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserReservationsView(generics.ListAPIView):
    """Lista las reservas del usuario autenticado (guest).
    Validación manual de autenticación en `list()`.
    """
    serializer_class = BookingSerializer

    def get_queryset(self):
        if not self.request.user or not self.request.user.is_authenticated:
            return Booking.objects.none()
        return Booking.objects.filter(guest=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Autenticación requerida.'}, status=status.HTTP_401_UNAUTHORIZED)
        return super().list(request, *args, **kwargs)


class CancelReservationView(APIView):
    """Patch endpoint to cancel a reservation. Validates that the requester
    is either the guest who made the booking or the owner of the listing."""
    def patch(self, request, pk):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Autenticación requerida.'}, status=status.HTTP_401_UNAUTHORIZED)

        booking = get_object_or_404(Booking, pk=pk)

        # Only guest or listing owner can cancel
        is_guest = booking.guest == request.user
        is_owner = booking.listing.owner == request.user
        if not (is_guest or is_owner):
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        booking.status = 'cancelled'
        booking.save()

        return Response({'message': 'Reserva cancelada'}, status=status.HTTP_200_OK)
