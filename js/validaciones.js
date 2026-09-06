const CORREOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
function mostrarError(input, mensaje) {
    const campo = input.closest(".campo");
    if (!campo) return;
    campo.classList.add("campo--invalido");
    const error = campo.querySelector(".error-mensaje");
    if (error) error.textContent = mensaje;
}
function limpiarError(input) {
    const campo = input.closest(".campo");
    if (!campo) return;
    campo.classList.remove("campo--invalido");
    const error = campo.querySelector(".error-mensaje");
    if (error) error.textContent = "";
}
function esRequerido(valor) {
    return valor !== null && valor.toString().trim().length > 0;
}
function validarRun(run) {
    const limpio = run.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : resto.toString();
    return dv === dvEsperado;
}
function validarCampo(input, reglas) {
    const valor = input.value;
    if (reglas.requerido && !esRequerido(valor)) {
        mostrarError(input, reglas.mensajeRequerido || "Este campo es obligatorio.");
        return false;
    }
    if (!reglas.requerido && !esRequerido(valor)) {
        limpiarError(input);
        return true;
    }
    if (reglas.min !== undefined && valor.trim().length < reglas.min) {
        mostrarError(input, `Debe tener al menos ${reglas.min} caracteres.`);
        return false;
    }
    if (reglas.max !== undefined && valor.trim().length > reglas.max) {
        mostrarError(input, `Debe tener máximo ${reglas.max} caracteres.`);
        return false;
    }
    if (reglas.correo && !CORREOS_PERMITIDOS.test(valor.trim())) {
        mostrarError(input, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }
    if (reglas.fechaNoFutura) {
        const hoy = new Date();
        const fecha = new Date(valor + "T00:00:00");
        if (fecha > hoy) {
            mostrarError(input, "La fecha no puede ser futura.");
            return false;
        }
    }
    if (reglas.run && !validarRun(valor)) {
        mostrarError(input, "RUN inválido. Verifica el dígito verificador.");
        return false;
    }
    if (reglas.personalizada) {
        const resultado = reglas.personalizada(valor);
        if (resultado !== true) {
            mostrarError(input, resultado);
            return false;
        }
    }
    limpiarError(input);
    return true;
}
function configurarFormulario(formId, definicionCampos, alValidar) {
    const formulario = document.getElementById(formId);
    if (!formulario) return;
    Object.entries(definicionCampos).forEach(([id, reglas]) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener("input", () => validarCampo(input, reglas));
        input.addEventListener("blur", () => validarCampo(input, reglas));
        input.addEventListener("change", () => validarCampo(input, reglas));
    });
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        let todoValido = true;
        Object.entries(definicionCampos).forEach(([id, reglas]) => {
            const input = document.getElementById(id);
            if (!input) return;
            if (!validarCampo(input, reglas)) todoValido = false;
        });
        const mensaje = formulario.querySelector(".mensaje-formulario");
        if (todoValido) {
            if (mensaje) {
                mensaje.textContent = "¡Listo! Los datos se validaron correctamente.";
                mensaje.className = "mensaje-formulario mensaje-formulario--ok";
            }
            if (typeof alValidar === "function") alValidar(formulario);
        } else if (mensaje) {
            mensaje.textContent = "Revisa los campos marcados en rojo antes de continuar.";
            mensaje.className = "mensaje-formulario mensaje-formulario--error";
        }
    });
}