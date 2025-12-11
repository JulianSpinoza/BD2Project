# Testing Guide - Sistema de Reservas

## 🧪 Test Cases Completos

### Pruebas Locales (Sin Backend)

---

## ReservationCard Tests

### Test 1: Renderizado básico
**Setup:**
```javascript
const reservation = {
  id: "RES001",
  property: { title: "Apartamento", location: "Bogotá", image: "..." },
  start_date: "2025-12-20",
  end_date: "2025-12-25",
  status: "confirmed",
  total_price: 850000
};
```

**Pasos:**
1. Renderizar `<ReservationCard reservation={reservation} />`
2. Verificar que aparece la tarjeta

**Esperado:**
- ✅ Imagen visible
- ✅ Título "Apartamento"
- ✅ Ubicación "Bogotá"
- ✅ Badge "Confirmada" en verde
- ✅ Fecha formateada "dic 20, 2025 → dic 25, 2025"
- ✅ "5 noches" visible
- ✅ Precio "$850.000"

---

### Test 2: Botón Cancelar visible (fecha futura)
**Setup:**
```javascript
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 10);
const reservation = {
  // ...
  start_date: futureDate.toISOString().split('T')[0],
  status: "confirmed"
};

const handleCancel = jest.fn();
```

**Pasos:**
1. Renderizar con fecha futura y callback
2. Hacer hover sobre tarjeta

**Esperado:**
- ✅ Botón "Cancelar" aparece
- ✅ Botón es clickeable
- ✅ Click llama a `handleCancel(reservation.id)`

---

### Test 3: Botón Cancelar oculto (fecha pasada)
**Setup:**
```javascript
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 10);
const reservation = {
  // ...
  start_date: pastDate.toISOString().split('T')[0],
  status: "confirmed"
};
```

**Pasos:**
1. Renderizar con fecha pasada
2. Mirar tarjeta

**Esperado:**
- ✅ Botón "Cancelar" NO aparece
- ✅ Texto "No se puede cancelar" visible

---

### Test 4: Estados de Badge
**Setup Múltiple:**

Status: "confirmed"
- **Esperado:** Badge verde "Confirmada"

Status: "pending"
- **Esperado:** Badge amarillo "Pendiente"

Status: "cancelled"
- **Esperado:** Badge gris "Cancelada"
- **Y:** Botón cancelar oculto

Status: "completed"
- **Esperado:** Badge azul "Completada"

---

### Test 5: Información del Huésped
**Setup:**
```javascript
const reservation = {
  // ...
  guest: { name: "Carlos Mendoza", email: "..." }
};
```

**Pasos:**
1. Renderizar con `showGuestInfo={true}`

**Esperado:**
- ✅ "👤 Carlos Mendoza" visible
- ✅ Nombre correcto

**Pasos 2:**
1. Renderizar con `showGuestInfo={false}`

**Esperado:**
- ✅ Información del huésped NO visible

---

### Test 6: Cálculo de Noches
**Cases:**
```javascript
// Case 1: 5 noches
start: "2025-12-20", end: "2025-12-25"
// Esperado: "5 noches"

// Case 2: 1 noche
start: "2025-12-20", end: "2025-12-21"
// Esperado: "1 noche" (singular)

// Case 3: 7 noches
start: "2025-12-20", end: "2025-12-27"
// Esperado: "7 noches"
```

---

## CancelReservationModal Tests

### Test 1: Modal Cerrado
**Setup:**
```javascript
<CancelReservationModal isOpen={false} />
```

**Esperado:**
- ✅ Nada renderizado
- ✅ No hay elementos en el DOM

---

### Test 2: Modal Abierto
**Setup:**
```javascript
<CancelReservationModal
  isOpen={true}
  reservationId="RES001"
  propertyTitle="Apartamento Moderno"
  onConfirm={jest.fn()}
  onCancel={jest.fn()}
/>
```

**Esperado:**
- ✅ Backdrop visible
- ✅ Modal centrado
- ✅ Icono de advertencia rojo
- ✅ Título "¿Cancelar reserva?"
- ✅ Descripción clara
- ✅ Nombre de propiedad destacado
- ✅ Aviso sobre irreversibilidad
- ✅ Dos botones

---

### Test 3: Cerrar Modal (Click Backdrop)
**Pasos:**
1. Modal abierto
2. Click en área oscura (backdrop)

**Esperado:**
- ✅ `onCancel()` llamado
- ✅ Modal cerrado

---

### Test 4: Cerrar Modal (Botón)
**Pasos:**
1. Modal abierto
2. Click en "Mantener Reserva"

**Esperado:**
- ✅ `onCancel()` llamado
- ✅ Modal cerrado

---

### Test 5: Confirmar Cancelación
**Pasos:**
1. Modal abierto
2. Click en "Sí, Cancelar"

**Esperado:**
- ✅ `onConfirm(reservationId)` llamado con ID correcto
- ✅ Botones deshabilitados mientras se procesa

---

### Test 6: Estado de Carga
**Setup:**
```javascript
<CancelReservationModal
  isLoading={true}
  // ...
/>
```

**Esperado:**
- ✅ Spinner visible
- ✅ Botones deshabilitados
- ✅ Texto cambia a "Cancelando..."

---

## HostReservationsDashboard Tests

### Test 1: Cargar y mostrar reservas
**Pasos:**
1. Montar componente
2. Esperar a que cargue

**Esperado:**
- ✅ 4 tarjetas de reserva visible
- ✅ No hay spinner
- ✅ Contador muestra "4 reservas"

---

### Test 2: Filtro "Próximas"
**Pasos:**
1. Montar componente
2. Click en botón "Próximas"

**Setup Esperado (Próximas):**
- start_date > today Y status="confirmed"

**Resultado:**
- ✅ Solo 2 tarjetas visibles (RES001, RES004)
- ✅ Contador: "2 reservas"
- ✅ RES002 (completada) desaparece
- ✅ RES003 (cancelada) desaparece

---

### Test 3: Filtro "Pasadas"
**Pasos:**
1. Click en botón "Pasadas"

**Esperado:**
- ✅ Solo reservas con end_date < today
- ✅ Status ≠ "cancelled"
- ✅ Mostrar: RES002 (completed)
- ✅ Contar: "1 reserva"

---

### Test 4: Filtro "Canceladas"
**Pasos:**
1. Click en botón "Canceladas"

**Esperado:**
- ✅ Solo status = "cancelled"
- ✅ Mostrar: RES003
- ✅ Contar: "1 reserva"

---

### Test 5: Búsqueda por Propiedad
**Pasos:**
1. Escribir "Bogotá" en buscador
2. Presionar Enter o esperar onChange

**Esperado:**
- ✅ Solo propiedades en Bogotá
- ✅ RES001, RES002 visibles
- ✅ Contar: "2 reservas"

---

### Test 6: Búsqueda por Huésped
**Pasos:**
1. Escribir "Carlos" en buscador

**Esperado:**
- ✅ Solo reservas de Carlos Mendoza
- ✅ RES001 visible
- ✅ Contar: "1 reserva"

---

### Test 7: Búsqueda Combinada
**Pasos:**
1. Escribir "Carlos" en buscador
2. Click en filtro "Próximas"

**Esperado:**
- ✅ Reservas de Carlos Y próximas
- ✅ RES001 visible
- ✅ Contar: "1 reserva"

---

### Test 8: Cancelación Optimista
**Pasos:**
1. Click en botón "Cancelar" (RES001)
2. Modal aparece
3. Click en "Sí, Cancelar"

**Esperado Inmediato:**
- ✅ Badge cambia a "Cancelada" (gris)
- ✅ Modal cierra
- ✅ Spinner visible
- ✅ Mensaje "Reserva cancelada correctamente"

**Esperado después 800ms:**
- ✅ Spinner desaparece
- ✅ Mensaje éxito desaparece después 3s

---

### Test 9: Actualización de Filtro post-Cancelación
**Setup:**
1. Filtro activo: "Próximas"
2. Cancelar RES001 (que es próxima)

**Esperado:**
- ✅ RES001 desaparece de lista
- ✅ Contador: "1 reserva" (solo RES004)
- ✅ Si cambias a "Canceladas", aparece RES001

---

### Test 10: Estado Vacío
**Setup:**
1. Sin reservas en mock
2. Búsqueda que no da resultados

**Esperado:**
- ✅ Mensaje "No hay reservas"
- ✅ Icono descriptivo
- ✅ Texto explicativo

---

### Test 11: Mensaje de Error
**Setup:**
1. API call falla
2. Error en catch block

**Esperado:**
- ✅ Banner rojo con mensaje de error
- ✅ Reservas revertidas a estado original

---

### Test 12: Responsiveness
**Mobile (<640px):**
- ✅ Buscador ancho completo
- ✅ Filtros wrapean
- ✅ Tarjetas apiladas
- ✅ Imagen 24px

**Tablet (640px-1024px):**
- ✅ Filtros en una fila
- ✅ Buscador ancho
- ✅ Tarjetas ajustadas

**Desktop (>1024px):**
- ✅ Máximo ancho 1440px (max-w-6xl)
- ✅ Padding aumentado

---

## UserReservationsDashboard Tests

### Test 1: Cargar y mostrar reservas
**Pasos:**
1. Montar componente
2. Esperar carga

**Esperado:**
- ✅ 5 tarjetas visibles
- ✅ Contador: "5 reservas"
- ✅ Tarjeta informativa azul visible

---

### Test 2: Información de Cancelación
**Setup:**
1. Montar componente

**Esperado:**
- ✅ Tarjeta azul con icono info
- ✅ Texto sobre política de 7 días
- ✅ Prominent y fácil de leer

---

### Test 3: Filtros funcionan
**Test cada filtro:**
- Todas: 5 reservas
- Próximas: 2 reservas (RES101, RES104)
- Pasadas: 2 reservas (RES102, RES105)
- Canceladas: 1 reserva (RES103)

---

### Test 4: Estado Vacío
**Setup:**
1. Buscar "XYZ" (no existe)

**Esperado:**
- ✅ Mensaje "No hay reservas"
- ✅ Botón "Explorar propiedades"
- ✅ Botón navega a home (/)

---

### Test 5: Cancelación Usuario
**Pasos:**
1. Click "Cancelar" en RES101
2. Modal confirma
3. "Sí, Cancelar"

**Esperado:**
- ✅ Status cambia a "cancelled"
- ✅ Mensaje: "Tu reserva ha sido cancelada"
- ✅ Sale de filtro "Próximas"
- ✅ Entra en filtro "Canceladas"

---

### Test 6: No mostrar info del huésped
**Esperado:**
- ✅ Nombre del huésped NO visible
- ✅ Solo información de propiedad

---

## 🚀 Test Cases Avanzados

### Performance Tests

**Test: Renderizado de 100+ reservas**
```javascript
const manyReservations = Array.from({ length: 100 }, (_, i) => ({
  id: `RES${i}`,
  property: { title: `Property ${i}`, ... },
  ...
}));
```
**Esperado:**
- ✅ Página sigue responsiva
- ✅ Búsqueda es rápida (<100ms)
- ✅ Scroll suave

---

**Test: Búsqueda con muchas reservas**
- Input: Escribir rápidamente
- Esperado: No lag, resultados accuracy

---

### Accessibility Tests

**Test: Navegación por teclado**
1. Tab a través de todos los elementos
2. Enter en botones
3. Escape cierra modales

**Esperado:**
- ✅ Todos los elementos accesibles
- ✅ Focus visible en todos lados
- ✅ Escape cierra modal

---

**Test: Screen Reader**
- Verificar que ARIA labels existan
- Botones tienen texto descriptivo
- Iconos tienen alt text

---

### Browser Tests

**Navegadores a probar:**
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

**Dispositivos:**
- iPhone 12/13/14
- Android (Samsung S21+)
- iPad
- Desktop

---

## 📋 Manual Test Checklist

```
[ ] ReservationCard
  [ ] Renderiza correctamente
  [ ] Imagen carga
  [ ] Fechas formateadas
  [ ] Badge colores correctos
  [ ] Botón cancelar visible/oculto según lógica
  [ ] Responsive en móvil

[ ] CancelReservationModal
  [ ] Modal abre/cierra
  [ ] Backdrop funciona
  [ ] Botones funcionan
  [ ] Loading state visible
  [ ] Información clara

[ ] HostReservationsDashboard
  [ ] Carga datos mock
  [ ] Buscador filtra correctamente
  [ ] Filtros funcionan
  [ ] Cancelación optimista
  [ ] Mensaje éxito
  [ ] Responsive

[ ] UserReservationsDashboard
  [ ] Carga datos mock
  [ ] Filtros funcionan
  [ ] Info de cancelación visible
  [ ] Botón explorar funciona
  [ ] Responsive

[ ] App.jsx
  [ ] Rutas registradas
  [ ] PrivateRoute protege
  [ ] Navegación funciona
  [ ] Redirecciones correctas
```

---

## 🔧 Debugging Tips

### Cuando el filtrado no funciona
```javascript
// Agregar logging
console.log("Búsqueda:", searchTerm);
console.log("Filtro activo:", activeFilter);
console.log("Reservas originales:", reservations.length);
console.log("Filtradas:", filteredReservations.length);
```

### Cuando la cancelación no actualiza
```javascript
// Verificar estado anterior/posterior
console.log("Antes:", reservations);
setReservations(newList);
console.log("Después:", newList);
```

### Cuando el modal no aparece
```javascript
// Verificar condiciones
console.log("Modal abierto?", isCancelModalOpen);
console.log("ID seleccionado?", selectedReservationId);
console.log("Reserva encontrada?", selectedReservation);
```

---

## ✅ Pre-Launch Checklist

- [ ] 0 errores en consola
- [ ] 0 warnings de React
- [ ] Mock data realista
- [ ] Todos los test cases pasados
- [ ] Responsive en móvil/tablet/desktop
- [ ] Accesibilidad validada
- [ ] Performance OK
- [ ] Código limpio sin console.log() debug
- [ ] Componentes documentados
- [ ] Listo para integración backend
