import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ============ API ENDPOINTS ============

// Health Check
app.get('/health', (req, res): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AccessiPilot Backend'
  });
});

// Create Narration
app.post('/narrate', async (req, res): Promise<void> => {
  try {
    const { text, voiceId } = req.body;
    const uid = req.headers.authorization?.split('Bearer ')[1];

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!text || text.trim().length === 0) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    // Save to Firestore
    const docRef = await db.collection('narrations').add({
      userId: uid,
      text: text.trim(),
      voiceId: voiceId || 'default',
      audioUrl: 'https://placeholder-audio.com/audio.mp3',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed',
      wordCount: text.split(' ').length
    });

    res.json({
      id: docRef.id,
      userId: uid,
      text: text.trim(),
      status: 'completed',
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to create narration',
      message: error.message
    });
  }
});

// Get User Narrations
app.get('/narrations', async (req, res): Promise<void> => {
  try {
    const uid = req.headers.authorization?.split('Bearer ')[1];

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const snapshot = await db
      .collection('narrations')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const narrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()
    }));

    res.json(narrations);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch narrations',
      message: error.message
    });
  }
});

// Delete Narration
app.delete('/narrations/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const uid = req.headers.authorization?.split('Bearer ')[1];

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const doc = await db.collection('narrations').doc(id).get();
    if (doc.data()?.userId !== uid) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await db.collection('narrations').doc(id).delete();
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export as Cloud Function
export const api = functions.https.onRequest(app);
