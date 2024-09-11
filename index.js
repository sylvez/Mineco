const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "front"
app.use(express.static(path.join(__dirname, 'front')));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'motel',
    port: 3306 // Puerto predeterminado de MySQL
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Rutas para servir el HTML
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'control.html'));
});

app.get('/especificaciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'temas.html'));
});

app.get('/categorias', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'Categorias.html'));
});

app.get('/graficas', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'graficas.html'));
});

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'productos.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Heroku o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
