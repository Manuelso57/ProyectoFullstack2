import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Categorias from './Categorias'
import { CarritoProvider } from '../context/CarritoContext'

const mostrar = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <CarritoProvider>
      <Routes>
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:nombre" element={<Categorias />} />
      </Routes>
    </CarritoProvider>
  </MemoryRouter>
)

describe('Página Categorías', () => {
  it('muestra una sección por cada una de las 8 categorías', () => {
    mostrar("/categorias")
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(8)
    expect(screen.getAllByRole("link", { name: /Tortas|Postres|Productos|Pastelería/ }).length).toBeGreaterThanOrEqual(8)
  })

  it('muestra solo los productos de la categoría elegida', () => {
    mostrar("/categorias/Tortas%20Circulares")
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1)
    expect(screen.getByText("Torta Circular de Vainilla")).toBeInTheDocument()
    expect(screen.queryByText("Torta Cuadrada de Chocolate")).not.toBeInTheDocument()
  })

  it('avisa cuando la categoría no existe', () => {
    mostrar("/categorias/Inexistente")
    expect(screen.getByRole("alert")).toHaveTextContent("no existe")
  })
})
