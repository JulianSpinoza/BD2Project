# 🧪 Booking System - Testing Guide

## Quick Start Testing

### Prerequisites
- Frontend running on `http://localhost:5173`
- Backend running on `http://localhost:8000`
- Authenticated user (login required)
- Property details page loaded

### Test Cases

---

## Test 1: ✅ Happy Path - Complete Booking

### Steps
1. Navigate to property details page (`/listings/1`)
2. In the right sidebar, find the BookingWidget
3. Click on "CHECK-IN" input
4. Select any date from tomorrow onwards
5. Click on "CHECK-OUT" input
6. Select a date 3+ days after check-in
7. Select "3 Guests" from dropdown
8. Verify price breakdown appears:
   - Nightly rate × nights = subtotal
   - + Cleaning fee ($50,000)
   - + Service fee (10% of subtotal)
   - = Total
9. Click "Reserve" button
10. Observe loading spinner (1.5 seconds)
11. See success message "✓ Reservation created successfully!"
12. Auto-redirect to `/reservation-confirmation`
13. Verify all details match booking

### Expected Results
```
✅ Dates are selectable
✅ Price calculation is correct
✅ Loading state shows spinner
✅ Success message appears for 2 seconds
✅ Redirect happens automatically
✅ Confirmation page displays all data
```

---

## Test 2: ❌ Validation - Empty Check-in

### Steps
1. Open BookingWidget
2. Leave check-in date empty
3. Select check-out date
4. Select guests
5. Click "Reserve"

### Expected Result
```
❌ Error toast appears: "Please select a check-in date"
❌ No API call made
❌ User stays on property page
```

---

## Test 3: ❌ Validation - Empty Check-out

### Steps
1. Open BookingWidget
2. Select check-in date
3. Leave check-out date empty
4. Select guests
5. Click "Reserve"

### Expected Result
```
❌ Error toast appears: "Please select a check-out date"
❌ No API call made
```

---

## Test 4: ❌ Validation - Invalid Date Range

### Steps
1. Open BookingWidget
2. Select check-in: Dec 20, 2025
3. Select check-out: Dec 18, 2025 (before check-in)
4. Click "Reserve"

### Expected Result
```
❌ Error toast appears: "Check-out date must be after check-in date"
```

---

## Test 5: ❌ Validation - Minimum Night Stay

### Steps
1. Open BookingWidget
2. Select check-in: Dec 20, 2025
3. Select check-out: Dec 20, 2025 (same day)
4. Click "Reserve"

### Expected Result
```
❌ Error toast appears: "Minimum stay is 1 night"
```

---

## Test 6: 🔢 Price Calculation - 1 Night

### Setup
- Price per night: $250,000
- Check-in: Dec 15
- Check-out: Dec 16 (1 night)

### Expected Calculation
```
Subtotal:    $250,000 × 1 = $250,000
Cleaning:                   $50,000
Service:     10% of subtotal = $25,000
─────────────────────────────────────
TOTAL:                      $325,000
```

### Verification
- [ ] Price breakdown shows correct values
- [ ] Total calculation is correct

---

## Test 7: 🔢 Price Calculation - 7 Nights

### Setup
- Price per night: $250,000
- Check-in: Dec 15
- Check-out: Dec 22 (7 nights)

### Expected Calculation
```
Subtotal:    $250,000 × 7 = $1,750,000
Cleaning:                   $50,000
Service:     10% × $1,750,000 = $175,000
─────────────────────────────────────
TOTAL:                      $1,975,000
```

### Verification
- [ ] All amounts display correctly
- [ ] Total matches calculation

---

## Test 8: 👥 Guest Selection

### Steps
1. Open BookingWidget
2. Click "GUESTS" dropdown
3. Test each option:
   - 1 Guest
   - 2 Guests
   - 3 Guests
   - 4 Guests
   - 5 Guests
   - 6+ Guests

### Expected Result
```
✅ All options are selectable
✅ Selected value updates in form state
✅ No calculation errors
```

---

## Test 9: 📅 Date Picker - Minimum Date

### Steps
1. Open BookingWidget
2. Click "CHECK-IN" input
3. Observe available dates

### Expected Result
```
✅ Cannot select dates in the past
✅ Today is disabled
✅ Tomorrow and future dates enabled
```

---

## Test 10: 📱 Responsive Design - Mobile

### Steps
1. Open browser DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Set width to 375px (iPhone)
4. Open property page
5. Scroll to BookingWidget

### Expected Results
```
✅ Widget stacks vertically (no longer sticky)
✅ All inputs are touch-friendly
✅ No horizontal overflow
✅ Price breakdown is readable
✅ Button spans full width
```

---

## Test 11: 📱 Responsive Design - Tablet

### Steps
1. Set width to 768px (iPad)
2. Open property page
3. View BookingWidget

### Expected Results
```
✅ Widget appears on right side
✅ Not sticky on smaller tablets
✅ Proper spacing maintained
```

---

## Test 12: 🔄 State Persistence

### Steps
1. Open BookingWidget
2. Select check-in: Dec 20
3. Select check-out: Dec 23
4. Select guests: 4
5. Scroll page up/down
6. Return to widget

### Expected Results
```
✅ All selections are still visible
✅ Price breakdown unchanged
✅ No state loss during scrolling
```

---

## Test 13: 🎨 Error Message Clear

### Steps
1. Leave check-in empty
2. Click "Reserve" → See error
3. Click on check-in input
4. Select a date
5. Verify error message disappears

### Expected Result
```
✅ Error message cleared automatically
✅ User can retry without reloading
```

---

## Test 14: ♿ Keyboard Navigation

### Steps
1. Open BookingWidget
2. Press Tab key repeatedly to navigate:
   - Check-in input
   - Check-out input
   - Guests dropdown
   - Reserve button
3. Press Enter on each field
4. Use arrow keys in date picker
5. Use Enter on Reserve button

### Expected Results
```
✅ All elements are keyboard accessible
✅ Focus visible (outline/border)
✅ Can submit form with keyboard only
✅ Tab order makes sense
```

---

## Test 15: 🔐 Authentication Check

### Steps
1. Logout (clear auth token)
2. Try to navigate to `/listings/1`
3. Try to access `/reservation-confirmation`

### Expected Results
```
✅ Redirected to login page
✅ Protected routes blocked
✅ No unauthorized access
```

---

## Test 16: 📊 Console Logging

### Steps
1. Open browser DevTools (Console tab)
2. Complete a booking
3. Watch console output

### Expected Logs
```javascript
📋 Reservation Data: {
  property_id: "1",
  start_date: "2025-12-15",
  end_date: "2025-12-18",
  guests: 3,
  total_price: 880000,
  subtotal: 750000,
  cleaning_fee: 50000,
  service_fee: 80000,
  nights: 3
}
```

---

## Test 17: 🔗 Confirmation Page Navigation

### Steps
1. Complete booking successfully
2. Land on `/reservation-confirmation`
3. Verify all details display correctly
4. Click "Continue Exploring" button
5. Verify redirected to home page
6. Go back to confirmation (via browser back)
7. Click "View My Reservations" button
8. Verify redirected to profile page

### Expected Results
```
✅ All reservation data displayed
✅ Navigation buttons work
✅ Routes redirect correctly
```

---

## Test 18: 🎯 Confirmation Page Details

### Steps
1. Complete booking with specific dates
2. On confirmation page, verify:
   - Reservation ID displays (unique)
   - Check-in date formatted correctly
   - Check-out date formatted correctly
   - Nights calculated correctly
   - Guest count matches selection
   - Total price matches calculation
   - Cancellation policy visible
   - Support email provided

### Expected Results
```
✅ All information matches booking
✅ Dates use Spanish locale (e.g., "dom, 15 dic 2025")
✅ No data corruption
```

---

## Test 19: ⏱️ Loading State Duration

### Steps
1. Complete booking
2. Time the loading spinner duration

### Expected Duration
```
⏱️ Loading screen: ~1.5 seconds
⏱️ Success message: ~2 seconds
⏱️ Redirect: Automatic after 2 seconds
```

---

## Test 20: 🔁 Back Button Behavior

### Steps
1. Complete booking
2. Land on confirmation page
3. Click browser back button
4. Observe behavior

### Expected Result
```
⚠️ User returns to property page
✅ Previous booking data not reused
✅ Form is reset (optional enhancement)
```

---

## Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] Date picker opens instantly
- [ ] Price calculation updates < 100ms
- [ ] No console errors
- [ ] No memory leaks (DevTools)
- [ ] No layout shift (CLS < 0.1)

---

## Browser Test Matrix

| Browser | Platform | Test Status | Notes |
|---------|----------|-------------|-------|
| Chrome | Windows | Ready | Primary browser |
| Firefox | Windows | Ready | Test rendering |
| Safari | macOS | Ready | Test fonts |
| Chrome | Android | Ready | Mobile test |
| Safari | iOS | Ready | Mobile test |
| Edge | Windows | Ready | Chromium-based |

---

## Accessibility Testing

- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Form labels associated with inputs
- [ ] Error messages associated with fields
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] No timed content except spinner

---

## Manual Testing Checklist

### BookingWidget
- [ ] Dates selectable
- [ ] Price calculates correctly
- [ ] Validation works
- [ ] Error messages clear
- [ ] Loading state shows
- [ ] Success message appears
- [ ] Redirect happens
- [ ] Mobile responsive
- [ ] Keyboard navigation

### ReservationConfirmation
- [ ] Data displays correctly
- [ ] Dates formatted properly
- [ ] Price breakdown matches
- [ ] Navigation buttons work
- [ ] Support info visible
- [ ] Mobile responsive

---

## Debugging Tips

### Check Console for:
```javascript
// Successful booking logs
console.log("📋 Reservation Data:", reservationData);

// Navigation logs
console.log("Navigating to:", "/reservation-confirmation");

// State logs
console.log("Dates:", { checkInDate, checkOutDate });
console.log("Pricing:", pricing);
```

### Browser DevTools
1. **Network Tab**: Check API calls (currently simulated)
2. **Console Tab**: Look for errors/warnings
3. **Elements Tab**: Inspect form structure
4. **Performance Tab**: Check render times

### Common Issues

| Issue | Solution |
|-------|----------|
| Dates not selectable | Clear browser cache, refresh |
| Price shows NaN | Check pricePerNight prop type |
| Redirect doesn't work | Verify React Router setup |
| Styles not loading | Check Tailwind CSS import |
| Form submission fails | Check date format (YYYY-MM-DD) |

---

## Test Data

### Default Test Property
```javascript
{
  id: 1,
  title: "Beautiful Colonial House in Cartagena",
  price: 250000,
  rating: 4.9,
  reviews: 128,
  location: "Cartagena, Bolívar"
}
```

### Test Dates
```javascript
Today:     2025-12-10
Tomorrow:  2025-12-11
Test 1N:   2025-12-15 → 2025-12-16
Test 3N:   2025-12-15 → 2025-12-18
Test 7N:   2025-12-15 → 2025-12-22
```

---

## Summary

✅ **20 comprehensive test cases**
✅ **Mobile & desktop coverage**
✅ **Accessibility checks included**
✅ **Performance benchmarks defined**
✅ **Debugging guide provided**

**Run all tests before production deployment!**
