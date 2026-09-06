configurarFormulario("form-registro", {
    nombre: { requerido: true, max: 50 },
    apellidos: { requerido: true, max: 100 },
    run: { requerido: true, min: 7, max: 9, run: true },
    correo: { requerido: true, max: 100, correo: true },
    password: { requerido: true, min: 4, max: 10 },
    "confirmar-password": {
        requerido: true,
        personalizada: (valor) => valor === document.getElementById("password").value ? true : "Las contraseñas no coinciden."
    },
    "fecha-nacimiento": { requerido: false, fechaNoFutura: true },
    telefono: { requerido: false, max: 15 },
    region: { requerido: true, max: 100 },
    comuna: { requerido: true, max: 100 },
    direccion: { requerido: true, max: 300 }
}, (formulario) => {
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const run = document.getElementById("run").value.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
    const usuarios = obtenerUsuarios();
    const mensaje = formulario.querySelector(".mensaje-formulario");
    if (usuarios.some(u => u.correo === correo)) {
        mensaje.textContent = "Ya existe una cuenta registrada con ese correo.";
        mensaje.className = "mensaje-formulario mensaje-formulario--error";
        return;
    }
    if (usuarios.some(u => u.run === run)) {
        mensaje.textContent = "Ya existe una cuenta registrada con ese RUN.";
        mensaje.className = "mensaje-formulario mensaje-formulario--error";
        return;
    }
    const codigoDescuento = document.getElementById("codigo-descuento").value.trim().toUpperCase();
    const usuario = {
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        run: run,
        correo: correo,
        password: document.getElementById("password").value,
        fechaNacimiento: document.getElementById("fecha-nacimiento").value,
        telefono: document.getElementById("telefono").value.trim(),
        region: document.getElementById("region").value.trim(),
        comuna: document.getElementById("comuna").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        tipo: "Cliente",
        codigoFelices50: codigoDescuento === "FELICES50"
    };
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    iniciarSesion(usuario.correo);
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
});