export const formatearPrecio = (valor) => "$" + Number(valor).toLocaleString("es-CL")

export const normalizarTexto = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

export const estaEnOferta = (producto) => (Number(producto.descuentoOferta) || 0) > 0

export const precioFinal = (producto) => {
  const descuento = Number(producto.descuentoOferta) || 0
  return descuento > 0 ? Math.round((producto.precio * (100 - descuento)) / 100) : producto.precio
}
