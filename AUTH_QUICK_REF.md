# 🚀 Firebase Auth - Quick Reference Card

## 📦 One-Time Setup (5 mins)

```bash
# 1. Dependencies already installed ✅
npm install firebase @react-native-firebase/app @react-native-firebase/auth

# 2. Get Firebase config from:
# https://console.firebase.google.com → Project Settings → General → Web app

# 3. Create .env file:
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
# ... (see .env.example)

# 4. Enable Email/Password in Firebase Console:
# Firebase Console → Authentication → Sign-in method → Email/Password → Enable
```

---

## 🔐 Complete Flow (Automatic!)

```
User Signs Up → Firebase Creates Account → Backend Syncs User → User Logged In
User Signs In → Firebase Authenticates → Backend Returns Profile → User Logged In
User Reopens App → Session Restored Automatically → User Still Logged In
```

---

## 💻 Usage in Code

### Sign Up
```typescript
import { useAppDispatch } from '@/redux/hooks';
import { signUpUser } from '@/redux/slices/authSlice';

await dispatch(signUpUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})).unwrap();
```

### Sign In
```typescript
import { signInUser } from '@/redux/slices/authSlice';

await dispatch(signInUser({
  email: 'john@example.com',
  password: 'password123'
})).unwrap();
```

### Sign Out
```typescript
import { signOutUser } from '@/redux/slices/authSlice';

await dispatch(signOutUser()).unwrap();
```

### Check Auth State
```typescript
import { useAppSelector } from '@/redux/hooks';

const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);

if (!isAuthenticated) {
  // Show login
}
```

### Use Token in API Calls
```typescript
const { token } = useAppSelector((state) => state.auth);

fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `config/firebase.config.ts` | Firebase setup |
| `services/firebaseAuth.service.ts` | Firebase operations |
| `apiServices/authService.ts` | Backend API calls |
| `redux/slices/authSlice.ts` | State management |
| `app/(auth)/login.tsx` | Login screen |
| `app/(auth)/signup.tsx` | Signup screen |
| `components/AuthProvider.tsx` | Session manager |

---

## 🔧 Backend Requirements

```typescript
// 1. Install Firebase Admin SDK
npm install firebase-admin

// 2. Create Firebase Auth Guard
@Injectable()
export class FirebaseAuthGuard {
  async canActivate(context: ExecutionContext) {
    const token = request.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    request.user = decodedToken;
    return true;
  }
}

// 3. Use on endpoints
@Post('users')
@UseGuards(FirebaseAuthGuard)
createUser(@Body() dto: CreateUserDto, @Req() req) {
  return this.userService.create({
    ...dto,
    firebaseUid: req.user.uid
  });
}
```

---

## 🧪 Test Checklist

- [ ] Sign up → Check Firebase Console users
- [ ] Sign in → Navigate to home
- [ ] Sign out → Navigate to login
- [ ] Close/reopen app → Auto-login
- [ ] Wrong password → Show error
- [ ] Existing email → Show error

---

## 🐛 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| Network request failed | Check internet connection |
| User not found | Ensure backend creates user |
| Token verification failed | Check Firebase Admin SDK setup |
| App crashes | Check Firebase config in .env |

---

## 📚 Full Documentation

- **Complete Guide:** `FIREBASE_AUTH_GUIDE.md`
- **Summary:** `AUTH_INTEGRATION_SUMMARY.md`
- **Firebase Docs:** https://firebase.google.com/docs/auth

---

## ✅ Status

✅ All files created  
✅ Redux integrated  
✅ Screens ready  
✅ Session management working  
✅ No linter errors  

**Just add your Firebase config and test!** 🚀

