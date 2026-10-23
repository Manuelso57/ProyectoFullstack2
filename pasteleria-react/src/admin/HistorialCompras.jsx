import { Link, useParams } from "react-router-dom"
import { Badge, Table } from "react-bootstrap"
import { obtenerUsuarioPorCorreo, obtenerOrdenes } from "../data/datos"
import { formatearPrecio } from "../utils/formato"

function HistorialCompras() {
  const { correo } = useParams()
  const usuario = obtenerUsuarioPorCorreo(decodeURIComponent(correo))

  if (!usuario) {
    return (
      <>
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary">Volver a usuarios</Link>
      </>
    )
  }

  const compras = obtenerOrdenes().filter((orden) => orden.correoUsuario === usuario.correo)

  return (
    <>
      <h1>Historial de compras</h1>
      <p>{usuario.nombre} {usuario.apellidos} · {usuario.correo}</p>
      {compras.length === 0 ? (
        <p role="alert">Este usuario todavía no tiene compras.</p>
      ) : (
        <Table responsive className="align-middle tabla-admin">
          <thead>
            <tr><th>N° orden</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {compras.map((orden) => (
              <tr key={orden.numero}>
                <td>#{orden.numero}</td>
                <td>{new Date(orden.fecha).toLocaleString("es-CL")}</td>
                <td><Badge bg={orden.estado === "Pagada" ? "success" : "danger"}>{orden.estado}</Badge></td>
                <td>{formatearPrecio(orden.total)}</td>
                <td><Link to={"/admin/ordenes/" + orden.numero} className="btn btn-outline-primary btn-sm">Ver boleta</Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Link to="/admin/usuarios" className="btn btn-outline-primary">Volver a usuarios</Link>
    </>
  )
}

export default HistorialCompras
