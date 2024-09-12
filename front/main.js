let inventoryData = [];
        let filteredData = [];
        let currentAction = '';
        let currentEditIndex = -1;

        function loadInventoryData() {
            const storedData = localStorage.getItem('inventoryData');
            if (storedData) {
                inventoryData = JSON.parse(storedData);
            } else {
                inventoryData = [
                    // PAPELERÍA
{ categoria: "PAPELERÍA", producto: "Bloc de (70) hojas con líneas color amarillo", unidad: 51 },
{ categoria: "PAPELERÍA", producto: "Cuaderno espiral universitario; 100 hojas con líneas", unidad: 17 },
{ categoria: "PAPELERÍA", producto: "Papel bond t/carta para fotocopiadora (resmas)", unidad: 175 },
{ categoria: "PAPELERÍA", producto: "Papel bond t/oficio para fotocopiadora (resmas)", unidad: 55 },
{ categoria: "PAPELERÍA", producto: "Papel membretado t/carta (con sello (Dorado) de agua del Ministerio de Economía)", unidad: 0 },
{ categoria: "PAPELERÍA", producto: "Papel membretado t/oficio (con sello de agua del Ministerio de Economía)", unidad: 0 },
{ categoria: "PAPELERÍA", producto: "Papel carbón Mediano color negro tamaño carta (Kores)", unidad: 580 },
{ categoria: "PAPELERÍA", producto: "Papel fotográfico t/carta (Kodak Photo Papers)", unidad: 3 },
{ categoria: "PAPELERÍA", producto: "Papel periódico para rota folio block de 25 hojas (unidades)", unidad: 18 },
{ categoria: "PAPELERÍA", producto: "Pasta plástico para encuadernar, tamaño carta, varios colores", unidad: 279 },
{ categoria: "PAPELERÍA", producto: "Protectores de hojas tamaño carta", unidad: 1103 },
{ categoria: "PAPELERÍA", producto: "Protectores de hojas tamaño oficio", unidad: 1025 },
{ categoria: "PAPELERÍA", producto: "Sobres Manila Carta", unidad: 530 },
{ categoria: "PAPELERÍA", producto: "Sobres Manila extra oficio", unidad: 556 },
{ categoria: "PAPELERÍA", producto: "Sobres Manila Oficio", unidad: 595 },
{ categoria: "PAPELERÍA", producto: "Archivadores t/oficio", unidad: 119 },
{ categoria: "PAPELERÍA", producto: "Archivadores /carta", unidad: 76 },
{ categoria: "PAPELERÍA", producto: "Refuerzo para hojas perforadas 200 unidades", unidad: 24 },

// ALIMENTOS
{ categoria: "ALIMENTOS", producto: "Café Molido, bolsa de 1 libra", unidad: 13 },
{ categoria: "ALIMENTOS", producto: "Café, Instantáneo Nescafe Clásico de 225 g", unidad: 0 },
{ categoria: "ALIMENTOS", producto: "Té de Canela y Manzana, caja de 20 sobres", unidad: 5 },
{ categoria: "ALIMENTOS", producto: "Té de Canela, caja de 20 sobres", unidad: 17 },
{ categoria: "ALIMENTOS", producto: "Té de Rosa de Jamaica, caja de 20 sobres", unidad: 19 },
{ categoria: "ALIMENTOS", producto: "Té Negro, (sabor natural) caja de 20 sobres", unidad: 21 },
{ categoria: "ALIMENTOS", producto: "Café Molido, paquete de 340 gr Full Roast", unidad: 50 },
{ categoria: "ALIMENTOS", producto: "Café Molido, paquete de 340 gr Exclusive Blend", unidad: 50 },
{ categoria: "ALIMENTOS", producto: "Café Molido, paquete de 340 gr Exclusive Legendary", unidad: 50 },
{ categoria: "ALIMENTOS", producto: "Sal, 1 libra de mesa", unidad: 8 },
{ categoria: "ALIMENTOS", producto: "Filtros de Papel para cafetera (caja 100 un)", unidad: 5 },
{ categoria: "ALIMENTOS", producto: "Té de manzanilla, caja de 20 sobres", unidad: 5 },
{ categoria: "ALIMENTOS", producto: "Té de pericón, caja de 20 sobres", unidad: 13 },

// COMUNICACIÓN Y VIDEO
{ categoria: "COMUNICACIÓN Y VIDEO", producto: "CD's 80min 700 MB unidades", unidad: 93 },
{ categoria: "COMUNICACIÓN Y VIDEO", producto: "Cajas plásticas para CD/DVD (protectores paquete 25 und)", unidad: 75 },
{ categoria: "COMUNICACIÓN Y VIDEO", producto: "Etiquetas para CD unidades", unidad: 175 },
{ categoria: "COMUNICACIÓN Y VIDEO", producto: "Etiquetas para CD (unidades)", unidad: 23 },

// ENCESER DE OFICINA
{ categoria: "ENCESER DE OFICINA", producto: "Calculadora, marca Casio de 12 digitos; color negra, MX-128-BK", unidad: 11 },
{ categoria: "ENCESER DE OFICINA", producto: "Dispensador para tape mágico", unidad: 12 },
{ categoria: "ENCESER DE OFICINA", producto: "Dispensadores de clips", unidad: 5 },
{ categoria: "ENCESER DE OFICINA", producto: "Grapas (Estándar 5000 unid 26/6)", unidad: 17 },
{ categoria: "ENCESER DE OFICINA", producto: "Grapas (Industrial, uso pesado (17mm (5/8)", unidad: 1 },
{ categoria: "ENCESER DE OFICINA", producto: "Mopa", unidad: 4 },
{ categoria: "ENCESER DE OFICINA", producto: "Palas para basura", unidad: 1 },
{ categoria: "ENCESER DE OFICINA", producto: "Tóner, Tinta marca Konica Minulta tn 114", unidad: 1 },
{ categoria: "ENCESER DE OFICINA", producto: "Tóner, Tinta para impresora XEROX Phaser 3320", unidad: 6 },

// ENCERES DE LIMPIEZA
{ categoria: "ENCERES DE LIMPIEZA", producto: "Aceite Rojo, para limpiar muebles, Maderas, Molduras y pisos, bote de 8oz. (240ml)", unidad: 0 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Aerosol Pledge, para limpieza de muebles, 378ml", unidad: 33 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Alcohol liquido (galon) Silver", unidad: 4 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Algodón Absorbente(libra)", unidad: 3 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Almohadilla para sellos", unidad: 4 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Aromatizante de Ambiente Aerosol glade", unidad: 80 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Cloro, 1 galón", unidad: 17 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Limpia vidrios (galón)", unidad: 0 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Limpiadores de tela, color amarillo (paño de microfibra 40 X 40 cm)", unidad: 48 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Limpiadores de tela, grande; Iris", unidad: 8 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Líquido para limpiar ventanas, Window Cleaner, (galón)", unidad: 7 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Lysol desinfectante spray", unidad: 2 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Sanitizante concentrado sin aroma", unidad: 11 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Desinfectante para pisos", unidad: 9 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Jabón en polvo 1 Kg", unidad: 19 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Jabón en polvo bolsa de 25 libras", unidad: 1 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Jabón para trastos 450g, tarro de 425 gr", unidad: 0 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Jabón gel liquido para manos (Galones)", unidad: 7 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Toalla de papel para manos (250 mts Caja de 12) unidades", unidad: 28 },
{ categoria: "ENCERES DE LIMPIEZA", producto: "Pastillas aromatizantes para baños", unidad: 225 },

// MATERIALES ELECTRÓNICOS
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Aire comprimido para computadoras", unidad: 6 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tubo Led (T8 60 centímetros 9 Vatios", unidad: 4 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Termómetro infrarrojo", unidad: 2 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Cartucho para impresoras Laserjet HP/ 508x color negro CF360X", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Cartucho para impresoras Laserjet HP/ color Amarillo CF362XC", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Cartucho para impresoras Laserjet HP/ color Magenta CF363XC", unidad: 2 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Epson 664-120 color Negro", unidad: 53 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Epson 664-220 color Cyan", unidad: 87 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Epson 664-320 color Magenta", unidad: 88 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta Epson 664-420 color Yellow", unidad: 88 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta para almohadilla color negro 28 ml", unidad: 10 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta para almohadilla para sellos gotero color azul", unidad: 2 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta para impresoras Laserjet HP M501/ color negro CF287A", unidad: 12 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras Canon, 140 color negro", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras Canon, 141 colores", unidad: 25 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras Canon, 146 colores", unidad: 4 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras Canon, 210 color negro", unidad: 3 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras Canon, 211 colores", unidad: 4 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, cartucho de tinta para impresoras HP/ Color negro 96", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner 1VV22AL HP GT53 Negro 24", unidad: 24 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner Cartucho HP CE312A/ 126 A Yellow", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner Cartucho HP CE313A/126 A Magenta", unidad: 1 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner MOHS4AL GT52 Cyan 26", unidad: 26 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner MOH55AL GT52 Magenta 26", unidad: 26 },
{ categoria: "MATERIALES ELECTRÓNICOS", producto: "Tinta, tóner MOH56AL GT52 Amarillo 23", unidad: 23 },

// MATERIALES DE LIMPIEZA
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Esponja para trastos (unidad)", unidad: 22 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Escobas grandes", unidad: 6 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Espuma limpiadora para equipos de computo", unidad: 9 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Toalla doble para trapear 18", unidad: 18 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Limpiador en polvo (multiusos ajax)", unidad: 36 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Jabón liquido para trastos (Galon)", unidad: 11 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Bolsa para basura pequeña color blanca, (paquetes de 50 unidades)", unidad: 649 },
{ categoria: "MATERIALES DE LIMPIEZA", producto: "Bolsas para basura extra grandes color negro, paquetes de 100 bolsas) unidades", unidad: 359 },

// ÚTILES DE OFICINA
{ categoria: "ÚTILES DE OFICINA", producto: "Almohadilla para sellos", unidad: 4 },
{ categoria: "ÚTILES DE OFICINA", producto: "Cinta de empaque de 2\" 50yd", unidad: 11 },
{ categoria: "ÚTILES DE OFICINA", producto: "Cinta mágica (Tape )", unidad: 48 },
{ categoria: "ÚTILES DE OFICINA", producto: "Clip (50mm grande caja de 100 unidades", unidad: 12 },
{ categoria: "ÚTILES DE OFICINA", producto: "Clip Standard (33mm pequeño); Caja de 100 unidades", unidad: 11 },
{ categoria: "ÚTILES DE OFICINA", producto: "Clip Tipo Mariposa (cajas)", unidad: 9 },
{ categoria: "ÚTILES DE OFICINA", producto: "Marcador permanente punta fina (negro)", unidad: 4 },
{ categoria: "ÚTILES DE OFICINA", producto: "Masking tape de 12mm x 25m (1/2 Pulgada)", unidad: 24 },
{ categoria: "ÚTILES DE OFICINA", producto: "Masking tape de 24mm x 25m (1 Pulgada)", unidad: 20 },
{ categoria: "ÚTILES DE OFICINA", producto: "Masking tape de 48mm x 25m (2 Pulgadas)", unidad: 30 },
{ categoria: "ÚTILES DE OFICINA", producto: "Minas 0.5, para portaminas (0.5)", unidad: 29 },
{ categoria: "ÚTILES DE OFICINA", producto: "Notas Adhesivas 1 block de notas con 100 hojas 7.62 cm x 7.62 cm) 3x3", unidad: 85 },
{ categoria: "ÚTILES DE OFICINA", producto: "Notas Adhesivas ( 1 block de notas con 100 hojas (7.62 cm x 12.7cm) 3 in x 5", unidad: 167 },
{ categoria: "ÚTILES DE OFICINA", producto: "Notas Adhesivas (Block de notas con 100 unidades 3.81 cm x 5.08 cm) 11/2 x 2", unidad: 199 },
{ categoria: "ÚTILES DE OFICINA", producto: "Notas Adhesivas, banderitas (1.27 cm X 4.3 cm) 1/2 x 1 11/16; de cinco colores", unidad: 57 },
{ categoria: "ÚTILES DE OFICINA", producto: "Notas adhesivas, banderitas (2.54cm x 4.3cm (1 x 1 11/16) de tres colores", unidad: 52 },
{ categoria: "ÚTILES DE OFICINA", producto: "Plástico autoadherible transparente (rollos)", unidad: 4 },
{ categoria: "ÚTILES DE OFICINA", producto: "Archivadores t/oficio", unidad: 119 },
{ categoria: "ÚTILES DE OFICINA", producto: "Archivadores /carta", unidad: 76 },
{ categoria: "ÚTILES DE OFICINA", producto: "Binder Clip de 19 mm caja 12 unidades", unidad: 16 },
{ categoria: "ÚTILES DE OFICINA", producto: "Binder Clip de 25mm caja 12 unidades", unidad: 18 },
{ categoria: "ÚTILES DE OFICINA", producto: "Binder Clip de 32 mm caja 12 unidades", unidad: 16 },
{ categoria: "ÚTILES DE OFICINA", producto: "Binder Clip de 41 mm caja 12 unidades", unidad: 18 },
{ categoria: "ÚTILES DE OFICINA", producto: "Binder Clip de 51 mm caja 12 unidades", unidad: 17 },
{ categoria: "ÚTILES DE OFICINA", producto: "Portaminas (0", unidad: 23 },
{ categoria: "ÚTILES DE OFICINA", producto: "Marcador varios colores unidades (Plzarra)", unidad: 29 },
{ categoria: "ÚTILES DE OFICINA", producto: "Espiral para encuadernar (diferentes medidas) unidades", unidad: 2022 },

                ];
                saveInventoryData();
            }
            filteredData = inventoryData;
        }

        function saveInventoryData() {
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        }

        function renderTable() {
            const tableBody = document.querySelector('#inventoryTable tbody');
            tableBody.innerHTML = '';
            filteredData.forEach((item, index) => {
                const status = getStatus(item.unidad);
                const row = `
                    <tr data-index="${index}">
                        <td>${new Date().toLocaleDateString()}</td>
                        <td>${index + 1}</td>
                        <td>${item.producto}</td>
                        <td>${item.categoria}</td>
                        <td>Almacenes Maybe</td>
                        <td>${item.unidad}</td>
                        <td class="${status.class}">${status.icon}</td>
                        <td>1</td>
                        <td>${getDescription(item.producto)}</td>
                        <td>Angel de Almacenamiento</td>
                        <td>Indefinido</td>
                        <td><button class="edit-btn" data-index="${index}">✏️</button></td>
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

            document.querySelectorAll('#inventoryTable tbody tr').forEach(row => {
                row.addEventListener('click', () => {
                    const index = row.dataset.index;
                    showOrderPanel(filteredData[index]);
                });
            });
        }

        function getStatus(unidad) {
            if (unidad === 0) {
                return { class: 'status-red', icon: '↓' };
            } else if (unidad < 10) {
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
                item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            document.getElementById('editProductName').value = item.producto;
            document.getElementById('editProductCategory').value = item.categoria;
            document.getElementById('editProductUnits').value = item.unidad;
            editForm.style.display = 'block';
        }

        document.getElementById('saveNewProduct').addEventListener('click', () => {
            const newProduct = {
                producto: document.getElementById('newProductName').value,
                categoria: document.getElementById('newProductCategory').value,
                unidad: parseInt(document.getElementById('newProductUnits').value)
            };
            inventoryData.push(newProduct);
            saveInventoryData();
            filteredData = inventoryData;
            renderTable();
            closeModal();
        });

        document.getElementById('saveEditProduct').addEventListener('click', () => {
            const editedProduct = {
                producto: document.getElementById('editProductName').value,
                categoria: document.getElementById('editProductCategory').value,
                unidad: parseInt(document.getElementById('editProductUnits').value)
            };
            const globalIndex = inventoryData.findIndex(item => item === filteredData[currentEditIndex]);
            if (globalIndex !== -1) {
                inventoryData[globalIndex] = editedProduct;
            }
            filteredData[currentEditIndex] = editedProduct;
            saveInventoryData();
            renderTable();
            closeModal();
        });

        function showOrderPanel(product) {
            const panel = document.getElementById('orderPanel');
            const productNameSpan = document.getElementById('productName');
            productNameSpan.textContent = product.producto;
            panel.style.display = 'flex';
            setTimeout(() => {
                panel.style.transform = 'translate(-50%, -50%) scale(1)';
                panel.style.opacity = '1';
            }, 10);
        }

        function hideOrderPanel() {
            const panel = document.getElementById('orderPanel');
            panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }

        function showOrderConfirmation() {
            alert("Puede enviar su solicitud a este correo para que su pedido sea tomado:\n\nAflopezu@mineco.gob.gt");
        }

        document.getElementById('confirmOrder').addEventListener('click', () => {
            hideOrderPanel();
            showOrderConfirmation();
        });

        document.getElementById('cancelOrder').addEventListener('click', hideOrderPanel);

        loadInventoryData();
        renderTable();