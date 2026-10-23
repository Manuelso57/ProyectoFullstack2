import { describe, it, expect } from 'vitest'
import { calcularReportes, obtenerProductosCriticos, productoCritico } from './reportes'

const productos = [
  { codigo: "A1", categoria: "Tortas", stock: 2, stockCritico: 5 },
  { codigo: "B1", categoria: "Postres", stock: 10, stockCritico: 5 },
  { codigo: "C1", categoria: "Postres", stock: 0, stockCritico: null }
]

const ordenes = [
  { estado: "Pagada", total: 9000, items: [{ codigo: "A1", nombre: "Torta", precio: 4000, cantidad: 2 }, { codigo: "B1", nombre: "Mousse", precio: 1000, cantidad: 1 }] },
  { estado: "Pagada", total: 1000, items: [{ codigo: "B1", nombre: "Mousse", precio: 1000, cantidad: 1 }] },
  { estado: "Pago rechazado", total: 5000, items: [{ codigo: "A1", nombre: "Torta", precio: 4000, cantidad: 1 }] }
]

describe('reportes', () => {
  it('considera crítico un stock igual o inferior al stock crítico', () => {
    expect(productoCritico({ stock: 5, stockCritico: 5 })).toBe(true)
    expect(productoCritico({ stock: 6, stockCritico: 5 })).toBe(false)
    expect(productoCritico({ stock: 0, stockCritico: null })).toBe(false)
    expect(obtenerProductosCriticos(productos)).toHaveLength(1)
  })

  it('suma solo las órdenes pagadas', () => {
    const reporte = calcularReportes(ordenes, productos, [])
    expect(reporte.totalVentas).toBe(10000)
    expect(reporte.ordenesPagadas).toBe(2)
    expect(reporte.ordenesRechazadas).toBe(1)
    expect(reporte.ticketPromedio).toBe(5000)
  })

  it('ordena los productos por unidades (desempata por monto) y agrupa por categoría', () => {
    const reporte = calcularReportes(ordenes, productos, [])
    expect(reporte.masVendidos[0]).toMatchObject({ codigo: "A1", unidades: 2, monto: 8000 })
    expect(reporte.masVendidos[1]).toMatchObject({ codigo: "B1", unidades: 2, monto: 2000 })
    expect(reporte.ventasPorCategoria[0]).toEqual({ categoria: "Tortas", monto: 8000 })
  })

  it('cuenta usuarios por tipo y evita dividir por cero sin ventas', () => {
    const reporte = calcularReportes([], productos, [{ tipo: "Cliente" }, { tipo: "Cliente" }, { tipo: "Administrador" }])
    expect(reporte.usuariosPorTipo).toEqual({ Cliente: 2, Administrador: 1 })
    expect(reporte.ticketPromedio).toBe(0)
  })
})
