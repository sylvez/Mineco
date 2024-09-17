let inventoryData = [];
let filteredData = [];
let currentAction = '';
let currentEditIndex = -1;

function showLoadingIndicator() {
    let loadingIndicator = document.getElementById('loadingIndicator');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loadingIndicator';
        loadingIndicator.textContent = 'Cargando...';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.background = 'rgba(0,0,0,0.7)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.zIndex = '1000';
        document.body.appendChild(loadingIndicator);
    }
    loadingIndicator.style.display = 'block';
}

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function loadInventoryDataWithRetry(retries = 3) {
    showLoadingIndicator();
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Para depuración
            inventoryData = data;
            filteredData = inventoryData;
            renderTable();
            console.log('Datos renderizados:', filteredData); // Para depuración
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            if (retries > 0) {
                console.log(`Reintentando cargar datos. Intentos restantes: ${retries - 1}`);
                setTimeout(() => loadInventoryDataWithRetry(retries - 1), 2000);
            } else {
                console.error('No se pudieron cargar los datos después de varios intentos');
                alert('No se pudieron cargar los productos. Por favor, recargue la página.');
            }
        })
        .finally(() => {
            hideLoadingIndicator();
        });
}

function renderTable() {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    filteredData.forEach((item, index) => {
        const status = getStatus(item.cantidad);
        const row = `
            <tr>
                <td>${new Date().toLocaleDateString()}</td>
                <td>${item.id}</td>
                <td>${item.nombre_producto}</td>
                <td>${item.categoria}</td>
                <td>Almacenes Maybe</td>
                <td>${item.cantidad}</td>
                <td class="${status.class}">${status.icon}</td>
                <td>1</td>
                <td>${getDescription(item.nombre_producto)}</td>
                <td>Angel de Almacenamiento</td>
                <td>Indefinido</td>
                <td>
                    <button class="action-btn edit-btn" data-index="${index}">✏️</button>
                    <button class="action-btn delete-btn" data-index="${index}">🗑️</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            showPasswordModal('edit', e.target.dataset.index);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            showPasswordModal('delete', e.target.dataset.index);
        });
    });
}

function getStatus(cantidad) {
    if (cantidad === 0) {
        return { class: 'status-red', icon: '↓' };
    } else if (cantidad < 10) {
        return { class: 'status-yellow', icon: '→' };
    } else {
        return { class: 'status-green', icon: '↑' };
    }
}

function getDescription(producto) {
    return `Descripción breve de ${producto}`;
}

function filterByCategory(category) {
    console.log('Filtrando por categoría:', category); // Para depuración
    filteredData = inventoryData.filter(item => item.categoria === category);
    console.log('Datos filtrados:', filteredData); // Para depuración
    renderTable();
}

function filterBySearch(searchTerm) {
    filteredData = inventoryData.filter(item =>
        item.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderTable();
}

function validateProductData(product) {
    if (!product.nombre_producto || product.nombre_producto.trim() === '') {
        throw new Error('El nombre del producto no puede estar vacío');
    }
    if (!product.categoria || product.categoria.trim() === '') {
        throw new Error('Debe seleccionar una categoría');
    }
    if (isNaN(product.cantidad) || product.cantidad < 0) {
        throw new Error('La cantidad debe ser un número no negativo');
    }
    return true;
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    filterBySearch(e.target.value);
});

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        console.log('Categoría seleccionada:', category); // Para depuración
        filterByCategory(category);
    });
});

// ... (el resto del código permanece igual)

document.addEventListener('DOMContentLoaded', () => {
    loadInventoryDataWithRetry();
});