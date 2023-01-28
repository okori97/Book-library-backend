const readerController = require("../controllers/reader");
const express = require("express");

const router = express.Router();

router.post("/", readerController.createReader);
router.get("/", readerController.getAllReaders);
router.get("/:id", readerController.getReaderById);
router.patch("/:id", readerController.updateReaderById);
router.delete("/:id", readerController.deleteReaderById);

module.exports = router;
