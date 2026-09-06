configurarFormulario("form-login", {
    correo: { requerido: true, max: 100, correo: true },
    password: { requerido: true, min: 4, max: 10 }
}, (formulario) => {
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});