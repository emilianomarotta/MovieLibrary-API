const axios = require('axios');

const getMovies = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const apiKey = 'd7faa0585c25398b4ba7aa5e481c6216';
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${keyword}`
    );

    const movies = response.data.results.map(movie => ({
      ...movie,
      suggestionScore: Math.floor(Math.random() * 100),
    }));

    movies.sort((a, b) => b.suggestionScore - a.suggestionScore);

    res.json(movies);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    res.status(500).json({ message: 'Error al obtener películas.' });
  }
};

module.exports = {
  getMovies,
};