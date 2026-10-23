import { describe, it, expect } from 'vitest'
import { calcularEdad, esCorreoDuoc, esCumpleanosHoy, obtenerDescuentoUsuario, calcularResumen } from './descuentos'

const hoy = new Date(2026, 4, 10)
const torta = { codigo: "TE001", precio: 55000 }
const otra = { codigo: "TC001", precio: 45000 }

describe('descuentos', () => {
  it('calcula la edad considerando si ya cumplió años', () => {
    expect(calcularEdad("1976-05-10", hoy)).toBe(50)
    expect(calcularEdad("1976-05-11", hoy)).toBe(49)
    expect(calcularEdad("", hoy)).toBeNull()
  })

  it('detecta correos institucionales de Duoc', () => {
    expect(esCorreoDuoc("ana@duoc.cl")).toBe(true)
    expect(esCorreoDuoc("ana@gmail.com")).toBe(false)
  })

  it('detecta el cumpleaños comparando día y mes', () => {
    expect(esCumpleanosHoy("2000-05-10", hoy)).toBe(true)
    expect(esCumpleanosHoy("2000-05-11", hoy)).toBe(false)
  })

  it('da 50% a mayores de 50 años y 10% con el código FELICES50', () => {
    expect(obtenerDescuentoUsuario({ fechaNacimiento: "1970-01-01" }, hoy).porcentaje).toBe(50)
    expect(obtenerDescuentoUsuario({ fechaNacimiento: "2000-01-01", codigoFelices50: true }, hoy).porcentaje).toBe(10)
    expect(obtenerDescuentoUsuario({ fechaNacimiento: "2000-01-01" }, hoy).porcentaje).toBe(0)
    expect(obtenerDescuentoUsuario(null, hoy).porcentaje).toBe(0)
  })

  it('calcula el total sin descuentos para un visitante', () => {
    const resumen = calcularResumen([{ producto: otra, cantidad: 2 }], null, hoy)
    expect(resumen.subtotal).toBe(90000)
    expect(resumen.total).toBe(90000)
  })

  it('aplica el descuento porcentual al subtotal', () => {
    const usuario = { correo: "a@gmail.com", fechaNacimiento: "1950-01-01" }
    const resumen = calcularResumen([{ producto: otra, cantidad: 2 }], usuario, hoy)
    expect(resumen.descuento.monto).toBe(45000)
    expect(resumen.total).toBe(45000)
  })

  it('regala la torta de cumpleaños a estudiantes Duoc el día de su cumpleaños', () => {
    const usuario = { correo: "ana@duoc.cl", fechaNacimiento: "2000-05-10" }
    const resumen = calcularResumen([{ producto: torta, cantidad: 1 }, { producto: otra, cantidad: 1 }], usuario, hoy)
    expect(resumen.tortaGratis.elegible).toBe(true)
    expect(resumen.tortaGratis.monto).toBe(55000)
    expect(resumen.total).toBe(45000)
  })

  it('no la regala si ya la reclamó este año o el correo no es de Duoc', () => {
    const reclamada = { correo: "ana@duoc.cl", fechaNacimiento: "2000-05-10", tortaGratisAnio: 2026 }
    expect(calcularResumen([{ producto: torta, cantidad: 1 }], reclamada, hoy).tortaGratis.monto).toBe(0)
    const externo = { correo: "ana@gmail.com", fechaNacimiento: "2000-05-10" }
    expect(calcularResumen([{ producto: torta, cantidad: 1 }], externo, hoy).tortaGratis.elegible).toBe(false)
  })

  it('usa el precio de oferta de los productos al calcular el subtotal', () => {
    const enOferta = { codigo: "TC001", precio: 50000, descuentoOferta: 20 }
    const resumen = calcularResumen([{ producto: enOferta, cantidad: 2 }], null, hoy)
    expect(resumen.subtotal).toBe(80000)
    expect(resumen.total).toBe(80000)
  })
})
