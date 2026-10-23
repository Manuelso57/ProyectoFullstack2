import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Carrito from './Carrito'
import { CarritoProvider } from '../context/CarritoContext'
import { SesionProvider } from '../context/SesionContext'
import { crearUsuario } from '../data/datos'

const cargarCarrito = (items) => localStorage.setItem("mil_sabores_carrito", JSON.stringify(items))

const iniciarComo = (datos) => {
  crearUsuario({ nombre: "Ana", apellidos: "Soto", run: "123456785", password: "abcd", region: "RM", comuna: "Santiago", direccion: "Calle 1", ...datos })
  localStorage.setItem("mil_sabores_sesion", datos.correo)
}

const mostrar = () => render(
  <MemoryRouter>
    <SesionProvider>
      <CarritoProvider>
        <Carrito />
      </CarritoProvider>
    </SesionProvider>
  </MemoryRouter>
)

afterEach(() => vi.useRealTimers())

describe('Página Carrito', () => {
  it('muestra un mensaje cuando el carrito está vacío', () => {
    mostrar()
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument()
  })

  it('lista los productos con su subtotal y el total', () => {
    cargarCarrito([{ codigo: "TC001", cantidad: 2 }])
    mostrar()
    expect(screen.getByText("Torta Cuadrada de Chocolate")).toBeInTheDocument()
    expect(screen.getAllByText("$72.000").length).toBeGreaterThanOrEqual(2)
  })

  it('suma una unidad al hacer clic en +', async () => {
    cargarCarrito([{ codigo: "TC001", cantidad: 1 }])
    mostrar()
    await userEvent.click(screen.getByRole("button", { name: "Sumar Torta Cuadrada de Chocolate" }))
    expect(screen.getByLabelText("Cantidad Torta Cuadrada de Chocolate")).toHaveValue(2)
  })

  it('elimina un producto y vuelve al estado vacío', async () => {
    cargarCarrito([{ codigo: "TC001", cantidad: 1 }])
    mostrar()
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }))
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument()
  })

  it('aplica el descuento del 50% a un usuario mayor de 50 años', () => {
    iniciarComo({ correo: "mayor@gmail.com", fechaNacimiento: "1950-01-01" })
    cargarCarrito([{ codigo: "TC001", cantidad: 2 }])
    mostrar()
    expect(screen.getByText("Descuento (Mayor de 50 años, 50%)")).toBeInTheDocument()
    expect(screen.getByText("-$36.000")).toBeInTheDocument()
  })

  it('ofrece la torta gratis a un estudiante Duoc el día de su cumpleaños', () => {
    vi.setSystemTime(new Date(2026, 4, 10, 12))
    iniciarComo({ correo: "alumno@duoc.cl", fechaNacimiento: "2000-05-10" })
    cargarCarrito([{ codigo: "PI001", cantidad: 1 }])
    mostrar()
    expect(screen.getByRole("button", { name: "Agregar torta gratis" })).toBeInTheDocument()
  })

  it('descuenta la torta cuando ya está en el carrito', () => {
    vi.setSystemTime(new Date(2026, 4, 10, 12))
    iniciarComo({ correo: "alumno@duoc.cl", fechaNacimiento: "2000-05-10" })
    cargarCarrito([{ codigo: "TE001", cantidad: 1 }])
    mostrar()
    expect(screen.getByText("Torta de cumpleaños gratis (Duoc)")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Agregar torta gratis" })).not.toBeInTheDocument()
  })
})
