const bookController = require("../controllers/book");
const express = require("express");

const router = express.Router();

router.post("/", bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.patch("/:id", bookController.updateBookById);
router.delete("/:id", bookController.deleteBookById);

module.exports = router;
