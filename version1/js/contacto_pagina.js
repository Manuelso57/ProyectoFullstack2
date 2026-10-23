configurarFormulario("form-contacto", {
    nombre: { requerido: true, max: 100 },
    correo: { requerido: false, max: 100, correo: true },
    mensaje: { requerido: true, max: 500 }
}, (formulario) => {
    setTimeout(() => formulario.reset(), 1200);
});