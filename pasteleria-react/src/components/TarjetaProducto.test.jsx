import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TarjetaProducto from './TarjetaProducto'

const producto = { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: 45000, stock: 20, imagen: "/imagenes/torta_chocolate.png" }

const mostrar = (props) => render(<MemoryRouter><TarjetaProducto producto={producto} onAgregar={() => {}} {...props} /></MemoryRouter>)

describe('TarjetaProducto', () => {
  it('muestra nombre, categoría y precio recibidos por props', () => {
    mostrar()
    expect(screen.getByText("Torta Cuadrada de Chocolate")).toBeInTheDocument()
    expect(screen.getByText("Tortas Cuadradas")).toBeInTheDocument()
    expect(screen.getByText("$45.000")).toBeInTheDocument()
  })

  it('enlaza al detalle del producto con su código', () => {
    mostrar()
    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute("href", "/productos/TC001")
  })

  it('llama a onAgregar con el código al hacer clic en Añadir', async () => {
    const onAgregar = vi.fn()
    mostrar({ onAgregar })
    await userEvent.click(screen.getByRole("button", { name: "Añadir" }))
    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar).toHaveBeenCalledWith("TC001")
  })

  it('deshabilita el botón y muestra Sin stock cuando no hay stock', () => {
    mostrar({ producto: { ...producto, stock: 0 } })
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled()
  })

  it('muestra el precio original tachado, el precio final y la insignia cuando está en oferta', () => {
    mostrar({ producto: { ...producto, descuentoOferta: 20 } })
    expect(screen.getByText("$45.000")).toHaveClass("precio-original")
    expect(screen.getByText("$36.000")).toBeInTheDocument()
    expect(screen.getByText("-20%")).toBeInTheDocument()
  })

  it('no muestra insignia ni precio tachado cuando no está en oferta', () => {
    mostrar()
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument()
    expect(document.querySelector(".precio-original")).toBeNull()
  })
})
