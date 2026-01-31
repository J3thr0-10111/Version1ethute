/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace these values with your actual Firebase project credentials
 * 
 * To get your config:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Select your project
 * 3. Click the gear icon > Project settings
 * 4. Scroll to "Your apps" section
 * 5. Select your web app or create one
 * 6. Copy the firebaseConfig object
 */

const firebaseConfig = {
    apiKey: "AIzaSyCRjwzppJ2oWGDBbUrGM4dzYtv9sXK7a8E",
    authDomain: "math-science-eb680.firebaseapp.com",
    projectId: "math-science-eb680",
    storageBucket: "math-science-eb680.firebasestorage.app",
    messagingSenderId: "390056091148",
    appId: "1:390056091148:web:df8956b8d4da026a3ad829",
    measurementId: "G-G4HWCGPW2L"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics ? firebase.analytics() : null;

// Enable offline persistence
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support persistence.');
    }
});

// Export for use in other modules
window.auth = auth;
window.db = db;
window.analytics = analytics;

// Log analytics events helper
window.logEvent = function(eventName, eventParams = {}) {
    if (analytics) {
        analytics.logEvent(eventName, eventParams);
    }
};
