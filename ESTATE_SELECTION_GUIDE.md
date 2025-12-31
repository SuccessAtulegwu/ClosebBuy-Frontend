# Estate Selection Feature

## Overview

The estate selection feature allows users to select their estate during signup using a searchable dropdown modal. This ensures data integrity and prevents typos or invalid estate entries.

## Why Dropdown Over Text Input?

✅ **Prevents typos** - Users can't enter misspelled estate names  
✅ **Ensures valid estates** - Only existing estates can be selected  
✅ **Better UX** - Users see all available options  
✅ **Faster signup** - Select instead of type + validate  
✅ **Prevents signup failures** - No need to validate after input

## Architecture

### Frontend (CloseBuy)

**Location**: `closebuy/app/(auth)/signup.tsx`

**Key Components**:
1. **Estate State Management**:
   ```typescript
   const [estates, setEstates] = useState<Estate[]>([]);
   const [filteredEstates, setFilteredEstates] = useState<Estate[]>([]);
   const [showEstateModal, setShowEstateModal] = useState(false);
   const [estateSearchQuery, setEstateSearchQuery] = useState('');
   ```

2. **Form Data**:
   ```typescript
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     password: '',
     confirmPassword: '',
     estateId: 0,
     estateName: '',
   });
   ```

3. **Estate Selection Modal**:
   - Searchable dropdown with real-time filtering
   - Visual feedback for selected estate
   - Loading and empty states
   - Retry functionality

**API Service**: `closebuy/apiServices/estateService.ts`
- `getEstates()` - Fetches all estates from backend
- `getEstateById(id)` - Gets a specific estate

### Backend (HMB)

**Location**: `hmb/src/estate/`

**Endpoints**:
- `GET /estates/all` - Returns all estates (public, no auth required)
- `GET /estates/:id` - Returns specific estate by ID

**Note**: The `/estates/all` endpoint should be public (no `@UseGuards(FirebaseAuthGuard)`) to allow unauthenticated users to fetch estates during signup.

## User Flow

```
1. User opens signup screen
   ↓
2. Estates are fetched from backend automatically
   ↓
3. User fills in name, email, password
   ↓
4. User taps "Select Your Estate" field
   ↓
5. Modal opens with searchable list of estates
   ↓
6. User can:
   - Scroll through all estates
   - Search by typing estate name
   - See estate address (if available)
   ↓
7. User selects an estate
   ↓
8. Modal closes, selected estate displays in field
   ↓
9. User submits signup with estateId included
   ↓
10. Backend receives CreateUserDto with valid estateId
```

## Data Flow

### Signup Request
```typescript
// Frontend sends
{
  name: "John Doe",
  email: "john@example.com",
  password: "secure123",
  estateId: 5  // Selected estate ID
}

// Backend expects (CreateUserDto)
interface CreateUserDto {
  email: string;
  name?: string;
  phoneNumber?: string;
  estateId: number;
  firebaseUid?: string;
}
```

## UI Features

### Estate Selection Field
- Looks like other input fields for consistency
- Shows placeholder "Select your estate" when empty
- Displays selected estate name when chosen
- Shows loading state while fetching estates
- Disabled until estates are loaded

### Search Modal
- **Header**: Title and close button
- **Search Bar**: Real-time filtering
- **Estate List**: 
  - Estate name (bold)
  - Estate address (if available, in lighter text)
  - Business icon
  - Checkmark for selected estate
- **Empty State**: Shows when no estates match search
- **Loading State**: Shows while fetching estates
- **Retry Button**: Allows refetching if load fails

### Validation
- Estate selection is required (validated on submit)
- Error message displays if user tries to submit without selecting
- Visual error state on the selection field

## Styling

The estate selection UI matches the existing signup form styling:
- Same border radius (12px)
- Same padding and spacing
- Same error states
- Same color scheme from theme
- Same font families (Nunito)

## Error Handling

### Frontend
```typescript
// Network errors
if (!response.success) {
  Alert.alert('Error', 'Failed to load estates. Please try again.');
}

// Validation errors
if (!formData.estateId || formData.estateId === 0) {
  errors.estate = 'Please select your estate';
}
```

### Backend
- Should return proper HTTP status codes
- Should include error messages in response

## Testing Checklist

- [ ] Estates load on signup screen mount
- [ ] Search filters estates correctly
- [ ] Selecting estate updates form state
- [ ] Selected estate displays in field
- [ ] Validation prevents signup without estate
- [ ] Error displays for failed estate fetch
- [ ] Retry button refetches estates
- [ ] Modal closes after selection
- [ ] estateId is sent in signup request
- [ ] Backend creates user with correct estateId

## Future Enhancements

1. **Caching**: Cache estates locally to reduce API calls
2. **Location-based suggestions**: Show nearby estates first
3. **Estate images**: Add estate logos/images
4. **Estate details**: Show more info (facilities, vendors count)
5. **Recent estates**: Remember recently selected estates
6. **Estate verification**: Require admin approval for new estate requests

## Related Files

### Frontend
- `closebuy/app/(auth)/signup.tsx` - Main signup screen with estate selection
- `closebuy/apiServices/estateService.ts` - Estate API service
- `closebuy/types/publicTypes.ts` - Estate type definition
- `closebuy/redux/slices/authSlice.ts` - Auth state management

### Backend
- `hmb/src/estate/estate.controller.ts` - Estate endpoints
- `hmb/src/estate/estate.service.ts` - Estate business logic
- `hmb/src/user/dto/create-user.dto.ts` - User creation DTO with estateId

## Security Considerations

- Estate list endpoint is public (no auth required for signup)
- Estate IDs are validated on backend before user creation
- Invalid estate IDs should be rejected by backend
- Consider rate limiting the estate list endpoint to prevent abuse

