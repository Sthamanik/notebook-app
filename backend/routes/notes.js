const express = require("express");
const Note = require("../models/Note");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ................................................ROUTE 1.......................................
// Add the notes using: POST "/api/notes/addnotes". Require login
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description must be at least 5 characters long"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there is errors display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(999).send("fatal error 404");
    }
  }
);

// ................................................ROUTE 2.......................................
// Get all the notes using: GET "/api/notes/getallnotes". Require login
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(999).send("fatal error 404");
  }
});

// ................................................ROUTE 3.......................................
// Update an existing note using: PUT "/api/notes/updatenote". Require login
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
  
    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Enter the valid request");
    }
  
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not accessible");
    }
  
    note = await Note.findByIdAndUpdate(req.params.id,{ $set: newNote },{ new: true });
    res.json({note});
  } catch (error) {
    console.error(error.message);
    res.status(999).send("fatal error 404");
  }
});

// ................................................ROUTE 4.......................................
// Delete an existing note using: DELETE "/api/notes/deletenote". Require login
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
          return res.status(404).send("Enter the valid request");
        }
      
        // Allow deletion only if the note belongs to that user 
        if (note.user.toString() != req.user.id) {
          return res.status(401).send("Not accessible");
        }
      
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Status": "Deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(999).send("fatal error 404");
    }
  });

module.exports = router;
