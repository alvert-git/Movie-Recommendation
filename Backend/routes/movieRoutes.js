const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// This matches the '/api/movies' path you defined in server.js
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;