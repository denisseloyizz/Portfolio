// ─── Product Data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium sound quality with 30-hour battery life.',
    price: 79.99,
    emoji: '🎧',
    category: 'electronics',
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Track fitness, notifications, and more.',
    price: 129.99,
    emoji: '⌚',
    category: 'electronics',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    description: 'Portable and waterproof with rich bass.',
    price: 49.99,
    emoji: '🔊',
    category: 'electronics',
  },
  {
    id: 4,
    name: 'Classic T-Shirt',
    description: '100% organic cotton, available in 8 colours.',
    price: 24.99,
    emoji: '👕',
    category: 'clothing',
  },
  {
    id: 5,
    name: 'Running Shoes',
    description: 'Lightweight and breathable for every terrain.',
    price: 89.99,
    emoji: '👟',
    category: 'clothing',
  },
  {
    id: 6,
    name: 'Winter Jacket',
    description: 'Warm, windproof, and stylishly designed.',
    price: 149.99,
    emoji: '🧥',
    category: 'clothing',
  },
  {
    id: 7,
    name: 'Scented Candle Set',
    description: 'Six relaxing fragrances for your home.',
    price: 34.99,
    emoji: '🕯️',
    category: 'home',
  },
  {
    id: 8,
    name: 'Ceramic Mug',
    description: 'Handcrafted 12oz mug, dishwasher safe.',
    price: 18.99,
    emoji: '☕',
    category: 'home',
  },
  {
    id: 9,
    name: 'Throw Blanket',
    description: 'Ultra-soft fleece – perfect for cosy evenings.',
    price: 44.99,
    emoji: '🛋️',
    category: 'home',
  },
];

// ─── State ─────────────────────────────────────────────────────────────────────
const cart = {}; // { productId: quantity }
let activeCategory = 'all';

// ─── DOM references ─────────────────────────────────────────────────────────────
const productGrid   = document.getElementById('productGrid');
const cartToggle    = document.getElementById('cartToggle');
const cartClose     = document.getElementById('cartClose');
const cartSidebar   = document.getElementById('cartSidebar');
const overlay       = document.getElementById('overlay');
const cartCountEl   = document.getElementById('cartCount');
const cartItemsEl   = document.getElementById('cartItems');
const cartTotalEl   = document.getElementById('cartTotal');
const checkoutBtn   = document.getElementById('checkoutBtn');
const toast         = document.getElementById('toast');
const filterBtns    = document.querySelectorAll('.filter-btn');

// ─── Render products ──────────────────────────────────────────────────────────
function renderProducts() {
  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-card__img">${product.emoji}</div>
      <div class="product-card__body">
        <span class="product-card__category">${product.category}</span>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
      </div>
      <div class="product-card__footer">
        <span class="product-card__price">$${product.price.toFixed(2)}</span>
        <button class="btn btn--primary add-to-cart-btn" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `).join('');
}

// ─── Render cart ──────────────────────────────────────────────────────────────
function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    cartItemsEl.innerHTML = '<li class="cart-empty">Your cart is empty 🛒</li>';
    cartTotalEl.textContent = '$0.00';
    cartCountEl.textContent = '0';
    return;
  }

  let total = 0;
  let totalQty = 0;

  cartItemsEl.innerHTML = entries.map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === Number(id));
    const subtotal = product.price * qty;
    total += subtotal;
    totalQty += qty;
    return `
      <li class="cart-item" data-id="${product.id}">
        <div class="cart-item__emoji">${product.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${product.name}</div>
          <div class="cart-item__price">$${subtotal.toFixed(2)}</div>
        </div>
        <div class="cart-item__controls">
          <button class="qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${qty}</span>
          <button class="qty-btn" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
          <button class="remove-btn" data-action="remove" data-id="${product.id}" aria-label="Remove item">🗑</button>
        </div>
      </li>
    `;
  }).join('');

  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  cartCountEl.textContent = totalQty;
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (cart[id] === 0) delete cart[id];
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Sidebar open / close ─────────────────────────────────────────────────────
function openCart() {
  cartSidebar.classList.add('open');
  cartSidebar.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartSidebar.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// ─── Event listeners ──────────────────────────────────────────────────────────
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// Add to cart (event delegation on grid)
productGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  addToCart(id);
  const product = PRODUCTS.find(p => p.id === id);
  showToast(`"${product.name}" added to cart!`);
});

// Cart item controls (event delegation)
cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'increase') changeQty(id, 1);
  if (action === 'decrease') changeQty(id, -1);
  if (action === 'remove')   removeFromCart(id);
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

// Checkout
checkoutBtn.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  Object.keys(cart).forEach(id => delete cart[id]);
  renderCart();
  closeCart();
  showToast('✅ Order placed! Thank you for shopping with us.');
});

// ─── Keyboard accessibility (close sidebar with Escape) ───────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderProducts();
renderCart();
