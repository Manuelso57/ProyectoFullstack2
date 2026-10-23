import { describe, it, expect } from 'vitest'
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria, obtenerProductoPorCodigo } from './datos'

describe('datos: categorías', () => {
  it('parte con las 8 categorías del caso', () => {
    expect(obtenerCategorias()).toHaveLength(8)
  })

  it('crea una categoría nueva y rechaza duplicados sin distinguir mayúsculas', () => {
    expect(crearCategoria("Bebidas").ok).toBe(true)
    expect(obtenerCategorias()).toHaveLength(9)
    expect(crearCategoria("bebidas").ok).toBe(false)
    expect(crearCategoria("   ").ok).toBe(false)
  })

  it('renombra una categoría y actualiza los productos que la usan', () => {
    expect(actualizarCategoria("Tortas Circulares", "Tortas Redondas").ok).toBe(true)
    expect(obtenerCategorias()).toContain("Tortas Redondas")
    expect(obtenerProductoPorCodigo("TT001").categoria).toBe("Tortas Redondas")
  })

  it('no elimina una categoría con productos, pero sí una vacía', () => {
    expect(eliminarCategoria("Tortas Circulares").ok).toBe(false)
    crearCategoria("Bebidas")
    expect(eliminarCategoria("Bebidas").ok).toBe(true)
    expect(obtenerCategorias()).not.toContain("Bebidas")
  })
})
