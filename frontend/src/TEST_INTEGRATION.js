/**
 * Test Script para verificar la integración Frontend-Backend
 * Ejecutar en la consola del navegador cuando la página está cargada
 */

// Función para obtener el token JWT
async function getAuthToken() {
  const credentials = {
    username: 'testhost',
    password: 'testpass123'
  };
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Login exitoso:', data);
    return data.access;
  } catch (error) {
    console.error('❌ Error en login:', error);
    return null;
  }
}

// Función para obtener las reservas del host
async function getHostReservations(token) {
  if (!token) {
    console.error('❌ No hay token de autenticación');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/host-reservations/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Reservas obtenidas:', data);
    console.table(data.map(r => ({
      id: r.bookingid,
      guest: r.guest_name,
      property: r.listing_title,
      checkIn: r.check_in_date,
      checkOut: r.check_out_date,
      status: r.status,
      price: r.total_price
    })));
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    return null;
  }
}

// Función para ejecutar todo el test
async function runIntegrationTest() {
  console.log('🚀 Iniciando test de integración...\n');
  
  console.log('1️⃣  Obteniendo token JWT...');
  const token = await getAuthToken();
  
  if (!token) {
    console.error('❌ No se pudo obtener el token');
    return;
  }
  
  console.log(`\n2️⃣  Obteniendo reservas con token: ${token.substring(0, 20)}...\n`);
  const reservations = await getHostReservations(token);
  
  if (reservations) {
    console.log('\n✅ Test completado exitosamente!');
    console.log(`Total de reservas: ${reservations.length}`);
  } else {
    console.error('\n❌ El test falló');
  }
}

// Ejecutar el test
// runIntegrationTest();

console.log('📋 Script de test cargado. Ejecuta: runIntegrationTest()');
