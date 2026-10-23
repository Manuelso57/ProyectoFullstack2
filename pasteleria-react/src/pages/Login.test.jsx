import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import { SesionProvider } from '../context/SesionContext'
import { crearUsuario } from '../data/datos'

const mostrar = () => render(
  <MemoryRouter initialEntries={["/login"]}>
    <SesionProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
        <Route path="/admin" element={<p>Panel de administración</p>} />
      </Routes>
    </SesionProvider>
  </MemoryRouter>
)

describe('Página Login', () => {
  it('muestra un error en tiempo real si el correo no es de un dominio permitido', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "ana@hotmail.com")
    expect(screen.getByText("Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.")).toBeInTheDocument()
  })

  it('avisa si la contraseña tiene menos de 4 caracteres', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("Contraseña"), "abc")
    expect(screen.getByText("Debe tener al menos 4 caracteres.")).toBeInTheDocument()
  })

  it('no inicia sesión con credenciales incorrectas', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "admin@duoc.cl")
    await userEvent.type(screen.getByLabelText("Contraseña"), "equivocada")
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }))
    expect(screen.getByRole("status")).toHaveTextContent("Correo o contraseña incorrectos.")
  })

  it('lleva al panel de administración cuando entra un administrador', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "admin@duoc.cl")
    await userEvent.type(screen.getByLabelText("Contraseña"), "admin123")
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }))
    expect(await screen.findByText("Panel de administración")).toBeInTheDocument()
  })

  it('lleva al inicio cuando entra un cliente', async () => {
    crearUsuario({ nombre: "Ana", apellidos: "Soto", run: "123456785", correo: "ana@gmail.com", password: "abcd", region: "RM", comuna: "Santiago", direccion: "Calle 1" })
    mostrar()
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "ana@gmail.com")
    await userEvent.type(screen.getByLabelText("Contraseña"), "abcd")
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }))
    expect(await screen.findByText("Pantalla de inicio")).toBeInTheDocument()
  })
})
