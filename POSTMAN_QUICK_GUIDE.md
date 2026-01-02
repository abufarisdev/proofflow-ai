# Postman Quick Guide - Test Database Reads & Writes

## 🎯 Quick Start: 3 Steps to Test

### Step 1: Get Your Firebase Token (2 minutes)

**Method 1: Network Tab (Easiest)**
1. Open your app: `http://localhost:3000`
2. Log in with GitHub
3. Press `F12` → Click **"Network"** tab
4. Refresh the page
5. Find any request to `localhost:5000` (e.g., `/api/users/me`)
6. Click it → **"Headers"** tab → Scroll to **"Request Headers"**
7. Find `Authorization: Bearer eyJhbGc...`
8. **Copy everything after `Bearer `** (the long token string)

**Method 2: Console (Alternative)**
1. Press `F12` → **"Console"** tab
2. Paste this and press Enter:
```javascript
fetch('http://localhost:5000/api/users/me', {
  headers: { 'Authorization': 'Bearer ' + (await firebase.auth().currentUser?.getIdToken()) }
}).then(r => r.json()).then(console.log);
```
3. Check Network tab for the Authorization header

---

## Step 2: Set Up Postman

1. **Open Postman**
2. **Create Environment** (top right):
   - Click "Environments" → "Create Environment"
   - Name: `Local Dev`
   - Add variable: `token` = `YOUR_TOKEN_HERE` (paste from Step 1)
   - Add variable: `base_url` = `http://localhost:5000/api`
   - Click "Save"
   - **Select this environment** from dropdown (top right)

3. **Create Collection**:
   - Click "Collections" → "New Collection"
   - Name: `ProofFlow API Tests`

---

## Step 3: Test Database Operations

### ✅ TEST 1: Write - Create User in Firestore

**This happens automatically when you call `/api/users/me` for the first time!**

1. **Create Request**:
   - Method: `GET`
   - URL: `{{base_url}}/users/me`
   - Headers tab:
     - Key: `Authorization`
     - Value: `Bearer {{token}}`
     - Key: `Content-Type`
     - Value: `application/json`

2. **Click "Send"**

3. **Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "firebaseUid": "abc123...",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

4. **Verify Write in Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `proofflow-ai`
   - Click **"Firestore Database"**
   - Click **"user"** collection
   - **You should see a new document** with your `firebaseUid` as the document ID

---

### ✅ TEST 2: Read - Get User Profile

1. **Same request as TEST 1** (GET `/api/users/me`)
2. **Click "Send"** again
3. **Expected**: Returns your user data from Firestore
4. **Check Backend Console**: Should show `👤 User already exists in Firestore`

---

### ✅ TEST 3: Write - Create Project

1. **Create Request**:
   - Method: `POST`
   - URL: `{{base_url}}/projects`
   - Headers:
     - `Authorization: Bearer {{token}}`
     - `Content-Type: application/json`
   - Body tab → Select **"raw"** → Select **"JSON"**
   - Paste:
```json
{
  "repoName": "my-awesome-project",
  "repoUrl": "https://github.com/username/my-awesome-project"
}
```

2. **Click "Send"**

3. **Expected Response** (201 Created):
```json
{
  "success": true,
  "project": {
    "id": "project123...",
    "userId": "your-firebase-uid",
    "repoName": "my-awesome-project",
    "repoUrl": "https://github.com/username/my-awesome-project",
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

4. **Verify Write**:
   - Firebase Console → Firestore → **"projects"** collection
   - **New document created** with the project data
   - **Copy the `id`** from response (you'll need it for TEST 4)

---

### ✅ TEST 4: Read - Get All Projects

1. **Create Request**:
   - Method: `GET`
   - URL: `{{base_url}}/projects`
   - Headers:
     - `Authorization: Bearer {{token}}`
     - `Content-Type: application/json`

2. **Click "Send"**

3. **Expected Response** (200 OK):
```json
{
  "success": true,
  "projects": [
    {
      "id": "project123...",
      "userId": "your-firebase-uid",
      "repoName": "my-awesome-project",
      "repoUrl": "https://github.com/username/my-awesome-project"
    }
  ]
}
```

---

### ✅ TEST 5: Write - Create Report

1. **Create Request**:
   - Method: `POST`
   - URL: `{{base_url}}/reports/create`
   - Headers:
     - `Authorization: Bearer {{token}}`
     - `Content-Type: application/json`
   - Body (raw JSON):
```json
{
  "projectId": "project123..."
}
```
   *(Use the project ID from TEST 3)*

2. **Click "Send"**

3. **Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Verification report created",
  "data": {
    "id": "report456...",
    "projectId": "project123...",
    "confidenceScore": 0,
    "timeline": [],
    "flags": []
  }
}
```

4. **Verify Write**:
   - Firebase Console → Firestore → **"reports"** collection
   - **New report document created**

---

### ✅ TEST 6: Read - Get All Reports

1. **Create Request**:
   - Method: `GET`
   - URL: `{{base_url}}/reports`
   - Headers:
     - `Authorization: Bearer {{token}}`
     - `Content-Type: application/json`

2. **Click "Send"**

3. **Expected Response** (200 OK):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "report456...",
      "projectId": "project123...",
      "project": {
        "id": "project123...",
        "repoName": "my-awesome-project",
        "repoUrl": "https://github.com/username/my-awesome-project",
        "status": "pending"
      },
      "confidenceScore": 0
    }
  ]
}
```

---

### ✅ TEST 7: Write - Update User Profile

1. **Create Request**:
   - Method: `PUT`
   - URL: `{{base_url}}/users/me`
   - Headers:
     - `Authorization: Bearer {{token}}`
     - `Content-Type: application/json`
   - Body (raw JSON):
```json
{
  "displayName": "Updated Name",
  "bio": "I'm a developer",
  "organization": "My Company"
}
```

2. **Click "Send"**

3. **Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "firebaseUid": "abc123...",
    "displayName": "Updated Name",
    "bio": "I'm a developer",
    "organization": "My Company",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

4. **Verify Write**:
   - Firebase Console → Firestore → **"user"** collection
   - Click on your user document
   - **Fields should be updated** with new values

---

## 📊 Summary: What Gets Written to Firestore

| Endpoint | Collection | What Gets Created/Updated |
|----------|-----------|---------------------------|
| `GET /api/users/me` (first time) | `user` | Creates user document |
| `PUT /api/users/me` | `user` | Updates user document |
| `POST /api/projects` | `projects` | Creates project document |
| `POST /api/reports/create` | `reports` | Creates report document |

---

## 🔍 How to Verify Writes in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **`proofflow-ai`**
3. Click **"Firestore Database"** in left sidebar
4. Click on collection name (e.g., `user`, `projects`, `reports`)
5. **See all documents** with their data
6. Click on a document to see/edit fields

---

## 🐛 Troubleshooting

### Error: "401 Unauthorized"
- **Problem**: Token expired or invalid
- **Solution**: Get a new token (Step 1) and update `{{token}}` in Postman environment

### Error: "500 Internal Server Error"
- **Problem**: Backend issue
- **Solution**: 
  1. Check backend console for error messages
  2. Verify Firebase is initialized (should see `🔥 Firebase Admin Initialized`)
  3. Check `.env` file has all Firebase credentials

### Error: "404 Not Found"
- **Problem**: Wrong URL
- **Solution**: Use `{{base_url}}/users/me` not `{{base_url}}/api/users/me` (base_url already includes `/api`)

### No Data in Firebase Console
- **Problem**: Write didn't happen
- **Solution**: 
  1. Check backend console for `💾 Firestore write:` messages
  2. Verify you're looking at the correct Firebase project
  3. Make sure you're authenticated (token is valid)

---

## 📝 Postman Collection JSON (Import This)

Save this as `ProofFlow.postman_collection.json` and import into Postman:

```json
{
  "info": {
    "name": "ProofFlow API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
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
          "raw": "{\n  \"displayName\": \"Updated Name\",\n  \"bio\": \"My bio\"\n}"
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
          "raw": "{\n  \"repoName\": \"my-project\",\n  \"repoUrl\": \"https://github.com/user/repo\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/projects",
          "host": ["{{base_url}}"],
          "path": ["projects"]
        }
      }
    },
    {
      "name": "Get All Projects",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/projects",
          "host": ["{{base_url}}"],
          "path": ["projects"]
        }
      }
    },
    {
      "name": "Create Report",
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
          "raw": "{\n  \"projectId\": \"YOUR_PROJECT_ID_HERE\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/reports/create",
          "host": ["{{base_url}}"],
          "path": ["reports", "create"]
        }
      }
    },
    {
      "name": "Get All Reports",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/reports",
          "host": ["{{base_url}}"],
          "path": ["reports"]
        }
      }
    }
  ]
}
```

---

## ✅ Quick Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Logged into frontend app
- [ ] Got Firebase token from Network tab
- [ ] Created Postman environment with `token` and `base_url`
- [ ] Tested GET `/users/me` (creates user in Firestore)
- [ ] Verified user in Firebase Console
- [ ] Tested POST `/projects` (creates project)
- [ ] Verified project in Firebase Console
- [ ] Tested GET `/projects` (reads projects)
- [ ] Tested POST `/reports/create` (creates report)
- [ ] Verified report in Firebase Console
- [ ] Tested GET `/reports` (reads reports)
- [ ] Tested PUT `/users/me` (updates user)
- [ ] Verified update in Firebase Console

---

**🎉 You're done! You've successfully tested both reads and writes to Firestore!**

