const axios = require('axios');

const getMovies = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const apiKey = 'd7faa0585c25398b4ba7aa5e481c6216';
        let response;
        if (keyword) {
            response = await getMoviesByKeyword(apiKey, keyword);
        } else {
            response = await getPopularMovies(apiKey);
        }

        const movies = addSuggestionScore(response.data.results);
        movies.sort((a, b) => b.suggestionScore - a.suggestionScore);
        res.json(movies);

    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ message: 'Error al obtener películas.' });
    }
};

async function getMoviesByKeyword(apiKey, keyword) {
    return await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${keyword}`
    );
}

async function getPopularMovies(apiKey) {
    return await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`
    );
}

function addSuggestionScore(movies) {
    return movies.map(movie => ({
        ...movie,
        suggestionScore: Math.floor(Math.random() * 100),
    }));
}

module.exports = {
    getMovies,
};