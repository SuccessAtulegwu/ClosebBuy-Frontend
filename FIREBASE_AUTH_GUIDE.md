# 🔐 Firebase Authentication Integration Guide

## Overview

Complete Firebase authentication system integrated with HMB backend. This system uses Firebase for authentication and syncs user data with your NestJS backend.

---

## 🎯 Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                             │
└─────────────────────────────────────────────────────────────────┘

SIGN UP:
1. User enters email, password, name
2. Firebase creates user account
3. Firebase returns user + ID token
4. Frontend sends CreateUserDto + token to backend
5. Backend validates token & creates user in database
6. User data stored in AsyncStorage
7. User navigated to app

SIGN IN:
1. User enters email, password
2. Firebase authenticates user
3. Firebase returns user + ID token
4. Frontend gets user profile from backend using token
5. User data stored in AsyncStorage
6. User navigated to app

SIGN OUT:
1. Firebase signs out user
2. AsyncStorage cleared
3. User navigated to login

SESSION RESTORE:
1. App loads → check AsyncStorage
2. Token found → verify with backend
3. Valid → restore session
4. Invalid → clear storage, show login
```

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd closebuy
npm install firebase @react-native-firebase/app @react-native-firebase/auth
```

✅ Already installed!

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** → **Email/Password**
4. Go to **Project Settings** → **General**
5. Under "Your apps", click **Web** app
6. Copy the Firebase config values

### 3. Environment Variables

Create/update `.env` file:

```env
# Backend API
EXPO_PUBLIC_API_URL=http://your-backend-url/api

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Paystack
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

---

## 📁 File Structure

```
closebuy/
├── config/
│   └── firebase.config.ts              # Firebase initialization
│
├── services/
│   └── firebaseAuth.service.ts         # Firebase auth operations
│
├── apiServices/
│   └── authService.ts                  # Backend API communication
│
├── redux/slices/
│   └── authSlice.ts                    # Redux state management
│
├── components/
│   └── AuthProvider.tsx                # Session management
│
├── app/
│   ├── _layout.tsx                     # Root layout with providers
│   └── (auth)/
│       ├── login.tsx                   # Login screen
│       └── signup.tsx                  # Signup screen
│
└── hooks/
    └── useAuth.ts                      # Auth hook (optional)
```

---

## 🔧 Key Components

### 1. Firebase Config (`config/firebase.config.ts`)

Initializes Firebase with AsyncStorage persistence:

```typescript
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

### 2. Firebase Auth Service (`services/firebaseAuth.service.ts`)

Handles Firebase operations:
- `signUp()` - Create new user
- `signIn()` - Authenticate user
- `signOut()` - Sign out
- `resetPassword()` - Password reset
- `getCurrentToken()` - Get ID token
- `onAuthStateChanged()` - Listen to auth changes

### 3. Backend Auth Service (`apiServices/authService.ts`)

Communicates with HMB backend:
- `createUser()` - Create user in backend (POST /users)
- `getUserProfile()` - Get user data (GET /users/profile)
- `updateUser()` - Update user (PATCH /users/:id)
- `verifyToken()` - Verify Firebase token (POST /auth/verify)

### 4. Auth Redux Slice (`redux/slices/authSlice.ts`)

Manages authentication state:
- `signUpUser()` - Async thunk for signup
- `signInUser()` - Async thunk for signin
- `signOutUser()` - Async thunk for signout
- `restoreSession()` - Restore session on app load
- `refreshToken()` - Refresh Firebase token

### 5. Auth Provider (`components/AuthProvider.tsx`)

Handles:
- Session restoration on app load
- Protected route navigation
- Loading state during initialization

---

## 🚀 Usage

### Sign Up

```typescript
import { useAppDispatch } from '@/redux/hooks';
import { signUpUser } from '@/redux/slices/authSlice';

const dispatch = useAppDispatch();

await dispatch(signUpUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  estateId: 1, // Optional
})).unwrap();
```

### Sign In

```typescript
await dispatch(signInUser({
  email: 'john@example.com',
  password: 'password123',
})).unwrap();
```

### Sign Out

```typescript
import { signOutUser } from '@/redux/slices/authSlice';

await dispatch(signOutUser()).unwrap();
```

### Get Current User

```typescript
import { useAppSelector } from '@/redux/hooks';

const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
```

### Protected Component

```typescript
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'expo-router';

function MyComponent() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  return <YourProtectedContent />;
}
```

---

## 🔐 Security Features

### Frontend
✅ **Firebase authentication** with secure token generation  
✅ **AsyncStorage persistence** for seamless experience  
✅ **Token refresh** mechanism  
✅ **Automatic session restoration**  
✅ **Protected route navigation**  
✅ **Password validation** (min 6 characters)  
✅ **Email format validation**  

### Backend Requirements

Your NestJS backend should have:

```typescript
// 1. Firebase Admin SDK initialized
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 2. Firebase Auth Guard
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

// 3. User Controller
@Controller('users')
export class UserController {
  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    const firebaseUid = req.user.uid;
    // Create user in database with firebaseUid
    return this.userService.create({
      ...createUserDto,
      firebaseUid,
    });
  }

  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req) {
    const firebaseUid = req.user.uid;
    return this.userService.findByFirebaseUid(firebaseUid);
  }
}

// 4. Auth Controller
@Controller('auth')
export class AuthController {
  @Post('verify')
  @UseGuards(FirebaseAuthGuard)
  async verifyToken(@Req() req) {
    // Token already verified by guard
    const firebaseUid = req.user.uid;
    return this.userService.findByFirebaseUid(firebaseUid);
  }
}
```

---

## 🧪 Testing

### Test Flow

1. **Sign Up**
   - Open app → Click "Sign Up"
   - Enter name, email, password
   - Click "Create Account"
   - Check Firebase Console → Authentication → Users
   - Check backend database → users table
   - Should navigate to home

2. **Sign Out**
   - Click sign out button
   - Should navigate to login

3. **Sign In**
   - Enter email, password
   - Click "Sign In"
   - Should navigate to home

4. **Session Persistence**
   - Close app
   - Reopen app
   - Should automatically restore session

5. **Token Expiry**
   - Wait for token to expire (1 hour)
   - App should refresh token automatically

---

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/network-request-failed)"
**Solution:** Check internet connection and Firebase config

### Issue: "User not found in backend"
**Solution:** Ensure backend creates user on first login:

```typescript
// Backend should have "findOrCreate" logic
async findOrCreateUser(firebaseUid: string, email: string) {
  let user = await this.findByFirebaseUid(firebaseUid);
  
  if (!user) {
    user = await this.create({
      firebaseUid,
      email,
      role: Role.RESIDENT,
      estateId: 1,
    });
  }
  
  return user;
}
```

### Issue: "Token verification failed"
**Solution:** 
- Check Firebase Admin SDK is initialized in backend
- Verify service account credentials
- Ensure token is sent in Authorization header

---

## 📊 Auth State Management

### Redux State Shape

```typescript
interface AuthState {
  isAuthenticated: boolean;  // User logged in?
  user: User | null;         // User data from backend
  token: string | null;      // Firebase ID token
  loading: boolean;          // Operation in progress?
  error: string | null;      // Error message
  isInitialized: boolean;    // Session check complete?
}
```

### Actions

- `signUpUser(credentials)` - Register new user
- `signInUser(credentials)` - Login existing user
- `signOutUser()` - Logout user
- `restoreSession()` - Restore from AsyncStorage
- `refreshToken()` - Refresh Firebase token
- `setUser(user)` - Update user data
- `clearAuth()` - Clear auth state

---

## 🎯 Next Steps

1. **Set up Firebase Console** ✅
2. **Add Firebase config to .env** ⏳
3. **Set up backend Firebase Admin SDK** ⏳
4. **Test signup flow** ⏳
5. **Test signin flow** ⏳
6. **Test session persistence** ⏳
7. **Add forgot password screen** 📝 (optional)
8. **Add email verification** 📝 (optional)

---

## 📞 Resources

- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **Expo Firebase:** https://docs.expo.dev/guides/using-firebase/

---

**Status:** ✅ COMPLETE & READY TO USE

All components are created and integrated. Just add your Firebase config and test!

🎉 Happy coding!

