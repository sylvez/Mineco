let inventoryData = [];
let filteredData = [];
let currentAction = '';
let currentEditIndex = -1;

function loadInventoryData() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            inventoryData = data;
            filteredData = inventoryData;
            renderTable();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
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

document.getElementById('searchInput').addEventListener('input', (e) => {
    filterBySearch(e.target.value);
});

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        filterByCategory(e.target.dataset.category);
    });
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
}

function showEditForm(index) {
    const item = filteredData[index];
    document.getElementById('editProductName').value = item.nombre_producto;
    document.getElementById('editProductCategory').value = item.categoria;
    document.getElementById('editProductUnits').value = item.cantidad;
    editForm.style.display = 'block';
}

function deleteProduct(index) {
    const productId = filteredData[index].id;
    fetch(`/api/productos/${productId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            loadInventoryData(); // Recargar los datos después de eliminar
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
}

document.getElementById('saveNewProduct').addEventListener('click', () => {
    const newProduct = {
        nombre_producto: document.getElementById('newProductName').value,
        categoria: document.getElementById('newProductCategory').value,
        cantidad: parseInt(document.getElementById('newProductUnits').value)
    };
    fetch('/api/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(data => {
        loadInventoryData(); // Recargar los datos después de agregar
        closeModal();
    })
    .catch(error => console.error('Error al agregar el producto:', error));
});

document.getElementById('saveEditProduct').addEventListener('click', () => {
    const editedProduct = {
        nombre_producto: document.getElementById('editProductName').value,
        categoria: document.getElementById('editProductCategory').value,
        cantidad: parseInt(document.getElementById('editProductUnits').value)
    };
    const productId = filteredData[currentEditIndex].id;
    fetch(`/api/productos/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct)
    })
    .then(response => response.json())
    .then(data => {
        loadInventoryData(); // Recargar los datos después de editar
        closeModal();
    })
    .catch(error => console.error('Error al editar el producto:', error));
});

loadInventoryData();