# Eduverse - Multilingual STEM Learning Platform

A web application designed to help rural and non-English students understand complex STEM concepts through localized language explanations. The platform provides structured browsing of subjects and topics, search functionality, multilingual content support, and user personalization features.

## Features

- **Subject Organization**: Browse STEM content organized by Engineering, Physics, Biology, and Chemistry
- **Multilingual Support**: Access content in multiple languages with persistent language preferences
- **Search & Discovery**: Find specific concepts and topics with advanced filtering
- **Favorites System**: Save and organize favorite topics and concepts
- **User Profiles**: Manage preferences and track learning progress
- **Offline Reading**: Access previously viewed content without internet connectivity
- **Responsive Design**: Optimized for various device sizes

## Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - **VITE_GEMINI_API_KEY**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Firebase Configuration**: Get these values from your Firebase project settings
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN
     - VITE_FIREBASE_PROJECT_ID
     - VITE_FIREBASE_STORAGE_BUCKET
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID

### Development

Start the development server:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file shows the required environment variables without sensitive values
- Firebase configuration values are safe for client-side use but should still be organized properly
- Keep your Gemini API key secure and rotate it if compromised

## Technology Stack

- **Frontend**: React + Vite
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **Styling**: CSS with responsive design
- **State Management**: React Context API
