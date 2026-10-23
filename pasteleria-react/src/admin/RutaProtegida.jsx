import { Navigate } from "react-router-dom"
import { useSesion } from "../context/SesionContext"

function RutaProtegida({ roles, redirigirA = "/", children }) {
  const { usuario } = useSesion()
  if (!usuario) return <Navigate to="/login" replace />
  if (!roles.includes(usuario.tipo)) return <Navigate to={redirigirA} replace />
  return children
}

export default RutaProtegida
