# 🚀 ProofFlow-AI

**AI-Powered Code Authenticity & Development Activity Analysis Platform**

ProofFlow-AI is a full-stack platform that analyzes GitHub repositories to assess **code authenticity**, **development consistency**, and **commit behavior patterns**. It generates detailed reports with confidence scores, timelines, and flags to help **teams, recruiters, and organizations** verify genuine development activity.

---

## ✨ Features

### 🔍 Repository Analysis

* Fetches complete commit history from repository creation → present
* Builds a **daily commit timeline** (no gaps)
* Calculates:

  * Total commits
  * Active days
  * Average commits per day
  * Max commits in a single day

### 🧠 AI-Powered Assessment (Optional)

* Gemini-based analysis (**fully configurable**)
* Generates:

  * Confidence score (0–100)
  * Human-readable summary
  * Detected flags (if any)
* Fully rate-limited and safe to disable

### 🧾 Reports System

* Persistent reports stored in **Firestore**
* View all reports or drill into a single report
* Sorted by most recent activity
* Secure, **user-based access control**

### 📊 Visual Dashboard

* Commit activity timeline
* Confidence meter
* Flags & verification status
* Clean, modern UI (**dark mode supported**)

### 🔐 Authentication & Security

* Protected routes via **AuthGuard**
* User-specific projects & reports
* Environment-based configuration

---
### Team Details
| Name           | Role       | GitHub |
|----------------|------------|--------|
| Abu Faris      | Team Lead  | [@abufarisdev](https://github.com/abufarisdev) |
| Adarsh Shaw    | Member     | [@adarsh-279](https://github.com/adarsh-279) |
| Ashmit Rai     | Member     | [@ashmitt](https://github.com/ashmitt) |
| Hassan Rahman  | Member     | [@HassanRahman7](https://github.com/hassanrahman7) |

---

### 🖼️ Snapshots
<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/c572ce91-9e99-4bab-a368-0ee542ce5754"
           alt="Screenshot 1"
           width="480" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/dc9d1967-9df8-4495-9e95-c2e57a8f71af"
           alt="Screenshot 2"
           width="480" />
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/9a3eb4e2-4811-4e5f-b72f-c60066e0e389"
           alt="Screenshot 3"
           width="480" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/94070f76-5bd4-42b3-8751-78070d01c662"
           alt="Screenshot 4"
           width="480" />
    </td>
  </tr>
</table>


---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* ShadCN/UI

### Backend

* Node.js
* Express
* Firestore (Firebase Admin SDK)
* GitHub REST API
* Gemini AI (optional)

### AI

* Google Gemini
* Model: `gemini-2.5-flash-lite`
* Fully optional via environment flag

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000

# GitHub
GITHUB_TOKEN=your_github_token

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# AI (Optional)
USE_GEMINI=true
GEMINI_MODEL=gemini-2.5-flash-lite
GOOGLE_API_KEY=your_gemini_api_key
```

🔹 Set `USE_GEMINI=false` to use deterministic, non-AI summaries.

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/proofflow-ai.git
cd proofflow-ai
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Run the Application

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 📈 How It Works

1. User submits a GitHub repository
2. Backend fetches:

   * Repository metadata
   * Full commit history
3. Commit data is analyzed and aggregated
4. (Optional) AI generates confidence score & summary
5. Report is stored in **Firestore**
6. Frontend renders:

   * Timeline
   * Score
   * Flags
   * Summary

---

## 🧪 AI Safety & Reliability

* Strict rate limiting
* Timeout-protected calls
* Graceful fallback when AI is unavailable
* No AI mention in user-facing summaries

---

## 🎯 Use Cases

* Hackathon submissions verification
* Recruiter portfolio validation
* Academic project authenticity checks
* Open-source contribution analysis
* Internal engineering audits


Let’s make **ProofFlow-AI** the standard for code authenticity verification.
