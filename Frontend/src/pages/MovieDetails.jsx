import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MovieDetails = () => {
    const { id, title } = useParams();
    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. Fetch details from Node.js (which calls TMDB)
                const detailRes = await fetch(`http://localhost:9000/api/movies/${id}`);
                const detailData = await detailRes.json();
                setMovie(detailData);

                // 2. Fetch recommendations from Flask
                const recRes = await fetch('http://127.0.0.1:5000/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movie_name: decodeURIComponent(title) })
                });
                const recData = await recRes.json();
                setRecommendations(recData.recommendations || []);
            } catch (err) {
                console.error("Error loading data:", err);
            }
            setLoading(false);
        };
        fetchAllData();
        // Scroll to top when movie changes
        window.scrollTo(0, 0);
    }, [id, title]);

    if (loading) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Loading...</div>;

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Backdrop Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img src={movie?.backdrop_url} className="w-full h-full object-cover opacity-40" alt="backdrop" />
                <div className="absolute bottom-0 left-0 p-10 bg-gradient-to-t from-black to-transparent w-full">
                    <div className="container mx-auto flex gap-8 items-end">
                        <img src={movie?.poster_url} className="w-48 rounded-lg shadow-xl hidden md:block" alt="poster" />
                        <div>
                            <h1 className="text-5xl font-bold">{movie?.title}</h1>
                            <p className="text-red-500 font-semibold mt-2">{movie?.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movie Info Section */}
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">{movie?.overview}</p>
                    
                    <div className="mt-8 flex gap-6 text-sm">
                        <div><p className="text-gray-500">Runtime</p><p>{movie?.runtime} min</p></div>
                        <div><p className="text-gray-500">Release Date</p><p>{movie?.release_date}</p></div>
                        <div><p className="text-gray-500">Budget</p><p>${movie?.budget?.toLocaleString()}</p></div>
                    </div>
                </div>

                {/* Sidebar - Genres */}
                <div className="bg-gray-900 p-6 rounded-lg h-fit">
                    <h3 className="font-bold mb-4">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {movie?.genres?.map(g => (
                            <span key={g.id} className="bg-red-600/20 border border-red-600 px-3 py-1 rounded-full text-xs">
                                {g.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* More Like This Section */}
            <div className="container mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold mb-8">More Like This</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {recommendations.map((rec) => (
                        <Link key={rec.movie_id} to={`/movie/${rec.movie_id}/${encodeURIComponent(rec.title)}`} className="group">
                            <img src={rec.poster_url} className="rounded-lg transition-transform group-hover:scale-105" alt={rec.title} />
                            <p className="mt-2 text-sm font-medium truncate">{rec.title}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;