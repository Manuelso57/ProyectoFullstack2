function renderizarTablaUsuarios() {
    const usuarios = obtenerUsuarios();
    const contenedor = document.getElementById("contenedor_tabla_usuarios");
    let filas = "";
    usuarios.forEach((usuario) => {
        filas += "<tr>" +
            "<td>" + usuario.nombre + "</td>" +
            "<td>" + (usuario.apellidos || "-") + "</td>" +
            "<td>" + (usuario.run || "-") + "</td>" +
            "<td>" + usuario.correo + "</td>" +
            '<td><select data-correo="' + usuario.correo + '">' +
            '<option value="Cliente"' + (usuario.tipo === "Cliente" ? " selected" : "") + ">Cliente</option>" +
            '<option value="Vendedor"' + (usuario.tipo === "Vendedor" ? " selected" : "") + ">Vendedor</option>" +
            '<option value="Administrador"' + (usuario.tipo === "Administrador" ? " selected" : "") + ">Administrador</option>" +
            "</select></td>" +
            '<td><button type="button" class="boton boton--secundario" data-guardar="' + usuario.correo + '">Guardar</button></td>' +
            "</tr>";
    });
    contenedor.innerHTML = '<table class="tabla-admin">' +
        "<thead><tr><th>Nombre</th><th>Apellidos</th><th>RUN</th><th>Correo</th><th>Tipo</th><th>Acciones</th></tr></thead>" +
        "<tbody>" + filas + "</tbody>" +
        "</table>";
    document.querySelectorAll("[data-guardar]").forEach((boton) => {
        boton.addEventListener("click", () => {
            const correo = boton.dataset.guardar;
            const select = document.querySelector('[data-correo="' + correo + '"]');
            const listaUsuarios = obtenerUsuarios();
            const indice = listaUsuarios.findIndex(u => u.correo === correo);
            if (indice === -1) return;
            listaUsuarios[indice].tipo = select.value;
            guardarUsuarios(listaUsuarios);
            alert("Tipo de usuario actualizado.");
            renderizarTablaUsuarios();
        });
    });
}
document.addEventListener("DOMContentLoaded", renderizarTablaUsuarios);