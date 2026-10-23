import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { CarritoProvider } from '../context/CarritoContext'

const mostrar = () => render(
  <MemoryRouter>
    <CarritoProvider>
      <Home />
    </CarritoProvider>
  </MemoryRouter>
)

describe('Página Home', () => {
  it('muestra el título principal, el código FELICES50 y los accesos del hero', () => {
    mostrar()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("50 años endulzando la vida de nuestros clientes")
    expect(screen.getByText(/FELICES50/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/productos")
    expect(screen.getByRole("link", { name: "Sobre nosotros" })).toHaveAttribute("href", "/nosotros")
  })

  it('muestra las 8 categorías y 4 productos destacados', () => {
    mostrar()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(12)
    expect(screen.getByRole("link", { name: /Tortas Especiales/ })).toHaveAttribute("href", "/categorias/Tortas%20Especiales")
  })

  it('agrega un destacado al carrito al hacer clic en Añadir', async () => {
    mostrar()
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir" })[0])
    expect(JSON.parse(localStorage.getItem("mil_sabores_carrito"))).toEqual([{ codigo: "TC001", cantidad: 1 }])
  })
})
