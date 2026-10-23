import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from './Registro'
import { SesionProvider } from '../context/SesionContext'
import { obtenerUsuarioPorCorreo } from '../data/datos'

const mostrar = () => render(
  <MemoryRouter initialEntries={["/registro"]}>
    <SesionProvider>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </SesionProvider>
  </MemoryRouter>
)

const llenar = async (valores) => {
  for (const [etiqueta, valor] of Object.entries(valores)) {
    await userEvent.type(screen.getByLabelText(etiqueta), valor)
  }
}

const completos = { Nombre: "Ana", Apellidos: "Soto", RUN: "123456785", "Correo electrónico": "ana@duoc.cl", "Contraseña": "abcd", "Confirmar contraseña": "abcd", "Región": "Metropolitana", Comuna: "Santiago", "Dirección": "Calle 1 #123" }

describe('Página Registro', () => {
  it('valida el RUN mientras se escribe', async () => {
    mostrar()
    await userEvent.type(screen.getByLabelText("RUN"), "123456784")
    expect(screen.getByText("RUN inválido. Verifica el dígito verificador.")).toBeInTheDocument()
  })

  it('avisa cuando las contraseñas no coinciden', async () => {
    mostrar()
    await llenar({ "Contraseña": "abcd", "Confirmar contraseña": "abce" })
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeInTheDocument()
  })

  it('no envía el formulario con campos obligatorios vacíos', async () => {
    mostrar()
    await userEvent.click(screen.getByRole("button", { name: "Registrarme" }))
    expect(screen.getByRole("status")).toHaveTextContent("Revisa los campos marcados en rojo")
    expect(screen.queryByText("Pantalla de inicio")).not.toBeInTheDocument()
  })

  it('registra al usuario, guarda el código FELICES50 y lo lleva al inicio', async () => {
    mostrar()
    await llenar({ ...completos, "Código de descuento (opcional)": "felices50" })
    await userEvent.click(screen.getByRole("button", { name: "Registrarme" }))
    expect(await screen.findByText("Pantalla de inicio")).toBeInTheDocument()
    const guardado = obtenerUsuarioPorCorreo("ana@duoc.cl")
    expect(guardado.tipo).toBe("Cliente")
    expect(guardado.codigoFelices50).toBe(true)
  })
})
