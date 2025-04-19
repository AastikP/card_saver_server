import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();

// CORS settings — allow requests from your frontend
app.use(cors({
  origin: 'https://aastikp.github.io',
}));
app.use(express.json());

// Health check route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Firebase admin initialization from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route to generate Firebase custom token
app.post('/generate-token', async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const token = await admin.auth().createCustomToken(uid);
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Token creation failed' });
  }
});

// Use Railway's assigned PORT or fallback to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
