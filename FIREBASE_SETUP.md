# Firebase Setup Guide

This guide will help you configure Firebase for your Friend Finder platform.

## 🔥 Firebase Services Used

1. **Firebase Authentication** - User sign-up and login
2. **Cloud Firestore** - Real-time chat messages, services, and bookings
3. **Cloud Storage** - File and image sharing in chat
4. **Cloud Functions** - Custom backend logic (optional)

## 📋 Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter your project name (e.g., "friend-finder")
4. Click Continue and follow the setup wizard

### 2. Register Your Web App

1. In the Firebase Console, click the **Web** icon (</>)
2. Register your app with a nickname
3. Copy the Firebase configuration object
4. Paste it into `src/config/firebase.js`

Example configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx",
};
```

### 3. Enable Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password** authentication
5. Click Save

### 4. Set Up Cloud Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Choose **Start in test mode** (for development)
4. Select your location
5. Click Enable

#### Firestore Security Rules (for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Services collection
    match /services/{serviceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.providerId;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.uid == resource.data.providerId);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.uid == resource.data.providerId);

      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }

    // Video call signaling
    match /calls/{callId} {
      allow read, write: if request.auth != null;

      match /candidates/{candidateId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### 5. Set Up Cloud Storage

1. In Firebase Console, go to **Storage**
2. Click "Get Started"
3. Choose **Start in test mode** (for development)
4. Click Next and Done

#### Storage Security Rules (for production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat/{bookingId}/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && request.resource.contentType.matches('image/.*|application/pdf|text/.*');
    }
  }
}
```

### 6. Firestore Collections Structure

Your Firestore will have these collections:

```
users/
  {userId}/
    - email: string
    - userType: "user" | "provider"
    - name: string
    - createdAt: timestamp

services/
  {serviceId}/
    - title: string
    - description: string
    - price: number
    - duration: number
    - category: string
    - providerId: string
    - providerName: string
    - status: "active" | "inactive"
    - createdAt: timestamp

bookings/
  {bookingId}/
    - serviceId: string
    - serviceTitle: string
    - userId: string
    - userName: string
    - providerId: string
    - providerName: string
    - price: number
    - status: "pending" | "confirmed" | "completed"
    - createdAt: timestamp

    messages/
      {messageId}/
        - text: string
        - sender: string
        - senderName: string
        - senderType: string
        - timestamp: timestamp
        - type: "text" | "image" | "file"
        - fileURL: string (optional)
        - fileType: string (optional)

calls/
  {callId}/
    - offer: object
    - answer: object
    - createdBy: string
    - createdAt: timestamp

    candidates/
      {candidateId}/
        - candidate: object
        - userId: string
```

## 🚀 Running Your App

1. Update `src/config/firebase.js` with your Firebase config
2. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Best Practices

### For Production:

1. **Update Firestore Rules**: Change from test mode to production rules
2. **Update Storage Rules**: Restrict file types and sizes
3. **Enable App Check**: Add extra security layer
4. **Use Environment Variables**: Store Firebase config in `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## 📱 Features Now Available

✅ **Firebase Authentication**

- Email/Password registration
- Secure login/logout
- User session management

✅ **Real-time Chat with Firestore**

- Instant message delivery
- Message history
- File and image sharing
- Cloud Storage integration

✅ **WebRTC Video Calls**

- Peer-to-peer video/audio
- Firestore as signaling server
- ICE candidate exchange
- Connection state monitoring

✅ **Service Management**

- Real-time service updates
- Booking system
- Provider/user dashboards

## 🐛 Troubleshooting

### Authentication Issues

- Ensure Email/Password is enabled in Firebase Console
- Check browser console for detailed error messages

### Firestore Permission Errors

- Verify security rules are set correctly
- Make sure user is authenticated before accessing data

### Video Call Not Connecting

- Check camera/microphone permissions
- Ensure HTTPS is used (required for WebRTC)
- Verify Firestore rules allow reads/writes to `calls` collection

### File Upload Failing

- Check Storage rules
- Verify file size is under limit
- Ensure correct file types are allowed

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Cloud Storage for Web](https://firebase.google.com/docs/storage/web/start)

---

**Note**: Remember to update your security rules before deploying to production!
