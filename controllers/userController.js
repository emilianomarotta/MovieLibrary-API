const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.txt');
if (!fs.existsSync(usersFilePath)) {
  // Si no existe, crearlo vacío
  fs.writeFileSync(usersFilePath, '', 'utf-8');
}

const registerUser = (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  let users = getUsers();
  if (userAlreadyExist(users, email)) {
    return res.status(409).json({ message: 'El usuario ya está registrado.' });
  }
  
  const newUser = { email, firstName, lastName, password };
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: 'Usuario registrado con éxito.', user: newUser });
};

function getUsers() {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(usersData);
  } catch (error) {
    return [];
  }
}

function userAlreadyExist(users, email) {
  return users.some(user => user.email === email);
}

module.exports = {
  registerUser,
};