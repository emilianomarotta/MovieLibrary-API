const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.txt');

const registerUser = (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  const newUser = { email, firstName, lastName, password };
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'Usuario registrado con éxito.', user: newUser });
};

module.exports = {
  registerUser,
};