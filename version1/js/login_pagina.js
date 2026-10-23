configurarFormulario("form-login", {
    correo: { requerido: true, max: 100, correo: true },
    password: { requerido: true, min: 4, max: 10 }
}, (formulario) => {
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const mensaje = formulario.querySelector(".mensaje-formulario");
    const usuario = obtenerUsuarios().find(u => u.correo === correo && u.password === password);
    if (!usuario) {
        mensaje.textContent = "Correo o contraseña incorrectos.";
        mensaje.className = "mensaje-formulario mensaje-formulario--error";
        return;
    }
    iniciarSesion(usuario.correo);
    setTimeout(() => {
        window.location.href = usuario.tipo === "Administrador" ? "admin/index.html" : "index.html";
    }, 800);
});