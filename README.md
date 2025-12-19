## Prerequisites

Make sure you have the following installed:


### Backend
- Java 21+
- Maven

### Frontend (only if running the UI)
- Node.js 18+
- npm or yarn

### You will also need API keys for:
- AssemblyAI
- Google Gemini
- Groq


---

## Repository Structure

AI_Meeting_Minutes_Generator/
│
├── meeting-minutes-api/ # Spring Boot backend
│
├── meeting-minutes-generator-frontend/ # React frontend
│
└── README.md

---


## Backend Setup (Spring Boot)

### 1. Navigate to backend

```bash
cd meeting-minutes-api
```
### 2. Setup API keys

Create this file locally only (it is git-ignored)


`meeting-minutes-api/src/main/resources/application.properties`

Note: This file should never be committed to version control and is used only for local development.

Paste the following: 

```
assemblyai.api.key= your_key_here
gemini.api.key= your_key_here
groq.api.key= your_key_here
```

### 3. Run backend

```bash
mvn spring-boot:run
```

Backend will start at:
http://localhost:8080

---


## Frontend Setup (React)

### 1. Navigate to frontend

```bash
cd meeting-minutes-generator-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend

```bash
npm run dev
```

Frontend will start at:
http://localhost:5173


---
