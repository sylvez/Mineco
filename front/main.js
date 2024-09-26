let inventoryData = [];
let filteredData = [];
let currentAction = '';
let currentEditIndex = -1;
let warehouseData = [];
let { jsPDF } = window.jspdf;
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
            console.log('Datos recibidos:', data);
            inventoryData = data;
            filteredData = inventoryData;
            renderTable();
            console.log('Datos renderizados:', filteredData);
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
function loadWarehouseData() {
    fetch('/api/almacenes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            warehouseData = data;
            populateWarehouseDropdowns();
        })
        .catch(error => {
            console.error('Error al cargar los almacenes:', error);
        });
}
function populateWarehouseDropdowns() {
    const newProductWarehouse = document.getElementById('newProductWarehouse');
    const editProductWarehouse = document.getElementById('editProductWarehouse');
    newProductWarehouse.innerHTML = '';
    editProductWarehouse.innerHTML = '';
    warehouseData.forEach(warehouse => {
        newProductWarehouse.innerHTML += `<option value="${warehouse.id}">${warehouse.almacen}</option>`;
        editProductWarehouse.innerHTML += `<option value="${warehouse.id}">${warehouse.almacen}</option>`;
    });
}
function renderTable() {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    filteredData.forEach((item, index) => {
        const status = getStatus(item.cantidad);
        const warehouse = warehouseData.find(w => w.id === item.almacen_id) || { almacen: 'Desconocido' };
        const row = `
            <tr>
                <td>${new Date().toLocaleDateString()}</td>
                <td>${item.id}</td>
                <td>${item.nombre_producto}</td>
                <td>${item.categoria}</td>
                <td>${warehouse.almacen}</td>
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
    addEventListenersToButtons();
}
function addEventListenersToButtons() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = e.target.dataset.index;
            console.log('Edit button clicked for index:', index);
            showPasswordModal('edit', index);
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
    console.log('Filtrando por categoría:', category);
    filteredData = inventoryData.filter(item => {
        const itemCategory = item.categoria.trim().toUpperCase();
        const selectedCategory = category.trim().toUpperCase();
        console.log(`Comparando: "${itemCategory}" con "${selectedCategory}"`);
        return itemCategory === selectedCategory;
    });
    console.log('Datos filtrados:', filteredData);
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
    if (!product.almacen_id || product.almacen_id === '') {
        throw new Error('Debe seleccionar un almacén válido');
    }
    return true;
}
function showPasswordModal(action, index = -1) {
    currentAction = action;
    currentEditIndex = index;
    const passwordModal = document.getElementById('passwordModal');
    passwordModal.style.display = 'block';
    document.getElementById('passwordInput').value = '';
    console.log('Password modal opened for action:', action);
}
function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('editForm').style.display = 'none';
    console.log('All modals closed');
}
function checkPassword() {
    console.log('Checking password for action:', currentAction);
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput.value === '0000') {
        closeModal();
        if (currentAction === 'add') {
            showAddForm();
        } else if (currentAction === 'edit') {
            console.log('Password correct, showing edit form');
            showEditForm(currentEditIndex);
        } else if (currentAction === 'delete') {
            deleteProduct(currentEditIndex);
        }
    } else {
        alert('Contraseña incorrecta');
    }
}
function showAddForm() {
    const addForm = document.getElementById('addForm');
    addForm.style.display = 'block';
    console.log('Add form opened');
}
function showEditForm(index) {
    const editForm = document.getElementById('editForm');
    const item = filteredData[index];
    document.getElementById('editProductName').value = item.nombre_producto;
    document.getElementById('editProductCategory').value = item.categoria;
    document.getElementById('editProductUnits').value = item.cantidad;
    document.getElementById('editProductWarehouse').value = item.almacen_id.toString();
    editForm.style.display = 'block';
    console.log('Edit form opened for item:', item);
}

function deleteProduct(index) {
    const productId = filteredData[index].id;
    showLoadingIndicator();
    fetch(`/api/productos/${productId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            loadInventoryDataWithRetry();
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
            alert('No se pudo eliminar el producto. Por favor, intente de nuevo.');
        })
        .finally(() => {
            hideLoadingIndicator();
        });
}

function saveNewProduct(e) {
    e.preventDefault();
    const newProduct = {
        nombre_producto: document.getElementById('newProductName').value,
        categoria: document.getElementById('newProductCategory').value,
        cantidad: parseInt(document.getElementById('newProductUnits').value),
        almacen_id: document.getElementById('newProductWarehouse').value
    };
    
    try {
        validateProductData(newProduct);
    } catch (error) {
        alert(error.message);
        return;
    }

    showLoadingIndicator();
    fetch('/api/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        loadInventoryDataWithRetry();
        closeModal();
    })
    .catch(error => {
        console.error('Error al agregar el producto:', error);
        alert('No se pudo agregar el producto. Por favor, intente de nuevo.');
    })
    .finally(() => {
        hideLoadingIndicator();
    });
}

function saveEditProduct(e) {
    e.preventDefault();
    console.log('Save edit button clicked');
    const editedProduct = {
        nombre_producto: document.getElementById('editProductName').value,
        categoria: document.getElementById('editProductCategory').value,
        cantidad: parseInt(document.getElementById('editProductUnits').value),
        almacen_id: document.getElementById('editProductWarehouse').value
    };

    console.log('Edited product:', editedProduct);

    try {
        validateProductData(editedProduct);
    } catch (error) {
        alert(error.message);
        return;
    }

    const productId = filteredData[currentEditIndex].id;
    showLoadingIndicator();
    fetch(`/api/productos/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct)
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        loadInventoryDataWithRetry();
        closeModal();
    })
    .catch(error => {
        console.error('Error al editar el producto:', error);
        alert('No se pudo editar el producto. Por favor, intente de nuevo.');
    })
    .finally(() => {
        hideLoadingIndicator();
    });
}


function populateCategoryDropdowns() {
    const categories = [
        "PAPELERIA",
        "ALIMENTOS",
        "COMUNICACION Y VIDEO",
        "ENCER DE OFICINA",
        "ENCER DE LIMPIEZA",
        "MATERIALES ELECTRONICOS",
        "MATERIALES DE LIMPIEZA",
        "UTILES DE OFICINA",
        "OTROS"
    ];
    const newProductCategory = document.getElementById('newProductCategory');
    const editProductCategory = document.getElementById('editProductCategory');
    categories.forEach(category => {
        newProductCategory.innerHTML += `<option value="${category}">${category}</option>`;
        editProductCategory.innerHTML += `<option value="${category}">${category}</option>`;
    });
}
function generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Inventario de Productos por Categoría', 14, 20);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const groupedProducts = inventoryData.reduce((acc, product) => {
        if (!acc[product.categoria]) {
            acc[product.categoria] = [];
        }
        acc[product.categoria].push(product);
        return acc;
    }, {});
    let yOffset = 30;
    Object.keys(groupedProducts).sort().forEach(category => {
        if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
        }
        doc.setFont(undefined, 'bold');
        doc.text(category, 14, yOffset);
        yOffset += 10;
        const sortedProducts = groupedProducts[category].sort((a, b) => 
            a.nombre_producto.localeCompare(b.nombre_producto)
        );
        const tableData = sortedProducts.map(product => [
            product.nombre_producto,
            product.cantidad.toString()
        ]);
        doc.autoTable({
            startY: yOffset,
            head: [['Producto', 'Cantidad']],
            body: tableData,
            margin: { left: 14 },
            tableWidth: 180
        });

        yOffset = doc.lastAutoTable.finalY + 15;
    });
    doc.save('inventario_por_categoria.pdf');
}
function addNewWarehouse() {
    const 
ouseName = prompt("Ingrese el nombre del nuevo almacén:");
    if (warehouseName) {
        fetch('/api/almacenes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ almacen: warehouseName })
        })
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            loadWarehouseData();
            alert('Nuevo almacén agregado con éxito');
        })
        .catch(error => {
            console.error('Error al agregar el almacén:', error);
            alert('No se pudo agregar el almacén. Por favor, intente de nuevo.');
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadInventoryDataWithRetry();
    loadWarehouseData();
    populateCategoryDropdowns();
    document.getElementById('addButton').addEventListener('click', () => showPasswordModal('add'));
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    document.getElementById('submitPassword').addEventListener('click', checkPassword);
    document.getElementById('saveNewProduct').addEventListener('click', saveNewProduct);
    document.getElementById('saveEditProduct').addEventListener('click', saveEditProduct)
    document.getElementById('generatePdfButton').addEventListener('click', generatePDF);
    document.getElementById('addWarehouseButton').addEventListener('click', addNewWarehouse);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterBySearch(e.target.value);
    });
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            console.log('Categoría seleccionada:', category);
            filterByCategory(category);
        });
    });
    console.log('All event listeners set up');
});

