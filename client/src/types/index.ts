// ─── USER TYPE ────────────────────────────────────────────────
export interface User {
  id: string;      // MongoDB _id
  name: string;    // "Akash Mehar"
  email: string;   // "akash@gmail.com"
}

// ─── REVIEW TYPE ──────────────────────────────────────────────
export interface Review {
  _id: string;        // MongoDB document ID
  code: string;       // The code that was reviewed
  language: string;   // "javascript", "python" etc
  feedback: string;   // AI's feedback text
  createdAt: string;  // When review was created
}

// ─── AUTH RESPONSE TYPE ───────────────────────────────────────
// What your backend sends back after login/signup
export interface AuthResponse {
  token: string;  // JWT token for future requests
  user: User;     // User info
}