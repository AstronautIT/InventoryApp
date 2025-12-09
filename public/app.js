// Global state
let products = [];
let editingProductId = null;

// DOM Elements
const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addProductBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => closeModalDialog());
    cancelBtn.addEventListener('click', () => closeModalDialog());
    productForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModalDialog();
        }
    });
}

// Load all products
async function loadProducts() {
    try {
        productList.innerHTML = '<div class="loading"></div>';
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to load products');
        
        products = await response.json();
        renderProducts(products);
        updateStats();
    } catch (error) {
        console.error('Error loading products:', error);
        productList.innerHTML = '<div class="empty-state"><h3>Failed to load products</h3></div>';
    }
}

// Render products
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <h3>No beers found</h3>
                <p>Start by adding your first beer to the inventory</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    <div class="product-sku">SKU: ${escapeHtml(product.sku)}</div>
                </div>
                <span class="category-badge">${escapeHtml(product.category)}</span>
            </div>
            <p class="product-description">${escapeHtml(product.description || 'No description')}</p>
            <div class="product-info">
                <div class="price">$${parseFloat(product.price).toFixed(2)}</div>
                <div class="quantity">
                    <span class="quantity-display">Qty: ${product.quantity}</span>
                    <span class="stock-status ${getStockClass(product.quantity)}">
                        ${getStockLabel(product.quantity)}
                    </span>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${product.quantity - 1})" ${product.quantity === 0 ? 'disabled' : ''}>−</button>
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${product.quantity + 1})">+</button>
            </div>
            <div class="product-actions">
                <button class="btn btn-success" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity < 20).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('lowStock').textContent = lowStock;
}

// Get stock status class
function getStockClass(quantity) {
    if (quantity < 20) return 'stock-low';
    if (quantity < 50) return 'stock-medium';
    return 'stock-high';
}

// Get stock status label
function getStockLabel(quantity) {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 20) return 'Low Stock';
    if (quantity < 50) return 'Medium Stock';
    return 'In Stock';
}

// Open modal
function openModal(product = null) {
    editingProductId = product ? product.id : null;
    modalTitle.textContent = product ? 'Edit Beer' : 'Add New Beer';
    
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productSKU').value = product.sku;
        document.getElementById('productSKU').disabled = true; // Can't edit SKU
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productCategory').value = product.category;
    } else {
        productForm.reset();
        document.getElementById('productSKU').disabled = false;
    }
    
    productModal.style.display = 'block';
}

// Close modal
function closeModalDialog() {
    productModal.style.display = 'none';
    productForm.reset();
    editingProductId = null;
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSKU').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        category: document.getElementById('productCategory').value
    };

    try {
        let response;
        if (editingProductId) {
            response = await fetch(`/api/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save product');
        }

        closeModalDialog();
        await loadProducts();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openModal(product);
    }
}

// Delete product
async function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete product');

        await loadProducts();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Update quantity
async function updateQuantity(id, newQuantity) {
    if (newQuantity < 0) return;

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        await loadProducts();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Search products
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        renderProducts(products);
        return;
    }

    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderProducts(filtered);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
