const express = require("express");
const router = express.Router();
const contenedorController = require("../controllers/contenedorController");

router.get("/", contenedorController.obtenerContenedores);

module.exports = router;
