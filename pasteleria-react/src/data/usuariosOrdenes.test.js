import { describe, it, expect } from 'vitest'
import { obtenerUsuarios, obtenerUsuarioPorCorreo, crearUsuario, actualizarUsuario, eliminarUsuario, crearOrden, obtenerOrdenes, obtenerOrdenPorNumero, descontarStock, obtenerProductoPorCodigo } from './datos'

const usuario = { nombre: "Ana", apellidos: "Soto", run: "123456785", correo: "Ana@Duoc.cl", password: "abcd", region: "RM", comuna: "Santiago", direccion: "Calle 1" }

describe('datos: usuarios', () => {
  it('siempre incluye al administrador de prueba', () => {
    expect(obtenerUsuarioPorCorreo("admin@duoc.cl").tipo).toBe("Administrador")
  })

  it('crea un usuario con correo en minúsculas y tipo Cliente', () => {
    const resultado = crearUsuario(usuario)
    expect(resultado.ok).toBe(true)
    expect(resultado.usuario.correo).toBe("ana@duoc.cl")
    expect(resultado.usuario.tipo).toBe("Cliente")
  })

  it('rechaza correos o RUN repetidos', () => {
    crearUsuario(usuario)
    expect(crearUsuario(usuario).ok).toBe(false)
    expect(crearUsuario({ ...usuario, correo: "otra@duoc.cl" }).error).toMatch(/RUN/)
  })

  it('actualiza y elimina usuarios', () => {
    crearUsuario(usuario)
    actualizarUsuario("ana@duoc.cl", { tipo: "Administrador" })
    expect(obtenerUsuarioPorCorreo("ana@duoc.cl").tipo).toBe("Administrador")
    expect(eliminarUsuario("ana@duoc.cl").ok).toBe(true)
    expect(obtenerUsuarioPorCorreo("ana@duoc.cl")).toBeNull()
    expect(obtenerUsuarios().length).toBe(1)
  })
})

describe('datos: órdenes y stock', () => {
  it('numera las órdenes del día en forma correlativa', () => {
    const primera = crearOrden({ total: 1000 })
    const segunda = crearOrden({ total: 2000 })
    expect(primera.numero).toMatch(/^\d{8}01$/)
    expect(segunda.numero).toMatch(/^\d{8}02$/)
    expect(obtenerOrdenes()).toHaveLength(2)
    expect(obtenerOrdenPorNumero(primera.numero).codigo).toBe("ORDER" + primera.numero)
  })

  it('descuenta el stock sin dejarlo bajo cero', () => {
    descontarStock([{ codigo: "TE001", cantidad: 4 }])
    expect(obtenerProductoPorCodigo("TE001").stock).toBe(6)
    descontarStock([{ codigo: "TE001", cantidad: 100 }])
    expect(obtenerProductoPorCodigo("TE001").stock).toBe(0)
  })
})
