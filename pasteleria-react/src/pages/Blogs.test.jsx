import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Blogs from './Blogs'
import BlogDetalle from './BlogDetalle'

const mostrar = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <Routes>
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetalle />} />
    </Routes>
  </MemoryRouter>
)

describe('Blogs', () => {
  it('lista los dos blogs con un enlace a su detalle', () => {
    mostrar("/blogs")
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2)
    const enlaces = screen.getAllByRole("link", { name: "Ver más" })
    expect(enlaces[0]).toHaveAttribute("href", "/blogs/1")
    expect(enlaces[1]).toHaveAttribute("href", "/blogs/2")
  })

  it('navega al detalle al hacer clic en Ver más', async () => {
    mostrar("/blogs")
    await userEvent.click(screen.getAllByRole("link", { name: "Ver más" })[0])
    expect(screen.getByRole("heading", { level: 1, name: "El día que hicimos historia con Guinness" })).toBeInTheDocument()
  })

  it('muestra todos los párrafos del blog pedido', () => {
    mostrar("/blogs/2")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sin gluten y sin azúcar")
    expect(document.querySelectorAll(".detalle-blog p")).toHaveLength(4)
  })

  it('avisa cuando el blog no existe', () => {
    mostrar("/blogs/99")
    expect(screen.getByText("Blog no encontrado")).toBeInTheDocument()
  })
})
