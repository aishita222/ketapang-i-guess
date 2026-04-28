let cart = [];

const WHATSAPP_NUMBER = '6285692212417';

let tombolcart;
let cartMOOOdal;
let closecart;
let itemcart;
let carttotal;
let count;

document.addEventListener('DOMContentLoaded', () => {
    setupevent();
    loadcart();
});

function setupevent() {
    tombolcart = document.getElementById('cartbradar');
    cartMOOOdal = document.getElementById('cartMOOOdal');
    closecart = document.getElementById('closecart');
    itemcart = document.getElementById('cartelitems');
    carttotal = document.getElementById('carttotal');
    count = document.querySelector('.count');
    
    if (tombolcart) tombolcart.addEventListener('click', bukakart);
    if (closecart) closecart.addEventListener('click', tutupkart);
    if (cartMOOOdal) cartMOOOdal.addEventListener('click', (e) => {
        if (e.target === cartMOOOdal) tutupkart();
    });
    const checkoutBtn = document.getElementById('checkoutbutton');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWhatsApp);
    
    // Setup tombol tambah keranjang dengan data attributes
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                const productData = this.getAttribute('data-product');
                if (productData) {
                    const product = JSON.parse(productData);
                    console.log('Product dari button:', product);
                    tambahKeranjang(product);
                }
            } catch (err) {
                console.error('Error parsing product:', err);
            }
        });
    });
    
    // secret animal gad damn
    const secretAnimalBtns = document.querySelectorAll('p[onclick*="AUDIOvineboom"]');
    secretAnimalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            AUDIOvineboom();
        });
        // eras onceklik
        btn.removeAttribute('onclick');
    });
}

function tambahKeranjang(product) {
    console.log('tambahKeKeranjang dipanggil:', product);
    const existingItem = cart.find(item => item.id === product.id && item.varian === product.varian);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    console.log('Cart sekarang:', cart);
    simpanKeranjang();
    updateKeranjangUI();
    tampilNotifikasi();
}

function tambahKeKeranjangFromDesc(product) {
    tambahKeranjang(product);
}

function hapusDariKeranjang(productId) {
    cart = cart.filter(item => item.id !== productId);
    simpanKeranjang();
    updateKeranjangUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            hapusDariKeranjang(productId);
        } else {
            simpanKeranjang();
            updateKeranjangUI();
        }
    }
}

function updateKeranjangUI() {
    if (count) count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (!itemcart || !carttotal) return;
    
    if (cart.length === 0) {
        itemcart.innerHTML = '<p class="empti-cardNOOOOO">oh noes! keranjang kamu kosong! >:3 </p>';
        carttotal.innerHTML = '<strong>Total: </strong> <span>Rp0</span>';
        return;
    }
    
    itemcart.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h3>${item.image} ${item.nama}</h3>
                <p>Rp${item.harga.toLocaleString('id-ID')} setiap item</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="hapusDariKeranjang(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
    carttotal.innerHTML = '<strong>Total: </strong> <span>Rp' + total.toLocaleString('id-ID') + '</span>';
}

function bukakart() {
    cartMOOOdal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function tutupkart() {
    cartMOOOdal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function simpanKeranjang() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadcart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateKeranjangUI();
    }
}

function tampilNotifikasi() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6f00, #ffc166);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = '✓ Ditambahkan ke keranjang!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Keranjang kamu kosong!');
        return;
    }
    
    let message = 'haii saya mau beli :3%0A%0A';
    
    cart.forEach(item => {
        message += `barang: ${item.nama} x${item.quantity}%0A`;
        message += `harga: Rp${(item.harga * item.quantity).toLocaleString('id-ID')}%0A%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
    message += `Total: Rp${total.toLocaleString('id-ID')}`;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') tutupkart();
});

let hitung = 0;

function AUDIOvineboom() {
    const audio = new Audio('../foto%20foto/fine.mp3');
    audio.volume = 1;
    audio.play();
    hitung++;
    if (hitung === 10) {
        window.location.href = "https://lomando.com/main.html";
    }
}
