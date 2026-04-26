function tambahKeKeranjangFromDesc(product) {
    const existingItem = cart.find(item => item.id === product.id && item.varian === product.varian);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            varian: 'Matcha',
            quantity: 1
        });
    }
    
    simpanKeranjang();
    
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