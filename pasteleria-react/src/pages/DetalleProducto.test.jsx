import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DetalleProducto from './DetalleProducto'
import { CarritoProvider } from '../context/CarritoContext'
import { actualizarProducto } from '../data/datos'

const mostrar = (codigo) => render(
  <MemoryRouter initialEntries={["/productos/" + codigo]}>
    <CarritoProvider>
      <Routes>
        <Route path="/productos/:codigo" element={<DetalleProducto />} />
      </Routes>
    </CarritoProvider>
  </MemoryRouter>
)

describe('Página DetalleProducto', () => {
  it('muestra los datos del producto pedido', () => {
    mostrar("PI001")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Mousse de Chocolate")
    expect(screen.getByText("$5.000")).toBeInTheDocument()
    expect(screen.getByText("Stock disponible: 30")).toBeInTheDocument()
  })

  it('muestra el precio tachado y la insignia si el producto está en oferta', () => {
    mostrar("TC001")
    expect(screen.getByText("$45.000")).toHaveClass("precio-original")
    expect(screen.getByText("$36.000")).toBeInTheDocument()
    expect(screen.getByText("-20%")).toBeInTheDocument()
  })

  it('cambia la cantidad con los botones − y + y no baja de 1', async () => {
    mostrar("PI001")
    const cantidad = screen.getByLabelText("Cantidad")
    await userEvent.click(screen.getByRole("button", { name: "Sumar cantidad" }))
    await userEvent.click(screen.getByRole("button", { name: "Sumar cantidad" }))
    expect(cantidad).toHaveValue(3)
    await userEvent.click(screen.getByRole("button", { name: "Restar cantidad" }))
    expect(cantidad).toHaveValue(2)
    await userEvent.click(screen.getByRole("button", { name: "Restar cantidad" }))
    await userEvent.click(screen.getByRole("button", { name: "Restar cantidad" }))
    expect(cantidad).toHaveValue(1)
  })

  it('acepta una cantidad escrita a mano y la agrega al carrito', async () => {
    mostrar("PI001")
    const cantidad = screen.getByLabelText("Cantidad")
    await userEvent.tripleClick(cantidad)
    await userEvent.keyboard("4")
    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }))
    expect(screen.getByRole("button", { name: "Añadido al carrito" })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem("mil_sabores_carrito"))).toEqual([{ codigo: "PI001", cantidad: 4 }])
  })

  it('deshabilita el botón cuando no hay stock', () => {
    actualizarProducto("PI001", { stock: 0 })
    mostrar("PI001")
    expect(screen.getByRole("button", { name: "Añadir al carrito" })).toBeDisabled()
  })

  it('avisa cuando el producto no existe', () => {
    mostrar("NOEXISTE")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Producto no encontrado")
  })
})
