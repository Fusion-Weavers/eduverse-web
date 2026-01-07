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

#### Option A: During Registration (Recommended)

1. Go to the signup page (`/signup`)
2. Fill in email and password
3. Check the "Create as Admin Account" checkbox
4. Click "Create Account"
5. You'll be automatically logged in with admin privileges

#### Option B: Using Browser Console (for existing users)

1. Login as the user you want to make admin
2. Open browser developer console
3. Run: `makeUserAdmin("user-uid-here")`
4. Refresh the page

#### Option C: Direct Firestore Update

1. Go to Firebase Console → Firestore
2. Find the user document in `users` collection
3. Add/update field: `role: "admin"`

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
