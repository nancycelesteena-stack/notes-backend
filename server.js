// --------------------- IMPORTS ---------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --------------------- APP INIT ---------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------- ROOT ROUTE ---------------------
app.get("/", (req, res) => {
  res.send("🚀 Notes API Running");
});

// --------------------- DATABASE ---------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// --------------------- SCHEMA ---------------------
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model("Note", noteSchema);

// --------------------- ROUTES ---------------------

// GET ALL NOTES
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD NOTE
app.post("/add-note", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();

    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE NOTE
app.delete("/delete-note/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE NOTE
app.put("/update-note/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE FAVORITE
app.put("/favorite-note/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.favorite = !note.favorite;
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------- SERVER ---------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});