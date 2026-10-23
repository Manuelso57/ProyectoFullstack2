import { precioFinal } from "./formato"

export const CODIGO_TORTA_CUMPLEANOS = "TE001"

const aFecha = (texto) => new Date(texto + "T00:00:00")

export const calcularEdad = (fechaNacimiento, hoy = new Date()) => {
  if (!fechaNacimiento) return null
  const nacimiento = aFecha(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const meses = hoy.getMonth() - nacimiento.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) edad--
  return edad
}

export const esCorreoDuoc = (correo) => /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(String(correo).trim())

export const esCumpleanosHoy = (fechaNacimiento, hoy = new Date()) => {
  if (!fechaNacimiento) return false
  const nacimiento = aFecha(fechaNacimiento)
  return nacimiento.getDate() === hoy.getDate() && nacimiento.getMonth() === hoy.getMonth()
}

export const yaReclamoTortaGratis = (usuario, hoy = new Date()) => Boolean(usuario) && usuario.tortaGratisAnio === hoy.getFullYear()

export const obtenerDescuentoUsuario = (usuario, hoy = new Date()) => {
  if (!usuario) return { porcentaje: 0, motivo: "" }
  const edad = calcularEdad(usuario.fechaNacimiento, hoy)
  if (edad !== null && edad >= 50) return { porcentaje: 50, motivo: "Mayor de 50 años" }
  if (usuario.codigoFelices50) return { porcentaje: 10, motivo: "Código FELICES50" }
  return { porcentaje: 0, motivo: "" }
}

export const calcularResumen = (lineas, usuario, hoy = new Date()) => {
  const subtotal = lineas.reduce((suma, linea) => suma + precioFinal(linea.producto) * linea.cantidad, 0)
  const lineaTorta = lineas.find((linea) => linea.producto.codigo === CODIGO_TORTA_CUMPLEANOS)
  const elegible = Boolean(usuario) && esCorreoDuoc(usuario.correo) && esCumpleanosHoy(usuario.fechaNacimiento, hoy) && !yaReclamoTortaGratis(usuario, hoy)
  const montoTorta = elegible && lineaTorta ? precioFinal(lineaTorta.producto) : 0
  const base = obtenerDescuentoUsuario(usuario, hoy)
  const montoDescuento = Math.round(((subtotal - montoTorta) * base.porcentaje) / 100)
  return {
    subtotal,
    descuento: { porcentaje: base.porcentaje, motivo: base.motivo, monto: montoDescuento },
    tortaGratis: { elegible, enCarrito: Boolean(lineaTorta), monto: montoTorta },
    total: subtotal - montoTorta - montoDescuento
  }
}
