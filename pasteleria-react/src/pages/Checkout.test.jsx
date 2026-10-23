import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Checkout from './Checkout'
import { CarritoProvider } from '../context/CarritoContext'
import { SesionProvider } from '../context/SesionContext'
import { procesarPago } from '../servicios/pago'
import { obtenerOrdenes, obtenerProductoPorCodigo, crearUsuario } from '../data/datos'

vi.mock('../servicios/pago', () => ({ procesarPago: vi.fn() }))

const mostrar = () => render(
  <MemoryRouter initialEntries={["/checkout"]}>
    <SesionProvider>
      <CarritoProvider>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa/:numero" element={<p>Compra exitosa</p>} />
          <Route path="/pago-error/:numero" element={<p>Pago con error</p>} />
        </Routes>
      </CarritoProvider>
    </SesionProvider>
  </MemoryRouter>
)

const llenarDatos = async () => {
  const datos = { Nombre: "Pedro", Apellidos: "Soto", Correo: "pedro@gmail.com", Calle: "Los Crisantemos 12", "Región": "Metropolitana", Comuna: "Cerrillos" }
  for (const [etiqueta, valor] of Object.entries(datos)) {
    await userEvent.type(screen.getByLabelText(etiqueta), valor)
  }
}

beforeEach(() => {
  procesarPago.mockReset()
  localStorage.setItem("mil_sabores_carrito", JSON.stringify([{ codigo: "TC001", cantidad: 1 }]))
})

describe('Página Checkout', () => {
  it('rellena los datos automáticamente cuando hay una sesión iniciada', () => {
    crearUsuario({ nombre: "Ana", apellidos: "Soto", run: "123456785", correo: "ana@gmail.com", password: "abcd", region: "Metropolitana", comuna: "Ñuñoa", direccion: "Calle 5" })
    localStorage.setItem("mil_sabores_sesion", "ana@gmail.com")
    mostrar()
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana")
    expect(screen.getByLabelText("Calle")).toHaveValue("Calle 5")
    expect(screen.getByLabelText("Comuna")).toHaveValue("Ñuñoa")
  })

  it('no procesa el pago si faltan datos obligatorios', async () => {
    mostrar()
    await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }))
    expect(procesarPago).not.toHaveBeenCalled()
    expect(screen.getByRole("status")).toHaveTextContent("Revisa los campos marcados en rojo")
  })

  it('con pago aprobado crea la orden, descuenta stock y vacía el carrito', async () => {
    procesarPago.mockResolvedValue({ aprobado: true })
    mostrar()
    await llenarDatos()
    await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }))
    expect(await screen.findByText("Compra exitosa")).toBeInTheDocument()
    expect(procesarPago).toHaveBeenCalledWith({ total: 36000, resultado: "aprobado" })
    expect(obtenerOrdenes()[0].estado).toBe("Pagada")
    expect(obtenerProductoPorCodigo("TC001").stock).toBe(19)
    expect(JSON.parse(localStorage.getItem("mil_sabores_carrito"))).toEqual([])
  })

  it('con pago rechazado guarda la orden, conserva el carrito y no toca el stock', async () => {
    procesarPago.mockResolvedValue({ aprobado: false })
    mostrar()
    await llenarDatos()
    await userEvent.selectOptions(screen.getByLabelText("Simulación de pago"), "rechazado")
    await userEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }))
    expect(await screen.findByText("Pago con error")).toBeInTheDocument()
    expect(procesarPago).toHaveBeenCalledWith({ total: 36000, resultado: "rechazado" })
    expect(obtenerOrdenes()[0].estado).toBe("Pago rechazado")
    expect(obtenerProductoPorCodigo("TC001").stock).toBe(20)
    expect(JSON.parse(localStorage.getItem("mil_sabores_carrito"))).toHaveLength(1)
  })
})
