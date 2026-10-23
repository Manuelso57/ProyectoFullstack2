function renderizarTablaProductos() {
    const contenedor = document.getElementById("contenedor_tabla_productos");
    let filas = "";
    productos.forEach((producto) => {
        const stockCritico = producto.stockCritico !== undefined && producto.stockCritico !== null && producto.stock <= producto.stockCritico;
        filas += "<tr>" +
            "<td>" + producto.codigo + "</td>" +
            "<td>" + producto.categoria + "</td>" +
            "<td>" + producto.nombre + "</td>" +
            "<td>$" + producto.precio.toLocaleString("es-CL") + "</td>" +
            "<td>" + (producto.stock !== undefined ? producto.stock : "-") + (stockCritico ? ' <span class="admin-alerta">¡Stock crítico!</span>' : "") + "</td>" +
            '<td><a href="producto_form.html?codigo=' + producto.codigo + '" class="boton boton--secundario">Editar</a></td>' +
            "</tr>";
    });
    contenedor.innerHTML = '<table class="tabla-admin">' +
        "<thead><tr><th>Código</th><th>Categoría</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>" +
        "<tbody>" + filas + "</tbody>" +
        "</table>";
}
renderizarTablaProductos();