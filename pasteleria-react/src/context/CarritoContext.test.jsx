import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from './CarritoContext'

const envoltorio = ({ children }) => <CarritoProvider>{children}</CarritoProvider>

describe('CarritoContext', () => {
  it('agrega productos y suma cantidades del mismo código', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    act(() => result.current.agregar("TC001", 1))
    act(() => result.current.agregar("TC001", 2))
    expect(result.current.items).toEqual([{ codigo: "TC001", cantidad: 3 }])
    expect(result.current.totalItems).toBe(3)
  })

  it('calcula el subtotal con los precios finales (considera las ofertas)', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    act(() => result.current.agregar("TC001", 2))
    act(() => result.current.agregar("PI001", 1))
    expect(result.current.subtotal).toBe(36000 * 2 + 5000)
  })

  it('quita un producto si la cantidad baja de 1', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    act(() => result.current.agregar("TC001", 1))
    act(() => result.current.cambiarCantidad("TC001", 0))
    expect(result.current.items).toHaveLength(0)
  })

  it('guarda el carrito en localStorage', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper: envoltorio })
    act(() => result.current.agregar("PT001", 4))
    expect(JSON.parse(localStorage.getItem("mil_sabores_carrito"))).toEqual([{ codigo: "PT001", cantidad: 4 }])
  })
})
