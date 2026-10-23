import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAdmin, iniciarSesionComo, crearCliente, crearOrdenDePrueba } from '../testUtils'
import { obtenerUsuarioPorCorreo, obtenerCategorias, obtenerProductoPorCodigo } from '../data/datos'

describe('Admin: categorías', () => {
  it('lista las 8 categorías con su cantidad de productos', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias")
    expect(screen.getAllByRole("row")).toHaveLength(9)
  })

  it('crea una categoría nueva', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias/nueva")
    await userEvent.type(screen.getByLabelText("Nombre"), "Bebidas")
    await userEvent.click(screen.getByRole("button", { name: "Guardar categoría" }))
    expect(await screen.findByText("Bebidas")).toBeInTheDocument()
    expect(obtenerCategorias()).toContain("Bebidas")
  })

  it('rechaza una categoría repetida', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias/nueva")
    await userEvent.type(screen.getByLabelText("Nombre"), "Tortas Cuadradas")
    await userEvent.click(screen.getByRole("button", { name: "Guardar categoría" }))
    expect(screen.getByRole("status")).toHaveTextContent("Ya existe una categoría con ese nombre.")
  })

  it('renombra una categoría y actualiza sus productos', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias/Tortas%20Circulares/editar")
    const campo = screen.getByLabelText("Nombre")
    await userEvent.clear(campo)
    await userEvent.type(campo, "Tortas Redondas")
    await userEvent.click(screen.getByRole("button", { name: "Guardar categoría" }))
    expect(await screen.findByText("Tortas Redondas")).toBeInTheDocument()
    expect(obtenerProductoPorCodigo("TT001").categoria).toBe("Tortas Redondas")
  })

  it('no deja eliminar una categoría con productos', async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias")
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0])
    expect(screen.getByRole("alert")).toHaveTextContent("No se puede eliminar una categoría que tiene productos.")
  })
})

describe('Admin: usuarios', () => {
  it('lista a los usuarios con su tipo', () => {
    crearCliente()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios")
    expect(screen.getAllByRole("row")).toHaveLength(3)
    expect(screen.getByText("cli@gmail.com")).toBeInTheDocument()
  })

  it('valida el RUN al crear un usuario', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/nuevo")
    await userEvent.type(screen.getByLabelText("RUN"), "123456784")
    expect(screen.getByText("RUN inválido. Verifica el dígito verificador.")).toBeInTheDocument()
  })

  it('crea un usuario administrador', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/nuevo")
    await userEvent.type(screen.getByLabelText("RUN"), "123456785")
    await userEvent.type(screen.getByLabelText("Nombre"), "Vera")
    await userEvent.type(screen.getByLabelText("Apellidos"), "Ventas")
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "vera@duoc.cl")
    await userEvent.type(screen.getByLabelText("Contraseña"), "abcd")
    await userEvent.selectOptions(screen.getByLabelText("Tipo de usuario"), "Administrador")
    await userEvent.type(screen.getByLabelText("Región"), "Metropolitana")
    await userEvent.type(screen.getByLabelText("Comuna"), "Santiago")
    await userEvent.type(screen.getByLabelText("Dirección"), "Calle 1")
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }))
    expect(await screen.findByRole("heading", { level: 1, name: "Usuarios" })).toBeInTheDocument()
    expect(obtenerUsuarioPorCorreo("vera@duoc.cl").tipo).toBe("Administrador")
  })

  it('cambia el tipo de un usuario al editarlo y bloquea el correo', async () => {
    crearCliente()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/cli%40gmail.com/editar")
    expect(screen.getByLabelText("Correo electrónico")).toBeDisabled()
    await userEvent.selectOptions(screen.getByLabelText("Tipo de usuario"), "Administrador")
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }))
    expect(await screen.findByRole("heading", { level: 1, name: "Usuarios" })).toBeInTheDocument()
    expect(obtenerUsuarioPorCorreo("cli@gmail.com").tipo).toBe("Administrador")
  })

  it('no permite eliminar la propia cuenta', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios")
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }))
    expect(screen.getByRole("alert")).toHaveTextContent("No puedes eliminar tu propia cuenta.")
  })

  it('muestra el historial de compras de un usuario', () => {
    crearCliente()
    crearOrdenDePrueba({ correoUsuario: "cli@gmail.com" })
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/cli%40gmail.com/historial")
    expect(screen.getByRole("heading", { level: 1, name: "Historial de compras" })).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(2)
  })

  it('avisa si el usuario no tiene compras', () => {
    crearCliente()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/cli%40gmail.com/historial")
    expect(screen.getByRole("alert")).toHaveTextContent("todavía no tiene compras")
  })
})

describe('Admin: reportes y perfil', () => {
  it('muestra los reportes con ventas', () => {
    crearOrdenDePrueba()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/reportes")
    expect(screen.getByText("Ventas totales").parentElement).toHaveTextContent("$72.000")
    expect(screen.getAllByText("Torta Cuadrada de Chocolate").length).toBeGreaterThanOrEqual(1)
  })

  it('avisa cuando aún no hay ventas', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/reportes")
    expect(screen.getByRole("alert")).toHaveTextContent("Aún no hay ventas para reportar.")
  })

  it('actualiza el perfil del administrador', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/perfil")
    const campo = screen.getByLabelText("Nombre")
    await userEvent.clear(campo)
    await userEvent.type(campo, "Administradora")
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))
    expect(screen.getByRole("status")).toHaveTextContent("Tu perfil se actualizó correctamente.")
    expect(obtenerUsuarioPorCorreo("admin@duoc.cl").nombre).toBe("Administradora")
  })
})
