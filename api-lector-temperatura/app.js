const express = require("express");
const bodyParser = require("body-parser");
const sequelizeInstance = require("./db/SequelizeConfig");
const app = express();

// Configuración de CORS más completa
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // Orígenes de la nueva aplicación Frontend (4000)
      "http://192.168.10.52:3000", // Frontend en la nueva IP
      "http://localhost:3000", // Frontend en localhost

      // Puerto de la API para pruebas locales (9001)
      "http://192.168.10.52:8001", // API en la nueva IP
      "http://localhost:3001", // API en localhost

      // Orígenes de producción o externos
      "http://190.151.63.107"
    ];

    // Permitir requests sin origin (como Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Aplicar CORS antes de cualquier otro middleware
app.use(cors(corsOptions));

// Manejar preflight requests para todas las rutas
app.options('*', cors(corsOptions));

// Body parser configuration
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Resto de tu configuración...
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Demasiadas solicitudes desde esta IP',
  headers: true,
});

app.use(limiter);

// Resto de tus rutas...
// Resto de tus rutas...
const usuarioRoutes = require('./routes/usuarioRoutes');
const incubadoraRoutes = require('./routes/incubadoraRoutes');


app.use("/api/usuario", usuarioRoutes);
app.use('/api/incubadora', incubadoraRoutes);


const IP = process.env.HOST_IP || '192.168.10.52';
const PORT = process.env.PORT || 9001;

sequelizeInstance.sync().then(() => {
  app.listen(PORT, IP, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
  });
});

