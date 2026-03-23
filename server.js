// --------------------- IMPORTS ---------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --------------------- APP INIT ---------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------- DATABASE ---------------------
mongoose.connect("mongodb://127.0.0.1:27017/notesDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --------------------- SCHEMA ---------------------
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", noteSchema);

// --------------------- ROUTES ---------------------

// GET ALL NOTES
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD NOTE
app.post("/add-note", async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      favorite: false,
      createdAt: new Date()
    });

    const savedNote = await note.save();
    console.log("Saved Note:", savedNote); // debug
    res.json(savedNote);
  } catch (err) {
    console.log(err);
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
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    res.json({ message: "Note updated", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE FAVORITE
app.put("/favorite-note/:id", async (req, res) => {
  try {
    console.log("⭐ Favorite API hit");
    const note = await Note.findById(req.params.id);
    note.favorite = !note.favorite;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------- SERVER ---------------------
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});