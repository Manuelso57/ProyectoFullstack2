import { createContext, useContext, useState } from "react"
import { obtenerUsuarioPorCorreo, crearUsuario } from "../data/datos"

const CLAVE_SESION = "mil_sabores_sesion"
const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  const [correo, setCorreo] = useState(() => localStorage.getItem(CLAVE_SESION))
  const [, setVersion] = useState(0)
  const usuario = correo ? obtenerUsuarioPorCorreo(correo) : null

  const abrirSesion = (usuarioNuevo) => {
    localStorage.setItem(CLAVE_SESION, usuarioNuevo.correo)
    setCorreo(usuarioNuevo.correo)
  }

  const iniciarSesion = (correoIngresado, password) => {
    const encontrado = obtenerUsuarioPorCorreo(correoIngresado)
    if (!encontrado || encontrado.password !== password) return { ok: false, error: "Correo o contraseña incorrectos." }
    abrirSesion(encontrado)
    return { ok: true, usuario: encontrado }
  }

  const registrar = (datos) => {
    const resultado = crearUsuario(datos)
    if (resultado.ok) abrirSesion(resultado.usuario)
    return resultado
  }

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION)
    setCorreo(null)
  }

  const recargarUsuario = () => setVersion((v) => v + 1)

  return (
    <SesionContext.Provider value={{ usuario, iniciarSesion, registrar, cerrarSesion, recargarUsuario }}>
      {children}
    </SesionContext.Provider>
  )
}

export const useSesion = () => {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error("useSesion debe usarse dentro de SesionProvider")
  return contexto
}
