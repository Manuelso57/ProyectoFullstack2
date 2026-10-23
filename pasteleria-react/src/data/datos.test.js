import { describe, it, expect } from 'vitest'
import { obtenerProductos, obtenerProductoPorCodigo, obtenerCategorias, crearProducto, actualizarProducto, eliminarProducto } from './datos'

const nuevo = { codigo: "TX001", categoria: "Tortas Especiales", nombre: "Torta de Prueba", precio: 1000, stock: 5, stockCritico: 1, imagen: "/imagenes/logo.png", descripcion: "Prueba" }

describe('datos: CRUD de productos', () => {
  it('lee los 16 productos iniciales', () => {
    expect(obtenerProductos()).toHaveLength(16)
  })

  it('encuentra un producto por código y devuelve null si no existe', () => {
    expect(obtenerProductoPorCodigo("TC001").nombre).toBe("Torta Cuadrada de Chocolate")
    expect(obtenerProductoPorCodigo("NOEXISTE")).toBeNull()
  })

  it('obtiene las 8 categorías sin repetir', () => {
    expect(obtenerCategorias()).toHaveLength(8)
  })

  it('crea un producto y lo persiste', () => {
    const resultado = crearProducto(nuevo)
    expect(resultado.ok).toBe(true)
    expect(obtenerProductos()).toHaveLength(17)
  })

  it('no permite crear un producto con código repetido', () => {
    crearProducto(nuevo)
    const resultado = crearProducto(nuevo)
    expect(resultado.ok).toBe(false)
    expect(obtenerProductos()).toHaveLength(17)
  })

  it('actualiza un producto sin cambiar su código', () => {
    const resultado = actualizarProducto("TC001", { precio: 99999, codigo: "OTRO" })
    expect(resultado.ok).toBe(true)
    expect(obtenerProductoPorCodigo("TC001").precio).toBe(99999)
    expect(obtenerProductoPorCodigo("OTRO")).toBeNull()
  })

  it('elimina un producto y avisa si no existe', () => {
    expect(eliminarProducto("TC001").ok).toBe(true)
    expect(obtenerProductos()).toHaveLength(15)
    expect(eliminarProducto("TC001").ok).toBe(false)
  })
})
