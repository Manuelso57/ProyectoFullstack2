import { describe, it, expect } from 'vitest'
import { validarRun, validarCorreo, validarCampo } from './validaciones'

describe('validarRun', () => {
  it('acepta un RUN con dígito verificador correcto', () => {
    expect(validarRun("123456785")).toBe(true)
    expect(validarRun("12.345.678-5")).toBe(true)
  })

  it('rechaza un RUN con dígito verificador incorrecto o formato inválido', () => {
    expect(validarRun("123456784")).toBe(false)
    expect(validarRun("abc")).toBe(false)
  })
})

describe('validarCorreo', () => {
  it('solo permite los dominios duoc.cl, profesor.duoc.cl y gmail.com', () => {
    expect(validarCorreo("ana@duoc.cl")).toBe(true)
    expect(validarCorreo("ana@profesor.duoc.cl")).toBe(true)
    expect(validarCorreo("ana@gmail.com")).toBe(true)
    expect(validarCorreo("ana@hotmail.com")).toBe(false)
  })
})

describe('validarCampo', () => {
  it('exige un valor cuando el campo es requerido', () => {
    expect(validarCampo("", { requerido: true })).toBe("Este campo es obligatorio.")
    expect(validarCampo("   ", { requerido: true })).toBe("Este campo es obligatorio.")
  })

  it('no valida el resto de reglas si un campo opcional está vacío', () => {
    expect(validarCampo("", { min: 5 })).toBe("")
  })

  it('valida largo mínimo y máximo', () => {
    expect(validarCampo("abc", { min: 4 })).toBe("Debe tener al menos 4 caracteres.")
    expect(validarCampo("abcdefghijk", { max: 10 })).toBe("Debe tener máximo 10 caracteres.")
    expect(validarCampo("abcde", { min: 4, max: 10 })).toBe("")
  })

  it('rechaza fechas futuras', () => {
    expect(validarCampo("2999-01-01", { fechaNoFutura: true })).toBe("La fecha no puede ser futura.")
    expect(validarCampo("2000-01-01", { fechaNoFutura: true })).toBe("")
  })

  it('compara con otro campo cuando se usa coincideCon', () => {
    expect(validarCampo("abcd", { coincideCon: "password" }, { password: "abcd" })).toBe("")
    expect(validarCampo("abce", { coincideCon: "password" }, { password: "abcd" })).toBe("Las contraseñas no coinciden.")
  })
})
