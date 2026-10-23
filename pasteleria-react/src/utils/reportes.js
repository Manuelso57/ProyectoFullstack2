export const productoCritico = (producto) =>
  producto.stockCritico !== null && producto.stockCritico !== undefined && producto.stock <= producto.stockCritico

export const obtenerProductosCriticos = (productos) => productos.filter(productoCritico)

export const calcularReportes = (ordenes, productos, usuarios) => {
  const pagadas = ordenes.filter((orden) => orden.estado === "Pagada")
  const totalVentas = pagadas.reduce((suma, orden) => suma + orden.total, 0)
  const acumulado = {}
  pagadas.forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = acumulado[item.codigo] || { codigo: item.codigo, nombre: item.nombre, unidades: 0, monto: 0 }
      actual.unidades += item.cantidad
      actual.monto += item.precio * item.cantidad
      acumulado[item.codigo] = actual
    })
  })
  const masVendidos = Object.values(acumulado).sort((a, b) => b.unidades - a.unidades || b.monto - a.monto)
  const porCategoria = {}
  masVendidos.forEach((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo)
    const categoria = producto ? producto.categoria : "Sin categoría"
    porCategoria[categoria] = (porCategoria[categoria] || 0) + item.monto
  })
  const ventasPorCategoria = Object.entries(porCategoria).map(([categoria, monto]) => ({ categoria, monto })).sort((a, b) => b.monto - a.monto)
  const usuariosPorTipo = {}
  usuarios.forEach((usuario) => {
    usuariosPorTipo[usuario.tipo] = (usuariosPorTipo[usuario.tipo] || 0) + 1
  })
  return {
    totalVentas,
    ordenesPagadas: pagadas.length,
    ordenesRechazadas: ordenes.length - pagadas.length,
    ticketPromedio: pagadas.length ? Math.round(totalVentas / pagadas.length) : 0,
    masVendidos,
    ventasPorCategoria,
    usuariosPorTipo,
    productosCriticos: obtenerProductosCriticos(productos).length
  }
}
