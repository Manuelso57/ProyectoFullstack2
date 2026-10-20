function obtenerUsuarios() {
    const datos = localStorage.getItem("usuarios_mil_sabores");
    return datos ? JSON.parse(datos) : [];
}
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios_mil_sabores", JSON.stringify(usuarios));
}
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento + "T00:00:00");
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
}
function esCorreoDuoc(correo) {
    return /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(correo.trim());
}
function esCumpleanosHoy(fechaNacimiento) {
    if (!fechaNacimiento) return false;
    const nacimiento = new Date(fechaNacimiento + "T00:00:00");
    const hoy = new Date();
    return nacimiento.getDate() === hoy.getDate() && nacimiento.getMonth() === hoy.getMonth();
}
function iniciarSesion(correo) {
    localStorage.setItem("sesion_mil_sabores", correo);
}
function cerrarSesion() {
    localStorage.removeItem("sesion_mil_sabores");
}
function obtenerUsuarioActual() {
    const correo = localStorage.getItem("sesion_mil_sabores");
    if (!correo) return null;
    return obtenerUsuarios().find(u => u.correo === correo) || null;
}
function obtenerDescuentoUsuario(usuario) {
    if (!usuario) return { porcentaje: 0, motivo: "" };
    const edad = calcularEdad(usuario.fechaNacimiento);
    if (edad !== null && edad >= 50) {
        return { porcentaje: 50, motivo: "Descuento por ser mayor de 50 años" };
    }
    if (usuario.codigoFelices50) {
        return { porcentaje: 10, motivo: "Código FELICES50 (10% de por vida)" };
    }
    return { porcentaje: 0, motivo: "" };
}
function yaReclamoTortaGratis(usuario) {
    if (!usuario) return false;
    return usuario.tortaGratisAnio === new Date().getFullYear();
}
function marcarTortaGratisReclamada(correo) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.correo === correo);
    if (indice === -1) return;
    usuarios[indice].tortaGratisAnio = new Date().getFullYear();
    guardarUsuarios(usuarios);
}
(function asegurarAdministradorDemo() {
    const usuarios = obtenerUsuarios();
    if (!usuarios.some(u => u.tipo === "Administrador")) {
        usuarios.push({
            nombre: "Admin",
            apellidos: "Sistema",
            run: "111111111",
            correo: "admin@duoc.cl",
            password: "admin123",
            fechaNacimiento: "",
            telefono: "",
            region: "Región Metropolitana de Santiago",
            comuna: "Santiago",
            direccion: "Casa Matriz",
            tipo: "Administrador",
            codigoFelices50: false
        });
        guardarUsuarios(usuarios);
    }
})();