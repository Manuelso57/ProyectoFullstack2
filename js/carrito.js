function obtener_carrito() {
    const datos = localStorage.getItem("carrito_mil_sabores");
    return datos ? JSON.parse(datos) : [];
}
function guardar_carrito(carrito) {
    localStorage.setItem("carrito_mil_sabores", JSON.stringify(carrito));
    actualizar_contador_carrito();
}
function agregar_al_carrito(codigo, cantidad) {
    const carrito = obtener_carrito();
    const existente = carrito.find(item => item.codigo === codigo);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ codigo: codigo, cantidad: cantidad });
    }
    guardar_carrito(carrito);
}
function quitar_del_carrito(codigo) {
    const carrito = obtener_carrito().filter(item => item.codigo !== codigo);
    guardar_carrito(carrito);
}
function cambiar_cantidad_carrito(codigo, cantidad) {
    const carrito = obtener_carrito();
    const item = carrito.find(item => item.codigo === codigo);
    if (item) {
        if (cantidad < 1) {
            quitar_del_carrito(codigo);
            return;
        }
        item.cantidad = cantidad;
    }
    guardar_carrito(carrito);
}
function total_items_carrito() {
    return obtener_carrito().reduce((suma, item) => suma + item.cantidad, 0);
}
function total_precio_carrito() {
    return obtener_carrito().reduce((suma, item) => {
        const producto = productos.find(p => p.codigo === item.codigo);
        return producto ? suma + producto.precio * item.cantidad : suma;
    }, 0);
}
function actualizar_contador_carrito() {
    const contador = document.getElementById("contador_carrito");
    if (contador) contador.textContent = total_items_carrito();
}
document.addEventListener("DOMContentLoaded", actualizar_contador_carrito);