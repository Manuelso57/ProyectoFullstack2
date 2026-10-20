const parametrosUrlProducto = new URLSearchParams(window.location.search);
const codigoEditar = parametrosUrlProducto.get("codigo");
const productoExistente = codigoEditar ? productos.find(p => p.codigo === codigoEditar) : null;

if (productoExistente) {
    document.getElementById("titulo-pagina").textContent = "Editar producto - Administrador Pasteleria mil sabores";
    document.getElementById("titulo-formulario").textContent = "Editar producto";
    document.getElementById("codigo").value = productoExistente.codigo;
    document.getElementById("codigo").disabled = true;
    document.getElementById("nombre").value = productoExistente.nombre;
    document.getElementById("descripcion").value = productoExistente.descripcion || "";
    document.getElementById("precio").value = productoExistente.precio;
    document.getElementById("stock").value = productoExistente.stock !== undefined ? productoExistente.stock : 0;
    document.getElementById("stock-critico").value = productoExistente.stockCritico !== undefined && productoExistente.stockCritico !== null ? productoExistente.stockCritico : "";
    document.getElementById("categoria").value = productoExistente.categoria;
    document.getElementById("imagen").value = productoExistente.imagen || "";
}

configurarFormulario("form-producto", {
    codigo: { requerido: true, min: 3 },
    nombre: { requerido: true, max: 100 },
    descripcion: { requerido: false, max: 500 },
    precio: {
        requerido: true,
        personalizada: (valor) => (valor !== "" && !isNaN(valor) && parseFloat(valor) >= 0) ? true : "El precio debe ser un número mayor o igual a 0."
    },
    stock: {
        requerido: true,
        personalizada: (valor) => (/^[0-9]+$/.test(valor.trim()) && parseInt(valor) >= 0) ? true : "El stock debe ser un número entero mayor o igual a 0."
    },
    "stock-critico": {
        requerido: false,
        personalizada: (valor) => (valor.trim() === "" || (/^[0-9]+$/.test(valor.trim()) && parseInt(valor) >= 0)) ? true : "El stock crítico debe ser un número entero mayor o igual a 0."
    },
    categoria: { requerido: true, mensajeRequerido: "Selecciona una categoría." }
}, (formulario) => {
    const codigo = document.getElementById("codigo").value.trim();
    const mensaje = formulario.querySelector(".mensaje-formulario");
    if (!productoExistente && productos.some(p => p.codigo === codigo)) {
        mensaje.textContent = "Ya existe un producto con ese código.";
        mensaje.className = "mensaje-formulario mensaje-formulario--error";
        return;
    }
    const stockCriticoValor = document.getElementById("stock-critico").value.trim();
    const productoGuardado = {
        codigo: codigo,
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value),
        stockCritico: stockCriticoValor === "" ? null : parseInt(stockCriticoValor),
        categoria: document.getElementById("categoria").value,
        imagen: document.getElementById("imagen").value.trim() || "imagenes/logo.png"
    };
    if (productoExistente) {
        const indice = productos.findIndex(p => p.codigo === codigo);
        productos[indice] = productoGuardado;
    } else {
        productos.push(productoGuardado);
    }
    guardarProductos(productos);
    setTimeout(() => {
        window.location.href = "productos.html";
    }, 800);
});