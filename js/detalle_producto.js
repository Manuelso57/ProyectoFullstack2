const parametrosUrl = new URLSearchParams(window.location.search);
const codigoBuscado = parametrosUrl.get("codigo");
const productoActual = productos.find(producto => producto.codigo === codigoBuscado);
if (productoActual) {
    document.title = productoActual.nombre + " - Pasteleria mil sabores";
    document.getElementById("detalle-imagen").src = productoActual.imagen;
    document.getElementById("detalle-imagen").alt = productoActual.nombre;
    document.getElementById("detalle-categoria").textContent = productoActual.categoria;
    document.getElementById("detalle-nombre").textContent = productoActual.nombre;
    document.getElementById("detalle-precio").textContent = "$" + productoActual.precio.toLocaleString("es-CL");
    document.getElementById("detalle-descripcion").textContent = productoActual.descripcion;
} else {
    document.getElementById("detalle-nombre").textContent = "Producto no encontrado";
    document.getElementById("detalle-descripcion").textContent = "Vuelve al catálogo e intenta de nuevo.";
}
document.getElementById("restar-cantidad").addEventListener("click", function() {
    const input = document.getElementById("valor-cantidad");
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
});
document.getElementById("sumar-cantidad").addEventListener("click", function() {
    const input = document.getElementById("valor-cantidad");
    input.value = parseInt(input.value) + 1;
});
document.getElementById("agregar_carrito").addEventListener("click", function() {
    const cantidad = parseInt(document.getElementById("valor-cantidad").value);
    agregar_al_carrito(productoActual.codigo, cantidad);
    this.textContent = "Añadido al carrito";
    setTimeout(() => { this.textContent = "Añadir al carrito"; }, 1200);
});