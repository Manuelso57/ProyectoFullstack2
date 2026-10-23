import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto'

describe('Página Contacto', () => {
  it('exige el nombre y el mensaje al enviar vacío', async () => {
    render(<Contacto />)
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }))
    expect(screen.getAllByText("Este campo es obligatorio.")).toHaveLength(2)
    expect(screen.getByRole("status")).toHaveTextContent("Revisa los campos marcados en rojo")
  })

  it('valida el dominio del correo en tiempo real', async () => {
    render(<Contacto />)
    await userEvent.type(screen.getByLabelText("Correo"), "ana@hotmail.com")
    expect(screen.getByText("Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.")).toBeInTheDocument()
  })

  it('envía el mensaje y limpia el formulario', async () => {
    render(<Contacto />)
    await userEvent.type(screen.getByLabelText("Nombre completo"), "Ana Soto")
    await userEvent.type(screen.getByLabelText("Mensaje"), "Quiero una torta de boda")
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }))
    expect(screen.getByRole("status")).toHaveTextContent("Tu mensaje fue enviado correctamente.")
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("")
    expect(screen.getByLabelText("Mensaje")).toHaveValue("")
  })
})
