const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.txt');
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, '', 'utf-8');
}

const registerUser = (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const requiredFields = ['email', 'firstName', 'lastName', 'password'];

  if (emptyFields(req.body, requiredFields)) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Ingrese mail válido.' });
  }

  let users = getUsers();
  if (userAlreadyExist(users, email)) {
    return res.status(409).json({ message: 'El usuario ya está registrado.' });
  }

  const newUser = { email, firstName, lastName, password };
  const addedUser = addUser(newUser, usersFilePath);
  res.status(201).json({ message: 'Usuario registrado con éxito.', user: addedUser });
};

function getUsers() {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(usersData);
  } catch (error) {
    return [];
  }
}

function emptyFields(data, fields) {
  return fields.some(field => !data[field]);
}

function isValidEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

function userAlreadyExist(users, email) {
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

function addUser(newUser, usersFilePath) {
  let users = getUsers(usersFilePath);
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  return newUser;
}

module.exports = {
  registerUser,
};