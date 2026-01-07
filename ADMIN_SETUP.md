# Admin Setup Guide

This guide explains how to set up admin functionality in the Eduverse application.

## Features Implemented

### 1. **Admin Authentication System**

- Role-based access control with `admin` and `learner` roles
- Admin users can access special admin dashboard
- Regular users see normal application interface

### 2. **Admin Dashboard** (`/admin`)

- **Subject Management**: Create, edit, delete subjects
- **Topic Management**: Create, edit, delete topics and their concepts
- **AR Management**: Enable/disable AR for concepts, set visualization types
- **Data Seeder**: Populate database with educational content

### 3. **Firestore Integration**

- Real Firestore collections: `subjects`, `topics`, `concepts`, `users`
- Batch operations for efficient data seeding
- Search functionality across all content
- Content localization with Gemini API translation

### 4. **Content Structure**

#### Subjects

```javascript
{
  name: "Physics",
  description: "Study of matter and energy",
  icon: "⚛️",
  difficulty: "intermediate",
  languages: ["en"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Topics

```javascript
{
  name: "Classical Mechanics",
  description: "Motion, forces, and energy",
  subjectId: "subject-id",
  difficulty: "beginner",
  estimatedTime: 45,
  prerequisites: [],
  languages: ["en"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Concepts

```javascript
{
  title: "Newton's Laws",
  topicId: "topic-id",
  difficulty: "beginner",
  estimatedReadTime: 15,
  arEnabled: true,
  visualizationType: "3d-model",
  content: {
    en: {
      title: "Newton's Laws of Motion",
      body: "Detailed explanation...",
      summary: "Brief summary...",
      examples: ["Example 1", "Example 2"],
      images: [],
      externalAssets: []
    }
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Setup Instructions

### 1. **Environment Variables**

Make sure your `.env` file includes:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GEMINI_API_KEY=your-gemini-api-key (optional, for translation)
```

### 2. **Firestore Security Rules**

Update your Firestore rules to allow admin operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow admins to update user roles
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Content collections - read for all authenticated users
    match /{collection}/{document} {
      allow read: if request.auth != null && collection in ['subjects', 'topics', 'concepts'];
      // Write access only for admins
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. **Create First Admin User**

Since admin accounts cannot be created through the signup form (for security reasons), you'll need to use one of the following methods:

#### Option A: Direct Firestore Update (Recommended)

1. Create a regular user account through signup (`/signup`)
2. Go to Firebase Console → Firestore Database
3. Navigate to the `users` collection
4. Find the user document you want to make admin
5. Edit the document and change the `role` field from `"learner"` to `"admin"`
6. Save the changes
7. The user will have admin access on next login/refresh

#### Option B: Using Firebase Admin SDK (For Developers)

If you have access to Firebase Admin SDK, you can programmatically update user roles:

```javascript
// Server-side code using Firebase Admin SDK
const admin = require("firebase-admin");
const db = admin.firestore();

async function makeUserAdmin(userId) {
  await db.collection("users").doc(userId).update({
    role: "admin",
  });
  console.log(`User ${userId} is now an admin`);
}
```

#### Option C: Manual Database Script

Create a one-time script to set up your first admin user:

```javascript
// Run this in your development environment
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./src/firebase";

async function createFirstAdmin(userId) {
  try {
    await updateDoc(doc(db, "users", userId), {
      role: "admin",
    });
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Replace 'USER_ID_HERE' with the actual user ID
createFirstAdmin("USER_ID_HERE");
```

### 4. **Seed Initial Data**

1. Access admin dashboard (`/admin`)
2. Go to "Data Seeder" tab
3. Click "Seed Database"
4. Wait for completion message

This will populate:

- 4 subjects (Physics, Chemistry, Biology, Engineering)
- 11 topics across subjects
- 5 detailed concepts with AR capabilities

### 5. **Managing Content**

#### Subjects

- Create new subjects with icons, descriptions, difficulty levels
- Edit existing subjects
- Delete subjects (will affect related topics)

#### Topics

- Create topics under specific subjects
- Set prerequisites, difficulty, estimated time
- Manage concepts within topics
- Add detailed concept content with AR settings

#### AR Management

- Enable/disable AR for individual concepts
- Set visualization types: 3D Model, Animation, Interactive, Simulation
- View AR statistics and filter by status

## Usage Guide

### For Admins

1. **Login** with admin account
2. **Navigate** to `/admin` or click "Admin" in navigation
3. **Manage Content**:
   - Use "Subjects" tab to manage subjects
   - Use "Topics" tab to manage topics and concepts
   - Use "AR Management" to control AR features
   - Use "Data Seeder" to populate or reset data

### For Regular Users

- Regular users see the normal application interface
- Content is automatically loaded from Firestore
- Language changes trigger Gemini API translation
- AR-enabled concepts show AR indicators

## Technical Details

### File Structure

```
src/
├── components/admin/
│   ├── SubjectManager.jsx     # Subject CRUD operations
│   ├── TopicManager.jsx       # Topic and concept management
│   ├── ARManager.jsx          # AR feature management
│   ├── DataSeeder.jsx         # Database seeding utility
│   └── admin.css              # Admin-specific styles
├── pages/
│   ├── AdminDashboard.jsx     # Main admin interface
│   └── AdminSetup.jsx         # Admin user creation
├── services/
│   └── firestoreService.js    # Firestore operations
├── utils/
│   └── adminSetup.js          # Admin utility functions
└── components/
    └── AdminRoute.jsx         # Admin route protection
```

### Key Features

- **Role-based routing**: Admin routes protected by role check
- **Real-time data**: Content loaded from Firestore in real-time
- **Batch operations**: Efficient seeding with Firestore batch writes
- **Translation ready**: Content structure supports Gemini API translation
- **AR management**: Granular control over AR features per concept
- **Responsive design**: Admin interface works on mobile and desktop

## Troubleshooting

### Common Issues

1. **"Access Denied" when accessing admin**

   - Check user role in Firestore users collection
   - Ensure role is set to "admin"
   - Refresh the page after role change

2. **Seeding fails**

   - Check Firestore security rules
   - Verify admin user has write permissions
   - Check browser console for detailed errors

3. **Content not loading**

   - Verify Firestore configuration
   - Check network connectivity
   - Ensure collections exist in Firestore

4. **Translation not working**
   - Add VITE_GEMINI_API_KEY to environment
   - Check Gemini API quota and billing
   - Fallback to English if API unavailable

### Support

- Check browser console for detailed error messages
- Verify Firebase project configuration
- Ensure all environment variables are set correctly
- Test with a fresh user account if issues persist
