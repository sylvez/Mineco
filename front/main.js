let inventoryData = [];
let filteredData = [];
let currentAction = '';
let currentEditIndex = -1;

function showLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
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
            inventoryData = data;
            filteredData = inventoryData;
            renderTable();
            updateCategoryButtons();
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

function updateCategoryButtons() {
    const categories = [...new Set(inventoryData.map(item => item.categoria))];
    const categoryButtonsContainer = document.getElementById('categoryButtons');
    categoryButtonsContainer.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.dataset.category = category;
        button.addEventListener('click', (e) => filterByCategory(category));
        categoryButtonsContainer.appendChild(button);
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
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    filteredData = inventoryData.filter(item => item.categoria === category);
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
        throw new Error('La categoría no puede estar vacía');
    }
    if (isNaN(product.cantidad) || product.cantidad < 0) {
        throw new Error('La cantidad debe ser un número no negativo');
    }
    return true;
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    filterBySearch(e.target.value);
});

const passwordModal = document.getElementById('passwordModal');
const addButton = document.getElementById('addButton');
const closeButtons = document.querySelectorAll('.close');
const submitPasswordButton = document.getElementById('submitPassword');
const passwordInput = document.getElementById('passwordInput');
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');

addButton.addEventListener('click', () => showPasswordModal('add'));
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});
submitPasswordButton.addEventListener('click', checkPassword);

function showPasswordModal(action, index = -1) {
    currentAction = action;
    currentEditIndex = index;
    passwordModal.style.display = 'block';
    passwordInput.value = '';
}

function closeModal() {
    passwordModal.style.display = 'none';
    addForm.style.display = 'none';
    editForm.style.display = 'none';
}

function checkPassword() {
    if (passwordInput.value === '0000') {
        closeModal();
        if (currentAction === 'add') {
            showAddForm();
        } else if (currentAction === 'edit') {
            showEditForm(currentEditIndex);
        } else if (currentAction === 'delete') {
            deleteProduct(currentEditIndex);
        }
    } else {
        alert('Contraseña incorrecta');
    }
}

function showAddForm() {
    addForm.style.display = 'block';
    const categorySelect = document.getElementById('newProductCategory');
    const categories = [...new Set(inventoryData.map(item => item.categoria))];
    categorySelect.innerHTML = categories.map(category => 
        `<option value="${category}">${category}</option>`
    ).join('');
}

function showEditForm(index) {
    const item = filteredData[index];
    document.getElementById('editProductName').value = item.nombre_producto;
    document.getElementById('editProductCategory').value = item.categoria;
    document.getElementById('editProductUnits').value = item.cantidad;
    editForm.style.display = 'block';

    const categorySelect = document.getElementById('editProductCategory');
    const categories = [...new Set(inventoryData.map(item => item.categoria))];
    categorySelect.innerHTML = categories.map(category => 
        `<option value="${category}" ${item.categoria === category ? 'selected' : ''}>${category}</option>`
    ).join('');
}

function deleteProduct(index) {
    const productId = filteredData[index].id;
    showLoadingIndicator();
    fetch(`/api/productos/${productId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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

document.getElementById('newProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
        nombre_producto: document.getElementById('newProductName').value,
        categoria: document.getElementById('newProductCategory').value,
        cantidad: parseInt(document.getElementById('newProductUnits').value)
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
});

document.getElementById('editProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editedProduct = {
        nombre_producto: document.getElementById('editProductName').value,
        categoria: document.getElementById('editProductCategory').value,
        cantidad: parseInt(document.getElementById('editProductUnits').value)
    };

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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
});

document.addEventListener('DOMContentLoaded', () => {
    loadInventoryDataWithRetry();
});