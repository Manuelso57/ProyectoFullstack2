const usuarioAdmin = obtenerUsuarioActual();
if (!usuarioAdmin || usuarioAdmin.tipo !== "Administrador") {
    window.location.href = "../login.html";
}