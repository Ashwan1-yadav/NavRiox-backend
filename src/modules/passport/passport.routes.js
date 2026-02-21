const express = require("express");
const multer = require("multer");
const path = require("path");
const passportController = require("./passport.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/generate",
  upload.single("photo"),
  passportController.generatePassport
);

module.exports = router;