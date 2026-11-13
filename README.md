# QOS Verify Frontend

React (Vite) UI for the QOS identity verification backend.

## Install & run

    npm install
    cp .env.example .env       # VITE_API_BASE defaults to http://localhost:8000
    npm run dev

Open http://localhost:5173. The backend must be running on http://localhost:8000.

## Flow

1. Upload a NIN or Passport image — extracts fields and the ID face.
2. Confirm desktop liveness (PoC attestation).
3. Upload/capture a selfie — DeepFace compares against the ID face.
4. Result: verdict, confidence, distance, and document fields.
