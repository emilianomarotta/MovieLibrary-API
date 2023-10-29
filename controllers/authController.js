const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.txt');
const secretKey = 'mySecretKey';

const authenticateUser = (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    const user = getUser(users, email);
    if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado.' });
    }
    if (!checkPassword(password, user.password)) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
    const token = generateToken(user);
    res.json({ message: 'Autenticación exitosa.', token });
};

function getUser(users, email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function checkPassword(password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
}

function generateToken(user) {
    return jwt.sign({ userId: user.email }, secretKey, { expiresIn: '1h' });
}

module.exports = {
    authenticateUser,
};
