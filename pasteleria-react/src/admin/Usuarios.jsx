import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Badge, Button, Table } from "react-bootstrap"
import { useSesion } from "../context/SesionContext"
import { obtenerUsuarios, eliminarUsuario } from "../data/datos"

function Usuarios() {
  const { usuario: actual } = useSesion()
  const [, setVersion] = useState(0)
  const [error, setError] = useState("")
  const usuarios = obtenerUsuarios()

  const eliminar = (usuario) => {
    if (usuario.correo === actual.correo) {
      setError("No puedes eliminar tu propia cuenta.")
      return
    }
    if (!window.confirm("¿Eliminar al usuario " + usuario.correo + "?")) return
    eliminarUsuario(usuario.correo)
    setError("")
    setVersion((v) => v + 1)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">Nuevo usuario</Link>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Table responsive className="align-middle tabla-admin">
        <thead>
          <tr><th>Nombre</th><th>RUN</th><th>Correo</th><th>Tipo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.correo}>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.run}</td>
              <td>{usuario.correo}</td>
              <td><Badge bg="secondary">{usuario.tipo}</Badge></td>
              <td className="d-flex flex-wrap gap-2">
                <Link to={"/admin/usuarios/" + encodeURIComponent(usuario.correo) + "/editar"} className="btn btn-outline-primary btn-sm">Editar</Link>
                <Link to={"/admin/usuarios/" + encodeURIComponent(usuario.correo) + "/historial"} className="btn btn-outline-primary btn-sm">Historial de compras</Link>
                <Button variant="danger" size="sm" onClick={() => eliminar(usuario)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Usuarios
