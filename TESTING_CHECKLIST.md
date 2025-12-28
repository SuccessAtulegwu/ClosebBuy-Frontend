# Testing Checklist ✅

Use this checklist to verify all features are working correctly.

## 🏠 Home Screen

- [ ] Products display correctly with images
- [ ] Product prices show in Nigerian Naira (₦)
- [ ] "Add to cart" button visible on products
- [ ] Cart icon visible in header
- [ ] Cart badge shows "0" initially
- [ ] Clicking cart icon navigates to cart screen
- [ ] Notification icon present and clickable
- [ ] Search bar present
- [ ] Categories display correctly
- [ ] Banner displays correctly

---

## 🛒 Cart Functionality

### Adding to Cart
- [ ] Click "Add to cart" on a product
- [ ] Cart badge updates to "1"
- [ ] Product changes to quantity controls (-/+)
- [ ] Add same product again, quantity increases
- [ ] Add different product, both show in cart
- [ ] Cart badge shows total count correctly

### Cart Screen
- [ ] Navigate to cart via header icon
- [ ] All added items display with images
- [ ] Product names display correctly
- [ ] Prices show correctly
- [ ] Quantities match what was added
- [ ] Increment (+) button works
- [ ] Decrement (-) button works
- [ ] When quantity reaches 0, item removes
- [ ] Remove button (trash icon) works
- [ ] Confirmation alert shows before removal
- [ ] "Clear All" button works
- [ ] Confirmation alert shows before clearing
- [ ] Subtotal calculates correctly
- [ ] Total matches subtotal
- [ ] Item count shows correctly
- [ ] Empty cart message shows when empty
- [ ] "Continue Shopping" button works when empty

---

## 📦 Checkout Flow

### Shipping Address Screen

#### Form Display
- [ ] All input fields visible
- [ ] Labels clearly visible
- [ ] Placeholder text helpful
- [ ] Form scrollable on small screens

#### Form Validation
- [ ] Empty name shows error
- [ ] Short phone number shows error
- [ ] Empty address shows error
- [ ] Empty city shows error
- [ ] Empty state shows error
- [ ] All fields required marked with *

#### Form Functionality
- [ ] Can type in all fields
- [ ] Phone number field accepts numbers
- [ ] ZIP code field accepts numbers
- [ ] Country field shows "Nigeria"
- [ ] Switch toggle works for "Save address"
- [ ] Can submit with valid data
- [ ] Navigate to payment screen on submit

#### Saved Addresses (if any exist)
- [ ] Saved addresses section visible
- [ ] Can expand/collapse saved addresses
- [ ] Can select saved address
- [ ] Selected address fills form
- [ ] Chevron icon rotates on expand/collapse

---

### Payment Method Screen

#### Payment Options Display
- [ ] All 4 payment options visible:
  - [ ] Credit/Debit Card
  - [ ] Bank Transfer
  - [ ] Digital Wallet
  - [ ] Cash on Delivery
- [ ] Radio buttons work for selection
- [ ] Selected option highlighted
- [ ] Icons display correctly

#### Card Payment
- [ ] Card form shows when card selected
- [ ] Card number field formats correctly (xxxx xxxx xxxx xxxx)
- [ ] Can enter 16 digits
- [ ] Cardholder name field works
- [ ] Expiry date formats correctly (MM/YY)
- [ ] CVV field works and masks input
- [ ] Save card checkbox works
- [ ] Can submit with valid card details
- [ ] Validation errors show for invalid card

#### Bank Transfer
- [ ] Bank details display correctly
- [ ] Account number visible
- [ ] Account name visible
- [ ] Bank name visible
- [ ] Info message displays

#### Digital Wallet
- [ ] Wallet balance displays
- [ ] Wallet icon shows
- [ ] Info message displays

#### Cash on Delivery
- [ ] Service fee mentioned (₦100)
- [ ] Info message displays
- [ ] Can proceed with cash option

#### Navigation
- [ ] "Review Order" button works
- [ ] Navigate to review screen

---

### Review Order Screen

#### Order Items Display
- [ ] All cart items listed
- [ ] Item images display
- [ ] Item names correct
- [ ] Quantities correct
- [ ] Individual item totals correct
- [ ] Can see all items (scrollable)

#### Shipping Address Display
- [ ] Full name displays
- [ ] Phone number displays
- [ ] Complete address displays
- [ ] City and state display
- [ ] ZIP code displays (if entered)
- [ ] "Edit" button present and functional

#### Payment Method Display
- [ ] Payment type displays correctly
- [ ] For card: last 4 digits show
- [ ] For card: cardholder name shows
- [ ] Payment icon correct
- [ ] "Edit" button present and functional

#### Order Summary
- [ ] Subtotal calculates correctly
- [ ] Item count correct in summary
- [ ] Delivery fee shows (₦5 default)
- [ ] Tax calculates correctly (7.5%)
- [ ] For COD: additional ₦100 shows
- [ ] Total amount calculates correctly
- [ ] All amounts formatted with commas

#### Place Order
- [ ] "Place Order" button visible
- [ ] Shows total amount
- [ ] Terms & conditions text present
- [ ] Click Place Order button
- [ ] Loading indicator shows
- [ ] Button disabled during loading

---

### Order Success Screen

#### Visual Elements
- [ ] Success checkmark displays
- [ ] Checkmark animates (rotation)
- [ ] Green circle background shows
- [ ] Confetti animation plays
- [ ] Success title displays
- [ ] Success message displays

#### Order Details
- [ ] Order number displays
- [ ] Order ID displays
- [ ] Estimated delivery shows
- [ ] Confirmation email message shows

#### Action Buttons
- [ ] "Track Order" button visible
- [ ] "Continue Shopping" button visible
- [ ] Share button visible
- [ ] Download button visible
- [ ] Help button visible
- [ ] "Track Order" navigates to orders tab
- [ ] "Continue Shopping" goes to home

---

## 🔄 State Management

### Redux Cart State
- [ ] Adding item updates Redux store
- [ ] Removing item updates Redux store
- [ ] Quantity changes update Redux store
- [ ] Cart badge reflects Redux state
- [ ] State persists during navigation
- [ ] Multiple components can access cart state

### Redux Order State
- [ ] Shipping address saves to Redux
- [ ] Payment method saves to Redux
- [ ] Order data persists through review
- [ ] Placing order updates order state
- [ ] Cart clears after successful order

---

## 🎨 UI/UX

### Theme Support
- [ ] Light theme works
- [ ] Dark theme works (if implemented)
- [ ] Theme consistent across screens
- [ ] Colors appropriate for theme
- [ ] Text readable in both themes

### Responsiveness
- [ ] Works on small phone screens
- [ ] Works on large phone screens
- [ ] Works on tablet screens
- [ ] Scrolling works where needed
- [ ] No content cut off
- [ ] Buttons reachable

### Animations
- [ ] Success screen animations smooth
- [ ] Confetti falls smoothly
- [ ] Navigation transitions smooth
- [ ] No lag or stuttering

### Visual Feedback
- [ ] Loading indicators show during waits
- [ ] Success messages clear
- [ ] Error messages visible
- [ ] Button press feedback
- [ ] Form validation instant

---

## 🐛 Error Handling

### Form Errors
- [ ] Empty required fields show errors
- [ ] Invalid formats show errors
- [ ] Error messages clear and helpful
- [ ] Errors appear inline with fields

### API Errors (when connected)
- [ ] Network errors handled gracefully
- [ ] API errors show user-friendly messages
- [ ] Failed orders don't clear cart
- [ ] Retry options available
- [ ] No app crashes on errors

---

## 📱 Navigation

### Screen Navigation
- [ ] Back buttons work on all screens
- [ ] Cart icon always accessible
- [ ] Can navigate to cart anytime
- [ ] Can go back from cart
- [ ] Success screen prevents back navigation
- [ ] Bottom tabs accessible (except on checkout)

### Deep Links (Optional)
- [ ] Can link directly to cart
- [ ] Can link to specific product
- [ ] Can link to orders

---

## 🔐 Data Validation

### Phone Numbers
- [ ] Accepts Nigerian format (080xxxxxxxx)
- [ ] Minimum 10 digits required
- [ ] Only numbers allowed

### Card Numbers
- [ ] 16 digits required
- [ ] Formats with spaces
- [ ] Only numbers allowed

### Expiry Dates
- [ ] MM/YY format enforced
- [ ] Formats automatically
- [ ] Validates month (01-12)

### CVV
- [ ] 3-4 digits allowed
- [ ] Input masked for security
- [ ] Only numbers allowed

---

## 🚀 Performance

- [ ] App loads quickly
- [ ] Smooth scrolling
- [ ] No lag when adding to cart
- [ ] Quick navigation between screens
- [ ] Images load reasonably fast
- [ ] No memory leaks
- [ ] No crashes during testing

---

## 📊 Edge Cases

### Empty States
- [ ] Empty cart shows helpful message
- [ ] No saved addresses works fine
- [ ] No saved cards works fine

### Boundary Cases
- [ ] Very long product names don't break UI
- [ ] Very large quantities work
- [ ] Cart with many items scrolls properly
- [ ] Long addresses display correctly

### User Actions
- [ ] Can clear cart and start over
- [ ] Can change address during checkout
- [ ] Can change payment method
- [ ] Can go back and forth in checkout

---

## 📝 Documentation

- [ ] README files present
- [ ] API documentation available
- [ ] Integration guide available
- [ ] Code examples provided
- [ ] Visual flow diagrams included

---

## ✅ Final Checks

- [ ] No console errors in development
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All imports working
- [ ] All routes defined correctly
- [ ] Redux store configured
- [ ] Provider wrapping app
- [ ] Sample data working

---

## 🎯 Test Scenarios

### Scenario 1: Complete Order Flow
1. [ ] Start on home screen
2. [ ] Add 3 different products to cart
3. [ ] Open cart
4. [ ] Increase quantity of one item
5. [ ] Remove one item
6. [ ] Proceed to checkout
7. [ ] Fill shipping address
8. [ ] Select payment method
9. [ ] Review order
10. [ ] Place order
11. [ ] See success screen

### Scenario 2: Cart Management
1. [ ] Add item to cart
2. [ ] Leave and come back
3. [ ] Item still in cart
4. [ ] Add more items
5. [ ] Clear entire cart
6. [ ] Cart empty

### Scenario 3: Form Validation
1. [ ] Try to submit empty shipping form
2. [ ] See all validation errors
3. [ ] Fill form partially
4. [ ] Try to submit
5. [ ] See remaining errors
6. [ ] Fill form completely
7. [ ] Submit successfully

### Scenario 4: Payment Options
1. [ ] Try each payment method
2. [ ] Verify correct form/info shows
3. [ ] Complete checkout with each method
4. [ ] Verify correct total (COD adds fee)

---

## 📋 Pre-Production Checklist

Before connecting to real backend:
- [ ] All features tested with sample data
- [ ] No critical bugs found
- [ ] UI looks good on all screens tested
- [ ] Navigation flows smoothly
- [ ] Forms validate correctly
- [ ] Error handling works
- [ ] Redux state management working
- [ ] Documentation reviewed

Backend Integration:
- [ ] API base URL configured
- [ ] Authentication tokens ready
- [ ] Error handling for API calls
- [ ] Test backend endpoints
- [ ] Verify data format matches
- [ ] Test with real payment gateway

---

## 🎉 Testing Complete!

Once all items are checked, the app is ready for:
- ✅ Production deployment
- ✅ User acceptance testing
- ✅ Beta testing
- ✅ Real backend integration

**Mark items as you test them!** ✓

