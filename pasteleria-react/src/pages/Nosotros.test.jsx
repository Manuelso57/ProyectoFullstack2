import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Nosotros from './Nosotros'

describe('Página Nosotros', () => {
  it('presenta a la empresa con su misión y su visión', () => {
    render(<Nosotros />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Somos Pastelería Mil Sabores")
    expect(screen.getByRole("heading", { name: "Misión" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Visión" })).toBeInTheDocument()
  })
})
