import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import Footer from './Footer'
import { CarritoProvider } from '../context/CarritoContext'
import { SesionProvider } from '../context/SesionContext'
import { crearCliente } from '../testUtils'

const mostrarMenu = () => render(
  <MemoryRouter>
    <SesionProvider>
      <CarritoProvider>
        <Menu />
        <Routes>
          <Route path="/" element={<p>Pantalla de inicio</p>} />
        </Routes>
      </CarritoProvider>
    </SesionProvider>
  </MemoryRouter>
)

const mostrarFooter = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <Footer />
  </MemoryRouter>
)

describe('Menu', () => {
  it('muestra los accesos de un visitante', () => {
    mostrarMenu()
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute("href", "/login")
    expect(screen.getByRole("link", { name: "Registrarse" })).toHaveAttribute("href", "/registro")
    expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument()
  })

  it('muestra la cantidad de productos del carrito', () => {
    localStorage.setItem("mil_sabores_carrito", JSON.stringify([{ codigo: "TC001", cantidad: 2 }, { codigo: "PI001", cantidad: 1 }]))
    mostrarMenu()
    expect(screen.getByRole("link", { name: "Carrito (3)" })).toBeInTheDocument()
  })

  it('despliega las categorías', async () => {
    mostrarMenu()
    await userEvent.click(screen.getByText("Categorías"))
    expect(screen.getByRole("link", { name: "Todas las categorías" })).toHaveAttribute("href", "/categorias")
    expect(screen.getByRole("link", { name: "Tortas Cuadradas" })).toHaveAttribute("href", "/categorias/Tortas%20Cuadradas")
  })

  it('saluda al cliente con sesión y no le muestra el panel de administración', () => {
    localStorage.setItem("mil_sabores_sesion", crearCliente())
    mostrarMenu()
    expect(screen.getByText("Hola, Cris")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Administración" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Iniciar sesión" })).not.toBeInTheDocument()
  })

  it('muestra el enlace de administración al administrador', () => {
    localStorage.setItem("mil_sabores_sesion", "admin@duoc.cl")
    mostrarMenu()
    expect(screen.getByRole("link", { name: "Administración" })).toHaveAttribute("href", "/admin")
  })

  it('cierra la sesión y vuelve al inicio', async () => {
    localStorage.setItem("mil_sabores_sesion", crearCliente())
    mostrarMenu()
    await userEvent.click(screen.getByText("Cerrar sesión"))
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument()
    expect(localStorage.getItem("mil_sabores_sesion")).toBeNull()
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('muestra las tres columnas en el inicio', () => {
    mostrarFooter("/")
    expect(screen.getByRole("heading", { name: "Explorar" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Cuenta" })).toBeInTheDocument()
  })

  it('muestra solo el nombre de la tienda en las demás páginas', () => {
    mostrarFooter("/productos")
    expect(screen.getByText("Pastelería Mil Sabores")).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Explorar" })).not.toBeInTheDocument()
  })
})
