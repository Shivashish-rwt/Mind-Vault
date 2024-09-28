const Note = require("../models/note.model");

const addNote = async (req, res) => {
    const { title, content, tags, isPinned } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title or content is missing" });
    }

    try {
        const note = await Note.create({
            title,
            content,
            tags: tags?.length > 0 ? tags : [],
            isPinned: isPinned ? isPinned : false,
            author: req.user._id,
        });

        return res.status(200).json({ message: "Note added successfully", note });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;

    if (!title && !content && !tags && !isPinned) {
        return res.status(400).json({ error: "No changes provided" });
    }

    try {
        const note = await Note.findById({ _id: noteId, author: req.user._id });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.status(200).json({ message: "Note updated successfully", note });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const getNotes = async (req, res) => {
    const userId = req.user._id;

    try {
        const notes = await Note.find({ author: userId }).sort({ isPinned: -1 });

        return res.status(200).json({ message: "Notes retrieved successfully", notes });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const deleteNote = async (req, res) => {
    const noteId = req.params.noteId;

    try {
        const result = await Note.findOneAndDelete({ _id: noteId, author: req.user._id });

        if (!result) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const updateNotePin = async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId, 
            {
                $set: { isPinned: isPinned }
            },
            { new: true }
        );

        if(!updatedNote){
            return res.status(404).json({ error: "Note not found" });
        }

        return res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

const searchNotes = async (req, res) => {
    const { query } = req.query;

    if(!query){
        return res.status(400).json({ error: "Search query required" });
    }

    try {
        const matchingNotes = await Note.find({
            author: req.user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });

        return res.status(200).json({ message: "Searched query retrieved successfully", notes: matchingNotes });
    } catch (err) {
        return res.status(500).json({ error: err?.message });
    }
}

module.exports = {
    addNote,
    editNote,
    getNotes,
    deleteNote,
    updateNotePin,
    searchNotes,
}