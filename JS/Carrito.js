document.addEventListener('DOMContentLoaded', renderizarCarrito);

function renderizarCarrito() {
    const lista = document.getElementById('lista-productos');
    const totalDisplay = document.getElementById('total-final');
    let carrito = JSON.parse(localStorage.getItem('miCarrito')) || [];
    
    lista.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="vacio-msg">Tu carrito está vacío. ¡Ve por un helado!</p>';
    } else {
        carrito.forEach((prod, index) => {

            const precio = parseFloat(prod.precioUnitario);
            const cant = parseInt(prod.cantidad);
            const subtotal = precio * cant;
            total += subtotal;

            lista.innerHTML += `
                <div class="card-carrito">
                    <img src="${prod.imagen}" width="80">
                    <div class="info">
                        <h3>${prod.sabor}</h3>
                        <p>${prod.tamano} | ${prod.calidad}</p>
                    </div>
                    <div class="cantidad-control">
                        <button class="btn-control" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${cant}</span>
                        <button class="btn-control" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <div class="precio-sub">
                        $${subtotal.toFixed(2)}
                    </div>
                    <button class="btn-borrar" onclick="eliminar(${index})">🗑️</button>
                </div>
            `;
        });
    }
    totalDisplay.innerText = `$${total.toFixed(2)}`;
}
function cambiarCantidad(index, valor) {
    let carrito = JSON.parse(localStorage.getItem('miCarrito'));
    let actual = parseInt(carrito[index].cantidad);
    
    // Aplicamos la misma lógica del modal: mínimo 1, máximo 10
    if (actual + valor >= 1 && actual + valor <= 10) {
        carrito[index].cantidad = actual + valor;
        localStorage.setItem('miCarrito', JSON.stringify(carrito));
        renderizarCarrito(); // Refrescamos la vista
    }
}

function eliminar(index) {
    let carrito = JSON.parse(localStorage.getItem('miCarrito'));
    carrito.splice(index, 1);
    localStorage.setItem('miCarrito', JSON.stringify(carrito));
    renderizarCarrito();
}
// Referencia a la librería jsPDF
const { jsPDF } = window.jspdf;

function finalizarCompra() {
    let carrito = JSON.parse(localStorage.getItem('miCarrito')) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    // Mostramos el modal de pago
    document.getElementById('modal-pago').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-pago').style.display = 'none';
}

// Escuchar el envío del formulario
document.getElementById('form-pago').addEventListener('submit', function(e) {
    e.preventDefault();
    generarPDF();
});

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const nombre = document.getElementById('nombre-cliente').value;
    const correo = document.getElementById('correo-cliente').value;
    let carrito = JSON.parse(localStorage.getItem('miCarrito')) || [];
    let total = document.getElementById('total-final').innerText;

    // Función interna para quitar emojis y símbolos especiales
    const limpiarTexto = (texto) => {
        return texto.replace(/[^\x00-\x7F]/g, "").trim();
    };

    // --- Diseño del PDF ---
    doc.setFontSize(22);
    doc.setTextColor(255, 105, 180); 
    doc.text("Kayamasu - Recibo de Compra", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Cliente: ${limpiarTexto(nombre)}`, 20, 40);
    doc.text(`Correo: ${correo}`, 20, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.line(20, 65, 190, 65);

    let y = 75;
    doc.text("Producto", 20, y);
    doc.text("Cant.", 120, y);
    doc.text("Subtotal", 160, y);
    
    y += 10;
    doc.setFontSize(10);
    
    carrito.forEach(prod => {
        const sub = (parseFloat(prod.precioUnitario) * parseInt(prod.cantidad)).toFixed(2);
        
        // Limpiamos el nombre del sabor (por si trae el emoji de helado o uva)
        const nombreLimpio = limpiarTexto(prod.sabor);
        const detallesLimpio = limpiarTexto(`${prod.tamano} | ${prod.calidad}`);

        doc.text(`${nombreLimpio} (${detallesLimpio})`, 20, y);
        doc.text(`${prod.cantidad}`, 125, y);
        doc.text(`$${sub}`, 165, y);
        y += 10;
    });

    doc.line(20, y, 190, y);
    doc.setFontSize(14);
    doc.text(`Total Pagado: ${total}`, 140, y + 10);

    // --- Finalización ---
    doc.save(`Recibo_Kayamasu_${limpiarTexto(nombre)}.pdf`);

    // Limpiar datos y redireccionar
    localStorage.removeItem('miCarrito');
    alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");
    window.location.href = "../Index.html"; 
}