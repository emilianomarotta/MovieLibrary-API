const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const invalidTokensFilePath = path.join(__dirname, '../data/invalidTokens.txt');

const secretKey = 'mySecretKey';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
  }

  const invalidTokens = getInvalidTokens();
  if (invalidTokens.includes(token)) {
    return res.status(401).json({ message: 'Token ya no es válido.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ message: 'Token inválido.' });
  }
};

function getInvalidTokens() {
  const fileContent = fs.readFileSync(invalidTokensFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

module.exports = authMiddleware;