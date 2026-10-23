import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { CarritoProvider } from './context/CarritoContext'
import { SesionProvider } from './context/SesionContext'

const mostrar = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <SesionProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </SesionProvider>
  </MemoryRouter>
)

describe('App (rutas)', () => {
  it('muestra el inicio de la tienda con su menú', () => {
    mostrar("/")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("50 años endulzando")
    expect(within(screen.getByRole("banner")).getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument()
  })

  it('muestra el catálogo en /productos', () => {
    mostrar("/productos")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nuestros productos")
  })

  it('muestra una página en construcción para rutas desconocidas', () => {
    mostrar("/no-existe")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Página en construcción")
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/")
  })

  it('manda al login a quien intenta entrar al panel sin sesión', () => {
    mostrar("/admin")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Inicio de sesión")
  })

  it('abre el panel de administración cuando hay un administrador', () => {
    localStorage.setItem("mil_sabores_sesion", "admin@duoc.cl")
    mostrar("/admin")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard")
  })
})
