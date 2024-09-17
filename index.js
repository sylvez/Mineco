const express = require('express');
const mysql = require('mysql2');  // Cambié a mysql2 para mejor compatibilidad
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "front"
app.use(express.static(path.join(__dirname, 'front')));

// Conexión a la base de datos JawsDB MySQL
const db = mysql.createConnection({
    host: 'w1h4cr5sb73o944p.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'du5pwoiajvdsl7zx',
    password: 'p0zutpb7umrxfais',
    database: 'txc02wsymohsmhxu',
    port: 3306 // Puerto predeterminado de MySQL
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos JawsDB MySQL');
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
    const query = 'INSERT INTO productos (categoria, nombre_producto, cantidad) VALUES (?, ?, ?)';

    db.query(query, [categoria, nombre_producto, cantidad], (err, result) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.status(201).json({ id: result.insertId, categoria, nombre_producto, cantidad });
    });
});

app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    });
});

app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { categoria, nombre_producto, cantidad } = req.body;
    const query = 'UPDATE productos SET categoria = ?, nombre_producto = ?, cantidad = ? WHERE id = ?';

    db.query(query, [categoria, nombre_producto, cantidad, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ id, categoria, nombre_producto, cantidad });
    });
});

app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.status(200).json(results);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Heroku o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
