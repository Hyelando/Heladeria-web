function contadorPorDia(id, diaObjetivo) {
    // Busca en el HTML el elemento donde se mostrará el texto (por su ID)
    const el = document.getElementById(id);

    function actualizar() {
        const ahora = new Date(); // Obtiene la fecha y hora actual
        const hoy = ahora.getDay(); // Obtiene el día de la semana (0=domingo, 1=lunes, etc.)

        // Calcula cuántos días faltan restando el objetivo menos hoy
        let diasRestantes = diaObjetivo - hoy;
        
        // Si el día ya pasó esta semana (resultado negativo), le suma 7 para que sea la próxima semana
        if (diasRestantes < 0) diasRestantes += 7;

        // CASO A: SI ES EL DÍA DE LA OFERTA (faltan 0 días)
        if (diasRestantes === 0) {
            const fin = new Date();
            fin.setHours(23, 59, 59, 999); // Define la meta: el último milisegundo de hoy

            const diff = fin - ahora; // Calcula la diferencia de tiempo en milisegundos

            // CONVERSIÓN DE MILISEGUNDOS A: Horas (h), Minutos (m) y Segundos (s)
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            // Escribe el conteo regresivo en el HTML
            el.innerHTML = `Termina hoy en: ${h}h ${m}m ${s}s`;
            
            // Agrega la clase CSS "urgente" para que parpadee
            el.classList.add("urgente");
        } 
        // CASO B: SI FALTA MÁS DE UN DÍA
        else {
            el.innerHTML = `Faltan ${diasRestantes} día(s)`;
            // Quita la clase "urgente" si no es el día de la oferta
            el.classList.remove("urgente");
        }
    }

    actualizar(); // Ejecuta la función por primera vez al cargar
    setInterval(actualizar, 1000); // Hace que se repita cada 1 segundo (1000ms)
}

// INICIALIZACIÓN: Le decimos a cada ID qué día le toca (Lunes=1, Martes=2, etc.)
contadorPorDia("lunes", 1);
contadorPorDia("martes", 2);
contadorPorDia("miercoles", 3);
contadorPorDia("jueves", 4);
contadorPorDia("viernes", 5);
contadorPorDia("sabado", 6);

/**
 * PARTE 2: EL MODAL Y CARRITO (MODIFICADO SOLO AQUÍ)
 */

const botones = document.querySelectorAll(".btn-oferta");
const modal = document.getElementById("modal");
const titulo = document.getElementById("modal-titulo");
const desc = document.getElementById("modal-desc");
const img = document.getElementById("modal-img");
const cerrar = document.querySelector(".cerrar");

// CORRECCIÓN: Seleccionamos específicamente el botón con la clase que pusiste en el HTML
const btnAñadir = document.querySelector(".btn-añadir-carrito"); 
const inputCantidad = document.getElementById("cantidad-oferta");
let ofertaSeleccionada = null;
let diaOferta = null; // Guardamos el día de la oferta

botones.forEach(btn => {
    btn.addEventListener("click", () => {
        // Guardamos el día de la oferta (necesitas data-dia en el HTML)
        diaOferta = parseInt(btn.dataset.dia);
        
        ofertaSeleccionada = {
            titulo: btn.dataset.titulo,
            descripcion: btn.dataset.desc,
            imagen: btn.dataset.img
        };

        titulo.textContent = ofertaSeleccionada.titulo;
        desc.textContent = ofertaSeleccionada.descripcion;
        img.src = ofertaSeleccionada.imagen;
        inputCantidad.value = 1;

        modal.style.display = "block";
    });
});

// Función para cambiar cantidad
function cambiarCantidad(valor) {
    let actual = parseInt(inputCantidad.value);
    if (actual + valor >= 1 && actual + valor <= 10) {
        inputCantidad.value = actual + valor;
    }
}

// CORRECCIÓN: Usamos el botón correcto para el evento
btnAñadir.addEventListener("click", () => {
    if (!ofertaSeleccionada) return;
    
    // *** SOLO ESTO SE AÑADIÓ: VALIDACIÓN DEL DÍA ***
    const hoy = new Date().getDay();
    if (hoy !== diaOferta) {
        alert("Esta oferta solo está disponible en su día correspondiente");
        modal.style.display = "none";
        return; // No deja agregar al carrito
    }
    // *** FIN DE LA VALIDACIÓN ***
    
    const cantidad = parseInt(inputCantidad.value);
    
    // Extraemos el precio del texto (ej: "$3.50")
    const precioMatch = ofertaSeleccionada.descripcion.match(/\$(\d+\.\d+)/);
    const precioUnitario = precioMatch ? parseFloat(precioMatch[1]) : 0;

    const productoParaCarrito = {
        id: Date.now(),
        sabor: ofertaSeleccionada.titulo,
        imagen: ofertaSeleccionada.imagen,
        tamano: "Oferta Especial",
        calidad: "Promoción",
        cantidad: cantidad,
        precioUnitario: precioUnitario
    };

    let carrito = JSON.parse(localStorage.getItem("miCarrito")) || [];
    carrito.push(productoParaCarrito);
    localStorage.setItem("miCarrito", JSON.stringify(carrito));

    alert(`¡Oferta añadida! ${cantidad} x ${ofertaSeleccionada.titulo}`);
    modal.style.display = "none";
});

// Cerrar modal
cerrar.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});