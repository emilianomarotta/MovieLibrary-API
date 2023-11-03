const jwt = require('jsonwebtoken');
const secretKey = 'mySecretKey';
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;