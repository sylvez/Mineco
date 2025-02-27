const express = require('express');
const mysql = require('mysql2');
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
    port: 3306
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

// Productos
app.post('/api/productos', (req, res) => {
    const { categoria, nombre_producto, cantidad, almacen_id } = req.body;
    const query = 'INSERT INTO productos (categoria, nombre_producto, cantidad, almacen_id) VALUES (?, ?, ?, ?)';

    db.query(query, [categoria, nombre_producto, cantidad, almacen_id], (err, result) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.status(201).json({ id: result.insertId, categoria, nombre_producto, cantidad, almacen_id });
    });
});

app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Intentando eliminar producto con id: ${id}`);
    const query = 'DELETE FROM productos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error al eliminar producto', details: err.message });
        }
        if (result.affectedRows === 0) {
            console.log(`Producto con id ${id} no encontrado`);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        console.log(`Producto con id ${id} eliminado exitosamente`);
        res.status(200).json({ message: 'Producto eliminado' });
    });
});

app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { categoria, nombre_producto, cantidad, almacen_id } = req.body;
    const query = 'UPDATE productos SET categoria = ?, nombre_producto = ?, cantidad = ?, almacen_id = ? WHERE id = ?';

    db.query(query, [categoria, nombre_producto, cantidad, almacen_id, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ id, categoria, nombre_producto, cantidad, almacen_id });
    });
});

app.get('/api/productos', (req, res) => {
    const query = 'SELECT p.*, a.almacen FROM productos p LEFT JOIN almacen a ON p.almacen_id = a.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.status(200).json(results);
    });
});

// Almacenes
app.post('/api/almacenes', (req, res) => {
    const { almacen } = req.body;
    const query = 'INSERT INTO almacen (almacen) VALUES (?)';

    db.query(query, [almacen], (err, result) => {
        if (err) {
            console.error('Error al agregar almacén:', err);
            return res.status(500).json({ error: 'Error al agregar almacén' });
        }
        res.status(201).json({ id: result.insertId, almacen });
    });
});

app.get('/api/almacenes', (req, res) => {
    const query = 'SELECT * FROM almacen';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener almacenes:', err);
            return res.status(500).json({ error: 'Error al obtener almacenes' });
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
    const { producto_id, nombre, nombre_producto, cantidad } = req.body;
    const query = 'INSERT INTO nuevos_pedidos (producto_id, nombre, nombre_producto, cantidad) VALUES (?, ?, ?, ?)';

    db.query(query, [producto_id, nombre, nombre_producto, cantidad], (err, result) => {
        if (err) {
            console.error('Error al agregar pedido:', err);
            return res.status(500).json({ error: 'Error al agregar pedido' });
        }
        res.status(201).json({ id: result.insertId, producto_id, nombre, nombre_producto, cantidad, estado: 'Pendiente' });
    });
});

// Obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
    const query = 'SELECT * FROM nuevos_pedidos';

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
    const query = 'SELECT * FROM nuevos_pedidos WHERE id = ?';

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
    const { producto_id, nombre, nombre_producto, cantidad, estado } = req.body;
    const query = 'UPDATE nuevos_pedidos SET producto_id = ?, nombre = ?, nombre_producto = ?, cantidad = ?, estado = ? WHERE id = ?';

    db.query(query, [producto_id, nombre, nombre_producto, cantidad, estado, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ id, producto_id, nombre, nombre_producto, cantidad, estado });
    });
});

// Eliminar un pedido por ID (usado tanto para denegar como para confirmar)
app.delete('/api/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM nuevos_pedidos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el pedido:', err);
            return res.status(500).json({ error: 'Error al eliminar el pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido eliminado correctamente' });
    });
});

// API para obtener pedidos por estado
app.get('/api/pedidos/estado/:estado', (req, res) => {
    const { estado } = req.params;
    const validEstados = ['Pendiente', 'Confirmado', 'Denegado'];
    
    if (!validEstados.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }

    const query = 'SELECT * FROM nuevos_pedidos WHERE estado = ?';
    
    db.query(query, [estado], (err, results) => {
        if (err) {
            console.error('Error al obtener los pedidos:', err);
            return res.status(500).json({ error: 'Error al obtener los pedidos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos con el estado especificado' });
        }

        res.status(200).json(results);
    });
});

// API para obtener la bitácora de pedidos
app.get('/api/bitacora_pedidos', (req, res) => {
    const query = 'SELECT * FROM bitacora_pedidos ORDER BY fecha_cambio DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la bitácora de pedidos:', err);
            return res.status(500).json({ error: 'Error al obtener la bitácora de pedidos' });
        }
        res.status(200).json(results);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});