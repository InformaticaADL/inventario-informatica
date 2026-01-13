// middlewares/loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next(); // Llama a la siguiente función middleware en la pila
};

module.exports = loggerMiddleware;
