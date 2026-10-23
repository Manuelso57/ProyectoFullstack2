import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAdmin, iniciarSesionComo, crearCliente, crearOrdenDePrueba } from '../testUtils'

describe('Acceso al panel de administración', () => {
  it('manda a login a quien no ha iniciado sesión', () => {
    renderAdmin("/admin")
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument()
  })

  it('manda al inicio a un cliente', () => {
    iniciarSesionComo(crearCliente())
    renderAdmin("/admin")
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument()
  })

  it('muestra el dashboard y todo el menú al administrador', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin")
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument()
    const menu = screen.getByRole("navigation", { name: "Menú de administración" })
    ;["Órdenes", "Productos", "Categorías", "Usuarios", "Reportes", "Perfil"].forEach((texto) => {
      expect(within(menu).getByRole("link", { name: texto })).toBeInTheDocument()
    })
  })

  it('cierra la sesión y pide iniciar sesión de nuevo', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin")
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument()
    expect(localStorage.getItem("mil_sabores_sesion")).toBeNull()
  })

  it('el dashboard cuenta las compras pagadas', () => {
    crearOrdenDePrueba()
    crearOrdenDePrueba({ estado: "Pago rechazado" })
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin")
    expect(screen.getByText("Compras").parentElement).toHaveTextContent("1")
  })
})

describe('Órdenes y boletas', () => {
  it('avisa cuando no hay órdenes', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/ordenes")
    expect(screen.getByRole("alert")).toHaveTextContent("Todavía no hay órdenes registradas.")
  })

  it('lista las órdenes y abre la boleta', async () => {
    const orden = crearOrdenDePrueba()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/ordenes")
    expect(screen.getByText("#" + orden.numero)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("link", { name: "Ver boleta" }))
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Boleta #" + orden.numero)
    expect(screen.getByDisplayValue("Pedro")).toBeInTheDocument()
  })
})
