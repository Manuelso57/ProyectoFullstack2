const CORREOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

export const esRequerido = (valor) => valor !== null && valor !== undefined && String(valor).trim().length > 0

export const validarCorreo = (correo) => CORREOS_PERMITIDOS.test(String(correo).trim())

export const validarRun = (run) => {
  const limpio = String(run).replace(/\./g, "").replace(/-/g, "").trim().toUpperCase()
  if (!/^[0-9]+[0-9K]$/.test(limpio)) return false
  const cuerpo = limpio.slice(0, -1)
  const digito = limpio.slice(-1)
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto)
  return digito === esperado
}

export const validarCampo = (valor, reglas = {}, valores = {}) => {
  const texto = valor === null || valor === undefined ? "" : String(valor)
  if (reglas.requerido && !esRequerido(texto)) return reglas.mensajeRequerido || "Este campo es obligatorio."
  if (!esRequerido(texto)) return ""
  if (reglas.min !== undefined && texto.trim().length < reglas.min) return "Debe tener al menos " + reglas.min + " caracteres."
  if (reglas.max !== undefined && texto.trim().length > reglas.max) return "Debe tener máximo " + reglas.max + " caracteres."
  if ((reglas.numerico || reglas.entero) && isNaN(Number(texto))) return "Debe ser un número."
  if (reglas.entero && !/^-?\d+$/.test(texto.trim())) return "Debe ser un número entero."
  if (reglas.minValor !== undefined && Number(texto) < reglas.minValor) return "Debe ser mayor o igual a " + reglas.minValor + "."
  if (reglas.maxValor !== undefined && Number(texto) > reglas.maxValor) return "Debe ser menor o igual a " + reglas.maxValor + "."
  if (reglas.correo && !validarCorreo(texto)) return "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
  if (reglas.run && !validarRun(texto)) return "RUN inválido. Verifica el dígito verificador."
  if (reglas.fechaNoFutura && new Date(texto + "T00:00:00") > new Date()) return "La fecha no puede ser futura."
  if (reglas.coincideCon && texto !== (valores[reglas.coincideCon] ?? "")) return reglas.mensajeCoincide || "Las contraseñas no coinciden."
  return ""
}
