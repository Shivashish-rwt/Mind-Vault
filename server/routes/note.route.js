const express = require("express");
const { addNote, editNote, getNotes, deleteNote, updateNotePin, searchNotes } = require("../controllers/note.controller");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add-note",  authenticateToken, addNote);

router.put("/edit-note/:noteId",  authenticateToken, editNote);

router.get("/get-notes",  authenticateToken, getNotes);

router.delete("/delete-note/:noteId",  authenticateToken, deleteNote);

router.put("/update-note-pin/:noteId",  authenticateToken, updateNotePin);

router.get("/search-notes", authenticateToken, searchNotes);

module.exports = router;