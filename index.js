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
app.get('/mantenimiento', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'stop.html'));
});

app.get('/registro2', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'regis.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'registro.html'));
});

app.get('/control2', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'control2.html'));
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

// APIS REGISTRO

app.post('/api/productos', (req, res) => {
    const { categoria, nombre_producto, cantidad } = req.body;
    const consulta = 'INSERT INTO productos (categoria, nombre_producto, cantidad) VALUES (?, ?, ?)';

    db.query(consulta, [categoria, nombre_producto, cantidad], (err, resultado) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.status(201).json({ id: resultado.insertId, categoria, nombre_producto, cantidad });
    });
});

app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const consulta = 'DELETE FROM productos WHERE id = ?';

    db.query(consulta, [id], (err, resultado) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado' });
    });
});

app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { categoria, nombre_producto, cantidad } = req.body;
    const consulta = 'UPDATE productos SET categoria = ?, nombre_producto = ?, cantidad = ? WHERE id = ?';

    db.query(consulta, [categoria, nombre_producto, cantidad, id], (err, resultado) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ id, categoria, nombre_producto, cantidad });
    });
});

app.get('/api/productos', (req, res) => {
    const consulta = 'SELECT * FROM productos';

    db.query(consulta, (err, resultados) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.status(200).json(resultados);
    });
});

// Iniciar el servidor
const PUERTO = process.env.PORT || 3000; // Usa el puerto proporcionado por Heroku o 3000 por defecto
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});