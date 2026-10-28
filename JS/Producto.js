const params = new URLSearchParams(window.location.search);
const nombre = params.get("nombre");

const productos = {
    banana: {
        titulo: "Banana Fresa",
        descripcion: "Una combinación perfecta y cremosa que fusiona la dulzura natural del plátano maduro con el toque sutilmente ácido de las fresas frescas seleccionadas. Ideal para un día refrescante.",
        imagen: "../Imagenes/Gallery/BananaFresa.avif"
    },
    blueberry: {
        titulo: "Blueberry",
        descripcion: "Exquisito helado artesanal elaborado con un concentrado natural de arándanos azules silvestres. Ofrece un equilibrio perfecto entre notas dulces y silvestres, lleno de frescura en cada cucharada.",
        imagen: "../Imagenes/Gallery/Blueberry.jpg"
    },
    caramelo: {
        titulo: "Caramelo",
        descripcion: "Tentación pura con una base ultra cremosa infundada con auténtico caramelo artesanal y un sutil toque de veteado dulce que se derrite en tu boca. El favorito de los amantes del dulce intensivo.",
        imagen: "../Imagenes/Gallery/Caramelo.jpeg"
    },
    chicle: {
        titulo: "Chicle",
        descripcion: "El sabor clásico y divertido que despierta tu niño interior. Un helado sumamente llamativo, cremoso y con ese icónico aroma dulce que encanta a los más pequeños y llena de nostalgia a los grandes.",
        imagen: "../Imagenes/Gallery/Chicle.jpg"
    },
    mainFresa: {
        titulo: "Fresa",
        descripcion: "Elaborado con un proceso tradicional utilizando fresas 100% naturales recolectadas en su punto óptimo de maduración. Textura ligera, refrescante y repleta de trocitos de fruta real.",
        imagen: "../Imagenes/Gallery/MainFresa.png"
    },
    mainChocolate: {
        titulo: "Chocolate",
        descripcion: "Una experiencia intensa para los verdaderos amantes del cacao. Preparado con una mezcla selecta de chocolates premium que logran una consistencia suave, densa, cremosa y profundamente deliciosa.",
        imagen: "../Imagenes/Gallery/MainChocolate.png"
    },
    mainCoco: {
        titulo: "Coco",
        descripcion: "Disfruta del auténtico y refrescante sabor tropical del coco. Elaborado a base de crema de coco natural y espolvoreado con finas ralladuras que le otorgan una textura única y caribeña.",
        imagen: "../Imagenes/Gallery/MainCoco.png"
    },
    mainMango: {
        titulo: "Mango",
        descripcion: "Sorbete exótico y ultrarrefrescante que captura toda la esencia, el aroma y el dulzor del mango maduro salvadoreño. Una explosión frutal perfecta para calmar el calor de la tarde.",
        imagen: "../Imagenes/Gallery/MainMango.png"
    },
    mainVainilla: {
        titulo: "Vainilla",
        descripcion: "Nuestro clásico por excelencia, elaborado con extracto de vainilla de la más alta calidad. Su sabor suave, tradicional, aromático y balanceado lo convierte en el compañero perfecto para cualquier ocasión.",
        imagen: "../Imagenes/Gallery/MainVainilla.png"
    }
};
const producto = productos[nombre];

if (producto) {
    document.getElementById("titulo").textContent = producto.titulo;
    document.getElementById("descripcion").textContent = producto.descripcion;
    document.getElementById("imagen").src = producto.imagen;
    document.getElementById("rutaProducto").textContent = producto.titulo;

    // Mostrar nombre en valoración
    const tituloVal = document.getElementById("tituloValoracion");
    if (tituloVal) {
        tituloVal.textContent = producto.titulo;
    }

} else {
    document.body.innerHTML = "<h1>Producto no encontrado</h1>";
}

// =====================
// VALORACIONES
// =====================
let clave = "reseñas_" + nombre;
let contador = localStorage.getItem(clave) || 0;

document.getElementById("contador").textContent = contador;

document.getElementById("formComentario").addEventListener("submit", function (e) {
    e.preventDefault();

    contador++;
    localStorage.setItem(clave, contador);

    document.getElementById("contador").textContent = contador;

    this.reset();

    alert("Gracias por tu valoración 🙌");
});

// =====================
// RELACIONADOS
// =====================
const contenedor = document.getElementById("relacionados");

Object.keys(productos).forEach(key => {

    if (key === nombre) return;

    const p = productos[key];

    contenedor.innerHTML += `
        <a href="Producto.html?nombre=${key}" class="card">
            <div class="img-container">
                <img src="${p.imagen}" alt="">
                <div class="overlay"><span>+</span></div>
            </div>
            <h3>${p.titulo}</h3>
        </a>
    `;
});

// --- LÓGICA DEL MODAL DE COMPRA ---

const btnAbrir = document.querySelector(".btn-realizar-compra");
const modalCompra = document.getElementById("modalCompra");
const btnCerrar = document.querySelector(".cerrar-modal");

// Abrir Modal
// Abrir Modal
btnAbrir.addEventListener("click", () => {
    // 1. Capturamos el texto del título
    const nombreSabor = document.getElementById("titulo").textContent;
    document.getElementById("modal-titulo-sabor").textContent = nombreSabor;

    // 2. Capturamos la ruta de la imagen que ya cargó el producto
    const rutaImagen = document.getElementById("imagen").src; 
    
    // 3. ASIGNAMOS esa ruta a la imagen dentro del modal
    document.getElementById("img-modal-compra").src = rutaImagen; 

    // 4. Mostramos el modal
    modalCompra.style.display = "block"; 
    calcularPrecio();
});
// Cerrar Modal
btnCerrar.addEventListener("click", () => {
    modalCompra.style.display = "none";
});

// Cerrar si hace clic fuera
window.addEventListener("click", (e) => {
    if (e.target === modalCompra) {
        modalCompra.style.display = "none";
    }
});

// Funciones de apoyo
function cambiarCantidadModal(valor) {
    let input = document.getElementById("cantidad-modal");
    let actual = parseInt(input.value);
    if (actual + valor >= 1 && actual + valor <= 10) {
        input.value = actual + valor;
        calcularPrecio();
    }
}

function cambiarTab(event, tipo) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const selectTamano = document.getElementById("select-tamano");
    if (tipo === 'litros') {
        selectTamano.innerHTML = `
            <option value="5.00">Litro ($5.00)</option>
            <option value="18.00">Galón ($18.00)</option>
        `;
    } else {
        selectTamano.innerHTML = `
            <option value="1.00">Pequeño ($1.00)</option>
            <option value="1.50">Mediano ($1.50)</option>
            <option value="2.00">Grande ($2.00)</option>
        `;
    }
    calcularPrecio();
}

function calcularPrecio() {
    const pBase = parseFloat(document.getElementById("select-tamano").value);
    const multi = parseFloat(document.getElementById("select-calidad").value);
    const cant = parseInt(document.getElementById("cantidad-modal").value);

    const total = (pBase * multi) * cant;
    document.getElementById("precio-display").textContent = `$${total.toFixed(2)}`;
}

function agregarAlCarrito() {
    const sabor = document.getElementById("modal-titulo-sabor").textContent;
    const imagen = document.getElementById("img-modal-compra").src;
    const cantidad = parseInt(document.getElementById("cantidad-modal").value);

    const tamano = document.getElementById("select-tamano").options[document.getElementById("select-tamano").selectedIndex].text;
    const calidad = document.getElementById("select-calidad").options[document.getElementById("select-calidad").selectedIndex].text;

    const precioTotalTexto = document.getElementById("precio-display").textContent;
    const precioFinalNum = parseFloat(precioTotalTexto.replace('$', ''));

    // Calculamos el precio unitario para que el carrito pueda recalcular subtotales
    const precioUnitario = precioFinalNum / cantidad;

    const productoParaCarrito = {
        id: Date.now(),
        sabor: sabor,
        imagen: imagen,
        tamano: tamano,   // Nombre corregido
        calidad: calidad, // Nombre corregido
        cantidad: cantidad,
        precioUnitario: precioUnitario // Guardamos el precio de uno solo
    };

    let carrito = JSON.parse(localStorage.getItem("miCarrito")) || [];
    carrito.push(productoParaCarrito);
    localStorage.setItem("miCarrito", JSON.stringify(carrito));

    alert(`Añadido: ${cantidad} x ${sabor} al carrito`);
    modalCompra.style.display = "none";
}