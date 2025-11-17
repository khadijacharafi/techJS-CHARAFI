// server.js - Serveur Express avec MongoDB
// Installation nécessaire: npm install express mongodb cors dotenv

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'booktracker';
const COLLECTION_NAME = 'Books';

let db;
let booksCollection;

// Connexion à MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Connecté à MongoDB');
    db = client.db(DB_NAME);
    booksCollection = db.collection(COLLECTION_NAME);
  })
  .catch(error => console.error('❌ Erreur de connexion MongoDB:', error));

// Routes API

// GET tous les livres
app.get('/api/books', async (req, res) => {
  try {
    const books = await booksCollection.find().toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET un livre par ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await booksCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST ajouter un nouveau livre
app.post('/api/books', async (req, res) => {
  try {
    const book = {
      ...req.body,
      finished: req.body.pagesRead >= req.body.numberOfPages,
      createdAt: new Date()
    };
    
    const result = await booksCollection.insertOne(book);
    const newBook = await booksCollection.findOne({ _id: result.insertedId });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour un livre
app.put('/api/books/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Mettre à jour automatiquement le champ finished
    if (updates.pagesRead !== undefined && updates.numberOfPages !== undefined) {
      updates.finished = updates.pagesRead >= updates.numberOfPages;
    }
    
    updates.updatedAt = new Date();
    
    const result = await booksCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE supprimer un livre
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});