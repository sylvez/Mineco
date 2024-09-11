const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'front')));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: '45.186.107.64', 
    user: 'root',
    password: '',
    database: 'hotel'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para servir el HTML

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

// Rutas CRUD
app.post('/habitaciones', (req, res) => {
    const { numero_habitacion, precio_por_hora, accesorios, descripcion } = req.body;
    const query = 'INSERT INTO hsbitaciones (numero_habitacion, precio_por_hora, accesorios, descripcion) VALUES (?, ?, ?, ?)';
    db.query(query, [numero_habitacion, precio_por_hora, accesorios, descripcion], (err, result) => {
        if (err) {
            console.error('Error insertando en la base de datos:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(201).send('Habitación creada con éxito');
        }
    });
});

app.get('/api/habitaciones', (req, res) => {
    const query = 'SELECT * FROM hsbitaciones';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error leyendo de la base de datos:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(200).json(results);
        }
    });
});

app.put('/habitaciones/:id', (req, res) => {
    const { id } = req.params;
    const { numero_habitacion, precio_por_hora, accesorios, descripcion } = req.body;
    const query = 'UPDATE hsbitaciones SET numero_habitacion = ?, precio_por_hora = ?, accesorios = ?, descripcion = ? WHERE ID = ?';
    db.query(query, [numero_habitacion, precio_por_hora, accesorios, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error actualizando en la base de datos:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(200).send('Habitación actualizada con éxito');
        }
    });
});

app.delete('/habitaciones/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM hsbitaciones WHERE ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error eliminando de la base de datos:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(200).send('Habitación eliminada con éxito');
        }
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

