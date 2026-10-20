document.getElementById("cerrar_sesion").addEventListener("click", (evento) => {
    evento.preventDefault();
    cerrarSesion();
    window.location.href = "../login.html";
});
document.getElementById("conteo_productos").textContent = productos.length;
document.getElementById("conteo_usuarios").textContent = obtenerUsuarios().length;