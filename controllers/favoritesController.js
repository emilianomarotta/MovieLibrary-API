const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.txt');
const favoritesFilePath = path.join(__dirname, '../data/favorites.txt');

const addFavoriteMovie = (req, res) => {
  const user = req.user;
  const userId = user.userId;
  const { movieId, title, releaseDate, originalLanguage } = req.body;
  const requiredFields = ['movieId', 'title', 'releaseDate', 'originalLanguage'];

  if (emptyFields(req.body, requiredFields)) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }
  if (!userExistsInFile(userId)) {
    return res.status(400).json({ message: 'Usuario no encontrado.' });
  }

  let users = getUsers();
  let userFavorites = getUserFavorites(users, userId);
  const existingFavorite = movieAlreadyInFavorites(userFavorites.favorites, movieId);
  if (existingFavorite) {
    return res.status(400).json({ message: 'La película ya está en la lista de favoritos.' });
  }

  const movieToAdd = { movieId, title, releaseDate, originalLanguage, addedAt: new Date() };
  userFavorites.favorites.push(movieToAdd);
  updateUsers(users, userId, userFavorites);
  saveUsersToFile(users);
  res.status(201).json({ message: 'Película agregada a favoritos con éxito.' });
};

const getFavoriteMovies = (req, res) => {
  const user = req.user;
  const userId = user.userId;
  let users = getUsers();
  let userFavorites = users[userId] && users[userId].favorites || [];
  userFavorites.forEach(movie => {
    movie.suggestionForTodayScore = Math.floor(Math.random() * 100);
  });
  userFavorites.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);

  res.json(userFavorites);
}

function emptyFields(data, fields) {
  return fields.some(field => !data[field]);
}

function userExistsInFile(userId) {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);
    if (users.find(user => user.email === userId)) {
      return true;
    }
  } catch (error) {
  }
  return false;
}

function getUsers() {
  try {
    const usersData = fs.readFileSync(favoritesFilePath, 'utf-8');
    return JSON.parse(usersData) || {};
  } catch (error) {
    return {};
  }
}


function getUserFavorites(users, userId) {
  return users[userId] || { favorites: [] };
}

function movieAlreadyInFavorites(favorites, movieId) {
  return favorites.find(favorite => favorite.movieId === movieId);
}

function updateUsers(users, userId, userFavorites) {
  users[userId] = userFavorites;
}

function saveUsersToFile(users) {
  fs.writeFileSync(favoritesFilePath, JSON.stringify(users, null, 2));
}

module.exports = {
  addFavoriteMovie, getFavoriteMovies,
};