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

app.get('/pedidos2', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'pedCD.html'));
});

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

app.get('/historial', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'historial.html'));
});

app.get('/pedidos', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'pedidos.html'));
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

// Ruta para obtener la bitácora de productos
app.get('/api/bitacora', (req, res) => {
    const query = 'SELECT * FROM bitacora_productos ORDER BY fecha DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la bitácora:', err);
            return res.status(500).json({ error: 'Error al obtener la bitácora' });
        }
        res.status(200).json(results);
    });
});

// API PEDIDOS

// Crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
    const { producto_id, nombre_producto, cantidad } = req.body;
    const query = 'INSERT INTO pedidos (producto_id, nombre_producto, cantidad) VALUES (?, ?, ?)';

    db.query(query, [producto_id, nombre_producto, cantidad], (err, result) => {
        if (err) {
            console.error('Error al agregar pedido:', err);
            return res.status(500).json({ error: 'Error al agregar pedido' });
        }
        res.status(201).json({ id: result.insertId, producto_id, nombre_producto, cantidad });
    });
});

// Obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
    const query = 'SELECT * FROM pedidos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener pedidos:', err);
            return res.status(500).json({ error: 'Error al obtener pedidos' });
        }
        res.status(200).json(results);
    });
});

// Obtener un pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pedidos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el pedido:', err);
            return res.status(500).json({ error: 'Error al obtener el pedido' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Actualizar un pedido por ID
app.put('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { producto_id, nombre_producto, cantidad } = req.body;
    const query = 'UPDATE pedidos SET producto_id = ?, nombre_producto = ?, cantidad = ? WHERE id = ?';

    db.query(query, [producto_id, nombre_producto, cantidad, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ id, producto_id, nombre_producto, cantidad });
    });
});

// Eliminar un pedido por ID
app.delete('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pedidos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el pedido:', err);
            return res.status(500).json({ error: 'Error al eliminar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido eliminado' });
    });
});

// API para denegar un pedido
app.put('/api/pedidos/:id/denegar', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';

    db.query(query, ['Denegado', id], (err, result) => {
        if (err) {
            console.error('Error al denegar el pedido:', err);
            return res.status(500).json({ error: 'Error al denegar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido denegado correctamente' });
    });
});

// API para confirmar un pedido
app.put('/api/pedidos/:id/confirmar', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';

    db.query(query, ['Confirmado', id], (err, result) => {
        if (err) {
            console.error('Error al confirmar el pedido:', err);
            return res.status(500).json({ error: 'Error al confirmar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido confirmado correctamente' });
    });
});

// API para obtener el historial de pedidos
app.get('/api/historial_pedidos', (req, res) => {
    const query = 'SELECT * FROM historial_pedidos ORDER BY fecha DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener el historial de pedidos:', err);
            return res.status(500).json({ error: 'Error al obtener el historial de pedidos' });
        }
        res.status(200).json(results);
    });
});

// Ruta para revertir una acción de la bitácora
app.post('/api/revertir/:id', (req, res) => {
    const { id } = req.params;

    // Obtener la acción de la bitácora por su ID
    const query = 'SELECT * FROM bitacora_productos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener la bitácora:', err);
            return res.status(500).json({ error: 'Error al obtener la bitácora' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Registro de bitácora no encontrado' });
        }

        const accion = results[0];
        
        // Determinar qué tipo de acción fue y revertirla
        if (accion.accion === 'INSERT') {
            // Si fue una inserción, se elimina el producto
            const deleteQuery = 'DELETE FROM productos WHERE id = ?';
            db.query(deleteQuery, [accion.producto_id], (err, result) => {
                if (err) {
                    console.error('Error al eliminar producto:', err);
                    return res.status(500).json({ error: 'Error al revertir la adición del producto' });
                }
                res.status(200).json({ message: 'Producto eliminado correctamente' });
            });
        } else if (accion.accion === 'DELETE') {
            // Si fue una eliminación, se vuelve a agregar el producto
            const insertQuery = 'INSERT INTO productos (id, categoria, nombre_producto, cantidad) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [accion.producto_id, accion.categoria, accion.nombre_producto, accion.cantidad], (err, result) => {
                if (err) {
                    console.error('Error al agregar producto:', err);
                    return res.status(500).json({ error: 'Error al revertir la eliminación del producto' });
                }
                res.status(200).json({ message: 'Producto restaurado correctamente' });
            });
        } else if (accion.accion === 'UPDATE') {
            // Si fue una actualización, revertir al estado anterior
            const updateQuery = 'UPDATE productos SET categoria = ?, nombre_producto = ?, cantidad = ? WHERE id = ?';
            db.query(updateQuery, [accion.categoria, accion.nombre_producto, accion.cantidad, accion.producto_id], (err, result) => {
                if (err) {
                    console.error('Error al actualizar producto:', err);
                    return res.status(500).json({ error: 'Error al revertir la actualización del producto' });
                }
                res.status(200).json({ message: 'Producto revertido a estado anterior correctamente' });
            });
        }
    });
});




// Iniciar el servidor
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Heroku o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
