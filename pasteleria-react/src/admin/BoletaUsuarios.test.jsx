import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAdmin, iniciarSesionComo, crearCliente, crearOrdenDePrueba } from '../testUtils'
import { obtenerUsuarioPorCorreo } from '../data/datos'

describe('Admin: boleta', () => {
  it('avisa si la boleta no existe', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/ordenes/000")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Boleta no encontrada")
  })

  it('imprime la boleta', async () => {
    const imprimir = vi.spyOn(window, "print").mockImplementation(() => {})
    const orden = crearOrdenDePrueba()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/ordenes/" + orden.numero)
    await userEvent.click(screen.getByRole("button", { name: "Imprimir boleta en PDF" }))
    expect(imprimir).toHaveBeenCalledTimes(1)
  })
})

describe('Admin: eliminar usuarios y casos de error', () => {
  it('elimina a otro usuario después de confirmar', async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    crearCliente()
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios")
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1])
    expect(obtenerUsuarioPorCorreo("cli@gmail.com")).toBeNull()
    expect(screen.getAllByRole("row")).toHaveLength(2)
  })

  it('avisa si el usuario a editar no existe', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/nadie%40gmail.com/editar")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Usuario no encontrado")
  })

  it('avisa si el historial es de un usuario que no existe', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/usuarios/nadie%40gmail.com/historial")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Usuario no encontrado")
  })

  it('avisa si la categoría a editar no existe', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/categorias/Inexistente/editar")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Categoría no encontrada")
  })

  it('no guarda un perfil con datos inválidos', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/perfil")
    await userEvent.clear(screen.getByLabelText("Nombre"))
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))
    expect(screen.getByRole("status")).toHaveTextContent("Revisa los campos marcados en rojo")
  })
})
