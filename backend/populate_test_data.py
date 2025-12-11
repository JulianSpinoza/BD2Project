#!/usr/bin/env python
"""
Script para poblar la BD con datos de prueba para testing
Uso: python manage.py shell < populate_test_data.py
O: poetry run python manage.py shell
   >>> exec(open('populate_test_data.py').read())
"""
import django
import os
from datetime import datetime, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users_service.models import CustomUser
from listings_service.models import Municipality, Department, Region, Listing, Booking

# Limpiar datos anteriores (opcional)
print("Limpiando datos anteriores...")
Booking.objects.all().delete()
Listing.objects.all().delete()
CustomUser.objects.filter(username__startswith='test').delete()

# Crear región, departamento y municipio
print("Creando estructura geográfica...")
region = Region.objects.create(name="Cundinamarca")
department = Department.objects.create(region=region, name="Cundinamarca")
municipality = Municipality.objects.create(department=department, name="Bogotá")

# Crear usuarios
print("Creando usuarios...")
host = CustomUser.objects.create_user(
    username='testhost',
    email='host@example.com',
    password='testpass123',
    first_name='Juan',
    last_name='Ospina'
)

guest1 = CustomUser.objects.create_user(
    username='testguest1',
    email='guest1@example.com',
    password='testpass123',
    first_name='Carlos',
    last_name='Mendoza'
)

guest2 = CustomUser.objects.create_user(
    username='testguest2',
    email='guest2@example.com',
    password='testpass123',
    first_name='María',
    last_name='Rodríguez'
)

guest3 = CustomUser.objects.create_user(
    username='testguest3',
    email='guest3@example.com',
    password='testpass123',
    first_name='Laura',
    last_name='Gómez'
)

# Crear propiedades (listings)
print("Creando propiedades...")
listing1 = Listing.objects.create(
    owner=host,
    municipality=municipality,
    title="Apartamento Moderno en Bogotá",
    description="Hermoso apartamento con vistas a la ciudad",
    bedrooms=2,
    bathrooms=1,
    locationdesc="Teusaquillo, Bogotá",
    addresstext="Cra 15 #124-45",
    propertytype="apartment",
    pricepernight=250000,
    maxguests=4
)

listing2 = Listing.objects.create(
    owner=host,
    municipality=municipality,
    title="Casa Campestre con Piscina",
    description="Ideal para familias y grupos grandes",
    bedrooms=4,
    bathrooms=2,
    locationdesc="La Vega, Cundinamarca",
    addresstext="Vereda El Roble",
    propertytype="house",
    pricepernight=400000,
    maxguests=8
)

# Crear reservas (bookings)
print("Creando reservas...")
today = datetime.now().date()

# Reserva próxima confirmada
booking1 = Booking.objects.create(
    listing=listing1,
    guest=guest1,
    check_in_date=today + timedelta(days=10),
    check_out_date=today + timedelta(days=15),
    number_of_guests=2,
    total_price=Decimal("1250000.00"),
    status="confirmed"
)

# Reserva próxima confirmada
booking2 = Booking.objects.create(
    listing=listing1,
    guest=guest2,
    check_in_date=today + timedelta(days=20),
    check_out_date=today + timedelta(days=25),
    number_of_guests=4,
    total_price=Decimal("1250000.00"),
    status="confirmed"
)

# Reserva pasada completada
booking3 = Booking.objects.create(
    listing=listing2,
    guest=guest3,
    check_in_date=today - timedelta(days=30),
    check_out_date=today - timedelta(days=25),
    number_of_guests=6,
    total_price=Decimal("2000000.00"),
    status="completed"
)

# Reserva cancelada
booking4 = Booking.objects.create(
    listing=listing2,
    guest=guest1,
    check_in_date=today - timedelta(days=5),
    check_out_date=today,
    number_of_guests=4,
    total_price=Decimal("1200000.00"),
    status="cancelled"
)

print("\n✅ Datos de prueba creados exitosamente!")
print(f"\nHost: {host.username} ({host.email})")
print(f"Propiedades: {Listing.objects.count()}")
print(f"Reservas: {Booking.objects.count()}")
print(f"\nCredenciales para testing:")
print(f"  Usuario: testhost")
print(f"  Contraseña: testpass123")
