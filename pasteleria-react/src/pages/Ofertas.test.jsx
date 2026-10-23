import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Ofertas from './Ofertas'
import { CarritoProvider } from '../context/CarritoContext'
import { actualizarProducto } from '../data/datos'

const mostrar = () => render(
  <MemoryRouter>
    <CarritoProvider>
      <Ofertas />
    </CarritoProvider>
  </MemoryRouter>
)

describe('Página Ofertas', () => {
  it('muestra solo las tortas de chocolate en oferta', () => {
    mostrar()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
    expect(screen.getByText("Torta Cuadrada de Chocolate")).toBeInTheDocument()
    expect(screen.getByText("Torta Vegana de Chocolate")).toBeInTheDocument()
    expect(screen.queryByText("Mousse de Chocolate")).not.toBeInTheDocument()
  })

  it('muestra el precio con descuento de cada oferta', () => {
    mostrar()
    expect(screen.getByText("$36.000")).toBeInTheDocument()
    expect(screen.getByText("$40.000")).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no queda ningún producto en oferta', () => {
    actualizarProducto("TC001", { descuentoOferta: 0 })
    actualizarProducto("PV001", { descuentoOferta: 0 })
    mostrar()
    expect(screen.getByRole("alert")).toHaveTextContent("No hay productos en oferta por ahora.")
  })
})
