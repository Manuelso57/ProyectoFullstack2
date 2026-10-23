import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompraExitosa from './CompraExitosa'
import PagoError from './PagoError'
import { crearOrdenDePrueba } from '../testUtils'

const mostrar = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <Routes>
      <Route path="/compra-exitosa/:numero" element={<CompraExitosa />} />
      <Route path="/pago-error/:numero" element={<PagoError />} />
    </Routes>
  </MemoryRouter>
)

describe('Página CompraExitosa', () => {
  it('muestra el número de orden, los datos del cliente y el total pagado', () => {
    const orden = crearOrdenDePrueba()
    mostrar("/compra-exitosa/" + orden.numero)
    expect(screen.getByRole("heading", { level: 2, name: /Se ha realizado la compra/ })).toHaveTextContent("#" + orden.numero)
    expect(screen.getByText("Código orden: " + orden.codigo)).toBeInTheDocument()
    expect(screen.getByDisplayValue("Pedro")).toBeInTheDocument()
    expect(screen.getByText("Total pagado: $72.000")).toBeInTheDocument()
  })

  it('llama a la impresión del navegador al pedir la boleta en PDF', async () => {
    const imprimir = vi.spyOn(window, "print").mockImplementation(() => {})
    const orden = crearOrdenDePrueba()
    mostrar("/compra-exitosa/" + orden.numero)
    await userEvent.click(screen.getByRole("button", { name: "Imprimir boleta en PDF" }))
    expect(imprimir).toHaveBeenCalledTimes(1)
  })

  it('confirma el envío de la boleta por correo (simulado)', async () => {
    const orden = crearOrdenDePrueba()
    mostrar("/compra-exitosa/" + orden.numero)
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Enviar boleta por email" }))
    expect(screen.getByRole("status")).toHaveTextContent("Boleta enviada a pedro@gmail.com")
  })

  it('avisa si la orden no existe', () => {
    mostrar("/compra-exitosa/000")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Orden no encontrada")
  })
})

describe('Página PagoError', () => {
  it('informa el error y ofrece volver a pagar', () => {
    const orden = crearOrdenDePrueba({ estado: "Pago rechazado" })
    mostrar("/pago-error/" + orden.numero)
    expect(screen.getByRole("heading", { level: 2, name: /No se pudo realizar el pago/ })).toHaveTextContent("nro #" + orden.numero)
    expect(screen.getByRole("link", { name: "VOLVER A REALIZAR EL PAGO" })).toHaveAttribute("href", "/checkout")
    expect(screen.getByDisplayValue("Pedro")).toBeInTheDocument()
  })

  it('avisa si la orden no existe', () => {
    mostrar("/pago-error/000")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Orden no encontrada")
  })
})
