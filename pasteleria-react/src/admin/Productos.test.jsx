import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAdmin, iniciarSesionComo } from '../testUtils'
import { actualizarProducto, obtenerProductoPorCodigo, obtenerProductos } from '../data/datos'

describe('Admin: productos', () => {
  it('lista los 16 productos', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos")
    expect(screen.getAllByRole("row")).toHaveLength(17)
  })

  it('marca con una alerta los productos en stock crítico', () => {
    actualizarProducto("TC001", { stock: 2 })
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos")
    expect(screen.getAllByText("Stock crítico")).toHaveLength(1)
  })

  it('elimina un producto después de confirmar', async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos")
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0])
    expect(screen.getAllByRole("row")).toHaveLength(16)
    expect(obtenerProductos()).toHaveLength(15)
  })

  it('no elimina si se cancela la confirmación', async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false)
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos")
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0])
    expect(obtenerProductos()).toHaveLength(16)
  })

  it('lista solo los productos críticos y avisa cuando no hay', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/criticos")
    expect(screen.getByRole("alert")).toHaveTextContent("No hay productos con stock crítico.")
  })

  it('muestra los productos críticos en su listado', () => {
    actualizarProducto("PI001", { stock: 1 })
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/criticos")
    expect(screen.getByText("Mousse de Chocolate")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(2)
  })
})

describe('Admin: formulario de producto', () => {
  it('muestra errores si se envía vacío', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/nuevo")
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }))
    expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument()
    expect(screen.getAllByText("Este campo es obligatorio.").length).toBeGreaterThanOrEqual(4)
  })

  it('valida stock entero y descuento máximo en tiempo real', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/nuevo")
    await userEvent.type(screen.getByLabelText("Stock"), "1.5")
    expect(screen.getByText("Debe ser un número entero.")).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText("Descuento de oferta % (opcional)"), "150")
    expect(screen.getByText("Debe ser menor o igual a 100.")).toBeInTheDocument()
  })

  it('crea un producto nuevo y vuelve al listado', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/nuevo")
    await userEvent.type(screen.getByLabelText("Código producto"), "TX001")
    await userEvent.type(screen.getByLabelText("Nombre"), "Torta de Prueba")
    await userEvent.type(screen.getByLabelText("Precio"), "1000")
    await userEvent.type(screen.getByLabelText("Stock"), "5")
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "Tortas Especiales")
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }))
    expect(await screen.findByRole("heading", { level: 1, name: "Productos" })).toBeInTheDocument()
    expect(screen.getByText("Torta de Prueba")).toBeInTheDocument()
    expect(obtenerProductoPorCodigo("TX001").stock).toBe(5)
  })

  it('rechaza un código de producto repetido', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/nuevo")
    await userEvent.type(screen.getByLabelText("Código producto"), "TC001")
    await userEvent.type(screen.getByLabelText("Nombre"), "Otra torta")
    await userEvent.type(screen.getByLabelText("Precio"), "1000")
    await userEvent.type(screen.getByLabelText("Stock"), "5")
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "Tortas Especiales")
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }))
    expect(screen.getByRole("status")).toHaveTextContent("Ya existe un producto con ese código.")
  })

  it('carga los datos al editar y bloquea el código', async () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/TC001/editar")
    expect(screen.getByLabelText("Código producto")).toBeDisabled()
    expect(screen.getByLabelText("Nombre")).toHaveValue("Torta Cuadrada de Chocolate")
    await userEvent.clear(screen.getByLabelText("Precio"))
    await userEvent.type(screen.getByLabelText("Precio"), "47000")
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }))
    expect(await screen.findByRole("heading", { level: 1, name: "Productos" })).toBeInTheDocument()
    expect(obtenerProductoPorCodigo("TC001").precio).toBe(47000)
  })

  it('avisa si el producto a editar no existe', () => {
    iniciarSesionComo("admin@duoc.cl")
    renderAdmin("/admin/productos/NOEXISTE/editar")
    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument()
  })
})
