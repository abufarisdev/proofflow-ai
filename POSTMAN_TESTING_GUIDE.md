# Postman Testing Guide - Verify Database Writes

## Prerequisites

1. **Backend server running** on `http://localhost:5000`
2. **Postman installed**
3. **Firebase Authentication** - You need to be logged in to get a token

## Step 1: Get Your Firebase ID Token

### Option A: From Browser Console (Easiest) - **Microsoft Edge Specific**

1. **Open your frontend app** in Microsoft Edge: `http://localhost:3000`
2. **Log in with GitHub** (click "Continue with GitHub")
3. **Open Developer Tools**:
   - Press `F12` key, OR
   - Press `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac), OR
   - Right-click on the page → Select "Inspect"
4. **Click on the "Console" tab** at the top of the Developer Tools panel
5. **Paste this command** in the console and press `Enter`:

```javascript
// Get Firebase ID Token (for Edge)
import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js').then(() => {
  return import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
}).then(() => {
  // Access Firebase from window if available
  if (window.firebase && window.firebase.auth) {
    const user = window.firebase.auth().currentUser;
    if (user) {
      user.getIdToken().then(token => {
        console.log('📋 Firebase ID Token:');
        console.log(token);
        navigator.clipboard.writeText(token).then(() => {
          console.log('✅ Token copied to clipboard!');
        });
      });
    } else {
      console.log('❌ No user logged in. Please log in first.');
    }
  } else {
    // Alternative: Access from your app's Firebase instance
    console.log('Try accessing auth from your app. Run this instead:');
    console.log('Check Network tab for Authorization headers in API requests');
  }
});
```

**OR use this simpler method** (if you're already logged in):

```javascript
// Simple method - works if Firebase is already initialized
(async () => {
  try {
    // Try to access auth from the page
    const response = await fetch('http://localhost:5000/api/users/me', {
      credentials: 'include'
    });
    console.log('Response:', await response.text());
  } catch(e) {
    console.log('Error:', e);
    console.log('Please check Network tab for Authorization header instead');
  }
})();
```

6. **Copy the token** from the console output - You'll need it for all authenticated requests

### Alternative: Get Token from Network Tab (Easier for Edge)

1. **Open Developer Tools** (`F12`)
2. **Click "Network" tab**
3. **Make sure you're logged in** to your app
4. **Refresh the page** or navigate around
5. **Look for requests** to `localhost:5000`
6. **Click on any API request** (e.g., `/api/users/me`)
7. **Click "Headers"** section
8. **Scroll to "Request Headers"**
9. **Find "Authorization"** header
10. **Copy the token** (the part after `Bearer `)

### Option B: Create a Test Endpoint (Alternative)

You can also add this to your frontend temporarily to get the token easily.

## Step 2: Set Up Postman Collection

### Create a New Collection

1. Open Postman
2. Create a new Collection: "ProofFlow API Tests"
3. Add an Environment Variable:
   - Variable: `base_url`
   - Value: `http://localhost:5000/api`
   - Variable: `token`
   - Value: `YOUR_FIREBASE_TOKEN_HERE` (paste your token)

## Step 3: Test Endpoints

> **⚠️ Important**: `/api` alone returns 404. You must use specific endpoints like `/api/users/me`, `/api/projects`, etc.

### 0. Test Server Health (GET /)

- **Method**: `GET`
- **URL**: `http://localhost:5000/`
- **No authentication required**

**Expected Response:**
```json
{
  "message": "Backend running on localhost 🚀",
  "port": 5000,
  "endpoints": { ... }
}
```

### 1. Test User Creation (GET /api/users/me)

**This will create a user in Firestore if they don't exist!**

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/users/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  Content-Type: application/json
  ```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "firebaseUid": "...",
    "email": "...",
    "displayName": "...",
    ...
  }
}
```

**Check Backend Console:**
- You should see: `📝 Creating new user in Firestore: ...`
- Or: `👤 User already exists in Firestore: ...`
- You should see: `💾 Firestore write: Created user document ...`

**Verify in Firestore:**
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `user` collection
4. You should see a document with your `firebaseUid`

---

### 2. Update User Profile (PUT /api/users/me)

- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/users/me`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  Content-Type: application/json
  ```
- **Body** (raw JSON):
```json
{
  "displayName": "Updated Name",
  "organization": "Test Company",
  "role": "Developer",
  "bio": "Testing from Postman",
  "githubUsername": "testuser"
}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "firebaseUid": "...",
    "displayName": "Updated Name",
    "organization": "Test Company",
    ...
  }
}
```

**Verify in Firestore:**
- Check `user` collection
- Document should have `updatedAt` field
- Fields should be updated

---

### 3. Create Project (POST /api/projects)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/projects`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  Content-Type: application/json
  ```
- **Body** (raw JSON):
```json
{
  "repoName": "test-repo",
  "repoUrl": "https://github.com/username/test-repo",
  "description": "Test project from Postman"
}
```

**Expected Response:**
```json
{
  "success": true,
  "project": {
    "id": "...",
    "userId": "...",
    "repoName": "test-repo",
    "repoUrl": "https://github.com/username/test-repo",
    ...
  }
}
```

**Verify in Firestore:**
- Check `projects` collection
- New document should be created
- Should have `userId` matching your Firebase UID

---

### 4. Get User Projects (GET /api/projects)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/projects`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "...",
      "repoName": "test-repo",
      "repoUrl": "...",
      ...
    }
  ]
}
```

---

### 5. Create Report (POST /api/reports/create)

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/reports/create`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  Content-Type: application/json
  ```
- **Body** (raw JSON):
```json
{
  "projectId": "YOUR_PROJECT_ID_FROM_STEP_3"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification report created",
  "data": {
    "id": "...",
    "projectId": "...",
    "confidenceScore": 0,
    ...
  }
}
```

**Verify in Firestore:**
- Check `reports` collection
- New report document should be created
- Project status should be updated to "pending"

---

### 6. Get All Reports (GET /api/reports)

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/reports`
- **Headers**:
  ```
  Authorization: Bearer YOUR_FIREBASE_TOKEN
  ```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "...",
      "projectId": {
        "id": "...",
        "repoName": "...",
        ...
      },
      ...
    }
  ]
}
```

---

## Step 4: Monitor Backend Console

Watch your backend terminal for these logs:

### User Creation:
```
📝 Creating new user in Firestore: <uid> (<email>)
💾 Firestore write: Created user document <uid> in collection 'user'
✅ User created successfully in Firestore: <uid>
```

### User Update:
```
💾 Firestore write: Updated user document <uid> in collection 'user'
```

### Project Creation:
- Check for successful project creation logs

### Report Creation:
- Check for successful report creation logs

---

## Step 5: Verify in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `proofflow-ai`
3. Navigate to **Firestore Database**
4. Check these collections:

### Collections to Check:

1. **`user`** collection
   - Should contain user documents with `firebaseUid` as document ID
   - Fields: `email`, `displayName`, `role`, `organization`, `bio`, `githubUsername`, `createdAt`, `updatedAt`

2. **`projects`** collection
   - Should contain project documents
   - Fields: `userId`, `repoName`, `repoUrl`, `status`, `createdAt`, `updatedAt`

3. **`reports`** collection
   - Should contain report documents
   - Fields: `projectId`, `confidenceScore`, `timeline`, `flags`, `summary`, `createdAt`, `analyzedAt`

---

## Quick Test Script

You can also use this in your browser console to test quickly:

```javascript
// Test API from browser console
async function testAPI() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log('Please log in first');
    return;
  }
  
  const token = await user.getIdToken();
  const baseURL = 'http://localhost:5000/api';
  
  // Test GET /users/me (creates user if doesn't exist)
  try {
    const response = await fetch(`${baseURL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ User API Response:', data);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testAPI();
```

---

## Troubleshooting

### 401 Unauthorized
- **Problem**: Token expired or invalid
- **Solution**: Get a fresh token from browser console

### 500 Server Error
- **Problem**: Firebase not initialized
- **Solution**: Check backend console for Firebase initialization errors
- **Check**: Ensure `.env` file has all Firebase credentials

### No data in Firestore
- **Problem**: Writes not happening
- **Solution**: 
  1. Check backend console for error messages
  2. Verify Firebase credentials in `.env`
  3. Check Firestore rules allow writes

### CORS Error
- **Problem**: Postman might have CORS issues
- **Solution**: Use Postman Desktop app or check CORS settings in `server.js`

---

## Postman Collection JSON

You can import this into Postman:

```json
{
  "info": {
    "name": "ProofFlow API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    }
  ],
  "item": [
    {
      "name": "Get User (Creates if doesn't exist)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/users/me",
          "host": ["{{base_url}}"],
          "path": ["users", "me"]
        }
      }
    },
    {
      "name": "Update User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"displayName\": \"Test User\",\n  \"organization\": \"Test Org\",\n  \"role\": \"Developer\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/users/me",
          "host": ["{{base_url}}"],
          "path": ["users", "me"]
        }
      }
    },
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"repoName\": \"test-repo\",\n  \"repoUrl\": \"https://github.com/user/test-repo\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/projects",
          "host": ["{{base_url}}"],
          "path": ["projects"]
        }
      }
    }
  ]
}
```

---

## Summary

1. ✅ Get Firebase token from browser console
2. ✅ Set up Postman with token in Authorization header
3. ✅ Test endpoints and watch backend console
4. ✅ Verify writes in Firebase Console → Firestore
5. ✅ Check backend logs for write confirmations

Happy Testing! 🚀

