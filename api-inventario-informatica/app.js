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

app.use("/api/usuario", usuarioRoutes);
const inventarioRoutes = require('./routes/inventarioRoutes');
app.use('/api/inventario', inventarioRoutes);
const seccionRoutes = require('./routes/seccionRoutes');
app.use('/api/seccion', seccionRoutes);
const sedeRoutes = require('./routes/sedeRoutes');
app.use('/api/sede', sedeRoutes);
const tipoEquipoRoutes = require('./routes/tipoEquipoRoutes');
app.use('/api/tipo-equipo', tipoEquipoRoutes);
const marcaRoutes = require('./routes/marcaRoutes');
app.use('/api/marca', marcaRoutes);
const ubicacionRoutes = require('./routes/ubicacionRoutes');
app.use('/api/ubicacion', ubicacionRoutes);
const ramRoutes = require('./routes/ramRoutes');
app.use('/api/ram', ramRoutes);
const almacenamientoRoutes = require('./routes/almacenamientoRoutes');
app.use('/api/almacenamiento', almacenamientoRoutes);
const soRoutes = require('./routes/soRoutes');
app.use('/api/so', soRoutes);
const officeRoutes = require('./routes/officeRoutes');
app.use('/api/office', officeRoutes);



const IP = '0.0.0.0';
const PORT = process.env.PORT || 9001;

sequelizeInstance.sync().then(() => {
  app.listen(PORT, IP, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
  });
});

