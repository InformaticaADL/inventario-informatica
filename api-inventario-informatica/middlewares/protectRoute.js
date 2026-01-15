const jwt = require('jsonwebtoken');
require('dotenv').config();

const protectRoute = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).send('Es necesario un token de acceso.');
    }
  
    const token = authHeader.split(' ')[1];
    
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      next();
    } catch (error) {
      console.log('Error de token');
      res.status(400).send('Token inválido.');
    }
  };
  
  module.exports = protectRoute;
