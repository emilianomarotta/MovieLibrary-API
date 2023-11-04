const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.txt');
const invalidTokensFilePath = path.join(__dirname, '../data/invalidTokens.txt');
if (!fs.existsSync(invalidTokensFilePath)) {
    fs.writeFileSync(invalidTokensFilePath, '[]', 'utf-8');
}
const secretKey = 'mySecretKey';

const authenticateUser = (req, res) => {
    const { email, password } = req.body;
    let users = [];
    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        if (fileContent) {
            users = JSON.parse(fileContent);
        }
        const user = getUser(users, email);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }
        if (!checkPassword(password, user.password)) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }
        const token = generateToken(user);
        res.json({ message: 'Autenticación exitosa.', token });
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

const logout = (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No se recibió token para invalidar.' });
    }

    const invalidTokens = getInvalidTokens();

    if (invalidTokens.includes(token)) {
        return res.status(401).json({ message: 'Token ya se encuentra en la lista de tokens inválidos.' });
    }
    invalidTokens.push(token);
    saveInvalidTokens(invalidTokens);

    res.status(200).json({ message: 'Token invalidado con éxito.' });
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

function getInvalidTokens() {
    const fileContent = fs.readFileSync(invalidTokensFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

function saveInvalidTokens(tokens) {
    fs.writeFileSync(invalidTokensFilePath, JSON.stringify(tokens, null, 2), 'utf-8');
}

module.exports = {
    authenticateUser,
    logout,
};
