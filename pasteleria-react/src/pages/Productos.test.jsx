import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos'
import { CarritoProvider } from '../context/CarritoContext'

const mostrar = (ruta = "/productos") => render(
  <MemoryRouter initialEntries={[ruta]}>
    <CarritoProvider>
      <Productos />
    </CarritoProvider>
  </MemoryRouter>
)

describe('Página Productos', () => {
  it('renderiza los 16 productos del catálogo', () => {
    mostrar()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(16)
  })

  it('filtra al escribir en el buscador (estado del formulario)', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("Buscar producto"), "chocolate")
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
  })

  it('muestra un mensaje solo cuando no hay resultados (renderizado condicional)', async () => {
    mostrar()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    await userEvent.type(screen.getByLabelText("Buscar producto"), "zzzz")
    expect(screen.getByRole("alert")).toHaveTextContent("No se encontraron productos")
  })

  it('filtra por categoría al elegirla en el selector', async () => {
    mostrar()
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "Tortas Cuadradas")
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
  })

  it('aplica la categoría que viene en la dirección', () => {
    mostrar("/productos?categoria=Productos%20Vegana")
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
  })
})
