import { describe, it, expect } from 'vitest'
import { formatearPrecio, normalizarTexto, estaEnOferta, precioFinal } from './formato'

describe('formato', () => {
  it('formatea precios en pesos chilenos', () => {
    expect(formatearPrecio(45000)).toBe("$45.000")
  })

  it('normaliza texto quitando tildes y mayúsculas', () => {
    expect(normalizarTexto("  Tiramisú Clásico ")).toBe("tiramisu clasico")
  })

  it('detecta si un producto está en oferta', () => {
    expect(estaEnOferta({ precio: 1000, descuentoOferta: 20 })).toBe(true)
    expect(estaEnOferta({ precio: 1000, descuentoOferta: 0 })).toBe(false)
    expect(estaEnOferta({ precio: 1000 })).toBe(false)
  })

  it('calcula el precio final aplicando el descuento de oferta', () => {
    expect(precioFinal({ precio: 45000, descuentoOferta: 20 })).toBe(36000)
    expect(precioFinal({ precio: 45000 })).toBe(45000)
  })
})
