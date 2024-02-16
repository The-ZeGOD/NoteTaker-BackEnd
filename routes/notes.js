const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { addNote } = require("../controllers/notes");
const router = express.Router();

router.post("/add", verifyToken, addNote);

module.exports = router;