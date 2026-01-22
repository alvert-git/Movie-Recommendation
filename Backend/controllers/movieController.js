const db = require('../config/connectDB');
const axios = require('axios');

exports.getAllMovies = async (req, res) => {
    try {
        // 1. Get movies from your MySQL database
        // Adjust the LIMIT as needed
        const [rows] = await db.query("SELECT movie_id, title FROM movies LIMIT 20");

        if (rows.length === 0) {
            return res.status(404).json({ message: "No movies found" });
        }

        // 2. Map through movies and fetch poster from TMDB for each
        const moviesWithPosters = await Promise.all(rows.map(async (movie) => {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.movie_id}`, {
                    headers: {
                        accept: "application/json",
                        // Using the token you provided earlier
                        Authorization: `Bearer ${process.env.TMDB_MOVIE_API}`
                    }
                });

                const posterPath = tmdbResponse.data.poster_path;
                return {
                    ...movie,
                    poster_url: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "https://via.placeholder.com/500x750?text=No+Poster"
                };
            } catch (error) {
                // If TMDB fails for one movie, return a placeholder so the whole list doesn't crash
                return {
                    ...movie,
                    poster_url: "https://via.placeholder.com/500x750?text=Error"
                };
            }
        }));

        res.status(200).json(moviesWithPosters);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getMovieById = async (req, res) => {
    const { id } = req.params;
    const TMDB_BEARER_TOKEN = `${process.env.TMDB_MOVIE_API}`;

    try {
        // Fetch full details from TMDB using the ID
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
                accept: 'application/json'
            }
        });

        const data = response.data;
        // Format the response to include the full poster URL
        const movieDetails = {
            ...data,
            poster_url: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            backdrop_url: `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        };

        res.json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movie details from TMDB" });
    }
};