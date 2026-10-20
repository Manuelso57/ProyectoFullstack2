document.getElementById("cerrar_sesion").addEventListener("click", (evento) => {
    evento.preventDefault();
    cerrarSesion();
    window.location.href = "../login.html";
});