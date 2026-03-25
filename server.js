const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT TO COMPASS (LOCAL)
mongoose.connect("mongodb://127.0.0.1:27017/notesDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 Notes API Running");
});

// SCHEMA
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", noteSchema);

// GET NOTES
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// ADD NOTE
app.post("/add-note", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });
  await note.save();
  res.json(note);
});

// DELETE NOTE
app.delete("/delete-note/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE NOTE
app.put("/update-note/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  res.json(note);
});

// FAVORITE
app.put("/favorite-note/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  note.favorite = !note.favorite;
  await note.save();
  res.json(note);
});

// SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});